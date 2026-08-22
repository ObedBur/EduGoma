import React from "react";
import { Check } from "lucide-react";
import { DashboardMockupProps } from "./DashboardMockup";

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
    <div className="py-16 md:py-24 border-b border-gray-200 border-dashed last:border-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          <div className={`flex flex-col ${reverse ? "lg:order-2" : "lg:order-1"}`}>
            <span className="text-sm font-semibold uppercase tracking-wider text-brand-secondary mb-3">
              {roleLabel}
            </span>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {title}
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              {description}
            </p>
            
            <ul className="space-y-4">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">{feature}</span>
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
