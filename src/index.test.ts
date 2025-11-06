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
      delete process.env[key];
    }
  }

  for (const [key, value] of Object.entries(originalEnv)) {
    if (typeof value === "undefined") {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }

  process.exitCode = 0;
};

afterEach(restoreEnv);

describe("initialize", () => {
  test("creates a logger with parsed environment defaults", () => {
    delete process.env.NODE_ENV;
    delete process.env.LOG_LEVEL;
    delete process.env.PORT;
    delete process.env.FEATURE_EXAMPLE;

    const result = initialize();

    expect(result.isOk()).toBe(true);

    const { config, logger } = result._unsafeUnwrap();
    expect(config.env.NODE_ENV).toBe("development");
    expect(config.env.LOG_LEVEL).toBe("info");
    expect(config.env.PORT).toBe(3000);
    expect(config.flags.exampleFeature).toBe(false);
    expect(logger.level).toBe("info");
    run();
    expect(process.exitCode ?? 0).toBe(0);
  });

  test("fails fast when environment parsing fails", () => {
    process.env.LOG_LEVEL = "debug";
    process.env.NODE_ENV = "production";
    process.env.PORT = "not-a-number";

    const result = initialize();

    expect(result.isErr()).toBe(true);

    const appError = result._unsafeUnwrapErr();
    expect(appError.type).toBe("ConfigError");
    expect(appError.message).toContain("PORT");
  });

  test("run reports initialization success via logger", () => {
    process.env.NODE_ENV = "development";
    process.env.LOG_LEVEL = "info";
    process.env.PORT = "3010";
    process.env.FEATURE_EXAMPLE = "false";

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
    expect(
      errorSpy.calls.some(([message]) => message === "Application failed to initialize"),
    ).toBe(true);

    errorSpy.restore();
  });
});
