"use client";

import {
  Bell,
  BookOpen,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  Database,
  Download,
  FileText,
  Globe2,
  History,
  KeyRound,
  Languages,
  Layers,
  Lock,
  Mail,
  MapPin,
  Palette,
  Plus,
  RefreshCw,
  Save,
  Settings as SettingsIcon,
  ShieldCheck,
  Smartphone,
  ToggleLeft,
  ToggleRight,
  Upload,
  UserRound,
  Users,
  Webhook,
  Wifi,
  Wrench,
  X,
  ZapIcon,
} from "lucide-react";
import { useState } from "react";

// ─── Shared micro-components ────────────────────────────────────────────────

function SettingCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-md border border-[#e4eaf0] bg-white shadow-[0_2px_7px_rgba(33,60,84,0.025)]">
      <div className="border-b border-[#edf1f4] px-4 py-3">
        <h2 className="text-[12px] font-bold text-[#23394e]">{title}</h2>
        {description && (
          <p className="mt-1 text-[9px] text-[#8a97a4]">{description}</p>
        )}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  readOnly,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  readOnly?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#8997a2]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`mt-1.5 h-9 w-full rounded-md border border-[#dfe7ec] px-3 text-[10px] text-[#435c6e] outline-none focus:border-[#76a8cd] ${
          readOnly ? "bg-[#f7f9fb] cursor-default" : "bg-white"
        }`}
      />
    </label>
  );
}

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`relative h-5 w-9 shrink-0 rounded-full transition ${
        enabled ? "bg-[#3b9d7a]" : "bg-[#cdd9df]"
      }`}
      aria-pressed={enabled}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition ${
          enabled ? "left-[18px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

function ToggleRow({
  title,
  description,
  enabled,
  onChange,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#edf1f4] py-3 last:border-0">
      <div>
        <p className="text-[10px] font-semibold text-[#526a7a]">{title}</p>
        <p className="mt-1 text-[9px] leading-[1.4] text-[#8b99a3]">
          {description}
        </p>
      </div>
      <Toggle enabled={enabled} onChange={onChange} />
    </div>
  );
}

function CheckOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className="flex items-center gap-2 rounded px-2 py-1.5 text-left text-[10px] font-semibold text-[#637987] hover:bg-[#f5f8fa]"
    >
      <span
        className={`flex h-4 w-4 items-center justify-center rounded border ${
          checked
            ? "border-[#3b9d7a] bg-[#3b9d7a] text-white"
            : "border-[#ccd9df] bg-white text-transparent"
        }`}
      >
        <Check size={10} />
      </span>
      {label}
    </button>
  );
}

// ─── Tab definitions ─────────────────────────────────────────────────────────

type TabId =
  | "general"
  | "appearance"
  | "modules"
  | "languages"
  | "pricing"
  | "emails"
  | "notifications"
  | "security"
  | "profile"
  | "team"
  | "integrations"
  | "api"
  | "data"
  | "audit"
  | "maintenance";

const tabGroups: {
  group: string;
  items: { id: TabId; label: string; description: string; icon: React.ElementType }[];
}[] = [
  {
    group: "Plateforme",
    items: [
      { id: "general", label: "Général", description: "Identité et configuration de base", icon: SettingsIcon },
      { id: "appearance", label: "Apparence", description: "Thème, couleurs, favicon", icon: Palette },
      { id: "modules", label: "Modules", description: "Fonctionnalités activées par défaut", icon: Layers },
      { id: "languages", label: "Langues", description: "Langues de la plateforme et des écoles", icon: Languages },
    ],
  },
  {
    group: "Facturation",
    items: [
      { id: "pricing", label: "Abonnements & Tarification", description: "Prix, essais et paiements", icon: ZapIcon },
      { id: "emails", label: "Emails transactionnels", description: "Templates envoyés aux écoles", icon: Mail },
    ],
  },
  {
    group: "Communication",
    items: [
      { id: "notifications", label: "Notifications", description: "Alertes de l'équipe", icon: Bell },
    ],
  },
  {
    group: "Accès & Conformité",
    items: [
      { id: "security", label: "Sécurité", description: "Accès et sessions", icon: ShieldCheck },
      { id: "profile", label: "Mon Profil", description: "Compte et préférences personnels", icon: UserRound },
      { id: "team", label: "Équipe EduGoma", description: "Administrateurs internes", icon: Users },
      { id: "data", label: "Données & Conformité", description: "CGU, export et rétention", icon: Database },
    ],
  },
  {
    group: "Développeurs",
    items: [
      { id: "integrations", label: "Intégrations", description: "Services connectés", icon: Wifi },
      { id: "api", label: "API & Webhooks", description: "Clés API et intégrations entrantes", icon: Webhook },
    ],
  },
  {
    group: "Système",
    items: [
      { id: "audit", label: "Journal des modifications", description: "Historique des changements paramètres", icon: History },
      { id: "maintenance", label: "Maintenance", description: "Planification et statut", icon: Wrench },
    ],
  },
];

// ─── Tab content components ───────────────────────────────────────────────────

function GeneralTab({ markDirty }: { markDirty: () => void }) {
  const [platformName, setPlatformName] = useState("EduGoma");
  const [domain, setDomain] = useState("edugoma.cd");
  const [provinces, setProvinces] = useState(["Nord-Kivu", "Sud-Kivu", "Kinshasa"]);

  return (
    <div className="space-y-4">
      <SettingCard title="Identité de la plateforme" description="Les informations affichées aux écoles et aux utilisateurs">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nom de la plateforme" value={platformName} onChange={(v) => { setPlatformName(v); markDirty(); }} />
          <Field label="Domaine principal" value={domain} onChange={(v) => { setDomain(v); markDirty(); }} />
        </div>
        <div className="mt-4 flex items-center gap-3 rounded-md border border-dashed border-[#d8e3e8] p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#102d48] text-white">
            <span className="text-[13px] font-extrabold">EG</span>
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-[#516a7a]">Logo EduGoma</p>
            <p className="mt-1 text-[8px] text-[#94a0a9]">PNG ou SVG · recommandé 256 × 256 px</p>
          </div>
          <button onClick={markDirty} className="rounded border border-[#dfe7ec] px-2.5 py-1.5 text-[9px] font-bold text-[#607887] hover:bg-[#f5f8fa]">Remplacer</button>
        </div>
      </SettingCard>

      <SettingCard title="Préférences régionales" description="Valeurs par défaut pour les nouveaux espaces">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#8997a2]">Langue par défaut</span>
            <select onChange={markDirty} className="mt-1.5 h-9 w-full rounded-md border border-[#dfe7ec] bg-white px-3 text-[10px] font-semibold text-[#536b7d]">
              <option>Français</option>
              <option>English</option>
            </select>
          </label>
          <label className="block">
            <span className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#8997a2]">Fuseau horaire</span>
            <select onChange={markDirty} className="mt-1.5 h-9 w-full rounded-md border border-[#dfe7ec] bg-white px-3 text-[10px] font-semibold text-[#536b7d]">
              <option>CAT — Africa/Lubumbashi</option>
              <option>UTC</option>
            </select>
          </label>
        </div>
        <div className="mt-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#8997a2]">Provinces couvertes</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {["Nord-Kivu", "Sud-Kivu", "Kinshasa", "Ituri", "Haut-Katanga", "Maniema", "Kasaï Central"].map((p) => (
              <CheckOption
                key={p}
                label={p}
                checked={provinces.includes(p)}
                onChange={() => {
                  setProvinces((cur) =>
                    cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]
                  );
                  markDirty();
                }}
              />
            ))}
          </div>
        </div>
      </SettingCard>
    </div>
  );
}

function AppearanceTab({ markDirty }: { markDirty: () => void }) {
  const [primaryColor, setPrimaryColor] = useState("#102d48");
  const [accentColor, setAccentColor] = useState("#3b9d7a");
  const [darkMode, setDarkMode] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [welcomeMsg, setWelcomeMsg] = useState("Bienvenue sur EduGoma, la plateforme de gestion scolaire de référence en RDC.");

  return (
    <div className="space-y-4">
      <SettingCard title="Couleurs de la plateforme" description="Appliquées à l'interface admin et aux emails envoyés aux écoles">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#8997a2]">Couleur principale</span>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => { setPrimaryColor(e.target.value); markDirty(); }}
                className="h-9 w-10 cursor-pointer rounded border border-[#dfe7ec] p-0.5"
              />
              <span className="rounded-md border border-[#dfe7ec] bg-[#f7f9fb] px-3 py-2 text-[10px] font-mono text-[#435c6e]">{primaryColor}</span>
              <div className="h-7 w-7 rounded-lg border border-[#e0e8ee]" style={{ background: primaryColor }} />
            </div>
          </div>
          <div>
            <span className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#8997a2]">Couleur d'accent</span>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => { setAccentColor(e.target.value); markDirty(); }}
                className="h-9 w-10 cursor-pointer rounded border border-[#dfe7ec] p-0.5"
              />
              <span className="rounded-md border border-[#dfe7ec] bg-[#f7f9fb] px-3 py-2 text-[10px] font-mono text-[#435c6e]">{accentColor}</span>
              <div className="h-7 w-7 rounded-lg border border-[#e0e8ee]" style={{ background: accentColor }} />
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-md bg-[#f1f8fb] px-3 py-2.5 text-[9px] text-[#617b8a]">
          Ces couleurs sont appliquées dans les emails automatiques et la page de connexion des écoles.
        </div>
      </SettingCard>

      <SettingCard title="Favicon & Icône de l'application">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#e4eaf0] bg-[#f7f9fb] text-[9px] font-bold text-[#7a8c9a]">
            ICO
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-[#516a7a]">Favicon</p>
            <p className="text-[9px] text-[#8a97a4]">Format ICO ou PNG 32×32 px — affiché dans l'onglet navigateur</p>
          </div>
          <button onClick={markDirty} className="flex items-center gap-1.5 rounded-md border border-[#dfe7ec] px-3 py-2 text-[9px] font-bold text-[#607887] hover:bg-[#f5f8fa]">
            <Upload size={12} /> Uploader
          </button>
        </div>
      </SettingCard>

      <SettingCard title="Interface administrateur">
        <ToggleRow title="Mode sombre" description="Activer le thème sombre pour tous les administrateurs EduGoma." enabled={darkMode} onChange={() => { setDarkMode(!darkMode); markDirty(); }} />
        <ToggleRow title="Mode compact" description="Réduire les espacements pour afficher plus d'informations à l'écran." enabled={compactMode} onChange={() => { setCompactMode(!compactMode); markDirty(); }} />
      </SettingCard>

      <SettingCard title="Message de bienvenue" description="Affiché aux directeurs d'école après leur première connexion">
        <textarea
          rows={3}
          value={welcomeMsg}
          onChange={(e) => { setWelcomeMsg(e.target.value); markDirty(); }}
          className="w-full rounded-md border border-[#dfe7ec] bg-white px-3 py-2.5 text-[10px] text-[#435c6e] outline-none focus:border-[#76a8cd] resize-none"
        />
        <p className="mt-1.5 text-[9px] text-[#9aa6b0]">{welcomeMsg.length} / 250 caractères</p>
      </SettingCard>
    </div>
  );
}

function ModulesTab({ markDirty }: { markDirty: () => void }) {
  const [modules, setModules] = useState({
    absences: true,
    notes: true,
    payments: false,
    library: false,
    canteen: false,
    whatsapp: false,
    reports: true,
    timetable: false,
    discipline: false,
  });

  const toggle = (key: keyof typeof modules) => {
    setModules((m) => ({ ...m, [key]: !m[key] }));
    markDirty();
  };

  const moduleList = [
    { key: "absences" as const, label: "Gestion des absences", description: "Suivi quotidien des présences élèves et enseignants.", icon: CheckCircle2, category: "Pédagogie" },
    { key: "notes" as const, label: "Notes & Bulletins", description: "Saisie des notes, calcul des moyennes et édition des bulletins.", icon: BookOpen, category: "Pédagogie" },
    { key: "timetable" as const, label: "Emploi du temps", description: "Planification hebdomadaire des cours par classe.", icon: ToggleRight, category: "Pédagogie" },
    { key: "discipline" as const, label: "Discipline & Sanctions", description: "Enregistrement des incidents disciplinaires et suivi.", icon: ShieldCheck, category: "Pédagogie" },
    { key: "payments" as const, label: "Paiements école", description: "Gestion des frais scolaires, reçus et historique de paiements.", icon: ZapIcon, category: "Finance" },
    { key: "canteen" as const, label: "Cantine & Pointage", description: "Suivi des repas et pointage de présence en temps réel.", icon: ToggleLeft, category: "Services" },
    { key: "library" as const, label: "Bibliothèque", description: "Catalogue de livres, emprunts et retours.", icon: BookOpen, category: "Services" },
    { key: "whatsapp" as const, label: "WhatsApp Parents", description: "Notifications automatiques aux parents via WhatsApp.", icon: Smartphone, category: "Communication" },
    { key: "reports" as const, label: "Rapports & Exports", description: "Génération de rapports statistiques et exports CSV/PDF.", icon: FileText, category: "Administration" },
  ];

  const categories = [...new Set(moduleList.map((m) => m.category))];

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-[#e3edf5] bg-[#f1f8fc] px-4 py-3 text-[9px] text-[#4e7a98]">
        <strong className="font-bold">Modules par défaut</strong> — Ces réglages s'appliquent aux nouvelles écoles lors de leur activation. Les modules peuvent ensuite être ajustés école par école.
      </div>
      {categories.map((cat) => (
        <SettingCard key={cat} title={cat}>
          <div className="divide-y divide-[#edf1f4]">
            {moduleList.filter((m) => m.category === cat).map((mod) => {
              const Icon = mod.icon;
              return (
                <div key={mod.key} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#eef3f7] text-[#577a90]">
                      <Icon size={14} />
                    </span>
                    <div>
                      <p className="text-[10px] font-semibold text-[#526a7a]">{mod.label}</p>
                      <p className="mt-0.5 text-[9px] leading-relaxed text-[#8b99a3]">{mod.description}</p>
                    </div>
                  </div>
                  <Toggle enabled={modules[mod.key]} onChange={() => toggle(mod.key)} />
                </div>
              );
            })}
          </div>
        </SettingCard>
      ))}
    </div>
  );
}

function PricingTab({ markDirty }: { markDirty: () => void }) {
  const [price, setPrice] = useState("10");
  const [trial, setTrial] = useState("2");
  const [autoSuspend, setAutoSuspend] = useState(false);
  const [payments, setPayments] = useState(["Mobile Money — Airtel / M-Pesa / Orange"]);

  return (
    <div className="space-y-4">
      <SettingCard title="Paramètres d'abonnement" description="Règles appliquées aux écoles partenaires">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Prix mensuel par école ($)" value={price} onChange={(v) => { setPrice(v); markDirty(); }} type="number" />
          <Field label="Durée de l'essai gratuit (mois)" value={trial} onChange={(v) => { setTrial(v); markDirty(); }} type="number" />
        </div>
        <div className="mt-4 rounded-md bg-[#f1f8fb] px-3 py-2.5 text-[9px] text-[#617b8a]">
          Les changements de prix s'appliquent uniquement aux nouveaux renouvellements. Les paiements sont actuellement confirmés manuellement.
        </div>
      </SettingCard>

      <SettingCard title="Modes de paiement acceptés">
        <div className="grid gap-1 sm:grid-cols-2">
          {["Mobile Money — Airtel / M-Pesa / Orange", "Virement bancaire", "Espèces via agent"].map((p) => (
            <CheckOption
              key={p}
              label={p}
              checked={payments.includes(p)}
              onChange={() => {
                setPayments((cur) =>
                  cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]
                );
                markDirty();
              }}
            />
          ))}
        </div>
      </SettingCard>

      <SettingCard title="Gestion des retards" description="Le contrôle automatique est désactivé par défaut car la facturation reste manuelle">
        <ToggleRow
          title="Suspendre automatiquement une école après retard"
          description="Les écoles sont actuellement suspendues après vérification manuelle de l'équipe."
          enabled={autoSuspend}
          onChange={() => { setAutoSuspend(!autoSuspend); markDirty(); }}
        />
        {autoSuspend && (
          <div className="mt-3 max-w-[230px]">
            <Field label="Nombre de jours de retard" value="10" onChange={markDirty} type="number" />
          </div>
        )}
      </SettingCard>
    </div>
  );
}

function EmailsTab({ markDirty }: { markDirty: () => void }) {
  const [senderName, setSenderName] = useState("EduGoma");
  const [senderEmail, setSenderEmail] = useState("no-reply@edugoma.cd");
  const [replyTo, setReplyTo] = useState("support@edugoma.cd");
  const [selectedTemplate, setSelectedTemplate] = useState("welcome");

  const templates = [
    { id: "welcome", label: "Bienvenue après validation", tag: "Onboarding" },
    { id: "trial_end", label: "Essai gratuit bientôt terminé", tag: "Facturation" },
    { id: "invoice", label: "Facture mensuelle", tag: "Facturation" },
    { id: "suspended", label: "Compte suspendu", tag: "Alerte" },
    { id: "reactivated", label: "Compte réactivé", tag: "Alerte" },
    { id: "password_reset", label: "Réinitialisation de mot de passe", tag: "Sécurité" },
    { id: "doc_missing", label: "Document manquant", tag: "Dossier" },
    { id: "doc_validated", label: "Dossier validé", tag: "Dossier" },
  ];

  const tagColors: Record<string, string> = {
    Onboarding: "bg-[#e5f7ef] text-[#379d78]",
    Facturation: "bg-[#e6f1fc] text-[#4a86b7]",
    Alerte: "bg-[#fdeced] text-[#c25e67]",
    Sécurité: "bg-[#f0edfd] text-[#6355b8]",
    Dossier: "bg-[#fef3e6] text-[#b6732f]",
  };

  return (
    <div className="space-y-4">
      <SettingCard title="Expéditeur par défaut" description="Informations affichées dans tous les emails sortants">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Nom de l'expéditeur" value={senderName} onChange={(v) => { setSenderName(v); markDirty(); }} />
          <Field label="Email d'envoi" value={senderEmail} onChange={(v) => { setSenderEmail(v); markDirty(); }} type="email" />
          <Field label="Répondre à" value={replyTo} onChange={(v) => { setReplyTo(v); markDirty(); }} type="email" />
        </div>
      </SettingCard>

      <SettingCard title="Templates d'emails" description="Sélectionner un template pour le prévisualiser ou le modifier">
        <div className="grid gap-2 sm:grid-cols-2">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTemplate(t.id)}
              className={`flex items-center justify-between rounded-md border px-3 py-2.5 text-left transition ${
                selectedTemplate === t.id
                  ? "border-[#76a8cd] bg-[#f0f8ff]"
                  : "border-[#e4eaf0] bg-white hover:bg-[#f7f9fb]"
              }`}
            >
              <span className="text-[10px] font-semibold text-[#435c6e]">{t.label}</span>
              <span className={`rounded px-2 py-0.5 text-[8px] font-bold ${tagColors[t.tag]}`}>{t.tag}</span>
            </button>
          ))}
        </div>

        {selectedTemplate && (
          <div className="mt-4 rounded-md border border-[#dce9f1] bg-[#f7fafd]">
            <div className="flex items-center justify-between border-b border-[#dce9f1] px-4 py-2.5">
              <p className="text-[10px] font-bold text-[#3d5e74]">
                Aperçu — {templates.find((t) => t.id === selectedTemplate)?.label}
              </p>
              <button onClick={markDirty} className="flex items-center gap-1.5 rounded border border-[#c8dae5] px-2.5 py-1 text-[9px] font-bold text-[#4a7a95] hover:bg-[#eaf3f9]">
                Modifier le template
              </button>
            </div>
            <div className="px-4 py-3">
              <p className="text-[9px] font-semibold text-[#8a97a4]">Objet : Bienvenue sur EduGoma — Votre espace est prêt !</p>
              <div className="mt-3 rounded border border-[#e0eaf1] bg-white p-4 text-[9px] leading-relaxed text-[#516a7a]">
                <p>Bonjour <strong>[Nom du Directeur]</strong>,</p>
                <p className="mt-2">Nous avons le plaisir de vous annoncer que votre école <strong>[Nom de l'École]</strong> a été validée sur la plateforme EduGoma.</p>
                <p className="mt-2">Vous pouvez dès maintenant vous connecter et commencer à utiliser vos modules activés.</p>
                <p className="mt-4 font-bold text-[#102d48]">[Bouton : Accéder à mon espace]</p>
              </div>
            </div>
          </div>
        )}
      </SettingCard>
    </div>
  );
}

function NotificationsTab({ markDirty }: { markDirty: () => void }) {
  const [events, setEvents] = useState([
    "Nouvelle inscription école",
    "Document manquant",
    "Essai se terminant bientôt",
    "Paiement en retard",
  ]);
  const [channels, setChannels] = useState(["Email"]);

  return (
    <div className="space-y-4">
      <SettingCard title="Événements à notifier" description="Choisissez les événements qui nécessitent l'attention de l'équipe EduGoma">
        <div className="divide-y divide-[#edf1f4]">
          {[
            "Nouvelle inscription école",
            "Document manquant",
            "Essai se terminant bientôt",
            "Paiement en retard",
            "Incident système",
            "Nouvelle demande de démo",
            "Compte suspendu manuellement",
          ].map((event) => (
            <ToggleRow
              key={event}
              title={event}
              description={`Recevoir une alerte lorsqu'un événement « ${event.toLowerCase()} » est détecté.`}
              enabled={events.includes(event)}
              onChange={() => {
                setEvents((cur) =>
                  cur.includes(event) ? cur.filter((x) => x !== event) : [...cur, event]
                );
                markDirty();
              }}
            />
          ))}
        </div>
      </SettingCard>

      <SettingCard title="Canaux de notification" description="Les alertes sont envoyées aux coordonnées de l'administrateur plateforme">
        <div className="flex flex-wrap gap-2">
          {["Email", "SMS", "Email + SMS"].map((ch) => (
            <CheckOption
              key={ch}
              label={ch}
              checked={channels.includes(ch)}
              onChange={() => { setChannels([ch]); markDirty(); }}
            />
          ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Adresse email de contact" value="admin@edugoma.cd" onChange={markDirty} />
          <Field label="Numéro SMS de contact" value="+243 810 000 001" onChange={markDirty} />
        </div>
      </SettingCard>
    </div>
  );
}

function SecurityTab({ markDirty }: { markDirty: () => void }) {
  return (
    <div className="space-y-4">
      <SettingCard title="Contrôle d'accès" description="Protection des comptes administrateurs et des sessions">
        <ToggleRow title="Authentification à deux facteurs obligatoire" description="Tous les administrateurs doivent confirmer leur identité avec une seconde étape." enabled onChange={markDirty} />
        <ToggleRow title="Notifier les nouvelles connexions" description="Créer une alerte lors d'une connexion depuis un nouvel appareil." enabled onChange={markDirty} />
        <ToggleRow title="Blocage après tentatives échouées" description="Verrouiller un compte après 5 tentatives de connexion infructueuses." enabled onChange={markDirty} />
      </SettingCard>

      <SettingCard title="Politique de mot de passe">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Longueur minimale" value="10 caractères" onChange={markDirty} />
          <Field label="Expiration" value="90 jours" onChange={markDirty} />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <CheckOption label="Majuscules requises" checked onChange={markDirty} />
          <CheckOption label="Chiffres requis" checked onChange={markDirty} />
          <CheckOption label="Caractère spécial requis" checked onChange={markDirty} />
          <CheckOption label="Interdire les 5 derniers mots de passe" checked onChange={markDirty} />
        </div>
      </SettingCard>

      <SettingCard title="Sessions actives" description="Sessions d'administration actuellement ouvertes">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="bg-[#f8fafc] text-[8px] font-bold uppercase tracking-[0.06em] text-[#83909c]">
                <th className="px-3 py-2">Appareil</th>
                <th className="px-3 py-2">Localisation</th>
                <th className="px-3 py-2">Dernière activité</th>
                <th className="px-3 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Chrome · macOS", "Goma, RDC", "il y a 4m"],
                ["Safari · iPhone", "Bukavu, RDC", "il y a 2h"],
                ["Edge · Windows", "Kinshasa, RDC", "il y a 1j"],
              ].map((s) => (
                <tr key={s[0]} className="border-t border-[#edf1f4] text-[9px] text-[#71818e]">
                  <td className="px-3 py-2.5 font-semibold text-[#516a7a]">{s[0]}</td>
                  <td className="px-3 py-2.5">{s[1]}</td>
                  <td className="px-3 py-2.5">{s[2]}</td>
                  <td className="px-3 py-2.5 text-right">
                    <button onClick={markDirty} className="text-[9px] font-bold text-[#c25e67] hover:underline">Déconnecter</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex justify-end">
          <button onClick={markDirty} className="rounded-md border border-[#f0c8cb] bg-[#fdf2f2] px-3 py-2 text-[9px] font-bold text-[#c25e67] hover:bg-[#fce8e9]">
            Déconnecter toutes les sessions
          </button>
        </div>
      </SettingCard>
    </div>
  );
}

function TeamTab({ markDirty }: { markDirty: () => void }) {
  return (
    <SettingCard title="Membres de l'équipe EduGoma" description="Administrateurs internes, indépendants des comptes utilisateurs des écoles">
      <div className="mb-3 flex justify-end">
        <button onClick={markDirty} className="flex items-center gap-1.5 rounded-md bg-[#102d48] px-3 py-2 text-[9px] font-bold text-white hover:bg-[#193d5e]">
          <Plus size={12} /> Inviter un membre
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-left">
          <thead>
            <tr className="bg-[#f8fafc] text-[8px] font-bold uppercase tracking-[0.06em] text-[#83909c]">
              <th className="px-3 py-2">Nom</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Rôle</th>
              <th className="px-3 py-2">Statut</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Dr. Julien Makiese", "superadmin@edugoma.cd", "Super Admin", "Actif"],
              ["Aline Kabuya", "al.kabuya@edugoma.cd", "Facturation", "Actif"],
              ["Patrick Okito", "support@edugoma.cd", "Support", "Actif"],
            ].map((m) => (
              <tr key={m[1]} className="border-t border-[#edf1f4] text-[9px] text-[#71818e]">
                <td className="px-3 py-3 font-bold text-[#516a7a]">
                  <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#e5eef3] text-[8px] font-bold text-[#4a6e84]">
                    {m[0].split(" ").map((p) => p[0]).slice(-2).join("")}
                  </span>
                  {m[0]}
                </td>
                <td className="px-3 py-3">{m[1]}</td>
                <td className="px-3 py-3">
                  <span className="rounded bg-[#e6f1fc] px-2 py-1 text-[8px] font-bold text-[#4a86b7]">{m[2]}</span>
                </td>
                <td className="px-3 py-3">
                  <span className="rounded bg-[#e5f7ef] px-2 py-1 text-[8px] font-bold text-[#379d78]">{m[3]}</span>
                </td>
                <td className="px-3 py-3 text-right">
                  <button onClick={markDirty} className="text-[9px] font-bold text-[#557f9c] hover:underline">Modifier</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SettingCard>
  );
}

function IntegrationsTab({ markDirty }: { markDirty: () => void }) {
  const integrations = [
    { name: "Mobile Money", description: "Airtel Money, M-Pesa et Orange Money — confirmation manuelle des paiements.", status: "Connecté", tone: "green", icon: Smartphone },
    { name: "Passerelle SMS", description: "Notifications transactionnelles et alertes aux directeurs d'école.", status: "Non connecté", tone: "gray", icon: Bell },
    { name: "WhatsApp Business API", description: "Communications opérationnelles ciblées vers les parents et enseignants.", status: "Non connecté", tone: "gray", icon: Globe2 },
    { name: "Google Workspace", description: "Authentification SSO et synchronisation des comptes administrateurs.", status: "Non connecté", tone: "gray", icon: Lock },
    { name: "Passerelle Email (SMTP)", description: "Envoi des emails transactionnels via serveur SMTP personnalisé.", status: "Non connecté", tone: "gray", icon: Mail },
    { name: "Stockage Cloud (S3)", description: "Archivage des documents scolaires, bulletins et pièces jointes.", status: "Non connecté", tone: "gray", icon: Database },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {integrations.map((integration) => {
        const Icon = integration.icon;
        return (
          <section key={integration.name} className="rounded-md border border-[#e4eaf0] bg-white p-4 shadow-[0_2px_7px_rgba(33,60,84,0.025)]">
            <div className="flex items-start justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eef3f7] text-[#577a90]">
                <Icon size={17} />
              </span>
              <span className={`rounded px-2 py-1 text-[8px] font-bold ${integration.tone === "green" ? "bg-[#e5f7ef] text-[#379d78]" : "bg-[#eef2f5] text-[#71808d]"}`}>
                {integration.status}
              </span>
            </div>
            <h2 className="mt-3 text-[12px] font-bold text-[#40596b]">{integration.name}</h2>
            <p className="mt-1 text-[9px] leading-relaxed text-[#8a98a2]">{integration.description}</p>
            <button onClick={markDirty} className="mt-4 rounded-md border border-[#dfe7ec] px-3 py-2 text-[9px] font-bold text-[#607887] hover:bg-[#f5f8fa]">
              Configurer
            </button>
          </section>
        );
      })}
    </div>
  );
}

function ApiTab({ markDirty }: { markDirty: () => void }) {
  const [copied, setCopied] = useState(false);
  const apiKey = "eg_live_sk_xK9mP2qR8vT4wN7hJ3dL6";
  const webhookUrl = "https://api.edugoma.cd/webhooks/inbound";

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <SettingCard title="Clé API Admin" description="Utilisée pour accéder à l'API EduGoma depuis des services externes">
        <div className="flex items-center gap-2">
          <input
            readOnly
            value={`${apiKey.slice(0, 16)}${"•".repeat(16)}`}
            className="h-9 flex-1 rounded-md border border-[#dfe7ec] bg-[#f7f9fb] px-3 font-mono text-[10px] text-[#435c6e] outline-none"
          />
          <button
            onClick={copyKey}
            className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-[9px] font-bold transition ${
              copied
                ? "border-[#3b9d7a] bg-[#effaf5] text-[#3b9d7a]"
                : "border-[#dfe7ec] text-[#607887] hover:bg-[#f5f8fa]"
            }`}
          >
            {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
            {copied ? "Copié !" : "Copier"}
          </button>
          <button onClick={markDirty} className="flex items-center gap-1.5 rounded-md border border-[#f0c8cb] bg-[#fdf2f2] px-3 py-2 text-[9px] font-bold text-[#c25e67] hover:bg-[#fce8e9]">
            <RefreshCw size={12} /> Régénérer
          </button>
        </div>
        <div className="mt-3 rounded-md border border-[#fde8c8] bg-[#fffbf5] px-3 py-2.5 text-[9px] text-[#8a6030]">
          ⚠ La régénération de la clé invalidera immédiatement toutes les intégrations utilisant l'ancienne clé.
        </div>
      </SettingCard>

      <SettingCard title="Webhooks entrants" description="Recevez des événements temps réel depuis vos services tiers">
        <div className="flex items-center gap-2">
          <input
            readOnly
            value={webhookUrl}
            className="h-9 flex-1 rounded-md border border-[#dfe7ec] bg-[#f7f9fb] px-3 font-mono text-[10px] text-[#435c6e] outline-none"
          />
          <button
            onClick={() => { navigator.clipboard.writeText(webhookUrl); }}
            className="flex items-center gap-1.5 rounded-md border border-[#dfe7ec] px-3 py-2 text-[9px] font-bold text-[#607887] hover:bg-[#f5f8fa]"
          >
            <Copy size={12} /> Copier
          </button>
        </div>
        <div className="mt-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#8997a2]">Secret de signature</p>
          <div className="mt-1.5 flex items-center gap-2">
            <input readOnly value="whsec_••••••••••••••••••••" className="h-9 flex-1 rounded-md border border-[#dfe7ec] bg-[#f7f9fb] px-3 font-mono text-[10px] text-[#435c6e] outline-none" />
            <button onClick={markDirty} className="flex items-center gap-1.5 rounded-md border border-[#dfe7ec] px-3 py-2 text-[9px] font-bold text-[#607887] hover:bg-[#f5f8fa]">
              <RefreshCw size={12} /> Renouveler
            </button>
          </div>
        </div>
      </SettingCard>

      <SettingCard title="Journal des appels API (7 derniers jours)" description="Activité récente sur l'API EduGoma">
        <div className="divide-y divide-[#edf1f4]">
          {[
            { method: "GET", path: "/admin/tenants/active", code: 200, time: "12ms", when: "il y a 3m" },
            { method: "POST", path: "/admin/tenants/:id/validate", code: 200, time: "34ms", when: "il y a 1h" },
            { method: "GET", path: "/admin/alerts/priority", code: 200, time: "8ms", when: "il y a 1h" },
            { method: "PATCH", path: "/admin/alerts/:id/resolve", code: 200, time: "19ms", when: "il y a 3h" },
            { method: "POST", path: "/auth/login", code: 401, time: "5ms", when: "il y a 5h" },
          ].map((log, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5 text-[9px]">
              <span className={`w-10 shrink-0 rounded px-1.5 py-0.5 text-center text-[8px] font-bold ${log.method === "POST" ? "bg-[#e6f1fc] text-[#4a86b7]" : log.method === "PATCH" ? "bg-[#fef3e6] text-[#b6732f]" : "bg-[#eef3f7] text-[#577a90]"}`}>
                {log.method}
              </span>
              <span className="flex-1 font-mono text-[#435c6e]">{log.path}</span>
              <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${log.code === 200 ? "bg-[#e5f7ef] text-[#379d78]" : "bg-[#fdeced] text-[#c25e67]"}`}>{log.code}</span>
              <span className="w-10 text-right text-[#8a97a4]">{log.time}</span>
              <span className="w-16 text-right text-[#adb8c0]">{log.when}</span>
            </div>
          ))}
        </div>
      </SettingCard>
    </div>
  );
}

