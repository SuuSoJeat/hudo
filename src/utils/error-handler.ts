import { logger } from "@/utils/logger";
import { toast } from "sonner";

export interface ErrorHandlerOptions {
  logError?: boolean;
  showToast?: boolean;
  context?: string;
}

export function handleError(error: Error, options: ErrorHandlerOptions = {}) {
  const { logError = true, showToast = true, context = "Operation" } = options;

  if (logError) {
    logger.error(`${context} error:`, { error });
  }

  if (showToast) {
    toast.error(`${context} error`, {
      description: error.message,
    });
  }

  return error;
}
