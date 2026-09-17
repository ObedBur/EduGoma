import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton pour les badges dynamiques de la Sidebar
 * (ex: "2 impayés", "4 pending").
 */
export function SidebarBadgeSkeleton() {
  return <Skeleton className="h-4 w-8 rounded-full" />;
}
