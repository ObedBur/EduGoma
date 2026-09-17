import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton pour un graphique de type LineChart / BarChart.
 * Simule la zone de tracé + les axes + la légende.
 */
export function ChartSkeleton({ height = 220 }: { height?: number }) {
  return (
    <div className="rounded-xl border border-[#e4eaf0] bg-white p-5 shadow-sm">
      {/* Titre + sous-titre */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <Skeleton className="h-4 w-48 mb-2" />
          <Skeleton className="h-3 w-64" />
        </div>
        <Skeleton className="h-7 w-28 rounded-md" />
      </div>

      {/* Légende */}
      <div className="mb-3 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      {/* Zone de graphique */}
      <div className="relative w-full overflow-hidden rounded-lg bg-[#f8fafc]" style={{ height }}>
        {/* Lignes de grille horizontales simulées */}
        {[0.25, 0.5, 0.75].map((pos) => (
          <div
            key={pos}
            className="absolute left-0 right-0 border-t border-dashed border-[#e4eaf0]"
            style={{ top: `${pos * 100}%` }}
          />
        ))}
        {/* Courbe simulée avec un gradient */}
        <div className="absolute inset-0 flex items-end pb-4 px-4">
          <svg className="w-full h-full opacity-20" viewBox="0 0 400 160" preserveAspectRatio="none">
            <polyline
              points="0,140 60,110 120,90 180,70 240,55 300,40 360,25 400,18"
              fill="none"
              stroke="#4f8bb9"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Axe X labels */}
      <div className="mt-3 flex justify-between">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-2.5 w-8" />
        ))}
      </div>

      {/* Stats sous le graphique */}
      <div className="mt-4 grid grid-cols-3 gap-4 border-t border-[#f0f3f7] pt-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
