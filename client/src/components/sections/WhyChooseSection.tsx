"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  WifiOff,
  MapPin,
  CircleDollarSign,
  QrCode,
  Laptop,
  Check,
  X,
  Sparkles,
  ArrowRight,
  Award,
  Zap,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface BenefitCard {
  badge: string;
  badgeColor: string;
  icon: React.ElementType;
  title: string;
  description: string;
  highlight: string;
  spanCol?: boolean;
  spanFull?: boolean;
  bulletPoints?: string[];
}

const PILLARS: BenefitCard[] = [
  {
    badge: "100% Système Éducatif Congolais",
    badgeColor: "bg-blue-500/10 text-blue-300 border-blue-400/30",
    icon: Award,
    title: "La seule solution calquée sur les normes de l'EPST",
    description:
      "Formules officielles de délibération, canevas national A4, fiches E01/E02, barèmes par filière (Scientifique, Pédagogie, Commerciale, Littéraire). Vous n'avez rien à adapter : EduGoma applique déjà les exigences de la Division Provinciale Nord-Kivu 1.",
    highlight: "Zéro calculatrice • Mentions officielles automatiques",
    spanCol: true,
    bulletPoints: [
      "Pondérations ministérielles des maxima (Examens /40, Périodes /20)",
      "Palmarès d'école scellé prêt pour transmission à l'inspection",
      "Mentions officielles automatiques (Grande Distinction, Distinction, Satisfaction)"
    ]
  },
  {
    badge: "Résilience Réseau",
    badgeColor: "bg-cyan-500/10 text-cyan-300 border-cyan-400/30",
    icon: WifiOff,
    title: "Conçu pour les réalités techniques de Goma",
    description:
      "Coupures d'électricité ou réseau Airtel/Vodacom instable ? EduGoma fonctionne 100% hors-ligne. Les cotes et présences sont sauvegardées localement et synchronisées automatiquement dès le retour du signal.",
    highlight: "0% de données perdues en cas de panne"
  },
  {
    badge: "Support Terrain Nord-Kivu",
    badgeColor: "bg-emerald-500/10 text-emerald-300 border-emerald-400/30",
    icon: MapPin,
    title: "Une équipe technique présente sur place à Goma",
    description:
      "Pas de centre d'appels à distance ni d'e-mails sans réponse. Nos formateurs et techniciens sont basés à Goma : nous intervenons physiquement dans votre établissement pour former votre personnel et vous assister.",
    highlight: "Assistance physique à votre école en < 2h"
  },
  {
    badge: "Gestion Financière",
    badgeColor: "bg-amber-500/10 text-amber-300 border-amber-400/30",
    icon: CircleDollarSign,
    title: "Gestion bidevise USD & Franc Congolais",
    description:
      "Suivi des tranches de minerval avec taux du jour configurable, bordereaux de versement et reçus numériques sécurisés. Finis les élèves renvoyés par erreur et les contestations de caisse.",
    highlight: "Reçu anti-expulsion vérifiable sur mobile"
  },
  {
    badge: "Anti-Fraude & Sécurité",
    badgeColor: "bg-purple-500/10 text-purple-300 border-purple-400/30",
    icon: QrCode,
    title: "Verrouillage cryptographique et QR Code officiel",
    description:
      "Une fois la session de délibération clôturée par le jury, les cotes sont scellées et inaltérables. Chaque bulletin imprimé intègre un QR Code individuel vérifiable en ligne par les tuteurs et les inspecteurs.",
    highlight: "Falsification de notes impossible"
  },
  {
    badge: "Économique & Universel",
    badgeColor: "bg-indigo-500/10 text-indigo-300 border-indigo-400/30",
    icon: Laptop,
    title: "Zéro investissement matériel : vos appareils suffisent",
    description:
      "Inutile d'acheter des serveurs coûteux ou des tablettes de dernière génération. EduGoma fonctionne avec fluidité sur les ordinateurs de bureau déjà présents au secrétariat et sur les téléphones Android simples des professeurs.",
    highlight: "Compatible ordinateurs existants & smartphones Android",
    spanFull: true,
    bulletPoints: [
      "Accessible sur tout navigateur web (Chrome, Edge, Firefox)",
      "Interface mobile allégée conçue pour les forfaits data réduits",
      "Stockage cloud sécurisé sans frais de maintenance de serveur"
    ]
  }
];

