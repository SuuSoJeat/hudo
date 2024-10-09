"use client";

import { useToggleTodoStatus } from "@/hooks/use-toggle-todo-status";
import type { ToDo } from "@/types/todo";
import { Checkbox } from "./ui/checkbox";

interface TodoItemProps {
  todo: ToDo;
  onClick: (todo: ToDo) => void;
}

export function TodoItem({ todo, onClick }: TodoItemProps) {
  const { toggleStatus, isToggling } = useToggleTodoStatus();

  function handleToggleStatus(todo: ToDo) {
    toggleStatus(todo);
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
            disabled={isToggling}
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
