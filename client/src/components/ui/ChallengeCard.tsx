import React from "react";
import { IconBadge } from "./IconBadge";

interface ChallengeCardProps {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  highlighted?: boolean;
  children?: React.ReactNode;
}

export function ChallengeCard({
  number,
  icon,
  title,
  description,
  highlighted = false,
  children,
}: ChallengeCardProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-6 border-b border-gray-200 border-dashed last:border-b-0 ${
        highlighted ? "bg-brand-primary text-white rounded-xl border-none" : "bg-transparent text-gray-900"
      }`}
    >
      <div className={`font-mono text-lg font-bold shrink-0 ${highlighted ? "text-white/80" : "text-gray-400"}`}>
        {number}
      </div>
      
      <div className="shrink-0">
        <IconBadge 
          icon={icon} 
          color={highlighted ? "bg-white/20 text-white" : "bg-brand-primary text-white"} 
          size="sm" 
        />
      </div>
      
      <div className="flex-1">
        <h3 className={`text-lg font-bold mb-1 ${highlighted ? "text-white" : "text-gray-900"}`}>
          {title}
        </h3>
        <p className={`text-sm ${highlighted ? "text-white/90" : "text-gray-600"}`}>
          {description}
        </p>
      </div>
      
      {children && (
        <div className="shrink-0 mt-4 sm:mt-0">
          {children}
        </div>
      )}
    </div>
  );
}
