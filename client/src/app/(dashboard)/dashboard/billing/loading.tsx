import { Skeleton } from "@/components/ui/skeleton";
import { StatCardsRowSkeleton } from "@/components/skeletons/StatCardSkeleton";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";

/**
 * Skeleton de la page /dashboard/billing
 * Structure : titre + 4 stats + tableau de facturation + panneau récapitulatif
 */
export default function BillingLoading() {
  return (
    <div className="space-y-5 pb-8">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-3 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-32 rounded-md" />
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>
      </div>

      {/* 4 KPI cards */}
      <StatCardsRowSkeleton />

      {/* Tableau + panneau latéral */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_300px]">
        {/* Tableau des abonnements */}
        <TableSkeleton cols={5} rows={6} />

        {/* Panneau récapitulatif */}
        <div className="rounded-xl border border-[#e4eaf0] bg-white p-5 shadow-sm space-y-4">
          <Skeleton className="h-4 w-40" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-4 w-16 rounded-full" />
              </div>
            ))}
          </div>
          <Skeleton className="h-px w-full" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-8 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
