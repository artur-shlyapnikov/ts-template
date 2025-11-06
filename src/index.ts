import type { Result } from "neverthrow";
import { type Env, loadEnv } from "./config/env";
import { type AppLogger, createLogger } from "./logger";

export interface AppContext {
  env: Env;
  logger: AppLogger;
}

export const initialize = (): Result<AppContext, string> =>
  loadEnv().map((env) => ({
    env,
    logger: createLogger(env),
  }));

export const run = (): void => {
  initialize().match(
    ({ env, logger }) => {
      logger.info(
        {
          environment: env.NODE_ENV,
          port: env.PORT,
        },
        "Application initialized",
      );
    },
    (error) => {
      console.error("Configuration error", { error });
      process.exitCode = 1;
    },
  );
};

if (import.meta.main) {
  run();
}
