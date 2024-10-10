import type { TodoFilter } from "@/types/todo";
import { Clipboard, PlusIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { CreateTodoDrawer } from "./create-todo-drawer";
import { Button } from "./ui/button";

export function EmptyTodoState() {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") as TodoFilter;
  const router = useRouter();

  const handleClearFilters = () => {
    router.push("/");
  };

  return (
    <div className="mx-4 flex flex-col items-center justify-center mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
      <Clipboard className="w-16 h-16 text-gray-400 mb-4" />
      {filter ? (
        <>
          <p className="text-lg font-semibold text-gray-700 mb-2">
            No matching todos
          </p>
          <p className="text-gray-500 text-center mb-4">
            Try adjusting your filters to see more todos.
          </p>
          <Button variant="outline" onClick={handleClearFilters}>
            Clear All Filters
          </Button>
        </>
      ) : (
        <>
          <p className="text-lg font-semibold text-gray-700 mb-2">
            No todos yet
          </p>
          <p className="text-gray-500 text-center mb-4">
            Create your first todo to get started!
          </p>
          <CreateTodoDrawer>
            <Button
              variant="outline"
              size="sm"
              aria-label="New todo"
              className="rounded-lg"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              New Todo
            </Button>
          </CreateTodoDrawer>
        </>
      )}
    </div>
  );
}
