import type { ToDo, TodoFilter, toDoSchema } from "@/types/todo";
import { FirestoreOperationError, ValidationError } from "@/utils/errors";
import type { DataWithId } from "@/utils/zod-schema";
import { where } from "firebase/firestore";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  addToDo,
  deleteToDo,
  getQueryConstraintsForTodoFilter,
  getToDos,
  subscribeToToDos,
  toggleTodoStatus,
  updateToDo,
} from "./todo-service";

vi.mock("./firestore-service", () => ({
  createFirestoreService: vi.fn(() => ({
    add: vi.fn(),
    getAll: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    subscribe: vi.fn(),
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

  describe("addToDo", () => {
    it("should add a new todo successfully", async () => {
      const newTodo = { title: "Test Todo", status: "incomplete" } as const;
      const expectedId = "mockedId";

      vi.mocked(addToDo).mockResolvedValue(expectedId);

      const result = await addToDo(newTodo);

      expect(result).toBe(expectedId);
      expect(addToDo).toHaveBeenCalledWith(newTodo);
    });

    it("should handle errors when adding a todo", async () => {
      const newTodo = { title: "Test Todo", status: "incomplete" } as const;
      const errorMessage = "Failed to add todo";

      vi.mocked(addToDo).mockRejectedValue(
        new FirestoreOperationError("add", errorMessage),
      );

      await expect(addToDo(newTodo)).rejects.toThrow(FirestoreOperationError);
      await expect(addToDo(newTodo)).rejects.toThrow(errorMessage);
    });

    it("should handle validation errors", async () => {
      const invalidTodo = { title: "", status: "invalid" } as unknown as ToDo;
      const errorMessage = "Invalid todo data";

      vi.mocked(addToDo).mockRejectedValue(new ValidationError(errorMessage));

      await expect(addToDo(invalidTodo)).rejects.toThrow(ValidationError);
      await expect(addToDo(invalidTodo)).rejects.toThrow(errorMessage);
    });
  });

  describe("getToDos", () => {
    it("should get all todos successfully", async () => {
      const mockTodos: DataWithId<typeof toDoSchema>[] = [
        { id: "1", title: "Todo 1", status: "incomplete" },
        { id: "2", title: "Todo 2", status: "completed" },
      ];

      vi.mocked(getToDos).mockResolvedValue(mockTodos);

      const result = await getToDos();

      expect(result).toEqual(mockTodos);
      expect(getToDos).toHaveBeenCalled();
    });

    it("should handle errors when getting todos", async () => {
      const errorMessage = "Failed to get todos";

      vi.mocked(getToDos).mockRejectedValue(
        new FirestoreOperationError("getAll", errorMessage),
      );

      await expect(getToDos()).rejects.toThrow(FirestoreOperationError);
      await expect(getToDos()).rejects.toThrow(errorMessage);
    });
  });

  describe("updateToDo", () => {
    it("should update a todo successfully", async () => {
      const todoId = "1";
      const updateData = { title: "Updated Todo" };

      vi.mocked(updateToDo).mockResolvedValue(undefined);

      await updateToDo(todoId, updateData);

      expect(updateToDo).toHaveBeenCalledWith(todoId, updateData);
    });

    it("should handle errors when updating a todo", async () => {
      const todoId = "1";
      const updateData = { title: "Updated Todo" };
      const errorMessage = "Failed to update todo";

      vi.mocked(updateToDo).mockRejectedValue(
        new FirestoreOperationError("update", errorMessage),
      );

      await expect(updateToDo(todoId, updateData)).rejects.toThrow(
        FirestoreOperationError,
      );
      await expect(updateToDo(todoId, updateData)).rejects.toThrow(
        errorMessage,
      );
    });
  });

  describe("deleteToDo", () => {
    it("should delete a todo successfully", async () => {
      const todoId = "1";

      vi.mocked(deleteToDo).mockResolvedValue(undefined);

      await deleteToDo(todoId);

      expect(deleteToDo).toHaveBeenCalledWith(todoId);
    });

    it("should handle errors when deleting a todo", async () => {
      const todoId = "1";
      const errorMessage = "Failed to delete todo";

      vi.mocked(deleteToDo).mockRejectedValue(
        new FirestoreOperationError("remove", errorMessage),
      );

      await expect(deleteToDo(todoId)).rejects.toThrow(FirestoreOperationError);
      await expect(deleteToDo(todoId)).rejects.toThrow(errorMessage);
    });
  });

  describe("subscribeToToDos", () => {
    it("should subscribe to todos successfully", () => {
      const onData = vi.fn();
      const onError = vi.fn();
      const unsubscribe = vi.fn();

      vi.mocked(subscribeToToDos).mockReturnValue(unsubscribe);

      const result = subscribeToToDos(onData, onError, []);

      expect(result).toBe(unsubscribe);
      expect(subscribeToToDos).toHaveBeenCalledWith(onData, onError, []);
    });
  });

  describe("toggleTodoStatus", () => {
    it("should toggle todo status from incomplete to completed", async () => {
      const todoId = "1";
      const currentStatus: ToDo["status"] = "incomplete";

      vi.mocked(updateToDo).mockResolvedValue(undefined);

      await toggleTodoStatus(todoId, currentStatus);

      expect(updateToDo).toHaveBeenCalledWith(todoId, { status: "completed" });
    });

    it("should toggle todo status from completed to incomplete", async () => {
      const todoId = "1";
      const currentStatus: ToDo["status"] = "completed";

      vi.mocked(updateToDo).mockResolvedValue(undefined);

      await toggleTodoStatus(todoId, currentStatus);

      expect(updateToDo).toHaveBeenCalledWith(todoId, { status: "incomplete" });
    });

    it("should handle errors when toggling todo status", async () => {
      const todoId = "1";
      const currentStatus: ToDo["status"] = "incomplete";
      const errorMessage = "Failed to toggle todo status";

      vi.mocked(updateToDo).mockRejectedValue(
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