function DataTab({ markDirty }: { markDirty: () => void }) {
  const [retention, setRetention] = useState("12");
  const [cgAccepted, setCgAccepted] = useState(true);

  return (
    <div className="space-y-4">
      <SettingCard title="Rétention des données" description="Durée de conservation des journaux et données inactives">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#8997a2]">Conserver les logs d'audit (mois)</span>
            <select
              value={retention}
              onChange={(e) => { setRetention(e.target.value); markDirty(); }}
              className="mt-1.5 h-9 w-full rounded-md border border-[#dfe7ec] bg-white px-3 text-[10px] font-semibold text-[#536b7d]"
            >
              <option value="3">3 mois</option>
              <option value="6">6 mois</option>
              <option value="12">12 mois</option>
              <option value="24">24 mois</option>
              <option value="0">Indéfiniment</option>
            </select>
          </label>
          <label className="block">
            <span className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#8997a2]">Supprimer les comptes inactifs après</span>
            <select onChange={markDirty} className="mt-1.5 h-9 w-full rounded-md border border-[#dfe7ec] bg-white px-3 text-[10px] font-semibold text-[#536b7d]">
              <option>Jamais</option>
              <option>6 mois d'inactivité</option>
              <option>12 mois d'inactivité</option>
              <option>24 mois d'inactivité</option>
            </select>
          </label>
        </div>
      </SettingCard>

      <SettingCard title="Export des données" description="Télécharger une copie complète des données de la plateforme">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { label: "Toutes les écoles (CSV)", description: "Nom, commune, statut, date d'inscription" },
            { label: "Tous les utilisateurs (CSV)", description: "Comptes administrateurs et superviseurs" },
            { label: "Journal d'activité complet", description: "Toutes les actions des 12 derniers mois" },
            { label: "Alertes et incidents", description: "Historique des alertes résolues et actives" },
          ].map((ex) => (
            <div key={ex.label} className="flex items-center justify-between rounded-md border border-[#e4eaf0] p-3">
              <div>
                <p className="text-[10px] font-semibold text-[#435c6e]">{ex.label}</p>
                <p className="mt-0.5 text-[9px] text-[#8a97a4]">{ex.description}</p>
              </div>
              <button className="ml-3 flex shrink-0 items-center gap-1 rounded-md border border-[#dfe7ec] px-2.5 py-1.5 text-[9px] font-bold text-[#607887] hover:bg-[#f5f8fa]">
                <Download size={11} /> Exporter
              </button>
            </div>
          ))}
        </div>
      </SettingCard>

      <SettingCard title="Conditions Générales d'Utilisation" description="Document contractuel accepté par toutes les écoles lors de l'inscription">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold text-[#526a7a]">CGU en vigueur — Version 2.1</p>
            <p className="mt-1 text-[9px] text-[#8a97a4]">Mise à jour le 15 septembre 2026 · Acceptées par 87 écoles</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 rounded-md border border-[#dfe7ec] px-3 py-2 text-[9px] font-bold text-[#607887] hover:bg-[#f5f8fa]">
              <FileText size={11} /> Voir
            </button>
            <button onClick={markDirty} className="flex items-center gap-1.5 rounded-md bg-[#102d48] px-3 py-2 text-[9px] font-bold text-white hover:bg-[#193d5e]">
              <Upload size={11} /> Nouvelle version
            </button>
          </div>
        </div>
      </SettingCard>

      <SettingCard title="Droit à l'effacement" description="Supprimer toutes les données d'une école à sa demande">
        <div className="rounded-md border border-[#f0c8cb] bg-[#fdf2f2] px-4 py-3">
          <p className="text-[10px] font-bold text-[#7c3040]">Zone dangereuse</p>
          <p className="mt-1 text-[9px] text-[#9a4050]">La suppression d'une école efface définitivement ses données, ses utilisateurs et ses documents. Cette action est irréversible.</p>
          <button onClick={markDirty} className="mt-3 rounded-md border border-[#e0a0a8] px-3 py-2 text-[9px] font-bold text-[#c25e67] hover:bg-[#fce8e9]">
            Supprimer les données d'une école…
          </button>
        </div>
      </SettingCard>
    </div>
  );
}

