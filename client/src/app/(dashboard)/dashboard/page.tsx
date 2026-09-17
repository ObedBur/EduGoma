"use client";

import {
  Activity,
  AlertCircle,
  ArrowDownToLine,
  ArrowUpRight,
  Bell,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Clock3,
  CreditCard,
  Download,
  FileCheck2,
  Gauge,
  GraduationCap,
  Inbox,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  ListFilter,
  Network,
  PencilLine,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
} from "lucide-react";
import { StatCard } from "@/components/layout/DashboardShared";
import type { Icon } from "@/components/layout/DashboardShared";

const schools = [
  {
    name: "Institut Mwangaza de Goma",
    id: "EDUG-NK-GOM-0589",
    location: "Goma (Sud), Nord-Kivu",
    date: "14 Oct 2024 · 09:42 CAT (il y a 17h)",
    documents: "3/3 Validé",
    status: "En cours de revue",
    tone: "blue",
  },
  {
    name: "Collège Alfajiri",
    id: "EDUG-SK-BUK-0012",
    location: "Bukavu, Sud-Kivu",
    date: "15 Oct 2024 · 14:15 CAT (il y a 2h)",
    documents: "3/3 Validé",
    status: "Revue Urgente",
    tone: "orange",
  },
  {
    name: "Lycée Amanzi EDUG",
    id: "EDUG-NK-GOM-0095",
    location: "Goma (Centre), Nord-Kivu",
    date: "16 Oct 2024 · 11:04 CAT (il y a 1h)",
    documents: "2/3 (Agrément manquant)",
    status: "Info requise",
    tone: "red",
  },
  {
    name: "Institut Technique Industriel (ITIG)",
    id: "EDUG-NK-GOM-0104",
    location: "Goma (Karisimbi), NK",
    date: "17 Oct 2024 · 08:19 CAT (Aujourd'hui)",
    documents: "3/3 Validé",
    status: "Dépôt initial",
    tone: "blue",
  },
];

const activityItems = [
  { icon: CheckCircle2, color: "text-emerald-500", title: "Accès école activé", text: "Accès activé pour l'école Complexe Scolaire La Fontaine (Kinshasa). Instance provisionnée.", time: "il y a 12m" },
  { icon: FileCheck2, color: "text-sky-500", title: "Dossier soumis", text: "Institut Technique Industriel de Goma a téléversé ses statuts et formulaire d'adhésion.", time: "il y a 1h" },
  { icon: KeyRound, color: "text-violet-500", title: "Identifiants Admin générés", text: "Accès préventifs pour CS Mwangaza. Authentification 2FA activée par défaut.", time: "il y a 3h" },
  { icon: AlertCircle, color: "text-rose-500", title: "Abonnement suspendu", text: "Compte école suspendu suite à retard d'abonnement SaaS : Réf: #SUB-2024-099.", time: "il y a 5h" },
  { icon: Download, color: "text-emerald-500", title: "Sauvegarde automatique", text: "Sauvegarde multi-tenant synchronisée avec succès vers le coffre-fort cloud EduGoma.", time: "il y a 6h" },
];

