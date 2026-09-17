import { DashboardPageSkeleton } from "@/components/skeletons/DashboardPageSkeleton";

/**
 * Next.js loading.tsx — s'affiche automatiquement via Suspense
 * pendant que la page /dashboard charge ses données côté serveur.
 */
export default function DashboardLoading() {
  return (
    <div className="px-4 py-4 sm:px-6 lg:px-7">
      <DashboardPageSkeleton />
    </div>
  );
}
