import React from "react";
import { SectionHeading } from "../ui/SectionHeading";
import { StepItem } from "../ui/StepItem";

const STEPS = [
  {
    title: "Configuration",
    description: "Paramétrez votre école : niveaux, classes et année scolaire.",
  },
  {
    title: "Organisation",
    description: "Créez vos classes et importez vos élèves en quelques minutes.",
  },
  {
    title: "Affectation",
    description: "Attribuez enseignants et matières à chaque classe.",
  },
  {
    title: "Suivi",
    description: "Enregistrez présences et notes au quotidien, depuis n'importe où.",
  },
  {
    title: "Bulletins",
    description: "Générez et publiez les bulletins automatiquement, sans calcul manuel.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="comment-ca-marche" className="border-t border-slate-200/70 bg-surface-muted py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading 
          align="left" 
          ordinal="02" 
          eyebrow="Le parcours" 
          title="Comment EduGoma transforme votre gestion" 
          className="mb-14 max-w-2xl"
        />
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((step, idx) => (
            <StepItem
              key={idx}
              number={String(idx + 1).padStart(2, "0")}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
        
      </div>
    </section>
  );
}
