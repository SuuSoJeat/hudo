import { FilterIcon } from "lucide-react";
import { FilterOptions } from "./filter-options";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

export const FilterTodoSheet = () => {
  return (
    <Sheet modal={false}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-lg"
          aria-label="Filter todos"
        >
          <FilterIcon className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-lg max-w-3xl mx-auto">
        <SheetHeader>
          <SheetTitle>
            <div className="flex items-center gap-2 select-none">
              <FilterIcon className="h-4 w-4" />
              Filter Todos
            </div>
          </SheetTitle>
          <SheetDescription className="flex select-none">
            Apply filters to your todo list
          </SheetDescription>
        </SheetHeader>
        <FilterOptions className="pb-2 pt-6" />
      </SheetContent>
    </Sheet>
  );
};
