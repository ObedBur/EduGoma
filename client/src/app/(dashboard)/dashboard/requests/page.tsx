"use client";

import {
  AlertCircle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FileText,
  Inbox,
  Info,
  LifeBuoy,
  ListFilter,
  MessageSquareText,
  Paperclip,
  Search,
  ShieldAlert,
  UserRound,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { StatCard } from "@/components/layout/DashboardShared";

type RequestCategory = "Inscriptions école" | "Documents manquants" | "Facturation" | "Support technique";
type Priority = "Normal" | "Urgent" | "Critique";
type RequestItem = {
  id: string;
  category: RequestCategory;
  title: string;
  description: string;
  submitted: string;
  age: string;
  priority: Priority;
  school: string;
  schoolId: string;
  requester: string;
  context: string[];
  attachments: string[];
};

type RequestFilter = "Toutes" | RequestCategory;

const initialRequests: RequestItem[] = [
  {
    id: "REQ-2024-0419",
    category: "Inscriptions école",
    title: "Institut Mwangaza de Goma — dossier en attente depuis 3 jours",
    description: "Le dossier d'inscription est complet et prêt pour validation finale de l'instance scolaire.",
    submitted: "14 oct. 2024 · 09:42 CAT",
    age: "il y a 3j",
    priority: "Urgent",
    school: "Institut Mwangaza de Goma",
    schoolId: "EDUG-NK-GOM-0589",
    requester: "Aline Nshuti · Directrice",
    context: ["3 documents sur 3 validés", "Province : Nord-Kivu · Goma", "Plan prévu : Essai gratuit de 2 mois"],
    attachments: ["Statuts de l'établissement.pdf", "Autorisation d'ouverture.pdf", "Pièce d'identité responsable.pdf"],
  },
  {
    id: "REQ-2024-0417",
    category: "Documents manquants",
    title: "Lycée Amanzi EDUG — agrément provincial requis",
    description: "Le document d'agrément provincial manque au dossier. L'école a été invitée à le téléverser.",
    submitted: "16 oct. 2024 · 11:04 CAT",
    age: "il y a 1j",
    priority: "Critique",
    school: "Lycée Amanzi EDUG",
    schoolId: "EDUG-NK-GOM-0095",
    requester: "Espérance Bisimwa · Proviseure",
    context: ["2 documents sur 3 validés", "Province : Nord-Kivu · Goma Centre", "Blocage de l'activation de l'instance"],
    attachments: ["Statuts de l'établissement.pdf", "Pièce d'identité responsable.pdf"],
  },
  {
    id: "REQ-2024-0414",
    category: "Facturation",
    title: "Collège Alfajiri — contestation du renouvellement mensuel",
    description: "Le responsable administratif demande une vérification du paiement de 10$ enregistré le 01 octobre.",
    submitted: "17 oct. 2024 · 08:15 CAT",
    age: "il y a 8h",
    priority: "Normal",
    school: "Collège Alfajiri",
    schoolId: "EDUG-SK-BUK-0012",
    requester: "Grâce Furaha · Secrétaire",
    context: ["Paiement manuel de $10 signalé", "Dernier reçu : 01 oct. 2024", "Plan : Établissement Pro"],
    attachments: ["Reçu de paiement_alfajiri.jpg"],
  },
  {
    id: "REQ-2024-0412",
    category: "Support technique",
    title: "Institut Technique Industriel — import des élèves bloqué",
    description: "Le fichier CSV d'import des élèves est refusé malgré un format conforme au modèle EduGoma.",
    submitted: "17 oct. 2024 · 08:19 CAT",
    age: "il y a 6h",
    priority: "Normal",
    school: "Institut Technique Industriel (ITIG)",
    schoolId: "EDUG-NK-GOM-0104",
    requester: "Théophile Kamanzi · Directeur",
    context: ["Ticket de support : #TCK-4821", "Instance : GOM-ITIG-01", "Dernière tentative : 245 lignes"],
    attachments: ["eleves_itig_octobre.csv", "capture-erreur-import.png"],
  },
];

const categoryStyles: Record<RequestCategory, string> = {
  "Inscriptions école": "bg-[#e6f1fc] text-[#4a86b7]",
  "Documents manquants": "bg-[#fff0db] text-[#ba7938]",
  Facturation: "bg-[#f0edff] text-[#7167bd]",
  "Support technique": "bg-[#e5f7ef] text-[#379d78]",
};

const priorityStyles: Record<Priority, string> = {
  Normal: "bg-[#eef2f5] text-[#71808d]",
  Urgent: "bg-[#fff0db] text-[#ba7938]",
  Critique: "bg-[#ffe5e5] text-[#c55d63]",
};

function CategoryIcon({ category }: { category: RequestCategory }) {
  if (category === "Inscriptions école") return <FileCheck2 size={11} />;
  if (category === "Documents manquants") return <FileText size={11} />;
  if (category === "Facturation") return <ShieldAlert size={11} />;
  return <LifeBuoy size={11} />;
}

function ProcessingDrawer({ request, onClose, onResolved }: { request: RequestItem; onClose: () => void; onResolved: (requestId: string, action: string) => void }) {
  const [notes, setNotes] = useState("");
  const [notice, setNotice] = useState("");
  const resolve = (action: string) => {
    setNotice(`${action} enregistré pour ${request.school}.`);
    onResolved(request.id, action);
  };
  return <><button className="fixed inset-0 z-40 bg-[#0f2940]/25 backdrop-blur-[1px]" onClick={onClose} aria-label="Fermer les détails" /><aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[460px] flex-col bg-white shadow-[-10px_0_30px_rgba(22,50,73,0.15)]"><div className="flex items-start justify-between border-b border-[#e8edf1] px-5 py-4"><div className="flex items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e8f1f7] text-[#4e7895]"><Inbox size={18} /></div><div><p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#8c99a4]">Traitement de la demande</p><h2 className="mt-1 max-w-[330px] text-[15px] font-extrabold leading-tight tracking-[-0.025em] text-[#1c344a]">{request.title}</h2><p className="mt-1 text-[9px] text-[#8a97a3]">{request.id}</p></div></div><button onClick={onClose} className="rounded-lg p-2 text-[#8a98a4] hover:bg-[#f3f6f8]" aria-label="Fermer"><X size={17} /></button></div><div className="flex-1 overflow-y-auto px-5 py-4">{notice && <div className="mb-3 rounded-md border border-[#cde9dc] bg-[#effaf5] px-3 py-2 text-[10px] font-semibold text-[#2b8e6b]">{notice}</div>}<div className="flex flex-wrap items-center gap-2"><span className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[9px] font-bold ${categoryStyles[request.category]}`}><CategoryIcon category={request.category} />{request.category}</span><span className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[9px] font-bold ${priorityStyles[request.priority]}`}>{request.priority === "Critique" && <AlertCircle size={10} />}{request.priority}</span><span className="text-[9px] text-[#9aa5af]">{request.age}</span></div><p className="mt-4 text-[11px] leading-relaxed text-[#5d7180]">{request.description}</p><section className="mt-5 border-t border-[#edf1f4] pt-4"><h3 className="text-[11px] font-bold text-[#324b60]">Contexte de la demande</h3><div className="mt-3 space-y-2">{request.context.map((item) => <div key={item} className="flex items-center gap-2 text-[10px] text-[#687b89]"><CheckCircle2 size={12} className="text-[#4c9b7c]" />{item}</div>)}</div></section><section className="mt-5 border-t border-[#edf1f4] pt-4"><div className="flex items-center justify-between"><h3 className="text-[11px] font-bold text-[#324b60]">Établissement concerné</h3><span className="text-[9px] text-[#84939e]">{request.schoolId}</span></div><div className="mt-3 rounded-md bg-[#f6f9fb] px-3 py-2.5"><p className="text-[10px] font-bold text-[#455d6f]">{request.school}</p><p className="mt-1 flex items-center gap-1 text-[9px] text-[#8998a2]"><UserRound size={10} /> Soumis par {request.requester}</p></div></section><section className="mt-5 border-t border-[#edf1f4] pt-4"><div className="flex items-center justify-between"><h3 className="flex items-center gap-2 text-[11px] font-bold text-[#324b60]"><Paperclip size={12} /> Documents et pièces jointes</h3><span className="text-[9px] text-[#97a3ac]">{request.attachments.length} fichier{request.attachments.length > 1 ? "s" : ""}</span></div><div className="mt-3 space-y-2">{request.attachments.map((attachment) => <div key={attachment} className="flex items-center gap-2 rounded border border-[#e8eef1] px-2.5 py-2 text-[9px] text-[#607685]"><FileText size={12} className="text-[#7c98a9]" /><span className="min-w-0 flex-1 truncate">{attachment}</span><ArrowUpRight size={11} className="text-[#91a2ad]" /></div>)}</div></section><section className="mt-5 border-t border-[#edf1f4] pt-4"><label className="text-[11px] font-bold text-[#324b60]">Notes de traitement</label><textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="mt-2 min-h-[78px] w-full resize-none rounded-md border border-[#dfe7ec] bg-[#fbfcfd] p-3 text-[10px] text-[#4c6373] outline-none placeholder:text-[#a0abb3] focus:border-[#76a8cd]" placeholder="Ajoutez une note pour garder une trace de votre décision..." /></section></div><div className="border-t border-[#edf1f4] px-5 py-4"><div className="grid grid-cols-1 gap-2 sm:grid-cols-3"><button onClick={() => resolve("Demande approuvée")} className="flex items-center justify-center gap-1 rounded-md bg-[#2e9d76] px-2 py-2 text-[9px] font-bold text-white hover:bg-[#258664]"><Check size={12} /> Approuver</button><button onClick={() => resolve("Informations demandées")} className="flex items-center justify-center gap-1 rounded-md border border-[#dfe7ec] px-2 py-2 text-[9px] font-bold text-[#5f7585] hover:bg-[#f5f8fa]"><MessageSquareText size={12} /> Demander plus</button><button onClick={() => resolve("Demande rejetée")} className="flex items-center justify-center gap-1 rounded-md border border-[#f0cdd0] px-2 py-2 text-[9px] font-bold text-[#c25e67] hover:bg-[#fff5f5]"><AlertCircle size={12} /> Rejeter</button></div></div></aside></>;
}

export default function Requests() {
  
  const [requests, setRequests] = useState(initialRequests);
  const [filter, setFilter] = useState<RequestFilter>("Toutes");
  const [search, setSearch] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
  const [resolvedIds, setResolvedIds] = useState<string[]>([]);

  const filteredRequests = useMemo(() => requests.filter((request) => {
    const matchesSearch = `${request.title} ${request.description} ${request.school} ${request.id}`.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "Toutes" || request.category === filter;
    return matchesSearch && matchesFilter && !resolvedIds.includes(request.id);
  }), [filter, requests, resolvedIds, search]);

  const handleResolved = (requestId: string, action: string) => {
    if (action !== "Informations demandées") setResolvedIds((current) => [...current, requestId]);
  };

  return (<><div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><div className="mb-2 flex items-center gap-1.5 text-[9px] text-[#81909d]"><span className="rounded bg-[#e8f1f7] px-2 py-1 font-bold uppercase tracking-[0.07em] text-[#436b85]">▦ EDUGOMA SAAS › PLATFORM CONTROL CENTER</span><span>•</span><span>File opérationnelle</span></div><h1 className="text-[23px] font-bold tracking-[-0.04em] text-[#172f45]">Demandes</h1><p className="mt-1 text-[11px] text-[#778894]">File d'attente des actions nécessitant une validation manuelle de l'équipe EduGoma</p></div><div className="flex items-center gap-2 rounded-md border border-[#e1e8ee] bg-white px-3 py-2 shadow-[0_2px_6px_rgba(33,60,84,0.025)]"><span className="h-2 w-2 rounded-full bg-[#e3a64e]" /><div><p className="text-[8px] font-semibold text-[#74818c]">File de validation</p><p className="text-[10px] font-bold text-[#355166]">{filteredRequests.length} demandes ouvertes</p></div></div></div><div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="En attente" value={String(initialRequests.length - resolvedIds.length)} icon={Inbox} accent="blue" detail={<><span>Actions à traiter</span><strong className="text-[#4a86b7]">4 nouvelles</strong></>} /><StatCard label="Urgentes" value="2" icon={AlertCircle} accent="orange" detail={<><span className="text-[#c45d66]">Plus de 48 heures</span><strong className="text-[#42586a]">Priorité équipe</strong></>} /><StatCard label="Traitées aujourd'hui" value="7" trend="+3 vs hier" icon={CheckCircle2} accent="green" detail={<><span>Décisions enregistrées</span><strong className="text-[#2e9d76]">Objectif : 10</strong></>} /><StatCard label="Temps moyen de traitement" value="36h" icon={Clock3} accent="violet" detail={<><span>Sur les 30 derniers jours</span><strong className="text-[#42586a]">-14% ce mois</strong></>} /></div><section className="rounded-md border border-[#e4eaf0] bg-white shadow-[0_2px_7px_rgba(33,60,84,0.025)]"><div className="flex flex-col gap-3 border-b border-[#edf1f4] px-4 py-3 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="text-[12px] font-bold text-[#23394e]">File de traitement</h2><p className="mt-1 text-[9px] text-[#8a97a4]">Examinez chaque demande et prenez une décision documentée</p></div><div className="relative w-full lg:w-[260px]"><Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8d9aaa]" /><input value={search} onChange={(event) => setSearch(event.target.value)} className="h-8 w-full rounded-md border border-[#e0e7ee] bg-[#f8fafc] pl-9 pr-3 text-[10px] text-[#33485c] outline-none placeholder:text-[#9aa6b4] focus:border-[#76a8cd]" placeholder="Rechercher une demande..." /></div></div><div className="flex flex-wrap items-center gap-2 border-b border-[#edf1f4] px-4 py-3"><span className="mr-1 text-[9px] font-bold uppercase tracking-[0.05em] text-[#9aa5af]">Filtrer</span>{(["Toutes", "Inscriptions école", "Documents manquants", "Facturation", "Support technique"] as RequestFilter[]).map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-full px-2.5 py-1 text-[9px] font-bold transition ${filter === item ? "bg-[#102d48] text-white" : "bg-[#f1f5f7] text-[#718392] hover:bg-[#e6eef3]"}`}>{item}</button>)}<span className="ml-auto text-[9px] text-[#94a0aa]">{filteredRequests.length} ouverte{filteredRequests.length > 1 ? "s" : ""}</span></div><div className="space-y-2.5 p-4">{filteredRequests.map((request) => <article key={request.id} className="rounded-md border border-[#e5ebef] bg-[#fcfdfe] p-3.5 transition hover:border-[#c9dae4] hover:bg-white hover:shadow-[0_3px_10px_rgba(33,60,84,0.05)]"><div className="flex flex-col gap-3 lg:flex-row lg:items-start"><div className="flex min-w-0 flex-1 gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#eef3f7] text-[#55788f]"><CategoryIcon category={request.category} /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[9px] font-bold ${categoryStyles[request.category]}`}><CategoryIcon category={request.category} />{request.category}</span><span className={`rounded px-2 py-1 text-[9px] font-bold ${priorityStyles[request.priority]}`}>{request.priority}</span><span className="text-[9px] text-[#9aa5af]">{request.id}</span></div><h3 className="mt-2 text-[11px] font-bold leading-[1.4] text-[#30495e]">{request.title}</h3><p className="mt-1 text-[9px] leading-[1.5] text-[#82919c]">{request.description}</p><div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[8px] text-[#98a4ad]"><span className="flex items-center gap-1"><Clock3 size={10} />{request.submitted}</span><span className="flex items-center gap-1"><UserRound size={10} />{request.requester}</span></div></div></div><div className="flex shrink-0 items-center gap-2 lg:pt-5"><button onClick={() => setSelectedRequest(request)} className="flex items-center justify-center gap-1.5 rounded-md bg-[#102d48] px-3 py-2 text-[9px] font-bold text-white hover:bg-[#193d5e]">Traiter <ArrowUpRight size={11} /></button><button onClick={() => setSelectedRequest(request)} className="rounded-md border border-[#dfe7ec] px-3 py-2 text-[9px] font-bold text-[#55758b] hover:bg-[#f1f6f8]">Voir détails</button></div></div></article>)}{filteredRequests.length === 0 && <div className="px-4 py-12 text-center"><Search size={18} className="mx-auto text-[#9aa8b3]" /><p className="mt-2 text-[11px] font-semibold text-[#5e7485]">Aucune demande trouvée</p><p className="mt-1 text-[9px] text-[#98a5ae]">Modifiez votre recherche ou votre filtre pour afficher des résultats.</p></div>}</div><div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#edf1f4] px-4 py-2.5 text-[9px] text-[#8d99a4]"><span>Dernière mise à jour : aujourd'hui à 09:42 CAT</span><span className="flex items-center gap-1 text-[#379d78]"><CheckCircle2 size={11} /> File synchronisée</span></div></section>{selectedRequest && <ProcessingDrawer request={selectedRequest} onClose={() => setSelectedRequest(null)} onResolved={handleResolved} />}</>);
}