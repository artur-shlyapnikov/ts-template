import type { Result } from "neverthrow";
import { createLogger, type AppLogger, withFields } from "@logging";
import { getDefaultEnv, loadConfig, type AppConfig } from "@config/index";
import { logErr, type AppError } from "@errors";

export interface AppContext {
  readonly config: AppConfig;
  readonly logger: AppLogger;
}

export const initialize = (): Result<AppContext, AppError> =>
  loadConfig().map((config) => {
    const baseLogger = createLogger(config.env);
    const logger = withFields(baseLogger, { environment: config.env.NODE_ENV });

    return {
      config,
      logger,
    };
  });

export const run = (): void => {
  const bootstrapLogger = createLogger(getDefaultEnv());

  initialize().match(
    ({ config, logger }) => {
      logger.info(
        {
          environment: config.env.NODE_ENV,
          port: config.env.PORT,
          flags: config.flags,
        },
        "Application initialized",
      );
    },
    (error) => {
      console.error("Application failed to initialize", { error });
      logErr(bootstrapLogger, error);
      process.exitCode = 1;
    },
  );
};

if (import.meta.main) {
  run();
}
