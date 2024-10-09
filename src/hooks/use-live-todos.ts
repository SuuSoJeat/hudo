import {
  getQueryConstraintsForTodoFilter,
  subscribeToToDos,
} from "@/services/todo-service";
import type { ToDo, TodoFilter } from "@/types/todo";
import { handleError } from "@/utils/error-handler";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAsyncState } from "./use-async-state";

/**
 * Custom hook for managing live-updating todos with filtering and error handling.
 * @returns An object containing todos, count, loading state, and error information.
 */
export function useLiveTodos() {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") as TodoFilter;
  const [todos, setTodos] = useState<ToDo[]>([]);
  const { isLoading, isError, error, setLoading, setError, reset } =
    useAsyncState(true);

  const handleSubscriptionError = useCallback(
    (error: Error) => {
      handleError(error, { context: "Todos subscription" });
      setError(error);
      setLoading(false);
    },
    [setError, setLoading],
  );

  useEffect(() => {
    reset(true);

    const unsubscribe = subscribeToToDos(
      (data) => {
        setTodos(data);
        setLoading(false);
      },
      handleSubscriptionError,
      getQueryConstraintsForTodoFilter(filter),
    );

    return unsubscribe;
  }, [filter, handleSubscriptionError, reset, setLoading]);

  return { todos, count: todos.length, isLoading, isError, error };
}
