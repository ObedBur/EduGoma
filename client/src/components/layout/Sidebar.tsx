"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  MessageSquare,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/dashboard/ecoles", label: "Écoles", icon: Building2 },
  { href: "/dashboard/demandes", label: "Demandes de démo", icon: MessageSquare },
] as const;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const initials = user
    ? (user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "")
    : "??";

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          group/sidebar fixed top-0 left-0 z-50 h-screen
          w-16 hover:w-60
          bg-gray-900 text-white
          flex flex-col
          transition-all duration-200 ease-in-out
          overflow-hidden
          md:translate-x-0
          ${open ? "w-60 translate-x-0" : "-translate-x-full"}
        `}
        onMouseLeave={onClose}
      >
        {/* Logo + Close */}
        <div className="flex items-center justify-between h-14 px-4 flex-shrink-0 border-b border-white/10">
          <Link
            href="/dashboard"
            className="text-lg font-bold text-brand-accent tracking-tight whitespace-nowrap"
          >
            EduGoma
          </Link>
          <button
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-white p-1 rounded focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label="Fermer le menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg
                  text-sm font-medium whitespace-nowrap
                  transition-colors duration-150
                  focus:outline-none focus:ring-2 focus:ring-white/30
                  ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }
                `}
                title={item.label}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-white/10 p-3 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-xs font-bold flex-shrink-0 uppercase">
              {initials}
            </div>
            <div className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150 min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user?.email ?? user?.phone ?? "—"}
              </p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="
              mt-3 w-full flex items-center gap-3 px-3 py-2 rounded-lg
              text-sm font-medium text-gray-400
              hover:bg-white/5 hover:text-white
              transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-white/30
              whitespace-nowrap
            "
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150">
              Déconnexion
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
