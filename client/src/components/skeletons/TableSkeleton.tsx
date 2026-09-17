import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  /** Nombre de colonnes à simuler */
  cols?: number;
  /** Nombre de lignes à simuler */
  rows?: number;
}

/**
 * Skeleton générique pour un tableau de données.
 * Imite un header + N lignes de données.
 */
export function TableSkeleton({ cols = 6, rows = 5 }: TableSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#e4eaf0] bg-white shadow-sm">
      {/* Section header au-dessus du tableau */}
      <div className="flex items-center justify-between border-b border-[#e4eaf0] px-4 py-3">
        <Skeleton className="h-4 w-44" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-24 rounded-md" />
          <Skeleton className="h-7 w-24 rounded-md" />
        </div>
      </div>

      {/* En-têtes colonnes */}
      <div
        className="grid gap-4 border-b border-[#eef1f5] bg-[#f8fafc] px-4 py-2.5"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-3/4" />
        ))}
      </div>

      {/* Lignes de données */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="grid gap-4 border-b border-[#f0f3f7] px-4 py-3 last:border-0"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: cols }).map((_, colIdx) => (
            <Skeleton
              key={colIdx}
              className={`h-3 ${colIdx === 0 ? "w-full" : colIdx === cols - 1 ? "w-16 rounded-full" : "w-2/3"}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
