interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  ordinal?: string;
  className?: string;
}

export function SectionHeading({ eyebrow, title, description, align = "center", ordinal, className = "" }: SectionHeadingProps) {
  const isLeft = align === "left";

  return (
    <div className={`flex flex-col ${isLeft ? "items-start text-left" : "items-center text-center"} ${className}`}>
      <div className="mb-4 flex items-center gap-3">
        {isLeft && ordinal && <span className="font-mono text-sm font-bold tracking-widest text-brand-accent">{ordinal}</span>}
        <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-secondary"><span className="h-1.5 w-1.5 rounded-full bg-brand-accent" />{eyebrow}</span>
      </div>
      <h2 className="mb-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-[-0.03em] text-brand-primary md:text-4xl">{title}</h2>
      {description && <p className={`max-w-2xl text-lg leading-relaxed text-slate-600 ${isLeft ? "" : "mx-auto"}`}>{description}</p>}
    </div>
  );
}
