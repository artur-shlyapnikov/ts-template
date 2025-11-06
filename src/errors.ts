import type { AppLogger } from "@logging";

export type ConfigError = {
  readonly type: "ConfigError";
  readonly message: string;
};

export type StartupError = {
  readonly type: "StartupError";
  readonly message: string;
  readonly cause?: unknown;
};

export type RuntimeError = {
  readonly type: "RuntimeError";
  readonly message: string;
  readonly cause?: unknown;
};

export type AppError = ConfigError | StartupError | RuntimeError;

export const configError = (message: string): ConfigError => ({
  type: "ConfigError",
  message,
});

export const startupError = (message: string, cause?: unknown): StartupError => ({
  type: "StartupError",
  message,
  cause,
});

export const runtimeError = (message: string, cause?: unknown): RuntimeError => ({
  type: "RuntimeError",
  message,
  cause,
});

const hasCause = (error: AppError): error is StartupError | RuntimeError =>
  "cause" in error && typeof (error as StartupError | RuntimeError).cause !== "undefined";

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
    case "ConfigError":
    default: {
      logger.warn(payload, err.message);
    }
  }
};
