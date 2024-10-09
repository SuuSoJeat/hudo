"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

type FilterOption = {
  value: string;
  label: string;
};

const filterOptions: readonly FilterOption[] = [
  { value: "all", label: "All todos" },
  { value: "incomplete", label: "Incomplete" },
  { value: "completed", label: "Completed" },
] as const;

interface FilterOptionsProps {
  className?: string | undefined;
}

export const FilterOptions: React.FC<FilterOptionsProps> = ({ className }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentFilter: string = useMemo(() => {
    const filter = searchParams.get("filter");
    if (!filter || !filterOptions.some((option) => option.value === filter)) {
      return filterOptions[0].value;
    }

    return filter;
  }, [searchParams]);

  const handleFilterChange = useCallback(
    (value: string) => {
      if (!value) return;

      const params = new URLSearchParams(searchParams);
      if (value === filterOptions[0].value) {
        params.delete("filter");
      } else {
        params.set("filter", value);
      }

      const newPath = `${pathname}?${params.toString()}`;
      router.push(newPath, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  return (
    <ToggleGroup
      type="single"
      value={currentFilter}
      onValueChange={handleFilterChange}
      className={`flex flex-wrap justify-start gap-2 ${className ?? ""}`}
    >
      {filterOptions.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          aria-label={`Filter by ${option.label.toLowerCase()}`}
          className="justify-start"
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};
