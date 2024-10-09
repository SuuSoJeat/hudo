import { logger } from "@/utils/logger";
import { toast } from "sonner";

export interface ErrorHandlerOptions {
  logError?: boolean;
  showToast?: boolean;
  context?: string;
}

export function handleError(
  error: Error | unknown,
  options: ErrorHandlerOptions = {},
) {
  const { logError = true, showToast = true, context = "Operation" } = options;

  if (logError) {
    logger.error(`${context} error:`, { error });
  }

  if (showToast) {
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    toast.error(`${context} error`, {
      description: errorMessage,
    });
  }

  return error;
}
