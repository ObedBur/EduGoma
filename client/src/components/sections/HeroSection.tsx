import React from "react";
import { ShieldCheck, LayoutGrid, CreditCard } from "lucide-react";

const WHATSAPP_NUMBER = "243XXXXXXXXXXX";

const WHATSAPP_MESSAGE = encodeURIComponent(
  "Bonjour, je souhaite une démonstration d'EduGoma pour mon établissement."
);

const PROMISES = [
  {
    icon: LayoutGrid,
    text: "Chaque école a son espace isolé — vos données ne mélangent jamais avec celles d'un autre établissement.",
  },
  {
    icon: CreditCard,
    text: "Inscriptions et paiements suivis ensemble dès le départ, plus besoin de cahiers séparés.",
  },
  {
    icon: ShieldCheck,
    text: "Bulletins générés automatiquement — fini les calculs à la main et les erreurs de transcription.",
  },
];

export function HeroSection() {
  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: Text */}
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.15] mb-6">
              Vos inscriptions papier se perdent, vos bulletins prennent une journée entière, et vos parents n&apos;ont jamais les bonnes informations.
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-10 max-w-xl">
              EduGoma est la seule plateforme qui gère{" "}
              <strong className="text-gray-900">plusieurs écoles à la fois</strong>,
              chacune avec son propre espace — pour les directeurs qui administrent
              un groupe d&apos;établissements ou pour les réseaux scolaires qui veulent
              une vue d&apos;ensemble sans mélanger les données.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-12">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-lg bg-brand-primary text-white hover:bg-brand-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:ring-offset-2 shadow-sm"
              >
                Demander une démo
              </a>
              <a
                href="#comment-ca-marche"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-lg border border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:ring-offset-2"
              >
                Voir comment ça marche
              </a>
            </div>

            {/* Promises */}
            <div className="flex flex-col gap-4 border-t border-gray-200 pt-8">
              {PROMISES.map((promise, idx) => {
                const Icon = promise.icon;
                return (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-md bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </span>
                    <p className="text-sm text-gray-600 leading-relaxed pt-0.5">
                      {promise.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Dashboard placeholder */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none lg:ml-auto">
            <div className="animate-[fadeInUp_0.8s_ease-out_both]">
              <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-100/60 flex flex-col items-center justify-center min-h-[320px] sm:min-h-[400px] p-8 text-center">
                <div className="w-12 h-12 rounded-lg bg-gray-200 mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-500">
                  Aperçu du tableau de bord
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Capture d&apos;écran à venir
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
