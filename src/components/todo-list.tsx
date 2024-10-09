"use client";

import type { ToDo } from "@/types/todo";
import { useCallback, useMemo, useState } from "react";
import { TodoItem } from "./todo-item";
import { VirtualizedList } from "./virtualized-list";

import { useLiveTodos } from "@/hooks/use-live-todos";
import React from "react";

import { EmptyTodoState } from "./empty-todo-state";
import { Skeleton } from "./ui/skeleton";
import { ViewTodoDrawer } from "./view-todo-drawer";

export function TodoList() {
  const { todos, isLoading, isError, error } = useLiveTodos();
  const [selectedTodo, setSelectedTodo] = useState<ToDo | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleTodoClick = useCallback((todo: ToDo) => {
    setSelectedTodo(todo);
    setIsDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setSelectedTodo(null);
  }, []);

  const estimateSize = () => {
    return 69;
  };

  const memoizedRenderItem = (todo: ToDo) => (
    <TodoItem key={todo.id} todo={todo} onClick={handleTodoClick} />
  );

  const loadingSkeletons = useMemo(
    () => (
      <div className="space-y-2 mt-3">
        {Array.from({ length: 5 }, (_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Using index is enough here.
          <Skeleton key={index} className="mx-4 h-16" />
        ))}
      </div>
    ),
    [],
  );

  if (isLoading && todos.length === 0) return loadingSkeletons;

  if (isError)
    return (
      <div className="mx-4 flex flex-col items-center justify-center mt-8 p-4 bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-600 font-semibold mb-2">
          Oops! Something went wrong
        </p>
        <p className="text-red-500 text-center">
          {error?.message || "Failed to load todos"}
        </p>
      </div>
    );

  if (!isLoading && (!todos || todos.length === 0)) {
    return <EmptyTodoState />;
  }

  return (
    <>
      <VirtualizedList
        items={todos}
        renderItem={memoizedRenderItem}
        estimateSize={estimateSize}
      />
      {selectedTodo && (
        <ViewTodoDrawer
          todo={selectedTodo}
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
        />
      )}
    </>
  );
}
