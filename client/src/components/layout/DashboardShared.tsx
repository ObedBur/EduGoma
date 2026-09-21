"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Bell,
  Building2,
  ChevronDown,
  CreditCard,
  Gauge,
  GraduationCap,
  Inbox,
  KeyRound,
  LayoutDashboard,
  Network,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
  Menu,
  LogOut,
  User,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Skeleton } from "@/components/ui/skeleton";

export type Icon = typeof LayoutDashboard;

type NavItem = {
  label: string;
  icon: Icon;
  badge?: string;
  href?: string;
};

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Platform control",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
      { label: "Écoles", icon: Building2, href: "/dashboard/schools" },
      { label: "Abonnements & Facturation", icon: CreditCard, badge: "2 impayés", href: "/dashboard/billing" },
      { label: "Demandes", icon: Inbox, badge: "4 pending", href: "/dashboard/requests" },
      { label: "Journal d'activité", icon: Activity, href: "/dashboard/activity-log" },
    ],
  },
  {
    label: "Users & access",
    items: [
      { label: "Utilisateurs", icon: Users, href: "/dashboard/users" },
      { label: "Rôles & Permissions", icon: ShieldCheck, href: "/dashboard/roles-permissions" },
    ],
  },
  {
    label: "Communication",
    items: [{ label: "Annonces plateforme", icon: Bell, href: "/dashboard/announcements" }],
  },
  {
    label: "Insights",
    items: [
      { label: "Rapports", icon: Gauge, href: "/dashboard/reports" },
      { label: "Infrastructure & Système", icon: Network, href: "/dashboard/infrastructure" },
    ],
  },
  {
    label: "Admin",
    items: [{ label: "Paramètres", icon: Settings, href: "/dashboard/settings" }],
  },
];

