import { Skeleton } from "@/components/ui/skeleton";
import { StatCardsRowSkeleton } from "@/components/skeletons/StatCardSkeleton";

/**
 * Skeleton de la page /dashboard/requests
 * Structure : titre + 4 stats + liste de demandes avec priorité et catégorie
 */
export default function RequestsLoading() {
  return (
    <div className="space-y-5 pb-8">
      {/* En-tête de page */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-3 w-52" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-28 rounded-md" />
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>
      </div>

      {/* 4 KPI cards */}
      <StatCardsRowSkeleton />

      {/* Barre de filtres */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-56 rounded-md" />
        <Skeleton className="h-8 w-28 rounded-md" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-24 rounded-full" />
        ))}
      </div>

      {/* Liste des demandes */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-[#e4eaf0] bg-white p-4 shadow-sm"
          >
            <div className="flex items-start gap-4">
              {/* Icône catégorie */}
              <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                {/* Ligne 1 : titre + badge priorité */}
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                {/* Ligne 2 : description */}
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
                {/* Ligne 3 : méta (école, date, âge) */}
                <div className="flex items-center gap-4 pt-1">
                  <Skeleton className="h-3 w-40" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-16" />
                  <div className="ml-auto flex gap-2">
                    <Skeleton className="h-7 w-20 rounded-md" />
                    <Skeleton className="h-7 w-20 rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
