import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { StatCardsRowSkeleton } from "@/components/skeletons/StatCardSkeleton";

/**
 * Skeleton de la page /dashboard/users
 * Structure : titre + 4 stats + barre de recherche + tableau utilisateurs
 */
export default function UsersLoading() {
  return (
    <div className="space-y-5 pb-8">
      {/* En-tête de page */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-3 w-56" />
        </div>
        <Skeleton className="h-8 w-36 rounded-lg" />
      </div>

      {/* 4 KPI cards */}
      <StatCardsRowSkeleton />

      {/* Barre de recherche + filtres */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-64 rounded-md" />
        <Skeleton className="h-8 w-28 rounded-md" />
        <Skeleton className="h-8 w-28 rounded-md" />
      </div>

      {/* Tableau utilisateurs (avatar + nom + école + rôle + statut + actions) */}
      <div className="overflow-hidden rounded-xl border border-[#e4eaf0] bg-white shadow-sm">
        {/* Header tableau */}
        <div className="flex items-center justify-between border-b border-[#e4eaf0] px-4 py-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-7 w-24 rounded-md" />
        </div>
        {/* En-têtes colonnes */}
        <div className="grid grid-cols-6 gap-4 border-b border-[#eef1f5] bg-[#f8fafc] px-4 py-2.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-3/4" />
          ))}
        </div>
        {/* Lignes utilisateurs avec avatar */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-6 gap-4 items-center border-b border-[#f0f3f7] px-4 py-3 last:border-0"
          >
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-7 rounded-full shrink-0" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-2 w-32" />
              </div>
            </div>
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-6 rounded-md ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
