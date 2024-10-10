"use client";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { FormActions, FormSubmit } from "./form-components";
import { TodoForm } from "./todo-form";
import { Button } from "./ui/button";

type CreateTodoDrawerProps = {
  children?: React.ReactNode;
};

export const CreateTodoDrawer: React.FC<CreateTodoDrawerProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer repositionInputs={false} open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        {children ?? (
          <Button size="sm" aria-label="New todo" className="rounded-lg">
            <PlusIcon className="h-4 w-4 mr-1" />
            New Todo
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="max-w-3xl mx-auto rounded-t-lg flex flex-col max-h-[99vh]">
        <DrawerHeader className="sticky top-0 bg-background z-10">
          <DrawerTitle className="text-lg font-semibold">Add Task</DrawerTitle>
          <DrawerDescription>
            Create a new item for your to-do list
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-4 flex-1 overflow-y-auto">
          <TodoForm
            mode="create"
            onSubmitted={() => {
              setIsOpen(false);
            }}
          >
            <FormActions asChild>
              <DrawerFooter className="flex flex-row gap-2 w-full">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <FormSubmit className="flex-1">Add Todo</FormSubmit>
              </DrawerFooter>
            </FormActions>
          </TodoForm>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
