import { z } from "zod";

export const toDoSchema = z.object({
  title: z.string().min(1, "Title must not be empty"),
  description: z.string().optional(),
  status: z.enum(["completed", "incomplete"] as const),
});

export type ToDoData = z.infer<typeof toDoSchema>;

export type ToDo = ToDoData & { id: string };

export type TodoFilter = ToDo["status"] | null;
