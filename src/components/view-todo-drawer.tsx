"use client";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { deleteTodo, subscribeTodoDoc } from "@/services/todo-service";
import type { Todo } from "@/types/todo";
import { handleError } from "@/utils/error-handler";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DeleteTodoConfirmation } from "./delete-todo-confirmation";
import { EditTodoDrawer } from "./edit-todo-drawer";

import { useToggleTodoStatus } from "@/hooks/use-toggle-todo-status";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";

type TodoDrawerProps = {
  todo: Todo;
  isOpen: boolean;
  onClose: () => void;
};

export const ViewTodoDrawer: React.FC<TodoDrawerProps> = ({
  todo,
  isOpen,
  onClose,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [liveTodo, setLiveTodo] = useState<Todo>(todo);
  const { toggleStatus, isToggling } = useToggleTodoStatus();

  useEffect(() => {
    const unsubscribe = subscribeTodoDoc(
      todo.id,
      (data) => {
        if (!data) return;
        setLiveTodo(data);
      },
      handleError,
    );
    return unsubscribe;
  }, [todo]);

  const handleToggleStatus = () => {
    toggleStatus(liveTodo);
  };

  const handleDelete = () => {
    try {
      deleteTodo(liveTodo.id);
      toast.success("Todo deleted", {
        description: "Task successfully removed from your list.",
      });
      onClose();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <Drawer
        repositionInputs={false}
        open={isOpen && !isEditing}
        onOpenChange={onClose}
      >
        <DrawerContent className="max-w-3xl mx-auto rounded-t-lg flex flex-col max-h-[99vh]">
          <DrawerHeader className="border-b px-4 py-4 flex justify-between items-center sticky top-0 bg-background z-10">
            <DrawerTitle className="text-lg font-semibold">Details</DrawerTitle>
            <div className="inline-flex items-center justify-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsEditing(true);
                }}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <DeleteTodoConfirmation onDelete={handleDelete}>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive border-destructive"
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </DeleteTodoConfirmation>
            </div>
            <DrawerDescription className="sr-only">
              View the details of your todo item
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 flex-1 overflow-y-auto">
            <div className="flex items-center gap-4 mb-4">
              <Checkbox
                checked={liveTodo.status === "completed"}
                onCheckedChange={handleToggleStatus}
                disabled={isToggling}
              />
              <span className="text-lg font-semibold break-words">
                {liveTodo.title}
              </span>
            </div>
            {liveTodo.description ? (
              <span className="text-secondary-foreground break-words">
                {liveTodo.description}
              </span>
            ) : (
              <span className="text-sm text-muted-foreground italic line-clamp-1">
                No description
              </span>
            )}
          </div>
        </DrawerContent>
      </Drawer>
      <EditTodoDrawer
        todo={liveTodo}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
      />
    </>
  );
};
