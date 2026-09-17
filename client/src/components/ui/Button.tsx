import React from "react";
import Link from "next/link";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "outline-light" | "white";
  size?: "md" | "lg";
  href?: string;
  children: React.ReactNode;
}

export function Button({ variant = "primary", size = "md", href, children, className = "", ...props }: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-bold transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-brand-accent/60 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    primary: "bg-brand-primary text-white shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary",
    outline: "border border-slate-200 bg-white/70 text-brand-primary shadow-sm hover:border-brand-secondary/30 hover:bg-white",
    "outline-light": "border border-white/30 bg-transparent text-white hover:bg-white/10",
    white: "bg-white text-brand-primary shadow-lg shadow-brand-primary/10 hover:bg-cyan-50",
  };
  const sizes = { md: "px-4 py-2.5 text-sm", lg: "px-6 py-3.5 text-base" };
  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) return <Link href={href} className={classes}>{children}</Link>;
  return <button className={classes} {...props}>{children}</button>;
}
