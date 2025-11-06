import { type AppConfig, getDefaultEnv, loadConfig } from "@config/index";
import { type AppError, logErr } from "@errors";
import { type AppLogger, createLogger, withFields } from "@logging";
import type { Result } from "neverthrow";

export type AppContext = {
  readonly config: AppConfig;
  readonly logger: AppLogger;
};

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
