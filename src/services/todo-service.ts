import { db } from "@/lib/firebase";
import { type ToDo, type TodoFilter, toDoSchema } from "@/types/todo";
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
  schema: toDoSchema,
});

export const {
  subscribeCol: subscribeToDoCol,
  subscribeDoc: subscribeToDoDoc,
  getAll: getToDos,
  add: addToDo,
  update: updateToDo,
  remove: deleteToDo,
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
  currentStatus: ToDo["status"],
): Promise<void> {
  try {
    const newStatus: ToDo["status"] =
      currentStatus === "completed" ? "incomplete" : "completed";
    await updateToDo(id, { status: newStatus });
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
//   onData: (items: ToDo[]) => void,
//   onError: (error: FirestoreOperationError | ValidationError) => void,
// ): () => void {
//   return subscribeToToDos(onData, onError, completedTodosQuery);
// }

// Example: Subscribing to incomplete todos
// export function subscribeToIncompleteTodos(
//   onData: (items: ToDo[]) => void,
//   onError: (error: FirestoreOperationError | ValidationError) => void,
// ): () => void {
//   return subscribeToToDos(onData, onError, incompleteTodosQuery);
// }

// Example: Getting completed todos
// export async function getCompletedTodos(): Promise<ToDo[]> {
//   try {
//     return await getToDos(completedTodosQuery);
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
// export async function getIncompleteTodos(): Promise<ToDo[]> {
//   try {
//     return await getToDos(incompleteTodosQuery);
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
