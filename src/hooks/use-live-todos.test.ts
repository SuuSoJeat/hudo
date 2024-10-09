import todos from "@/mocks/todos.json";
import * as todoService from "@/services/todo-service";
import * as errorHandler from "@/utils/error-handler";
import { act, renderHook } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLiveTodos } from "./use-live-todos";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));
vi.mock("@/services/todo-service");
vi.mock("@/utils/error-handler");

describe("useLiveTodos", () => {
  const mockTodos = todos;

  beforeEach(() => {
    vi.clearAllMocks();
    (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue({
      get: vi.fn().mockReturnValue(null), // Default to 'all' filter
    });
  });

  it("should initialize with loading state and subscribe to todos", async () => {
    const mockSubscribe = vi.fn().mockImplementation((onData) => {
      setTimeout(() => onData(mockTodos), 0); // Simulate async data fetch
      return vi.fn(); // Unsubscribe function
    });
    (
      todoService.subscribeTodoCol as ReturnType<typeof vi.fn>
    ).mockImplementation(mockSubscribe);

    const { result } = renderHook(() => useLiveTodos());

    // Check initial loading state
    expect(result.current.isLoading).toBe(true);
    expect(todoService.subscribeTodoCol).toHaveBeenCalled();

    // Wait for state updates
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Check final state after data is loaded
    expect(result.current.isLoading).toBe(false);
    expect(result.current.todos).toEqual(mockTodos);
    expect(result.current.count).toBe(mockTodos.length);
  });

  it("should handle subscription errors", async () => {
    const mockError = new Error("Subscription error");
    const mockSubscribe = vi.fn().mockImplementation((onData, onError) => {
      onError(mockError);
      return vi.fn(); // Unsubscribe function
    });
    (
      todoService.subscribeTodoCol as ReturnType<typeof vi.fn>
    ).mockImplementation(mockSubscribe);

    const { result } = renderHook(() => useLiveTodos());

    // Wait for state updates
    await act(async () => {});

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(mockError);
    expect(errorHandler.handleError).toHaveBeenCalledWith(mockError, {
      context: "Todos subscription",
    });
  });

  it("should update filter constraints when search params change", async () => {
    const mockGetConstraints = vi.fn().mockReturnValue(["mockConstraint"]);
    (
      todoService.getQueryConstraintsForTodoFilter as ReturnType<typeof vi.fn>
    ).mockImplementation(mockGetConstraints);

    (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue({
      get: vi.fn().mockReturnValue("completed"),
    });

    renderHook(() => useLiveTodos());

    expect(todoService.getQueryConstraintsForTodoFilter).toHaveBeenCalledWith(
      "completed",
    );
    expect(todoService.subscribeTodoCol).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      ["mockConstraint"],
    );
  });

  it("should unsubscribe when unmounted", () => {
    const unsubscribeMock = vi.fn();
    (todoService.subscribeTodoCol as ReturnType<typeof vi.fn>).mockReturnValue(
      unsubscribeMock,
    );

    const { unmount } = renderHook(() => useLiveTodos());

    unmount();

    expect(unsubscribeMock).toHaveBeenCalled();
  });
});
