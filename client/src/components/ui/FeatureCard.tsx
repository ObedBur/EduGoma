import React from "react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="p-8 bg-white hover:bg-gray-50 transition-colors flex flex-col items-start gap-4 h-full">
      <div className="text-brand-primary w-8 h-8 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
