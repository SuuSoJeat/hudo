import type { LogEntry, LogLevel } from "@/types/logger";

function createLogger() {
  const isProduction = process.env.NODE_ENV === "production";

  function log(entry: LogEntry): void {
    if (!shouldLog(entry.level)) return;

    if (isProduction) {
      // TODO: Integrate with a production logging service
      // if (sentry.isInitialized()) {
      //   sentry.captureMessage(entry.message, { level: entry.level, extra: entry.meta })
      //   return
      // }
      console.log(JSON.stringify(entry));
      return;
    }

    const { level, message, meta } = entry;
    console[level](message, meta);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function shouldLog(level: LogLevel): boolean {
    // TODO: Implement log level control
    // const configuredLevel = getConfiguredLogLevel()
    // const levels = ['debug', 'info', 'warn', 'error']
    // return levels.indexOf(level) >= levels.indexOf(configuredLevel)
    return true;
  }

  function debug(message: string, meta?: Record<string, unknown>): void {
    log({ level: "debug", message, meta });
  }

  function info(message: string, meta?: Record<string, unknown>): void {
    log({ level: "info", message, meta });
  }

  function warn(message: string, meta?: Record<string, unknown>): void {
    log({ level: "warn", message, meta });
  }

  function error(message: string, meta?: Record<string, unknown>): void {
    log({ level: "error", message, meta });
  }

  return { debug, info, warn, error };
}

export const logger = createLogger();
