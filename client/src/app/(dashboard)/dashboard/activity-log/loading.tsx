import { Skeleton } from "@/components/ui/skeleton";
import { ActivityFeedSkeleton } from "@/components/skeletons/ActivityFeedSkeleton";

/**
 * Skeleton de la page /dashboard/activity-log
 * Structure : titre + filtres de date + journal d'activité pleine largeur
 */
export default function ActivityLogLoading() {
  return (
    <div className="space-y-5 pb-8">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-3 w-60" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-32 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-2 flex-wrap">
        <Skeleton className="h-8 w-48 rounded-md" />
        <Skeleton className="h-8 w-28 rounded-md" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-20 rounded-full" />
        ))}
      </div>

      {/* Journal pleine largeur */}
      <div className="rounded-xl border border-[#e4eaf0] bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#e4eaf0] px-4 py-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-24" />
        </div>
        <ActivityFeedSkeleton items={10} />
      </div>
    </div>
  );
}
