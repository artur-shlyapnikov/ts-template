# TypeScript Template

Bun + strict TypeScript starter with neverthrow ergonomics, Zod-configured envs, pino logging, and Renovate/Security guard rails.

- Quick start: `bun install`, `make ci`, `bun run logs:pretty`.
- Tooling stack: Biome, typescript-eslint (no try/catch), Knip, Bun test (70% coverage), lint-staged + simple-git-hooks.
- Decisions: Results enforce explicit boundaries, logger is redacted + contextual, config flows through `loadConfig`, CI hinges on `make check` → `make ci`.
- DX helpers: `bun run env:print` to inspect resolved config; `bun run env:check` for CI validation; `bun run logs:pretty` for readable local output.

Deeper rationale lives in `docs/decisions.md`.
