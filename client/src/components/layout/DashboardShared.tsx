"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  Bell,
  Building2,
  ChevronDown,
  GraduationCap,
  Inbox,
  LayoutDashboard,
  Network,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
  LogOut,
  User,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { alertsApi, type Alert } from "@/lib/api";
import {
  fetchPriorityAlerts,
  setCachedPriorityAlerts,
  subscribePriorityAlerts,
} from "@/lib/priority-alerts";

export type Icon = typeof LayoutDashboard;

/**
 * Icône de menu mobile haute visibilité EduGoma
 * Deux barres nettes, franches, modernes (style Linear / Raycast / OpenAI)
 */
export function EduGomaMenuIcon({
  className = "h-5 w-5",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <line
        x1="3.5"
        y1="8.5"
        x2="20.5"
        y2="8.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="3.5"
        y1="15.5"
        x2="15.5"
        y2="15.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

type NavItem = {
  label: string;
  icon: Icon;
  badge?: string;
  href?: string;
};

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Pilotage",
    items: [
      { label: "Tableau de bord", icon: LayoutDashboard, href: "/dashboard" },
      { label: "Écoles", icon: Building2, href: "/dashboard/schools" },
      { label: "Demandes", icon: Inbox, href: "/dashboard/requests" },
      { label: "Journal d'activité", icon: Activity, href: "/dashboard/activity-log" },
    ],
  },
  {
    label: "Utilisateurs",
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
    label: "Suivi",
    items: [
      { label: "État du service", icon: Network, href: "/dashboard/infrastructure" },
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
  onClose,
  onToggleDesktop
}: { 
  collapsed: boolean; 
  desktopCollapsed?: boolean; 
  onClose: () => void;
  onToggleDesktop?: () => void;
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
      <div className={`flex h-[72px] items-center gap-3 border-b border-[#e5ebf1] px-5 ${desktopCollapsed ? 'lg:justify-center lg:px-2' : ''}`}>
        <button
          type="button"
          onClick={desktopCollapsed ? onToggleDesktop : undefined}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0e2a44] text-white shadow-sm transition-transform ${
            desktopCollapsed ? 'cursor-pointer hover:scale-105 hover:bg-[#163a5c]' : 'cursor-default'
          }`}
          title={desktopCollapsed ? "Agrandir le menu latéral" : "EduGoma"}
          aria-label={desktopCollapsed ? "Agrandir le menu latéral" : "EduGoma"}
        >
          <GraduationCap size={20} strokeWidth={2.3} />
        </button>
        <div className={`leading-none overflow-hidden transition-all duration-300 ${desktopCollapsed ? 'lg:w-0 lg:opacity-0 lg:hidden' : 'w-auto opacity-100'}`}>
          <div className="text-[15px] font-extrabold tracking-[-0.03em] text-[#142c42]">EduGoma</div>
          <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.13em] text-[#8793a2]">Super Admin</div>
        </div>

        {/* Bouton de fermeture / réduction dans le header de la sidebar (Style ChatGPT) */}
        {!desktopCollapsed && (
          <>
            {/* Sur desktop : bouton Réduire (PanelLeftClose) style ChatGPT */}
            {onToggleDesktop && (
              <button
                type="button"
                onClick={onToggleDesktop}
                className="cursor-pointer ml-auto hidden lg:flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200/70 hover:text-[#102d48] active:scale-95 transition-all"
                title="Réduire le menu latéral"
                aria-label="Réduire le menu latéral"
              >
                <PanelLeftClose size={18} strokeWidth={2.2} />
              </button>
            )}
            {/* Sur mobile / tablette (drawer) : bouton Fermer (PanelLeftClose) */}
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer ml-auto flex lg:hidden h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200/70 hover:text-[#102d48] active:scale-95 transition-all"
              title="Fermer le menu"
              aria-label="Fermer le menu"
            >
              <PanelLeftClose size={18} strokeWidth={2.2} />
            </button>
          </>
        )}
      </div>

      <nav className={`flex-1 overflow-y-auto py-5 ${desktopCollapsed ? 'lg:px-2 px-3' : 'px-3'}`}>
        {navGroups.map((group) => (
          <div key={group.label} className="mb-5">
            <p className={`mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#9aa5b1] transition-all duration-300 ${desktopCollapsed ? 'lg:hidden' : 'block'}`}>
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
                        className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold hidden lg:block ${
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
                  <button key={item.label} className={`cursor-pointer relative ${className}`} title={desktopCollapsed ? item.label : undefined}>
                    {content}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className={`border-t border-[#e5ebf1] py-4 overflow-hidden transition-all duration-300 ${desktopCollapsed ? 'lg:px-2 lg:flex lg:justify-center px-4' : 'px-4'}`}>
        <div className={`flex items-center gap-2.5 ${desktopCollapsed ? 'lg:justify-center' : ''}`}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d8e5ec] text-[11px] font-bold text-[#42647c]">
            {initials || "JM"}
          </div>
          <div className={`min-w-0 transition-all duration-300 ${desktopCollapsed ? 'lg:w-0 lg:opacity-0 lg:hidden' : 'flex-1'}`}>
            <p className="truncate text-[11px] font-bold text-[#33485d]">
              {user ? `${user.firstName} ${user.lastName}` : "Dr. Julien Makiese"}
            </p>
            <p className="truncate text-[11px] text-[#8b96a4]">
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
  const isSchoolsPage = pathname.startsWith("/dashboard/schools");
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifAlerts, setNotifAlerts] = useState<Alert[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const initials = user
    ? (user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "")
    : "";

  // Dynamic Breadcrumb
  const currentItem = navGroups.flatMap(g => g.items).find(item => 
    item.href === "/dashboard" 
      ? pathname === "/dashboard" 
      : item.href && pathname.startsWith(item.href)
  );

  // Source partagée : cache court + même limite que le dashboard
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const alerts = await fetchPriorityAlerts();
        if (!cancelled) setNotifAlerts(alerts);
      } catch {
        // Silencieux
      }
    })();
    const unsubscribe = subscribePriorityAlerts((alerts) => {
      if (!cancelled) setNotifAlerts(alerts);
    });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleNotif = async () => {
    const next = !notifOpen;
    setNotifOpen(next);
    if (next) {
      setNotifLoading(true);
      try {
        // Force uniquement si le cache est expiré (fetchPriorityAlerts gère le TTL)
        const alerts = await fetchPriorityAlerts();
        setNotifAlerts(alerts);
      } catch {
        // Silencieux
      } finally {
        setNotifLoading(false);
      }
    }
  };

  const handleResolveAlert = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await alertsApi.resolve(id);
      const next = notifAlerts.filter((a) => a.id !== id);
      setNotifAlerts(next);
      setCachedPriorityAlerts(next);
    } catch {
      // Silencieux
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard/schools?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleToggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      onMenu();
    } else if (onToggleDesktop) {
      onToggleDesktop();
    }
  };

  return (
    <>
    <header className="flex h-16 sm:h-[72px] shrink-0 items-center gap-1.5 sm:gap-3 border-b border-[#e3e9ef] bg-white px-2.5 sm:px-5 lg:px-7">
      {/* Bouton Menu Topbar :
          - Sur desktop : Visible UNIQUEMENT si la sidebar est réduite (pour la ré-ouvrir style ChatGPT avec PanelLeftOpen)
          - Sur mobile/tablette (<1024px) : Toujours visible pour ouvrir le drawer latéral
      */}
      <button
        onClick={handleToggleSidebar}
        className={`cursor-pointer h-9 w-9 items-center justify-center rounded-xl bg-slate-100/90 text-[#142c42] hover:bg-slate-200/90 hover:text-[#0b1f33] active:scale-95 transition-all shrink-0 border border-slate-200/70 shadow-2xs ${
          desktopCollapsed ? "flex" : "flex lg:hidden"
        }`}
        aria-label={desktopCollapsed ? "Agrandir le menu latéral" : "Ouvrir le menu"}
        title={desktopCollapsed ? "Agrandir le menu latéral" : "Ouvrir le menu"}
      >
        {desktopCollapsed ? (
          <PanelLeftOpen size={18} strokeWidth={2.2} />
        ) : (
          <EduGomaMenuIcon className="h-5 w-5" />
        )}
      </button>

      {/* Breadcrumb — skeleton si auth en cours (visible à partir de md) */}
      <div className="hidden items-center gap-2 text-[11px] text-[#607182] md:flex ml-1">
        {isLoading ? (
          <>
            <Skeleton className="h-3 w-20" />
            <span className="text-[#c5cdd7]">/</span>
            <Skeleton className="h-3 w-28" />
          </>
        ) : (
          <>
            <span className="font-bold uppercase tracking-[0.09em] text-[#1e3349]">
              {(user?.roles ?? []).join(" · ") || "Super Admin"}
            </span>
            <span>/</span>
            <span className="font-medium text-[#33485d]">
              {currentItem?.label || "Tableau de bord"}
            </span>
          </>
        )}
      </div>

      {/* Search bar fonctionnelle et responsive — masquée sur /dashboard/schools où la recherche du tableau fait foi */}
      {!isSchoolsPage && (
      <form
        onSubmit={handleSearchSubmit}
        className="relative ml-auto flex w-full max-w-[125px] xs:max-w-[170px] sm:max-w-[240px] md:max-w-[280px] items-center"
      >
        <Search size={13} className="absolute left-2.5 sm:left-3 text-[#8d9aaa] pointer-events-none" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-8 w-full rounded-md border border-[#e0e7ee] bg-[#f7f9fb] pl-7 sm:pl-9 pr-6 sm:pr-7 text-[11px] text-[#33485c] outline-none placeholder:text-[#9aa6b4] focus:border-[#76a8cd] focus:bg-white transition-colors"
          placeholder="Rechercher..."
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="cursor-pointer absolute right-1.5 sm:right-2 text-[#9aa6b4] hover:text-[#33485c]"
            title="Effacer la recherche"
          >
            <X size={12} />
          </button>
        )}
      </form>
      )}

      {/* Notifications — Cloche interactive avec compteur réel */}
      <div className="relative ml-1 sm:ml-2" ref={notifRef}>
        <button
          onClick={toggleNotif}
          className={`cursor-pointer relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
            notifOpen ? "bg-slate-100 text-[#102d48]" : "text-[#5f7183] hover:bg-slate-50 hover:text-[#102d48]"
          }`}
          aria-label="Notifications"
          aria-expanded={notifOpen}
        >
          <Bell size={17} />
          {notifAlerts.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#d85a68] px-1 text-[11px] font-bold text-white shadow-xs animate-in zoom-in-50">
              {notifAlerts.length}
            </span>
          )}
        </button>

        {notifOpen && (
          <div className="fixed sm:absolute inset-x-2.5 sm:inset-x-auto sm:right-0 top-[66px] sm:top-full z-50 mt-1 sm:mt-2 w-auto sm:w-[360px] max-w-[calc(100vw-20px)] rounded-xl border border-[#e4eaf0] bg-white shadow-[0_10px_30px_rgba(20,40,65,0.16)] overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#edf1f4] bg-slate-50/70 px-4 py-3">
              <div className="flex items-center gap-2">
                <h3 className="text-[12px] font-bold text-[#1a2f42]">Notifications</h3>
                {notifAlerts.length > 0 && (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-700">
                    {notifAlerts.length} active{notifAlerts.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <Link
                href="/dashboard/activity-log"
                className="text-[11px] font-semibold text-[#2f6f9f] hover:underline"
                onClick={() => setNotifOpen(false)}
              >
                Journal d&apos;activité →
              </Link>
            </div>

            <div className="max-h-[340px] overflow-y-auto divide-y divide-[#f0f4f7] scrollbar-thin">
              {notifLoading ? (
                <div className="space-y-2 p-3">
                  {[0, 1, 2].map((i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-lg" />
                  ))}
                </div>
              ) : notifAlerts.length === 0 ? (
                <div className="p-8 text-center">
                  <CheckCircle2 size={26} className="mx-auto text-emerald-500 mb-2" />
                  <p className="text-[11px] font-bold text-[#23394e]">Tout est sous contrôle</p>
                  <p className="text-[11px] text-[#8c9ca9] mt-0.5">Aucune alerte prioritaire en attente</p>
                </div>
              ) : (
                notifAlerts.map((a) => {
                  const isCrit = a.severity === "critical";
                  const isWarn = a.severity === "warning";
                  return (
                    <div
                      key={a.id}
                      className={`p-3.5 transition-colors hover:bg-slate-50/80 flex items-start gap-3 ${
                        isCrit ? "bg-red-50/30" : isWarn ? "bg-orange-50/20" : "bg-white"
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                          isCrit
                            ? "bg-red-100 text-red-600"
                            : isWarn
                            ? "bg-orange-100 text-orange-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {isCrit ? <AlertCircle size={14} /> : isWarn ? <AlertTriangle size={14} /> : <Info size={14} />}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[11px] font-bold text-[#1a2f42] leading-tight">{a.title}</p>
                          <button
                            onClick={(e) => handleResolveAlert(a.id, e)}
                            title="Marquer comme résolu"
                            className="cursor-pointer shrink-0 rounded px-1.5 py-0.5 text-[11px] font-semibold text-[#6e8294] hover:bg-white hover:text-emerald-700 hover:shadow-xs border border-transparent hover:border-[#d5e0ea] transition-all"
                          >
                            Résoudre
                          </button>
                        </div>
                        <p className="mt-1 text-[11px] text-[#5a6f80] leading-snug line-clamp-2">{a.message}</p>
                        <div className="mt-1.5 flex items-center gap-2 text-[11px] text-[#9aa6b2]">
                          <span className="font-semibold uppercase tracking-wider">{a.source || "SYSTÈME"}</span>
                          <span>•</span>
                          <span>{new Date(a.createdAt).toLocaleDateString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Avatar with Dropdown */}
      <div className="relative ml-1 sm:ml-2" ref={profileRef}>
        <button 
          onClick={() => setProfileOpen(!profileOpen)}
          className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#c9dce5] text-[11px] font-extrabold text-[#406079] shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#102d48] focus:ring-offset-2 transition-all"
          aria-label="Menu profil"
        >
          {isLoading ? (
            <Skeleton className="h-8 w-8 rounded-full" />
          ) : (
            <span>{initials || "?"}</span>
          )}
        </button>

        {/* Dropdown Menu responsive */}
        {profileOpen && !isLoading && (
          <div className="fixed sm:absolute inset-x-2.5 sm:inset-x-auto sm:right-0 top-[66px] sm:top-full z-50 mt-1 sm:mt-3 w-auto sm:w-56 max-w-[calc(100vw-20px)] origin-top-right rounded-lg border border-[#e4eaf0] bg-white py-1 shadow-lg shadow-slate-200/50 ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-4 py-3 border-b border-[#f1f5f9]">
              <p className="text-[12px] font-bold text-[#142c42] truncate">
                {user ? `${user.firstName} ${user.lastName}` : "Dr. Julien Makiese"}
              </p>
              <p className="text-[11px] text-[#8793a2] truncate mt-0.5">
                {user?.email ?? "superadmin@edugoma.cd"}
              </p>
            </div>
            
            <div className="py-1">
              <Link
                href="/dashboard/settings"
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
                className="cursor-pointer group flex w-full items-center gap-2 px-4 py-2 text-[12px] font-medium text-[#ef4444] hover:bg-[#fef2f2] transition-colors"
              >
                <LogOut size={14} className="text-[#ef4444]" />
                Se déconnecter
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
    </>
  );
}

export function StatCard({
  label,
  value,
  detail,
  trend,
  icon: IconComponent,
  accent = "blue",
  onClick,
  active = false,
}: {
  label: string;
  value: string;
  detail: React.ReactNode;
  trend?: string;
  icon: Icon;
  accent?: "blue" | "green" | "orange" | "violet";
  /** Rend la carte cliquable (ex. filtrer la liste). Sans onClick, carte statique. */
  onClick?: () => void;
  /** État actif : la carte reflète le filtre actuellement appliqué. */
  active?: boolean;
}) {
  const accents = {
    blue: "bg-[#eaf3fa] text-[#2c6e9e]",
    green: "bg-[#e8f7f0] text-[#228e68]",
    orange: "bg-[#fef3e6] text-[#b6732f]",
    violet: "bg-[#f0edfd] text-[#6355b8]",
  };
  const isNeutralTrend = !trend || trend === "+0" || trend === "+0.0%" || trend === "0%";
  const isNegativeTrend = trend ? trend.startsWith("-") : false;
  const interactive = typeof onClick === "function" && Boolean(onClick);

  return (
    <div
      {...(interactive
        ? {
            role: "button",
            tabIndex: 0,
            "aria-pressed": active,
            onClick,
            onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            },
          }
        : {})}
      className={`h-full rounded-xl border bg-white p-4 shadow-[0_2px_8px_rgba(20,40,65,0.03)] flex flex-col justify-between transition-all duration-200 ${
        interactive ? "cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#76a8cd]" : ""
      } ${
        active
          ? "border-[#76a8cd] bg-[#f5fafd] shadow-[0_4px_12px_rgba(20,40,65,0.08)] ring-1 ring-[#76a8cd]"
          : "border-[#e4eaf0] hover:shadow-[0_4px_12px_rgba(20,40,65,0.06)] hover:border-[#cfdbe5]"
      }`}
    >
      <div>
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#5a6b7c]">{label}</p>
          <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${accents[accent]}`}>
            <IconComponent size={14} />
          </span>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <p className="text-[26px] font-extrabold tracking-[-0.04em] text-[#152a3d]">{value}</p>
          {trend && (
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                isNeutralTrend
                  ? "bg-[#f0f3f6] text-[#5a6b7c]"
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
      <div className="mt-3.5 pt-2.5 border-t border-[#f0f4f7] flex items-center justify-between gap-2 text-[11px] text-[#64748b]">
        {detail}
      </div>
    </div>
  );
}
