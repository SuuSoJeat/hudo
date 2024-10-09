"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLiveTodos } from "@/hooks/use-live-todos";
import type React from "react";
import { Skeleton } from "./ui/skeleton";

type TodoCounterProps = {
  className?: string | undefined;
};

export const TodoCounter: React.FC<TodoCounterProps> = ({ className }) => {
  const {
    count: allTodoCount,
    todos,
    isLoading,
    isError,
    error,
  } = useLiveTodos();

  if (isLoading && todos.length === 0) {
    return <Skeleton className={`w-6 h-6 rounded-md ${className ?? ""}`} />;
  }
  if (isError) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className={`border border-destructive rounded-md aspect-square flex items-center justify-center w-6 h-6 animate-pulse bg-destructive/10 text-sm text-destructive cursor-help select-none ${className ?? ""}`}
            >
              -
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{error?.message || "An error occurred"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <span
      className={`border rounded-md flex items-center justify-center min-w-6 h-6 px-1 text-sm select-none ${className ?? ""}`}
    >
      {allTodoCount}
    </span>
  );
};
