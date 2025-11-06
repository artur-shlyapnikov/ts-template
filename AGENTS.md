# Repository Guidelines

## Main Rules

Prefer simplicity.
Functional Core, Imperative Shell.

After changing the source code, run the tests, selecting only those that will verify your changes.

## Project Structure & Module Organization

- `src/` holds runtime source with typed boundaries (`config`, `errors`, `logger`, `index.ts`), plus unit specs in `src/index.test.ts`.
- `scripts/` contains Bun-powered utilities such as `env/check.ts` and `env/print.ts`.
- `docs/` captures architecture decisions (`decisions.md`).
- Build artifacts land in `dist/`; tooling ignores `coverage/` and `node_modules/`.

## Build, Test, and Development Commands

- `make install` – install dependencies (Bun 1.3.1+).
- `make build` – compile `src/index.ts` into `dist/`.
- `make check` – run `typecheck`, `lint`, and `deadcode` in a single gate.
- `make ci` – deterministic `build`, `check`, and `test`; mirrors CI pipelines.
- `bun run logs:pretty` – launch with pretty logging for local debugging.
- `bun run env:check` / `bun run env:print` – validate or inspect runtime config.

## Coding Style & Naming Conventions

- Imports use aliases (`@config/*`, `@errors`, `@logging`) to avoid deep relatives.
- Formatting and linting: `bunx biome check` and `bunx eslint "{src,scripts}/**/*.ts"`.
- Enforce Biome `useConst`, `noDefaultExport`, and typescript-eslint explicit module boundaries; prefer `type` aliases for object shapes.
- Prefer `neverthrow` `Result` pipelines; wrap thrown errors as `Result.err` and surface them via `logErr` instead of adding `try/catch`.

## Testing Guidelines

- Before implementing tests, start with the test design step. First, check the happy paths, and only then the edge cases.
- Framework: `bun test`; keep tests alongside sources (`*.test.ts`).
- Name specs after the unit under test (e.g., `index.test.ts`) and use Behavior-style `describe` blocks.

## Security & Configuration Tips

- Feature flags live under `FEATURE_*`; update `src/config/flags.ts` for new toggles and mirror in docs.
- Secrets never enter logs: rely on `createLogger` + `withFields` helpers to preserve redaction.
- Keep `renovate.json` policies aligned with Bun/pino/zod ecosystem; auto-merged prod patches expect passing `make ci`.
