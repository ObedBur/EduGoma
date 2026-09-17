"use client";

import {
  AlertCircle,
  Ban,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  CreditCard,
  FileCheck2,
  Filter,
  GraduationCap,
  LogIn,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { StatCard } from "@/components/layout/DashboardShared";

type ValidationStatus = "Validé" | "En cours de revue" | "Revue urgente" | "Info requise" | "Dépôt initial";
type SubscriptionStatus = "Essai gratuit" | "Actif" | "En retard" | "Suspendu";
type FilterStatus = "Toutes" | "Validées" | "En attente" | "Essai" | "En retard";
type School = {
  name: string; id: string; city: string; province: string;
  validation: ValidationStatus; validationTone: "green" | "blue" | "orange" | "red" | "gray";
  subscription: SubscriptionStatus; subscriptionTone: "blue" | "green" | "orange" | "red";
  subscriptionDetail: string; students: string; registered: string;
  phone: string; email: string; trial: string; documents: string[]; missing?: string;
  users: { name: string; role: string; initials: string }[];
};

const initialSchools: School[] = [
  { name: "Institut Mwangaza de Goma", id: "EDUG-NK-GOM-0589", city: "Goma", province: "Nord-Kivu", validation: "En cours de revue", validationTone: "blue", subscription: "Essai gratuit", subscriptionTone: "blue", subscriptionDetail: "Essai — 42j restants", students: "1,240", registered: "14 oct. 2024", phone: "+243 812 456 220", email: "direction@mwangaza.edugoma.cd", trial: "02 oct. 2024 → 25 nov. 2024", documents: ["Statuts de l'établissement", "Autorisation d'ouverture", "Pièce d'identité du responsable"], users: [{ name: "Aline Nshuti", role: "Directrice", initials: "AN" }, { name: "Patrick Bahati", role: "Secrétaire général", initials: "PB" }, { name: "Marc Kambale", role: "Enseignant", initials: "MK" }] },
  { name: "Collège Alfajiri", id: "EDUG-SK-BUK-0012", city: "Bukavu", province: "Sud-Kivu", validation: "Revue urgente", validationTone: "orange", subscription: "Actif", subscriptionTone: "green", subscriptionDetail: "Renouvelé le 01 oct. 2024", students: "2,860", registered: "15 oct. 2024", phone: "+243 997 224 819", email: "admin@alfajiri.edugoma.cd", trial: "Abonnement Établissement Pro", documents: ["Statuts de l'établissement", "Autorisation d'ouverture", "Pièce d'identité du responsable"], users: [{ name: "Jean-Pierre Mulamba", role: "Directeur", initials: "JM" }, { name: "Grâce Furaha", role: "Secrétaire", initials: "GF" }, { name: "David Lwakatare", role: "Enseignant", initials: "DL" }] },
  { name: "Lycée Amanzi EDUG", id: "EDUG-NK-GOM-0095", city: "Goma (Centre)", province: "Nord-Kivu", validation: "Info requise", validationTone: "red", subscription: "En retard", subscriptionTone: "orange", subscriptionDetail: "Échéance dépassée de 12 jours", students: "3,420", registered: "16 oct. 2024", phone: "+243 811 903 442", email: "contact@amanzi.edugoma.cd", trial: "Plan Établissement Pro · 2024–2025", documents: ["Statuts de l'établissement", "Pièce d'identité du responsable"], missing: "Agrément provincial de fonctionnement", users: [{ name: "Espérance Bisimwa", role: "Proviseure", initials: "EB" }, { name: "Chantal Munganga", role: "Secrétaire", initials: "CM" }, { name: "Moïse Kitoko", role: "Enseignant", initials: "MK" }] },
  { name: "Institut Technique Industriel (ITIG)", id: "EDUG-NK-GOM-0104", city: "Goma (Karisimbi)", province: "Nord-Kivu", validation: "Dépôt initial", validationTone: "gray", subscription: "Essai gratuit", subscriptionTone: "blue", subscriptionDetail: "Essai — 28j restants", students: "980", registered: "17 oct. 2024", phone: "+243 810 118 635", email: "direction@itig.edugoma.cd", trial: "17 oct. 2024 → 14 nov. 2024", documents: ["Statuts de l'établissement", "Autorisation d'ouverture", "Pièce d'identité du responsable"], users: [{ name: "Théophile Kamanzi", role: "Directeur", initials: "TK" }, { name: "Ruth Bahati", role: "Secrétaire", initials: "RB" }, { name: "Alain Kisekedi", role: "Enseignant", initials: "AK" }] },
];

const validationStyles: Record<School["validationTone"], string> = { green: "bg-[#e5f7ef] text-[#379d78]", blue: "bg-[#e6f1fc] text-[#4a86b7]", orange: "bg-[#fff0db] text-[#ba7938]", red: "bg-[#ffe5e5] text-[#c55d63]", gray: "bg-[#eef2f5] text-[#71808d]" };
const subscriptionStyles: Record<School["subscriptionTone"], string> = { blue: "bg-[#e6f1fc] text-[#4a86b7]", green: "bg-[#e5f7ef] text-[#379d78]", orange: "bg-[#fff0db] text-[#ba7938]", red: "bg-[#ffe5e5] text-[#c55d63]" };

function Badge({ children, tone, icon }: { children: React.ReactNode; tone: string; icon?: React.ReactNode }) {
  return <span className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[9px] font-bold ${tone}`}>{icon}{children}</span>;
}
function ValidationBadge({ school }: { school: School }) {
  const icon = school.validationTone === "red" ? <AlertCircle size={10} /> : school.validationTone === "green" ? <Check size={10} /> : undefined;
  return <Badge tone={validationStyles[school.validationTone]} icon={icon}>{school.validation}</Badge>;
}
function SubscriptionBadge({ school }: { school: School }) {
  const icon = school.subscription === "En retard" || school.subscription === "Suspendu" ? <AlertCircle size={10} /> : school.subscription === "Actif" ? <Check size={10} /> : undefined;
  return <Badge tone={subscriptionStyles[school.subscriptionTone]} icon={icon}>{school.subscription === "Essai gratuit" ? school.subscriptionDetail : school.subscription}</Badge>;
}

function DetailDrawer({ school, onClose, onPaid, onSuspend }: { school: School; onClose: () => void; onPaid: () => void; onSuspend: () => void }) {
  const [notice, setNotice] = useState("");
  return (
    <>
      <button className="fixed inset-0 z-40 bg-[#0f2940]/25 backdrop-blur-[1px]" onClick={onClose} aria-label="Fermer les détails" />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[440px] flex-col bg-white shadow-[-10px_0_30px_rgba(22,50,73,0.15)]">
        <div className="flex items-start justify-between border-b border-[#e8edf1] px-5 py-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e8f1f7] text-[#4e7895]"><Building2 size={18} /></div>
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#8c99a4]">Fiche établissement</p>
              <h2 className="mt-1 truncate text-[16px] font-extrabold tracking-[-0.03em] text-[#1c344a]">{school.name}</h2>
              <p className="mt-1 text-[9px] text-[#8a97a3]">{school.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-[#8a98a4] hover:bg-[#f3f6f8]" aria-label="Fermer"><X size={17} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {notice && <div className="mb-3 rounded-md border border-[#cde9dc] bg-[#effaf5] px-3 py-2 text-[10px] font-semibold text-[#2b8e6b]">{notice}</div>}
          <section className="border-b border-[#edf1f4] pb-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.07em] text-[#9aa5af]">Ville / Province</p>
                <p className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-[#42596b]"><MapPin size={11} className="text-[#7895a7]" />{school.city}, {school.province}</p>
              </div>
              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.07em] text-[#9aa5af]">Date d'inscription</p>
                <p className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-[#42596b]"><CalendarDays size={11} className="text-[#7895a7]" />{school.registered}</p>
              </div>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <a href={`tel:${school.phone}`} className="flex items-center gap-2 text-[10px] text-[#55758c] hover:text-[#204e70]"><Phone size={11} />{school.phone}</a>
              <a href={`mailto:${school.email}`} className="flex min-w-0 items-center gap-2 truncate text-[10px] text-[#55758c] hover:text-[#204e70]"><Mail size={11} />{school.email}</a>
            </div>
          </section>
          <section className="border-b border-[#edf1f4] py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold text-[#324b60]">Validation du dossier</h3>
              <ValidationBadge school={school} />
            </div>
            <div className="mt-3 space-y-2">
              {school.documents.map((doc) => (
                <div key={doc} className="flex items-center gap-2 text-[10px] text-[#687b89]">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#e5f7ef] text-[#379d78]"><Check size={10} /></span>{doc}
                </div>
              ))}
              {school.missing && (
                <div className="flex items-center gap-2 text-[10px] font-semibold text-[#c15e66]">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#ffe5e5]"><AlertCircle size={10} /></span>{school.missing}
                </div>
              )}
            </div>
          </section>
          <section className="border-b border-[#edf1f4] py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold text-[#324b60]">Abonnement</h3>
              <SubscriptionBadge school={school} />
            </div>
            <div className="mt-3 rounded-md bg-[#f6f9fb] px-3 py-2.5">
              <p className="text-[9px] text-[#7f8d98]">Plan et échéance</p>
              <p className="mt-1 text-[10px] font-semibold text-[#42596b]">{school.trial}</p>
              <p className="mt-1 text-[9px] text-[#9aa5ae]">Élèves inscrits : <strong className="text-[#557080]">{school.students}</strong></p>
            </div>
            <button onClick={() => { onPaid(); setNotice("Le paiement de ce mois a été enregistré."); }} className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-[#d6e5e1] bg-[#f4fbf8] py-2 text-[10px] font-bold text-[#378a6d] hover:bg-[#e8f7f1]">
              <CircleDollarSign size={13} /> Marquer comme payé ce mois
            </button>
          </section>
          <section className="py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold text-[#324b60]">Utilisateurs actifs</h3>
              <span className="rounded-full bg-[#eef3f7] px-2 py-1 text-[8px] font-bold text-[#698092]">{school.users.length} comptes</span>
            </div>
            <div className="mt-3 space-y-2">
              {school.users.map((user) => (
                <div key={user.name} className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e5eef3] text-[9px] font-bold text-[#4a6e84]">{user.initials}</div>
                  <div className="flex-1"><p className="text-[10px] font-semibold text-[#4c6273]">{user.name}</p><p className="text-[9px] text-[#929da7]">{user.role}</p></div>
                  <UserRound size={12} className="text-[#9ba8b2]" />
                </div>
              ))}
            </div>
          </section>
          <button onClick={() => setNotice("Session de support prête à être ouverte dans un nouvel espace sécurisé.")} className="flex w-full items-center justify-center gap-2 rounded-md bg-[#102d48] py-2.5 text-[10px] font-bold text-white hover:bg-[#193d5e]">
            <LogIn size={13} /> Se connecter en tant que cette école
          </button>
        </div>
        <div className="border-t border-[#edf1f4] px-5 py-4">
          <button onClick={() => { onSuspend(); setNotice("L'école a été suspendue. Les accès sont maintenant bloqués."); }} className="flex w-full items-center justify-center gap-2 rounded-md border border-[#f0cdd0] py-2 text-[10px] font-bold text-[#c25e67] hover:bg-[#fff5f5]">
            <Ban size={13} /> Suspendre l'école
          </button>
        </div>
      </aside>
    </>
  );
}

export default function SchoolsPage() {
  const [search, setSearch] = useState("");
  const [province, setProvince] = useState("Toutes les provinces");
  const [status, setStatus] = useState<FilterStatus>("Toutes");
  const [schools, setSchools] = useState(initialSchools);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedSchool = schools.find((s) => s.id === selectedId);

  const filteredSchools = useMemo(() => schools.filter((school) => {
    const matchesSearch = `${school.name} ${school.id} ${school.city} ${school.province}`.toLowerCase().includes(search.toLowerCase());
    const matchesProvince = province === "Toutes les provinces" || school.province === province;
    const matchesStatus = status === "Toutes" || (status === "Validées" && school.validation === "Validé") || (status === "En attente" && ["En cours de revue", "Revue urgente", "Info requise", "Dépôt initial"].includes(school.validation)) || (status === "Essai" && school.subscription === "Essai gratuit") || (status === "En retard" && school.subscription === "En retard");
    return matchesSearch && matchesProvince && matchesStatus;
  }), [province, schools, search, status]);

  const updateSubscription = (id: string, subscription: SubscriptionStatus, subscriptionTone: School["subscriptionTone"], subscriptionDetail: string) =>
    setSchools((current) => current.map((s) => s.id === id ? { ...s, subscription, subscriptionTone, subscriptionDetail } : s));

  return (
    <>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-[9px] text-[#81909d]">
            <span className="rounded bg-[#e8f1f7] px-2 py-1 font-bold uppercase tracking-[0.07em] text-[#436b85]">▦ EDUGOMA SAAS › PLATFORM CONTROL CENTER</span>
            <span>•</span><span>Établissements</span>
          </div>
          <h1 className="text-[23px] font-bold tracking-[-0.04em] text-[#172f45]">Écoles</h1>
          <p className="mt-1 text-[11px] text-[#778894]">Gestion des établissements partenaires sur la plateforme EduGoma</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative flex h-8 items-center">
            <Filter size={12} className="pointer-events-none absolute left-2.5 text-[#718696]" />
            <select value={province} onChange={(e) => setProvince(e.target.value)} className="h-8 appearance-none rounded-md border border-[#dce5eb] bg-white pl-8 pr-8 text-[10px] font-semibold text-[#536b7d] outline-none focus:border-[#76a8cd]">
              <option>Toutes les provinces</option><option>Nord-Kivu</option><option>Sud-Kivu</option>
            </select>
            <ChevronDown size={12} className="pointer-events-none absolute right-2.5 text-[#8293a0]" />
          </label>
          <button className="flex h-8 items-center gap-1.5 rounded-md bg-[#102d48] px-3 text-[10px] font-bold text-white shadow-sm hover:bg-[#193d5e]">
            <Plus size={13} /> Inscrire une école
          </button>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Écoles actives" value="184" trend="+12 ce mois" icon={Building2} detail={<><span>6 provinces couvertes</span><strong className="text-[#2e9d76]">96% d'activité</strong></>} />
        <StatCard label="En attente de validation" value="4" icon={FileCheck2} accent="orange" detail={<><span className="text-[#c67b44]">2 urgents signalés</span><strong className="text-[#42586a]">36h délai moyen</strong></>} />
        <StatCard label="Essai gratuit en cours" value="12" icon={CalendarDays} accent="blue" detail={<><span>Conversion ce mois</span><strong className="text-[#42586a]">75% prévu</strong></>} />
        <StatCard label="Abonnement en retard" value="2" icon={AlertCircle} accent="orange" detail={<><span className="text-[#c45d66]">Action requise</span><strong className="text-[#42586a]">0,9% du parc</strong></>} />
      </div>

      <section className="rounded-md border border-[#e4eaf0] bg-white shadow-[0_2px_7px_rgba(33,60,84,0.025)]">
        <div className="flex flex-col gap-3 border-b border-[#edf1f4] px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-[12px] font-bold text-[#23394e]">Parc des établissements</h2>
            <p className="mt-1 text-[9px] text-[#8a97a4]">Suivi de la validation, des abonnements et des effectifs par école</p>
          </div>
          <div className="relative w-full lg:w-[260px]">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8d9aaa]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 w-full rounded-md border border-[#e0e7ee] bg-[#f8fafc] pl-9 pr-3 text-[10px] text-[#33485c] outline-none placeholder:text-[#9aa6b4] focus:border-[#76a8cd]" placeholder="Rechercher une école..." />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-b border-[#edf1f4] px-4 py-3">
          <span className="mr-1 text-[9px] font-bold uppercase tracking-[0.05em] text-[#9aa5af]">Filtrer</span>
          {(["Toutes", "Validées", "En attente", "Essai", "En retard"] as FilterStatus[]).map((f) => (
            <button key={f} onClick={() => setStatus(f)} className={`rounded-full px-2.5 py-1 text-[9px] font-bold transition ${status === f ? "bg-[#102d48] text-white" : "bg-[#f1f5f7] text-[#718392] hover:bg-[#e6eef3]"}`}>{f}</button>
          ))}
          <span className="ml-auto text-[9px] text-[#94a0aa]">{filteredSchools.length} établissement{filteredSchools.length > 1 ? "s" : ""}</span>
        </div>
        <div className="overflow-x-auto overscroll-x-contain scrollbar-thin">
          {/* Indicateur de scroll horizontal sur mobile */}
          <p className="block md:hidden text-[9px] text-[#9aa5b1] text-center py-1.5 border-b border-[#edf1f4]">
            ← Faites défiler pour voir tout le tableau →
          </p>
          <table className="w-full min-w-[780px] border-collapse text-left">
            <thead>
              <tr className="bg-[#f8fafc] text-[8px] font-bold uppercase tracking-[0.06em] text-[#83909c]">
                <th className="px-4 py-2.5">École & ID</th><th className="px-3 py-2.5">Ville / Zone</th><th className="px-3 py-2.5">Statut de validation</th><th className="px-3 py-2.5">Statut d'abonnement</th><th className="px-3 py-2.5">Élèves inscrits</th><th className="px-3 py-2.5">Date d'inscription</th><th className="px-3 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchools.map((school) => (
                <tr key={school.id} className="border-t border-[#edf1f4] align-middle hover:bg-[#fbfdff]">
                  <td className="px-4 py-3"><p className="max-w-[185px] text-[10px] font-bold leading-[1.35] text-[#344a5f]">{school.name}</p><p className="mt-1 text-[8px] font-medium text-[#9aa5b0]">{school.id}</p></td>
                  <td className="px-3 py-3"><p className="text-[9px] font-semibold text-[#607483]">{school.city}</p><p className="mt-0.5 text-[8px] text-[#97a2ab]">{school.province}</p></td>
                  <td className="px-3 py-3"><ValidationBadge school={school} /></td>
                  <td className="px-3 py-3"><SubscriptionBadge school={school} /></td>
                  <td className="px-3 py-3"><span className="flex items-center gap-1 text-[10px] font-bold text-[#516879]"><GraduationCap size={12} className="text-[#7892a3]" />{school.students}</span></td>
                  <td className="px-3 py-3 text-[9px] text-[#71818e]">{school.registered}</td>
                  <td className="px-3 py-3 text-right"><button onClick={() => setSelectedId(school.id)} className="rounded px-2 py-1.5 text-[9px] font-bold text-[#4f7c9a] hover:bg-[#eaf2f7]">Voir détails</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredSchools.length === 0 && (
            <div className="px-4 py-12 text-center">
              <Search size={18} className="mx-auto text-[#9aa8b3]" />
              <p className="mt-2 text-[11px] font-semibold text-[#5e7485]">Aucune école trouvée</p>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#edf1f4] px-4 py-2.5 text-[9px] text-[#8d99a4]">
          <span>Dernière synchronisation : aujourd'hui à 09:42 CAT</span>
          <span className="flex items-center gap-1 text-[#379d78]"><CheckCircle2 size={11} /> Données à jour</span>
        </div>
      </section>

      {selectedSchool && (
        <DetailDrawer
          school={selectedSchool}
          onClose={() => setSelectedId(null)}
          onPaid={() => updateSubscription(selectedSchool.id, "Actif", "green", "Paiement enregistré ce mois")}
          onSuspend={() => updateSubscription(selectedSchool.id, "Suspendu", "red", "Accès suspendus")}
        />
      )}
    </>
  );
}
