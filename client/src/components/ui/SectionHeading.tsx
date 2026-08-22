import React from "react";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  ordinal?: string;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  ordinal,
  className = "",
}: SectionHeadingProps) {
  const isLeft = align === "left";

  return (
    <div
      className={`flex flex-col ${
        isLeft ? "text-left items-start" : "text-center items-center"
      } ${className}`}
    >
      <div className="flex items-center gap-4 mb-3">
        {isLeft && ordinal && (
          <span className="text-4xl font-bold text-gray-200">{ordinal}</span>
        )}
        <span className="text-sm font-semibold uppercase tracking-wider text-brand-primary">
          {eyebrow}
        </span>
      </div>
      
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
        {title}
      </h2>
      
      {description && (
        <p className={`text-lg text-gray-600 max-w-2xl ${isLeft ? "" : "mx-auto"}`}>
          {description}
        </p>
      )}
    </div>
  );
}
