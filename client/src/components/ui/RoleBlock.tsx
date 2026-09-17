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
    <div className="border-b border-slate-200/70 py-16 last:border-0 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          <div className={`flex flex-col ${reverse ? "lg:order-2" : "lg:order-1"}`}>
            <span className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-brand-secondary">
              {roleLabel}
            </span>
            <h3 className="mb-4 text-3xl font-extrabold tracking-tight text-brand-primary">
              {title}
            </h3>
            <p className="mb-8 text-lg leading-relaxed text-slate-600">
              {description}
            </p>
            
            <ul className="space-y-4">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
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
