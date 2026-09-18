import React from "react";
import {
  GraduationCap,
  Star,
  CheckCircle2,
  MapPin,
  Users,
  TrendingUp,
  MessageSquareQuote,
} from "lucide-react";

const PILOT_SCHOOLS = [
  {
    name: "Institut Maendeleo de Goma",
    type: "Humanités Scientifiques & Commerciales",
    students: "680 élèves",
    classes: "18 classes",
    location: "Commune de Goma, NK1",
    feedback:
      "Avant EduGoma, on passait 3 semaines à calculer les bulletins à la main. Maintenant, en moins de 2 jours, les 18 classes sont délibérées et les bulletins imprimés.",
    author: "M. Kasereka V., Préfet des Études",
    rating: 5,
  },
  {
    name: "Complexe Scolaire Amani",
    type: "Primaire, Secondaire & Maternelle",
    students: "1 140 élèves",
    classes: "32 classes",
    location: "Commune de Karisimbi, Goma",
    feedback:
      "La gestion des minervals était un cauchemar. On renvoyait des élèves qui avaient pourtant payé. Avec le reçu numérique d'EduGoma, ce problème est définitivement réglé.",
    author: "Mme Kavira N., Secrétaire Générale",
    rating: 5,
  },
  {
    name: "École Pilote Nord-Kivu EPN",
    type: "Pédagogie Générale & Littéraires",
    students: "420 élèves",
    classes: "12 classes",
    location: "Bulenga, Nord-Kivu",
    feedback:
      "Mes enseignants saisissent les cotes sur leurs téléphones même sans réseau. Plus aucun registre perdu, plus aucune erreur de calcul en fin de période.",
    author: "Ir. Bahati M., Directeur Fondateur",
    rating: 5,
  },
];

const STATS = [
  { value: "3", label: "Écoles Pilotes Actives", sub: "Nord-Kivu, Goma" },
  { value: "2 240+", label: "Élèves Gérés", sub: "Dont 62 classes" },
  { value: "100%", label: "Bulletins Conformes EPST", sub: "Format national RDC" },
  { value: "0", label: "Registre Papier Perdu", sub: "Archivage cloud 10 ans" },
];

export function SocialProofBanner() {
  return (
    <section id="ecoles-pilotes" className="scroll-mt-28 relative overflow-hidden bg-white py-20 md:py-28 border-y border-slate-200/80">
      {/* Soft ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(37,99,235,0.05),transparent)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mx-auto mb-12 sm:mb-16 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/90 px-4 py-1.5 text-xs font-bold text-brand-secondary shadow-xs">
            <MapPin className="h-3.5 w-3.5 text-brand-secondary" />
            <span className="text-[11px] uppercase tracking-wider">
              Déjà Déployé à Goma, Nord-Kivu
            </span>
          </div>

          <h2 className="mb-4 text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
            Les directeurs de Goma nous font{" "}
            <span className="bg-gradient-to-r from-brand-secondary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              déjà confiance.
            </span>
          </h2>

          <p className="mx-auto max-w-2xl text-sm sm:text-lg text-slate-600 leading-relaxed">
            EduGoma est co-construit avec les écoles pilotes du Nord-Kivu pour s'assurer que chaque fonctionnalité répond aux réalités quotidiennes de vos établissements.
          </p>
        </div>

        {/* 4 Stat Metrics Strip */}
        <div className="mb-12 sm:mb-16 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {STATS.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-50/70 px-3 sm:px-4 py-4 sm:py-6 text-center shadow-xs"
            >
              <div className="text-2xl sm:text-4xl font-black tracking-tight text-brand-primary">
                {stat.value}
              </div>
              <div className="mt-1 sm:mt-1.5 text-[10px] sm:text-xs font-extrabold uppercase tracking-wide text-slate-700">
                {stat.label}
              </div>
              <div className="mt-0.5 text-[10px] sm:text-[11px] text-slate-400 font-medium">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* 3 School Testimonial Cards */}
        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3">
          {PILOT_SCHOOLS.map((school, idx) => (
            <div
              key={idx}
              className="group flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-sm transition-all duration-300 hover:border-brand-secondary/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-secondary/8"
            >
              {/* School Identity */}
              <div>
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-primary text-white shadow-sm">
                    <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: school.rating }).map((_, sIdx) => (
                      <Star
                        key={sIdx}
                        className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                </div>

                <h3 className="mb-1 text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                  {school.name}
                </h3>
                <p className="mb-1 text-xs font-medium text-brand-secondary">{school.type}</p>

                <div className="mb-4 flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {school.students}
                  </span>
                  <span>•</span>
                  <span>{school.classes}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {school.location}
                  </span>
                </div>

                {/* Testimonial Quote */}
                <div className="mb-5 rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 sm:p-4">
                  <MessageSquareQuote className="mb-2 h-4 w-4 sm:h-5 sm:w-5 text-brand-secondary/60" />
                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    &ldquo;{school.feedback}&rdquo;
                  </p>
                </div>
              </div>

              {/* Author & Verified Tag */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 sm:pt-4">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-700">{school.author}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  École Pilote
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom progression trust note */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center">
          <TrendingUp className="h-5 w-5 text-brand-secondary shrink-0" />
          <p className="text-xs sm:text-sm font-semibold text-slate-600">
            Programme pilote ouvert à 5 nouvelles écoles du Nord-Kivu pour la rentrée 2025–2026.
            <span className="block sm:inline sm:ml-1 text-brand-secondary font-bold underline underline-offset-2 cursor-pointer">
              Rejoindre la liste d'attente →
            </span>
          </p>
        </div>

      </div>
    </section>
  );
}
