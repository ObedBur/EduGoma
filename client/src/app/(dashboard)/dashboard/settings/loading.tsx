import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton de la page /dashboard/settings
 * Structure : titre + navigation onglets + formulaire de paramètres
 */
export default function SettingsLoading() {
  return (
    <div className="space-y-5 pb-8">
      {/* En-tête */}
      <div className="space-y-1.5">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-3 w-52" />
      </div>

      {/* Navigation onglets */}
      <div className="flex gap-1 border-b border-[#e4eaf0] pb-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-28 rounded-t-md" />
        ))}
      </div>

      {/* Corps : 2 colonnes (formulaire + panneau info) */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_280px]">
        {/* Formulaire principal */}
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, section) => (
            <div key={section} className="rounded-xl border border-[#e4eaf0] bg-white p-6 shadow-sm space-y-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-px w-full" />
              {Array.from({ length: 3 }).map((_, field) => (
                <div key={field} className="space-y-1.5">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
              ))}
              <div className="flex justify-end pt-2">
                <Skeleton className="h-8 w-28 rounded-md" />
              </div>
            </div>
          ))}
        </div>

        {/* Panneau latéral info */}
        <div className="space-y-4">
          <div className="rounded-xl border border-[#e4eaf0] bg-white p-5 shadow-sm space-y-3">
            <Skeleton className="h-4 w-32" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-[#f5c6cc] bg-[#fff5f5] p-5 space-y-3">
            <Skeleton className="h-4 w-36 bg-red-100" />
            <Skeleton className="h-3 w-full bg-red-100" />
            <Skeleton className="h-8 w-full rounded-md bg-red-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
