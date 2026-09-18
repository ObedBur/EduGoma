"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  PhoneCall,
  Wifi,
  Sparkles,
  Users,
  Clock,
  FileCheck2,
  Check,
  Smartphone,
  GraduationCap,
  LayoutDashboard,
  Award,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import { DemoRequestModal } from "../ui/DemoRequestModal";

/* ─── Images authentiques en arrière-plan du Hero ────────────── */
const HERO_SCENES = [
  {
    src: "/images/class1.png",
    alt: "Salle de classe et enseignant à Goma, RDC",
    label: "Institut de Goma · Salle de classe",
  },
  {
    src: "/images/class2.png",
    alt: "Élèves en cours de révision et étude, RDC",
    label: "Séance d'études dirigées · Élèves en uniforme",
  },
  {
    src: "/images/class3.png",
    alt: "Cour et vie scolaire à Goma, RDC",
    label: "Établissement scolaire · Goma, Nord-Kivu",
  },
];

const SCENE_DURATION = 5000; // 5 secondes par image

/* ─── Données Palmarès pour le Dashboard Admin ───────────────── */
const CLASS_STUDENTS: Record<
  string,
  {
    name: string;
    sub1: string;
    sub2: string;
    avg: string;
    mention: string;
    badgeTone: "gold" | "emerald" | "blue";
  }[]
> = {
  "3ème Sc. A": [
    {
      name: "Kavira Masika Divine",
      sub1: "18.5",
      sub2: "17.0",
      avg: "17.8",
      mention: "Grande Distinction",
      badgeTone: "gold",
    },
    {
      name: "Bahati Mugisho Alain",
      sub1: "15.0",
      sub2: "14.5",
      avg: "14.8",
      mention: "Satisfaction",
      badgeTone: "blue",
    },
    {
      name: "Amani Kasereka Joel",
      sub1: "16.0",
      sub2: "16.5",
      avg: "16.3",
      mention: "Distinction",
      badgeTone: "emerald",
    },
  ],
  "4ème Bio": [
    {
      name: "Zawadi Neema Esther",
      sub1: "19.0",
      sub2: "18.5",
      avg: "18.8",
      mention: "Grande Distinction",
      badgeTone: "gold",
    },
    {
      name: "Baraka Safari Prince",
      sub1: "17.5",
      sub2: "16.0",
      avg: "16.8",
      mention: "Distinction",
      badgeTone: "emerald",
    },
    {
      name: "Muhindo Eric Claude",
      sub1: "13.5",
      sub2: "14.0",
      avg: "13.8",
      mention: "Satisfaction",
      badgeTone: "blue",
    },
  ],
  "2ème Litt.": [
    {
      name: "Nabintu Riziki Sarah",
      sub1: "18.0",
      sub2: "17.5",
      avg: "17.8",
      mention: "Grande Distinction",
      badgeTone: "gold",
    },
    {
      name: "Furaha Binti Gloria",
      sub1: "17.0",
      sub2: "16.5",
      avg: "16.8",
      mention: "Distinction",
      badgeTone: "emerald",
    },
    {
      name: "Ushindi Jacques David",
      sub1: "15.5",
      sub2: "15.0",
      avg: "15.3",
      mention: "Satisfaction",
      badgeTone: "blue",
    },
  ],
};

/* ─── Métriques Hero ─────────────────────────────────────────── */
const METRICS = [
  { value: "3", label: "Écoles pilotes" },
  { value: "2 200+", label: "Élèves gérés" },
  { value: "100%", label: "Conforme EPST" },
];

