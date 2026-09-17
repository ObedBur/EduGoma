import { Skeleton } from "@/components/ui/skeleton";
import { StatCardsRowSkeleton } from "@/components/skeletons/StatCardSkeleton";

/**
 * Skeleton de la page /dashboard/infrastructure
 * Structure : titre + 4 stats système + grille de noeuds/services
 */
export default function InfrastructureLoading() {
  return (
    <div className="space-y-5 pb-8">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-6 w-52" />
          <Skeleton className="h-3 w-64" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-3 w-36" />
        </div>
      </div>

      {/* 4 KPI système */}
      <StatCardsRowSkeleton />

      {/* Grille des services/noeuds */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[#e4eaf0] bg-white p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-2 w-20" />
                </div>
              </div>
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            {/* Barre de progression */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <Skeleton className="h-2 w-12" />
                <Skeleton className="h-2 w-8" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="space-y-1">
                  <Skeleton className="h-2 w-10" />
                  <Skeleton className="h-3 w-14" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
