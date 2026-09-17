import React from "react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex h-full flex-col items-start gap-4 rounded-2xl border border-white/10 bg-white/10 p-7 transition hover:-translate-y-1 hover:bg-white/15">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-accent/15 text-brand-accent [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </div>
      <div>
        <h3 className="mb-2 text-lg font-bold text-white">{title}</h3>
        <p className="text-sm leading-relaxed text-white/65">{description}</p>
      </div>
    </div>
  );
}
