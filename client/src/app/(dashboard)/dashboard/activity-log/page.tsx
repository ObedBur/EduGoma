"use client";

import {
  Activity,
  AlertCircle,
  Archive,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Download,
  FileCheck2,
  KeyRound,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { statsApi, type ActivityLogItem } from "@/lib/api";

type EventTone = "green" | "blue" | "violet" | "red" | "gray";
type ActivityEvent = {
  id: string;
  group: string;
  type: string;
  tone: EventTone;
  title: string;
  description: string;
  school: string;
  admin: string;
  relative: string;
  exact: string;
};

function toneForType(type: string): EventTone {
  if (type.includes("ACCESS") || type.includes("GRANTED") || type.includes("LOGIN_SUCCESS")) return "green";
  if (type.includes("DOSSIER") || type.includes("SUBMITTED") || type.includes("REGISTERED")) return "blue";
  if (type.includes("ROLE") || type.includes("PASSWORD")) return "violet";
  if (type.includes("SUSPEND") || type.includes("REJECT") || type.includes("FAILED") || type.includes("DEACTIVAT")) return "red";
  return "gray";
}

function groupForTime(time: string): string {
  if (!time) return "Récent";
  if (time.includes("à l'instant") || /^\d+m/.test(time)) return "Aujourd'hui";
  if (/^\d+h/.test(time)) return "Aujourd'hui";
  if (/^1j/.test(time)) return "Hier";
  return "Plus tôt";
}

function mapLogToEvent(item: ActivityLogItem, index: number): ActivityEvent {
  return {
    id: `log-${index}`,
    group: groupForTime(item.time),
    type: item.type,
    tone: toneForType(item.type),
    title: item.title,
    description: item.text,
    school: item.school || "Système",
    admin: item.user || "Système",
    relative: item.time,
    exact: item.time,
  };
}

const activityEvents: ActivityEvent[] = [];

const toneStyles: Record<EventTone, { icon: string; background: string }> = {
  green: { icon: "text-[#2e9d76]", background: "bg-[#e5f7ef]" },
  blue: { icon: "text-[#4a86b7]", background: "bg-[#e6f1fc]" },
  violet: { icon: "text-[#7167bd]", background: "bg-[#f0edff]" },
  red: { icon: "text-[#c55e67]", background: "bg-[#ffe5e5]" },
  gray: { icon: "text-[#71808d]", background: "bg-[#eef2f5]" },
};

function EventIcon({ event }: { event: ActivityEvent }) {
  const Icon = event.tone === "green" ? CheckCircle2 : event.tone === "blue" ? FileCheck2 : event.tone === "violet" ? KeyRound : event.tone === "red" ? AlertCircle : Cloud;
  const styles = toneStyles[event.tone];
  return <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${styles.background} ${styles.icon}`}><Icon size={15} /></span>;
}

function SelectFilter({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label className="relative flex h-8 items-center"><span className="sr-only">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="h-8 min-w-[150px] appearance-none rounded-md border border-[#dce5eb] bg-white px-3 pr-8 text-[10px] font-semibold text-[#536b7d] outline-none focus:border-[#76a8cd]"><option>{label}</option>{options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={12} className="pointer-events-none absolute right-2.5 text-[#8293a0]" /></label>;
}

export default function ActivityLog() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("Toutes les dates");
  const [eventType, setEventType] = useState("Tous les événements");
  const [school, setSchool] = useState("Toutes les écoles");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const logs = await statsApi.getActivityLog(50);
        if (!cancelled) setEvents(logs.map(mapLogToEvent));
      } catch {
        if (!cancelled) setEvents([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filteredEvents = useMemo(() => events.filter((event) => `${event.title} ${event.description} ${event.school} ${event.admin} ${event.type}`.toLowerCase().includes(search.toLowerCase()) && (eventType === "Tous les événements" || event.type === eventType) && (school === "Toutes les écoles" || event.school === school)), [eventType, school, search, events]);
  const groupedEvents = useMemo(() => filteredEvents.reduce<Record<string, ActivityEvent[]>>((groups, event) => { (groups[event.group] ??= []).push(event); return groups; }, {}), [filteredEvents]);
  const eventTypes = useMemo(() => Array.from(new Set(events.map((e) => e.type))), [events]);
  const schools = useMemo(() => Array.from(new Set(events.map((e) => e.school))), [events]);

  const exportCsv = () => {
    const rows = ["Date;Type;Événement;École;Administrateur", ...filteredEvents.map((event) => `${event.exact};${event.type};${event.title};${event.school};${event.admin}`)];
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "journal-activite-edugoma.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (<><div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><div className="mb-2 flex items-center gap-1.5 text-[9px] text-[#81909d]"><span className="rounded bg-[#e8f1f7] px-2 py-1 font-bold uppercase tracking-[0.07em] text-[#436b85]">▦ EDUGOMA › Tableau de bord</span><span>•</span><span>Audit & conformité</span></div><h1 className="text-[23px] font-bold tracking-[-0.04em] text-[#172f45]">Journal d'activité</h1><p className="mt-1 text-[11px] text-[#778894]">Historique des actions de la plateforme EduGoma</p></div><button onClick={exportCsv} className="flex h-8 items-center gap-2 rounded-md border border-[#dce5eb] bg-white px-3 text-[10px] font-bold text-[#55758a] shadow-[0_2px_6px_rgba(33,60,84,0.025)] hover:bg-[#f5f8fa]"><Download size={13} /> Exporter (CSV)</button></div><section className="mb-4 rounded-md border border-[#e4eaf0] bg-white p-3.5 shadow-[0_2px_7px_rgba(33,60,84,0.025)]"><div className="flex flex-col gap-2.5 xl:flex-row xl:items-center"><div className="relative min-w-0 flex-1"><Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8d9aaa]" /><input value={search} onChange={(event) => setSearch(event.target.value)} className="h-8 w-full rounded-md border border-[#e0e7ee] bg-[#f8fafc] pl-9 pr-3 text-[10px] text-[#33485c] outline-none placeholder:text-[#9aa6b4] focus:border-[#76a8cd]" placeholder="Rechercher un événement, une école, un admin..." /></div><div className="flex flex-wrap items-center gap-2"><label className="relative flex h-8 items-center"><CalendarDays size={12} className="pointer-events-none absolute left-2.5 text-[#718696]" /><select value={dateRange} onChange={(event) => setDateRange(event.target.value)} className="h-8 appearance-none rounded-md border border-[#dce5eb] bg-white pl-8 pr-8 text-[10px] font-semibold text-[#536b7d] outline-none focus:border-[#76a8cd]"><option>Toutes les dates</option><option>Aujourd'hui</option><option>7 derniers jours</option><option>30 derniers jours</option></select><ChevronDown size={12} className="pointer-events-none absolute right-2.5 text-[#8293a0]" /></label><SelectFilter label="Tous les événements" value={eventType} options={eventTypes} onChange={setEventType} /><SelectFilter label="Toutes les écoles" value={school} options={schools} onChange={setSchool} />{(search || dateRange !== "Toutes les dates" || eventType !== "Tous les événements" || school !== "Toutes les écoles") && <button onClick={() => { setSearch(""); setDateRange("Toutes les dates"); setEventType("Tous les événements"); setSchool("Toutes les écoles"); }} className="flex h-8 items-center gap-1 rounded-md px-2 text-[9px] font-bold text-[#758a98] hover:bg-[#f2f6f8]"><X size={12} /> Réinitialiser</button>}</div></div></section><section className="rounded-md border border-[#e4eaf0] bg-white shadow-[0_2px_7px_rgba(33,60,84,0.025)]"><div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#edf1f4] px-4 py-3"><div><h2 className="flex items-center gap-2 text-[12px] font-bold text-[#23394e]"><Activity size={13} /> Événements récents</h2><p className="mt-1 text-[9px] text-[#8a97a4]">Toutes les actions administratives et système enregistrées</p></div><span className="rounded-full bg-[#eef3f7] px-2 py-1 text-[9px] font-bold text-[#687f8f]">{loading ? "…" : `${filteredEvents.length} événements`}</span></div>{Object.keys(groupedEvents).length ? <div>{Object.entries(groupedEvents).map(([group, eventsInGroup]) => <div key={group}><div className="sticky top-0 z-10 flex items-center gap-2 border-b border-[#edf1f4] bg-[#f8fafc]/95 px-4 py-2.5 backdrop-blur-sm"><span className="h-1.5 w-1.5 rounded-full bg-[#5e87a0]" /><span className="text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#657b8b]">{group}</span><span className="h-px flex-1 bg-[#e5ebef]" /><span className="text-[8px] text-[#9aa6af]">{eventsInGroup.length} événement{eventsInGroup.length > 1 ? "s" : ""}</span></div><div>{eventsInGroup.map((event) => <article key={event.id} className="group flex gap-3 border-b border-[#f0f3f5] px-4 py-3.5 last:border-0 hover:bg-[#fbfdff]"><EventIcon event={event} /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1"><div className="flex items-center gap-2"><h3 className="text-[10px] font-bold text-[#435a6b]">{event.title}</h3><span className="hidden rounded bg-[#f1f5f7] px-1.5 py-0.5 text-[8px] font-semibold text-[#8a99a4] sm:inline">{event.type}</span></div><time title={event.exact} className="shrink-0 text-[9px] font-medium text-[#8f9ca6]">{event.relative}</time></div><p className="mt-1 text-[9px] leading-[1.45] text-[#82909b]">{event.description}</p><div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[8px] text-[#9aa6af]"><span className="flex items-center gap-1"><Building2 size={10} />{event.school}</span><span className="flex items-center gap-1"><UserRound size={10} />{event.admin}</span><span title={event.exact}>{event.exact}</span></div></div></article>)}</div></div>)}</div> : loading ? <div className="px-4 py-14 text-center text-[11px] text-[#8a97a4]">Chargement des événements…</div> : <div className="px-4 py-14 text-center"><Search size={18} className="mx-auto text-[#9aa8b3]" /><p className="mt-2 text-[11px] font-semibold text-[#5e7485]">Aucun événement trouvé</p><p className="mt-1 text-[9px] text-[#98a5ae]">Modifiez vos filtres pour afficher les événements correspondants.</p></div>}<div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#edf1f4] px-4 py-3"><span className="text-[9px] text-[#8d99a4]">{loading ? "Chargement…" : `Affichage de ${filteredEvents.length} événements`}</span><div className="flex items-center gap-1"><button onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="flex h-7 w-7 items-center justify-center rounded border border-[#e0e7ed] text-[#627486] hover:bg-[#f5f8fa] disabled:cursor-not-allowed disabled:opacity-40" aria-label="Page précédente"><ChevronLeft size={13} /></button><span className="px-2 text-[9px] font-bold text-[#627486]">Page {page}</span><button onClick={() => setPage((current) => current + 1)} disabled={filteredEvents.length < 50} className="flex h-7 w-7 items-center justify-center rounded border border-[#e0e7ed] text-[#627486] hover:bg-[#f5f8fa] disabled:cursor-not-allowed disabled:opacity-40" aria-label="Page suivante"><ChevronRight size={13} /></button></div></div></section></>);
}

