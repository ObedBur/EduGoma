"use client";

import {
  AlertCircle,
  Ban,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock,
  FileCheck2,
  Loader2,
  LogIn,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { StatCard } from "@/components/layout/DashboardShared";
import { SchoolRegistrationModal } from "@/components/schools/SchoolRegistrationModal";
import { PostValidationModal } from "@/components/schools/PostValidationModal";
import { triggerConfetti } from "@/lib/confetti";
import {
  tenantsApi,
  type SchoolStats,
  type TenantListCounts,
  type TenantSummary,
} from "@/lib/api";
import {
  ListTable,
  toListParams,
  useListQuery,
  type ListFilterDef,
} from "@/components/ui/list-table";

type ValidationStatus = "Validé" | "En attente de validation" | "Info requise";
type SubscriptionStatus = "Essai gratuit" | "Actif" | "En retard" | "Suspendu";
type School = {
  name: string; id: string; city: string; province: string;
  validation: ValidationStatus; validationTone: "green" | "blue" | "orange" | "red" | "gray";
  subscription: SubscriptionStatus; subscriptionTone: "blue" | "green" | "orange" | "red" | "violet";
  subscriptionDetail: string; registered: string;
  students: string;
  phone: string; email: string; trial: string; paidAt: string | null; documents: string[]; missing?: string;
  users: { name: string; role: string; initials: string }[];
};

const EMPTY_COUNTS: TenantListCounts = {
  all: 0,
  active: 0,
  pending: 0,
  suspended: 0,
  trial: 0,
  overdue: 0,
};

const LIST_FILTERS: ListFilterDef[] = [
  {
    key: "status",
    label: "Validation",
    options: [
      { value: "all", label: "Toutes" },
      { value: "active", label: "Validées" },
      { value: "pending", label: "En attente de validation" },
      { value: "suspended", label: "Suspendues" },
    ],
  },
  {
    key: "subscription",
    label: "Abonnement",
    options: [
      { value: "all", label: "Tous" },
      { value: "trial", label: "Essai" },
      { value: "active", label: "Actif" },
      { value: "overdue", label: "En retard" },
      { value: "suspended", label: "Suspendu" },
    ],
  },
  {
    key: "commune",
    label: "Commune",
    options: [
      { value: "all", label: "Toutes" },
      { value: "Goma", label: "Goma" },
      { value: "Karisimbi", label: "Karisimbi" },
      { value: "Mugunga", label: "Mugunga" },
      { value: "Nyiragongo", label: "Nyiragongo" },
    ],
  },
  {
    key: "type",
    label: "Type",
    options: [
      { value: "all", label: "Tous" },
      { value: "conventionned", label: "Conventionné" },
      { value: "private", label: "Privé" },
      { value: "public", label: "Public" },
      { value: "community", label: "Communautaire" },
    ],
  },
];

function daysSince(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const ms = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(ms)) return null;
  return ms / (24 * 60 * 60 * 1000);
}

function shortId(id: string): string {
  return id.length <= 12 ? id : `${id.slice(0, 8)}…${id.slice(-4)}`;
}

