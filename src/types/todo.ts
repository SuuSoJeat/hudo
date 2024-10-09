import { z } from "zod";

export const todoSchema = z.object({
  title: z.string().min(1, "Title must not be empty"),
  description: z.string().optional(),
  status: z.enum(["completed", "incomplete"] as const),
});

export type TodoData = z.infer<typeof todoSchema>;

export type Todo = TodoData & { id: string };

export type TodoFilter = Todo["status"] | null;
