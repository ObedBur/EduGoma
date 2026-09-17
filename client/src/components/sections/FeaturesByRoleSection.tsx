import React from "react";
import { SectionHeading } from "../ui/SectionHeading";
import { RoleBlock } from "../ui/RoleBlock";
import { DashboardMockup } from "../ui/DashboardMockup";

const ROLES = [
  {
    roleLabel: "Direction",
    title: "Pilotez avec une vue d'ensemble claire",
    description: "Fini de naviguer à vue. Obtenez les indicateurs clés de votre établissement en un clin d'œil.",
    features: [
      "Tableaux de bord consolidés des effectifs",
      "Suivi du taux global d'absentéisme",
      "Génération de rapports en un clic",
      "Vision claire sur la production des bulletins"
    ],
    mockupVariant: "browser" as const,
    stats: [
      { value: "450", label: "Élèves" },
      { value: "95%", label: "Présence" },
      { value: "18", label: "Classes" },
    ],
    rows: [
      { name: "Validation bulletins 3ème", badge: "Prêt", badgeVariant: "good" as const },
      { name: "Réunion des profs", badge: "Aujourd'hui", badgeVariant: "pending" as const },
    ]
  },
  {
    roleLabel: "Administration",
    title: "Automatisez la bureaucratie",
    description: "La secrétaire et l'administration gagnent des heures chaque semaine en automatisant les tâches répétitives.",
    features: [
      "Import/Export facile des listes d'élèves",
      "Génération automatique des bulletins périodiques",
      "Impression en masse des documents",
      "Gestion centralisée des archives"
    ],
    mockupVariant: "browser" as const,
    stats: [
      { value: "240", label: "Bulletins créés" },
      { value: "5", label: "Inscriptions" },
      { value: "12", label: "Attestations" },
    ],
    rows: [
      { name: "Impression bulletins", badge: "En cours", badgeVariant: "pending" as const },
      { name: "Mise à jour dossiers", badge: "Terminé", badgeVariant: "good" as const },
    ]
  },
  {
    roleLabel: "Enseignants",
    title: "Libérez-vous du calcul manuel",
    description: "Utilisez EduGoma sur votre téléphone pour saisir les notes. Le système calcule les moyennes pour vous.",
    features: [
      "Saisie des notes depuis smartphone",
      "Appel de présence numérique rapide",
      "Calcul automatique des moyennes",
      "Accès à l'historique de la classe"
    ],
    mockupVariant: "phone" as const,
    stats: [
      { value: "3ème A", label: "Classe active" },
      { value: "15/20", label: "Moyenne Math" },
    ],
    rows: [
      { name: "Interro Math - Lundi", badge: "Saisi", badgeVariant: "good" as const },
      { name: "Cotes de conduite", badge: "À faire", badgeVariant: "pending" as const },
    ]
  },
  {
    roleLabel: "Élèves & Parents",
    title: "Suivez la progression en temps réel",
    description: "Les familles sont impliquées grâce à un accès transparent aux résultats et à la ponctualité.",
    features: [
      "Consultation des notes dès publication",
      "Suivi des présences et retards",
      "Accès aux bulletins numériques",
      "Communication facilitée avec l'école"
    ],
    mockupVariant: "phone" as const,
    stats: [
      { value: "85%", label: "Moyenne Gén." },
      { value: "0", label: "Absences" },
    ],
    rows: [
      { name: "Bulletin Trimestre 1", badge: "Nouveau", badgeVariant: "good" as const },
      { name: "Réunion parents", badge: "12 Oct", badgeVariant: "pending" as const },
    ]
  },
];

export function FeaturesByRoleSection() {
  return (
    <section id="fonctionnalites" className="bg-white pb-8 pt-24">
      <div className="mx-auto mb-14 max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          align="center"
          eyebrow="Une plateforme, quatre points de vue" 
          title="Chaque rôle avance avec les bons outils" description="Une même source de vérité pour la direction, l'administration, les enseignants et les familles." 
        />
      </div>
      
      <div className="flex flex-col">
        {ROLES.map((role, idx) => (
          <RoleBlock
            key={idx}
            reverse={idx % 2 !== 0}
            roleLabel={role.roleLabel}
            title={role.title}
            description={role.description}
            features={role.features}
            mockup={
              <DashboardMockup 
                variant={role.mockupVariant} 
                title={role.roleLabel} 
                stats={role.stats} 
                rows={role.rows}
                showChart={role.mockupVariant === "browser"}
              />
            }
          />
        ))}
      </div>
    </section>
  );
}
