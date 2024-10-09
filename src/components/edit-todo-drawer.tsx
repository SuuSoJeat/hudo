"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import type { ToDo } from "@/types/todo";
import { Pencil } from "lucide-react";
import { TodoForm } from "./todo-form";
import { Button } from "./ui/button";

type TodoDrawerProps = {
  todo: ToDo;
  isOpen: boolean;
  onClose: () => void;
};

export const EditTodoDrawer: React.FC<TodoDrawerProps> = ({
  todo,
  isOpen,
  onClose,
}) => {
  return (
    <Drawer repositionInputs={false} open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-w-3xl mx-auto rounded-t-lg flex flex-col max-h-[99vh]">
        <DrawerHeader className="border-b px-4 py-4 flex justify-between items-center sticky top-0 bg-background z-10">
          <DrawerTitle className="text-lg font-semibold">
            <span className="flex-row gap-2 flex items-center">
              <Pencil className="w-4 h-4" />
              Edit
            </span>
          </DrawerTitle>
          <DrawerClose asChild>
            <Button size="sm" variant="secondary">
              Cancel
            </Button>
          </DrawerClose>
          <DrawerDescription className="sr-only">
            Edit your todo item details
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 flex-1 overflow-y-auto">
          <TodoForm todo={todo} mode="edit" onSubmitted={onClose} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
