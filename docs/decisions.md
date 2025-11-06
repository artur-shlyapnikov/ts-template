# Decisions & Invariants

The template stays simple by keeping boundaries explicit, logging trustworthy, config centralized, and CI mirrored locally.

## Neverthrow Boundaries

- Public entrypoints return `Result` values and surface only `AppError` unions. Convert thrown errors to `Result.err` and pass them through `logErr`.
- Avoid ad-hoc `try/catch` inside features; boundary adapters unwrap results instead.

## Logging Discipline

- `src/logger.ts` seeds pino with service/version/pid fields and redacts tokens, passwords, and auth headers by default.
- Always derive child loggers via `withFields`; spinning up raw pino instances bypasses redaction standards.

## Config Layering

- `loadEnv` (Zod) + `loadFlags` feed `loadConfig`, producing the injected context. Resist direct `process.env` reads or untyped flag parsing.

## CI Gates

- `make check` aggregates type, lint, and dead-code sweeps; `make ci` adds build + test for parity with automation.
- Keep CI scripts calling these phony targets so pipelines and laptops enforce identical safety nets.
