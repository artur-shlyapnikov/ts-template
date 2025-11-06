import { createLogger } from "@logging";
import { getDefaultEnv, loadConfig } from "@config/index";
import { logErr } from "@errors";

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
