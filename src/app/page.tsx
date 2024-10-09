import { AppBar, AppBarActions, AppBarTitle } from "@/components/app-bar";
import { CreateTodoDrawer } from "@/components/create-todo-drawer";
import { FilterTodoSheet } from "@/components/filter-todo-sheet";
import { TodoCounter } from "@/components/todo-counter";
import { TodoList } from "@/components/todo-list";
import { APP } from "@/constants/app";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background max-w-3xl mx-auto min-w-[320px] font-[family-name:var(--font-geist-sans)]">
      <header className="sticky top-0 z-10">
        <AppBar>
          <AppBarTitle>
            <h2 className="text-xl font-bold select-none">{APP.TITLE}</h2>
            <Suspense>
              <TodoCounter />
            </Suspense>
          </AppBarTitle>
          <AppBarActions>
            <FilterTodoSheet />
            <CreateTodoDrawer />
          </AppBarActions>
        </AppBar>
      </header>
      <main>
        <Suspense>
          <TodoList />
        </Suspense>
      </main>
    </div>
  );
}
