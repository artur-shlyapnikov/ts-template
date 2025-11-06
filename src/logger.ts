import { pino, type Logger, type LoggerOptions } from "pino";
import type { Env } from "@config/env";

export type AppLogger = Logger;

const resolveTransport = (env: Env): LoggerOptions["transport"] => {
  if (env.NODE_ENV !== "development") {
    return undefined;
  }

  return {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
    },
  };
};

const runtimeVersion = (): string =>
  typeof Bun !== "undefined" ? Bun.version : process.version;

const serializeError = (error: unknown) => {
  if (error instanceof Error) {
    return {
      type: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return error;
};

const buildOptions = (env: Env): LoggerOptions => {
  const transport = resolveTransport(env);

  const options: LoggerOptions = {
    level: env.LOG_LEVEL,
    base: {
      service: "ts-template",
      pid: process.pid,
      version: runtimeVersion(),
    },
    serializers: {
      err: serializeError,
    },
    redact: {
      paths: ["req.headers.authorization", "*.token", "*.password"],
      remove: true,
    },
  };

  if (transport !== undefined) {
    options.transport = transport;
  }

  return options;
};

export const createLogger = (env: Env): AppLogger => pino(buildOptions(env));

export const withFields = (logger: AppLogger, fields: Record<string, unknown>): AppLogger =>
  logger.child(fields);
