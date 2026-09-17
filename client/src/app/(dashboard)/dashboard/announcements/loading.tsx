import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton de la page /dashboard/announcements
 * Structure : titre + bouton créer + liste d'annonces avec statut
 */
export default function AnnouncementsLoading() {
  return (
    <div className="space-y-5 pb-8">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-3 w-60" />
        </div>
        <Skeleton className="h-8 w-40 rounded-lg" />
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-56 rounded-md" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-24 rounded-full" />
        ))}
      </div>

      {/* Liste des annonces */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[#e4eaf0] bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-5 w-72" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
              </div>
              <Skeleton className="h-7 w-7 rounded-lg shrink-0" />
            </div>
            <div className="flex items-center gap-4 pt-1 border-t border-[#f0f3f7]">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-24" />
              <div className="ml-auto flex gap-2">
                <Skeleton className="h-7 w-20 rounded-md" />
                <Skeleton className="h-7 w-20 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
