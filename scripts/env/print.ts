import { getDefaultEnv, loadConfig } from "../../src/config/index";
import { logErr } from "../../src/errors";
import { createLogger } from "../../src/logger";

const bootstrapLogger = createLogger(getDefaultEnv());

loadConfig().match(
  (config) => {
    console.log(JSON.stringify({ env: config.env, flags: config.flags }, null, 2));
  },
  (error) => {
    logErr(bootstrapLogger, error);
    process.exitCode = 1;
  },
);