const COMPARISON_ROWS = [
  {
    criterion: "Conformité canevas officiel EPST (RDC)",
    manual: "Ratures & calculs manuels",
    foreign: "Inadapté aux normes RDC",
    edugoma: "100% Conforme d'origine",
  },
  {
    criterion: "Fonctionnement en cas de coupure Internet",
    manual: "Papier (vulnérable)",
    foreign: "Bloqué sans connexion",
    edugoma: "Mode Hors-Ligne Total",
  },
  {
    criterion: "Délai de production des bulletins",
    manual: "3 à 4 semaines de calculs",
    foreign: "Plusieurs jours de retraitement",
    edugoma: "< 2 minutes par classe",
  },
  {
    criterion: "Certification anti-fraude & QR Code",
    manual: "Aucune (facilement falsifié)",
    foreign: "Rarement inclus",
    edugoma: "QR Code officiel scellé",
  },
  {
    criterion: "Support et formation sur place à Goma",
    manual: "Aucun",
    foreign: "Support distant par ticket",
    edugoma: "Équipe locale dans votre école",
  },
  {
    criterion: "Traçabilité des frais scolaires (Minerval)",
    manual: "Reçus papier perdus / contestés",
    foreign: "Systèmes bancaires non adaptés",
    edugoma: "Bidevise USD/FC & Reçu mobile",
  },
];