/* ─── Composant HeroSection ─────────────────────────────────── */
export function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [selectedClass, setSelectedClass] = useState("3ème Sc. A");

  /* Cycle automatique entre les 2 images réelles */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentScene((prev) => (prev + 1) % HERO_SCENES.length);
    }, SCENE_DURATION);
    return () => clearInterval(timer);
  }, []);

  const activeStudents = CLASS_STUDENTS[selectedClass] || CLASS_STUDENTS["3ème Sc. A"];
  const currentSceneData = HERO_SCENES[currentScene];

  return (
    <>
      <section
        id="hero"
        className="relative flex min-h-[85vh] sm:min-h-[92vh] items-center overflow-hidden bg-slate-950 py-12 sm:py-16 lg:py-24"
      >
        {/* ═════════════════════════════════════════════════════════════════
            1. IMAGES AUTHENTIQUES EN ARRIÈRE-PLAN DU HERO ENTIER + BLUR
        ══════════════════════════════════════════════════════════════════ */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          {HERO_SCENES.map((scene, idx) => (
            <div
              key={scene.src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentScene ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={scene.src}
                alt={scene.alt}
                fill
                unoptimized
                className={`object-cover object-center transition-transform duration-[6000ms] ease-out ${
                  idx === currentScene ? "scale-105" : "scale-100"
                }`}
                priority={idx === 0}
                sizes="100vw"
              />
            </div>
          ))}

          {/* Couche Blur très léger & Dégradé ciblé pour garder la photo bien visible */}
          <div className="absolute inset-0 backdrop-blur-[2px] bg-slate-950/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/40 to-slate-950/15" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950 to-transparent" />
        </div>

        {/* ═════════════════════════════════════════════════════════════════
            2. CONTENU DU HERO : GAUCHE (TEXTE) + DROITE (VUE ADMIN DASHBOARD)
        ══════════════════════════════════════════════════════════════════ */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid w-full max-w-full min-w-0 items-center gap-10 lg:grid-cols-12 lg:gap-10">

            {/* ─── GAUCHE : Texte d'accroche ─────────────────── */}
            <div className="w-full max-w-2xl lg:max-w-none min-w-0 lg:col-span-5">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/15 px-3 py-1 text-xs font-semibold text-cyan-300 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Plateforme scolaire intégrée · RDC
              </div>

              <h1 className="mb-5 sm:mb-6 text-3xl sm:text-5xl lg:text-[3.25rem] font-black leading-[1.12] sm:leading-[1.08] tracking-tight text-white drop-shadow-sm">
                La gestion scolaire{" "}
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
                  complète
                </span>{" "}
                pour les écoles de Goma.
              </h1>

              <p className="mb-6 sm:mb-8 text-sm sm:text-lg leading-relaxed text-slate-200 drop-shadow-sm">
                Académique, financier et administratif — tout dans un seul outil.
                Hors-ligne, mobile money, bulletins EPST officiels.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="group inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-white px-5 sm:px-6 text-sm font-bold text-slate-900 shadow-xl shadow-black/20 transition-all duration-200 hover:bg-slate-100 hover:-translate-y-0.5 active:scale-[0.98] whitespace-nowrap cursor-pointer"
                >
                  <PhoneCall className="h-4 w-4 text-brand-secondary" />
                  <span>Demander une démo</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>

                <Link
                  href="#fonctionnalites"
                  className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-xl border border-white/20 bg-slate-900/60 px-5 sm:px-6 text-sm font-semibold text-white backdrop-blur-md shadow-lg transition-all duration-200 hover:bg-white/10 hover:border-white/30 hover:-translate-y-0.5 active:scale-[0.98] whitespace-nowrap"
                >
                  Voir les fonctionnalités
                </Link>
              </div>

              {/* Métriques clés */}
              <div className="mt-8 sm:mt-10 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-8 border-t border-white/15 pt-5 sm:pt-6">
                {METRICS.map(({ value, label }, idx) => (
                  <div key={idx} className="text-center sm:text-left">
                    <p className="text-xl sm:text-2xl font-black text-white drop-shadow-sm">{value}</p>
                    <p className="mt-0.5 text-[10px] sm:text-xs font-semibold text-slate-300 leading-tight">{label}</p>
                  </div>
                ))}
              </div>

              {/* Indicateur de la photo active en arrière-plan */}
              <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-900/60 px-3 py-1 text-[11px] text-slate-300 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{currentSceneData.label}</span>
                <div className="ml-1 flex items-center gap-1">
                  {HERO_SCENES.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentScene(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === currentScene ? "w-4 bg-cyan-400" : "w-1.5 bg-white/30 hover:bg-white/60"
                      }`}
                      aria-label={`Photo ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* ─── DROITE : Vue Admin Dashboard EduGoma (Masqué sur mobile pour aérer la vue) ─── */}
            <div className="relative w-full max-w-full min-w-0 lg:col-span-7 hidden lg:block">
              {/* Glow ambiant derrière le dashboard */}
              <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-600/30 via-cyan-500/20 to-indigo-600/30 opacity-70 blur-2xl -z-10" />

              {/* Cadre de la fenêtre navigateur / SaaS Admin */}
              <div className="relative w-full max-w-full overflow-hidden rounded-2xl border border-white/20 bg-slate-900/90 shadow-[0_25px_65px_-15px_rgba(0,0,0,0.7)] backdrop-blur-xl ring-1 ring-white/10">

                {/* Chrome Header : Boutons fenêtre macOS & URL bar */}
                <div className="flex items-center justify-between border-b border-white/10 bg-slate-950/80 px-3 sm:px-4 py-2.5 sm:py-3">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#ff5f56]" />
                    <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#ffbd2e]" />
                    <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#27c93f]" />
                  </div>

                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] text-slate-300 shadow-inner max-w-[170px] sm:max-w-none sm:w-72">
                    <div className="flex items-center gap-1 sm:gap-1.5 text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-mono text-[9px] sm:text-[10px] text-slate-400">https://</span>
                    </div>
                    <span className="font-mono font-medium text-slate-200 truncate">
                      app.edugoma.cd/direction/deliberations
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                      <Wifi className="h-3 w-3 text-emerald-400" />
                      <span className="hidden sm:inline">Sync Live RDC</span>
                    </span>
                  </div>
                </div>

                {/* Corps de la fenêtre Admin */}
                <div className="flex w-full max-w-full min-w-0">
                  {/* Mini-sidebar de navigation */}
                  <aside className="hidden w-14 shrink-0 flex-col items-center gap-3.5 border-r border-white/10 bg-slate-950/60 py-4 sm:flex">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-md ring-1 ring-white/20">
                      <GraduationCap className="h-4 w-4" />
                    </div>

                    <nav className="flex flex-col gap-2 pt-2" aria-label="Menu du dashboard">
                      <button
                        type="button"
                        className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-cyan-300 shadow-sm ring-1 ring-cyan-400/30 transition"
                        title="Tableau de bord"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        <span className="absolute -left-1 top-1.5 h-5 w-1 rounded-r-full bg-cyan-400" />
                      </button>
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition"
                        title="Élèves & Inscriptions"
                      >
                        <Users className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition"
                        title="Délibérations & Cotes"
                      >
                        <Award className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition"
                        title="Bulletins officiels EPST"
                      >
                        <FileCheck2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition"
                        title="Frais & Mobile Money"
                      >
                        <CreditCard className="h-4 w-4" />
                      </button>
                    </nav>
                  </aside>

                  {/* Espace de travail de l'établissement */}
                  <div className="min-w-0 w-full max-w-full flex-1 p-3 sm:p-5 space-y-3 sm:space-y-3.5 bg-slate-900/60">

                    {/* En-tête de session d'établissement */}
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                            Établissement Pilote · Goma
                          </span>
                          <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] font-semibold text-slate-300">
                            Année 2024–2025
                          </span>
                        </div>
                        <h3 className="mt-1 text-sm sm:text-base font-extrabold text-white tracking-tight">
                          Institut de Goma — Session de Délibération T1
                        </h3>
                      </div>

                      {/* Statut EPST */}
                      <div className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-300 shadow-sm self-start sm:self-auto">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>Palmarès Validé · EPST RDC</span>
                      </div>
                    </div>

                    {/* ═══ 4 CARTES KPI STATISTIQUES ═══ */}
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {/* KPI 1 : Élèves */}
                      <div className="rounded-xl border border-white/10 bg-white/5 p-2 sm:p-2.5 shadow-sm transition hover:border-white/20">
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="text-[9px] font-bold uppercase tracking-wide">Élèves</span>
                          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-500/20 text-cyan-300">
                            <Users className="h-3 w-3" />
                          </div>
                        </div>
                        <div className="mt-1 text-base sm:text-lg font-black text-white tracking-tight">1 420</div>
                        <span className="text-[9px] font-semibold text-emerald-400">48 classes</span>
                      </div>

                      {/* KPI 2 : Présences */}
                      <div className="rounded-xl border border-white/10 bg-white/5 p-2 sm:p-2.5 shadow-sm transition hover:border-white/20">
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="text-[9px] font-bold uppercase tracking-wide">Présence</span>
                          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-500/20 text-indigo-300">
                            <Clock className="h-3 w-3" />
                          </div>
                        </div>
                        <div className="mt-1 text-base sm:text-lg font-black text-white tracking-tight">98.4%</div>
                        <span className="text-[9px] font-semibold text-slate-300">Aujourd'hui</span>
                      </div>

                      {/* KPI 3 : Calcul automatique */}
                      <div className="rounded-xl border border-white/10 bg-white/5 p-2 sm:p-2.5 shadow-sm transition hover:border-white/20">
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="text-[9px] font-bold uppercase tracking-wide">Calculs</span>
                          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-amber-500/20 text-amber-300">
                            <Sparkles className="h-3 w-3" />
                          </div>
                        </div>
                        <div className="mt-1 text-base sm:text-lg font-black text-emerald-400 tracking-tight">100% Auto</div>
                        <span className="text-[9px] font-semibold text-emerald-300">0 calcul manuel</span>
                      </div>

                      {/* KPI 4 : Bulletins */}
                      <div className="rounded-xl border border-white/10 bg-white/5 p-2 sm:p-2.5 shadow-sm transition hover:border-white/20">
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="text-[9px] font-bold uppercase tracking-wide">Bulletins A4</span>
                          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-teal-500/20 text-teal-300">
                            <FileCheck2 className="h-3 w-3" />
                          </div>
                        </div>
                        <div className="mt-1 text-base sm:text-lg font-black text-white tracking-tight">48 / 48</div>
                        <span className="text-[9px] font-semibold text-emerald-400">Génération 1 clic</span>
                      </div>
                    </div>

                    {/* ═══ TABLEAU INTERACTIF DU PALMARÈS ═══ */}
                    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-md">
                      {/* Barre d'onglets de classes */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-white/5 px-2.5 sm:px-3 py-2">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span className="text-[10px] sm:text-[11px] font-bold text-slate-200">
                            Palmarès :
                          </span>
                          <div className="flex items-center gap-1">
                            {["3ème Sc. A", "4ème Bio", "2ème Litt."].map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => setSelectedClass(c)}
                                className={`rounded-md px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold transition cursor-pointer ${
                                  selectedClass === c
                                    ? "bg-blue-600 text-white shadow-xs ring-1 ring-blue-400/40"
                                    : "bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white"
                                }`}
                              >
                                {c}
                              </button>
                            ))}
                          </div>
                        </div>
                        <span className="text-[9px] font-semibold text-slate-400 hidden sm:inline">
                          Pondérations officielles EPST RDC
                        </span>
                      </div>

                      {/* Lignes d'élèves avec défilement fluide sur mobile */}
                      <div className="overflow-x-auto w-full max-w-full">
                        <table className="w-full min-w-[300px] sm:min-w-0 text-left text-xs">
                          <thead className="border-b border-white/10 bg-white/5 text-[9px] uppercase font-bold tracking-wider text-slate-400">
                            <tr>
                              <th className="px-2.5 sm:px-3 py-2">Nom & Postnom</th>
                              <th className="px-2 py-2">Math /20</th>
                              <th className="px-2 py-2 hidden xs:table-cell">Phys /20</th>
                              <th className="px-2 py-2">Moyenne</th>
                              <th className="px-2.5 sm:px-3 py-2 text-right">Mention</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 font-medium text-slate-200">
                            {activeStudents.map((st, i) => (
                              <tr
                                key={i}
                                className="hover:bg-white/5 transition-colors"
                              >
                                <td className="px-2.5 sm:px-3 py-2 font-bold text-white whitespace-nowrap text-[11px] sm:text-xs">
                                  {st.name}
                                </td>
                                <td className="px-2 py-2 text-slate-300 text-[11px] sm:text-xs">{st.sub1}</td>
                                <td className="px-2 py-2 text-slate-300 text-[11px] sm:text-xs hidden xs:table-cell">{st.sub2}</td>
                                <td className="px-2 py-2 font-bold text-cyan-300 text-[11px] sm:text-xs">
                                  {st.avg}{" "}
                                  <span className="text-[8px] sm:text-[9px] font-normal text-slate-400">/20</span>
                                </td>
                                <td className="px-2.5 sm:px-3 py-2 text-right whitespace-nowrap">
                                  {st.badgeTone === "gold" && (
                                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/15 px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-bold text-amber-300">
                                      <span className="h-1 w-1 rounded-full bg-amber-400" />
                                      {st.mention}
                                    </span>
                                  )}
                                  {st.badgeTone === "emerald" && (
                                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/15 px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-bold text-emerald-300">
                                      <span className="h-1 w-1 rounded-full bg-emerald-400" />
                                      {st.mention}
                                    </span>
                                  )}
                                  {st.badgeTone === "blue" && (
                                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-400/30 bg-blue-400/15 px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-bold text-blue-300">
                                      <span className="h-1 w-1 rounded-full bg-blue-400" />
                                      {st.mention}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* ═══ BADGES FLOTTANTS AUTOUR DU DASHBOARD ═══ */}
              <div className="absolute -top-4 -right-2 sm:-right-4 hidden sm:flex items-center gap-2.5 rounded-xl border border-white/20 bg-slate-900/95 px-3.5 py-2.5 shadow-xl backdrop-blur-md animate-float">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-sm">
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
                <div>
                  <p className="text-xs font-black text-white leading-tight">
                    Bulletins A4 prêts en 1 clic
                  </p>
                  <p className="text-[10px] font-medium text-slate-300">
                    Formules & mentions automatiques
                  </p>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-2 sm:-left-4 hidden sm:flex items-center gap-2.5 rounded-xl border border-white/20 bg-slate-900/95 px-3.5 py-2.5 shadow-xl backdrop-blur-md animate-float-delayed">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm">
                  <Smartphone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-black text-white leading-tight">
                    Saisie mobile & Hors-ligne
                  </p>
                  <p className="text-[10px] font-medium text-slate-300">
                    Même sans connexion internet stable
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      <DemoRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}