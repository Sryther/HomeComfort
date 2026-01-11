import { getRoutes } from './debug';

import Api from "./api";
import Configuration from "./configuration";
import DatabaseInstance from "./data/database-instance";
import { log } from "./lib/logger";
import CRONManager from "./lib/api/CRONManager";

async function start(): Promise<void> {
    const scopeBoot = "BOOT";
    const scopeConfig = "CONFIG";
    const scopeApi = "API";
    const cronScope = "CRON";

    log.info(scopeBoot, "HomeComfort Server starting…");
    log.info(scopeBoot, `NODE_ENV=${process.env.NODE_ENV || "undefined"}`);
    log.info(scopeBoot, `PID=${process.pid}`);
    log.info(scopeBoot, `Node version=${process.version}`);

    const cfg = Configuration.getInstance();
    log.info(scopeConfig, "Loading environment variables");
    log.info(scopeConfig, `API_HOSTNAME=${cfg.getApiHostname()}`);
    log.info(scopeConfig, `API_PORT=${cfg.getApiPort()}`);
    log.info(scopeConfig, `DATABASE_URI=${cfg.getDatabaseUri()}`);
    log.info(scopeConfig, `DATABASE_PORT=${cfg.getDatabasePort()}`);
    log.info(scopeConfig, `DATABASE_DBNAME=${cfg.getDatabaseDbname()}`);
    log.info(scopeConfig, `DATABASE_AUTH=${cfg.getDatabaseAuth()}`);
    if (process.env.TZ) log.info(scopeConfig, `TZ=${process.env.TZ}`);

    console.log(getRoutes(Api));

    // Mongo
    await DatabaseInstance.getInstance().connect();

    // Express
    log.info(scopeApi, "Initializing Express application");
    const server = Api.listen(cfg.getApiPort(), cfg.getApiHostname(), async () => {
        log.info(scopeApi, `Server listening on http://${cfg.getApiHostname()}:${cfg.getApiPort()}`);

        try {
            log.info(cronScope, "Initializing scheduler");
            await CRONManager.launchJobs();
            log.info(cronScope, "Scheduler started");
        } catch (err) {
            log.error(cronScope, "Scheduler initialization failed", err);
        }
    });

    process.on("SIGINT", () => {
        log.warn(scopeBoot, "SIGINT received, shutting down");
        server.close(() => process.exit(0));
    });
    process.on("SIGTERM", () => {
        log.warn(scopeBoot, "SIGTERM received, shutting down");
        server.close(() => process.exit(0));
    });
}

start().catch((err) => {
    log.error("BOOT", "Fatal error during startup", err);
    process.exit(1);
});