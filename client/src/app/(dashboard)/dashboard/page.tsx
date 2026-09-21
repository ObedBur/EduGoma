"use client";

import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  Bell,
  Building2,
  CheckCircle2,
  CircleHelp,
  Clock3,
  Download,
  FileCheck2,
  GraduationCap,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  ListFilter,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { StatCard } from "@/components/layout/DashboardShared";
import { useDashboard } from "@/hooks/use-dashboard";
import { StatCardSkeleton } from "@/components/skeletons/StatCardSkeleton";
import { ChartSkeleton } from "@/components/skeletons/ChartSkeleton";
import { ActivityFeedSkeleton } from "@/components/skeletons/ActivityFeedSkeleton";
import { DashboardPageSkeleton } from "@/components/skeletons/DashboardPageSkeleton";
import type { Alert, Ticket } from "@/lib/api";

// ── Color maps ──────────────────────────────────────────────

const SEVERITY_COLORS: Record<string, { bg: string; text: string; border: string; icon: typeof AlertCircle }> = {
  critical: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", icon: AlertCircle },
  warning: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", icon: AlertCircle },
  info: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: Bell },
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  open: { bg: "bg-red-50", text: "text-red-700" },
  in_progress: { bg: "bg-orange-50", text: "text-orange-700" },
  resolved: { bg: "bg-emerald-50", text: "text-emerald-700" },
  closed: { bg: "bg-slate-100", text: "text-slate-600" },
};

