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
    <section id="pour-qui" className="border-y border-slate-200/70 bg-surface-muted py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        <SectionHeading 
          align="center"
          eyebrow="Vue d'ensemble" 
          title="Une plateforme centralisée pour tout votre établissement" 
          className="mb-14 max-w-2xl mx-auto"
        />
        
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {CATEGORIES.map((cat, idx) => (
            <div key={idx} className="group flex flex-col items-center gap-3 rounded-2xl border border-white/80 bg-white/75 px-3 py-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-lg rounded-xl">
                <IconBadge 
                  icon={cat.icon} 
                  color={cat.color} 
                  size="lg" 
                />
              </div>
              <span className="text-center text-sm font-bold text-brand-primary">
                {cat.label}
              </span>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
