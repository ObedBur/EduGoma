import { ChartSkeleton } from "@/components/skeletons/ChartSkeleton";
import { ActivityFeedSkeleton } from "@/components/skeletons/ActivityFeedSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton complet de la page principale du Dashboard.
 * Grille 12 colonnes unifiée :
 *  - Breadcrumb + titre
 *  - Tabs de vue
 *  - 4 StatCards (3 col × 4)
 *  - Analytics Grid : Graphique (9 col) + Journal (3 col)
 *  - Bottom Grid : 3 Métriques (3 col × 3) + Panel tickets (3 col)
 */
export function DashboardPageSkeleton() {
  return (
    <div className="space-y-5 pb-8">
      {/* Breadcrumb + titre */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-2 flex items-center gap-1.5">
            <Skeleton className="h-4 w-52 rounded" />
          </div>
          <Skeleton className="h-7 w-80 rounded sm:w-96" />
        </div>
        <Skeleton className="h-10 w-48 rounded-lg" />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#dfe7ed] pb-0">
        <Skeleton className="h-9 w-40 rounded-t-lg" />
        <Skeleton className="h-8 w-48 rounded" />
      </div>

      {/* 4 StatCards — 12 col, 4 × col-span-3 */}
      <div className="grid grid-cols-12 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="col-span-12 sm:col-span-6 xl:col-span-3">
            <div className="rounded-xl border border-[#e4eaf0] bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-start justify-between">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-7 w-7 rounded-lg" />
              </div>
              <Skeleton className="mb-2 h-8 w-16" />
              <Skeleton className="h-2.5 w-32" />
            </div>
          </div>
        ))}
      </div>

      {/* Ligne 1 — 9 col chart + 3 col activity */}
      <div className="grid grid-cols-12 items-stretch gap-3">
        <div className="col-span-12 min-h-[320px] min-w-0 xl:col-span-9">
          <ChartSkeleton height={260} />
        </div>
        <div className="col-span-12 min-h-[320px] xl:col-span-3">
          <ActivityFeedSkeleton items={5} />
        </div>
      </div>

      {/* Bottom Grid — 4 × col-span-3 (12 colonnes) */}
      <div className="grid grid-cols-12 items-stretch gap-3">
        {/* 3 metric tiles */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="col-span-12 sm:col-span-6 xl:col-span-3">
            <div className="flex h-full flex-col justify-between rounded-xl border border-[#e4eaf0] bg-white p-4 shadow-sm" style={{ minHeight: 120 }}>
              <div>
                <Skeleton className="mb-3 h-3 w-28" />
                <Skeleton className="h-7 w-20" />
              </div>
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
          </div>
        ))}
        {/* ticket panel */}
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <div className="rounded-xl border border-[#e4eaf0] bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-[#edf1f4] px-4 py-3.5">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="divide-y divide-[#f0f3f7]">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start justify-between px-4 py-3">
                  <div className="flex-1 space-y-1.5 pr-3">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-4/5" />
                      <Skeleton className="h-4 w-12 rounded" />
                    </div>
                    <Skeleton className="h-2.5 w-3/4" />
                    <Skeleton className="h-2.5 w-24" />
                  </div>
                  <div className="shrink-0 space-y-1 text-right">
                    <Skeleton className="h-2.5 w-8" />
                    <Skeleton className="h-4 w-16 rounded" />
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-[#edf1f4]">
              <Skeleton className="mx-auto my-2.5 h-3 w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
