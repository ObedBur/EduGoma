import React from "react";

interface StepItemProps {
  number: string;
  title: string;
  description: string;
}

export function StepItem({ number, title, description }: StepItemProps) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-brand-secondary/30 hover:shadow-lg">
      <span className="mb-6 flex h-8 w-8 items-center justify-center rounded-lg bg-brand-secondary/10 font-mono text-xs font-bold text-brand-secondary">
        {number}
      </span>
      <h3 className="mb-2 text-lg font-bold leading-tight text-brand-primary">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-slate-600">
        {description}
      </p>
    </div>
  );
}
