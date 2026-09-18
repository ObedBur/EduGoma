"use client";

import React from "react";
import Link from "next/link";
import {
  FileSpreadsheet,
  Award,
  Users,
  Clock,
  BookOpen,
  CreditCard,
  Check,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const MODULES = [
  {
    icon: FileSpreadsheet,
    tag: "Conforme Ministère EPST",
    tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
    title: "Bulletins & Palmarès Officiels",
    description: "Édition automatisée des bulletins trimestriels et du palmarès d'école avec application des formules officielles de délibération en RDC.",
    features: [
      "Format national officiel A4 prêt à imprimer",
      "Calcul automatique des pourcentages & rangs",
      "Impression en lot pour tout l'établissement"
    ],
    accentColor: "from-blue-600 to-indigo-600",
    iconBg: "bg-blue-50 text-blue-600"
  },
  {
    icon: Award,
    tag: "Zéro Calcul Manuel",
    tagColor: "bg-amber-50 text-amber-700 border-amber-200/70",
    title: "Gestion des Cotes & Délibérations",
    description: "Saisie rapide des notes d'interrogations et d'examens avec calcul instantané des moyennes pondérées selon les maxima de chaque cours.",
    features: [
      "Saisie rapide sur smartphone par les enseignants",
      "Pondérations et coefficients personnalisables",
      "Verrouillage sécurisé des cotes après délibération"
    ],
    accentColor: "from-amber-500 to-orange-500",
    iconBg: "bg-amber-50 text-amber-600"
  },
  {
    icon: Users,
    tag: "Dossiers Centralisés",
    tagColor: "bg-indigo-50 text-indigo-700 border-indigo-200/70",
    title: "Inscriptions & Dossiers Élèves",
    description: "Fini les registres poussiéreux. Retrouvez l'historique complet, les antécédents, les tuteurs et le matricule unique de chaque élève en 2 secondes.",
    features: [
      "Recherche instantanée par nom ou matricule",
      "Importation en masse depuis un fichier Excel",
      "Archivage numérique conservé année après année"
    ],
    accentColor: "from-indigo-600 to-blue-600",
    iconBg: "bg-indigo-50 text-indigo-600"
  },
  {
    icon: Clock,
    tag: "Mobile Enseignant",
    tagColor: "bg-teal-50 text-teal-700 border-teal-200/70",
    title: "Appel Numérique & Présences",
    description: "Les enseignants font l'appel en classe en 30 secondes depuis leur téléphone, même avec une connexion instable. Les bilans sont instantanés.",
    features: [
      "Pointage d'appel rapide par classe en 3 clics",
      "Rapports d'assiduité mensuels consolidés",
      "Détection précoce du décrochage scolaire"
    ],
    accentColor: "from-teal-500 to-emerald-500",
    iconBg: "bg-teal-50 text-teal-600"
  },
  {
    icon: BookOpen,
    tag: "Organisation Pédagogique",
    tagColor: "bg-sky-50 text-sky-700 border-sky-200/70",
    title: "Sections, Classes & Attributions",
    description: "Configurez facilement vos sections (Scientifique, Littéraire, Pédagogie, Commerciale...) et assignez les matières à vos enseignants.",
    features: [
      "Structure multi-options et promotions flexibles",
      "Suivi des volumes horaires par professeur",
      "Visualisation claire de la charge pédagogique"
    ],
    accentColor: "from-sky-500 to-blue-600",
    iconBg: "bg-sky-50 text-sky-600"
  },
  {
    icon: CreditCard,
    tag: "Trésorerie & Clarté",
    tagColor: "bg-purple-50 text-purple-700 border-purple-200/70",
    title: "Suivi des Frais Scolaires (Minerval)",
    description: "Gardez une traçabilité totale sur les paiements des frais scolaires, générez les reçus pour les parents et éliminez les contestations de caisse.",
    features: [
      "Pointage clair des tranches de frais réglées",
      "Génération immédiate de reçus de paiement",
      "Vue globale sur les créances et recouvrements"
    ],
    accentColor: "from-purple-600 to-indigo-600",
    iconBg: "bg-purple-50 text-purple-600"
  },
];

export function PlatformOverviewSection() {
  return (
    <section id="fonctionnalites" className="scroll-mt-28 relative overflow-hidden bg-slate-50/70 py-20 md:py-28 border-y border-slate-200/70">
      
      {/* Background soft ambient accents */}
      <div className="pointer-events-none absolute top-10 right-0 h-80 w-80 translate-x-1/3 rounded-full bg-blue-500/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-0 h-80 w-80 -translate-x-1/3 rounded-full bg-cyan-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-3.5 py-1.5 text-xs font-bold text-brand-secondary mb-4 shadow-xs">
            <span className="flex h-1.5 w-1.5 rounded-full bg-brand-secondary animate-pulse" />
            <span className="uppercase tracking-wider text-[11px]">Écosystème Tout-En-Un</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight text-slate-900 leading-[1.18] sm:leading-[1.16] mb-4">
            Une plateforme complète pour chaque besoin de votre établissement.
          </h2>

          <p className="text-sm sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
            Du secrétariat à la salle des professeurs jusqu&apos;à la direction,
            EduGoma intègre tous les modules nécessaires pour une gestion moderne et sans faille.
          </p>
        </div>

        {/* 6 Core Functional Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-12">
          {MODULES.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <div
                key={idx}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-sm transition-all duration-300 hover:border-brand-secondary/40 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand-secondary/5"
              >
                <div>
                  {/* Top Bar: Icon + Status Tag */}
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${mod.iconBg} shadow-xs transition-transform duration-300 group-hover:scale-105`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-tight whitespace-nowrap ${mod.tagColor}`}>
                      {mod.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2.5 group-hover:text-brand-secondary transition-colors">
                    {mod.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                    {mod.description}
                  </p>
                </div>

                {/* Bullets List */}
                <div className="border-t border-slate-100 pt-4 mt-auto">
                  <ul className="space-y-2">
                    {mod.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                        </span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner Callout */}
        <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-r from-slate-900 via-brand-primary to-slate-900 p-5 sm:p-8 text-white shadow-xl shadow-brand-primary/10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-start gap-3.5 sm:gap-4">
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-brand-accent shadow-inner">
                <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white mb-1">
                  Synchronisation cloud & Résilience totale
                </h4>
                <p className="text-xs sm:text-sm text-white/70 max-w-2xl leading-relaxed">
                  Pas d&apos;Internet permanent ? Aucun problème. Vos équipes travaillent localement,
                  et l&apos;ensemble des données se synchronise automatiquement dès le retour du réseau.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 w-full sm:w-auto">
              <Link
                href="#comment-ca-marche"
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-bold text-slate-900 shadow-md transition-all duration-200 hover:bg-brand-accent hover:text-brand-primary hover:-translate-y-0.5"
              >
                <span>Découvrir le parcours de déploiement</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
