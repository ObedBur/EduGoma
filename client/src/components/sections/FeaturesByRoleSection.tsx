"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Building2,
  Smartphone,
  Users,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  Bell,
  Check,
  ArrowRight,
  Wifi,
  Sparkles,
  QrCode,
  Printer,
  FileCheck,
  Award,
  CheckCheck,
  ExternalLink,
} from "lucide-react";

type RoleId = "direction" | "administration" | "enseignants" | "parents";

interface RoleData {
  id: RoleId;
  label: string;
  roleBadge: string;
  badgeColor: string;
  icon: React.ElementType;
  headline: string;
  subheadline: string;
  description: string;
  keyStats: { value: string; label: string; sub?: string }[];
  bulletPoints: { title: string; text: string }[];
  actionLabel: string;
}

const ROLES: RoleData[] = [
  {
    id: "direction",
    label: "Direction & Préfets",
    roleBadge: "Délibération & Conformité EPST",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    icon: GraduationCap,
    headline: "Procès-verbaux de délibération certifiés et scellés",
    subheadline: "Pour le Préfet des Études, le Promoteur et la Direction de discipline",
    description:
      "Finies les contestations et les suspicions de manipulation de notes. EduGoma génère le procès-verbal officiel de délibération avec application stricte des pondérations nationales, prêt à être signé et transmis à la Division Provinciale.",
    keyStats: [
      { value: "100%", label: "Conformité EPST", sub: "Normes nationales RDC" },
      { value: "< 2 min", label: "Délibération / classe", sub: "Calculs automatiques" },
      { value: "0 Fraude", label: "Cotes verrouillées", sub: "Archivage scellé" },
    ],
    bulletPoints: [
      {
        title: "Procès-verbal officiel avec sceau d'établissement",
        text: "Édition du PV officiel de délibération trimestrielle conforme aux exigences de l'inspection.",
      },
      {
        title: "Verrouillage cryptographique après délibération",
        text: "Une fois le palmarès validé par le jury, plus aucune cote ne peut être modifiée unilatéralement.",
      },
      {
        title: "Tableaux de synthèse des réussites par option",
        text: "Visibilité immédiate sur les pourcentages par section (Scientifique, Littéraire, Pédagogie, Commerciale).",
      },
      {
        title: "Décisions de jury transparentes",
        text: "Application automatique des règles de repêchage et mentions officielles (G.D, D, Sat, Ajourné).",
      },
    ],
    actionLabel: "Voir le modèle de délibération",
  },
  {
    id: "administration",
    label: "Secrétariat & Direction",
    roleBadge: "Spécimen Officiel A4",
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    icon: Building2,
    headline: "Le véritable bulletin scolaire officiel congolais, prêt à imprimer",
    subheadline: "Pour le Secrétaire Général, l'Appariteur et le Comptable",
    description:
      "Plus de fiches à découper ou de modèles approximatifs. EduGoma produit le bulletin trimestriel national format A4 avec matricule unique, grille des cours conforme au programme national et QR Code de certification anti-falsification.",
    keyStats: [
      { value: "Format A4", label: "Spécimen National", sub: "Mise en page ministérielle" },
      { value: "QR Code", label: "Authentification", sub: "Anti-falsification direct" },
      { value: "1 Clic", label: "Impression par classe", sub: "Tous les élèves d'un coup" },
    ],
    bulletPoints: [
      {
        title: "Grille officielle des matières et maxima",
        text: "Chaque cours est pondéré selon les maxima officiels du programme national de l'EPST.",
      },
      {
        title: "QR Code d'authentification individuel",
        text: "Tout inspecteur ou parent peut scanner le bulletin pour vérifier son authenticité en ligne.",
      },
      {
        title: "Impression en masse sans décalage de marges",
        text: "Fichier PDF haute définition optimisé pour les imprimantes locales de Goma sans gaspillage de papier.",
      },
      {
        title: "Matricule unique d'identification scolaire",
        text: "Chaque élève conserve son code unique d'identification d'une année à l'autre.",
      },
    ],
    actionLabel: "Télécharger un spécimen A4",
  },
  {
    id: "enseignants",
    label: "Corps Enseignant",
    roleBadge: "Carnet de Cotes Mobile",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icon: Smartphone,
    headline: "Carnet de notes mobile : saisissez en 2 minutes, zéro calcul manuel",
    subheadline: "Pour les Professeurs d'Humanités et Maîtres de l'Éducation de Base",
    description:
      "Encodez vos interrogations et devoirs sur votre smartphone en marchant ou en salle des professeurs. EduGoma convertit les maxima, applique les coefficients et calcule les pourcentages instantanément, sans calculatrice.",
    keyStats: [
      { value: "0 Calcul", label: "Calcul manuel", sub: "Pourcentages automatiques" },
      { value: "Hors-ligne", label: "Mode local 100%", sub: "Fonctionne sans crédit data" },
      { value: "30 sec", label: "Appel de classe", sub: "Pointage en un geste" },
    ],
    bulletPoints: [
      {
        title: "Saisie fluide sur n'importe quel smartphone Android",
        text: "Conçu pour les téléphones simples et les connexions instables de Goma.",
      },
      {
        title: "Calculs automatiques immédiats",
        text: "Entrez la note brute (ex: 18.5/20), EduGoma calcule la moyenne et le rang sans risque d'erreur d'addition.",
      },
      {
        title: "Sauvegarde locale sécurisée",
        text: "Vos notes restent sur votre téléphone même si le réseau coupe, et se synchronisent dès que vous captez.",
      },
      {
        title: "Pointage rapide des présences",
        text: "Marquez les présents, retards et motifs d'absence sans perdre le fil de votre leçon.",
      },
    ],
    actionLabel: "Tester le carnet enseignant",
  },
  {
    id: "parents",
    label: "Parents & Familles",
    roleBadge: "Transparence & Sérénité",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    icon: Users,
    headline: "Notification instantanée et reçu officiel anti-renvoi",
    subheadline: "Pour les Tuteurs, Parents d'élèves et Écoliers",
    description:
      "Recevez les résultats scolaires dès leur publication directement sur votre téléphone, ainsi que le justificatif officiel de paiement des frais scolaires pour en finir définitivement avec les renvois d'élèves par erreur de caisse.",
    keyStats: [
      { value: "WhatsApp/SMS", label: "Alerte directe", sub: "Résultats dès délibération" },
      { value: "0 Renvoi", label: "Par erreur de caisse", sub: "Reçu certifié sur mobile" },
      { value: "1 Clic", label: "Bulletin téléchargeable", sub: "Consultable à tout moment" },
    ],
    bulletPoints: [
      {
        title: "Notification instantanée du bulletin publié",
        text: "Le parent reçoit le résumé (moyenne, rang, mention) sur WhatsApp ou SMS avec un lien sécurisé.",
      },
      {
        title: "Reçu d'encaissement officiel avec mention 'En Règle'",
        text: "Présentez le reçu numérique à la barrière de l'école pour prouver le paiement des frais en cas de contrôle.",
      },
      {
        title: "Suivi des présences et de la discipline",
        text: "Soyez prévenu immédiatement en cas d'absence injustifiée ou de retard répété de votre enfant.",
      },
      {
        title: "Fini les bulletins perdus par les élèves",
        text: "L'historique complet des bulletins de toutes les années reste accessible à vie sur l'espace familial.",
      },
    ],
    actionLabel: "Voir l'espace Famille",
  },
];

