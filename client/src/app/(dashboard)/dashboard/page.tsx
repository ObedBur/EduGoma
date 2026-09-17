"use client";

import { useAuth } from "@/lib/auth-context";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Tableau de bord
      </h1>
      <p className="text-gray-500">
        Bienvenue{user?.firstName ? `, ${user.firstName}` : ""}. La gestion de vos écoles commence ici.
      </p>
    </div>
  );
}
