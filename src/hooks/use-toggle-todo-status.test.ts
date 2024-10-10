import { toggleTodoStatus } from "@/services/todo-service";
import type { Todo } from "@/types/todo";
import { handleError } from "@/utils/error-handler";
import { act, renderHook } from "@testing-library/react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useToggleTodoStatus } from "./use-toggle-todo-status";

vi.mock("@/services/todo-service");
vi.mock("@/utils/error-handler");
vi.mock("sonner");
vi.mock("canvas-confetti");

describe("useToggleTodoStatus", () => {
  const mockTodo: Todo = {
    id: "123",
    title: "Complete project proposal",
    description: "Write and submit the project proposal for the new client",
    status: "incomplete",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should toggle todo status successfully", async () => {
    (toggleTodoStatus as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
    const { result } = renderHook(() => useToggleTodoStatus());

    await act(async () => {
      const newStatus = await result.current.toggleStatus(mockTodo);
      expect(newStatus).toBe("completed");
    });

    expect(toggleTodoStatus).toHaveBeenCalledWith(mockTodo.id, mockTodo.status);
    expect(toast.success).toHaveBeenCalledWith("Great job! Task completed.");
    expect(confetti).toHaveBeenCalled();
  });

  it("should handle errors when toggling status", async () => {
    const error = new Error("Toggle failed");
    (toggleTodoStatus as ReturnType<typeof vi.fn>).mockRejectedValue(error);
    const { result } = renderHook(() => useToggleTodoStatus());

    await act(async () => {
      await result.current.toggleStatus(mockTodo);
    });

    expect(handleError).toHaveBeenCalledWith(error);
  });

  it("should toggle from completed to incomplete", async () => {
    const completedTodo: Todo = { ...mockTodo, status: "completed" };
    (toggleTodoStatus as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
    const { result } = renderHook(() => useToggleTodoStatus());

    await act(async () => {
      const newStatus = await result.current.toggleStatus(completedTodo);
      expect(newStatus).toBe("incomplete");
    });

    expect(toast.success).toHaveBeenCalledWith(
      "Task marked as incomplete. Keep going!",
    );
    expect(confetti).not.toHaveBeenCalled();
  });
});
