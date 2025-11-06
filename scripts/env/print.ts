import { createLogger } from "@logging";
import { getDefaultEnv, loadConfig } from "@config/index";
import { logErr } from "@errors";

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
