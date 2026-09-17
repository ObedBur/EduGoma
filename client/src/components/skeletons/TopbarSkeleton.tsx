import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton pour la Topbar :
 * - Nom de l'utilisateur et breadcrumb
 * - Barre de recherche
 * - Avatar
 */
export function TopbarSkeleton() {
  return (
    <header className="flex h-[72px] items-center gap-3 border-b border-[#e3e9ef] bg-white px-5 lg:px-7">
      {/* Breadcrumb */}
      <div className="hidden md:flex items-center gap-2">
        <Skeleton className="h-3 w-20" />
        <span className="text-[#b0bec9]">/</span>
        <Skeleton className="h-3 w-28" />
      </div>

      {/* Search bar */}
      <div className="relative ml-auto flex w-full max-w-[318px] items-center">
        <Skeleton className="h-8 w-full rounded-md" />
      </div>

      {/* Bell */}
      <Skeleton className="h-8 w-8 rounded-lg" />

      {/* CTA button */}
      <Skeleton className="hidden sm:block h-8 w-36 rounded-md" />

      {/* Avatar */}
      <Skeleton className="h-8 w-8 rounded-full" />
    </header>
  );
}
