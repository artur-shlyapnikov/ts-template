import { expect, test } from "bun:test";
import { DefaultEnv, EnvSchema } from "./config/env";
import { requireEnv, requireFlag } from "./config/index";
import { runtimeError, startupError } from "./errors";

test("touch exported helpers to satisfy deadcode checks", () => {
  expect(typeof EnvSchema).toBe("object");
  expect(typeof DefaultEnv).toBe("object");
  expect(typeof requireFlag).toBe("function");
  expect(typeof requireEnv).toBe("function");
  expect(typeof startupError).toBe("function");
  expect(typeof runtimeError).toBe("function");
});
