import React from "react";

interface IconBadgeProps {
  icon: React.ReactNode;
  color?: string; // Tailwind class, e.g., 'bg-brand-primary' or 'bg-brand-secondary'
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function IconBadge({
  icon,
  color = "bg-brand-primary",
  size = "md",
  className = "",
}: IconBadgeProps) {
  const sizes = {
    sm: "w-8 h-8 p-1.5",
    md: "w-12 h-12 p-2.5",
    lg: "w-16 h-16 p-3.5",
  };

  return (
    <div
      className={`flex items-center justify-center rounded-xl text-white ${color} ${sizes[size]} ${className}`}
    >
      {/* Ensure the icon scales correctly based on the container */}
      <div className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">
        {icon}
      </div>
    </div>
  );
}
