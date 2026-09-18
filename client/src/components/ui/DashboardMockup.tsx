"use client";

import React, { useState } from "react";
import {
  Users,
  FileCheck2,
  Clock,
  Sparkles,
  CheckCircle2,
  GraduationCap,
  LayoutDashboard,
  Award,
  Wifi,
  Smartphone,
  Check,
  ChevronRight,
  Calculator
} from "lucide-react";

export interface DashboardMockupProps {
  variant?: "browser" | "phone";
  title?: string;
  stats?: { value: string; label: string }[];
  rows?: { name: string; badge: string; badgeVariant: "good" | "pending" }[];
  showChart?: boolean;
  className?: string;
}

export function DashboardMockup({
  variant = "browser",
  title = "Tableau de Bord Directeur",
  stats,
  rows,
  className = "",
}: DashboardMockupProps) {
  const [selectedClass, setSelectedClass] = useState("3ème Sc. A");

  // Mobile phone mockup layout (used in Role blocks)
  if (variant === "phone") {
    return (
      <div
        className={`relative mx-auto w-full max-w-[310px] rounded-[2.5rem] border-[6px] border-slate-900 bg-white p-3 shadow-2xl shadow-brand-primary/20 ${className}`}
      >
        {/* Notch */}
        <div className="absolute left-1/2 top-2 h-4 w-28 -translate-x-1/2 rounded-full bg-slate-900" />

        <div className="mt-5 space-y-4 rounded-[1.8rem] bg-slate-50 p-3.5 pt-4">
          {/* Header in phone */}
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-secondary">
                EduGoma Mobile
              </span>
              <h4 className="text-sm font-extrabold text-brand-primary">{title}</h4>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Direct
            </span>
          </div>

          {/* Stats quick view */}
          <div className="grid grid-cols-2 gap-2">
            {(stats || [
              { value: "3ème A", label: "Classe active" },
              { value: "16.4/20", label: "Moyenne" },
            ]).map((s, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200/70 bg-white p-2.5 shadow-sm"
              >
                <div className="text-base font-extrabold text-brand-primary">{s.value}</div>
                <div className="text-[10px] font-medium text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Task or Grades List */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Activités récentes
            </span>
            {(rows || [
              { name: "Saisie cotes Math", badge: "Enregistré", badgeVariant: "good" },
              { name: "Appel de présence", badge: "Terminé", badgeVariant: "good" },
            ]).map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white p-2.5 shadow-xs"
              >
                <span className="text-xs font-semibold text-slate-700 truncate max-w-[140px]">
                  {r.name}
                </span>
                <span
                  className={`rounded-md px-2 py-0.5 text-[9px] font-bold ${
                    r.badgeVariant === "good"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {r.badge}
                </span>
              </div>
            ))}
          </div>

          {/* Quick Action Button */}
          <div className="rounded-xl bg-brand-primary p-2.5 text-center text-xs font-bold text-white shadow-md">
            Générer le bulletin PDF
          </div>
        </div>
      </div>
    );
  }

  // Premium Browser SaaS Preview (Used in Hero & Desktop views)
  return (
    <div className={`relative ${className}`}>
      {/* Dynamic Ambient Background Glow */}
      <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-brand-secondary/25 via-indigo-500/15 to-brand-accent/20 opacity-80 blur-2xl -z-10" />

      {/* Main Browser Window */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_25px_65px_-15px_rgba(15,31,58,0.16)] ring-1 ring-slate-900/5">
        
        {/* Browser Chrome Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-100/90 px-4 py-3 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56] shadow-xs" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e] shadow-xs" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f] shadow-xs" />
          </div>

          {/* Clean URL bar that fits without truncate */}
          <div className="flex items-center justify-center gap-2 rounded-lg border border-slate-200/70 bg-white/90 px-3.5 py-1 text-[11px] font-medium text-slate-600 shadow-xs sm:w-64">
            <div className="flex items-center gap-1 text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[10px] text-slate-400">https://</span>
            </div>
            <span className="font-mono text-slate-700 font-semibold tracking-tight">
              app.edugoma.cd/deliberations
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
              <Wifi className="h-3 w-3 text-emerald-600" />
              <span className="hidden sm:inline">Sync Active</span>
            </span>
          </div>
        </div>

        {/* Dashboard Shell */}
        <div className="flex bg-[#fcfdfe]">
          {/* Mini Sidebar */}
          <aside className="hidden w-16 flex-col items-center gap-4 border-r border-slate-200/70 bg-white py-5 sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-primary text-white shadow-sm ring-2 ring-brand-secondary/20">
              <GraduationCap className="h-4 w-4 text-brand-accent" />
            </div>
            
            <nav className="flex flex-col gap-2.5 pt-3" aria-label="Menu du dashboard">
              <button
                type="button"
                className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-brand-secondary/10 text-brand-secondary shadow-xs transition"
                title="Tableau de bord"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="absolute -left-1 top-1.5 h-5 w-1 rounded-r-full bg-brand-secondary" />
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                title="Gestion des élèves"
              >
                <Users className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                title="Cotes & Palmarès"
              >
                <Award className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                title="Bulletins officiels"
              >
                <FileCheck2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                title="Calculateur automatique"
              >
                <Calculator className="h-4 w-4" />
              </button>
            </nav>
          </aside>

          {/* Main Workspace Area */}
          <div className="min-w-0 flex-1 p-4 sm:p-5 lg:p-6 space-y-4">
            
            {/* Top Workspace Header */}
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-brand-secondary">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-secondary" />
                    Établissement Pilote • Goma
                  </span>
                  <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[9px] font-semibold text-slate-600 shadow-xs">
                    Année 2024–2025
                  </span>
                </div>
                <h3 className="mt-1 text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                  Institut de Goma — Session de Délibération
                </h3>
              </div>

              {/* Status Pill Button */}
              <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 text-xs font-bold text-emerald-800 shadow-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Palmarès T1 Conforme RDC</span>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs transition hover:border-slate-300">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[10px] font-bold uppercase tracking-wide">Élèves</span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                    <Users className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="mt-1.5 text-xl font-extrabold text-slate-900 tracking-tight">1 420</div>
                <span className="text-[10px] font-semibold text-emerald-600">+12% vs 2023</span>
              </div>

              <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs transition hover:border-slate-300">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[10px] font-bold uppercase tracking-wide">Présence</span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
                    <Clock className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="mt-1.5 text-xl font-extrabold text-slate-900 tracking-tight">98.4%</div>
                <span className="text-[10px] font-semibold text-slate-500">Aujourd&apos;hui</span>
              </div>

              <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs transition hover:border-slate-300">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[10px] font-bold uppercase tracking-wide">Calculs</span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-50 text-amber-600">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="mt-1.5 text-xl font-extrabold text-emerald-600 tracking-tight">100% Auto</div>
                <span className="text-[10px] font-semibold text-emerald-600">0 calcul manuel</span>
              </div>

              <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs transition hover:border-slate-300">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[10px] font-bold uppercase tracking-wide">Bulletins</span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-teal-50 text-teal-600">
                    <FileCheck2 className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="mt-1.5 text-xl font-extrabold text-slate-900 tracking-tight">48 / 48</div>
                <span className="text-[10px] font-semibold text-emerald-600">Classes prêtes</span>
              </div>
            </div>

            {/* Interactive Data Table: Real Grades and Automated Calculations */}
            <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs">
              {/* Table Bar with Filters */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">
                    Extrait Palmarès :
                  </span>
                  <div className="flex items-center gap-1">
                    {["3ème Sc. A", "4ème Bio", "2ème Litt."].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedClass(c)}
                        className={`rounded-lg px-2 py-0.5 text-[10px] font-bold transition ${
                          selectedClass === c
                            ? "bg-brand-primary text-white shadow-xs"
                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-slate-500 hidden sm:inline">
                  Pondérations officielles RDC appliquées
                </span>
              </div>

              {/* Data Table Content */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-100 bg-slate-50/50 text-[10px] uppercase font-bold tracking-wider text-slate-500">
                    <tr>
                      <th className="px-3.5 py-2.5">Nom & Postnom</th>
                      <th className="px-2.5 py-2.5">Math /20</th>
                      <th className="px-2.5 py-2.5">Phys /20</th>
                      <th className="px-2.5 py-2.5">Moyenne</th>
                      <th className="px-3.5 py-2.5 text-right">Mention Officielle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-3.5 py-2.5 font-bold text-slate-900">
                        Kavira Masika Divine
                      </td>
                      <td className="px-2.5 py-2.5 text-slate-600">18.5</td>
                      <td className="px-2.5 py-2.5 text-slate-600">17.0</td>
                      <td className="px-2.5 py-2.5 font-bold text-emerald-600">
                        17.8 <span className="text-[10px] font-normal text-slate-400">/20</span>
                      </td>
                      <td className="px-3.5 py-2.5 text-right">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                          <span className="h-1 w-1 rounded-full bg-emerald-500" />
                          Grande Distinction
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-3.5 py-2.5 font-bold text-slate-900">
                        Bahati Mugisho Alain
                      </td>
                      <td className="px-2.5 py-2.5 text-slate-600">15.0</td>
                      <td className="px-2.5 py-2.5 text-slate-600">14.5</td>
                      <td className="px-2.5 py-2.5 font-bold text-brand-secondary">
                        14.8 <span className="text-[10px] font-normal text-slate-400">/20</span>
                      </td>
                      <td className="px-3.5 py-2.5 text-right">
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200/60 px-2 py-0.5 text-[9px] font-bold text-blue-700">
                          <span className="h-1 w-1 rounded-full bg-blue-500" />
                          Satisfaction
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-3.5 py-2.5 font-bold text-slate-900">
                        Amani Kasereka Joel
                      </td>
                      <td className="px-2.5 py-2.5 text-slate-600">16.0</td>
                      <td className="px-2.5 py-2.5 text-slate-600">16.5</td>
                      <td className="px-2.5 py-2.5 font-bold text-emerald-600">
                        16.3 <span className="text-[10px] font-normal text-slate-400">/20</span>
                      </td>
                      <td className="px-3.5 py-2.5 text-right">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                          <span className="h-1 w-1 rounded-full bg-emerald-500" />
                          Distinction
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Floating Micro-Badge Top Right */}
      <div className="absolute -top-5 -right-3 sm:-right-6 hidden sm:flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/95 px-4 py-3 shadow-[0_12px_32px_rgba(15,31,58,0.12)] backdrop-blur-md ring-1 ring-black/5 animate-float">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-sm">
          <Check className="h-5 w-5 stroke-[3]" />
        </div>
        <div>
          <p className="text-xs font-extrabold text-slate-900 leading-tight">
            Bulletins prêts en 1 clic
          </p>
          <p className="text-[10px] font-medium text-slate-500">
            Formules & mentions automatiques
          </p>
        </div>
      </div>

      {/* Floating Micro-Badge Bottom Left */}
      <div className="absolute -bottom-5 -left-3 sm:-left-6 hidden sm:flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/95 px-4 py-3 shadow-[0_12px_32px_rgba(15,31,58,0.12)] backdrop-blur-md ring-1 ring-black/5 animate-float-delayed">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-secondary to-indigo-600 text-white shadow-sm">
          <Smartphone className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-extrabold text-slate-900 leading-tight">
            Saisie mobile enseignants
          </p>
          <p className="text-[10px] font-medium text-slate-500">
            Fonctionne même avec réseau instable
          </p>
        </div>
      </div>
    </div>
  );
}
