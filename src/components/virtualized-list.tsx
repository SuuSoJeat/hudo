"use client";

import {
  type VirtualItem,
  useWindowVirtualizer,
} from "@tanstack/react-virtual";

type VirtualizedListProps<T> = {
  items: T[];
  renderItem: (item: T, virtualItem: VirtualItem) => React.ReactNode;
  estimateSize: (index: number) => number;
  overscan?: number | undefined;
};

export function VirtualizedList<T>({
  items,
  renderItem,
  estimateSize,
  overscan,
}: VirtualizedListProps<T>) {
  const virtualizer = useWindowVirtualizer({
    count: items.length,
    estimateSize: estimateSize,
    overscan,
    scrollMargin: 0,
  });

  return (
    <div className="overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            data-index={virtualItem.index}
            ref={virtualizer.measureElement}
            className="absolute top-0 left-0 w-full"
            style={{
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {renderItem(items[virtualItem.index], virtualItem)}
          </div>
        ))}
      </div>
    </div>
  );
}
