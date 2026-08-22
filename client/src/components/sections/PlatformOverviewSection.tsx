import React from "react";
import { SectionHeading } from "../ui/SectionHeading";
import { IconBadge } from "../ui/IconBadge";
import { User, BookOpen, GraduationCap, ClipboardList, Clock, FileStack, FolderOpen } from "lucide-react";

const CATEGORIES = [
  { icon: <User />, label: "Élèves", color: "bg-blue-500" },
  { icon: <BookOpen />, label: "Classes", color: "bg-indigo-500" },
  { icon: <GraduationCap />, label: "Enseignants", color: "bg-purple-500" },
  { icon: <ClipboardList />, label: "Notes", color: "bg-rose-500" },
  { icon: <Clock />, label: "Présences", color: "bg-orange-500" },
  { icon: <FileStack />, label: "Bulletins", color: "bg-emerald-500" },
  { icon: <FolderOpen />, label: "Documents", color: "bg-cyan-500" },
];

export function PlatformOverviewSection() {
  return (
    <section id="pour-qui" className="py-16 md:py-24 bg-gray-50 border-y border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading 
          align="center"
          eyebrow="Vue d'ensemble" 
          title="Une plateforme centralisée pour tout votre établissement" 
          className="mb-16"
        />
        
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
          {CATEGORIES.map((cat, idx) => (
            <div key={idx} className="flex flex-col items-center gap-3 w-28 sm:w-32 group">
              <div className="transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-lg rounded-xl">
                <IconBadge 
                  icon={cat.icon} 
                  color={cat.color} 
                  size="lg" 
                />
              </div>
              <span className="text-sm font-semibold text-gray-700 text-center">
                {cat.label}
              </span>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
