import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";

/**
 * Skeleton de la page /dashboard/roles-permissions
 * Structure : titre + 2 colonnes (liste rôles + détail permissions)
 */
export default function RolesPermissionsLoading() {
  return (
    <div className="space-y-5 pb-8">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-3 w-60" />
        </div>
        <Skeleton className="h-8 w-32 rounded-lg" />
      </div>

      {/* 2 colonnes : liste rôles + matrice permissions */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[260px_1fr]">
        {/* Panneau liste des rôles */}
        <div className="rounded-xl border border-[#e4eaf0] bg-white p-4 shadow-sm space-y-2">
          <Skeleton className="h-4 w-32 mb-3" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2.5 border border-[#f0f3f7]">
              <Skeleton className="h-7 w-7 rounded-lg shrink-0" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-2 w-16" />
              </div>
              <Skeleton className="h-4 w-4 rounded" />
            </div>
          ))}
        </div>

        {/* Matrice des permissions */}
        <TableSkeleton cols={5} rows={6} />
      </div>
    </div>
  );
}
