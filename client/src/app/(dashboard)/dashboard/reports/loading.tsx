import { Skeleton } from "@/components/ui/skeleton";
import { ChartSkeleton } from "@/components/skeletons/ChartSkeleton";
import { StatCardsRowSkeleton } from "@/components/skeletons/StatCardSkeleton";

/**
 * Skeleton de la page /dashboard/reports
 * Structure : titre + 4 stats + 2 graphiques côte à côte + tableau récapitulatif
 */
export default function ReportsLoading() {
  return (
    <div className="space-y-5 pb-8">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-3 w-56" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-32 rounded-md" />
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>
      </div>

      {/* Sélecteur de période */}
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-20 rounded-full" />
        ))}
      </div>

      {/* 4 KPI */}
      <StatCardsRowSkeleton />

      {/* 2 graphiques côte à côte */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartSkeleton height={220} />
        <ChartSkeleton height={220} />
      </div>

      {/* Tableau récapitulatif */}
      <div className="rounded-xl border border-[#e4eaf0] bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#e4eaf0] px-4 py-3">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-7 w-24 rounded-md" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-5 gap-4 border-b border-[#f0f3f7] px-4 py-3 last:border-0">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
