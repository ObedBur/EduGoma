"use client";

import React from "react";
import {
  FileX2,
  Calculator,
  UserX,
  Printer,
  Compass,
  CheckCircle2,
  Sparkles,
  Search,
  Smartphone
} from "lucide-react";

export function ChallengesSection() {
  return (
    <section id="defis" className="scroll-mt-28 relative overflow-hidden bg-white py-20 md:py-28">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute top-1/2 left-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 translate-x-1/2 rounded-full bg-cyan-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-3.5 py-1.5 text-xs font-bold text-brand-secondary mb-4 shadow-xs">
            <span className="flex h-1.5 w-1.5 rounded-full bg-brand-secondary animate-pulse" />
            <span className="uppercase tracking-wider text-[11px]">Le Constat & La Réponse</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight text-slate-900 leading-[1.18] sm:leading-[1.16] mb-4">
            Pourquoi la gestion traditionnelle freine vos écoles.
          </h2>

          <p className="text-sm sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
            Entre registres papier égarés, calculs manuels interminables et retards de bulletins,
            voici comment EduGoma élimine chaque point de friction pour vous redonner le contrôle.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          
          {/* Card 1 (Spans 2 columns on lg): Calculs des cotes & moyennes */}
          <div className="lg:col-span-2 group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/60 to-blue-50/30 p-5 sm:p-8 shadow-sm transition-all duration-300 hover:border-brand-secondary/40 hover:shadow-xl hover:shadow-brand-secondary/5">
            <div>
              {/* Badge & Category */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                    <Calculator className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Délibérations & Cotes
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                  <Sparkles className="h-3 w-3 text-emerald-600" />
                  Gain de temps : -85%
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                Le calvaire des moyennes et délibérations manuelles
              </h3>
              
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                En fin de période, les enseignants passent des nuits entières à calculer moyennes,
                pourcentages et classements à la calculatrice, avec des ratures et un risque élevé d&apos;erreurs.
              </p>
            </div>

            {/* Visual Mini Comparison Box */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Before */}
                <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-3">
                  <div className="flex items-center gap-1.5 font-bold text-rose-700 mb-1">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-200 text-rose-800 text-[10px]">✕</span>
                    Avant (Méthode Manuelle)
                  </div>
                  <p className="text-slate-600 text-[11px] leading-snug">
                    3 semaines de calculs sur fiches, contestations de notes, risques constants d&apos;erreurs de report.
                  </p>
                </div>

                {/* With EduGoma */}
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-700 mb-1">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Avec EduGoma
                  </div>
                  <p className="text-slate-700 text-[11px] leading-snug font-medium">
                    Calcul instantané et automatique des moyennes pondérées selon le canevas officiel national congolais.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Registres papier vulnérables */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/60 to-slate-100/40 p-6 sm:p-7 shadow-sm transition-all duration-300 hover:border-brand-secondary/40 hover:shadow-xl hover:shadow-brand-secondary/5">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600">
                  <FileX2 className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Archivage & Sécurité
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                Registres papier encombrants & vulnérables
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Des armoires remplies de dossiers jaunis qui s&apos;abîment, prennent la poussière ou risquent d&apos;être perdus lors d&apos;incidents.
              </p>
            </div>

            {/* Visual Interactive Search Preview */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 mb-2.5">
                <Search className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-slate-800 font-medium">Kavira Masika</span>
                <span className="ml-auto text-[10px] text-emerald-600 font-bold">Trouvé</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                <span>Archives numérisées</span>
                <span className="font-bold text-brand-primary">Accès en 2 sec</span>
              </div>
            </div>
          </div>

          {/* Card 3: Fiches d'appel volantes */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/60 to-slate-100/40 p-6 sm:p-7 shadow-sm transition-all duration-300 hover:border-brand-secondary/40 hover:shadow-xl hover:shadow-brand-secondary/5">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                  <UserX className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Discipline & Ponctualité
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                Fiches d&apos;appel volantes & absentéisme
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Difficile de consolider les présences avec des bouts de papier. Les absences répétées passent souvent inaperçues jusqu&apos;au bilan.
              </p>
            </div>

            {/* Visual Phone Attendance Pill */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Smartphone className="h-3.5 w-3.5 text-brand-secondary" />
                  Appel en classe
                </span>
                <span className="text-[10px] font-bold text-emerald-600">En 30 sec</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span>Notification parents</span>
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">Immédiate</span>
              </div>
            </div>
          </div>

          {/* Card 4: Bulletins fastidieux */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/60 to-slate-100/40 p-6 sm:p-7 shadow-sm transition-all duration-300 hover:border-brand-secondary/40 hover:shadow-xl hover:shadow-brand-secondary/5">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600">
                  <Printer className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Secrétariat & Impression
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                Impression & édition fastidieuse des bulletins
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Recopier manuellement chaque note sur les bulletins cartonnés prend des jours entiers à la fin de chaque trimestre scolaire.
              </p>
            </div>

            {/* Visual Batch Generation */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800">Génération par lot</span>
                <span className="text-[10px] font-bold text-brand-secondary">Format officiel RDC</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full w-full rounded-full bg-gradient-to-r from-brand-secondary to-brand-accent" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
                <span>Prêt pour impression</span>
                <span className="font-bold text-emerald-600">420/420 élèves</span>
              </div>
            </div>
          </div>

          {/* Card 5: Direction à l'aveugle */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-900 via-brand-primary to-slate-900 p-6 sm:p-7 text-white shadow-xl shadow-brand-primary/10 transition-all duration-300 hover:shadow-2xl">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-brand-accent">
                    <Compass className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">
                    Cockpit Direction
                  </span>
                </div>
                <span className="rounded-full bg-rose-500/20 border border-rose-500/30 px-2.5 py-0.5 text-[10px] font-bold text-rose-300">
                  Point noir n°1 des préfets
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                Manque total de visibilité en temps réel
              </h3>

              <p className="text-sm text-white/70 leading-relaxed mb-6">
                Impossible pour le préfet ou promoteur de connaître avec précision les effectifs réels,
                l&apos;état des cotes ou la santé financière sans lancer une enquête manuelle.
              </p>
            </div>

            {/* Visual Cockpit Status */}
            <div className="rounded-2xl border border-white/10 bg-white/10 p-3.5 backdrop-blur-md">
              <div className="flex items-center justify-between text-xs font-bold text-white mb-1.5">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Tableau de bord consolidé
                </span>
                <span className="text-[10px] text-emerald-300 font-bold">Instantané</span>
              </div>
              <p className="text-[11px] text-white/60 leading-snug">
                Suivez en direct l&apos;avancement des délibérations, les présences et les effectifs classe par classe.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
