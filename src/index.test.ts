import { afterEach, describe, expect, test } from "bun:test";
import { initialize, run } from "./index";

const originalEnv = { ...process.env };

const setEnv = (key: string, value: string): void => {
  process.env[key] = value;
};

const unsetEnv = (key: string): void => {
  Reflect.deleteProperty(process.env, key);
};

const restoreEnv = (): void => {
  for (const key of Object.keys(process.env)) {
    if (!(key in originalEnv)) {
      unsetEnv(key);
    }
  }

  for (const [key, value] of Object.entries(originalEnv)) {
    if (typeof value === "undefined") {
      unsetEnv(key);
    } else {
      process.env[key] = value;
    }
  }

  process.exitCode = 0;
};

afterEach(restoreEnv);

describe("initialize", () => {
  test("creates a logger with parsed environment defaults", () => {
    unsetEnv("NODE_ENV");
    unsetEnv("LOG_LEVEL");
    unsetEnv("PORT");
    unsetEnv("FEATURE_EXAMPLE");

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
    setEnv("LOG_LEVEL", "debug");
    setEnv("NODE_ENV", "production");
    setEnv("PORT", "not-a-number");

    const result = initialize();

    expect(result.isErr()).toBe(true);

    const appError = result._unsafeUnwrapErr();
    expect(appError.type).toBe("ConfigError");
    expect(appError.message).toContain("PORT");
  });

  test("run reports initialization success via logger", () => {
    setEnv("NODE_ENV", "development");
    setEnv("LOG_LEVEL", "info");
    setEnv("PORT", "3010");
    setEnv("FEATURE_EXAMPLE", "false");

    run();
    expect(process.exitCode ?? 0).toBe(0);
  });

  test("run surfaces configuration errors and sets exit code", () => {
    setEnv("NODE_ENV", "production");
    setEnv("LOG_LEVEL", "info");
    setEnv("PORT", "invalid");

    const captureOutput = () => {
      const originalOut = process.stdout.write.bind(process.stdout);
      const originalErr = process.stderr.write.bind(process.stderr);
      const calls: string[] = [];

      (process.stdout as unknown as { write: (chunk: unknown) => boolean }).write = (
        chunk: unknown,
      ) => {
        calls.push(String(chunk));
        return true;
      };

      (process.stderr as unknown as { write: (chunk: unknown) => boolean }).write = (
        chunk: unknown,
      ) => {
        calls.push(String(chunk));
        return true;
      };

      return {
        calls,
        restore: () => {
          process.stdout.write = originalOut;
          process.stderr.write = originalErr;
        },
      };
    };

    const outSpy = captureOutput();

    run();

    expect(process.exitCode).toBe(1);
    expect(outSpy.calls.some((c) => c.includes("Application failed to initialize"))).toBe(true);

    outSpy.restore();
  });
});
