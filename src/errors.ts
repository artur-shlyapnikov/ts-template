import type { AppLogger } from "@logging";

type ConfigError = {
  readonly type: "ConfigError";
  readonly message: string;
};

type StartupError = {
  readonly type: "StartupError";
  readonly message: string;
  readonly cause?: unknown;
};

type RuntimeError = {
  readonly type: "RuntimeError";
  readonly message: string;
  readonly cause?: unknown;
};

export type AppError = ConfigError | StartupError | RuntimeError;

export const configError = (message: string): ConfigError => ({
  type: "ConfigError",
  message,
});

const hasCause = (error: AppError): error is StartupError | RuntimeError =>
  "cause" in error && typeof error.cause !== "undefined";

export const logErr = (logger: AppLogger, err: AppError): void => {
  const payload = hasCause(err) ? { err, cause: err.cause } : { err };

  switch (err.type) {
    case "StartupError": {
      logger.fatal(payload, err.message);
      return;
    }
    case "RuntimeError": {
      logger.error(payload, err.message);
      return;
    }
    default: {
      logger.warn(payload, err.message);
    }
  }
};