function StatusPill({ children, tone }: { children: React.ReactNode; tone: string }) {
  const styles: Record<string, string> = {
    blue: "bg-[#e6f1fc] text-[#4a86b7]",
    orange: "bg-[#fff0db] text-[#ba7938]",
    red: "bg-[#ffe5e5] text-[#c55d63]",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded px-1.5 py-1 text-[8px] font-bold ${styles[tone]}`}>
      {tone === "red" ? <AlertCircle size={9} /> : tone === "orange" ? <Clock3 size={9} /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

function SchoolsTable() {
  return (
    <section className="rounded-md border border-[#e4eaf0] bg-white shadow-[0_2px_7px_rgba(33,60,84,0.025)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf1f4] px-4 py-3">
        <div className="flex items-start gap-2">
          <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-md bg-[#eef3f7] text-[#52718a]">
            <FileCheck2 size={13} />
          </div>
          <div>
            <h2 className="text-[12px] font-bold text-[#23394e]">Écoles en attente de validation</h2>
            <p className="mt-0.5 text-[9px] text-[#8a97a4]">Dossiers d'adhésion et configuration d'instance en attente de validation par l'équipe EduGoma</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#e9f3fb] px-2 py-1 text-[9px] font-bold text-[#5687ae]">4 dossiers</span>
          <button className="flex h-7 items-center gap-1 rounded border border-[#e0e7ed] px-2 text-[9px] font-semibold text-[#627486] hover:bg-slate-50">
            <ListFilter size={11} /> Filtrer par Province
          </button>
          <button className="flex h-7 w-7 items-center justify-center rounded border border-[#e0e7ed] text-[#627486] hover:bg-slate-50" aria-label="Télécharger">
            <Download size={11} />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left">
          <thead>
            <tr className="bg-[#f8fafc] text-[8px] font-bold uppercase tracking-[0.06em] text-[#83909c]">
              <th className="px-4 py-2.5">École & ID</th>
              <th className="px-3 py-2.5">Ville / Zone</th>
              <th className="px-3 py-2.5">Date soumission</th>
              <th className="px-3 py-2.5">Documents requis</th>
              <th className="px-3 py-2.5">Statut de validation</th>
              <th className="px-3 py-2.5"> </th>
            </tr>
          </thead>
          <tbody>
            {schools.map((school) => (
              <tr key={school.id} className="border-t border-[#edf1f4] align-top hover:bg-[#fbfdff]">
                <td className="px-4 py-3">
                  <p className="max-w-[130px] text-[10px] font-bold leading-[1.35] text-[#344a5f]">{school.name}</p>
                  <p className="mt-1 text-[8px] font-medium text-[#9aa5b0]">{school.id}</p>
                </td>
                <td className="px-3 py-3 text-[9px] leading-[1.35] text-[#687887]">
                  <span className="flex max-w-[85px] gap-1"><span className="mt-0.5">⌖</span>{school.location}</span>
                </td>
                <td className="px-3 py-3 text-[9px] leading-[1.4] text-[#6c7b89]">{school.date}</td>
                <td className="px-3 py-3">
                  <span className={`inline-flex items-center gap-1 rounded px-1.5 py-1 text-[8px] font-bold ${school.tone === "red" ? "bg-[#ffe8e8] text-[#bf6067]" : "bg-[#e5f7ef] text-[#379d78]"}`}>
                    {school.tone === "red" ? <AlertCircle size={9} /> : <Check size={9} />}
                    {school.documents}
                  </span>
                </td>
                <td className="px-3 py-3"><StatusPill tone={school.tone}>{school.status}</StatusPill></td>
                <td className="px-3 py-3 text-right">
                  <button className="text-[9px] font-semibold text-[#66879e] hover:text-[#1e608b]">Aperçu</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#edf1f4] px-4 py-2.5 text-[9px] text-[#8d99a4]">
        <span>Affichage de 4 dossiers d'adhésion sur 4 en file d'attente</span>
        <button className="font-semibold text-[#4f7c9a] hover:underline">
          Consulter les archives des écoles activées <ArrowUpRight size={10} className="inline" />
        </button>
      </div>
    </section>
  );
}

function ActivityPanel() {
  return (
    <div className="space-y-4">
      <section className="rounded-md border border-[#e4eaf0] bg-white shadow-[0_2px_7px_rgba(33,60,84,0.025)]">
        <div className="flex items-center justify-between border-b border-[#edf1f4] px-4 py-3">
          <h2 className="flex items-center gap-2 text-[12px] font-bold text-[#23394e]">
            <Activity size={13} /> Journal d'activité SaaS
          </h2>
          <span className="h-1.5 w-1.5 rounded-full bg-[#2cb183]" />
        </div>
        <div className="px-4">
          {activityItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <div key={item.title} className="flex gap-2.5 border-b border-[#f0f3f5] py-3 last:border-0">
                <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f3f7f9] ${item.color}`}>
                  <IconComponent size={11} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[9px] font-bold text-[#536474]">{item.title}</p>
                    <span className="shrink-0 text-[8px] text-[#a2acb6]">{item.time}</span>
                  </div>
                  <p className="mt-1 text-[8px] leading-[1.45] text-[#87939f]">{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>
        <button className="w-full border-t border-[#edf1f4] py-3 text-center text-[9px] font-semibold text-[#557e9b] hover:bg-[#fbfdff]">
          Voir l'historique complet des événements (2.410) →
        </button>
      </section>

      <section className="rounded-md border border-[#e4eaf0] bg-white shadow-[0_2px_7px_rgba(33,60,84,0.025)]">
        <div className="flex items-center justify-between border-b border-[#edf1f4] px-4 py-3">
          <h2 className="flex items-center gap-2 text-[12px] font-bold text-[#23394e]">
            <LifeBuoy size={13} /> Support & Onboarding Écoles
          </h2>
          <span className="rounded bg-[#e3f7ef] px-1.5 py-1 text-[8px] font-bold text-[#31916f]">SLA Actif</span>
        </div>
        <div className="px-4">
          <div className="flex items-start justify-between border-b border-[#f0f3f5] py-3">
            <div>
              <p className="text-[9px] font-bold text-[#4b5e70]">Assistance intégration ERP École</p>
              <p className="mt-1 text-[8px] text-[#919da7]">Demande d'assistance import élèves pour Collège Boboto (Kinshasa).</p>
              <p className="mt-1 text-[8px] font-semibold text-[#6e8191]">Ticket #TCK-4819</p>
            </div>
            <div className="text-right">
              <span className="text-[8px] text-[#86939f]">18m</span>
              <span className="mt-1 block rounded bg-[#e7f5ef] px-1.5 py-1 text-[8px] font-bold text-[#36977a]">En traitement</span>
            </div>
          </div>
          <div className="flex items-start justify-between py-3">
            <div>
              <p className="text-[9px] font-bold text-[#4b5e70]">Paiement licence reçu</p>
              <p className="mt-1 text-[8px] text-[#919da7]">Renouvellement annuel 2024–2025 validé pour Lycée Shaumba.</p>
              <p className="mt-1 text-[8px] font-semibold text-[#6e8191]">Plan Établissement Pro</p>
            </div>
            <div className="text-right">
              <span className="text-[8px] text-[#86939f]">42m</span>
              <span className="mt-1 block rounded bg-[#e7f5ef] px-1.5 py-1 text-[8px] font-bold text-[#36977a]">Acquitté</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-[#edf1f4] px-4 py-2.5 text-[9px] text-[#778793]">
          <span><CircleHelp size={10} className="mr-1 inline" /> Voir les métriques système & serveurs →</span>
          <span className="font-medium">SaaS v2.4</span>
        </div>
      </section>
    </div>
  );
}

function GrowthChart() {
  return (
    <section className="rounded-md border border-[#e4eaf0] bg-white p-4 shadow-[0_2px_7px_rgba(33,60,84,0.025)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#8996a1]">Métriques d'adoption & réseau scolaire</p>
          <h2 className="mt-1 text-[13px] font-bold text-[#23394e]">Croissance du Parc Écoles & Élèves (Mai - Oct 2024)</h2>
        </div>
        <button className="flex items-center gap-2 rounded border border-[#dfe7ec] px-2 py-1.5 text-[9px] font-semibold text-[#5e7384] hover:bg-slate-50">
          <Download size={11} /> Exporter le rapport d'activité (PDF/CSV)
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-[8px] font-medium text-[#6e7e8c]">
        <span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#162334]" />Écoles clientes actives</span>
        <span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#315d7a]" />Élèves gérés (k)</span>
        <span>Objectif fin 2024 : 200 écoles / 130k élèves</span>
      </div>
      <div className="relative mt-3 h-[165px] w-full">
        <div className="absolute inset-0 flex flex-col justify-between text-[8px] text-[#9aa6b1]">
          <span>200</span><span>150</span><span>100</span><span>50</span><span>0</span>
        </div>
        <div className="absolute inset-y-0 left-8 right-6 flex flex-col justify-between">
          <span className="border-t border-dashed border-[#e6ebef]" />
          <span className="border-t border-dashed border-[#e6ebef]" />
          <span className="border-t border-dashed border-[#e6ebef]" />
          <span className="border-t border-dashed border-[#e6ebef]" />
          <span className="border-t border-dashed border-[#e6ebef]" />
        </div>
        <svg viewBox="0 0 600 160" preserveAspectRatio="none" className="absolute inset-y-2 left-8 right-6 h-[145px] w-[calc(100%-56px)] overflow-visible">
          <path d="M0,138 C65,122 112,113 168,99 C227,84 272,71 333,57 C399,42 454,26 512,14 C548,7 570,4 600,2 L600,160 L0,160 Z" fill="url(#area)" opacity=".26" />
          <path d="M0,138 C65,122 112,113 168,99 C227,84 272,71 333,57 C399,42 454,26 512,14 C548,7 570,4 600,2" fill="none" stroke="#142331" strokeWidth="2.3" />
          <path d="M0,151 C60,141 114,131 168,122 C229,111 275,101 333,87 C395,74 455,59 512,44 C548,35 577,29 600,22" fill="none" stroke="#315d7a" strokeWidth="2" strokeDasharray="5 4" />
          <defs>
            <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
              <stop stopColor="#b9d6e7" />
              <stop offset="1" stopColor="#eaf3f8" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute bottom-[-17px] left-8 right-5 flex justify-between text-[8px] text-[#8995a0]">
          <span>Mai 2024</span><span>Juin 2024</span><span>Juil 2024</span><span>Août 2024</span><span>Sep 2024</span>
          <span className="font-bold text-[#4b5d6d]">Oct 2024<br />(Actuel)</span>
        </div>
        <div className="absolute right-0 top-0 flex h-[145px] flex-col justify-between text-[8px] text-[#9aa6b1]">
          <span>120k</span><span>90k</span><span>60k</span><span>30k</span><span>0k</span>
        </div>
      </div>
      <div className="mt-9 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <div className="bg-[#f3f7fa] px-3 py-2">
          <p className="text-[8px] text-[#7c8d99]">Délai moyen d'onboarding</p>
          <p className="mt-1 text-[12px] font-extrabold text-[#29445b]">36h 12m</p>
          <p className="text-[8px] text-[#49a17e]">-14% vs T2 (accélération)</p>
        </div>
        <div className="bg-[#f3f7fa] px-3 py-2">
          <p className="text-[8px] text-[#7c8d99]">Taux de complétude dossiers</p>
          <p className="mt-1 text-[12px] font-extrabold text-[#29445b]">98.1%</p>
          <p className="text-[8px] text-[#7c8d99]">Validés du premier coup</p>
        </div>
        <div className="bg-[#f3f7fa] px-3 py-2">
          <p className="text-[8px] text-[#7c8d99]">Stockage Cloud Écoles</p>
          <p className="mt-1 text-[12px] font-extrabold text-[#29445b]">148.5 Go</p>
          <p className="text-[8px] text-[#7c8d99]">Archives scellées & chiffrées</p>
        </div>
      </div>
    </section>
  );
}

export default function DashboardPage() {
  return (
    <>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-[9px] text-[#81909d]">
            <span className="rounded bg-[#e8f1f7] px-2 py-1 font-bold uppercase tracking-[0.07em] text-[#436b85]">▦ EDUGOMA SAAS › PLATFORM CONTROL CENTER</span>
            <span>•</span>
            <span>Multi-Tenant Network</span>
          </div>
          <h1 className="text-[20px] font-bold leading-tight tracking-[-0.035em] text-[#172f45] sm:text-[22px]">
            Synthèse de l'activité du réseau scolaire aujourd'hui.
          </h1>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-[#e1e8ee] bg-white px-3 py-2 shadow-[0_2px_6px_rgba(33,60,84,0.025)]">
          <span className="h-2 w-2 rounded-full bg-[#2bad7d]" />
          <div>
            <p className="text-[8px] font-semibold text-[#74818c]">Infrastructure SaaS Cloud</p>
            <p className="text-[10px] font-bold text-[#355166]">Disponibilité globale : <span className="text-[#2d9d77]">99.98%</span></p>
          </div>
          <Settings size={13} className="ml-2 text-[#8794a0]" />
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-[#dfe7ed]">
        <button className="flex items-center gap-2 rounded-t-md border-b-2 border-[#14334f] bg-white px-3 py-2 text-[10px] font-bold text-[#263e54]">
          <LayoutDashboard size={12} /> Vue Métiers & Écoles <span className="rounded bg-[#eef3f7] px-1.5 py-0.5 text-[8px]">184</span>
        </button>
        <button className="flex items-center gap-2 px-3 py-2 text-[10px] font-medium text-[#788896] hover:text-[#29465d]">
          <Activity size={12} /> Santé Système & Infrastructure <span className="rounded bg-[#e5f7ef] px-1.5 py-0.5 text-[8px] font-bold text-[#369b77]">3 nodes actifs</span>
        </button>
      </div>

      <section className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md bg-[#102d48] px-4 py-3 text-white shadow-[0_3px_8px_rgba(15,44,70,0.12)]">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#214863] text-[#75d0b2]">
            <Sparkles size={14} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#a9ddcf]">Action prioritaire requise</span>
              <span className="text-[10px] text-[#c4d3de]">Dossier en attente depuis 3 jours</span>
            </div>
            <p className="mt-0.5 text-[11px] font-bold text-white">4 écoles partenaires ont soumis leur dossier d'inscription finalisé en attente de validation.</p>
            <p className="mt-0.5 text-[9px] text-[#b7c9d6]">Validation requise sous 48h pour activation des accès école et provisionnement du portail.</p>
          </div>
        </div>
        <button className="ml-10 flex shrink-0 items-center gap-2 rounded bg-white px-3 py-2 text-[9px] font-bold text-[#29465d] hover:bg-[#eaf2f7]">
          <FileCheck2 size={11} /> Examiner les dossiers (4)
        </button>
      </section>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Écoles actives" value="184" trend="+12 ce mois" icon={Building2} detail={<><span>Réparties sur 6 provinces</span><strong className="text-[#42586a]">Taux d'activité <b className="text-[#2e9d76]">96%</b></strong></>} />
        <StatCard label="Dossiers en attente" value="4" icon={Clock3} accent="orange" detail={<><span className="rounded bg-[#ffebdf] px-1 text-[#c67b44]">2 urgents signalés</span><strong className="text-[#42586a]">Temps moyen de validation : 36h</strong></>} />
        <StatCard label="Utilisateurs plateforme" value="42,850" trend="+8.4%" icon={Users} accent="violet" detail={<><span>Staff, préfets & enseignants</span><strong className="text-[#42586a]">3,120 actifs aujourd'hui</strong></>} />
        <StatCard label="Élèves couverts" value="118,400" trend="+14.2% trim." icon={GraduationCap} accent="green" detail={<><span>Licences SaaS actives</span><strong className="text-[#42586a]">98.4% renouvellement</strong></>} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-4">
          <SchoolsTable />
          <GrowthChart />
        </div>
        <ActivityPanel />
      </div>
    </>
  );
}
