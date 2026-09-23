"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { DashboardSidebar, DashboardTopbar } from "@/components/layout/DashboardShared";
import { DashboardPageSkeleton } from "@/components/skeletons/DashboardPageSkeleton";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, impersonating, stopImpersonation } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [stopping, setStopping] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("edugoma_sidebar_collapsed");
    if (saved === "true") {
      setDesktopCollapsed(true);
    }
  }, []);

  // Redirection propre dans un useEffect pour ne pas bloquer le render
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  const toggleDesktop = () => {
    const newVal = !desktopCollapsed;
    setDesktopCollapsed(newVal);
    localStorage.setItem("edugoma_sidebar_collapsed", newVal.toString());
  };

  const handleStopImpersonation = async () => {
    setStopping(true);
    try {
      await stopImpersonation();
      router.push("/dashboard/schools");
    } finally {
      setStopping(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="h-screen overflow-hidden bg-[#f5f8fb] text-[#23394e] flex">
        <DashboardSidebar
          collapsed={false}
          desktopCollapsed={desktopCollapsed}
          onClose={() => {}}
          onToggleDesktop={toggleDesktop}
        />
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <DashboardTopbar
            onMenu={() => {}}
            desktopCollapsed={desktopCollapsed}
            onToggleDesktop={toggleDesktop}
          />
          <main className="flex-1 overflow-y-auto w-full box-border px-4 py-5 sm:px-6">
            <DashboardPageSkeleton />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-[#f5f8fb] text-[#23394e] flex">
      {/* Mobile backdrop — fond flouté avec transition */}
      <div
        className={`fixed inset-0 z-30 lg:hidden transition-all duration-300 ${
          menuOpen
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
        onToggleDesktop={toggleDesktop}
      />

      {/* Colonne droite : occupe tout l'espace restant et ne scroll pas */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Topbar fixe en haut */}
        <DashboardTopbar
          onMenu={() => setMenuOpen(true)}
          desktopCollapsed={desktopCollapsed}
          onToggleDesktop={toggleDesktop}
        />

        {/* Bandeau impersonation (plan #3) */}
        {impersonating && (
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f0d9a8] bg-[#fff8e8] px-4 py-2">
            <p className="text-[11px] font-semibold text-[#8a6a1f]">
              Vous êtes connecté en tant que&nbsp;
              <strong>{impersonating.name}</strong>
              <span className="ml-1 text-[10px] font-normal text-[#a08840]">(session temporaire · 30 min)</span>
            </p>
            <button
              type="button"
              onClick={handleStopImpersonation}
              disabled={stopping}
              className="flex cursor-pointer items-center gap-1.5 rounded-md border border-[#e0c48a] bg-white px-3 py-1.5 text-[10px] font-bold text-[#8a6a1f] hover:bg-[#fff4d6] disabled:opacity-60"
            >
              <LogOut size={12} />
              {stopping ? "Quitter…" : "Quitter"}
            </button>
          </div>
        )}

        {/* Zone scrollable — seule cette zone défile */}
        <main className="flex-1 overflow-y-auto w-full box-border px-4 py-5 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
