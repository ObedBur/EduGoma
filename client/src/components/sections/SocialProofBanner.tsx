import React from "react";
import { CheckCircle } from "lucide-react";

const SOCIAL_CONTENT = {
  title: "En cours de déploiement avec des établissements pilotes à Goma",
  description: "Nous co-construisons EduGoma avec les écoles locales pour s'assurer que l'outil répond parfaitement à vos besoins quotidiens.",
  stats: [
    { value: "4", label: "Espaces de travail" },
    { value: "100%", label: "Sans papier" },
    { value: "RDC", label: "Pensé localement" },
  ]
};

export function SocialProofBanner() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-2xl p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="flex items-start gap-4 lg:max-w-md">
            <div className="w-12 h-12 bg-brand-primary text-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg mb-1 leading-tight">
                {SOCIAL_CONTENT.title}
              </h4>
              <p className="text-sm text-gray-600">
                {SOCIAL_CONTENT.description}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap md:flex-nowrap justify-center gap-6 md:gap-12 w-full lg:w-auto">
            {SOCIAL_CONTENT.stats.map((stat, idx) => (
              <React.Fragment key={idx}>
                <div className="text-center">
                  <div className="text-3xl font-black text-brand-primary mb-1">{stat.value}</div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">{stat.label}</div>
                </div>
                {idx < SOCIAL_CONTENT.stats.length - 1 && (
                  <div className="hidden md:block w-px bg-gray-200"></div>
                )}
              </React.Fragment>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
}