const PRIORITY_COLORS: Record<string, { bg: string; text: string }> = {
  critical: { bg: "bg-red-100", text: "text-red-800" },
  urgent: { bg: "bg-orange-100", text: "text-orange-800" },
  normal: { bg: "bg-slate-100", text: "text-slate-600" },
  low: { bg: "bg-slate-50", text: "text-slate-500" },
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

const ACTIVITY_ICONS: Record<string, { icon: typeof CheckCircle2; color: string }> = {
  ACCESS_GRANTED: { icon: CheckCircle2, color: "text-emerald-500" },
  SCHOOL_CREATED: { icon: FileCheck2, color: "text-sky-500" },
  DOSSIER_SUBMITTED: { icon: FileCheck2, color: "text-sky-500" },
  DOSSIER_REJECTED: { icon: AlertCircle, color: "text-rose-500" },
  SUBSCRIPTION_SUSPENDED: { icon: AlertCircle, color: "text-rose-500" },
  SUBSCRIPTION_REACTIVATED: { icon: CheckCircle2, color: "text-emerald-500" },
  ACCOUNT_DEACTIVATED: { icon: AlertCircle, color: "text-rose-500" },
  LOGIN_SUCCESS: { icon: KeyRound, color: "text-violet-500" },
  LOGIN_FAILED: { icon: AlertCircle, color: "text-rose-500" },
  USER_REGISTERED: { icon: Users, color: "text-sky-500" },
  PASSWORD_CHANGED: { icon: KeyRound, color: "text-violet-500" },
  ROLE_ASSIGNED: { icon: ShieldCheck, color: "text-violet-500" },
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
        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[8px] font-bold text-red-700">
          {alerts.length}
        </span>
      </div>
      <div className="px-4">
        {alerts.map((alert) => {
          const colors = SEVERITY_COLORS[alert.severity] ?? SEVERITY_COLORS.info;
          const IconComp = colors.icon;
          return (
            <div
              key={alert.id}
              className={`flex gap-2.5 border-b border-[#f0f3f5] py-3 last:border-0`}
            >
              <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${colors.bg} ${colors.text}`}>
                <IconComp size={11} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[9px] font-bold text-[#536474]">{alert.title}</p>
                  <span className={`shrink-0 rounded px-1 py-0.5 text-[7px] font-bold ${colors.bg} ${colors.text}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
                <p className="mt-1 text-[8px] leading-[1.45] text-[#87939f]">{alert.message}</p>
                {alert.source && (
                  <p className="mt-0.5 text-[7px] font-medium text-[#a0aab4]">Source: {alert.source}</p>
                )}
              </div>
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
    <section className="rounded-xl border border-[#e4eaf0] bg-white shadow-[0_2px_8px_rgba(20,40,65,0.03)]">
      <div className="flex items-center justify-between border-b border-[#edf1f4] px-4 py-3.5">
        <h2 className="flex items-center gap-2 text-[12px] font-bold text-[#1a2f42]">
          <LifeBuoy size={14} className="text-[#3b82f6]" /> Support & Onboarding Écoles
        </h2>
        <span className="rounded-full bg-[#e8f7f0] px-2 py-0.5 text-[8px] font-bold text-[#208a65]">SLA Actif</span>
      </div>
      <div className="px-4">
        {tickets.length === 0 ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#edf9f3] text-[#2ba075]">
              <CheckCircle2 size={16} />
            </div>
            <p className="text-[11px] font-bold text-[#2e475d]">Aucun ticket en attente</p>
            <p className="mt-0.5 text-[10px] text-[#8e9ca8]">Toutes les demandes ont été traitées</p>
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
              <div key={ticket.id} className="flex items-start justify-between border-b border-[#f0f3f5] py-3 last:border-0">
                <div className="min-w-0 flex-1 pr-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-[10px] font-bold text-[#2a4053] truncate">{ticket.title}</p>
                    <span className={`rounded px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wider ${priorityColor.bg} ${priorityColor.text}`}>
                      {PRIORITY_LABELS[ticket.priority] ?? ticket.priority}
                    </span>
                  </div>
                  {ticket.description && (
                    <p className="mt-1 text-[9px] text-[#7d8c9a] line-clamp-1 leading-relaxed">{ticket.description}</p>
                  )}
                  <div className="mt-1.5 flex items-center gap-1.5 text-[8px] text-[#8e9ca8]">
                    {ticket.schoolName && (
                      <span className="font-semibold text-[#4e6477]">{ticket.schoolName}</span>
                    )}
                    {ticket.requester && (
                      <span>· {ticket.requester}</span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[8px] font-medium text-[#9aa6b1]">{timeLabel}</span>
                  <span className={`mt-1 block rounded px-1.5 py-0.5 text-[8px] font-bold ${statusColor.bg} ${statusColor.text}`}>
                    {STATUS_LABELS[ticket.status] ?? ticket.status}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
      <button className="w-full border-t border-[#edf1f4] py-2.5 text-center text-[10px] font-bold text-[#356588] hover:bg-[#f8fafc] transition-colors">
        Voir tous les tickets →
      </button>
    </section>
  );
}

// ── ActivityPanel ───────────────────────────────────────────

function ActivityPanel({ items }: { items: { type: string; title: string; text: string; time: string }[] }) {
  return (
    <section className="rounded-xl border border-[#e4eaf0] bg-white shadow-[0_2px_8px_rgba(20,40,65,0.03)]">
      <div className="flex items-center justify-between border-b border-[#edf1f4] px-4 py-3.5">
        <h2 className="flex items-center gap-2 text-[12px] font-bold text-[#1a2f42]">
          <Activity size={14} className="text-[#0ea5e9]" /> Journal d&apos;activité SaaS
        </h2>
        <span className="flex items-center gap-1 text-[8px] font-bold text-[#23906b]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#2cb183] animate-pulse" /> Direct
        </span>
      </div>
      <div className="px-4">
        {items.length === 0 ? (
          <p className="py-6 text-center text-[10px] text-[#8a97a4]">Aucune activité récente</p>
        ) : (
          items.map((item, idx) => {
            const { icon: IconComponent, color } = ACTIVITY_ICONS[item.type] ?? { icon: Activity, color: "text-slate-500" };
            return (
              <div key={`${idx}-${item.type}-${item.time}`} className="flex gap-3 border-b border-[#f0f3f5] py-3 last:border-0">
                <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#f3f7fa] ${color}`}>
                  <IconComponent size={12} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[10px] font-bold text-[#344b5f]">{item.title}</p>
                    <span className="shrink-0 text-[8px] font-medium text-[#9aa6b1]">{item.time}</span>
                  </div>
                  <p className="mt-0.5 text-[9px] leading-relaxed text-[#758492]">{item.text}</p>
                </div>
              </div>
            );
          })
        )}
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
  const schoolsData = growth?.schools ?? [0, 0, 0, 0, 0, 0];
  const studentsData = growth?.students ?? [0, 0, 0, 0, 0, 0];
  const labels = growth?.labels && growth.labels.length > 0
    ? growth.labels
    : ["M1", "M2", "M3", "M4", "M5", "M6"];

  const rawMaxSchools = Math.max(...schoolsData, 1);
  const maxSchools = Math.max(Math.ceil((rawMaxSchools * 1.3) / 10) * 10, 10);

  const rawMaxStudentsK = Math.max(...studentsData.map((s) => s / 1000), 1);
  const maxStudentsK = Math.max(Math.ceil((rawMaxStudentsK * 1.3) / 10) * 10, 10);

  const yLabels = [
    maxSchools,
    Math.round(maxSchools * 0.75),
    Math.round(maxSchools * 0.5),
    Math.round(maxSchools * 0.25),
    0,
  ];
  const yLabelsRight = [
    `${maxStudentsK}k`,
    `${Math.round(maxStudentsK * 0.75)}k`,
    `${Math.round(maxStudentsK * 0.5)}k`,
    `${Math.round(maxStudentsK * 0.25)}k`,
    "0k",
  ];

  const svgWidth = 600;
  const svgHeight = 150;
  const numPoints = Math.max(labels.length, schoolsData.length, 2);

  const schoolCoords = schoolsData.map((v, i) => {
    const x = (i / (numPoints - 1)) * svgWidth;
    const y = svgHeight - (v / maxSchools) * (svgHeight - 30) - 15;
    return { x, y };
  });

  const studentCoords = studentsData.map((v, i) => {
    const x = (i / (numPoints - 1)) * svgWidth;
    const y = svgHeight - (v / 1000 / maxStudentsK) * (svgHeight - 30) - 15;
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

  const dateRangeLabel =
    growth?.labels && growth.labels.length > 0
      ? `(${growth.labels[0]} — ${growth.labels[growth.labels.length - 1]})`
      : "";

  return (
    <section className="flex h-full flex-col rounded-xl border border-[#e4eaf0] bg-white p-5 shadow-[0_2px_8px_rgba(20,40,65,0.03)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#7d8c9a]">Métriques d&apos;adoption & réseau scolaire</p>
          <h2 className="mt-1 text-[14px] font-bold text-[#1a2f42]">
            Croissance du Parc Écoles & Élèves {dateRangeLabel}
          </h2>
        </div>
        <button className="flex items-center gap-1.5 rounded-md border border-[#d6e0e8] bg-[#fbfcfd] px-2.5 py-1.5 text-[10px] font-semibold text-[#486378] hover:bg-[#f1f5f8] transition-colors">
          <Download size={12} /> Exporter le rapport
        </button>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-5 text-[10px] font-medium text-[#657685]">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#16293d]" />
          Écoles clientes actives
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#387299]" />
          Élèves gérés (k)
        </span>
      </div>

      <div className="relative mt-4 flex-1 min-h-[160px]">
        {/* Grille horizontale et labels Y gauche */}
        <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[9px] font-semibold text-[#8c9ca9] w-6 text-right">
          {yLabels.map((l, i) => (
            <span key={`y-left-${i}`}>{l}</span>
          ))}
        </div>

        {/* Lignes de repère */}
        <div className="absolute inset-y-0 left-8 right-8 flex flex-col justify-between bottom-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="border-t border-dashed border-[#e9eff4]" />
          ))}
        </div>

        {/* Tracé SVG interactif */}
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="none"
          className="absolute inset-y-0 left-8 right-8 h-[calc(100%-24px)] w-[calc(100%-64px)] overflow-visible"
        >
          {schoolAreaPath && (
            <path d={schoolAreaPath} fill="url(#growthAreaGrad)" opacity=".18" />
          )}
          {schoolLinePath && (
            <path d={schoolLinePath} fill="none" stroke="#16293d" strokeWidth="2.5" strokeLinecap="round" />
          )}
          {studentLinePath && (
            <path d={studentLinePath} fill="none" stroke="#387299" strokeWidth="2" strokeDasharray="5 4" strokeLinecap="round" />
          )}

          <defs>
            <linearGradient id="growthAreaGrad" x1="0" x2="0" y1="0" y2="1">
              <stop stopColor="#387299" />
              <stop offset="1" stopColor="#edf4f8" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Labels Y droite */}
        <div className="absolute right-0 top-0 bottom-6 flex flex-col justify-between text-[9px] font-semibold text-[#8c9ca9] w-6">
          {yLabelsRight.map((l, i) => (
            <span key={`y-right-${i}`}>{l}</span>
          ))}
        </div>

        {/* Labels X mois */}
        <div className="absolute bottom-0 left-8 right-8 flex justify-between text-[9px] font-semibold text-[#7f8f9e]">
          {labels.map((l, i) => (
            <span
              key={`x-label-${i}`}
              className={i === labels.length - 1 ? "font-bold text-[#1c3245]" : ""}
            >
              {l}
            </span>
          ))}
        </div>
      </div>

      {/* 3 Blocs métriques */}
      <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[#e8edf2] bg-[#f9fafc] p-3">
          <p className="text-[10px] font-semibold text-[#748594]">Délai moyen d&apos;onboarding</p>
          <p className="mt-1 text-[16px] font-black tracking-tight text-[#172c3e]">{hours}h {mins}m</p>
          <span className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[8px] font-bold ${trendBg} ${trendColor}`}>
            {trend}% {metrics?.onboarding.trendLabel ?? "vs mois précédent"}
          </span>
        </div>
        <div className="rounded-lg border border-[#e8edf2] bg-[#f9fafc] p-3">
          <p className="text-[10px] font-semibold text-[#748594]">Taux de complétude dossiers</p>
          <p className="mt-1 text-[16px] font-black tracking-tight text-[#172c3e]">{completion}%</p>
          <p className="mt-1.5 text-[9px] font-medium text-[#7d8e9c]">Validés du premier coup</p>
        </div>
        <div className="rounded-lg border border-[#e8edf2] bg-[#f9fafc] p-3">
          <p className="text-[10px] font-semibold text-[#748594]">Stockage Cloud Écoles</p>
          <p className="mt-1 text-[16px] font-black tracking-tight text-[#172c3e]">{storage} Go</p>
          <p className="mt-1.5 text-[9px] font-medium text-[#7d8e9c]">Archives scellées & chiffrées</p>
        </div>
      </div>
    </section>
  );
}

// ── Main Page ───────────────────────────────────────────────

export default function DashboardPage() {
  const { summary, growth, metrics, activityLog, alerts, tickets, loading, error } = useDashboard();

  if (loading) {
    return <DashboardPageSkeleton />;
  }

  const schoolsCount = summary?.schools.total ?? summary?.schools.active ?? 0;

  return (
    <>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-[10px] text-[#7d8c9a]">
            <span className="rounded bg-[#e8f1f7] px-2 py-0.5 font-bold uppercase tracking-[0.06em] text-[#345f7d]">
              ▦ EDUGOMA SAAS › PLATFORM CONTROL CENTER
            </span>
            <span>•</span>
            <span className="font-medium">Multi-Tenant Network</span>
          </div>
          <h1 className="text-[22px] font-extrabold leading-tight tracking-[-0.035em] text-[#152a3d] sm:text-[24px]">
            Synthèse de l&apos;activité du réseau scolaire aujourd&apos;hui.
          </h1>
        </div>
        <div className="flex items-center gap-2.5 rounded-lg border border-[#e1e8ee] bg-white px-3.5 py-2 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-[#2bad7d] animate-ping" />
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-[#798794]">Infrastructure SaaS Cloud</p>
            <p className="text-[11px] font-bold text-[#233d52]">
              Disponibilité globale : <span className="text-[#23906b]">99.98%</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2 border-b border-[#dfe7ed]">
        <button className="flex items-center gap-2 rounded-t-lg border-b-2 border-[#122e47] bg-white px-3.5 py-2.5 text-[11px] font-bold text-[#1a334b]">
          <LayoutDashboard size={13} /> Vue Métiers & Écoles{" "}
          <span className="rounded-full bg-[#edf3f8] px-2 py-0.5 text-[9px] font-bold text-[#355b79]">
            {schoolsCount}
          </span>
        </button>
        <button className="flex items-center gap-2 px-3.5 py-2.5 text-[11px] font-medium text-[#708191] hover:text-[#1c364e] transition-colors">
          <Activity size={13} /> Santé Système & Infrastructure{" "}
          <span className="rounded-full bg-[#e6f7ef] px-2 py-0.5 text-[9px] font-bold text-[#248f69]">
            3 nodes actifs
          </span>
        </button>
      </div>

      {summary?.pendingDossiers && summary.pendingDossiers.count > 0 && (
        <section className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#102d48] px-4 py-3 text-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#214863] text-[#75d0b2]">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#a9ddcf]">
                  Action prioritaire requise
                </span>
                <span className="text-[10px] text-[#c4d3de]">Dossier en attente</span>
              </div>
              <p className="mt-0.5 text-[11px] font-bold text-white">
                {summary.pendingDossiers.count} école{summary.pendingDossiers.count > 1 ? "s" : ""} partenaire{summary.pendingDossiers.count > 1 ? "s" : ""} ont soumis leur dossier d&apos;inscription en attente de validation.
              </p>
            </div>
          </div>
          <button className="ml-10 flex shrink-0 items-center gap-2 rounded-md bg-white px-3.5 py-2 text-[10px] font-bold text-[#233d52] hover:bg-[#edf3f8] transition-colors">
            <FileCheck2 size={12} /> Examiner les dossiers ({summary.pendingDossiers.count})
          </button>
        </section>
      )}

      {error ? (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-[11px] text-red-700">
          Erreur de chargement : {error}
        </div>
      ) : summary ? (
        <div className="mb-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Écoles actives"
            value={String(summary.schools.active)}
            trend={summary.schools.trend}
            icon={Building2}
            detail={
              <>
                <span>Réparties sur {summary.schools.provinces} province{summary.schools.provinces > 1 ? "s" : ""}</span>
                <strong className="text-[#3a5266]">
                  Taux d&apos;activité <b className="text-[#23906b]">{summary.schools.activityRate}%</b>
                </strong>
              </>
            }
          />
          <StatCard
            label="Dossiers en attente"
            value={String(summary.pendingDossiers.count)}
            icon={Clock3}
            accent="orange"
            detail={
              <>
                <span
                  className={`rounded-full px-2 py-0.5 text-[8px] font-bold ${
                    summary.pendingDossiers.urgent > 0
                      ? "bg-[#ffede2] text-[#c2672a]"
                      : "bg-[#f0f3f6] text-[#7d8c9a]"
                  }`}
                >
                  {summary.pendingDossiers.urgent} urgent{summary.pendingDossiers.urgent > 1 ? "s" : ""}
                </span>
                <strong className="text-[#3a5266]">Validation : {summary.pendingDossiers.avgValidationHours}h</strong>
              </>
            }
          />
          <StatCard
            label="Utilisateurs plateforme"
            value={summary.users.total.toLocaleString("fr-FR")}
            trend={summary.users.trend}
            icon={Users}
            accent="violet"
            detail={
              <>
                <span>Staff & enseignants</span>
                <strong className="text-[#3a5266]">
                  {summary.users.activeToday.toLocaleString("fr-FR")} actif{summary.users.activeToday > 1 ? "s" : ""} aujourd&apos;hui
                </strong>
              </>
            }
          />
          <StatCard
            label="Élèves couverts"
            value={summary.students.total.toLocaleString("fr-FR")}
            trend={summary.students.trend}
            icon={GraduationCap}
            accent="green"
            detail={
              <>
                <span>Licences SaaS actives</span>
                <strong className="text-[#3a5266]">{summary.students.renewalRate}% renouvellement</strong>
              </>
            }
          />
        </div>
      ) : null}

      {/* Alertes priorité */}
      {alerts.length > 0 && (
        <div className="mb-5">
          <AlertPanel alerts={alerts} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <GrowthChart growth={growth} metrics={metrics} />
        </div>
        <div className="space-y-5">
          <ActivityPanel items={activityLog} />
          <TicketPanel tickets={tickets} />
        </div>
      </div>
    </>
  );
}
