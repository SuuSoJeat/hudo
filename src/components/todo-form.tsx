"use client";

import { addTodo, updateTodo } from "@/services/todo-service";
import { type Todo, todoSchema } from "@/types/todo";
import { handleError } from "@/utils/error-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormSubmit } from "./form-components";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface TodoFormProps {
  mode: "create" | "edit" | "read-only";
  todo?: Todo;
  onSubmitted: (data: Todo) => void;
  children?: React.ReactNode;
}

export const TodoForm: React.FC<TodoFormProps> = ({
  mode,
  todo,
  onSubmitted,
  children,
}) => {
  const form = useForm<Todo>({
    resolver: zodResolver(todoSchema),
    defaultValues:
      mode === "create"
        ? {
            title: "",
            description: "",
            status: "incomplete",
          }
        : {
            title: todo?.title ?? "",
            description: todo?.description ?? "",
            status: todo?.status ?? "incomplete",
          },
  });

  const onSubmit = useCallback(
    async (data: Todo) => {
      try {
        const sanitizedData = {
          ...data,
          title: data.title.trim(),
          description: data.description?.trim(),
        };

        if (mode === "edit" && todo) {
          await updateTodo(todo.id, sanitizedData);
          toast.success("Todo updated", {
            description: "Your task has been updated.",
          });
        } else if (mode === "create") {
          await addTodo(sanitizedData);
          toast.success("Todo added", {
            description: "New task added to your list.",
          });
        }
        onSubmitted(sanitizedData);
      } catch (error) {
        handleError(error);
      }
    },
    [mode, todo, onSubmitted],
  );

  const isReadOnly = mode === "read-only";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="What do you need to do?"
                  {...field}
                  readOnly={isReadOnly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Add any details or notes about this task..."
                  {...field}
                  readOnly={isReadOnly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {children ??
          (!isReadOnly && (
            <FormSubmit className="w-full">
              {mode === "create" ? "Add Todo" : "Update Todo"}
            </FormSubmit>
          ))}
      </form>
    </Form>
  );
};
