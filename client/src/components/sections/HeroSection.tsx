import React from "react";
import { Button } from "../ui/Button";
import { DashboardMockup } from "../ui/DashboardMockup";
import { ShieldCheck, WifiOff, MapPin } from "lucide-react";

const HERO_CONTENT = {
  eyebrow: "Solution EduGoma · RDC",
  titleStart: "La gestion scolaire ",
  titleHighlight: "pensée",
  titleEnd: " pour les établissements congolais.",
  description: "Simplifiez le travail de votre direction, soulagez vos enseignants et impliquez les parents avec une plateforme locale, sécurisée et adaptée à nos réalités.",
  ctaPrimary: "Créer mon établissement →",
  ctaSecondary: "Découvrir EduGoma",
  trustBadges: [
    { icon: MapPin, text: "Pensé pour la RDC" },
    { icon: ShieldCheck, text: "Données sécurisées" },
    { icon: WifiOff, text: "Fiable même hors ligne" },
  ]
};

export function HeroSection() {
  const mockupStats = [
    { value: "450", label: "Élèves" },
    { value: "18", label: "Classes" },
    { value: "24", label: "Enseignants" },
  ];
  
  const mockupRows = [
    { name: "Bulletin T1 - 3ème A", badge: "Généré", badgeVariant: "good" as const },
    { name: "Présences - Lundi", badge: "En attente", badgeVariant: "pending" as const },
    { name: "Paiements - Septembre", badge: "À jour", badgeVariant: "good" as const },
  ];

  return (
    <section className="pt-32 pb-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text Content */}
          <div className="flex flex-col items-start text-left max-w-2xl">
            <span className="inline-block py-1 px-3 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-semibold mb-6">
              {HERO_CONTENT.eyebrow}
            </span>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
              {HERO_CONTENT.titleStart} <span className="text-brand-primary relative whitespace-nowrap">
                {HERO_CONTENT.titleHighlight}
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-brand-accent/60" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </span> {HERO_CONTENT.titleEnd}
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
              {HERO_CONTENT.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12 w-full sm:w-auto">
              <Button variant="primary" size="lg" href="#cta" className="w-full sm:w-auto">
                {HERO_CONTENT.ctaPrimary}
              </Button>
              <Button variant="outline" size="lg" href="#defis" className="w-full sm:w-auto">
                {HERO_CONTENT.ctaSecondary}
              </Button>
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 border-t border-gray-100 pt-8 w-full">
              {HERO_CONTENT.trustBadges.map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                    <Icon className="w-5 h-5 text-brand-primary" />
                    {badge.text}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Right Column: Dashboard Mockup */}
          <div className="relative mx-auto w-full max-w-[600px] lg:max-w-none lg:ml-auto">
            {/* Decorative background blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-primary/5 rounded-full blur-3xl -z-10"></div>
            
            <DashboardMockup 
              variant="browser" 
              title="Tableau de bord - Institut de Goma" 
              stats={mockupStats} 
              rows={mockupRows} 
              showChart={true}
              className="transform lg:scale-105 origin-left"
            />
          </div>
          
        </div>
      </div>
    </section>
  );
}