export function FeaturesByRoleSection() {
  const [activeRole, setActiveRole] = useState<RoleId>("direction");

  const currentRole = ROLES.find((r) => r.id === activeRole) || ROLES[0];

  return (
    <section
      id="roles"
      className="scroll-mt-28 relative overflow-hidden bg-slate-900 py-20 text-white md:py-28"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.20),rgba(255,255,255,0))]" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-950 to-transparent" />
      <div className="pointer-events-none absolute left-0 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/10 blur-[100px]" />
      <div className="pointer-events-none absolute right-0 top-2/3 h-96 w-96 translate-x-1/2 rounded-full bg-cyan-500/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-bold text-blue-300 shadow-sm backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-[11px] uppercase tracking-wider">
              Une Plateforme • Des Livrables Concrets
            </span>
          </div>

          <h2 className="mb-4 text-2xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl lg:leading-[1.15]">
            Des documents officiels et des outils réels,{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
              adaptés à chaque fonction.
            </span>
          </h2>

          <p className="text-sm text-slate-300 sm:text-lg leading-relaxed">
            Pas de faux tableaux de bord génériques : découvrez les documents authentiques et les interfaces concrètes utilisés au quotidien par chaque acteur de l'école.
          </p>
        </div>

        {/* Segmented Persona Selector Tabs */}
        <div className="mb-10 sm:mb-12 flex justify-center">
          <div
            role="tablist"
            aria-label="Sélectionnez un profil d'utilisateur"
            className="grid w-full max-w-4xl grid-cols-2 gap-1.5 sm:gap-3 rounded-2xl border border-white/10 bg-slate-800/80 p-1.5 sm:p-2 backdrop-blur-xl sm:grid-cols-4"
          >
            {ROLES.map((role) => {
              const Icon = role.icon;
              const isActive = role.id === activeRole;
              return (
                <button
                  key={role.id}
                  role="tab"
                  id={`tab-${role.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${role.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveRole(role.id)}
                  className={`group relative flex items-center justify-center gap-1.5 sm:gap-2.5 rounded-xl px-2 sm:px-4 py-2.5 sm:py-4 text-[11px] sm:text-xs md:text-sm font-bold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30 ring-1 ring-white/20"
                      : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`h-3.5 w-3.5 sm:h-5 sm:w-5 shrink-0 transition-transform duration-300 ${
                      isActive ? "scale-110 text-cyan-200" : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  />
                  <span className="truncate">{role.label}</span>

                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 h-1 w-6 -translate-x-1/2 rounded-full bg-cyan-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Active Persona Interactive Display */}
        <div
          role="tabpanel"
          id={`panel-${currentRole.id}`}
          aria-labelledby={`tab-${currentRole.id}`}
          className="rounded-3xl border border-white/10 bg-slate-800/40 p-4 sm:p-8 lg:p-12 shadow-2xl backdrop-blur-xl"
        >
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-14">
            
            {/* Left Column: Role Details & Value Points */}
            <div className="flex flex-col lg:col-span-5">
              
              {/* Badge & Subheadline */}
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-bold ${currentRole.badgeColor}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                  {currentRole.roleBadge}
                </span>
                <span className="text-[11px] sm:text-xs font-semibold text-slate-400">
                  {currentRole.subheadline}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="mb-3 sm:mb-4 text-xl sm:text-3xl lg:text-[2rem] font-black tracking-tight text-white lg:leading-tight">
                {currentRole.headline}
              </h3>

              <p className="mb-6 sm:mb-8 text-xs sm:text-base leading-relaxed text-slate-300">
                {currentRole.description}
              </p>

              {/* 3 Metric Pills */}
              <div className="mb-6 sm:mb-8 grid grid-cols-3 gap-1.5 rounded-2xl border border-white/10 bg-slate-900/60 p-2.5 sm:gap-3 sm:p-4">
                {currentRole.keyStats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-base font-black tracking-tight text-white sm:text-2xl">
                      {stat.value}
                    </div>
                    <div className="text-[10px] font-bold text-cyan-300 sm:text-xs truncate">
                      {stat.label}
                    </div>
                    {stat.sub && (
                      <div className="text-[8px] text-slate-400 truncate sm:text-[10px]">
                        {stat.sub}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Detailed Feature Checklist */}
              <ul className="mb-6 sm:mb-8 space-y-3 sm:space-y-3.5">
                {currentRole.bulletPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 sm:gap-3">
                    <div className="mt-0.5 flex h-4 w-4 sm:h-5 sm:w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/40">
                      <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white sm:text-sm">
                        {pt.title}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                        {pt.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* CTA Action */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-4">
                <Link
                  href="#cta"
                  className="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/35 active:scale-[0.98] sm:text-sm"
                >
                  <span>Demander un accès d&apos;essai</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Conforme normes nationales RDC</span>
                </div>
              </div>
            </div>

            {/* Right Column: Tailored, Realistic School Document Specimen */}
            <div className="lg:col-span-7">
              {activeRole === "direction" && <DirectionDeliberationSpecimen />}
              {activeRole === "administration" && <AdminBulletinSpecimen />}
              {activeRole === "enseignants" && <TeacherGradingSpecimen />}
              {activeRole === "parents" && <ParentNotificationSpecimen />}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

/* =========================================================================
   SPÉCIMEN 1: DIRECTION — PROCÈS-VERBAL OFFICIEL DE DÉLIBÉRATION AVEC SCEAU
   ========================================================================= */
function DirectionDeliberationSpecimen() {
  return (
    <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-amber-200/50 bg-[#faf9f5] p-3.5 sm:p-7 text-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
      
      {/* Official Header Border */}
      <div className="text-center border-b-2 border-slate-900/80 pb-3 sm:pb-4 mb-3 sm:mb-4">
        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-700">
          RÉPUBLIQUE DÉMOCRATIQUE DU CONGO
        </p>
        <p className="text-[8px] sm:text-[9px] font-bold text-slate-600">
          MINISTÈRE DE L&apos;ENSEIGNEMENT PRIMAIRE, SECONDAIRE ET TECHNIQUE (EPST)
        </p>
        <p className="text-[7px] sm:text-[8px] font-medium text-slate-500">
          PROVINCE DU NORD-KIVU • VILLE DE GOMA • SOUS-DIVISION GOMA 1
        </p>
        <div className="my-1.5 sm:my-2 flex items-center justify-center gap-2">
          <span className="h-0.5 w-8 sm:w-12 bg-slate-900" />
          <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-900" />
          <span className="h-0.5 w-8 sm:w-12 bg-slate-900" />
        </div>
        <h4 className="text-xs sm:text-base font-black tracking-wide text-blue-950 uppercase">
          Procès-Verbal Officiel de Délibération
        </h4>
        <p className="text-[9px] sm:text-[10px] font-semibold text-slate-600">
          Session du Premier Trimestre • Année Scolaire 2024–2025
        </p>
      </div>

      {/* Class & Deliberation Metadata */}
      <div className="mb-3 sm:mb-4 grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 rounded-lg bg-amber-50/70 border border-amber-200/60 p-2 sm:p-2.5 text-[10px] sm:text-[11px]">
        <div>
          <span className="font-bold text-slate-700">Établissement :</span> Institut de Goma
        </div>
        <div>
          <span className="font-bold text-slate-700">Option :</span> 3ème Scientifique (Math-Phys)
        </div>
        <div>
          <span className="font-bold text-slate-700">Effectif inscrit :</span> 42 élèves
        </div>
        <div>
          <span className="font-bold text-slate-700">Taux de réussite :</span>{" "}
          <span className="font-black text-emerald-800">92.8% (39 admis)</span>
        </div>
      </div>

      {/* Excerpt of Deliberation Official Results */}
      <div className="mb-3 sm:mb-4 overflow-x-auto w-full max-w-full rounded-lg border border-slate-300 bg-white">
        <table className="w-full min-w-[300px] sm:min-w-0 text-left text-[10px] sm:text-[11px]">
          <thead className="border-b border-slate-300 bg-slate-100 text-[8px] sm:text-[9px] uppercase font-black text-slate-700">
            <tr>
              <th className="px-2 sm:px-2.5 py-1.5">Rang</th>
              <th className="px-2 sm:px-2.5 py-1.5">Nom & Postnom</th>
              <th className="px-2 sm:px-2.5 py-1.5">Moyenne</th>
              <th className="px-2 sm:px-2.5 py-1.5 text-right">Décision du Jury</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-medium">
            <tr>
              <td className="px-2 sm:px-2.5 py-1.5 font-bold text-blue-900">1ère</td>
              <td className="px-2 sm:px-2.5 py-1.5 font-bold text-slate-900 whitespace-nowrap">Kavira Masika Divine</td>
              <td className="px-2 sm:px-2.5 py-1.5 font-bold text-emerald-700">89.2%</td>
              <td className="px-2 sm:px-2.5 py-1.5 text-right whitespace-nowrap">
                <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[8px] sm:text-[9px] font-bold text-emerald-800">
                  Grande Distinction
                </span>
              </td>
            </tr>
            <tr>
              <td className="px-2 sm:px-2.5 py-1.5 font-bold text-blue-900">2ème</td>
              <td className="px-2 sm:px-2.5 py-1.5 font-bold text-slate-900 whitespace-nowrap">Amani Kasereka Joel</td>
              <td className="px-2 sm:px-2.5 py-1.5 font-bold text-emerald-700">82.5%</td>
              <td className="px-2 sm:px-2.5 py-1.5 text-right whitespace-nowrap">
                <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[8px] sm:text-[9px] font-bold text-emerald-800">
                  Distinction
                </span>
              </td>
            </tr>
            <tr>
              <td className="px-2 sm:px-2.5 py-1.5 font-bold text-blue-900">3ème</td>
              <td className="px-2 sm:px-2.5 py-1.5 font-bold text-slate-900 whitespace-nowrap">Bahati Mugisho Alain</td>
              <td className="px-2 sm:px-2.5 py-1.5 font-bold text-blue-700">74.8%</td>
              <td className="px-2 sm:px-2.5 py-1.5 text-right whitespace-nowrap">
                <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[8px] sm:text-[9px] font-bold text-blue-800">
                  Satisfaction
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Official Republic Stamp & Signatures */}
      <div className="relative mt-4 sm:mt-5 flex items-end justify-between border-t border-slate-300 pt-3">
        
        {/* Préfet Signature */}
        <div>
          <p className="text-[9px] sm:text-[10px] font-bold text-slate-700">Le Secrétaire</p>
          <div className="mt-0.5 font-serif text-[11px] sm:text-xs italic text-slate-500">M. Paluku B.</div>
        </div>

        {/* Authentic Circular Blue Ink Stamp - responsive sizing */}
        <div className="relative flex h-16 w-16 sm:h-22 sm:w-22 items-center justify-center rounded-full border-2 border-dashed border-blue-700/80 p-0.5 text-center text-blue-800 shadow-xs rotate-[-6deg]">
          <div className="h-full w-full rounded-full border border-blue-700/60 flex flex-col items-center justify-center p-0.5">
            <span className="text-[4.5px] sm:text-[6px] font-black uppercase tracking-tighter">
              RDC • EPST
            </span>
            <span className="my-0.5 text-[5.5px] sm:text-[7px] font-black text-blue-950 uppercase leading-none">
              INST. GOMA
            </span>
            <span className="text-[4px] sm:text-[5.5px] font-bold uppercase tracking-wider text-emerald-700">
              ★ DÉLIBÉRÉ ★
            </span>
            <span className="text-[4px] sm:text-[5px] text-blue-700">GOMA (N-K)</span>
          </div>
        </div>

        {/* Préfet Approval */}
        <div className="text-right">
          <p className="text-[9px] sm:text-[10px] font-bold text-slate-700">Le Préfet</p>
          <div className="mt-0.5 font-serif text-[11px] sm:text-xs italic text-blue-900 font-bold">
            Ir. Kambale V.
          </div>
        </div>
      </div>

      {/* Anti-tampering Cryptographic Banner */}
      <div className="mt-3 sm:mt-4 flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-300/80 px-2.5 sm:px-3 py-1.5 text-[9px] sm:text-[10px] font-bold text-emerald-800">
        <span className="inline-flex items-center gap-1">
          <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">Procès-verbal scellé & inaltérable (EPST)</span>
        </span>
        <span className="font-mono text-[8px] sm:text-[9px] text-emerald-700 shrink-0">ID: EDG-PV-24</span>
      </div>

    </div>
  );
}

/* =========================================================================
   SPÉCIMEN 2: ADMINISTRATION — VRAI BULLETIN SCOLAIRE OFFICIEL A4 (RDC)
   ========================================================================= */
function AdminBulletinSpecimen() {
  return (
    <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-2xl border-2 border-slate-300 bg-white p-3.5 sm:p-7 text-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
      
      {/* Top DRC Flag Colors Ribbon */}
      <div className="absolute top-0 left-0 right-0 h-1.5 flex">
        <div className="w-[60%] bg-[#007fff]" />
        <div className="w-[20%] bg-[#f7d618]" />
        <div className="w-[20%] bg-[#ce1126]" />
      </div>

      {/* Official School & National Header */}
      <div className="flex items-start justify-between border-b border-slate-200 pb-2.5 sm:pb-3 mb-2.5 sm:mb-3">
        <div>
          <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-wider text-slate-500">
            RÉPUBLIQUE DÉMOCRATIQUE DU CONGO • EPST
          </span>
          <h4 className="text-xs sm:text-base font-black tracking-tight text-slate-900">
            BULLETIN DU PREMIER TRIMESTRE
          </h4>
          <p className="text-[9px] sm:text-[10px] font-bold text-blue-700">
            INSTITUT DE GOMA • Code : 540129
          </p>
        </div>

        {/* Real Dynamic QR Code Badge */}
        <div className="flex flex-col items-center shrink-0">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg border border-slate-300 bg-slate-50 p-1 shadow-xs">
            <QrCode className="h-8 w-8 sm:h-10 sm:w-10 text-slate-800" />
          </div>
          <span className="mt-0.5 text-[7px] sm:text-[8px] font-mono text-slate-500">Vérifié EPST</span>
        </div>
      </div>

      {/* Student Identity Box */}
      <div className="mb-2.5 sm:mb-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 rounded-lg bg-slate-50 border border-slate-200 p-2 sm:p-2.5 text-[9px] sm:text-[10px]">
        <div>
          <span className="text-slate-500">Élève :</span>{" "}
          <strong className="text-slate-900">KAVIRA MASIKA DIVINE</strong>
        </div>
        <div>
          <span className="text-slate-500">Matricule :</span>{" "}
          <strong className="font-mono text-blue-700">EDG-2024-8842</strong>
        </div>
        <div>
          <span className="text-slate-500">Option :</span> 3ème Scientifique
        </div>
        <div>
          <span className="text-slate-500">Année :</span> 2024–2025 • Section A
        </div>
      </div>

      {/* Congolese Official Subjects & Maxima Grid with overflow protection */}
      <div className="mb-3 overflow-x-auto w-full max-w-full rounded-lg border border-slate-200">
        <table className="w-full min-w-[300px] sm:min-w-0 text-left text-[9px] sm:text-[10px]">
          <thead className="border-b border-slate-200 bg-slate-100 text-[8px] sm:text-[9px] uppercase font-bold text-slate-600">
            <tr>
              <th className="px-2 sm:px-2.5 py-1">Branche</th>
              <th className="px-1.5 py-1 text-center">Max</th>
              <th className="px-1.5 py-1 text-center">1ère P.</th>
              <th className="px-1.5 py-1 text-center">2ème P.</th>
              <th className="px-1.5 py-1 text-center">Examen</th>
              <th className="px-2 py-1 text-right">Total T1</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            <tr>
              <td className="px-2 sm:px-2.5 py-1 font-bold text-slate-900 whitespace-nowrap">Mathématiques</td>
              <td className="px-1.5 py-1 text-center text-slate-400">40</td>
              <td className="px-1.5 py-1 text-center">18.5</td>
              <td className="px-1.5 py-1 text-center">19.0</td>
              <td className="px-1.5 py-1 text-center">36.5</td>
              <td className="px-2 py-1 text-right font-bold text-emerald-700 whitespace-nowrap">74.0 / 80</td>
            </tr>
            <tr>
              <td className="px-2 sm:px-2.5 py-1 font-bold text-slate-900 whitespace-nowrap">Physique & Chimie</td>
              <td className="px-1.5 py-1 text-center text-slate-400">30</td>
              <td className="px-1.5 py-1 text-center">14.0</td>
              <td className="px-1.5 py-1 text-center">13.5</td>
              <td className="px-1.5 py-1 text-center">27.0</td>
              <td className="px-2 py-1 text-right font-bold text-emerald-700 whitespace-nowrap">54.5 / 60</td>
            </tr>
            <tr>
              <td className="px-2 sm:px-2.5 py-1 font-bold text-slate-900 whitespace-nowrap">Français & Litt.</td>
              <td className="px-1.5 py-1 text-center text-slate-400">30</td>
              <td className="px-1.5 py-1 text-center">13.0</td>
              <td className="px-1.5 py-1 text-center">14.0</td>
              <td className="px-1.5 py-1 text-center">26.0</td>
              <td className="px-2 py-1 text-right font-bold text-emerald-700 whitespace-nowrap">53.0 / 60</td>
            </tr>
            <tr>
              <td className="px-2 sm:px-2.5 py-1 font-bold text-slate-900 whitespace-nowrap">Anglais</td>
              <td className="px-1.5 py-1 text-center text-slate-400">20</td>
              <td className="px-1.5 py-1 text-center">9.5</td>
              <td className="px-1.5 py-1 text-center">9.0</td>
              <td className="px-1.5 py-1 text-center">18.0</td>
              <td className="px-2 py-1 text-right font-bold text-emerald-700 whitespace-nowrap">36.5 / 40</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Official Summary Band */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 rounded-xl bg-blue-900 p-2 sm:p-2.5 text-center text-white">
        <div>
          <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-blue-200">Pourcentage</span>
          <div className="text-sm sm:text-base font-black text-cyan-300">89.2%</div>
        </div>
        <div>
          <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-blue-200">Rang Officiel</span>
          <div className="text-sm sm:text-base font-black text-white">1ère / 42</div>
        </div>
        <div>
          <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-blue-200">Mention</span>
          <div className="text-[10px] sm:text-xs font-black text-amber-300">Grande Distinction</div>
        </div>
      </div>

      {/* Batch Print Bar */}
      <div className="mt-2.5 sm:mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 pt-2 text-[9px] sm:text-[10px] text-slate-500">
        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
          <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
          Format National A4 certifié • Prêt à imprimer
        </span>
        <span className="inline-flex items-center gap-1 font-bold text-blue-700 cursor-pointer hover:underline">
          <Printer className="h-3 w-3" /> Lot classe entière (42 PDF)
        </span>
      </div>

    </div>
  );
}

/* =========================================================================
   SPÉCIMEN 3: ENSEIGNANT — CARNET DE COTES & SAISIE RAPIDE MOBILE
   ========================================================================= */
function TeacherGradingSpecimen() {
  return (
    <div className="relative mx-auto w-full max-w-[340px] rounded-[2.8rem] border-[7px] border-slate-800 bg-slate-950 p-3 shadow-2xl ring-1 ring-white/20">
      
      {/* Smartphone Notch */}
      <div className="absolute left-1/2 top-3 h-4 w-28 -translate-x-1/2 rounded-full bg-slate-800" />

      {/* Screen Area */}
      <div className="mt-5 rounded-[2rem] bg-slate-900 p-4 space-y-3.5 border border-slate-800 text-white">
        
        {/* Mobile Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Prof. Kambale • Mathématiques
            </span>
            <h5 className="text-xs font-black text-white">Classe : 3ème Sc. A (42 élèves)</h5>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300">
            <Wifi className="h-2.5 w-2.5 text-emerald-400" />
            <span>Mode Hors-Ligne</span>
          </div>
        </div>

        {/* Evaluation Type Switcher */}
        <div className="flex gap-1.5 rounded-lg bg-slate-950 p-1 text-[10px] font-bold">
          <span className="flex-1 rounded-md bg-emerald-600 py-1 text-center text-white shadow">
            Interro 2 (/20)
          </span>
          <span className="flex-1 py-1 text-center text-slate-400">
            Devoir (/20)
          </span>
          <span className="flex-1 py-1 text-center text-slate-400">
            Examen (/40)
          </span>
        </div>

        {/* Rapid Grade Input Rows */}
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-2.5">
            <div>
              <div className="text-xs font-bold text-white">1. Kavira Masika Divine</div>
              <span className="text-[9px] text-emerald-400 font-semibold">
                Auto : 92.5% • Rang : 1ère
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="rounded-lg bg-emerald-950/80 border border-emerald-500/50 px-2.5 py-1 font-mono text-xs font-black text-emerald-300">
                18.5
              </span>
              <span className="text-[10px] text-slate-500">/20</span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-2.5">
            <div>
              <div className="text-xs font-bold text-white">2. Bahati Mugisho Alain</div>
              <span className="text-[9px] text-blue-400 font-semibold">
                Auto : 75.0% • Rang : 3ème
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1 font-mono text-xs font-black text-white">
                15.0
              </span>
              <span className="text-[10px] text-slate-500">/20</span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-2.5">
            <div>
              <div className="text-xs font-bold text-white">3. Amani Kasereka Joel</div>
              <span className="text-[9px] text-emerald-400 font-semibold">
                Auto : 82.5% • Rang : 2ème
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1 font-mono text-xs font-black text-white">
                16.5
              </span>
              <span className="text-[10px] text-slate-500">/20</span>
            </div>
          </div>
        </div>

        {/* Quick Action Bottom Button */}
        <div className="rounded-xl bg-emerald-600 p-2.5 text-center text-xs font-bold text-white shadow-md cursor-pointer hover:bg-emerald-500 transition flex items-center justify-center gap-1.5">
          <CheckCheck className="h-4 w-4" />
          <span>42 / 42 Notes Enregistrées</span>
        </div>

        <p className="text-center text-[9px] text-slate-400">
          Zéro calculatrice • Moyennes & classements calculés instantanément
        </p>

      </div>
    </div>
  );
}

/* =========================================================================
   SPÉCIMEN 4: PARENTS — NOTIFICATION WHATSAPP/SMS & REÇU OFFICIEL DE CAISSE
   ========================================================================= */
function ParentNotificationSpecimen() {
  return (
    <div className="relative mx-auto w-full max-w-md space-y-4">
      
      {/* 1. Official WhatsApp Notification Bubble */}
      <div className="overflow-hidden rounded-2xl border border-emerald-500/30 bg-slate-950 p-4 shadow-xl text-white">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-xs">
              EG
            </div>
            <div>
              <div className="flex items-center gap-1 text-xs font-bold text-white">
                <span>Institut de Goma (Officiel)</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </div>
              <span className="text-[9px] text-slate-400">Aujourd&apos;hui à 11:42</span>
            </div>
          </div>
          <span className="rounded bg-emerald-900/60 border border-emerald-500/40 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300">
            Alerte SMS & WhatsApp
          </span>
        </div>

        {/* Message Bubble Content */}
        <div className="rounded-xl bg-[#0f241a] border border-emerald-600/30 p-3 text-xs leading-relaxed text-emerald-50">
          <p className="font-bold text-emerald-300 mb-1">
            📢 Publication des Bulletins du 1er Trimestre
          </p>
          <p className="text-[11px] text-slate-200">
            Bonjour Cher Parent M. Masika. Le bulletin officiel de votre fille{" "}
            <strong>KAVIRA MASIKA DIVINE</strong> (3ème Sc. A) est disponible :
          </p>
          <div className="my-2 rounded-lg bg-black/40 p-2 font-mono text-[11px] text-emerald-300">
            • Moyenne générale : <strong>89.2%</strong> (Grande Distinction)<br />
            • Rang : <strong>1ère sur 42 élèves</strong><br />
            • Statut frais scolaires : <strong>En règle (Reçu #REC-9842)</strong>
          </div>
          <div className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-300 underline cursor-pointer">
            <ExternalLink className="h-3 w-3" />
            Consulter le bulletin officiel : app.edugoma.cd/b/8842
          </div>
        </div>
      </div>

      {/* 2. Official Anti-Expulsion School Fees Receipt */}
      <div className="overflow-hidden rounded-2xl border border-amber-300/40 bg-[#fffdfa] p-4 text-slate-900 shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-200 pb-2 mb-2">
          <div>
            <span className="text-[8px] font-black uppercase tracking-wider text-slate-500">
              INSTITUT DE GOMA • COMPTABILITÉ SCOLAIRE
            </span>
            <h5 className="text-xs font-black text-slate-900">
              REÇU D&apos;ENCAISSEMENT OFFICIEL N° 09842
            </h5>
          </div>
          <span className="rounded bg-emerald-100 border border-emerald-400 px-2 py-0.5 text-[9px] font-black text-emerald-800">
            PAYÉ & VALIDÉ
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px] mb-3">
          <div>
            <span className="text-slate-500">Élève :</span> <strong>Kavira Masika Divine</strong>
          </div>
          <div>
            <span className="text-slate-500">Classe :</span> 3ème Sc. A
          </div>
          <div>
            <span className="text-slate-500">Objet :</span> Minerval Trimestre 1
          </div>
          <div>
            <span className="text-slate-500">Montant acquitté :</span>{" "}
            <strong className="text-emerald-700">45.00 USD</strong>
          </div>
        </div>

        {/* Anti-expulsion Guarantee Seal */}
        <div className="rounded-lg bg-emerald-50 border-2 border-emerald-600 p-2 text-center text-emerald-900">
          <p className="text-[10px] font-black uppercase tracking-wide">
            GARANTIE OFFICIELLE : ÉLÈVE EN RÈGLE DE FRAIS SCOLAIRES
          </p>
          <p className="text-[8px] text-emerald-700">
            Ce justificatif numérique certifié interdit tout renvoi de l&apos;élève pour motif de minerval T1.
          </p>
        </div>
      </div>

    </div>
  );
}
