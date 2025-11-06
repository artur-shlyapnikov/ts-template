import type { Result } from "neverthrow";
import { type AppConfig, getDefaultEnv, loadConfig } from "./config/index";
import { type AppError, logErr } from "./errors";
import { type AppLogger, createLogger, withFields } from "./logger";

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
      withFields(bootstrapLogger, { error: error.message }).error(
        "Application failed to initialize",
      );
      logErr(bootstrapLogger, error);
      // also emit a plain stderr line for test harnesses that capture process output
      process.stderr.write(`Application failed to initialize: ${error.message}\n`);
      process.exitCode = 1;
    },
  );
};

if (import.meta.main) {
  run();
}
