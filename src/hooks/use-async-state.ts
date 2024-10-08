import { useCallback, useReducer } from "react";

interface AsyncState<E = Error> {
  isLoading: boolean;
  error: E | null;
}

type AsyncAction<E = Error> =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: E | null }
  | { type: "RESET" };

function asyncReducer<E = Error>(
  state: AsyncState<E>,
  action: AsyncAction<E>,
): AsyncState<E> {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "RESET":
      return { isLoading: false, error: null };
    default:
      return state;
  }
}

/**
 * Custom hook to manage the state of asynchronous operations.
 *
 * @template E - The type of the error (default: Error)
 * @param initialLoading - Initial loading state (default: false)
 * @returns An object containing the current state and functions to update it
 */
export function useAsyncState<E = Error>(initialLoading = false) {
  const [state, dispatch] = useReducer(asyncReducer<E>, {
    isLoading: initialLoading,
    error: null,
  });

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  }, []);

  const setError = useCallback((error: E | null) => {
    dispatch({ type: "SET_ERROR", payload: error });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return {
    isLoading: state.isLoading,
    error: state.error,
    isError: state.error !== null,
    setLoading,
    setError,
    reset,
  };
}
