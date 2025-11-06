import { afterEach, describe, expect, test } from "bun:test";
import { initialize, run } from "./index";

const originalEnv = { ...process.env };

type ConsoleMethod = "info" | "error";

const captureConsole = (method: ConsoleMethod) => {
  const original = console[method];
  const calls: unknown[][] = [];

  console[method] = (...args: unknown[]) => {
    calls.push(args);
  };

  return {
    calls,
    restore: () => {
      console[method] = original;
    },
  };
};

const restoreEnv = (): void => {
  for (const key of Object.keys(process.env)) {
    if (!(key in originalEnv)) {
      process.env[key] = undefined;
    }
  }

  for (const [key, value] of Object.entries(originalEnv)) {
    process.env[key] = value;
  }

  process.exitCode = 0;
};

afterEach(restoreEnv);

describe("initialize", () => {
  test("creates a logger with parsed environment defaults", () => {
    process.env.NODE_ENV = undefined;
    process.env.LOG_LEVEL = undefined;
    process.env.PORT = undefined;

    const result = initialize();

    expect(result.isOk()).toBe(true);

    const { env, logger } = result._unsafeUnwrap();
    expect(env.NODE_ENV).toBe("development");
    expect(env.LOG_LEVEL).toBe("info");
    expect(env.PORT).toBe(3000);
    expect(logger.level).toBe("info");
  });

  test("creates a production logger without altering configuration", () => {
    process.env.NODE_ENV = "production";
    process.env.LOG_LEVEL = "warn";
    process.env.PORT = "4100";

    const result = initialize();

    expect(result.isOk()).toBe(true);

    const { env, logger } = result._unsafeUnwrap();
    expect(env.NODE_ENV).toBe("production");
    expect(env.LOG_LEVEL).toBe("warn");
    expect(env.PORT).toBe(4100);
    expect(logger.level).toBe("warn");
  });

  test("fails fast when environment parsing fails", () => {
    process.env.LOG_LEVEL = "debug";
    process.env.NODE_ENV = "production";
    process.env.PORT = "not-a-number";

    const result = initialize();

    expect(result.isErr()).toBe(true);

    const message = result._unsafeUnwrapErr();
    expect(message).toContain("PORT");
  });

  test("run reports initialization success via logger", () => {
    process.env.NODE_ENV = "development";
    process.env.LOG_LEVEL = "info";
    process.env.PORT = "3010";

    run();
    expect(process.exitCode ?? 0).toBe(0);
  });

  test("run surfaces configuration errors and sets exit code", () => {
    process.env.NODE_ENV = "production";
    process.env.LOG_LEVEL = "info";
    process.env.PORT = "invalid";

    const errorSpy = captureConsole("error");

    run();

    expect(process.exitCode).toBe(1);
    expect(errorSpy.calls.some(([message]) => message === "Configuration error")).toBe(true);

    errorSpy.restore();
  });
});
