import type { Todo, TodoFilter, todoSchema } from "@/types/todo";
import { FirestoreOperationError, ValidationError } from "@/utils/errors";
import type { DataWithId } from "@/utils/zod-schema";
import { where } from "firebase/firestore";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  addTodo,
  deleteTodo,
  getQueryConstraintsForTodoFilter,
  getTodos,
  subscribeTodoCol,
  subscribeTodoDoc,
  toggleTodoStatus,
  updateTodo,
} from "./todo-service";

vi.mock("./firestore-service", () => ({
  createFirestoreService: vi.fn(() => ({
    add: vi.fn(),
    getAll: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    subscribeCol: vi.fn(),
    subscribeDoc: vi.fn(),
  })),
}));

vi.mock("firebase/firestore", () => ({
  where: vi.fn(),
  getFirestore: vi.fn(),
}));

describe("todoService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("addTodo", () => {
    it("should add a new todo successfully", async () => {
      const newTodo = { title: "Test Todo", status: "incomplete" } as const;
      const expectedId = "mockedId";

      vi.mocked(addTodo).mockResolvedValue(expectedId);

      const result = await addTodo(newTodo);

      expect(result).toBe(expectedId);
      expect(addTodo).toHaveBeenCalledWith(newTodo);
    });

    it("should handle errors when adding a todo", async () => {
      const newTodo = { title: "Test Todo", status: "incomplete" } as const;
      const errorMessage = "Failed to add todo";

      vi.mocked(addTodo).mockRejectedValue(
        new FirestoreOperationError("add", errorMessage),
      );

      await expect(addTodo(newTodo)).rejects.toThrow(FirestoreOperationError);
      await expect(addTodo(newTodo)).rejects.toThrow(errorMessage);
    });

    it("should handle validation errors", async () => {
      const invalidTodo = { title: "", status: "invalid" } as unknown as Todo;
      const errorMessage = "Invalid todo data";

      vi.mocked(addTodo).mockRejectedValue(new ValidationError(errorMessage));

      await expect(addTodo(invalidTodo)).rejects.toThrow(ValidationError);
      await expect(addTodo(invalidTodo)).rejects.toThrow(errorMessage);
    });
  });

  describe("getTodos", () => {
    it("should get all todos successfully", async () => {
      const mockTodos: DataWithId<typeof todoSchema>[] = [
        { id: "1", title: "Todo 1", status: "incomplete" },
        { id: "2", title: "Todo 2", status: "completed" },
      ];

      vi.mocked(getTodos).mockResolvedValue(mockTodos);

      const result = await getTodos();

      expect(result).toEqual(mockTodos);
      expect(getTodos).toHaveBeenCalled();
    });

    it("should handle errors when getting todos", async () => {
      const errorMessage = "Failed to get todos";

      vi.mocked(getTodos).mockRejectedValue(
        new FirestoreOperationError("getAll", errorMessage),
      );

      await expect(getTodos()).rejects.toThrow(FirestoreOperationError);
      await expect(getTodos()).rejects.toThrow(errorMessage);
    });
  });

  describe("updateTodo", () => {
    it("should update a todo successfully", async () => {
      const todoId = "1";
      const updateData = { title: "Updated Todo" };

      vi.mocked(updateTodo).mockResolvedValue(undefined);

      await updateTodo(todoId, updateData);

      expect(updateTodo).toHaveBeenCalledWith(todoId, updateData);
    });

    it("should handle errors when updating a todo", async () => {
      const todoId = "1";
      const updateData = { title: "Updated Todo" };
      const errorMessage = "Failed to update todo";

      vi.mocked(updateTodo).mockRejectedValue(
        new FirestoreOperationError("update", errorMessage),
      );

      await expect(updateTodo(todoId, updateData)).rejects.toThrow(
        FirestoreOperationError,
      );
      await expect(updateTodo(todoId, updateData)).rejects.toThrow(
        errorMessage,
      );
    });
  });

  describe("deleteTodo", () => {
    it("should delete a todo successfully", async () => {
      const todoId = "1";

      vi.mocked(deleteTodo).mockResolvedValue(undefined);

      await deleteTodo(todoId);

      expect(deleteTodo).toHaveBeenCalledWith(todoId);
    });

    it("should handle errors when deleting a todo", async () => {
      const todoId = "1";
      const errorMessage = "Failed to delete todo";

      vi.mocked(deleteTodo).mockRejectedValue(
        new FirestoreOperationError("remove", errorMessage),
      );

      await expect(deleteTodo(todoId)).rejects.toThrow(FirestoreOperationError);
      await expect(deleteTodo(todoId)).rejects.toThrow(errorMessage);
    });
  });

  describe("subscribeTodoCol", () => {
    it("should subscribe to todos successfully", () => {
      const onData = vi.fn();
      const onError = vi.fn();
      const unsubscribe = vi.fn();

      vi.mocked(subscribeTodoCol).mockReturnValue(unsubscribe);

      const result = subscribeTodoCol(onData, onError);

      expect(result).toBe(unsubscribe);
      expect(subscribeTodoCol).toHaveBeenCalledWith(onData, onError);
    });
  });

  describe("subscribeTodoDoc", () => {
    it("should subscribe to a specific todo document", () => {
      const todoId = "123";
      const onData = vi.fn();
      const onError = vi.fn();
      const unsubscribe = vi.fn();

      vi.mocked(subscribeTodoDoc).mockReturnValue(unsubscribe);

      const result = subscribeTodoDoc(todoId, onData, onError);

      expect(result).toBe(unsubscribe);
      expect(subscribeTodoDoc).toHaveBeenCalledWith(todoId, onData, onError);
    });
  });

  describe("toggleTodoStatus", () => {
    it("should toggle todo status from incomplete to completed", async () => {
      const todoId = "1";
      const currentStatus: Todo["status"] = "incomplete";

      vi.mocked(updateTodo).mockResolvedValue(undefined);

      await toggleTodoStatus(todoId, currentStatus);

      expect(updateTodo).toHaveBeenCalledWith(todoId, { status: "completed" });
    });

    it("should toggle todo status from completed to incomplete", async () => {
      const todoId = "1";
      const currentStatus: Todo["status"] = "completed";

      vi.mocked(updateTodo).mockResolvedValue(undefined);

      await toggleTodoStatus(todoId, currentStatus);

      expect(updateTodo).toHaveBeenCalledWith(todoId, { status: "incomplete" });
    });

    it("should handle errors when toggling todo status", async () => {
      const todoId = "1";
      const currentStatus: Todo["status"] = "incomplete";
      const errorMessage = "Failed to toggle todo status";

      vi.mocked(updateTodo).mockRejectedValue(
        new FirestoreOperationError("update", errorMessage),
      );

      await expect(toggleTodoStatus(todoId, currentStatus)).rejects.toThrow(
        FirestoreOperationError,
      );
      await expect(toggleTodoStatus(todoId, currentStatus)).rejects.toThrow(
        errorMessage,
      );
    });
  });

  describe("getQueryConstraintsForTodoFilter", () => {
    it("should return completed todos query for 'completed' filter", () => {
      const filter: TodoFilter = "completed";
      const result = getQueryConstraintsForTodoFilter(filter);
      expect(result).toEqual([where("status", "==", "completed")]);
    });

    it("should return incomplete todos query for 'incomplete' filter", () => {
      const filter: TodoFilter = "incomplete";
      const result = getQueryConstraintsForTodoFilter(filter);
      expect(result).toEqual([where("status", "==", "incomplete")]);
    });

    it("should return empty array for 'all' filter", () => {
      const filter: TodoFilter = null;
      const result = getQueryConstraintsForTodoFilter(filter);
      expect(result).toEqual([]);
    });
  });
});
