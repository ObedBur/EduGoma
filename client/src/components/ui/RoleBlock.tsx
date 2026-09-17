import React from "react";
import { Check } from "lucide-react";

interface RoleBlockProps {
  roleLabel: string;
  title: string;
  description: string;
  features: string[];
  mockup: React.ReactNode;
  reverse?: boolean;
}

export function RoleBlock({
  roleLabel,
  title,
  description,
  features,
  mockup,
  reverse = false,
}: RoleBlockProps) {
  return (
    <div className={`border-b border-slate-200/70 py-12 last:border-0 md:py-16 ${reverse ? "bg-surface-muted" : "bg-white"}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-20">
          
          <div className={`flex flex-col ${reverse ? "lg:order-2" : "lg:order-1"}`}>
            <span className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-brand-secondary">
              {roleLabel}
            </span>
            <h3 className="mb-4 max-w-xl text-3xl font-extrabold tracking-[-0.03em] text-brand-primary md:text-4xl">
              {title}
            </h3>
            <p className="mb-7 max-w-lg text-base leading-relaxed text-slate-600 md:text-lg">
              {description}
            </p>
            
            <ul className="grid max-w-lg gap-3 sm:grid-cols-2">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2.5 rounded-xl border border-slate-200/70 bg-white/70 px-3 py-3 text-sm shadow-sm">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  <span className="font-semibold text-slate-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className={`${reverse ? "lg:order-1" : "lg:order-2"}`}>
            {mockup}
          </div>
          
        </div>
      </div>
    </div>
  );
}
