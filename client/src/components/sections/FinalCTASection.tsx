"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  PhoneCall,
  MessageCircle,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  Zap,
} from "lucide-react";
import { DemoRequestModal } from "../ui/DemoRequestModal";

const TRUST_BADGES = [
  { icon: ShieldCheck, text: "Conforme EPST Nord-Kivu" },
  { icon: Clock, text: "Opérationnel en 48h" },
  { icon: CheckCircle2, text: "Sans carte bancaire" },
  { icon: Zap, text: "Formateur local inclus" },
];

export function FinalCTASection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section
        id="cta"
        className="relative overflow-hidden bg-slate-950 py-24 md:py-32"
      >
        {/* Rich ambient background layers */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_0%,rgba(37,99,235,0.28),rgba(0,0,0,0))]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_100%,rgba(6,182,212,0.12),rgba(0,0,0,0))]" />
        <div className="pointer-events-none absolute left-0 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 bottom-0 h-[500px] w-[500px] translate-x-1/2 rounded-full bg-indigo-600/15 blur-[120px]" />
        {/* Subtle dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          
          {/* Central CTA Block */}
          <div className="mb-14 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-xs font-bold text-blue-300 shadow-sm backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span className="text-[11px] uppercase tracking-widest">
                Passez à l'Action — Programme Pilote 2025
              </span>
            </div>

            <h2 className="mx-auto mb-6 max-w-4xl text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.12] sm:leading-[1.08]">
              Votre école mérite une gestion{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                aussi sérieuse que vos élèves.
              </span>
            </h2>

            <p className="mx-auto mb-8 sm:mb-10 max-w-2xl text-sm sm:text-lg text-slate-300 leading-relaxed">
              Rejoignez les écoles pilotes de Goma. Déployez EduGoma en 48 heures avec l'accompagnement complet de notre équipe locale — sans engagement et sans frais cachés.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col items-center justify-center gap-3.5 sm:gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="group inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-white px-5 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-black text-slate-900 shadow-[0_0_0_1px_rgba(255,255,255,0.15),0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-200 hover:bg-blue-50 hover:shadow-[0_0_0_1px_rgba(59,130,246,0.5),0_20px_40px_rgba(37,99,235,0.25)] active:scale-[0.98] sm:w-auto cursor-pointer"
              >
                <PhoneCall className="h-4 w-4 text-brand-secondary" />
                <span>Demander une démonstration gratuite</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>

              <Link
                href="https://wa.me/243XXXXXXXXXXX?text=Bonjour%2C%20je%20souhaite%20d%C3%A9marrer%20EduGoma%20dans%20mon%20%C3%A9tablissement."
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-full items-center justify-center gap-2.5 rounded-2xl border border-white/15 bg-white/5 px-5 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-white backdrop-blur-md transition-all duration-200 hover:bg-white/10 hover:border-white/30 active:scale-[0.98] sm:w-auto"
              >
                <MessageCircle className="h-4 w-4 text-emerald-400" />
                <span>Contacter sur WhatsApp</span>
              </Link>
            </div>
          </div>

          {/* 4 Trust Badges Row */}
          <div className="mb-10 sm:mb-14 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {TRUST_BADGES.map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/10 bg-white/5 px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-slate-300 backdrop-blur-md"
                >
                  <Icon className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{badge.text}</span>
                </div>
              );
            })}
          </div>

          {/* Bottom 3-column Value Pillars */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 text-center backdrop-blur-xl">
              <div className="mx-auto mb-3 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400">
                <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h4 className="mb-1 text-sm font-extrabold text-white">
                Formation gratuite sur site
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Notre formateur se déplace dans votre établissement pour former direction, secrétariat et enseignants en 2h.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-500/30 bg-blue-600/10 p-4 sm:p-5 text-center backdrop-blur-xl ring-1 ring-blue-500/20">
              <div className="mx-auto mb-3 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h4 className="mb-1 text-sm font-extrabold text-white">
                Opérationnel en 48 heures
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                De l'importation de vos listes à la production des premiers bulletins : 48 heures suffisent pour transformer votre gestion.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 text-center backdrop-blur-xl">
              <div className="mx-auto mb-3 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-emerald-600/20 text-emerald-400">
                <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h4 className="mb-1 text-sm font-extrabold text-white">
                Sans engagement, sans risque
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Testez EduGoma avec les données réelles d'une classe avant tout engagement financier. Votre satisfaction est notre priorité.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Demo Request Modal */}
      <DemoRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
