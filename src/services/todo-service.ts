import { db } from "@/lib/firebase";
import { type Todo, type TodoFilter, todoSchema } from "@/types/todo";
import { FirestoreOperationError, ValidationError } from "@/utils/errors";
import { type QueryConstraint, where } from "firebase/firestore";
import { createFirestoreService } from "./firestore-service";

// Predefined query constraints for completed and incomplete todos
const completedTodosQuery: QueryConstraint[] = [
  where("status", "==", "completed"),
];
const incompleteTodosQuery: QueryConstraint[] = [
  where("status", "==", "incomplete"),
];

const todoService = createFirestoreService({
  db,
  collectionName: "todos",
  schema: todoSchema,
});

export const {
  subscribeCol: subscribeTodoCol,
  subscribeDoc: subscribeTodoDoc,
  getAll: getTodos,
  add: addTodo,
  update: updateTodo,
  remove: deleteTodo,
} = todoService;

/**
 * Returns query constraints based on the provided todo filter.
 * @param filter - The filter to apply (completed, incomplete, or all(null))
 * @returns An array of QueryConstraints
 */
export function getQueryConstraintsForTodoFilter(
  filter: TodoFilter,
): QueryConstraint[] {
  switch (filter) {
    case "completed":
      return completedTodosQuery;
    case "incomplete":
      return incompleteTodosQuery;
    default:
      return [];
  }
}

/**
 * Toggles the status of a todo item between completed and incomplete.
 * @param id - The ID of the todo item
 * @param currentStatus - The current status of the todo item
 * @throws {ValidationError | FirestoreOperationError} If validation or Firestore operation fails
 */
export async function toggleTodoStatus(
  id: string,
  currentStatus: Todo["status"],
): Promise<void> {
  try {
    const newStatus: Todo["status"] =
      currentStatus === "completed" ? "incomplete" : "completed";
    await updateTodo(id, { status: newStatus });
  } catch (error) {
    if (
      error instanceof ValidationError ||
      error instanceof FirestoreOperationError
    ) {
      throw error;
    }
    throw new FirestoreOperationError(
      "toggleTodoStatus",
      (error as Error).message,
    );
  }
}

// Example: Subscribing to completed todos
// export function subscribeToCompletedTodos(
//   onData: (items: Todo[]) => void,
//   onError: (error: FirestoreOperationError | ValidationError) => void,
// ): () => void {
//   return subscribeToTodos(onData, onError, completedTodosQuery);
// }

// Example: Subscribing to incomplete todos
// export function subscribeToIncompleteTodos(
//   onData: (items: Todo[]) => void,
//   onError: (error: FirestoreOperationError | ValidationError) => void,
// ): () => void {
//   return subscribeToTodos(onData, onError, incompleteTodosQuery);
// }

// Example: Getting completed todos
// export async function getCompletedTodos(): Promise<Todo[]> {
//   try {
//     return await getTodos(completedTodosQuery);
//   } catch (error) {
//     if (
//       error instanceof ValidationError ||
//       error instanceof FirestoreOperationError
//     ) {
//       throw error;
//     }
//     throw new FirestoreOperationError(
//       "getCompletedTodos",
//       (error as Error).message,
//     );
//   }
// }

// Example: Getting incomplete todos
// export async function getIncompleteTodos(): Promise<Todo[]> {
//   try {
//     return await getTodos(incompleteTodosQuery);
//   } catch (error) {
//     if (
//       error instanceof ValidationError ||
//       error instanceof FirestoreOperationError
//     ) {
//       throw error;
//     }
//     throw new FirestoreOperationError(
//       "getIncompleteTodos",
//       (error as Error).message,
//     );
//   }
// }