export function WhyChooseSection() {
  const [showComparison, setShowComparison] = useState(false);

  return (
    <section
      id="pourquoi"
      className="scroll-mt-28 relative overflow-hidden bg-slate-900 py-20 text-white md:py-28"
    >
      {/* Background glow and mesh accents */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.18),rgba(255,255,255,0))]" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-950 to-transparent" />
      <div className="pointer-events-none absolute left-0 top-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/10 blur-[100px]" />
      <div className="pointer-events-none absolute right-0 bottom-10 h-96 w-96 translate-x-1/2 rounded-full bg-cyan-500/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto mb-12 sm:mb-16 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-bold text-blue-300 shadow-sm backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-[11px] uppercase tracking-wider">
              La Différence EduGoma
            </span>
          </div>

          <h2 className="mb-4 text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white lg:leading-[1.15]">
            Pourquoi les écoles de Goma{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
              choisissent EduGoma.
            </span>
          </h2>

          <p className="mx-auto max-w-2xl text-sm sm:text-lg text-slate-300 leading-relaxed">
            Conçu sur le terrain au Nord-Kivu pour résoudre les défis réels que les logiciels importés ignorent totalement.
          </p>
        </div>

        {/* Asymmetric Bento Grid (6 Pillars) */}
        <div className="mb-12 sm:mb-16 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            const isSpan = pillar.spanCol;
            const isFull = pillar.spanFull;

            return (
              <div
                key={idx}
                className={`group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-slate-800/50 p-5 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/40 hover:bg-slate-800/80 hover:shadow-2xl hover:shadow-blue-500/10 ${
                  isFull
                    ? "md:col-span-2 lg:col-span-3"
                    : isSpan
                    ? "md:col-span-2 lg:col-span-2"
                    : ""
                }`}
              >
                <div>
                  {/* Top Bar: Icon + Badge */}
                  <div className="mb-4 sm:mb-5 flex items-center justify-between gap-3">
                    <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400 ring-1 ring-blue-500/30 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 sm:px-3 py-1 text-[10px] font-bold sm:text-xs ${pillar.badgeColor}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {pillar.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mb-2.5 sm:mb-3 text-lg sm:text-2xl font-extrabold text-white tracking-tight">
                    {pillar.title}
                  </h3>

                  <p className="mb-5 sm:mb-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {pillar.description}
                  </p>

                  {/* Bullet points for span cards */}
                  {pillar.bulletPoints && (
                    <div className="mb-5 sm:mb-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {pillar.bulletPoints.map((pt, pIdx) => (
                        <div
                          key={pIdx}
                          className="flex items-start gap-2 rounded-xl border border-white/5 bg-slate-900/50 p-2.5 text-xs text-slate-300"
                        >
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Highlight Pill */}
                <div className="border-t border-white/10 pt-4 flex items-center gap-2 text-xs font-bold text-cyan-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{pillar.highlight}</span>
                </div>

              </div>
            );
          })}
        </div>

        {/* Direct Comparison Matrix */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-800/40 p-4 sm:p-8 lg:p-10 backdrop-blur-xl shadow-2xl">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 sm:pb-6 mb-5 sm:mb-6">
            <div>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-cyan-400">
                Comparatif Transparent
              </span>
              <h3 className="text-lg sm:text-2xl font-black text-white mt-1">
                EduGoma vs Méthodes Traditionnelles & Logiciels Étrangers
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setShowComparison(!showComparison)}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600/30 border border-blue-500/40 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-600/50 transition cursor-pointer self-start sm:self-auto"
            >
              <span>{showComparison ? "Masquer le tableau" : "Voir le comparatif complet"}</span>
              <ArrowRight className={`h-3.5 w-3.5 transition-transform ${showComparison ? "rotate-90" : ""}`} />
            </button>
          </div>

          {/* Mobile swipe hint */}
          <div className="text-[10px] text-cyan-300/80 sm:hidden mb-2.5 flex items-center gap-1.5 font-semibold">
            <span>↔</span>
            <span>Faites glisser horizontalement pour voir toutes les colonnes</span>
          </div>

          {/* Comparison Table Content with min-w for horizontal scroll on mobile */}
          <div className="overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0">
            <table className="w-full min-w-[580px] text-left text-xs sm:text-sm">
              <thead className="border-b border-white/10 text-[10px] sm:text-xs uppercase font-black tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-3">Critères Décisifs</th>
                  <th className="py-3 px-3 text-slate-400">Méthode Manuelle (Papier / Excel)</th>
                  <th className="py-3 px-3 text-slate-400">Logiciels Étrangers Importés</th>
                  <th className="py-3 px-3 text-cyan-300 font-black bg-blue-600/20 rounded-t-xl">
                    EduGoma (Spécial RDC)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {COMPARISON_ROWS.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-white/5 transition">
                    <td className="py-3.5 px-3 font-bold text-white">
                      {row.criterion}
                    </td>
                    <td className="py-3.5 px-3 text-rose-300/80">
                      <div className="flex items-center gap-1.5">
                        <X className="h-4 w-4 text-rose-400 shrink-0" />
                        <span>{row.manual}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-amber-300/80">
                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                        <span>{row.foreign}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-emerald-300 bg-blue-600/10">
                      <div className="flex items-center gap-1.5">
                        <Check className="h-4 w-4 text-emerald-400 shrink-0 stroke-[3]" />
                        <span>{row.edugoma}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Call to Action strip */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-cyan-600/20 border border-blue-500/30 p-4 sm:p-6">
            <div>
              <h4 className="text-sm sm:text-base font-extrabold text-white">
                Prêt à moderniser la gestion de votre établissement ?
              </h4>
              <p className="text-xs text-slate-300">
                Rejoignez les écoles pilotes de Goma dès aujourd&apos;hui.
              </p>
            </div>

            <Link
              href="#cta"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition active:scale-[0.98] sm:text-sm shrink-0"
            >
              <span>Demander une démo personnalisée</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
