import type { Result } from "neverthrow";
import { loadEnv, type Env, getDefaultEnv } from "./env";
import { loadFlags, type Flags } from "./flags";
import type { AppError } from "@errors";

export interface AppConfig {
  readonly env: Env;
  readonly flags: Flags;
}

export const loadConfig = (): Result<AppConfig, AppError> =>
  loadEnv().map((env) => ({
    env,
    flags: loadFlags(),
  }));

export { loadEnv, loadFlags, getDefaultEnv };
export type { Env, Flags };
