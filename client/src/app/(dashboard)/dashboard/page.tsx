"use client";

import {
  Activity as ActivityIcon,
  AlertCircle,
  ArrowUpRight,
  Bell,
  Building2,
  CheckCircle2,
  CircleHelp,
  Clock3,
  Database,
  Download,
  FileCheck2,
  GraduationCap,
  HardDrive,
  Inbox,
  KeyRound,
  LayoutDashboard,
  LifeBuoy as LifeBuoyIcon,
  ListFilter,
  Network,
  Server,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { StatCard } from "@/components/layout/DashboardShared";
import { useDashboard, type DashboardSection, type SectionStatuses, type SectionErrors } from "@/hooks/use-dashboard";
import { StatCardSkeleton } from "@/components/skeletons/StatCardSkeleton";
import { ChartSkeleton } from "@/components/skeletons/ChartSkeleton";
import { ActivityFeedSkeleton } from "@/components/skeletons/ActivityFeedSkeleton";
import { DashboardPageSkeleton } from "@/components/skeletons/DashboardPageSkeleton";
import type { Alert, MetricsData, SystemHealth, Ticket } from "@/lib/api";
import { useState } from "react";
import Link from "next/link";

// ── Color maps ──────────────────────────────────────────────

const formatTrend = (trend: string | null | undefined): string | undefined => {
  if (!trend) return trend ?? undefined;
  const cleaned = trend.replace("%", "").replace(",", ".").trim();
  const num = Number.parseFloat(cleaned);
  if (Number.isNaN(num)) return trend;
  const abs = Math.abs(num);
  const rounded = abs >= 10 ? Math.round(num) : Math.round(num * 10) / 10;
  if (rounded === 0) return "0 %";
  const sign = rounded > 0 ? "+" : "-";
  const value = String(Math.abs(rounded)).replace(".", ",");
  return `${sign}${value} %`;
};

// Un trend n'est affiché que si la base est significative et la variation non nulle
function visibleTrend(trend: string | null | undefined, base: number): string | undefined {
  if (base < 5) return undefined;
  const formatted = formatTrend(trend);
  if (!formatted) return undefined;
  const num = Number.parseFloat(formatted.replace("%", "").replace(",", ".").trim());
  if (Number.isNaN(num) || num === 0) return undefined;
  return formatted;
}

function timeAgo(iso: string): string {
  const diffMin = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diffMin < 1) return "à l’instant";
  if (diffMin < 60) return `il y a ${diffMin} min`;
  if (diffMin < 1440) return `il y a ${Math.floor(diffMin / 60)} h`;
  return `il y a ${Math.floor(diffMin / 1440)} j`;
}

const SEVERITY_COLORS: Record<string, { bg: string; text: string; border: string; accent: string; icon: typeof AlertCircle }> = {
  critical: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", accent: "border-l-red-500", icon: AlertCircle },
  warning: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", accent: "border-l-orange-400", icon: AlertCircle },
  info: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", accent: "border-l-blue-400", icon: Bell },
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  open: { bg: "bg-red-50", text: "text-red-700" },
  in_progress: { bg: "bg-orange-50", text: "text-orange-700" },
  resolved: { bg: "bg-emerald-50", text: "text-emerald-700" },
  closed: { bg: "bg-slate-100", text: "text-slate-600" },
};

const PRIORITY_COLORS: Record<string, { bg: string; text: string }> = {
  critical: { bg: "bg-red-50", text: "text-red-700" },
  urgent: { bg: "bg-orange-50", text: "text-orange-700" },
  normal: { bg: "bg-slate-50", text: "text-slate-600" },
  low: { bg: "bg-blue-50", text: "text-blue-700" },
};

const STATUS_LABELS: Record<string, string> = {
  open: "Ouvert",
  in_progress: "En traitement",
  resolved: "Résolu",
  closed: "Fermé",
};

const PRIORITY_LABELS: Record<string, string> = {
  critical: "Critique",
  urgent: "Urgent",
  normal: "Normal",
  low: "Faible",
};

const ACTIVITY_ICONS: Record<string, { icon: typeof ActivityIcon; color: string }> = {
  ACCESS_GRANTED: { icon: CheckCircle2, color: "text-emerald-500" },
  SCHOOL_CREATED: { icon: FileCheck2, color: "text-sky-500" },
  DOSSIER_SUBMITTED: { icon: FileCheck2, color: "text-sky-500" },
  DOSSIER_REJECTED: { icon: AlertCircle, color: "text-rose-500" },
  SUBSCRIPTION_SUSPENDED: { icon: AlertCircle, color: "text-rose-500" },
  SUBSCRIPTION_REACTIVATED: { icon: CheckCircle2, color: "text-emerald-500" },
  SUBSCRIPTION_MARKED_PAID: { icon: CheckCircle2, color: "text-emerald-500" },
  ACCOUNT_DEACTIVATED: { icon: AlertCircle, color: "text-rose-500" },
  LOGIN_SUCCESS: { icon: KeyRound, color: "text-violet-500" },
  LOGIN_FAILED: { icon: AlertCircle, color: "text-rose-500" },
  USER_REGISTERED: { icon: Users, color: "text-sky-500" },
  PASSWORD_CHANGED: { icon: KeyRound, color: "text-violet-500" },
  ROLE_ASSIGNED: { icon: ShieldCheck, color: "text-violet-500" },
};

const ACTIVITY_LABELS: Record<string, string> = {
  ACCESS_GRANTED: "Accès école activé",
  SCHOOL_CREATED: "École créée",
  DOSSIER_SUBMITTED: "Dossier d'inscription soumis",
  DOSSIER_REJECTED: "Dossier rejeté",
  SUBSCRIPTION_SUSPENDED: "Abonnement suspendu",
  SUBSCRIPTION_REACTIVATED: "Abonnement réactivé",
  SUBSCRIPTION_MARKED_PAID: "Paiement de l'abonnement enregistré",
  ACCOUNT_DEACTIVATED: "Compte désactivé",
  LOGIN_SUCCESS: "Connexion réussie",
  LOGIN_FAILED: "Connexion échouée",
  USER_REGISTERED: "Utilisateur inscrit",
  PASSWORD_CHANGED: "Mot de passe modifié",
  ROLE_ASSIGNED: "Rôle assigné",
};

