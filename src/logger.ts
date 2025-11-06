import { type Logger, type LoggerOptions, pino } from "pino";
import type { Env } from "./config/env";

export type AppLogger = Logger;

const resolveTransport = (env: Env): LoggerOptions["transport"] =>
  env.NODE_ENV === "development"
    ? {
        target: "pino-pretty",
        options: { colorize: true, translateTime: "SYS:standard" },
      }
    : undefined;

const runtimeVersion = (): string => (typeof Bun !== "undefined" ? Bun.version : process.version);

const serializeError = (error: unknown): unknown =>
  error instanceof Error ? { type: error.name, message: error.message, stack: error.stack } : error;

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
    } as const,
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

type Primitive = string | number | boolean | null | undefined;
type Shallow = Record<string, Primitive>;

export const withFields = (logger: AppLogger, fields: Shallow): AppLogger => logger.child(fields);
