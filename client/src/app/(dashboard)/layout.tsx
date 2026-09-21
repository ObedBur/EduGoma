"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { DashboardSidebar, DashboardTopbar } from "@/components/layout/DashboardShared";

import { DashboardPageSkeleton } from "@/components/skeletons/DashboardPageSkeleton";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("edugoma_sidebar_collapsed");
    if (saved === "true") {
      setDesktopCollapsed(true);
    }
  }, []);

  const toggleDesktop = () => {
    const newVal = !desktopCollapsed;
    setDesktopCollapsed(newVal);
    localStorage.setItem("edugoma_sidebar_collapsed", newVal.toString());
  };

  if (isLoading) {
    return (
      <div className="h-screen overflow-hidden bg-[#f5f8fb] text-[#23394e] flex">
        <DashboardSidebar
          collapsed={false}
          desktopCollapsed={desktopCollapsed}
          onClose={() => {}}
        />
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <DashboardTopbar
            onMenu={() => {}}
            desktopCollapsed={desktopCollapsed}
            onToggleDesktop={toggleDesktop}
          />
          <main className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 lg:px-7">
            <DashboardPageSkeleton />
          </main>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="h-screen overflow-hidden bg-[#f5f8fb] text-[#23394e] flex">
      {/* Mobile backdrop — fond flouté avec transition */}
      <div
        className={`fixed inset-0 z-30 lg:hidden transition-all duration-300 ${menuOpen
            ? "bg-[#102d48]/30 backdrop-blur-sm pointer-events-auto"
            : "bg-transparent pointer-events-none"
          }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <DashboardSidebar
        collapsed={!menuOpen}
        desktopCollapsed={desktopCollapsed}
        onClose={() => setMenuOpen(false)}
      />

      {/* Colonne droite : occupe tout l'espace restant et ne scroll pas */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Topbar fixe en haut */}
        <DashboardTopbar
          onMenu={() => setMenuOpen(true)}
          desktopCollapsed={desktopCollapsed}
          onToggleDesktop={toggleDesktop}
        />
        {/* Zone scrollable — seule cette zone défile */}
        <main className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 lg:px-7">
          {children}
        </main>
      </div>
    </div>
  );
}
