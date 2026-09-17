"use client";

import {
  AlertCircle,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  CreditCard,
  FileClock,
  History,
  Info,
  ListFilter,
  Search,
  WalletCards,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { StatCard } from "@/components/layout/DashboardShared";

type BillingStatus = "Essai gratuit" | "Actif" | "En retard" | "Suspendu";
type BillingFilter = "Tous" | "Essai gratuit" | "Actifs" | "En retard" | "Suspendus";

type Payment = { date: string; amount: string; admin: string; note: string };
type BillingSchool = {
  name: string;
  id: string;
  city: string;
  province: string;
  status: BillingStatus;
  statusTone: "blue" | "green" | "orange" | "red";
  statusDetail: string;
  trialStart: string;
  trialEnd: string;
  lastPayment: string;
  amountDue: string;
  dueTone: "neutral" | "orange" | "red";
  payments: Payment[];
};

const initialSchools: BillingSchool[] = [
  {
    name: "Institut Mwangaza de Goma",
    id: "EDUG-NK-GOM-0589",
    city: "Goma (Sud)",
    province: "Nord-Kivu",
    status: "Essai gratuit",
    statusTone: "blue",
    statusDetail: "Essai — 42j restants",
    trialStart: "02 oct. 2024",
    trialEnd: "25 nov. 2024",
    lastPayment: "Aucun paiement",
    amountDue: "$0",
    dueTone: "neutral",
    payments: [],
  },
  {
    name: "Collège Alfajiri",
    id: "EDUG-SK-BUK-0012",
    city: "Bukavu",
    province: "Sud-Kivu",
    status: "Actif",
    statusTone: "green",
    statusDetail: "Actif",
    trialStart: "15 août 2024",
    trialEnd: "15 oct. 2024",
    lastPayment: "01 oct. 2024 · $10",
    amountDue: "$0",
    dueTone: "neutral",
    payments: [{ date: "01 oct. 2024", amount: "$10", admin: "Dr. Julien Makiese", note: "Renouvellement mensuel" }, { date: "01 sept. 2024", amount: "$10", admin: "Aline Kabuya", note: "Renouvellement mensuel" }],
  },
  {
    name: "Lycée Amanzi EDUG",
    id: "EDUG-NK-GOM-0095",
    city: "Goma (Centre)",
    province: "Nord-Kivu",
    status: "En retard",
    statusTone: "orange",
    statusDetail: "En retard de 10 jours",
    trialStart: "12 juin 2024",
    trialEnd: "12 août 2024",
    lastPayment: "12 sept. 2024 · $10",
    amountDue: "$10",
    dueTone: "orange",
    payments: [{ date: "12 sept. 2024", amount: "$10", admin: "Dr. Julien Makiese", note: "Renouvellement mensuel" }, { date: "12 août 2024", amount: "$10", admin: "Dr. Julien Makiese", note: "Fin de la période d'essai" }],
  },
  {
    name: "Institut Technique Industriel (ITIG)",
    id: "EDUG-NK-GOM-0104",
    city: "Goma (Karisimbi)",
    province: "Nord-Kivu",
    status: "Suspendu",
    statusTone: "red",
    statusDetail: "Suspendu depuis 03 oct. 2024",
    trialStart: "01 juin 2024",
    trialEnd: "01 août 2024",
    lastPayment: "01 sept. 2024 · $10",
    amountDue: "$10",
    dueTone: "red",
    payments: [{ date: "01 sept. 2024", amount: "$10", admin: "Aline Kabuya", note: "Renouvellement mensuel" }, { date: "01 août 2024", amount: "$10", admin: "Aline Kabuya", note: "Renouvellement mensuel" }],
  },
];

const statusStyles: Record<BillingSchool["statusTone"], string> = {
  blue: "bg-[#e6f1fc] text-[#4a86b7]",
  green: "bg-[#e5f7ef] text-[#379d78]",
  orange: "bg-[#fff0db] text-[#ba7938]",
  red: "bg-[#ffe5e5] text-[#c55d63]",
};

function StatusBadge({ school }: { school: BillingSchool }) {
  const icon = school.status === "Actif" ? <Check size={10} /> : school.status === "En retard" || school.status === "Suspendu" ? <AlertCircle size={10} /> : <Clock3 size={10} />;
  return <span className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[9px] font-bold ${statusStyles[school.statusTone]}`}>{icon}{school.status === "Essai gratuit" ? school.statusDetail : school.status}</span>;
}

function PaymentModal({ school, onClose, onConfirm }: { school: BillingSchool; onClose: () => void; onConfirm: (date: string) => void }) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const monthLabel = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(new Date(`${date}T12:00:00`));
  return <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#102d48]/25 p-4 backdrop-blur-[1px]"><div className="w-full max-w-[400px] rounded-lg border border-[#e1e8ed] bg-white shadow-[0_16px_45px_rgba(18,46,70,0.18)]"><div className="flex items-start justify-between border-b border-[#edf1f4] px-5 py-4"><div><p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#8b98a3]">Réception d'un paiement</p><h2 className="mt-1 text-[15px] font-extrabold tracking-[-0.02em] text-[#243c51]">Confirmer le paiement</h2></div><button onClick={onClose} className="rounded-lg p-1.5 text-[#8a98a4] hover:bg-[#f3f6f8]" aria-label="Fermer"><X size={16} /></button></div><div className="px-5 py-4"><div className="rounded-md bg-[#f5f9fb] px-3 py-2.5"><p className="text-[10px] font-bold text-[#415b6d]">{school.name}</p><p className="mt-1 text-[9px] text-[#8b98a3]">{school.id}</p></div><p className="mt-4 text-[11px] leading-relaxed text-[#526a7a]">Confirmer la réception du paiement de <strong className="text-[#243f55]">$10</strong> pour <strong className="text-[#243f55]">{school.name}</strong> — mois de <strong className="text-[#243f55]">{monthLabel}</strong> ?</p><label className="mt-4 block text-[9px] font-bold uppercase tracking-[0.05em] text-[#8997a2]">Date de réception</label><div className="relative mt-1.5"><CalendarDays size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8295a3]" /><input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="h-9 w-full rounded-md border border-[#dfe7ec] bg-white pl-9 pr-3 text-[10px] font-medium text-[#536a7b] outline-none focus:border-[#76a8cd]" /></div></div><div className="flex justify-end gap-2 border-t border-[#edf1f4] px-5 py-3"><button onClick={onClose} className="rounded-md border border-[#dfe7ec] px-3 py-2 text-[10px] font-bold text-[#6e7f8d] hover:bg-[#f6f8fa]">Annuler</button><button onClick={() => onConfirm(date)} className="flex items-center gap-1.5 rounded-md bg-[#102d48] px-3 py-2 text-[10px] font-bold text-white hover:bg-[#193d5e]"><Check size={12} /> Confirmer le paiement</button></div></div></div>;
}

function HistoryDrawer({ school, onClose }: { school: BillingSchool; onClose: () => void }) {
  return <><button className="fixed inset-0 z-40 bg-[#0f2940]/25 backdrop-blur-[1px]" onClick={onClose} aria-label="Fermer l'historique" /><aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[420px] flex-col bg-white shadow-[-10px_0_30px_rgba(22,50,73,0.15)]"><div className="flex items-start justify-between border-b border-[#e8edf1] px-5 py-4"><div><p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#8c99a4]">Historique de facturation</p><h2 className="mt-1 text-[16px] font-extrabold tracking-[-0.03em] text-[#1c344a]">{school.name}</h2><p className="mt-1 text-[9px] text-[#8a97a3]">{school.id}</p></div><button onClick={onClose} className="rounded-lg p-2 text-[#8a98a4] hover:bg-[#f3f6f8]" aria-label="Fermer"><X size={17} /></button></div><div className="flex-1 overflow-y-auto px-5 py-4"><div className="mb-4 flex items-center justify-between rounded-md bg-[#f5f9fb] px-3 py-2.5"><div><p className="text-[9px] text-[#8a98a3]">Statut actuel</p><div className="mt-1"><StatusBadge school={school} /></div></div><div className="text-right"><p className="text-[9px] text-[#8a98a3]">Total reçu</p><p className="mt-1 text-[13px] font-extrabold text-[#29445b]">${school.payments.length * 10}</p></div></div>{school.payments.length ? <div className="space-y-3">{school.payments.map((payment, index) => <div key={`${payment.date}-${index}`} className="relative flex gap-3"><div className="flex flex-col items-center"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e5f7ef] text-[#379d78]"><CircleDollarSign size={13} /></span>{index < school.payments.length - 1 && <span className="mt-1 h-full w-px bg-[#e6edf0]" />}</div><div className="min-w-0 flex-1 pb-3"><div className="flex items-start justify-between gap-2"><div><p className="text-[11px] font-bold text-[#41596b]">{payment.amount}</p><p className="mt-0.5 text-[9px] text-[#8997a2]">{payment.date}</p></div><span className="rounded bg-[#eaf5f1] px-1.5 py-1 text-[8px] font-bold text-[#3d9276]">Reçu</span></div><p className="mt-2 text-[9px] text-[#728390]">{payment.note}</p><p className="mt-1 text-[8px] text-[#a0aab2]">Enregistré par {payment.admin}</p></div></div>)}</div> : <div className="rounded-md border border-dashed border-[#dfe7ec] px-4 py-10 text-center"><FileClock size={20} className="mx-auto text-[#9aabb6]" /><p className="mt-2 text-[11px] font-semibold text-[#5d7484]">Aucun paiement enregistré</p><p className="mt-1 text-[9px] text-[#96a3ad]">Cette école est toujours dans sa période d'essai gratuit.</p></div>}</div><div className="border-t border-[#edf1f4] px-5 py-4"><p className="flex items-center gap-1.5 text-[9px] leading-relaxed text-[#8796a1]"><Info size={12} className="shrink-0 text-[#6e91a5]" /> Les paiements sont enregistrés manuellement par l'équipe EduGoma.</p></div></aside></>;
}

export default function Billing() {
  
  const [schools, setSchools] = useState(initialSchools);
  const [filter, setFilter] = useState<BillingFilter>("Tous");
  const [search, setSearch] = useState("");
  const [selectedForPayment, setSelectedForPayment] = useState<BillingSchool | null>(null);
  const [historySchool, setHistorySchool] = useState<BillingSchool | null>(null);

  const filteredSchools = useMemo(() => schools.filter((school) => {
    const matchesSearch = `${school.name} ${school.id} ${school.city}`.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "Tous" || (filter === "Essai gratuit" && school.status === "Essai gratuit") || (filter === "Actifs" && school.status === "Actif") || (filter === "En retard" && school.status === "En retard") || (filter === "Suspendus" && school.status === "Suspendu");
    return matchesSearch && matchesFilter;
  }), [filter, schools, search]);

  const trialCount = schools.filter((school) => school.status === "Essai gratuit").length;
  const activeCount = schools.filter((school) => school.status === "Actif").length;
  const overdueCount = schools.filter((school) => school.status === "En retard" || school.status === "Suspendu").length;
  const endingSoonCount = 0;
  const mrr = activeCount * 10;

  const confirmPayment = (date: string) => {
    if (!selectedForPayment) return;
    const formattedDate = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${date}T12:00:00`));
    const nextPayment = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(new Date(`${date}T12:00:00`).setMonth(new Date(`${date}T12:00:00`).getMonth() + 1)));
    const payment: Payment = { date: formattedDate, amount: "$10", admin: "Dr. Julien Makiese", note: "Paiement mensuel enregistré manuellement" };
    setSchools((current) => current.map((school) => school.id === selectedForPayment.id ? { ...school, status: "Actif", statusTone: "green", statusDetail: "Actif", lastPayment: `${formattedDate} · $10`, amountDue: "$0", dueTone: "neutral", trialEnd: nextPayment, payments: [payment, ...school.payments] } : school));
    setSelectedForPayment(null);
  };

  return (<><div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><div className="mb-2 flex items-center gap-1.5 text-[9px] text-[#81909d]"><span className="rounded bg-[#e8f1f7] px-2 py-1 font-bold uppercase tracking-[0.07em] text-[#436b85]">▦ EDUGOMA SAAS › PLATFORM CONTROL CENTER</span><span>•</span><span>Facturation</span></div><h1 className="text-[23px] font-bold tracking-[-0.04em] text-[#172f45]">Abonnements &amp; Facturation</h1><p className="mt-1 text-[11px] text-[#778894]">Suivi des essais gratuits et paiements des écoles partenaires — 10$/mois, essai gratuit de 2 mois</p></div><div className="flex items-center gap-2 rounded-md border border-[#e1e8ee] bg-white px-3 py-2 shadow-[0_2px_6px_rgba(33,60,84,0.025)]"><WalletCards size={15} className="text-[#6688a0]" /><div><p className="text-[8px] font-semibold text-[#74818c]">Modèle de facturation</p><p className="text-[10px] font-bold text-[#355166]">Manuel · $10 / mois</p></div></div></div><div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Écoles en essai gratuit" value={String(trialCount)} icon={Clock3} accent="blue" detail={<><span>2 mois offerts</span><strong className="text-[#4a86b7]">Conversion en cours</strong></>} /><StatCard label="Écoles actives payantes" value={String(activeCount)} trend="100% à jour" icon={CheckCircle2} accent="green" detail={<><span>Abonnement mensuel</span><strong className="text-[#2e9d76]">$10 / école</strong></>} /><StatCard label="Paiements en retard" value={String(overdueCount)} icon={AlertCircle} accent="orange" detail={<><span className="text-[#c45d66]">Action requise</span><strong className="text-[#42586a]">À relancer aujourd'hui</strong></>} /><StatCard label="Revenu mensuel récurrent (MRR)" value={`$${mrr.toLocaleString("fr-FR")}`} icon={CircleDollarSign} accent="green" detail={<><span>Sur les abonnements actifs</span><strong className="text-[#2e9d76]">+8,4% ce mois</strong></>} /></div>{(endingSoonCount > 0 || overdueCount > 0) && <section className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md bg-[#102d48] px-4 py-3 text-white shadow-[0_3px_8px_rgba(15,44,70,0.12)]"><div className="flex items-center gap-3"><div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#214863] text-[#f2c278]"><AlertCircle size={14} /></div><div><div className="flex flex-wrap items-center gap-2"><span className="text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#f4d18c]">Attention facturation</span><span className="text-[10px] text-[#c4d3de]">Suivi manuel requis</span></div><p className="mt-0.5 text-[11px] font-bold text-white">{endingSoonCount} essai{endingSoonCount > 1 ? "s" : ""} se termine{endingSoonCount > 1 ? "nt" : ""} cette semaine <span className="text-[#8daabd]">•</span> {overdueCount} école{overdueCount > 1 ? "s" : ""} en retard de paiement</p><p className="mt-0.5 text-[9px] text-[#b7c9d6]">Les paiements sont enregistrés manuellement par l'équipe EduGoma.</p></div></div><button onClick={() => setFilter("En retard")} className="ml-10 flex shrink-0 items-center gap-2 rounded bg-white px-3 py-2 text-[9px] font-bold text-[#29465d] hover:bg-[#eaf2f7]"><ListFilter size={11} /> Voir les comptes concernés</button></section>}<section className="rounded-md border border-[#e4eaf0] bg-white shadow-[0_2px_7px_rgba(33,60,84,0.025)]"><div className="flex flex-col gap-3 border-b border-[#edf1f4] px-4 py-3 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="text-[12px] font-bold text-[#23394e]">Suivi des abonnements</h2><p className="mt-1 text-[9px] text-[#8a97a4]">Gérez les essais et confirmez les paiements mensuels des écoles partenaires</p></div><div className="relative w-full lg:w-[260px]"><Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8d9aaa]" /><input value={search} onChange={(event) => setSearch(event.target.value)} className="h-8 w-full rounded-md border border-[#e0e7ee] bg-[#f8fafc] pl-9 pr-3 text-[10px] text-[#33485c] outline-none placeholder:text-[#9aa6b4] focus:border-[#76a8cd]" placeholder="Rechercher une école..." /></div></div><div className="flex flex-wrap items-center gap-2 border-b border-[#edf1f4] px-4 py-3"><span className="mr-1 text-[9px] font-bold uppercase tracking-[0.05em] text-[#9aa5af]">Filtrer</span>{(["Tous", "Essai gratuit", "Actifs", "En retard", "Suspendus"] as BillingFilter[]).map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-full px-2.5 py-1 text-[9px] font-bold transition ${filter === item ? "bg-[#102d48] text-white" : "bg-[#f1f5f7] text-[#718392] hover:bg-[#e6eef3]"}`}>{item}</button>)}<span className="ml-auto text-[9px] text-[#94a0aa]">{filteredSchools.length} école{filteredSchools.length > 1 ? "s" : ""}</span></div><div className="overflow-x-auto"><table className="w-full min-w-[1080px] border-collapse text-left"><thead><tr className="bg-[#f8fafc] text-[8px] font-bold uppercase tracking-[0.06em] text-[#83909c]"><th className="px-4 py-2.5">École &amp; ID</th><th className="px-3 py-2.5">Statut d'abonnement</th><th className="px-3 py-2.5">Début d'essai</th><th className="px-3 py-2.5">Fin d'essai / prochain dû</th><th className="px-3 py-2.5">Dernier paiement reçu</th><th className="px-3 py-2.5">Montant dû</th><th className="px-3 py-2.5 text-right">Actions</th></tr></thead><tbody>{filteredSchools.map((school) => <tr key={school.id} className="border-t border-[#edf1f4] align-middle hover:bg-[#fbfdff]"><td className="px-4 py-3"><p className="max-w-[190px] text-[10px] font-bold leading-[1.35] text-[#344a5f]">{school.name}</p><p className="mt-1 text-[8px] font-medium text-[#9aa5b0]">{school.id}</p><p className="mt-1 text-[8px] text-[#9aa5b0]">{school.city} · {school.province}</p></td><td className="px-3 py-3"><StatusBadge school={school} /></td><td className="px-3 py-3 text-[9px] text-[#71818e]">{school.trialStart}</td><td className="px-3 py-3"><p className={`text-[9px] font-semibold ${school.status === "En retard" || school.status === "Suspendu" ? "text-[#ba7938]" : "text-[#617887]"}`}>{school.trialEnd}</p><p className="mt-1 text-[8px] text-[#9aa5ae]">{school.statusDetail}</p></td><td className="px-3 py-3 text-[9px] text-[#71818e]">{school.lastPayment}</td><td className="px-3 py-3"><span className={`text-[10px] font-extrabold ${school.dueTone === "neutral" ? "text-[#6d8190]" : school.dueTone === "red" ? "text-[#c25e67]" : "text-[#ba7938]"}`}>{school.amountDue}</span></td><td className="px-3 py-3"><div className="flex items-center justify-end gap-2"><button onClick={() => setSelectedForPayment(school)} disabled={school.status === "Essai gratuit"} className="whitespace-nowrap rounded-md bg-[#102d48] px-2.5 py-1.5 text-[9px] font-bold text-white transition hover:bg-[#193d5e] disabled:cursor-not-allowed disabled:bg-[#edf1f4] disabled:text-[#a3adb5]">Marquer comme payé</button><button onClick={() => setHistorySchool(school)} className="whitespace-nowrap text-[9px] font-bold text-[#557f9c] hover:underline">Voir historique</button></div></td></tr>)}</tbody></table>{filteredSchools.length === 0 && <div className="px-4 py-12 text-center"><Search size={18} className="mx-auto text-[#9aa8b3]" /><p className="mt-2 text-[11px] font-semibold text-[#5e7485]">Aucune école trouvée</p><p className="mt-1 text-[9px] text-[#98a5ae]">Modifiez votre recherche ou votre filtre pour afficher des résultats.</p></div>}</div><div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#edf1f4] px-4 py-2.5 text-[9px] text-[#8d99a4]"><span>Dernière synchronisation : aujourd'hui à 09:42 CAT</span><span className="flex items-center gap-1 text-[#379d78]"><CheckCircle2 size={11} /> Données à jour</span></div></section>{selectedForPayment && <PaymentModal school={selectedForPayment} onClose={() => setSelectedForPayment(null)} onConfirm={confirmPayment} />}{historySchool && <HistoryDrawer school={schools.find((school) => school.id === historySchool.id) ?? historySchool} onClose={() => setHistorySchool(null)} />}</>);
}