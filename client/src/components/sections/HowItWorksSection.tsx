"use client";

import React from "react";
import Link from "next/link";
import {
  FileSpreadsheet,
  SlidersHorizontal,
  Smartphone,
  Award,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Headphones,
  ShieldCheck,
} from "lucide-react";

interface Step {
  number: string;
  badge: string;
  badgeColor: string;
  icon: React.ElementType;
  title: string;
  description: string;
  highlight: string;
  details: string[];
}

const STEPS: Step[] = [
  {
    number: "01",
    badge: "15 min chrono",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200/80",
    icon: FileSpreadsheet,
    title: "Importez vos listes sans rien ressaisir",
    description:
      "Transmettez vos fichiers Excel existants. L'assistant crée vos classes et vos options, puis génère automatiquement les matricules nationaux uniques.",
    highlight: "Zéro saisie manuelle de 500 dossiers",
    details: [
      "Importation en masse par fichier Excel",
      "Génération automatique des matricules",
      "Création instantanée des sections"
    ]
  },
  {
    number: "02",
    badge: "Automatisé",
    badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-200/80",
    icon: SlidersHorizontal,
    title: "Paramétrez les barèmes officiels EPST",
    description:
      "Les maxima et coefficients officiels de la RDC sont préconfigurés. Attribuez chaque discipline à son enseignant titulaire en un seul clic.",
    highlight: "Conforme canevas national congolais",
    details: [
      "Maxima officiels (Examens /40, Périodes /20)",
      "Pondérations automatiques par filière",
      "Attribution des cours par professeur"
    ]
  },
  {
    number: "03",
    badge: "Au quotidien",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    icon: Smartphone,
    title: "Saisie mobile des cotes sans calcul",
    description:
      "Les professeurs encodent cotes et présences sur smartphone depuis la salle des profs. Les moyennes se calculent automatiquement, même hors-ligne.",
    highlight: "Fonctionne sans Internet à Goma",
    details: [
      "Saisie rapide sur smartphone Android ou iPhone",
      "Calcul immédiat des moyennes sans calculatrice",
      "Appel de présence en 30 secondes"
    ]
  },
  {
    number: "04",
    badge: "< 2 min par classe",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200/80",
    icon: Award,
    title: "Délibérez et imprimez les bulletins A4",
    description:
      "Le jury valide les résultats de période. Le palmarès officiel est scellé et les bulletins certifiés A4 avec QR Code s'impriment en un clic.",
    highlight: "1 clic pour imprimer toute l'école",
    details: [
      "Génération en masse du lot A4 par classe",
      "Procès-verbal scellé pour l'Inspection EPST",
      "Alerte automatique des parents WhatsApp/SMS"
    ]
  }
];