function MaintenanceTab({ markDirty }: { markDirty: () => void }) {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMsg, setMaintenanceMsg] = useState(
    "EduGoma est temporairement en maintenance. Nous serons de retour dans quelques minutes. Merci pour votre patience."
  );

  return (
    <div className="space-y-4">
      <SettingCard title="Mode maintenance" description="Affiche une page de maintenance à tous les utilisateurs non-admin">
        <ToggleRow
          title="Activer le mode maintenance"
          description="Toutes les écoles et leurs utilisateurs verront un message de maintenance. Les super-admins conservent l'accès."
          enabled={maintenanceMode}
          onChange={() => { setMaintenanceMode(!maintenanceMode); markDirty(); }}
        />
        {maintenanceMode && (
          <div className="mt-4 rounded-md border border-[#f5d8a0] bg-[#fffbf0] px-3 py-2.5 text-[9px] font-semibold text-[#8a6030]">
            ⚠ Le mode maintenance est actif. Les utilisateurs des écoles ne peuvent pas se connecter.
          </div>
        )}
        <div className="mt-4">
          <span className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#8997a2]">Message affiché aux utilisateurs</span>
          <textarea
            rows={3}
            value={maintenanceMsg}
            onChange={(e) => { setMaintenanceMsg(e.target.value); markDirty(); }}
            className="mt-1.5 w-full rounded-md border border-[#dfe7ec] bg-white px-3 py-2.5 text-[10px] text-[#435c6e] outline-none focus:border-[#76a8cd] resize-none"
          />
        </div>
      </SettingCard>

      <SettingCard title="Fenêtre de maintenance planifiée" description="Avertir les écoles d'une maintenance prévue à l'avance">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block sm:col-span-1">
            <span className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#8997a2]">Date</span>
            <input type="date" onChange={markDirty} className="mt-1.5 h-9 w-full rounded-md border border-[#dfe7ec] bg-white px-3 text-[10px] text-[#435c6e] outline-none focus:border-[#76a8cd]" />
          </label>
          <label className="block">
            <span className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#8997a2]">Heure de début (CAT)</span>
            <input type="time" defaultValue="02:00" onChange={markDirty} className="mt-1.5 h-9 w-full rounded-md border border-[#dfe7ec] bg-white px-3 text-[10px] text-[#435c6e] outline-none focus:border-[#76a8cd]" />
          </label>
          <label className="block">
            <span className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#8997a2]">Heure de fin (CAT)</span>
            <input type="time" defaultValue="04:00" onChange={markDirty} className="mt-1.5 h-9 w-full rounded-md border border-[#dfe7ec] bg-white px-3 text-[10px] text-[#435c6e] outline-none focus:border-[#76a8cd]" />
          </label>
        </div>
        <button onClick={markDirty} className="mt-4 flex items-center gap-1.5 rounded-md bg-[#102d48] px-3 py-2 text-[9px] font-bold text-white hover:bg-[#193d5e]">
          <Bell size={12} /> Planifier et notifier les écoles
        </button>
      </SettingCard>

      <SettingCard title="Santé du système" description="État en temps réel des composants de la plateforme">
        <div className="divide-y divide-[#edf1f4]">
          {[
            { name: "Base de données PostgreSQL", status: "Opérationnel", latency: "4ms", tone: "green" },
            { name: "Serveur API (NestJS)", status: "Opérationnel", latency: "12ms", tone: "green" },
            { name: "Stockage fichiers", status: "Opérationnel", latency: "—", tone: "green" },
            { name: "Passerelle SMS", status: "Non configuré", latency: "—", tone: "gray" },
            { name: "WhatsApp Business API", status: "Non configuré", latency: "—", tone: "gray" },
          ].map((s) => (
            <div key={s.name} className="flex items-center justify-between py-2.5">
              <p className="text-[10px] font-semibold text-[#526a7a]">{s.name}</p>
              <div className="flex items-center gap-3">
                <span className="text-[9px] text-[#8a97a4]">{s.latency}</span>
                <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[8px] font-bold ${
                  s.tone === "green" ? "bg-[#e5f7ef] text-[#379d78]" : "bg-[#eef2f5] text-[#71808d]"
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${s.tone === "green" ? "bg-[#379d78]" : "bg-[#9aa9b4]"}`} />
                  {s.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </SettingCard>

      <SettingCard title="Dernier backup" description="Sauvegarde automatique de la base de données">
        <div className="flex items-center justify-between rounded-md border border-[#e4eaf0] p-3">
          <div>
            <p className="text-[10px] font-semibold text-[#435c6e]">Backup complet — 23 sept. 2026, 03:00 CAT</p>
            <p className="mt-0.5 text-[9px] text-[#8a97a4]">Taille : 284 MB · PostgreSQL dump · Chiffré AES-256</p>
          </div>
          <button className="flex items-center gap-1.5 rounded-md border border-[#dfe7ec] px-3 py-2 text-[9px] font-bold text-[#607887] hover:bg-[#f5f8fa]">
            <Download size={11} /> Télécharger
          </button>
        </div>
        <div className="mt-3 flex justify-end">
          <button onClick={markDirty} className="flex items-center gap-1.5 rounded-md bg-[#102d48] px-3 py-2 text-[9px] font-bold text-white hover:bg-[#193d5e]">
            <RefreshCw size={12} /> Lancer un backup maintenant
          </button>
        </div>
      </SettingCard>
    </div>
  );
}

function LanguagesTab({ markDirty }: { markDirty: () => void }) {
  const [interfaceLang, setInterfaceLang] = useState("fr");
  const [emailLang, setEmailLang] = useState("fr");
  const [enabledLangs, setEnabledLangs] = useState(["fr", "sw"]);

  const allLanguages = [
    { code: "fr", name: "Français", flag: "🇫🇷", native: "Français", coverage: 100, status: "Complète" },
    { code: "sw", name: "Swahili", flag: "🇨🇩", native: "Kiswahili", coverage: 72, status: "Partielle" },
    { code: "ln", name: "Lingala", flag: "🇨🇩", native: "Lingála", coverage: 38, status: "En cours" },
    { code: "en", name: "Anglais", flag: "🇬🇧", native: "English", coverage: 95, status: "Quasi-complète" },
    { code: "kg", name: "Kikongo", flag: "🇨🇩", native: "Kikongo", coverage: 0, status: "Non démarré" },
    { code: "tsh", name: "Tshiluba", flag: "🇨🇩", native: "Tshiluba", coverage: 0, status: "Non démarré" },
  ];

  const coverageColor = (pct: number) => {
    if (pct === 100) return "bg-[#3b9d7a]";
    if (pct >= 70) return "bg-[#4a86b7]";
    if (pct >= 30) return "bg-[#b6732f]";
    return "bg-[#cdd9df]";
  };

  const statusBadge = (status: string) => {
    if (status === "Complète") return "bg-[#e5f7ef] text-[#379d78]";
    if (status === "Quasi-complète") return "bg-[#e6f1fc] text-[#4a86b7]";
    if (status === "Partielle") return "bg-[#fef3e6] text-[#b6732f]";
    if (status === "En cours") return "bg-[#fef3e6] text-[#b6732f]";
    return "bg-[#eef2f5] text-[#71808d]";
  };

  const toggleLang = (code: string) => {
    if (code === "fr") return; // French always required
    setEnabledLangs((cur) =>
      cur.includes(code) ? cur.filter((x) => x !== code) : [...cur, code]
    );
    markDirty();
  };

  const provinceLanguages: { province: string; primary: string; secondary?: string }[] = [
    { province: "Nord-Kivu", primary: "Swahili", secondary: "Français" },
    { province: "Sud-Kivu", primary: "Swahili", secondary: "Français" },
    { province: "Kinshasa", primary: "Lingala", secondary: "Français" },
    { province: "Ituri", primary: "Swahili", secondary: "Français" },
    { province: "Haut-Katanga", primary: "Swahili", secondary: "Tshiluba" },
    { province: "Maniema", primary: "Swahili", secondary: "Français" },
  ];

  return (
    <div className="space-y-4">
      <SettingCard title="Langue de l'interface" description="Langue utilisée dans le tableau de bord administrateur EduGoma">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#8997a2]">Interface administrateur</span>
            <select
              value={interfaceLang}
              onChange={(e) => { setInterfaceLang(e.target.value); markDirty(); }}
              className="mt-1.5 h-9 w-full rounded-md border border-[#dfe7ec] bg-white px-3 text-[10px] font-semibold text-[#536b7d]"
            >
              <option value="fr">🇫🇷 Français</option>
              <option value="en">🇬🇧 English</option>
            </select>
          </label>
          <label className="block">
            <span className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#8997a2]">Langue des emails automatiques</span>
            <select
              value={emailLang}
              onChange={(e) => { setEmailLang(e.target.value); markDirty(); }}
              className="mt-1.5 h-9 w-full rounded-md border border-[#dfe7ec] bg-white px-3 text-[10px] font-semibold text-[#536b7d]"
            >
              <option value="fr">🇫🇷 Français</option>
              <option value="en">🇬🇧 English</option>
              <option value="sw">🇨🇩 Swahili</option>
            </select>
          </label>
        </div>
        <div className="mt-3 rounded-md bg-[#f1f8fb] px-3 py-2.5 text-[9px] text-[#617b8a]">
          Le Français est la langue officielle de la plateforme et reste toujours disponible pour toutes les écoles.
        </div>
      </SettingCard>

      <SettingCard title="Langues disponibles pour les écoles" description="Activer les langues que les directeurs et enseignants pourront choisir">
        <div className="divide-y divide-[#edf1f4]">
          {allLanguages.map((lang) => (
            <div key={lang.code} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
              <span className="text-xl">{lang.flag}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[10px] font-bold text-[#435c6e]">{lang.name}</p>
                  <span className="text-[9px] text-[#9aa8b4]">· {lang.native}</span>
                  <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${statusBadge(lang.status)}`}>
                    {lang.status}
                  </span>
                  {lang.code === "fr" && (
                    <span className="rounded bg-[#e8f1f7] px-1.5 py-0.5 text-[8px] font-bold text-[#436b85]">Requis</span>
                  )}
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="h-1.5 flex-1 max-w-[160px] rounded-full bg-[#e8eef3] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${coverageColor(lang.coverage)}`}
                      style={{ width: `${lang.coverage}%` }}
                    />
                  </div>
                  <span className="text-[8px] text-[#8a97a4]">{lang.coverage}% traduit</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={enabledLangs.includes(lang.code)}
                onChange={() => toggleLang(lang.code)}
                disabled={lang.code === "fr"}
                className="h-4 w-4 cursor-pointer accent-[#3b9d7a] disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          ))}
        </div>
      </SettingCard>

      <SettingCard title="Langue principale par province" description="La langue présentée en premier aux écoles de chaque province">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-left">
            <thead>
              <tr className="bg-[#f8fafc] text-[8px] font-bold uppercase tracking-[0.06em] text-[#83909c]">
                <th className="px-3 py-2">Province</th>
                <th className="px-3 py-2">Langue principale</th>
                <th className="px-3 py-2">Langue secondaire</th>
              </tr>
            </thead>
            <tbody>
              {provinceLanguages.map((row) => (
                <tr key={row.province} className="border-t border-[#edf1f4] text-[9px] text-[#71818e]">
                  <td className="px-3 py-2.5 font-bold text-[#516a7a]">{row.province}</td>
                  <td className="px-3 py-2.5">
                    <select
                      defaultValue={row.primary}
                      onChange={markDirty}
                      className="rounded border border-[#dfe7ec] bg-white px-2 py-1 text-[9px] font-semibold text-[#435c6e]"
                    >
                      <option>Français</option>
                      <option>Swahili</option>
                      <option>Lingala</option>
                      <option>Tshiluba</option>
                    </select>
                  </td>
                  <td className="px-3 py-2.5">
                    <select
                      defaultValue={row.secondary}
                      onChange={markDirty}
                      className="rounded border border-[#dfe7ec] bg-white px-2 py-1 text-[9px] font-semibold text-[#435c6e]"
                    >
                      <option>Français</option>
                      <option>Swahili</option>
                      <option>Lingala</option>
                      <option>Tshiluba</option>
                      <option>—</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingCard>

      <SettingCard title="Progression des traductions" description="État global de la traduction de l'interface EduGoma">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { lang: "Français", pct: 100, color: "text-[#379d78]", bg: "bg-[#e5f7ef]" },
            { lang: "English", pct: 95, color: "text-[#4a86b7]", bg: "bg-[#e6f1fc]" },
            { lang: "Swahili", pct: 72, color: "text-[#b6732f]", bg: "bg-[#fef3e6]" },
          ].map((t) => (
            <div key={t.lang} className={`rounded-md p-3 ${t.bg}`}>
              <p className={`text-[11px] font-extrabold ${t.color}`}>{t.pct}%</p>
              <p className="mt-0.5 text-[9px] font-semibold text-[#526a7a]">{t.lang}</p>
              <div className="mt-2 h-1.5 rounded-full bg-white/60 overflow-hidden">
                <div className={`h-full rounded-full ${coverageColor(t.pct)}`} style={{ width: `${t.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2">
          <button onClick={markDirty} className="flex items-center gap-1.5 rounded-md border border-[#dfe7ec] px-3 py-2 text-[9px] font-bold text-[#607887] hover:bg-[#f5f8fa]">
            <Download size={11} /> Exporter les fichiers de traduction
          </button>
          <button onClick={markDirty} className="flex items-center gap-1.5 rounded-md bg-[#102d48] px-3 py-2 text-[9px] font-bold text-white hover:bg-[#193d5e]">
            <Upload size={11} /> Importer des traductions
          </button>
        </div>
      </SettingCard>
    </div>
  );
}

// ─── Main Settings page ───────────────────────────────────────────────────────

function ProfileTab({ markDirty }: { markDirty: () => void }) {
  const [firstName, setFirstName] = useState("Julien");
  const [lastName, setLastName] = useState("Makiese");
  const [email, setEmail] = useState("superadmin@edugoma.cd");
  const [phone, setPhone] = useState("+243 810 000 001");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactor, setTwoFactor] = useState(true);
  const [loginNotif, setLoginNotif] = useState(true);
  const [langPref, setLangPref] = useState("fr");
  const [theme, setTheme] = useState("light");

  const initials = (firstName[0] ?? "") + (lastName[0] ?? "");

  return (
    <div className="space-y-4">
      <SettingCard title="Informations personnelles" description="Vos informations de compte super administrateur">
        <div className="flex items-center gap-4 mb-5">
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#c9dce5] text-[18px] font-extrabold text-[#406079] shadow-sm">
              {initials}
            </div>
            <button
              onClick={markDirty}
              className="cursor-pointer absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#102d48] text-white shadow hover:bg-[#193d5e] transition-colors"
              title="Changer la photo"
            >
              <Camera size={11} />
            </button>
          </div>
          <div>
            <p className="text-[12px] font-bold text-[#23394e]">Dr. {firstName} {lastName}</p>
            <p className="text-[9px] text-[#8a97a4] mt-0.5">Super Administrateur · EduGoma</p>
            <button onClick={markDirty} className="mt-1.5 text-[9px] font-semibold text-[#3b7ab8] hover:underline">
              Changer la photo de profil
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Prénom" value={firstName} onChange={(v) => { setFirstName(v); markDirty(); }} />
          <Field label="Nom de famille" value={lastName} onChange={(v) => { setLastName(v); markDirty(); }} />
          <Field label="Adresse email" value={email} onChange={(v) => { setEmail(v); markDirty(); }} type="email" />
          <Field label="Numéro de téléphone" value={phone} onChange={(v) => { setPhone(v); markDirty(); }} />
        </div>
      </SettingCard>

      <SettingCard title="Changer le mot de passe" description="Utilisez un mot de passe fort que vous n'utilisez pas ailleurs">
        <div className="grid gap-4 sm:grid-cols-1 max-w-sm">
          <Field label="Mot de passe actuel" value={currentPassword} onChange={(v) => { setCurrentPassword(v); markDirty(); }} type="password" placeholder="••••••••••" />
          <Field label="Nouveau mot de passe" value={newPassword} onChange={(v) => { setNewPassword(v); markDirty(); }} type="password" placeholder="••••••••••" />
          <Field label="Confirmer le nouveau mot de passe" value={confirmPassword} onChange={(v) => { setConfirmPassword(v); markDirty(); }} type="password" placeholder="••••••••••" />
        </div>
        {newPassword && confirmPassword && newPassword !== confirmPassword && (
          <p className="mt-2 text-[9px] font-semibold text-[#c25e67]">⚠ Les mots de passe ne correspondent pas.</p>
        )}
        {newPassword && newPassword.length < 10 && (
          <p className="mt-2 text-[9px] font-semibold text-[#b6732f]">Le mot de passe doit contenir au moins 10 caractères.</p>
        )}
      </SettingCard>

      <SettingCard title="Sécurité du compte" description="Options de protection pour votre compte personnel">
        <ToggleRow
          title="Authentification à deux facteurs (2FA)"
          description="Vérifier votre identité à chaque connexion via une application d'authentification."
          enabled={twoFactor}
          onChange={() => { setTwoFactor(!twoFactor); markDirty(); }}
        />
        <ToggleRow
          title="Notification lors d'une nouvelle connexion"
          description="Recevoir un email d'alerte si une connexion est détectée depuis un nouvel appareil ou lieu."
          enabled={loginNotif}
          onChange={() => { setLoginNotif(!loginNotif); markDirty(); }}
        />
        {twoFactor && (
          <div className="mt-3 flex items-center gap-3 rounded-md border border-[#cde9dc] bg-[#effaf5] px-3 py-2.5">
            <CheckCircle2 size={14} className="text-[#3b9d7a] shrink-0" />
            <p className="text-[9px] text-[#2b8e6b]">Le 2FA est actif sur votre compte. Configuré via Google Authenticator.</p>
          </div>
        )}
      </SettingCard>

      <SettingCard title="Préférences personnelles" description="Ces préférences ne s'appliquent qu'à votre compte">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#8997a2]">Langue de l'interface</span>
            <select
              value={langPref}
              onChange={(e) => { setLangPref(e.target.value); markDirty(); }}
              className="mt-1.5 h-9 w-full rounded-md border border-[#dfe7ec] bg-white px-3 text-[10px] font-semibold text-[#536b7d]"
            >
              <option value="fr">🇫🇷 Français</option>
              <option value="en">🇬🇧 English</option>
              <option value="sw">🇨🇩 Swahili</option>
            </select>
          </label>
          <label className="block">
            <span className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#8997a2]">Thème</span>
            <select
              value={theme}
              onChange={(e) => { setTheme(e.target.value); markDirty(); }}
              className="mt-1.5 h-9 w-full rounded-md border border-[#dfe7ec] bg-white px-3 text-[10px] font-semibold text-[#536b7d]"
            >
              <option value="light">☀️ Clair</option>
              <option value="dark">🌙 Sombre</option>
              <option value="system">💻 Système</option>
            </select>
          </label>
        </div>
      </SettingCard>

      <SettingCard title="Zone de danger" description="Actions irréversibles sur votre compte">
        <div className="rounded-md border border-[#f0c8cb] bg-[#fdf2f2] px-4 py-3">
          <p className="text-[10px] font-bold text-[#7c3040]">Désactiver mon compte</p>
          <p className="mt-1 text-[9px] text-[#9a4050]">
            Désactiver votre compte super administrateur empêche toute connexion. Un autre super admin devra réactiver le compte.
          </p>
          <button className="mt-3 rounded-md border border-[#e0a0a8] px-3 py-2 text-[9px] font-bold text-[#c25e67] hover:bg-[#fce8e9]">
            Désactiver mon compte…
          </button>
        </div>
      </SettingCard>
    </div>
  );
}

function AuditTab({ markDirty: _markDirty }: { markDirty: () => void }) {
  const [filter, setFilter] = useState<"all" | "settings" | "security" | "team">("all");

  const entries = [
    { who: "Dr. Julien Makiese", initials: "JM", action: "a modifié le prix mensuel", detail: "10 $ → 15 $ par école", section: "Abonnements", time: "il y a 12 min", date: "23 sept. 2026 · 10:41", type: "settings" },
    { who: "Aline Kabuya", initials: "AK", action: "a activé le module « Paiements école »", detail: "Modules → Paiements école : OFF → ON", section: "Modules", time: "il y a 1h", date: "23 sept. 2026 · 09:52", type: "settings" },
    { who: "Dr. Julien Makiese", initials: "JM", action: "a invité un nouveau membre", detail: "support2@edugoma.cd · Rôle : Support", section: "Équipe", time: "il y a 3h", date: "23 sept. 2026 · 07:30", type: "team" },
    { who: "Patrick Okito", initials: "PO", action: "a mis à jour les CGU", detail: "Version 2.0 → 2.1", section: "Données & Conformité", time: "il y a 1j", date: "22 sept. 2026 · 14:15", type: "settings" },
    { who: "Dr. Julien Makiese", initials: "JM", action: "a régénéré la clé API", detail: "Ancienne clé révoquée · Nouvelle clé générée", section: "API & Webhooks", time: "il y a 2j", date: "21 sept. 2026 · 11:03", type: "security" },
    { who: "Aline Kabuya", initials: "AK", action: "a changé la couleur principale", detail: "#0e2a44 → #102d48", section: "Apparence", time: "il y a 3j", date: "20 sept. 2026 · 16:44", type: "settings" },
    { who: "Dr. Julien Makiese", initials: "JM", action: "a activé le mode maintenance", detail: "Maintenance : OFF → ON (durée : 45 min)", section: "Maintenance", time: "il y a 4j", date: "19 sept. 2026 · 02:00", type: "security" },
    { who: "Patrick Okito", initials: "PO", action: "a modifié la politique de mot de passe", detail: "Longueur min : 8 → 10 caractères", section: "Sécurité", time: "il y a 5j", date: "18 sept. 2026 · 09:20", type: "security" },
    { who: "Aline Kabuya", initials: "AK", action: "a activé Swahili pour les écoles", detail: "Langues → Swahili : désactivé → activé", section: "Langues", time: "il y a 6j", date: "17 sept. 2026 · 11:30", type: "settings" },
    { who: "Dr. Julien Makiese", initials: "JM", action: "a modifié le message de bienvenue", detail: "Apparence → Message de bienvenue mis à jour", section: "Apparence", time: "il y a 7j", date: "16 sept. 2026 · 15:08", type: "settings" },
  ];

  const filters: { id: typeof filter; label: string }[] = [
    { id: "all", label: "Tout" },
    { id: "settings", label: "Paramètres" },
    { id: "security", label: "Sécurité" },
    { id: "team", label: "Équipe" },
  ];

  const sectionColors: Record<string, string> = {
    Abonnements: "bg-[#e6f1fc] text-[#4a86b7]",
    Modules: "bg-[#f0edfd] text-[#6355b8]",
    Équipe: "bg-[#e5f7ef] text-[#379d78]",
    "Données & Conformité": "bg-[#fef3e6] text-[#b6732f]",
    "API & Webhooks": "bg-[#fdeced] text-[#c25e67]",
    Apparence: "bg-[#eef3f7] text-[#577a90]",
    Maintenance: "bg-[#fdeced] text-[#c25e67]",
    Sécurité: "bg-[#fdeced] text-[#c25e67]",
    Langues: "bg-[#e5f7ef] text-[#379d78]",
  };

  const filtered = filter === "all" ? entries : entries.filter((e) => e.type === filter);

  return (
    <div className="space-y-4">
      <SettingCard title="Journal des modifications des paramètres" description="Toutes les actions effectuées par l'équipe EduGoma sur la configuration de la plateforme">
        {/* Filtres */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-3 py-1 text-[9px] font-bold transition ${
                filter === f.id
                  ? "bg-[#102d48] text-white"
                  : "bg-[#f0f4f7] text-[#6a7e8d] hover:bg-[#e5eef3]"
              }`}
            >
              {f.label}
              <span className={`ml-1.5 rounded-full px-1 py-0.5 text-[8px] ${
                filter === f.id ? "bg-[#1e4264] text-[#a6d9ca]" : "bg-[#dce5eb] text-[#7a8e9a]"
              }`}>
                {f.id === "all" ? entries.length : entries.filter((e) => e.type === f.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Entries */}
        <div className="divide-y divide-[#edf1f4]">
          {filtered.map((entry, i) => (
            <div key={i} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
              {/* Avatar */}
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#d8e5ec] text-[8px] font-extrabold text-[#42647c] mt-0.5">
                {entry.initials}
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold text-[#33485d]">{entry.who}</span>
                  <span className="text-[10px] text-[#687585]">{entry.action}</span>
                  <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${sectionColors[entry.section] ?? "bg-[#eef2f5] text-[#71808d]"}`}>
                    {entry.section}
                  </span>
                </div>
                <p className="mt-0.5 text-[9px] text-[#8a97a4] font-mono">{entry.detail}</p>
                <p className="mt-0.5 text-[8px] text-[#adb8c0]">{entry.date}</p>
              </div>
              {/* Time */}
              <span className="shrink-0 text-[8px] text-[#b0bcc7] whitespace-nowrap">{entry.time}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-[#edf1f4] pt-3">
          <p className="text-[9px] text-[#8a97a4]">{filtered.length} entrée{filtered.length > 1 ? "s" : ""} affichée{filtered.length > 1 ? "s" : ""}</p>
          <button className="flex items-center gap-1.5 rounded-md border border-[#dfe7ec] px-3 py-2 text-[9px] font-bold text-[#607887] hover:bg-[#f5f8fa]">
            <Download size={11} /> Exporter le journal (CSV)
          </button>
        </div>
      </SettingCard>

      <SettingCard title="Statistiques du journal" description="Résumé de l'activité des 30 derniers jours">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Modifications totales", value: "47", sub: "30 derniers jours", color: "text-[#4a86b7]", bg: "bg-[#e6f1fc]" },
            { label: "Membres actifs", value: "3", sub: "ont modifié des paramètres", color: "text-[#379d78]", bg: "bg-[#e5f7ef]" },
            { label: "Actions sécurité", value: "8", sub: "clés API, sessions, 2FA", color: "text-[#c25e67]", bg: "bg-[#fdeced]" },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-md p-3 ${stat.bg}`}>
              <p className={`text-[20px] font-extrabold tracking-tight ${stat.color}`}>{stat.value}</p>
              <p className="text-[9px] font-bold text-[#526a7a] mt-0.5">{stat.label}</p>
              <p className="text-[8px] text-[#7a8e9a] mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>
      </SettingCard>
    </div>
  );
}

const tabComponents: Record<TabId, React.ComponentType<{ markDirty: () => void }>> = {
  general: GeneralTab,
  appearance: AppearanceTab,
  modules: ModulesTab,
  languages: LanguagesTab,
  pricing: PricingTab,
  emails: EmailsTab,
  notifications: NotificationsTab,
  security: SecurityTab,
  profile: ProfileTab,
  team: TeamTab,
  integrations: IntegrationsTab,
  api: ApiTab,
  data: DataTab,
  audit: AuditTab,
  maintenance: MaintenanceTab,
};

export default function Settings() {
  const [tab, setTab] = useState<TabId>("general");
  const [dirty, setDirty] = useState(false);
  const [notice, setNotice] = useState("");

  const markDirty = () => {
    setDirty(true);
    setNotice("");
  };

  const save = () => {
    setDirty(false);
    setNotice("Les modifications ont été enregistrées avec succès.");
  };

  const ActiveTab = tabComponents[tab];

  return (
    <>
      {/* Page header */}
      <div className="mb-5">
        <div className="mb-2 flex items-center gap-1.5 text-[9px] text-[#81909d]">
          <span className="rounded bg-[#e8f1f7] px-2 py-1 font-bold uppercase tracking-[0.07em] text-[#436b85]">
            ▦ EDUGOMA SAAS › PLATFORM CONTROL CENTER
          </span>
          <span>•</span>
          <span>Administration</span>
        </div>
        <h1 className="text-[23px] font-bold tracking-[-0.04em] text-[#172f45]">Paramètres</h1>
        <p className="mt-1 text-[11px] text-[#778894]">Configuration générale de la plateforme EduGoma</p>
      </div>

      {/* Success banner */}
      {notice && (
        <div className="mb-3 flex items-center justify-between rounded-md border border-[#cde9dc] bg-[#effaf5] px-3 py-2 text-[10px] font-semibold text-[#2b8e6b]">
          {notice}
          <button onClick={() => setNotice("")}><X size={13} /></button>
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[235px_minmax(0,1fr)]">
        {/* Sidebar nav */}
        <nav className="rounded-md border border-[#e4eaf0] bg-white p-2 shadow-[0_2px_7px_rgba(33,60,84,0.025)] lg:sticky lg:top-4">
          {tabGroups.map((grp) => (
            <div key={grp.group} className="mb-3 last:mb-0">
              <p className="mb-1 px-3 text-[8px] font-bold uppercase tracking-[0.1em] text-[#9aaab5]">{grp.group}</p>
              {grp.items.map((item) => {
                const Icon = item.icon;
                const active = tab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setTab(item.id); setNotice(""); }}
                    className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left transition ${
                      active ? "bg-[#102d48] text-white" : "text-[#617786] hover:bg-[#f3f7f9]"
                    }`}
                  >
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                      active ? "bg-[#214863] text-[#a6d9ca]" : "bg-[#eef3f7] text-[#648196]"
                    }`}>
                      <Icon size={12} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[10px] font-bold">{item.label}</span>
                      <span className={`mt-0.5 block truncate text-[8px] ${active ? "text-[#c0d1dc]" : "text-[#96a3ac]"}`}>
                        {item.description}
                      </span>
                    </span>
                    <ChevronRight size={12} className="shrink-0 opacity-50" />
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Tab content */}
        <div className="min-w-0">
          <ActiveTab markDirty={markDirty} />

          {dirty && (
            <div className="sticky bottom-0 z-20 mt-4 flex items-center justify-between gap-3 rounded-md border border-[#dfe8ec] bg-white/95 px-4 py-3 shadow-[0_-4px_14px_rgba(33,60,84,0.06)] backdrop-blur-sm">
              <span className="text-[9px] font-semibold text-[#ba7938]">Modifications non enregistrées</span>
              <button
                onClick={save}
                className="flex items-center gap-2 rounded-md bg-[#102d48] px-3 py-2 text-[9px] font-bold text-white hover:bg-[#193d5e]"
              >
                <Save size={12} /> Enregistrer les modifications
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
