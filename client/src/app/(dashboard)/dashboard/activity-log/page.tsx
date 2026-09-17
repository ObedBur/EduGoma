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
  CreditCard,
  Download,
  FileCheck2,
  KeyRound,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";


type EventType = "Accès école activé" | "Dossier soumis" | "Identifiants générés" | "Abonnement suspendu" | "Sauvegarde automatique" | "Paiement reçu";
type EventTone = "green" | "blue" | "violet" | "red" | "gray";
type ActivityEvent = {
  id: string;
  group: "Aujourd'hui" | "Hier" | "15 Octobre 2024";
  type: EventType;
  tone: EventTone;
  title: string;
  description: string;
  school: string;
  admin: string;
  relative: string;
  exact: string;
};

const activityEvents: ActivityEvent[] = [
  { id: "evt-1", group: "Aujourd'hui", type: "Accès école activé", tone: "green", title: "Accès école activé", description: "Accès activé pour l'école Complexe Scolaire La Fontaine. Instance provisionnée avec succès.", school: "Complexe Scolaire La Fontaine", admin: "Système EduGoma", relative: "il y a 12m", exact: "17 octobre 2024 · 09:30 CAT" },
  { id: "evt-2", group: "Aujourd'hui", type: "Dossier soumis", tone: "blue", title: "Dossier soumis", description: "Les statuts et le formulaire d'adhésion ont été téléversés pour examen.", school: "Institut Technique Industriel (ITIG)", admin: "Théophile Kamanzi", relative: "il y a 1h", exact: "17 octobre 2024 · 08:19 CAT" },
  { id: "evt-3", group: "Aujourd'hui", type: "Paiement reçu", tone: "green", title: "Paiement licence reçu", description: "Le renouvellement mensuel de la licence SaaS a été enregistré manuellement.", school: "Collège Alfajiri", admin: "Dr. Julien Makiese", relative: "il y a 3h", exact: "17 octobre 2024 · 06:12 CAT" },
  { id: "evt-4", group: "Aujourd'hui", type: "Identifiants générés", tone: "violet", title: "Identifiants Admin générés", description: "Accès préventifs créés avec authentification 2FA activée par défaut.", school: "Institut Mwangaza de Goma", admin: "Système EduGoma", relative: "il y a 4h", exact: "17 octobre 2024 · 05:46 CAT" },
  { id: "evt-5", group: "Hier", type: "Abonnement suspendu", tone: "red", title: "Abonnement suspendu", description: "Le compte école a été suspendu suite à un retard de paiement supérieur à 10 jours.", school: "Lycée Amanzi EDUG", admin: "Dr. Julien Makiese", relative: "il y a 1j", exact: "16 octobre 2024 · 16:28 CAT" },
  { id: "evt-6", group: "Hier", type: "Dossier soumis", tone: "blue", title: "Dossier soumis", description: "Une nouvelle version des statuts a été ajoutée au dossier d'adhésion.", school: "Lycée Amanzi EDUG", admin: "Espérance Bisimwa", relative: "il y a 1j", exact: "16 octobre 2024 · 11:04 CAT" },
  { id: "evt-7", group: "Hier", type: "Sauvegarde automatique", tone: "gray", title: "Sauvegarde automatique", description: "Sauvegarde multi-tenant synchronisée avec succès vers le coffre-fort cloud EduGoma.", school: "Infrastructure SaaS Cloud", admin: "Système EduGoma", relative: "il y a 1j", exact: "16 octobre 2024 · 06:00 CAT" },
  { id: "evt-8", group: "Hier", type: "Accès école activé", tone: "green", title: "Accès école activé", description: "Les accès du directeur et du secrétariat ont été activés après validation du dossier.", school: "Collège Alfajiri", admin: "Dr. Julien Makiese", relative: "il y a 1j", exact: "16 octobre 2024 · 04:52 CAT" },
  { id: "evt-9", group: "15 Octobre 2024", type: "Paiement reçu", tone: "green", title: "Paiement licence reçu", description: "Renouvellement annuel 2024–2025 confirmé et reçu archivé dans l'espace école.", school: "Collège Alfajiri", admin: "Aline Kabuya", relative: "il y a 2j", exact: "15 octobre 2024 · 14:15 CAT" },
  { id: "evt-10", group: "15 Octobre 2024", type: "Identifiants générés", tone: "violet", title: "Identifiants Admin générés", description: "Le compte administrateur de l'établissement a été créé et envoyé au contact principal.", school: "Institut Technique Industriel (ITIG)", admin: "Système EduGoma", relative: "il y a 2j", exact: "15 octobre 2024 · 10:05 CAT" },
  { id: "evt-11", group: "15 Octobre 2024", type: "Sauvegarde automatique", tone: "gray", title: "Sauvegarde automatique", description: "Archives scellées et chiffrées disponibles dans le coffre-fort régional.", school: "Infrastructure SaaS Cloud", admin: "Système EduGoma", relative: "il y a 2j", exact: "15 octobre 2024 · 06:00 CAT" },
  { id: "evt-12", group: "15 Octobre 2024", type: "Dossier soumis", tone: "blue", title: "Dossier soumis", description: "Le dossier d'inscription a été transmis à la file de validation manuelle.", school: "Institut Mwangaza de Goma", admin: "Aline Nshuti", relative: "il y a 3j", exact: "14 octobre 2024 · 09:42 CAT" },
];

