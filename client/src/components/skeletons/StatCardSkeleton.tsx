import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton pour une StatCard KPI.
 * À utiliser dans une grille de 4 colonnes.
 */
export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-[#e4eaf0] bg-white p-5 shadow-sm">
      {/* Header : label + icône */}
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-7 w-7 rounded-lg" />
      </div>
      {/* Valeur principale */}
      <Skeleton className="h-8 w-24 mb-2" />
      {/* Badge de tendance */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-12 rounded-full" />
        <Skeleton className="h-3 w-20" />
      </div>
      {/* Footer */}
      <Skeleton className="h-3 w-full mt-3" />
    </div>
  );
}

/**
 * Grille de 4 StatCardSkeletons côte à côte.
 */
export function StatCardsRowSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}
