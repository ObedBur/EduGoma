import React from "react";

interface StepItemProps {
  number: string;
  title: string;
  description: string;
}

export function StepItem({ number, title, description }: StepItemProps) {
  return (
    <div className="flex flex-col pl-6 py-2 border-l-2 border-gray-200 hover:border-brand-primary transition-colors h-full">
      <span className="font-mono text-sm font-bold text-brand-primary mb-3">
        {number}
      </span>
      <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
        {title}
      </h3>
      <p className="text-sm text-gray-600">
        {description}
      </p>
    </div>
  );
}