function mapTenantToSchool(t: TenantSummary): School {
  const status = t.status === "active" ? "Validé" : t.status === "pending" ? "En attente de validation" : "Info requise";
  const tone: School["validationTone"] = status === "Validé" ? "green" : status === "En attente de validation" ? "blue" : "red";

  const paidDays = daysSince(t.subscriptionPaidAt);
  let subscription: SubscriptionStatus;
  if (t.status === "suspended") {
    subscription = "Suspendu";
  } else if (t.subscriptionStatus === "overdue") {
    subscription = "En retard";
  } else if (t.subscriptionStatus === "active" && paidDays !== null && paidDays <= 30) {
    subscription = "Actif";
  } else if (t.subscriptionStatus === "active" && paidDays !== null && paidDays > 30) {
    subscription = "En retard";
  } else if (t.status === "active" && paidDays !== null && paidDays <= 30) {
    subscription = "Actif";
  } else if (t.status === "active" && paidDays !== null && paidDays > 30) {
    subscription = "En retard";
  } else {
    subscription = "Essai gratuit";
  }

  const subTone: School["subscriptionTone"] =
    subscription === "Actif" ? "green"
    : subscription === "Suspendu" ? "red"
    : subscription === "En retard" ? "orange"
    : "violet";

  const paidAt = t.subscriptionPaidAt
    ? new Date(t.subscriptionPaidAt).toLocaleDateString("fr-FR")
    : null;

  return {
    name: t.name,
    id: t.id,
    city: t.commune || "Goma",
    province: "Nord-Kivu",
    validation: status,
    validationTone: tone,
    subscription,
    subscriptionTone: subTone,
    subscriptionDetail:
      subscription === "Actif"
        ? paidAt
          ? `Payé le ${paidAt}`
          : "Actif"
        : subscription === "Suspendu"
          ? "Accès suspendus"
          : subscription === "En retard"
            ? paidAt
              ? `Dernier paiement : ${paidAt}`
              : "Aucun paiement ce mois"
            : "Essai en cours",
    registered: new Date(t.createdAt).toLocaleDateString("fr-FR"),
    phone: t.phone,
    email: t.email || "—",
    trial:
      subscription === "Actif"
        ? "Plan mensuel"
        : subscription === "En retard"
          ? "Plan en retard"
          : subscription === "Suspendu"
            ? "Plan suspendu"
            : "Essai gratuit 30 jours",
    paidAt,
    students: t._count?.users ? String(t._count.users) : "—",
    documents: [],
    users: [],
  };
}

const validationStyles: Record<School["validationTone"], string> = { green: "bg-[#e5f7ef] text-[#379d78]", blue: "bg-[#e6f1fc] text-[#4a86b7]", orange: "bg-[#fff0db] text-[#ba7938]", red: "bg-[#ffe5e5] text-[#c55d63]", gray: "bg-[#eef2f5] text-[#71808d]" };
const subscriptionStyles: Record<School["subscriptionTone"], string> = { blue: "bg-[#e6f1fc] text-[#4a86b7]", green: "bg-[#e5f7ef] text-[#379d78]", orange: "bg-[#fff0db] text-[#ba7938]", red: "bg-[#ffe5e5] text-[#c55d63]", violet: "bg-[#efeafb] text-[#7a5cc0]" };

