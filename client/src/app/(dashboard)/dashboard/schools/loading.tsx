import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { StatCardsRowSkeleton } from "@/components/skeletons/StatCardSkeleton";

/**
 * Skeleton de la page /dashboard/schools
 * Structure : titre + filtres + 4 stats + tableau liste écoles
 */
export default function SchoolsLoading() {
  return (
    <div className="space-y-5 pb-8">
      {/* En-tête de page */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-3 w-64" />
        </div>
        <Skeleton className="h-8 w-36 rounded-lg" />
      </div>

      {/* 4 KPI cards */}
      <StatCardsRowSkeleton />

      {/* Barre de filtres */}
      <div className="flex items-center gap-2 flex-wrap">
        <Skeleton className="h-8 w-64 rounded-md" />
        <Skeleton className="h-8 w-28 rounded-md" />
        <Skeleton className="h-8 w-24 rounded-md" />
        <Skeleton className="h-8 w-24 rounded-md ml-auto" />
      </div>

      {/* Filtres de statut (pills) */}
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-24 rounded-full" />
        ))}
      </div>

      {/* Tableau des écoles */}
      <TableSkeleton cols={6} rows={5} />
    </div>
  );
}
