import { StatCardsRowSkeleton } from "@/components/skeletons/StatCardSkeleton";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { ChartSkeleton } from "@/components/skeletons/ChartSkeleton";
import { ActivityFeedSkeleton } from "@/components/skeletons/ActivityFeedSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton complet de la page principale du Dashboard.
 * Imite fidèlement la mise en page de la vraie page :
 *  - Breadcrumb + titre
 *  - Tabs de vue
 *  - Bannière d'alerte
 *  - 4 StatCards
 *  - Tableau écoles en attente + Journal d'activité (2 colonnes)
 *  - Graphique de croissance + panel support
 */
export function DashboardPageSkeleton() {
  return (
    <div className="space-y-5 pb-8">
      {/* Breadcrumb + titre */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Skeleton className="h-3 w-20 rounded" />
          <Skeleton className="h-3 w-3" />
          <Skeleton className="h-3 w-32 rounded" />
        </div>
        <Skeleton className="h-7 w-72 mb-1" />
        <Skeleton className="h-3 w-56" />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#e4eaf0] pb-2">
        <Skeleton className="h-7 w-32 rounded-md" />
        <Skeleton className="h-7 w-36 rounded-md" />
      </div>

      {/* Bannière alerte */}
      <Skeleton className="h-14 w-full rounded-xl" />

      {/* 4 KPI cards */}
      <StatCardsRowSkeleton />

      {/* Tableau + Journal côte à côte */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
        <TableSkeleton cols={6} rows={4} />
        <ActivityFeedSkeleton items={6} />
      </div>

      {/* Graphique + panel support côte à côte */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
        <ChartSkeleton height={200} />
        {/* Support panel */}
        <div className="rounded-xl border border-[#e4eaf0] bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 border-b border-[#f0f3f7] pb-3 last:border-0">
              <Skeleton className="h-9 w-9 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-5 w-16 rounded-full mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
