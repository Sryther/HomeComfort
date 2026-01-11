// src/server/lib/logger.ts
type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

function ts(): string {
    // ISO + suppression des millisecondes pour lisibilité
    return new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
}

function base(level: LogLevel, scope: string, message: string, extra?: unknown) {
    const line = `${ts()} [${level}] [${scope}] ${message}`;
    if (extra !== undefined) {
        // eslint-disable-next-line no-console
        console.log(line, extra);
        return;
    }
    // eslint-disable-next-line no-console
    console.log(line);
}

export const log = {
    debug: (scope: string, message: string, extra?: unknown) => base("DEBUG", scope, message, extra),
    info: (scope: string, message: string, extra?: unknown) => base("INFO", scope, message, extra),
    warn: (scope: string, message: string, extra?: unknown) => base("WARN", scope, message, extra),
    error: (scope: string, message: string, extra?: unknown) => base("ERROR", scope, message, extra),
};
