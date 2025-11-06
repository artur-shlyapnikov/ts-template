import { getDefaultEnv, loadConfig } from "../../src/config/index";
import { logErr } from "../../src/errors";
import { createLogger } from "../../src/logger";

const bootstrapLogger = createLogger(getDefaultEnv());

loadConfig().match(
  () => {
    console.log("Environment and flags validated");
  },
  (error) => {
    logErr(bootstrapLogger, error);
    process.exitCode = 1;
  },
);