function Badge({ children, tone, icon }: { children: React.ReactNode; tone: string; icon?: React.ReactNode }) {
  return <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded px-2 py-1 text-[9px] font-bold ${tone}`}>{icon}{children}</span>;
}
function ValidationBadge({ school }: { school: School }) {
  const icon = school.validationTone === "red" ? <AlertCircle size={10} /> : school.validationTone === "green" ? <Check size={10} /> : undefined;
  return <Badge tone={validationStyles[school.validationTone]} icon={icon}>{school.validation}</Badge>;
}
function SubscriptionBadge({ school }: { school: School }) {
  const icon = school.subscription === "En retard" || school.subscription === "Suspendu" ? <AlertCircle size={10} /> : school.subscription === "Actif" ? <Check size={10} /> : school.subscription === "Essai gratuit" ? <Clock size={10} /> : undefined;
  return <Badge tone={subscriptionStyles[school.subscriptionTone]} icon={icon}>{school.subscription === "Essai gratuit" ? school.subscriptionDetail : school.subscription}</Badge>;
}

function DetailDrawer({
  school,
  onClose,
  onPaid,
  onSuspend,
  onReactivate,
  onValidate,
  isValidating,
  onImpersonate,
  impersonating,
}: {
  school: School;
  onClose: () => void;
  onPaid: () => void;
  onSuspend: () => void;
  onReactivate: () => void;
  onValidate?: () => void;
  isValidating?: boolean;
  onImpersonate?: () => Promise<void> | void;
  impersonating?: boolean;
}) {
  const [notice, setNotice] = useState("");
  const [drawerUsers, setDrawerUsers] = useState<School["users"] | null>(null);
  const [usersLoading, setUsersLoading] = useState(false);
  const [stats, setStats] = useState<SchoolStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setDrawerUsers(null);
    setUsersLoading(true);
    setStats(null);
    setStatsLoading(true);
    (async () => {
      try {
        const [list, schoolStats] = await Promise.all([
          tenantsApi.getUsers(school.id),
          tenantsApi.getStats(school.id),
        ]);
        if (cancelled) return;
        setStats(schoolStats);
        setDrawerUsers(
          list.map((u) => {
            const name = [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email || u.phone || "Utilisateur";
            const initials = name
              .split(/\s+/)
              .filter(Boolean)
              .slice(0, 2)
              .map((p) => p[0]?.toUpperCase() ?? "")
              .join("");
            const role = u.userRoles[0]?.role?.name || (u.isActive ? "Membre" : "Inactif");
            return { name, role, initials: initials || "?" };
          })
        );
      } catch {
        if (!cancelled) {
          setDrawerUsers([]);
          setStats(null);
        }
      } finally {
        if (!cancelled) {
          setUsersLoading(false);
          setStatsLoading(false);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [school.id]);

  const users = drawerUsers ?? school.users;
  const documents = stats?.documents.provided ?? [];
  const missingDocs = stats?.documents.missing ?? [];
  const studentsLabel = stats
    ? stats.students !== null
      ? String(stats.students)
      : `${stats.users} comptes · élèves à venir`
    : "—";
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
              <p className="mt-1 text-[9px] font-medium text-[#64788a]" title={school.id}>{shortId(school.id)}</p>
            </div>
          </div>
          <button onClick={onClose} className="cursor-pointer rounded-lg p-2 text-[#8a98a4] hover:bg-[#f3f6f8]" aria-label="Fermer"><X size={17} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {notice && <div className="mb-3 rounded-md border border-[#cde9dc] bg-[#effaf5] px-3 py-2 text-[10px] font-semibold text-[#2b8e6b]">{notice}</div>}
          <section className="border-b border-[#edf1f4] pb-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.07em] text-[#9aa5af]">Commune</p>
                <p className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-[#42596b]"><MapPin size={11} className="text-[#7895a7]" />{school.city || "Goma"}</p>
              </div>
              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.07em] text-[#9aa5af]">Date d'inscription</p>
                <p className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-[#42596b]"><CalendarDays size={11} className="text-[#7895a7]" />{school.registered || "—"}</p>
              </div>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <a href={`tel:${school.phone}`} className="flex items-center gap-2 text-[10px] text-[#55758c] hover:text-[#204e70]"><Phone size={11} />{school.phone || "—"}</a>
              <a href={`mailto:${school.email}`} className="flex min-w-0 items-center gap-2 truncate text-[10px] text-[#55758c] hover:text-[#204e70]"><Mail size={11} />{school.email || "—"}</a>
            </div>
          </section>
          <section className="border-b border-[#edf1f4] py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold text-[#324b60]">Validation du dossier</h3>
              <ValidationBadge school={school} />
            </div>
            <div className="mt-3 space-y-2">
              {statsLoading && (
                <p className="text-[10px] text-[#8a97a4]">Chargement des documents…</p>
              )}
              {!statsLoading && documents.length === 0 && missingDocs.length === 0 && (
                <p className="text-[10px] text-[#8a97a4]">Aucun document enregistré.</p>
              )}
              {documents.map((doc) => (
                <div key={doc} className="flex items-center gap-2 text-[10px] text-[#687b89]">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#e5f7ef] text-[#379d78]"><Check size={10} /></span>{doc}
                </div>
              ))}
              {missingDocs.map((doc) => (
                <div key={doc} className="flex items-center gap-2 text-[10px] font-semibold text-[#c15e66]">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#ffe5e5]"><AlertCircle size={10} /></span>{doc}
                </div>
              ))}
              {stats?.note && (
                <p className="mt-2 rounded bg-[#f6f9fb] px-2 py-1.5 text-[9px] text-[#7f8d98]">{stats.note}</p>
              )}
            </div>

            {/* Bouton de validation rapide si pas encore validé (#47, #50, #45, #46) */}
            {school.validation !== "Validé" && onValidate && (
              <button
                onClick={onValidate}
                disabled={isValidating}
                className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#2ba075] py-2.5 text-[11px] font-bold text-white shadow-sm hover:bg-[#238561] active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
              >
                {isValidating ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Validation en cours...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={14} />
                    <span>Valider cet établissement</span>
                  </>
                )}
              </button>
            )}
          </section>
          <section className="border-b border-[#edf1f4] py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold text-[#324b60]">Abonnement</h3>
              <SubscriptionBadge school={school} />
            </div>
            <div className="mt-3 rounded-md bg-[#f6f9fb] px-3 py-2.5">
              <p className="text-[9px] text-[#7f8d98]">Plan</p>
              <p className="mt-1 text-[10px] font-semibold text-[#42596b]">{school.trial}</p>
              <p className="mt-1 text-[9px] text-[#9aa5ae]">
                Dernier paiement :{" "}
                <strong className="text-[#557080]">{school.paidAt || "—"}</strong>
              </p>
              <p className="mt-1.5 text-[9px] text-[#9aa5ae]">
                Effectif : <strong className="text-[#557080]">{studentsLabel}</strong>
              </p>
            </div>
            <button onClick={() => { onPaid(); setNotice("Paiement enregistré."); }} className="cursor-pointer mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-[#d6e5e1] bg-[#f4fbf8] py-2 text-[10px] font-bold text-[#378a6d] hover:bg-[#e8f7f1]">
              <CircleDollarSign size={13} /> Marquer payé
            </button>
          </section>
          <section className="py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold text-[#324b60]">Utilisateurs actifs</h3>
              <span className="rounded-full bg-[#eef3f7] px-2 py-1 text-[8px] font-bold text-[#698092]">
                {usersLoading ? "…" : users.length || "0"} comptes
              </span>
            </div>
            <div className="mt-3 space-y-2">
              {usersLoading && (
                <p className="text-[10px] text-[#8a97a4]">Chargement des comptes…</p>
              )}
              {!usersLoading && users.length === 0 && (
                <p className="text-[10px] text-[#8a97a4]">Aucun compte utilisateur pour cette école.</p>
              )}
              {!usersLoading && users.map((user) => (
                <div key={`${user.name}-${user.initials}`} className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e5eef3] text-[9px] font-bold text-[#4a6e84]">{user.initials}</div>
                  <div className="flex-1"><p className="text-[10px] font-semibold text-[#4c6273]">{user.name}</p><p className="text-[9px] text-[#929da7]">{user.role}</p></div>
                  <UserRound size={12} className="text-[#9ba8b2]" />
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className="border-t border-[#edf1f4] px-5 py-4 space-y-2">
          {school.validation === "Validé" && (
            <button
              onClick={() => { void onImpersonate?.(); }}
              disabled={impersonating}
              className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-md border border-[#d0e0f0] bg-[#f4f8fc] py-2.5 text-[10px] font-bold text-[#3a6f9a] hover:bg-[#eaf2f9] disabled:opacity-60"
            >
              {impersonating ? <Loader2 size={13} className="animate-spin" /> : <LogIn size={13} />}
              Se connecter en tant que cette école
            </button>
          )}
          {school.subscription === "Suspendu" || school.validation === "Info requise" ? (
            <button
              onClick={() => {
                onReactivate();
                setNotice("L'école a été réactivée. Les accès sont de nouveau ouverts.");
              }}
              className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-md border border-[#cde9dc] bg-[#f4fbf8] py-2.5 text-[10px] font-bold text-[#378a6d] hover:bg-[#e8f7f1]"
            >
              <CheckCircle2 size={13} /> Réactiver
            </button>
          ) : (
            <button
              onClick={() => {
                onSuspend();
                setNotice("L'école a été suspendue. Les accès sont maintenant bloqués.");
              }}
              className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-md border border-[#f0cdd0] py-2.5 text-[10px] font-bold text-[#c25e67] hover:bg-[#fff5f5]"
            >
              <Ban size={13} /> Suspendre
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

export default function SchoolsPage() {
  const { query, setQuery, setSearch } = useListQuery({
    filters: { status: "all", subscription: "all", commune: "all", type: "all" },
  });
  const [schools, setSchools] = useState<School[]>([]);
  const [counts, setCounts] = useState<TenantListCounts>(EMPTY_COUNTS);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [postValidationSchool, setPostValidationSchool] = useState<School | null>(null);
  const [validatingId, setValidatingId] = useState<string | null>(null);
  const [impersonatingId, setImpersonatingId] = useState<string | null>(null);
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const queryRef = useRef(query);
  queryRef.current = query;

  const selectedSchool = schools.find((s) => s.id === selectedId) ?? null;
  const handleImpersonate = async (school: School) => {
    setImpersonatingId(school.id);
    try {
      const res = await tenantsApi.impersonate(school.id);
      // Save original admin token, switch to impersonation token
      const original = localStorage.getItem("edugoma_token");
      if (original) localStorage.setItem("edugoma_token_backup", original);
      localStorage.setItem("edugoma_token", res.accessToken);
      localStorage.setItem("edugoma_impersonating", JSON.stringify(res.tenant));
      // Reload page so auth-context picks up the new token + banner
      window.location.reload();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la connexion";
      toast.error("Impossible de se connecter à cette école", { description: errorMessage });
    } finally {
      setImpersonatingId(null);
    }
  };

  const share = (n: number) => `${counts.all ? Math.round((n / counts.all) * 100) : 0} %`;

  const loadSchools = useCallback(async (cancelled?: { value: boolean }) => {
    try {
      const data = await tenantsApi.getList(toListParams(queryRef.current));
      if (cancelled?.value) return;
      setSchools(data.items.map(mapTenantToSchool));
      setCounts(data.meta.counts);
      setTotal(data.meta.total);
    } catch {
      if (cancelled?.value) return;
      setSchools([]);
    } finally {
      if (!cancelled?.value) setLoading(false);
    }
  }, []);

  const reload = useCallback(() => {
    void loadSchools();
  }, [loadSchools]);

  // Init : paramètre d'URL ?search=
  useEffect(() => {
    if (typeof window === "undefined") return;
    const q = new URLSearchParams(window.location.search).get("search");
    if (q) setSearch(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rechargement à chaque changement de query (debounce recherche)
  useEffect(() => {
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    const cancelled = { value: false };
    const delay = query.search.trim() ? 300 : 0;
    searchDebounce.current = setTimeout(() => {
      void loadSchools(cancelled);
    }, delay);
    return () => {
      cancelled.value = true;
      if (searchDebounce.current) clearTimeout(searchDebounce.current);
    };
  }, [query, loadSchools]);

  const handleMarkPaid = async (school: School) => {
    const today = new Date().toLocaleDateString("fr-FR");
    setSchools((current) =>
      current.map((s) =>
        s.id === school.id
          ? {
              ...s,
              subscription: "Actif" as const,
              subscriptionTone: "green" as const,
              subscriptionDetail: `Payé le ${today}`,
              trial: "Plan mensuel",
              paidAt: today,
            }
          : s
      )
    );
    try {
      await tenantsApi.markSubscriptionPaid(school.id);
      toast.success("Paiement enregistré", {
        description: "Le paiement de ce mois a été enregistré.",
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de l'enregistrement";
      toast.error("Impossible d'enregistrer le paiement", { description: errorMessage });
    } finally {
      reload();
    }
  };

  const handleSuspend = async (school: School) => {
    const prevSchools = [...schools];
    setSchools((current) =>
      current.map((s) =>
        s.id === school.id
          ? {
              ...s,
              validation: "Info requise",
              validationTone: "red" as const,
              subscription: "Suspendu" as const,
              subscriptionTone: "red" as const,
              subscriptionDetail: "Accès suspendus",
            }
          : s
      )
    );
    try {
      await tenantsApi.deactivate(school.id, "Suspendu depuis le tableau de bord super admin");
      toast.success("École suspendue", {
        description: `${school.name} — les accès sont bloqués.`,
      });
    } catch (err: unknown) {
      setSchools(prevSchools);
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la suspension";
      toast.error("Impossible de suspendre l'école", { description: errorMessage });
    } finally {
      reload();
    }
  };

  const handleReactivate = async (school: School) => {
    const prevSchools = [...schools];
    setSchools((current) =>
      current.map((s) =>
        s.id === school.id
          ? {
              ...s,
              validation: "Validé",
              validationTone: "green" as const,
              subscription: "Actif" as const,
              subscriptionTone: "green" as const,
              subscriptionDetail: "Actif",
            }
          : s
      )
    );
    try {
      await tenantsApi.reactivate(school.id);
      toast.success("École réactivée", {
        description: `${school.name} — les accès sont de nouveau ouverts.`,
      });
    } catch (err: unknown) {
      setSchools(prevSchools);
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la réactivation";
      toast.error("Impossible de réactiver l'école", { description: errorMessage });
    } finally {
      reload();
    }
  };

  const handleValidateSchool = async (school: School) => {
    const prevSchools = [...schools];
    setValidatingId(school.id);

    setSchools((current) =>
      current.map((s) =>
        s.id === school.id
          ? {
              ...s,
              validation: "Validé",
              validationTone: "green",
              subscription: "Actif",
              subscriptionTone: "green",
              subscriptionDetail: "Actif",
            }
          : s
      )
    );

    triggerConfetti(2800);

    toast.success(`Établissement ${school.name} validé !`, {
      description: "Le compte est maintenant opérationnel sur EduGoma.",
      duration: 4500,
      action: {
        label: "Voir",
        onClick: () => setSelectedId(school.id),
      },
    });

    try {
      await tenantsApi.validate(school.id, { validatedBy: "Super Admin" });
      setPostValidationSchool({
        ...school,
        validation: "Validé",
        validationTone: "green",
        subscription: "Actif",
        subscriptionTone: "green",
      });
      reload();
    } catch (err: unknown) {
      setSchools(prevSchools);
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la validation";
      toast.error("Impossible de valider l'école", {
        description: errorMessage,
      });
    } finally {
      setValidatingId(null);
    }
  };

  return (
    <>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-[-0.04em] text-[#172f45]">Écoles</h1>
          <p className="mt-1 text-[12px] text-[#778894]">Gestion des écoles de Goma</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="cursor-pointer flex h-8 items-center gap-1.5 rounded-md bg-[#102d48] px-3 text-[10px] font-bold text-white shadow-sm hover:bg-[#193d5e] active:scale-[0.98] transition-all"
          >
            <Plus size={13} /> Inscrire une école
          </button>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Écoles validées" value={String(counts.active)} icon={Building2} detail={<><span>Part du parc</span><strong className="text-[#42586a]">{share(counts.active)}</strong></>} />
        <StatCard label="En attente de validation" value={String(counts.pending)} icon={FileCheck2} accent="orange" detail={<><span className="text-[#c67b44]">À traiter</span><strong className="text-[#42586a]">{share(counts.pending)}</strong></>} />
        <StatCard label="Essai gratuit en cours" value={String(counts.trial)} icon={CalendarDays} accent="blue" detail={<><span>Part du parc</span><strong className="text-[#42586a]">{share(counts.trial)}</strong></>} />
        <StatCard
          label="Abonnement en retard"
          value={String(counts.overdue)}
          icon={AlertCircle}
          accent="orange"
          detail={
            <>
              <span className="text-[#c45d66]">Action requise</span>
              <strong className="text-[#42586a]">
                Suspendues : {counts.suspended}
              </strong>
            </>
          }
        />
      </div>

      <ListTable<School>
        title="Liste des écoles"
        subtitle="Validation et abonnements — tri, filtres et pagination côté serveur"
        query={query}
        onQueryChange={setQuery}
        columns={[
          { key: "name", header: "École & ID", sortable: true, sortKey: "name" },
          { key: "city", header: "Commune", sortable: true, sortKey: "commune" },
          { key: "validation", header: "Statut de validation", sortable: true, sortKey: "status" },
          { key: "subscription", header: "Statut d'abonnement" },
          { key: "registered", header: "Date d'inscription", sortable: true, sortKey: "createdAt" },
          { key: "actions", header: "Actions", align: "right" },
        ]}
        rows={schools}
        total={total}
        loading={loading}
        searchPlaceholder="Nom, téléphone, e-mail, ID…"
        filters={LIST_FILTERS}
        keyExtractor={(row) => row.id}
        onRowClick={(row) => setSelectedId(row.id)}
        emptyState={
          <div className="px-4 py-12 text-center">
            <Search size={18} className="mx-auto text-[#9aa8b3]" />
            <p className="mt-2 text-[11px] font-semibold text-[#5e7485]">Aucune école trouvée</p>
          </div>
        }
        footerExtra={
          <span className="flex items-center gap-1 text-[#379d78]">
            <CheckCircle2 size={11} /> Synchronisé
          </span>
        }
        renderCell={(school, key) => {
          switch (key) {
            case "name":
              return (
                <>
                  <p className="max-w-[185px] text-[10px] font-bold leading-[1.35] text-[#344a5f]">{school.name}</p>
                  <p className="mt-1 text-[9px] font-medium text-[#64788a]" title={school.id}>{shortId(school.id)}</p>
                </>
              );
            case "city":
              return <p className="text-[9px] font-semibold text-[#607483]">{school.city || "Goma"}</p>;
            case "validation":
              return <ValidationBadge school={school} />;
            case "subscription":
              return <SubscriptionBadge school={school} />;
            case "registered":
              return <span className="text-[9px] text-[#71818e]">{school.registered || "—"}</span>;
            case "actions":
              return (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(school.id);
                  }}
                  className="rounded p-1.5 text-[#9fb0bd] hover:bg-[#eaf2f7] hover:text-[#4f7c9a]"
                  aria-label={`Voir les détails de ${school.name}`}
                >
                  <ChevronRight size={14} />
                </button>
              );
            default:
              return null;
          }
        }}
      />

      {selectedSchool && (
        <DetailDrawer
          school={selectedSchool}
          onClose={() => setSelectedId(null)}
          onPaid={() => handleMarkPaid(selectedSchool)}
          onSuspend={() => handleSuspend(selectedSchool)}
          onReactivate={() => handleReactivate(selectedSchool)}
          onValidate={() => handleValidateSchool(selectedSchool)}
          isValidating={validatingId === selectedSchool.id}
          onImpersonate={() => handleImpersonate(selectedSchool)}
          impersonating={impersonatingId === selectedSchool.id}
        />
      )}

      <SchoolRegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={reload}
      />

      <PostValidationModal
        isOpen={!!postValidationSchool}
        school={postValidationSchool}
        onClose={() => setPostValidationSchool(null)}
      />
    </>
  );
}
