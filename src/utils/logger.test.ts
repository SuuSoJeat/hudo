import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { logger } from "./logger";

describe("logger", () => {
  const originalConsole = { ...console };
  const mockConsole = {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    log: vi.fn(),
  };

  beforeEach(() => {
    vi.resetAllMocks();
    Object.assign(console, mockConsole);
  });

  afterEach(() => {
    Object.assign(console, originalConsole);
  });

  it("should log debug messages with correct level and metadata", () => {
    const message = "Debug message";
    const meta = { extra: "info" };
    logger.debug(message, meta);
    expect(mockConsole.debug).toHaveBeenCalledWith(message, meta);
  });

  it("should log info messages with correct level and metadata", () => {
    const message = "Info message";
    const meta = { data: "value" };
    logger.info(message, meta);
    expect(mockConsole.info).toHaveBeenCalledWith(message, meta);
  });

  it("should log warn messages with correct level and metadata", () => {
    const message = "Warning message";
    const meta = { issue: "potential problem" };
    logger.warn(message, meta);
    expect(mockConsole.warn).toHaveBeenCalledWith(message, meta);
  });

  it("should log error messages with correct level and error object", () => {
    const message = "Error message";
    const error = new Error("Test error");
    logger.error(message, { error });
    expect(mockConsole.error).toHaveBeenCalledWith(message, {
      error: expect.any(Error),
    });
  });

  it("should log as JSON in production environment with correct structure", async () => {
    const originalEnv = process.env.NODE_ENV;
    vi.stubEnv("NODE_ENV", "production");

    // Reset the logger to recreate it with the new environment
    vi.resetModules();
    const { logger: newLogger } =
      await vi.importActual<typeof import("./logger")>("./logger");

    const message = "Production log";
    const meta = { env: "prod" };
    newLogger.info(message, meta);

    expect(mockConsole.log).toHaveBeenCalledWith(
      JSON.stringify({
        level: "info",
        message,
        meta,
      }),
    );

    vi.stubEnv("NODE_ENV", originalEnv);
    vi.resetModules();
  });
});
