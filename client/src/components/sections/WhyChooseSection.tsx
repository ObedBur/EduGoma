import React from "react";
import { SectionHeading } from "../ui/SectionHeading";
import { FeatureCard } from "../ui/FeatureCard";
import { Map, Shield, Smartphone, Timer, Wand2, MonitorSmartphone } from "lucide-react";

const FEATURES = [
  {
    icon: <Map />,
    title: "Sur mesure RDC",
    description: "Conçu spécifiquement pour le système éducatif congolais, avec ses réalités et ses formats de bulletins (Palmarès, etc.).",
  },
  {
    icon: <Shield />,
    title: "Sécurité des données",
    description: "Vos données sont sauvegardées en toute sécurité. Plus de risque de perdre un registre papier lors d'un incident.",
  },
  {
    icon: <Smartphone />,
    title: "Fiable & autonome",
    description: "Fonctionne même avec une connexion instable. Les données se synchronisent dès que le réseau est de retour.",
  },
  {
    icon: <Timer />,
    title: "Gain de temps réel",
    description: "Réduisez de 80% le temps passé par vos équipes sur les tâches administratives répétitives.",
  },
  {
    icon: <Wand2 />,
    title: "Réduction du travail manuel",
    description: "Fini les erreurs de calcul : moyennes, classements et pourcentages sont générés automatiquement sans erreur humaine.",
  },
  {
    icon: <MonitorSmartphone />,
    title: "Accessible multi-appareils",
    description: "Que vous utilisiez un vieil ordinateur de bureau, une tablette ou un smartphone, EduGoma s'adapte à votre matériel.",
  },
];

const SECTION_HEADER = {
  eyebrow: "La différence EduGoma",
  title: "Pourquoi choisir EduGoma ?",
};

export function WhyChooseSection() {
  return (
    <section id="pourquoi" className="bg-brand-primary py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading 
          align="center"
          eyebrow={SECTION_HEADER.eyebrow}
          title={SECTION_HEADER.title}
          className="mb-14 [&_h2]:text-white [&_span]:text-brand-accent [&_p]:text-white/70"
        />
        
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feat, idx) => (
            <FeatureCard
              key={idx}
              icon={feat.icon}
              title={feat.title}
              description={feat.description}
            />
          ))}
        </div>
        
      </div>
    </section>
  );
}