const SCOPE_LABELS: Record<string, string> = {
  PAYMENT: "Paiement",
  TENANT: "École",
  action: "Action",
  AUTH: "Authentification",
  USER: "Utilisateurs",
  SYSTEM: "Système",
};

const SEVERITY_LABELS: Record<string, string> = {
  critical: "Critique",
  warning: "Avertissement",
  info: "Info",
};

// ── AlertPanel ──────────────────────────────────────────────

function AlertPanel({ alerts }: { alerts: Alert[] }) {
  if (alerts.length === 0) return null;

  return (
    <section className="rounded-md border border-[#e4eaf0] bg-white shadow-[0_2px_7px_rgba(33,60,84,0.025)]">
      <div className="flex items-center justify-between border-b border-[#edf1f4] px-4 py-3">
        <h2 className="flex items-center gap-2 text-[12px] font-bold text-[#23394e]">
          <Bell size={13} className="text-red-500" /> Alertes priorité
        </h2>
        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-700">
          {alerts.length}
        </span>
      </div>
      <div className="px-3 py-1">
        {alerts.map((alert) => {
          const colors = SEVERITY_COLORS[alert.severity] ?? SEVERITY_COLORS.info;
          const IconComp = colors.icon;
          return (
            <div
              key={alert.id}
              className={`border-b border-l-2 border-[#f0f3f5] ${colors.accent} py-2 pl-2.5 pr-1 last:border-b-0`}
            >
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <IconComp size={12} className={`shrink-0 ${colors.text}`} />
                <p className="min-w-0 flex-1 basis-36 text-[12px] font-bold text-[#344b5f]">{alert.title}</p>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${colors.bg} ${colors.text}`}>
                  {SEVERITY_LABELS[alert.severity] ?? alert.severity}
                </span>
                <span className="shrink-0 text-[11px] font-medium text-[#9aa6b1]">{timeAgo(alert.createdAt)}</span>
              </div>
              <p className="mt-0.5 pl-5 text-[11px] leading-snug text-[#87939f]">
                {alert.message}
                {alert.source ? ` · Source : ${alert.source}` : ""}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── TicketPanel ─────────────────────────────────────────────

function TicketPanel({ tickets }: { tickets: Ticket[] }) {
  return (
    <section className="flex h-full flex-col rounded-xl border border-[#e4eaf0] bg-white shadow-[0_2px_8px_rgba(20,40,65,0.03)]">
      <div className="flex items-center justify-between border-b border-[#edf1f4] px-4 py-3">
        <h2 className="flex items-center gap-2 text-[12px] font-bold text-[#1a2f42]">
          <LifeBuoyIcon size={14} className="text-[#3b82f6]" /> Assistance &amp; Activation Écoles
        </h2>
        <span className="rounded-full bg-[#e8f7f0] px-2 py-0.5 text-[11px] font-bold text-[#208a65]">Délai garanti (&lt; 24h)</span>
      </div>
      <div className="flex-1 overflow-y-auto px-4 max-h-[165px] [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent]">
        {tickets.length === 0 ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#edf9f3] text-[#2ba075]">
              <CheckCircle2 size={16} />
            </div>
            <p className="text-[11px] font-bold text-[#2e475d]">Aucun ticket en attente</p>
            <p className="mt-0.5 text-[12px] text-[#8e9ca8]">Toutes les demandes ont été traitées</p>
          </div>
        ) : (
          tickets.map((ticket) => {
            const statusColor = STATUS_COLORS[ticket.status] ?? STATUS_COLORS.open;
            const priorityColor = PRIORITY_COLORS[ticket.priority] ?? PRIORITY_COLORS.normal;
            const created = new Date(ticket.createdAt);
            const now = new Date();
            const diffMin = Math.floor((now.getTime() - created.getTime()) / 60000);
            const timeLabel = diffMin < 60 ? `${diffMin}m` : diffMin < 1440 ? `${Math.floor(diffMin / 60)}h` : `${Math.floor(diffMin / 1440)}j`;

            return (
              <div key={ticket.id} className="flex items-start justify-between border-b border-[#f0f3f5] py-2 last:border-0">
                <div className="min-w-0 flex-1 pr-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-[12px] font-bold text-[#2a4053] truncate">{ticket.title}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${priorityColor.bg} ${priorityColor.text}`}>
                      {PRIORITY_LABELS[ticket.priority] ?? ticket.priority}
                    </span>
                  </div>
                  {ticket.description && (
                    <p className="mt-0.5 text-[11px] text-[#7d8c9a] line-clamp-2 leading-relaxed">{ticket.description}</p>
                  )}
                  <div className="mt-1 flex flex-col gap-0.5 text-[11px] text-[#8e9ca8]">
                    {ticket.schoolName && (
                      <span className="font-semibold text-[#4e6477]">{ticket.schoolName}</span>
                    )}
                    {ticket.requester && (
                      <span>{ticket.requester}</span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[11px] font-medium text-[#9aa6b1]">{timeLabel}</span>
                  <span className={`mt-1 block rounded-full px-2 py-0.5 text-[11px] font-bold ${statusColor.bg} ${statusColor.text}`}>
                    {STATUS_LABELS[ticket.status] ?? ticket.status}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
      <Link
        href="/dashboard/requests"
        className="mt-auto block w-full border-t border-[#edf1f4] py-2 text-center text-[12px] font-bold text-[#356588] hover:bg-[#f8fafc] transition-colors"
      >
        Voir tous les tickets →
      </Link>
    </section>
  );
}

// ── ActivityPanel ───────────────────────────────────────────

function formatClock(ms: number): string {
  return new Date(ms).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function ActivityPanel({
  items,
  updatedAt,
}: {
  items: { type: string; title: string; text: string; time: string }[];
  updatedAt?: number | null;
}) {
  return (
    <section className="flex h-full flex-col rounded-xl border border-[#e4eaf0] bg-white shadow-[0_2px_8px_rgba(20,40,65,0.03)]">
      <div className="flex items-center justify-between border-b border-[#edf1f4] px-4 py-3.5">
        <h2 className="flex items-center gap-2 text-[12px] font-bold text-[#1a2f42]">
          <ActivityIcon size={14} className="text-[#0ea5e9]" /> Journal d&apos;activité de la plateforme
        </h2>
        <span className="shrink-0 text-[11px] font-medium text-[#7d8c9a]" title={
          updatedAt ? new Date(updatedAt).toLocaleString("fr-FR") : undefined
        }>
          {updatedAt ? `Dernière mise à jour à ${formatClock(updatedAt)}` : "Chargement…"}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto px-4 max-h-[250px] [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent]">
        {items.length === 0 ? (
          <p className="py-6 text-center text-[12px] text-[#8a97a4]">Aucune activité récente</p>
        ) : (
          items.map((item, idx) => {
            const { icon: IconComponent, color } = ACTIVITY_ICONS[item.type] ?? { icon: ActivityIcon, color: "text-slate-500" };
            const [actor, ...scopeParts] = item.text.split(" — ");
            const scope = scopeParts.join(" — ");
            const textLabel = scope ? `${actor} · ${SCOPE_LABELS[scope] ?? scope}` : item.text;
            return (
              <div key={`${idx}-${item.type}-${item.time}`} className="flex gap-3 border-b border-[#f0f3f5] py-2.5 last:border-0">
                <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#f3f7fa] ${color}`}>
                  <IconComponent size={12} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[12px] font-bold text-[#344b5f]">{ACTIVITY_LABELS[item.type] ?? item.title}</p>
                    <span className="shrink-0 text-[11px] font-medium text-[#9aa6b1]">{item.time}</span>
                  </div>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-[#758492]">{textLabel}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

// ── SystemHealthPanel ─────────────────────────────────────────

/** État global déduit des signaux : critique → Dégradé ; charge ≥ 85 % → Sous surveillance ; sinon OK */
function deriveServiceState(health: SystemHealth | null, alerts: Alert[] | null) {
  if (!health) {
    return {
      key: "unavailable" as const,
      label: "Indisponible",
      pill: "bg-slate-100 text-slate-600",
      banner: "bg-slate-50",
      dot: "bg-slate-400",
      title: "text-slate-700",
      sub: "text-slate-500",
      message: "État du service indisponible",
      iconClass: "text-slate-500",
    };
  }

  const mem = health.memory;
  const memoryPercent = mem.usagePercent ?? Math.round((mem.heapUsedMB / mem.heapTotalMB) * 100);
  const memoryOk = memoryPercent < 85;
  const criticalCount = alerts?.filter((a) => a.severity === "critical").length ?? 0;

  if (criticalCount > 0 || health.status !== "healthy") {
    return {
      key: "degraded" as const,
      label: "Dégradé",
      pill: "bg-red-100 text-red-700",
      banner: "bg-red-50",
      dot: "bg-red-500",
      title: "text-red-800",
      sub: "text-red-700/80",
      message:
        criticalCount > 0
          ? `La plateforme rencontre des difficultés — ${criticalCount} alerte${criticalCount > 1 ? "s" : ""} critique${criticalCount > 1 ? "s" : ""} en cours`
          : "La plateforme rencontre des difficultés",
      iconClass: "text-red-600",
      memoryPercent,
      memoryOk,
      criticalCount,
    };
  }

  if (!memoryOk) {
    return {
      key: "watch" as const,
      label: "Sous surveillance",
      pill: "bg-orange-100 text-orange-700",
      banner: "bg-orange-50",
      dot: "bg-orange-500",
      title: "text-orange-800",
      sub: "text-orange-700/80",
      message: "Plateforme opérationnelle — charge serveur élevée, surveillance active",
      iconClass: "text-orange-600",
      memoryPercent,
      memoryOk,
      criticalCount,
    };
  }

  return {
    key: "ok" as const,
    label: "Opérationnel",
    pill: "bg-emerald-100 text-emerald-700",
    banner: "bg-emerald-50",
    dot: "bg-emerald-500",
    title: "text-emerald-800",
    sub: "text-emerald-700/80",
    message: "La plateforme fonctionne normalement",
    iconClass: "text-emerald-600",
    memoryPercent,
    memoryOk,
    criticalCount,
  };
}

function SystemHealthPanel({ health, alerts }: { health: SystemHealth | null; alerts: Alert[] | null }) {
  if (!health) {
    return (
      <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-[11px] text-amber-800">
        État du service indisponible : les données n’ont pas pu être chargées.
      </section>
    );
  }

  const mem = health.memory;
  const db = health.database;
  const state = deriveServiceState(health, alerts);
  const memoryPercent = state.memoryPercent ?? 0;
  const memoryOk = state.memoryOk ?? true;

  return (
    <section className="rounded-xl border border-[#e4eaf0] bg-white shadow-[0_2px_8px_rgba(20,40,65,0.03)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#edf1f4] px-4 py-3">
        <div className="flex items-center gap-2">
          <h2 className="flex items-center gap-2 text-[12px] font-bold text-[#1a2f42]">
            <Server size={14} className={state.iconClass} /> État du service
          </h2>
          <span className="text-[11px] font-medium text-[#8e9ca8]">En service depuis {health.uptime}</span>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${state.pill}`}>{state.label}</span>
      </div>
      <div className="p-4 space-y-3">
        <div className={`flex items-start gap-3 rounded-lg ${state.banner} p-3`}>
          <span className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${state.dot}`} />
          <p className={`text-[12px] font-bold ${state.title}`}>{state.message}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
          <div className="rounded-lg bg-[#f8fafc] p-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#7d8c9a]">Base de données</p>
            <p className="mt-1 text-[18px] font-black tracking-tight text-[#152a3d]">{db.latencyMs} ms</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium text-[#8e9ca8]">
              <span className={`h-1.5 w-1.5 rounded-full ${db.status === "connected" ? "bg-emerald-500" : "bg-red-500"}`} />
              {db.status === "connected" ? "Connectée" : "Coupée"}
            </p>
          </div>
          <div className="rounded-lg bg-[#f8fafc] p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#7d8c9a]">Charge serveur</p>
              <span className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${memoryOk ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}`}>
                {memoryOk ? "Normal" : "Élevé"}
              </span>
            </div>
            <p className="mt-1 text-[18px] font-black tracking-tight text-[#152a3d]">{memoryPercent} %</p>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#e2e8f0]">
              <div className={`h-full rounded-full transition-all ${memoryOk ? "bg-emerald-500" : "bg-orange-500"}`} style={{ width: `${Math.min(memoryPercent, 100)}%` }} />
            </div>
          </div>
          <div className="rounded-lg bg-[#f8fafc] p-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#7d8c9a]">Écoles</p>
            <p className="mt-1 text-[18px] font-black tracking-tight text-[#152a3d]">{health.stats.totalTenants}</p>
            <p className="mt-0.5 text-[11px] font-medium text-[#8e9ca8]">inscrites sur la plateforme</p>
          </div>
          <div className="rounded-lg bg-[#f8fafc] p-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#7d8c9a]">Utilisateurs</p>
            <p className="mt-1 text-[18px] font-black tracking-tight text-[#152a3d]">{health.stats.totalUsers}</p>
            <p className="mt-0.5 text-[11px] font-medium text-[#8e9ca8]">comptes au total</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── GrowthChart ─────────────────────────────────────────────

function GrowthChart({
  growth,
}: {
  growth: { labels: string[]; schools: number[]; students: number[] } | null;
}) {
  const hasRealData =
    !!growth &&
    Array.isArray(growth.labels) &&
    growth.labels.length > 0 &&
    (growth.schools.some((v) => v > 0) || growth.students.some((v) => v > 0));

  const schoolsData = growth?.schools ?? [];
  const studentsData = growth?.students ?? [];
  const labels = growth?.labels ?? [];

  // Un seul axe Y : max des deux séries (écoles et démos en compteurs unitaires)
  const rawMax = Math.max(...schoolsData, ...studentsData, 1);
  const yMax = Math.max(Math.ceil((rawMax * 1.3) / 10) * 10, 10);

  const yLabels = [
    yMax,
    Math.round(yMax * 0.75),
    Math.round(yMax * 0.5),
    Math.round(yMax * 0.25),
    0,
  ];

  const svgWidth = 600;
  const svgHeight = 150;
  const numPoints = Math.max(labels.length, schoolsData.length, 2);

  const schoolCoords = schoolsData.map((v, i) => {
    const x = (i / (numPoints - 1)) * svgWidth;
    const y = svgHeight - (v / yMax) * (svgHeight - 30) - 15;
    return { x, y };
  });

  const studentCoords = studentsData.map((v, i) => {
    const x = (i / (numPoints - 1)) * svgWidth;
    const y = svgHeight - (v / yMax) * (svgHeight - 30) - 15;
    return { x, y };
  });

  const schoolLinePath = schoolCoords
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");

  const schoolAreaPath = schoolCoords.length > 0
    ? `${schoolLinePath} L ${svgWidth},${svgHeight} L 0,${svgHeight} Z`
    : "";

  const studentLinePath = studentCoords
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");

  const hasDemoData = studentsData.some((v) => v > 0);
  const [hover, setHover] = useState<number | null>(null);

  const dateRangeLabel =
    growth?.labels && growth.labels.length > 0
      ? `${growth.labels[0]} — ${growth.labels[growth.labels.length - 1]}`
      : "Période en cours";

  const exportCsv = () => {
    const rows = [["Mois", "Écoles actives", "Démos converties"]];
    labels.forEach((label, i) => {
      rows.push([label, String(schoolsData[i] ?? 0), String(studentsData[i] ?? 0)]);
    });
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "croissance-ecoles-edugoma.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="flex h-full flex-col rounded-xl border border-[#e4eaf0] bg-white p-5 shadow-[0_2px_8px_rgba(20,40,65,0.03)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#7d8c9a]">Métriques d&apos;adoption & réseau scolaire</p>
          <h2 className="mt-1 text-[14px] font-bold text-[#1a2f42]">Croissance du parc écoles</h2>
          <p className="mt-0.5 text-[11px] text-[#8a97a4]">{dateRangeLabel}</p>
        </div>
        {hasRealData && (
          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-semibold text-[#486378] hover:bg-[#f1f5f8] transition-colors"
          >
            <Download size={12} /> Exporter le rapport
          </button>
        )}
      </div>

      {!hasRealData ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-10 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0f4f7]">
            <Network size={18} className="text-[#8c9ca9]" />
          </div>
          <p className="text-[12px] font-bold text-[#3a5266]">Aucune donnée sur la période</p>
          <p className="max-w-[280px] text-[11px] text-[#8c9ca9]">
            Pas encore d’écoles actives ni de démos converties à afficher.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-3.5 flex flex-wrap gap-5 text-[12px] font-medium text-[#657685]">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#16293d]" />
              Écoles partenaires actives
            </span>
            <span className={`flex items-center gap-1.5 ${hasDemoData ? "" : "text-[#9aa6b4]"}`}>
              <span className={`h-2.5 w-2.5 rounded-full ${hasDemoData ? "bg-[#387299]" : "bg-[#d5dee6]"}`} />
              Démos converties
            </span>
          </div>

          <div className="relative mt-4 flex-1 min-h-[160px]">
            {/* Grille horizontale et labels Y gauche */}
            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[11px] font-semibold text-[#8c9ca9] w-6 text-right">
              {yLabels.map((l, i) => (
                <span key={`y-left-${i}`}>{l}</span>
              ))}
            </div>

            {/* Lignes de repère */}
            <div className="absolute inset-y-0 left-8 right-2 flex flex-col justify-between bottom-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="border-t border-dashed border-[#e9eff4]" />
              ))}
            </div>

            {/* Tracé SVG interactif */}
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="none"
              className="absolute inset-y-0 left-8 right-2 w-[calc(100%-40px)] h-[calc(100%-24px)] overflow-visible"
              role="img"
              aria-label={`Croissance du parc : ${labels.join(", ")}`}
            >
              <title>Croissance du parc écoles</title>
              <desc>
                {labels
                  .map((l, i) => `${l}: ${schoolsData[i] ?? 0} écoles actives, ${studentsData[i] ?? 0} démos converties`)
                  .join(". ")}
              </desc>
              {schoolAreaPath && (
                <path d={schoolAreaPath} fill="url(#growthAreaGrad)" opacity=".18" />
              )}
              {schoolLinePath && (
                <path d={schoolLinePath} fill="none" stroke="#16293d" strokeWidth="2.5" strokeLinecap="round" />
              )}
              {hasDemoData && studentLinePath && (
                <path d={studentLinePath} fill="none" stroke="#387299" strokeWidth="2" strokeDasharray="5 4" strokeLinecap="round" />
              )}

              <defs>
                <linearGradient id="growthAreaGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop stopColor="#387299" />
                  <stop offset="1" stopColor="#edf4f8" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Points + tooltip au survol */}
            <div className="absolute inset-y-0 left-8 right-2 h-[calc(100%-24px)]">
              {schoolCoords.map((p, i) => (
                <button
                  key={`pt-${i}`}
                  type="button"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  aria-label={`${labels[i] ?? `Mois ${i + 1}`} : ${schoolsData[i] ?? 0} écoles actives`}
                  className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border-2 border-[#16293d] bg-white transition-transform hover:scale-125"
                  style={{ left: `${(i / (numPoints - 1)) * 100}%`, top: `${(p.y / svgHeight) * 100}%` }}
                />
              ))}
              {hover !== null && schoolCoords[hover] && (
                <div
                  className="pointer-events-none absolute z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#16293d] px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-lg"
                  style={{ left: `${(hover / (numPoints - 1)) * 100}%`, top: `${(schoolCoords[hover].y / svgHeight) * 100}%`, marginTop: "-36px" }}
                >
                  {labels[hover] ?? `Mois ${hover + 1}`} · {schoolsData[hover] ?? 0} école{(schoolsData[hover] ?? 0) > 1 ? "s" : ""}
                  {hasDemoData && ` · ${studentsData[hover] ?? 0} démo${(studentsData[hover] ?? 0) > 1 ? "s" : ""}`}
                </div>
              )}
            </div>

            {/* Labels X mois */}
            <div className="absolute bottom-0 left-8 right-2 flex justify-between text-[11px] font-medium text-[#7f8f9e]">
              {labels.map((l, i) => (
                <span key={`x-label-${i}`}>
                  <span className="sm:hidden">{l.split(" ")[0]}</span>
                  <span className="hidden sm:inline">{l}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Alternative textuelle : mêmes valeurs que le SVG */}
          <details className="mt-3 border-t border-[#edf1f4] pt-3">
            <summary className="cursor-pointer text-[11px] font-semibold text-[#486378] hover:text-[#1a334b]">
              Voir les données sous forme de tableau
            </summary>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full min-w-[320px] text-left text-[11px]">
                <caption className="sr-only">
                  Croissance du parc écoles : écoles actives et démos converties par mois
                </caption>
                <thead>
                  <tr className="border-b border-[#e9eff4] bg-[#f8fafc] text-[11px] font-bold uppercase tracking-[0.04em] text-[#5a6b7c]">
                    <th scope="col" className="px-2 py-1.5">Mois</th>
                    <th scope="col" className="px-2 py-1.5">Écoles actives</th>
                    <th scope="col" className="px-2 py-1.5">Démos converties</th>
                  </tr>
                </thead>
                <tbody>
                  {labels.map((l, i) => (
                    <tr key={`data-${i}`} className="border-b border-[#f0f3f5] text-[#4e6575] last:border-0">
                      <th scope="row" className="px-2 py-1.5 font-semibold text-[#344b5f]">{l}</th>
                      <td className="px-2 py-1.5 font-medium">{schoolsData[i] ?? 0}</td>
                      <td className="px-2 py-1.5 font-medium">{studentsData[i] ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </>
      )}
    </section>
  );
}

// ── BottomGrid ──────────────────────────────────────────────

function BottomGrid({
  metrics,
}: {
  metrics: MetricsData | null;
}) {
  const avgHours = metrics?.onboarding.avgHours ?? null;
  const hours = avgHours !== null ? Math.floor(avgHours) : null;
  const mins = avgHours !== null ? Math.round((avgHours - hours!) * 60) : null;
  const trend = metrics?.onboarding.trend ?? null;
  const completion = metrics?.completionRate.rate ?? null;
  const storage = metrics?.storage.usedGB ?? 0;

  const isTrendGood = trend !== null && trend <= 0;
  const trendColor = isTrendGood ? "text-[#23906b]" : "text-[#c24644]";
  const trendBg = isTrendGood ? "bg-[#e5f7ef]" : "bg-[#fdeeed]";

  return (
    <div className="grid grid-cols-12 items-stretch gap-3">
      {/* 4 colonnes : Délai moyen d'activation */}
      <div className="col-span-12 sm:col-span-6 xl:col-span-4">
        <div className="flex h-full flex-col justify-between rounded-xl border border-[#e4eaf0] bg-white p-3.5 shadow-[0_2px_8px_rgba(20,40,65,0.03)] hover:shadow-[0_4px_12px_rgba(20,40,65,0.06)] hover:border-[#cfdbe5] transition-all duration-200">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#7d8c9a]">Délai moyen d&apos;activation</p>
            {hours !== null ? (
              <>
                <p className="mt-1.5 text-[22px] font-black tracking-tight text-[#152a3d]">
                  {hours}h {mins}m
                </p>
                <p className="mt-0.5 text-[11px] font-medium text-[#8c9ca9]">
                  {"Cible réseau : < 24h"}
                </p>
              </>
            ) : (
              <p className="mt-1.5 text-[12px] font-semibold text-[#8c9ca9]">Aucune activation ce mois</p>
            )}
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#f0f4f7] flex items-center justify-between gap-2 text-[12px] text-[#6d7f90]">
            {trend !== null && (
              <span className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${trendBg} ${trendColor}`}>
                {`${trend > 0 ? "▲" : "▼"} ${Math.abs(trend)}% ${metrics?.onboarding.trendLabel ?? "vs mois précédent"}`}
              </span>
            )}
            <span className="text-[11px] font-semibold text-[#8c9ca9]">Calcul automatique</span>
          </div>
        </div>
      </div>

      {/* 4 colonnes : Taux de complétude dossiers */}
      <div className="col-span-12 sm:col-span-6 xl:col-span-4">
        <div className="flex h-full flex-col justify-between rounded-xl border border-[#e4eaf0] bg-white p-3.5 shadow-[0_2px_8px_rgba(20,40,65,0.03)] hover:shadow-[0_4px_12px_rgba(20,40,65,0.06)] hover:border-[#cfdbe5] transition-all duration-200">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#7d8c9a]">Taux de complétude dossiers</p>
            {completion !== null && completion !== undefined ? (
              <>
                <p className="mt-1.5 text-[22px] font-black tracking-tight text-[#152a3d]">
                  {completion} %
                </p>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-[#eef3f7] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#23906b] transition-all duration-500"
                    style={{ width: `${Math.min(Math.max(completion, 0), 100)}%` }}
                  />
                </div>
              </>
            ) : (
              <p className="mt-1.5 text-[12px] font-semibold text-[#8c9ca9]">Pas encore de données</p>
            )}
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#f0f4f7] flex items-center justify-between gap-2 text-[12px] text-[#6d7f90]">
            <p className="text-[11px] font-medium text-[#7d8e9c]">Dossiers scolaires finalisés</p>
            {completion !== null && completion !== undefined && (
              <span className="rounded bg-[#e8f7f0] px-1.5 py-0.5 text-[11px] font-bold text-[#208a65]">
                {completion} %
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Estimation de volume — pas de quota réel mesuré */}
      <div className="col-span-12 sm:col-span-6 xl:col-span-4">
        <div className="flex h-full flex-col justify-between rounded-xl border border-[#e4eaf0] bg-white p-3.5 shadow-[0_2px_8px_rgba(20,40,65,0.03)] hover:shadow-[0_4px_12px_rgba(20,40,65,0.06)] hover:border-[#cfdbe5] transition-all duration-200">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#7d8c9a]">Volume estimé</p>
            <p className="mt-1.5 text-[22px] font-black tracking-tight text-[#152a3d]">{storage} Go</p>
            <p className="mt-0.5 text-[11px] font-medium text-[#8c9ca9]">
              {metrics?.storage.note || "Estimation approximative"}
            </p>
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#f0f4f7]">
            <p className="text-[11px] font-medium text-[#7d8e9c]">
              Basé sur les journaux d’accès — pas un quota hébergeur
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Alias for Turbopack HMR cache compatibility
const AdoptionMetricsRow = BottomGrid;

// ── Section states ──────────────────────────────────────────

function SectionErrorBanner({
  label,
  message,
  onRetry,
}: {
  label: string;
  message: string | null;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-800"
    >
      <span>
        <strong className="font-bold">{label}</strong> — données indisponibles
        {message ? ` (${message})` : ""}.
      </span>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md border border-amber-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-amber-800 hover:bg-amber-100 transition-colors"
        >
          Réessayer
        </button>
      )}
    </div>
  );
}

function SectionUnavailable({ label }: { label: string }) {
  return (
    <div className="flex min-h-[120px] flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#d7e0e8] bg-[#fafcfd] p-4 text-center">
      <p className="text-[12px] font-bold text-[#3a5266]">Données indisponibles</p>
      <p className="text-[11px] text-[#8c9ca9]">{label} n’a pas pu être chargé.</p>
    </div>
  );
}

const isSectionError = (statuses: SectionStatuses, section: DashboardSection) =>
  statuses[section] === "error";
const isSectionLoading = (statuses: SectionStatuses, section: DashboardSection) =>
  statuses[section] === "loading" || statuses[section] === "idle";

// ── Main Page ───────────────────────────────────────────────

export default function DashboardPage() {
  const {
    summary,
    growth,
    metrics,
    activityLog,
    activityUpdatedAt,
    alerts,
    tickets,
    systemHealth,
    statuses,
    errors,
    loading,
    error,
    refetch,
    refetchSection,
  } = useDashboard();
  const [activeTab, setActiveTab] = useState<"business" | "infrastructure">("business");

  if (loading) {
    return <DashboardPageSkeleton />;
  }

  const schoolsCount = summary?.schools.active ?? "—";
  // Source de vérité unique : compteur de l'API tenants (comme la page Écoles)
  const pendingCount = summary?.counts.pending ?? summary?.pendingDossiers.count ?? 0;
  const serviceState = deriveServiceState(systemHealth, alerts);

  const serviceDotClass =
    serviceState.key === "ok"
      ? "bg-emerald-500"
      : serviceState.key === "watch"
        ? "bg-amber-500"
        : serviceState.key === "degraded"
          ? "bg-red-500"
          : "bg-slate-400";
  const serviceTextClass =
    serviceState.key === "ok"
      ? "text-emerald-700 font-semibold"
      : serviceState.key === "watch"
        ? "text-amber-700 font-semibold"
        : serviceState.key === "degraded"
          ? "text-red-700 font-semibold"
          : "text-slate-600 font-semibold";

  const tabButtons = [
    { id: "business" as const, label: "Vue Métiers & Écoles", icon: LayoutDashboard },
    { id: "infrastructure" as const, label: "État du service", icon: ActivityIcon },
  ];

  const onTabKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "Home" && e.key !== "End") {
      return;
    }
    e.preventDefault();
    const ids = tabButtons.map((t) => t.id);
    const current = ids.indexOf(activeTab);
    let next = current;
    if (e.key === "ArrowRight") next = (current + 1) % ids.length;
    if (e.key === "ArrowLeft") next = (current - 1 + ids.length) % ids.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = ids.length - 1;
    setActiveTab(ids[next]);
    document.getElementById(`dashboard-tab-${ids[next]}`)?.focus();
  };

  return (
    <div className="w-full box-border pb-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold tracking-[-0.03em] text-slate-900 sm:text-[24px]">
            Vue d&apos;ensemble
          </h1>
          <p className="mt-1 text-[13px] text-slate-500">
            Suivi des établissements, inscriptions et santé des services à Goma
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-slate-200/80 bg-white px-3 py-1.5 shadow-xs">
          <span className={`h-2 w-2 rounded-full ${serviceDotClass}`} />
          <span className="text-[12px] font-medium text-slate-700">
            Service :{" "}
            <strong className={serviceTextClass}>{serviceState.label}</strong>
          </span>
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Vues du tableau de bord"
        className="mb-5 flex flex-wrap items-center gap-2 border-b border-[#dfe7ed]"
        onKeyDown={onTabKeyDown}
      >
        {tabButtons.map((tab) => {
          const selected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`dashboard-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`dashboard-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-t-lg px-3.5 py-2.5 text-[11px] font-medium transition-colors ${selected
                ? "border-b-2 border-[#122e47] bg-white text-[#1a334b] font-bold"
                : "text-[#708191] hover:text-[#1c364e]"
                }`}
            >
              <tab.icon size={13} aria-hidden="true" /> {tab.label}
            </button>
          );
        })}
      </div>

      {error && (
        <div
          role="status"
          className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-[11px] text-amber-800"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>{error}</span>
            <button
              type="button"
              onClick={refetch}
              className="rounded-md border border-amber-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-amber-800 hover:bg-amber-100 transition-colors"
            >
              Tout réessayer
            </button>
          </div>
        </div>
      )}

      {activeTab === "business" && (
        <div
          role="tabpanel"
          id="dashboard-panel-business"
          aria-labelledby="dashboard-tab-business"
          tabIndex={0}
        >
          {pendingCount > 0 && (
        <section className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#102d48] px-4 py-3 text-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#214863] text-[#75d0b2]">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#a9ddcf]">
                  Action prioritaire requise
                </span>
                <span className="text-[12px] text-[#c4d3de]">Dossier en attente</span>
              </div>
              <p className="mt-0.5 text-[11px] font-bold text-white">
                {pendingCount} école{pendingCount > 1 ? "s" : ""} partenaire{pendingCount > 1 ? "s" : ""} ont soumis leur dossier d&apos;inscription en attente de validation.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/requests"
            className="ml-10 flex shrink-0 items-center gap-2 rounded-md bg-white px-3.5 py-2 text-[12px] font-bold text-[#233d52] hover:bg-[#edf3f8] transition-colors"
          >
            <FileCheck2 size={12} /> Examiner les dossiers ({pendingCount})
          </Link>
        </section>
      )}

      {activeTab === "business" && (
        <>
          {isSectionError(statuses, "summary") && (
            <SectionErrorBanner
              label="Statistiques générales"
              message={errors.summary}
              onRetry={() => refetchSection("summary")}
            />
          )}
          {isSectionLoading(statuses, "summary") ? (
            <div className="mb-5 grid grid-cols-12 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="col-span-12 sm:col-span-6 xl:col-span-3">
                  <StatCardSkeleton />
                </div>
              ))}
            </div>
          ) : summary ? (
            <div className="mb-5 grid grid-cols-12 gap-3">
              <div className="col-span-12 sm:col-span-6 xl:col-span-3">
                <StatCard
                  label="Écoles actives"
                  value={String(summary.schools.active)}
                  trend={visibleTrend(summary.schools.trend, summary.schools.active)}
                  icon={Building2}
                  detail={
                    <>
                      <span>Réparties sur {summary.schools.provinces} commune{summary.schools.provinces > 1 ? "s" : ""}</span>
                      <strong className="text-[#3a5266]">
                        Taux d&apos;activité <b className="text-[#23906b]">{summary.schools.activityRate}%</b>
                      </strong>
                    </>
                  }
                />
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-3">
                <StatCard
                  label="Dossiers en attente"
                  value={String(pendingCount)}
                  icon={Clock3}
                  accent="orange"
                  detail={
                    <>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${summary.pendingDossiers.urgent > 0
                          ? "bg-[#ffede2] text-[#c2672a]"
                          : "bg-[#f0f3f6] text-[#7d8c9a]"
                          }`}
                      >
                        {summary.pendingDossiers.urgent} urgent{summary.pendingDossiers.urgent > 1 ? "s" : ""}
                      </span>
                      {summary.pendingDossiers.avgValidationHours !== null && (
                        <strong className="text-[#3a5266]">Validation : {summary.pendingDossiers.avgValidationHours}h</strong>
                      )}
                    </>
                  }
                />
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-3">
                <StatCard
                  label="Utilisateurs plateforme"
                  value={summary.users.total.toLocaleString("fr-FR")}
                  trend={visibleTrend(summary.users.trend, summary.users.total)}
                  icon={Users}
                  accent="violet"
                  detail={
                    <>
                      <span>Directions, enseignants &amp; agents</span>
                      <strong className="text-[#3a5266]">
                        {summary.users.activeToday.toLocaleString("fr-FR")} actif{summary.users.activeToday > 1 ? "s" : ""} aujourd&apos;hui
                      </strong>
                    </>
                  }
                />
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-3">
                <StatCard
                  label="Démonstrations converties"
                  value={summary.students.total.toLocaleString("fr-FR")}
                  trend={visibleTrend(summary.students.trend, summary.students.total)}
                  icon={GraduationCap}
                  accent="green"
                  detail={
                    <>
                      <span>Demandes reçues en ligne</span>
                      <strong className="text-[#3a5266]">
                        {summary.students.renewalRate !== null && (
                        <strong className="text-[#3a5266]">{summary.students.renewalRate}% conversion</strong>
                      )}
                      </strong>
                    </>
                  }
                />
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-3">
                <StatCard
                  label="Écoles suspendues"
                  value={String(summary.counts.suspended)}
                  icon={Building2}
                  accent="orange"
                  detail={
                    <>
                      <span>Abonnements suspendus</span>
                      <strong className="text-[#3a5266]">
                        {summary.counts.all} école{summary.counts.all > 1 ? "s" : ""} au total
                      </strong>
                    </>
                  }
                />
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-3">
                <StatCard
                  label="Paiements en retard"
                  value={String(summary.counts.overdue)}
                  icon={Clock3}
                  accent="orange"
                  detail={
                    <>
                      <span>Abonnements &gt; 30 jours</span>
                      <strong className="text-[#3a5266]">
                        {summary.counts.trial} en essai gratuit
                      </strong>
                    </>
                  }
                />
              </div>
            </div>
          ) : (
            <div className="mb-5">
              <SectionUnavailable label="Les statistiques générales" />
            </div>
          )}
        </>
      )}

      {/* Business tab: Alertes priorité */}
      {activeTab === "business" && isSectionError(statuses, "alerts") && (
        <SectionErrorBanner
          label="Alertes"
          message={errors.alerts}
          onRetry={() => refetchSection("alerts")}
        />
      )}
      {activeTab === "business" && alerts && alerts.length > 0 && (
        <div className="mb-5">
          <AlertPanel alerts={alerts} />
        </div>
      )}

      {/* Business tab: Analytics Grid */}
      {activeTab === "business" && (
        <div className="mb-5 grid grid-cols-12 items-stretch gap-3">
          <div className="col-span-12 min-h-[320px] min-w-0 xl:col-span-9">
            {isSectionError(statuses, "growth") ? (
              <>
                <SectionErrorBanner
                  label="Croissance"
                  message={errors.growth}
                  onRetry={() => refetchSection("growth")}
                />
                <SectionUnavailable label="Le graphique de croissance" />
              </>
            ) : isSectionLoading(statuses, "growth") ? (
              <ChartSkeleton />
            ) : (
              <GrowthChart growth={growth} />
            )}
          </div>
          <div className="col-span-12 flex flex-col gap-3 xl:col-span-3 xl:min-h-[320px]">
            <div className="xl:min-h-0 xl:flex-1">
              {isSectionError(statuses, "activity") ? (
                <>
                  <SectionErrorBanner
                    label="Journal d’activité"
                    message={errors.activity}
                    onRetry={() => refetchSection("activity")}
                  />
                  <SectionUnavailable label="Le journal d’activité" />
                </>
              ) : isSectionLoading(statuses, "activity") ? (
                <ActivityFeedSkeleton />
              ) : (
                <ActivityPanel items={activityLog} updatedAt={activityUpdatedAt} />
              )}
            </div>
            <div className="xl:min-h-0 xl:flex-1">
              {isSectionError(statuses, "tickets") ? (
                <>
                  <SectionErrorBanner
                    label="Tickets"
                    message={errors.tickets}
                    onRetry={() => refetchSection("tickets")}
                  />
                  <SectionUnavailable label="Les tickets" />
                </>
              ) : (
                <TicketPanel tickets={tickets} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Business tab: Bottom Grid */}
          {isSectionError(statuses, "metrics") && (
            <SectionErrorBanner
              label="Indicateurs"
              message={errors.metrics}
              onRetry={() => refetchSection("metrics")}
            />
          )}
          {isSectionLoading(statuses, "metrics") ? (
            <div className="grid grid-cols-12 gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="col-span-12 sm:col-span-6 xl:col-span-4">
                  <StatCardSkeleton />
                </div>
              ))}
            </div>
          ) : metrics ? (
            <BottomGrid metrics={metrics} />
          ) : (
            <SectionUnavailable label="Les indicateurs métier" />
          )}
        </div>
      )}

      {/* Infrastructure tab: System Health */}
      {activeTab === "infrastructure" && (
        <div
          role="tabpanel"
          id="dashboard-panel-infrastructure"
          aria-labelledby="dashboard-tab-infrastructure"
          tabIndex={0}
          className="space-y-4"
        >
          {isSectionError(statuses, "health") && (
            <SectionErrorBanner
              label="État du service"
              message={errors.health}
              onRetry={() => refetchSection("health")}
            />
          )}
          {isSectionLoading(statuses, "health") ? (
            <ChartSkeleton />
          ) : (
            <SystemHealthPanel health={systemHealth} alerts={alerts} />
          )}

          {/* Alertes priorité — panneau complet (même source que l'onglet Métiers) */}
          {alerts && alerts.length > 0 && (
            <div className="mb-5">
              <AlertPanel alerts={alerts} />
            </div>
          )}

          {/* Écoles inscrites — plain language */}
          <section className="rounded-xl border border-[#e4eaf0] bg-white shadow-[0_2px_8px_rgba(20,40,65,0.03)]">
            <div className="flex items-center justify-between border-b border-[#edf1f4] px-4 py-3">
              <h2 className="flex items-center gap-2 text-[12px] font-bold text-[#1a2f42]">
                <Network size={14} className="text-sky-600" /> Écoles sur la plateforme
              </h2>
              <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-bold text-sky-700">
                {systemHealth ? `${systemHealth.stats.totalTenants} école${systemHealth.stats.totalTenants > 1 ? "s" : ""}` : "Données indisponibles"}
              </span>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 gap-2 text-center sm:grid-cols-3 sm:gap-3">
                <div className="rounded-lg bg-sky-50 p-3">
                  <p className="text-[11px] font-bold text-sky-600">{systemHealth?.stats.totalTenants ?? "—"}</p>
                  <p className="text-[11px] text-sky-500">Inscrites</p>
                </div>
                <div className="rounded-lg bg-emerald-50 p-3">
                  <p className="text-[11px] font-bold text-emerald-600">{summary?.schools.active ?? "—"}</p>
                  <p className="text-[11px] text-emerald-500">Actives</p>
                </div>
                <div className="rounded-lg bg-orange-50 p-3">
                  <p className="text-[11px] font-bold text-orange-600">{pendingCount}</p>
                  <p className="text-[11px] text-orange-500">En attente</p>
                </div>
              </div>
            </div>
          </section>

        </div>
      )}
    </div>
  );
}
