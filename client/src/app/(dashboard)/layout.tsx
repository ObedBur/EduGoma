"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Sidebar } from "@/components/layout/Sidebar";
import { AppHeader } from "@/components/layout/AppHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auth loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Desktop: content pushed right by sidebar width */}
      <div className="md:pl-16 min-h-screen flex flex-col">
        <AppHeader onMenuToggle={() => setSidebarOpen(true)} />

        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
