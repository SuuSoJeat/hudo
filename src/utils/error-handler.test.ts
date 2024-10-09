import { logger } from "@/utils/logger";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { type ErrorHandlerOptions, handleError } from "./error-handler";

vi.mock("@/utils/logger", () => ({
  logger: {
    error: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe("handleError", () => {
  const mockError = new Error("Test error");
  const defaultContext = "Operation";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should log error and show toast by default", () => {
    handleError(mockError);

    expect(logger.error).toHaveBeenCalledWith(`${defaultContext} error:`, {
      error: mockError,
    });
    expect(toast.error).toHaveBeenCalledWith(`${defaultContext} error`, {
      description: mockError.message,
    });
  });

  it("should not log error when logError is false", () => {
    const options: ErrorHandlerOptions = { logError: false };
    handleError(mockError, options);

    expect(logger.error).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalled();
  });

  it("should not show toast when showToast is false", () => {
    const options: ErrorHandlerOptions = { showToast: false };
    handleError(mockError, options);

    expect(logger.error).toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("should use custom context when provided", () => {
    const customContext = "Custom Operation";
    const options: ErrorHandlerOptions = { context: customContext };
    handleError(mockError, options);

    expect(logger.error).toHaveBeenCalledWith(`${customContext} error:`, {
      error: mockError,
    });
    expect(toast.error).toHaveBeenCalledWith(`${customContext} error`, {
      description: mockError.message,
    });
  });

  it("should return the error object", () => {
    const result = handleError(mockError);

    expect(result).toBe(mockError);
  });
});
