import type { AppError } from "@errors";
import type { Result } from "neverthrow";
import { type Env, getDefaultEnv, loadEnv } from "./env";
import { type Flags, loadFlags } from "./flags";

export type AppConfig = {
  readonly env: Env;
  readonly flags: Flags;
};

export const loadConfig = (): Result<AppConfig, AppError> =>
  loadEnv().map((env) => ({
    env,
    flags: loadFlags(),
  }));
export { getDefaultEnv };
