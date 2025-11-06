import { type AppError, configError } from "@errors";
import { err, ok, type Result } from "neverthrow";
import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  PORT: z.coerce.number().int().min(0).max(65535).default(3000),
});

export type Env = z.infer<typeof EnvSchema>;

const formatIssues = (schemaIssues: z.ZodIssue[]): string =>
  schemaIssues
    .map((issue) => {
      const path = issue.path.join(".") || "env";
      return `${path}: ${issue.message}`;
    })
    .join("; ");

export const getDefaultEnv = (): Env => EnvSchema.parse({});

export const loadEnv = (): Result<Env, AppError> => {
  const parsed = EnvSchema.safeParse(process.env);

  if (!parsed.success) {
    return err(configError(formatIssues(parsed.error.issues)));
  }

  return ok(parsed.data);
};
