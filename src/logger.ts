import { type Logger, type LoggerOptions, pino } from "pino";
import type { Env } from "./config/env";

export type AppLogger = Logger;

const prettyTransport = (env: Env): LoggerOptions["transport"] => {
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

export const createLogger = (env: Env): AppLogger =>
  pino({
    level: env.LOG_LEVEL,
    transport: prettyTransport(env),
  });
