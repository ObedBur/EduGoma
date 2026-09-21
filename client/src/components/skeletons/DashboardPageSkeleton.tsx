import { StatCardsRowSkeleton } from "@/components/skeletons/StatCardSkeleton";
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
    <div className="space-y-4 pb-8">
      {/* Breadcrumb + titre */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-2 flex items-center gap-1.5">
            <Skeleton className="h-3 w-48 rounded" />
          </div>
          <Skeleton className="h-6 w-80 sm:w-96 rounded mb-1" />
        </div>
        <Skeleton className="h-9 w-48 rounded-md" />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#dfe7ed] pb-2">
        <Skeleton className="h-8 w-40 rounded-t-md" />
        <Skeleton className="h-8 w-44 rounded" />
      </div>

      {/* 4 StatCards */}
      <StatCardsRowSkeleton />

      {/* Graphique de croissance + Journal d'activité */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <ChartSkeleton height={220} />
        </div>
        <div>
          <ActivityFeedSkeleton items={5} />
        </div>
      </div>
    </div>
  );
}