const toneStyles: Record<EventTone, { icon: string; background: string }> = {
  green: { icon: "text-[#2e9d76]", background: "bg-[#e5f7ef]" },
  blue: { icon: "text-[#4a86b7]", background: "bg-[#e6f1fc]" },
  violet: { icon: "text-[#7167bd]", background: "bg-[#f0edff]" },
  red: { icon: "text-[#c55e67]", background: "bg-[#ffe5e5]" },
  gray: { icon: "text-[#71808d]", background: "bg-[#eef2f5]" },
};

function EventIcon({ event }: { event: ActivityEvent }) {
  const Icon = event.type === "Accès école activé" ? CheckCircle2 : event.type === "Dossier soumis" ? FileCheck2 : event.type === "Identifiants générés" ? KeyRound : event.type === "Abonnement suspendu" ? AlertCircle : event.type === "Paiement reçu" ? CreditCard : Cloud;
  const styles = toneStyles[event.tone];
  return <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${styles.background} ${styles.icon}`}><Icon size={15} /></span>;
}

function SelectFilter({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label className="relative flex h-8 items-center"><span className="sr-only">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="h-8 min-w-[150px] appearance-none rounded-md border border-[#dce5eb] bg-white px-3 pr-8 text-[10px] font-semibold text-[#536b7d] outline-none focus:border-[#76a8cd]"><option>{label}</option>{options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={12} className="pointer-events-none absolute right-2.5 text-[#8293a0]" /></label>;
}

export default function ActivityLog() {
  
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("Toutes les dates");
  const [eventType, setEventType] = useState("Tous les événements");
  const [school, setSchool] = useState("Toutes les écoles");
  const [page, setPage] = useState(1);

  const filteredEvents = useMemo(() => activityEvents.filter((event) => `${event.title} ${event.description} ${event.school} ${event.admin} ${event.type}`.toLowerCase().includes(search.toLowerCase()) && (eventType === "Tous les événements" || event.type === eventType) && (school === "Toutes les écoles" || event.school === school)), [eventType, school, search]);
  const groupedEvents = useMemo(() => filteredEvents.reduce<Record<string, ActivityEvent[]>>((groups, event) => { (groups[event.group] ??= []).push(event); return groups; }, {}), [filteredEvents]);

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

  return (<><div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><div className="mb-2 flex items-center gap-1.5 text-[9px] text-[#81909d]"><span className="rounded bg-[#e8f1f7] px-2 py-1 font-bold uppercase tracking-[0.07em] text-[#436b85]">▦ EDUGOMA SAAS › PLATFORM CONTROL CENTER</span><span>•</span><span>Audit &amp; conformité</span></div><h1 className="text-[23px] font-bold tracking-[-0.04em] text-[#172f45]">Journal d'activité</h1><p className="mt-1 text-[11px] text-[#778894]">Historique complet des actions et événements de la plateforme EduGoma</p></div><button onClick={exportCsv} className="flex h-8 items-center gap-2 rounded-md border border-[#dce5eb] bg-white px-3 text-[10px] font-bold text-[#55758a] shadow-[0_2px_6px_rgba(33,60,84,0.025)] hover:bg-[#f5f8fa]"><Download size={13} /> Exporter (CSV)</button></div><section className="mb-4 rounded-md border border-[#e4eaf0] bg-white p-3.5 shadow-[0_2px_7px_rgba(33,60,84,0.025)]"><div className="flex flex-col gap-2.5 xl:flex-row xl:items-center"><div className="relative min-w-0 flex-1"><Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8d9aaa]" /><input value={search} onChange={(event) => setSearch(event.target.value)} className="h-8 w-full rounded-md border border-[#e0e7ee] bg-[#f8fafc] pl-9 pr-3 text-[10px] text-[#33485c] outline-none placeholder:text-[#9aa6b4] focus:border-[#76a8cd]" placeholder="Rechercher un événement, une école, un admin..." /></div><div className="flex flex-wrap items-center gap-2"><label className="relative flex h-8 items-center"><CalendarDays size={12} className="pointer-events-none absolute left-2.5 text-[#718696]" /><select value={dateRange} onChange={(event) => setDateRange(event.target.value)} className="h-8 appearance-none rounded-md border border-[#dce5eb] bg-white pl-8 pr-8 text-[10px] font-semibold text-[#536b7d] outline-none focus:border-[#76a8cd]"><option>Toutes les dates</option><option>Aujourd'hui</option><option>7 derniers jours</option><option>30 derniers jours</option></select><ChevronDown size={12} className="pointer-events-none absolute right-2.5 text-[#8293a0]" /></label><SelectFilter label="Tous les événements" value={eventType} options={["Accès école activé", "Dossier soumis", "Identifiants générés", "Abonnement suspendu", "Sauvegarde automatique", "Paiement reçu"]} onChange={setEventType} /><SelectFilter label="Toutes les écoles" value={school} options={["Institut Mwangaza de Goma", "Collège Alfajiri", "Lycée Amanzi EDUG", "Institut Technique Industriel (ITIG)", "Infrastructure SaaS Cloud"]} onChange={setSchool} />{(search || dateRange !== "Toutes les dates" || eventType !== "Tous les événements" || school !== "Toutes les écoles") && <button onClick={() => { setSearch(""); setDateRange("Toutes les dates"); setEventType("Tous les événements"); setSchool("Toutes les écoles"); }} className="flex h-8 items-center gap-1 rounded-md px-2 text-[9px] font-bold text-[#758a98] hover:bg-[#f2f6f8]"><X size={12} /> Réinitialiser</button>}</div></div></section><section className="rounded-md border border-[#e4eaf0] bg-white shadow-[0_2px_7px_rgba(33,60,84,0.025)]"><div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#edf1f4] px-4 py-3"><div><h2 className="flex items-center gap-2 text-[12px] font-bold text-[#23394e]"><Activity size={13} /> Événements récents</h2><p className="mt-1 text-[9px] text-[#8a97a4]">Toutes les actions administratives, systèmes et changements d'état enregistrés</p></div><span className="rounded-full bg-[#eef3f7] px-2 py-1 text-[9px] font-bold text-[#687f8f]">2,410 événements enregistrés</span></div>{Object.keys(groupedEvents).length ? <div>{Object.entries(groupedEvents).map(([group, events]) => <div key={group}><div className="sticky top-0 z-10 flex items-center gap-2 border-b border-[#edf1f4] bg-[#f8fafc]/95 px-4 py-2.5 backdrop-blur-sm"><span className="h-1.5 w-1.5 rounded-full bg-[#5e87a0]" /><span className="text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#657b8b]">{group}</span><span className="h-px flex-1 bg-[#e5ebef]" /><span className="text-[8px] text-[#9aa6af]">{events.length} événement{events.length > 1 ? "s" : ""}</span></div><div>{events.map((event) => <article key={event.id} className="group flex gap-3 border-b border-[#f0f3f5] px-4 py-3.5 last:border-0 hover:bg-[#fbfdff]"><EventIcon event={event} /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1"><div className="flex items-center gap-2"><h3 className="text-[10px] font-bold text-[#435a6b]">{event.title}</h3><span className="hidden rounded bg-[#f1f5f7] px-1.5 py-0.5 text-[8px] font-semibold text-[#8a99a4] sm:inline">{event.type}</span></div><time title={event.exact} className="shrink-0 text-[9px] font-medium text-[#8f9ca6]">{event.relative}</time></div><p className="mt-1 text-[9px] leading-[1.45] text-[#82909b]">{event.description}</p><div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[8px] text-[#9aa6af]"><span className="flex items-center gap-1"><Building2 size={10} />{event.school}</span><span className="flex items-center gap-1"><UserRound size={10} />{event.admin}</span><span title={event.exact}>{event.exact}</span></div></div></article>)}</div></div>)}</div> : <div className="px-4 py-14 text-center"><Search size={18} className="mx-auto text-[#9aa8b3]" /><p className="mt-2 text-[11px] font-semibold text-[#5e7485]">Aucun événement trouvé</p><p className="mt-1 text-[9px] text-[#98a5ae]">Modifiez vos filtres pour afficher les événements correspondants.</p></div>}<div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#edf1f4] px-4 py-3"><span className="text-[9px] text-[#8d99a4]">Affichage de {filteredEvents.length} événements sur 2,410 événements</span><div className="flex items-center gap-1"><button onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="flex h-7 w-7 items-center justify-center rounded border border-[#e0e7ed] text-[#627486] hover:bg-[#f5f8fa] disabled:cursor-not-allowed disabled:opacity-40" aria-label="Page précédente"><ChevronLeft size={13} /></button><span className="px-2 text-[9px] font-bold text-[#627486]">Page {page} sur 49</span><button onClick={() => setPage((current) => Math.min(49, current + 1))} disabled={page === 49} className="flex h-7 w-7 items-center justify-center rounded border border-[#e0e7ed] text-[#627486] hover:bg-[#f5f8fa] disabled:cursor-not-allowed disabled:opacity-40" aria-label="Page suivante"><ChevronRight size={13} /></button></div></div></section></>);
}

