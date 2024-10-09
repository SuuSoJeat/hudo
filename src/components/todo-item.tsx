"use client";

import { toggleTodoStatus } from "@/services/todo-service";
import type { ToDo } from "@/types/todo";
import { handleError } from "@/utils/error-handler";
import { toast } from "sonner";
import { Checkbox } from "./ui/checkbox";

interface TodoItemProps {
  todo: ToDo;
  onClick: (todo: ToDo) => void;
}

export function TodoItem({ todo, onClick }: TodoItemProps) {
  async function handleToggleStatus(todo: ToDo) {
    try {
      await toggleTodoStatus(todo.id, todo.status);
      const newStatus =
        todo.status === "completed" ? "incomplete" : "completed";
      const message =
        newStatus === "completed"
          ? "Great job! Task completed."
          : "Task marked as incomplete. Keep going!";
      toast.success(message);
    } catch (error) {
      handleError(error);
    }
  }

  const handleOnClick = () => {
    onClick(todo);
  };

  return (
    <div
      onClick={handleOnClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleOnClick();
        }
      }}
      className="w-full"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b cursor-pointer">
        <div className="flex items-center space-x-3">
          <Checkbox
            checked={todo.status === "completed"}
            onCheckedChange={() => handleToggleStatus(todo)}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Mark todo "${todo.title}" as ${todo.status === "completed" ? "incomplete" : "completed"}`}
          />
          <div className="flex flex-col">
            <span
              className={`font-medium line-clamp-1 ${todo.status === "completed" ? "line-through text-gray-500" : ""}`}
            >
              {todo.title}
            </span>
            {todo.description ? (
              <span className="text-sm text-gray-600 line-clamp-1">
                {todo.description}
              </span>
            ) : (
              <span className="text-sm text-gray-400 italic line-clamp-1">
                No description
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
