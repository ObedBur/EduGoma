import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton pour le journal d'activité (feed latéral droit).
 * Simule N entrées d'événement avec icône, texte et timestamp.
 */
export function ActivityFeedSkeleton({ items = 6 }: { items?: number }) {
  return (
    <div className="rounded-xl border border-[#e4eaf0] bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#e4eaf0] px-4 py-3">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>

      {/* Items */}
      <div className="divide-y divide-[#f0f3f7]">
        {Array.from({ length: items }).map((_, i) => (
          <div key={i} className="flex gap-3 px-4 py-3">
            {/* Icône */}
            <Skeleton className="h-7 w-7 rounded-lg flex-shrink-0 mt-0.5" />
            {/* Texte */}
            <div className="flex-1 min-w-0 space-y-1.5">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-2.5 w-16 mt-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Footer link */}
      <div className="border-t border-[#e4eaf0] px-4 py-3">
        <Skeleton className="h-3 w-48 mx-auto" />
      </div>
    </div>
  );
}