export function DashboardSidebar({ 
  collapsed, 
  desktopCollapsed,
  onClose 
}: { 
  collapsed: boolean; 
  desktopCollapsed?: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { user } = useAuth();

  const initials = user
    ? (user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "")
    : "JM";

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-[#dce4ec] bg-[#f8fafc] transition-all duration-300 ease-in-out lg:static lg:h-full lg:translate-x-0 lg:shrink-0 ${
        collapsed ? "-translate-x-full" : "translate-x-0"
      } ${desktopCollapsed ? "lg:w-[72px] w-[246px]" : "w-[246px]"}`}
    >
      <div className={`flex h-[72px] items-center gap-3 border-b border-[#e5ebf1] px-5 ${desktopCollapsed ? 'lg:justify-center' : ''}`}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0e2a44] text-white shadow-sm">
          <GraduationCap size={20} strokeWidth={2.3} />
        </div>
        <div className={`leading-none overflow-hidden transition-all duration-300 ${desktopCollapsed ? 'lg:w-0 lg:opacity-0' : 'w-auto opacity-100'}`}>
          <div className="text-[15px] font-extrabold tracking-[-0.03em] text-[#142c42]">EduGoma</div>
          <div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.13em] text-[#8793a2]">Super Admin</div>
        </div>
        <button
          onClick={onClose}
          className="ml-auto rounded-lg p-1 text-slate-400 hover:bg-slate-100 lg:hidden"
          aria-label="Fermer le menu"
        >
          <X size={18} />
        </button>
      </div>

      <nav className={`flex-1 overflow-y-auto py-5 ${desktopCollapsed ? 'lg:px-2 px-3' : 'px-3'}`}>
        {navGroups.map((group) => (
          <div key={group.label} className="mb-5">
            <p className={`mb-2 px-3 text-[9px] font-bold uppercase tracking-[0.12em] text-[#9aa5b1] transition-all duration-300 ${desktopCollapsed ? 'lg:hidden' : 'block'}`}>
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const IconComponent = item.icon;
                const active = item.href
                  ? item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href)
                  : false;
                const className = `group flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-[11px] font-medium transition ${
                  active
                    ? "bg-[#102d48] text-white shadow-[0_2px_5px_rgba(9,34,57,0.18)]"
                    : "text-[#687585] hover:bg-white hover:text-[#18344f]"
                } ${desktopCollapsed ? 'lg:justify-center lg:px-0' : ''}`;
                
                const content = (
                  <>
                    <IconComponent size={15} strokeWidth={active ? 2.4 : 1.7} className="shrink-0" />
                    <span className={`truncate transition-all duration-300 ${desktopCollapsed ? 'lg:w-0 lg:opacity-0 lg:hidden' : 'flex-1'}`}>
                      {item.label}
                    </span>
                    {item.badge && !desktopCollapsed && (
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold hidden lg:block ${
                          item.href === "/dashboard/requests"
                            ? "bg-[#e2f0ff] text-[#3f81b7]"
                            : "bg-[#ffe5e7] text-[#d76672]"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {/* Badge red dot for collapsed mode */}
                    {item.badge && desktopCollapsed && (
                      <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#d76672] hidden lg:block" />
                    )}
                  </>
                );
                return item.href ? (
                  <Link key={item.label} href={item.href} className={`relative ${className}`} onClick={onClose} title={desktopCollapsed ? item.label : undefined}>
                    {content}
                  </Link>
                ) : (
                  <button key={item.label} className={`relative ${className}`} title={desktopCollapsed ? item.label : undefined}>
                    {content}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className={`border-t border-[#e5ebf1] py-4 overflow-hidden transition-all duration-300 ${desktopCollapsed ? 'lg:px-2 lg:flex lg:justify-center px-4' : 'px-4'}`}>
        <div className={`mb-3 rounded-lg border border-[#dce8e7] bg-[#f0faf7] px-3 py-2.5 transition-all duration-300 ${desktopCollapsed ? 'lg:hidden' : 'block'}`}>
          <div className="flex items-center gap-2 text-[10px] font-semibold text-[#405e63]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#31ab80]" /> SYSTEM CLUSTER
          </div>
          <div className="mt-1 text-[10px] text-[#63777a]">DRC Central Cluster: Operational</div>
          <div className="mt-0.5 text-[10px] text-[#63777a]">Node GOM-01</div>
        </div>
        <div className={`flex items-center gap-2.5 ${desktopCollapsed ? 'lg:justify-center' : ''}`}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d8e5ec] text-[10px] font-bold text-[#42647c]">
            {initials || "JM"}
          </div>
          <div className={`min-w-0 transition-all duration-300 ${desktopCollapsed ? 'lg:w-0 lg:opacity-0 lg:hidden' : 'flex-1'}`}>
            <p className="truncate text-[10px] font-bold text-[#33485d]">
              {user ? `${user.firstName} ${user.lastName}` : "Dr. Julien Makiese"}
            </p>
            <p className="truncate text-[9px] text-[#8b96a4]">
              {user?.email ?? "superadmin@edugoma.cd"}
            </p>
          </div>
          {!desktopCollapsed && (
             <ChevronDown size={13} className="text-slate-400 shrink-0 hidden lg:block" />
          )}
        </div>
      </div>
    </aside>
  );
}

export function DashboardTopbar({ 
  onMenu, 
  desktopCollapsed, 
  onToggleDesktop 
}: { 
  onMenu: () => void;
  desktopCollapsed?: boolean;
  onToggleDesktop?: () => void;
}) {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const initials = user
    ? (user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "")
    : "";

  // Dynamic Breadcrumb
  const currentItem = navGroups.flatMap(g => g.items).find(item => 
    item.href === "/dashboard" 
      ? pathname === "/dashboard" 
      : item.href && pathname.startsWith(item.href)
  );

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex h-[72px] shrink-0 items-center gap-3 border-b border-[#e3e9ef] bg-white px-5 lg:px-7">
      <button
        onClick={onMenu}
        className="rounded-lg p-2 text-[#708090] hover:bg-slate-100 lg:hidden"
        aria-label="Ouvrir le menu"
      >
        <Menu size={20} />
      </button>

      {onToggleDesktop && (
        <button
          onClick={onToggleDesktop}
          className="hidden lg:flex items-center justify-center rounded-lg p-2 text-[#708090] hover:bg-slate-100 transition-colors"
          aria-label="Toggle Sidebar"
          title={desktopCollapsed ? "Agrandir le menu" : "Réduire le menu"}
        >
          {desktopCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      )}

      {/* Breadcrumb — skeleton si auth en cours */}
      <div className="hidden items-center gap-2 text-[10px] text-[#607182] md:flex lg:ml-2">
        {isLoading ? (
          <>
            <Skeleton className="h-3 w-20" />
            <span className="text-[#c5cdd7]">/</span>
            <Skeleton className="h-3 w-28" />
          </>
        ) : (
          <>
            <span className="font-bold uppercase tracking-[0.09em] text-[#1e3349]">
              {user?.roles ?? "Super Admin"}
            </span>
            <span>/</span>
            <span className="font-medium text-[#33485d]">
              {currentItem?.label || "Control Center"}
            </span>
          </>
        )}
      </div>

      {/* Search bar */}
      <div className="relative ml-auto flex w-full max-w-[280px] items-center">
        <Search size={14} className="absolute left-3 text-[#8d9aaa]" />
        <input
          className="h-8 w-full rounded-md border border-[#e0e7ee] bg-[#f7f9fb] pl-9 pr-3 text-[10px] text-[#33485c] outline-none placeholder:text-[#9aa6b4] focus:border-[#76a8cd] transition-colors"
          placeholder="Rechercher une école, un admin..."
        />
      </div>

      {/* Notifications */}
      <button className="relative rounded-lg p-2 text-[#5f7183] hover:bg-slate-50 transition-colors ml-2" aria-label="Notifications">
        <Bell size={16} />
        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#d85a68]" />
      </button>

      {/* CTA */}
      <button className="hidden h-8 items-center gap-1.5 rounded-md bg-[#102d48] px-3 text-[10px] font-bold text-white shadow-sm transition hover:bg-[#193d5e] sm:flex ml-1">
        <span className="text-base leading-none">+</span> Inscrire une école
      </button>

      {/* Avatar with Dropdown */}
      <div className="relative ml-2" ref={profileRef}>
        <button 
          onClick={() => setProfileOpen(!profileOpen)}
          className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-[#102d48] focus:ring-offset-2 transition-all"
        >
          {isLoading ? (
            <Skeleton className="h-8 w-8 rounded-full" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#c9dce5] text-[10px] font-extrabold text-[#406079] shadow-sm hover:shadow-md transition-all">
              {initials || "?"}
            </div>
          )}
        </button>

        {/* Dropdown Menu */}
        {profileOpen && !isLoading && (
          <div className="absolute right-0 mt-3 w-56 origin-top-right rounded-lg border border-[#e4eaf0] bg-white py-1 shadow-lg shadow-slate-200/50 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
            <div className="px-4 py-3 border-b border-[#f1f5f9]">
              <p className="text-[12px] font-bold text-[#142c42] truncate">
                {user ? `${user.firstName} ${user.lastName}` : "Dr. Julien Makiese"}
              </p>
              <p className="text-[10px] text-[#8793a2] truncate mt-0.5">
                {user?.email ?? "superadmin@edugoma.cd"}
              </p>
            </div>
            
            <div className="py-1">
              <Link
                href="/dashboard/profile"
                onClick={() => setProfileOpen(false)}
                className="group flex w-full items-center gap-2 px-4 py-2 text-[12px] font-medium text-[#4b5563] hover:bg-[#f8fafc] hover:text-[#142c42] transition-colors"
              >
                <User size={14} className="text-[#9ca3af] group-hover:text-[#142c42]" />
                Mon Profil
              </Link>
              <Link
                href="/dashboard/settings"
                onClick={() => setProfileOpen(false)}
                className="group flex w-full items-center gap-2 px-4 py-2 text-[12px] font-medium text-[#4b5563] hover:bg-[#f8fafc] hover:text-[#142c42] transition-colors"
              >
                <Settings size={14} className="text-[#9ca3af] group-hover:text-[#142c42]" />
                Préférences
              </Link>
            </div>
            
            <div className="border-t border-[#f1f5f9] py-1">
              <button
                onClick={() => {
                  setProfileOpen(false);
                  logout?.();
                }}
                className="group flex w-full items-center gap-2 px-4 py-2 text-[12px] font-medium text-[#ef4444] hover:bg-[#fef2f2] transition-colors"
              >
                <LogOut size={14} className="text-[#ef4444]" />
                Se déconnecter
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export function StatCard({
  label,
  value,
  detail,
  trend,
  icon: IconComponent,
  accent = "blue",
}: {
  label: string;
  value: string;
  detail: React.ReactNode;
  trend?: string;
  icon: Icon;
  accent?: "blue" | "green" | "orange" | "violet";
}) {
  const accents = {
    blue: "bg-[#eaf3fa] text-[#2c6e9e]",
    green: "bg-[#e8f7f0] text-[#228e68]",
    orange: "bg-[#fef3e6] text-[#b6732f]",
    violet: "bg-[#f0edfd] text-[#6355b8]",
  };
  const isNeutralTrend = !trend || trend === "+0" || trend === "+0.0%" || trend === "0%";
  const isNegativeTrend = trend ? trend.startsWith("-") : false;

  return (
    <div className="rounded-xl border border-[#e4eaf0] bg-white p-4 shadow-[0_2px_8px_rgba(20,40,65,0.03)] hover:shadow-[0_4px_12px_rgba(20,40,65,0.06)] hover:border-[#cfdbe5] transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#7d8c9a]">{label}</p>
          <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${accents[accent]}`}>
            <IconComponent size={14} />
          </span>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <p className="text-[26px] font-extrabold tracking-[-0.04em] text-[#152a3d]">{value}</p>
          {trend && (
            <span
              className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                isNeutralTrend
                  ? "bg-[#f0f3f6] text-[#7d8c9a]"
                  : isNegativeTrend
                  ? "bg-[#fdeeed] text-[#c04845]"
                  : "bg-[#e5f7ef] text-[#23906b]"
              }`}
            >
              {trend}
            </span>
          )}
        </div>
      </div>
      <div className="mt-3.5 pt-2.5 border-t border-[#f0f4f7] flex items-center justify-between gap-2 text-[10px] text-[#6d7f90]">
        {detail}
      </div>
    </div>
  );
}