export function HowItWorksSection() {
  return (
    <section
      id="comment-ca-marche"
      className="scroll-mt-32 relative overflow-hidden bg-slate-50 pt-24 pb-20 md:pt-32 md:pb-28 border-y border-slate-200/80"
    >
      {/* Background ambient accents */}
      <div className="pointer-events-none absolute -top-20 right-0 h-80 w-80 translate-x-1/3 rounded-full bg-blue-400/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-0 h-80 w-80 -translate-x-1/3 rounded-full bg-cyan-400/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto mb-12 sm:mb-16 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/90 px-4 py-1.5 text-xs font-bold text-brand-secondary shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-brand-secondary" />
            <span className="text-[11px] uppercase tracking-wider">
              Déploiement Simple & Guidé
            </span>
          </div>

          <h2 className="mb-4 text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-[1.18]">
            Opérationnel dans votre école en{" "}
            <span className="bg-gradient-to-r from-brand-secondary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              moins de 48 heures.
            </span>
          </h2>

          <p className="mx-auto max-w-2xl text-sm sm:text-lg text-slate-600 leading-relaxed">
            Pas de formation complexe de plusieurs semaines. Nous accompagnons votre équipe pas à pas, de l'importation de vos listes jusqu'à l'impression du premier bulletin.
          </p>
        </div>

        {/* 4 Connected Sequential Steps with CSS Subgrid for 100% Mathematical Alignment */}
        <div className="mb-12 sm:mb-16">
          <div className="grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[auto_auto_auto_1fr] items-stretch">
            {STEPS.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="group relative flex flex-col justify-between lg:grid lg:row-span-4 lg:grid-rows-subgrid rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm transition-all duration-300 hover:border-brand-secondary/50 hover:shadow-lg hover:shadow-brand-secondary/5"
                >
                  {/* Top Colored Identity Strip */}
                  <div className="absolute top-0 left-6 right-6 h-1 rounded-b-full bg-slate-100 group-hover:bg-brand-secondary transition-colors duration-300" />

                  {/* Subgrid Row 1: Number & Badge */}
                  <div className="mb-4 sm:mb-5 mt-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-slate-900 font-mono text-xs font-black text-white shadow-xs">
                        {step.number}
                      </span>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-brand-secondary">
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold ${step.badgeColor}`}
                    >
                      <Clock className="h-3 w-3" />
                      {step.badge}
                    </span>
                  </div>

                  {/* Subgrid Row 2: Title */}
                  <div className="mb-2.5 sm:mb-3 flex items-start">
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                      {step.title}
                    </h3>
                  </div>

                  {/* Subgrid Row 3: Description */}
                  <div className="mb-4 sm:mb-5 flex items-start min-h-0 sm:min-h-[5rem]">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Subgrid Row 4: Lower Area (Border, Highlight Box & Details) */}
                  <div className="border-t border-slate-100 pt-4 flex flex-col justify-between">
                    <div>
                      {/* Highlight Box: flexible height to avoid text clipping on mobile */}
                      <div className="mb-3 flex min-h-[2.5rem] py-1.5 items-center gap-2 rounded-lg bg-emerald-50/80 border border-emerald-200/60 px-2.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span className="text-[11px] font-extrabold text-emerald-900 leading-snug">
                          {step.highlight}
                        </span>
                      </div>

                      {/* Bullet points */}
                      <ul className="space-y-1.5">
                        {step.details.map((item, dIdx) => (
                          <li
                            key={dIdx}
                            className="flex items-start gap-2 text-[11px] text-slate-500 leading-tight"
                          >
                            <span className="mt-1 h-1 w-1 rounded-full bg-slate-300 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Local Support & Field Assistance Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-8 lg:p-10 shadow-sm">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
            
            {/* Left: Assurance Value Proposition */}
            <div className="lg:col-span-7">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-3 py-1 text-xs font-bold text-emerald-800">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Accompagnement Terrain Dédié à Goma</span>
              </div>

              <h3 className="mb-3 text-xl sm:text-3xl font-black tracking-tight text-slate-900">
                Vous n&apos;êtes jamais seul. Une équipe locale vous forme sur place.
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Nous savons que la transition numérique peut inquiéter certains enseignants peu habitués aux outils digitaux. C&apos;est pourquoi notre équipe basée à Goma se déplace gratuitement dans votre établissement pour assurer une prise en main sereine en 2 heures chrono.
              </p>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 sm:p-3.5">
                  <div className="text-sm sm:text-base font-extrabold text-brand-primary">Formation 2h</div>
                  <div className="text-[11px] text-slate-500 font-medium">Sur place dans votre école</div>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 sm:p-3.5">
                  <div className="text-sm sm:text-base font-extrabold text-brand-primary">Support WhatsApp</div>
                  <div className="text-[11px] text-slate-500 font-medium">Réponse en moins de 10 min</div>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 sm:p-3.5">
                  <div className="text-sm sm:text-base font-extrabold text-brand-primary">0 Panne Réseau</div>
                  <div className="text-[11px] text-slate-500 font-medium">Mode 100% hors-ligne</div>
                </div>
              </div>
            </div>

            {/* Right: Direct Onboarding CTA */}
            <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary via-slate-900 to-blue-950 p-5 sm:p-8 text-center text-white lg:col-span-5 shadow-xl">
              <div className="mb-4 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-white/10 text-white shadow-inner ring-1 ring-white/20">
                <Headphones className="h-6 w-6 sm:h-7 sm:w-7 text-cyan-300" />
              </div>

              <h4 className="mb-2 text-lg sm:text-xl font-black">
                Planifier une démonstration gratuite
              </h4>

              <p className="mb-6 text-xs text-slate-300 leading-relaxed">
                Testez EduGoma avec les vraies données d&apos;une de vos classes avant tout engagement.
              </p>

              <Link
                href="#cta"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition-all duration-200 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/40 active:scale-[0.98] sm:text-sm cursor-pointer"
              >
                <span>Démarrer le déploiement gratuit</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <p className="mt-3 text-[10px] text-slate-400">
                Sans carte bancaire • Installation sans matériel coûteux
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
