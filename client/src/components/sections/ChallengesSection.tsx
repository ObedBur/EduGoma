import React from "react";
import { SectionHeading } from "../ui/SectionHeading";
import { ChallengeCard } from "../ui/ChallengeCard";
import { ScrollText, Calculator, Users, FileText, AlertTriangle } from "lucide-react";

const CHALLENGES = [
  {
    icon: <ScrollText />,
    title: "Registres papier encombrants",
    description: "Des piles de dossiers qui prennent de la place, s'abîment avec le temps et rendent la recherche d'informations très lente.",
    highlighted: false,
  },
  {
    icon: <Calculator />,
    title: "Calcul manuel et notatoire",
    description: "Des heures perdues par les enseignants à calculer des moyennes à la main, avec des risques constants d'erreurs.",
    highlighted: false,
  },
  {
    icon: <Users />,
    title: "Suivi précaire des présences",
    description: "Des fiches d'appel volantes difficiles à consolider pour détecter rapidement l'absentéisme.",
    highlighted: false,
  },
  {
    icon: <FileText />,
    title: "Création fastidieuse des bulletins",
    description: "La période des bulletins est un cauchemar logistique pour l'administration et le secrétariat.",
    highlighted: false,
  },
  {
    icon: <AlertTriangle />,
    title: "Manque de visibilité globale",
    description: "Il est impossible pour la direction d'avoir une vue d'ensemble sur la santé de l'établissement en temps réel.",
    highlighted: true,
    tag: "Le point de blocage n°1 des directions"
  },
];

export function ChallengesSection() {
  return (
    <section id="defis" className="relative overflow-hidden bg-white py-20 md:py-28">
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        <SectionHeading 
          align="left" 
          ordinal="01" 
          eyebrow="Le constat" 
          title="Les défis de la gestion scolaire traditionnelle" 
          className="mb-12 max-w-2xl"
        />
        
        <div className="flex flex-col">
          {CHALLENGES.map((challenge, idx) => (
            <ChallengeCard
              key={idx}
              number={String(idx + 1).padStart(2, "0")}
              icon={challenge.icon}
              title={challenge.title}
              description={challenge.description}
              highlighted={challenge.highlighted}
            >
              {challenge.tag && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-accent text-white shadow-sm">
                  {challenge.tag}
                </span>
              )}
            </ChallengeCard>
          ))}
        </div>
        
      </div>
    </section>
  );
}
