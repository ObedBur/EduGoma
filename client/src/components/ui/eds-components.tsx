/**
 * EduGoma Design System — Composants UI centralisés
 *
 * Ce fichier expose des composants pré-configurés aux couleurs et styles
 * du dashboard EduGoma. Il ne modifie pas les composants Shadcn/Radix de base,
 * mais les enveloppe avec les tokens visuels du projet.
 *
 * Usage :
 *   import { EdsButton, EdsInput, EdsCard } from "@/components/ui/eds-components";
 */

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// EdsButton
// ─────────────────────────────────────────────────────────────────────────────

type EdsButtonVariant = "primary" | "secondary" | "ghost" | "destructive" | "outline";
type EdsButtonSize = "sm" | "md" | "lg" | "icon";

interface EdsButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: EdsButtonVariant;
  size?: EdsButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
}

const buttonBase =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#102d48] disabled:pointer-events-none disabled:opacity-50 select-none";

const buttonVariants: Record<EdsButtonVariant, string> = {
  primary:
    "bg-[#102d48] text-white hover:bg-[#193d5e] active:bg-[#0c2136] shadow-sm hover:shadow-md",
  secondary:
    "bg-white text-[#33485d] border border-[#dce4ec] hover:bg-[#f5f8fb] hover:border-[#b6c5d4] active:bg-[#eaf0f6]",
  ghost:
    "text-[#687585] hover:bg-[#f0f4f8] hover:text-[#142c42] active:bg-[#e4eaf0]",
  destructive:
    "bg-[#dc2626] text-white hover:bg-[#b91c1c] active:bg-[#991b1b] shadow-sm hover:shadow-md",
  outline:
    "border border-[#102d48] text-[#102d48] bg-transparent hover:bg-[#102d48] hover:text-white active:bg-[#193d5e]",
};

const buttonSizes: Record<EdsButtonSize, string> = {
  sm:   "h-7  px-3    text-[11px] gap-1.5",
  md:   "h-9  px-4    text-[12px] gap-2",
  lg:   "h-11 px-5    text-[14px] gap-2",
  icon: "h-8  w-8     text-[12px] rounded-lg",
};

export const EdsButton = React.forwardRef<HTMLButtonElement, EdsButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(buttonBase, buttonVariants[variant], buttonSizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  },
);
EdsButton.displayName = "EdsButton";

// ─────────────────────────────────────────────────────────────────────────────
// EdsInput
// ─────────────────────────────────────────────────────────────────────────────

interface EdsInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const EdsInput = React.forwardRef<HTMLInputElement, EdsInputProps>(
  ({ className, label, hint, error, leftAddon, rightAddon, id, ...props }, ref) => {
    const inputId = id ?? React.useId();
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-[11px] font-semibold text-[#33485d]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAddon && (
            <span className="absolute left-3 flex items-center text-[#8793a2]">
              {leftAddon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "w-full rounded-lg border bg-white text-[12px] text-[#142c42] placeholder:text-[#9aa5b1]",
              "h-9 px-3 py-2",
              "border-[#dce4ec]",
              "transition-all duration-150",
              "focus:outline-none focus:border-[#4f8bb9] focus:ring-2 focus:ring-[#4f8bb9]/20",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#f5f8fb]",
              error && "border-[#dc2626] focus:border-[#dc2626] focus:ring-[#dc2626]/20",
              leftAddon && "pl-9",
              rightAddon && "pr-9",
              className,
            )}
            {...props}
          />
          {rightAddon && (
            <span className="absolute right-3 flex items-center text-[#8793a2]">
              {rightAddon}
            </span>
          )}
        </div>
        {hint && !error && (
          <p className="text-[10px] text-[#8793a2]">{hint}</p>
        )}
        {error && (
          <p className="text-[10px] text-[#dc2626] font-medium">{error}</p>
        )}
      </div>
    );
  },
);
EdsInput.displayName = "EdsInput";

// ─────────────────────────────────────────────────────────────────────────────
// EdsSelect
// ─────────────────────────────────────────────────────────────────────────────

interface EdsSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  placeholder?: string;
}

export const EdsSelect = React.forwardRef<HTMLSelectElement, EdsSelectProps>(
  ({ className, label, hint, error, placeholder, id, children, ...props }, ref) => {
    const selectId = id ?? React.useId();
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={selectId} className="text-[11px] font-semibold text-[#33485d]">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              "w-full appearance-none rounded-lg border bg-white text-[12px] text-[#142c42]",
              "h-9 pl-3 pr-8 py-2",
              "border-[#dce4ec]",
              "transition-all duration-150",
              "focus:outline-none focus:border-[#4f8bb9] focus:ring-2 focus:ring-[#4f8bb9]/20",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#f5f8fb]",
              error && "border-[#dc2626] focus:border-[#dc2626] focus:ring-[#dc2626]/20",
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {children}
          </select>
          {/* Custom chevron */}
          <svg
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8793a2]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {hint && !error && <p className="text-[10px] text-[#8793a2]">{hint}</p>}
        {error && <p className="text-[10px] text-[#dc2626] font-medium">{error}</p>}
      </div>
    );
  },
);
EdsSelect.displayName = "EdsSelect";

// ─────────────────────────────────────────────────────────────────────────────
// EdsTextarea
// ─────────────────────────────────────────────────────────────────────────────

interface EdsTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const EdsTextarea = React.forwardRef<HTMLTextAreaElement, EdsTextareaProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const textareaId = id ?? React.useId();
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={textareaId} className="text-[11px] font-semibold text-[#33485d]">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            "w-full rounded-lg border bg-white text-[12px] text-[#142c42] placeholder:text-[#9aa5b1]",
            "px-3 py-2 min-h-[80px] resize-y",
            "border-[#dce4ec]",
            "transition-all duration-150",
            "focus:outline-none focus:border-[#4f8bb9] focus:ring-2 focus:ring-[#4f8bb9]/20",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#f5f8fb]",
            error && "border-[#dc2626] focus:border-[#dc2626] focus:ring-[#dc2626]/20",
            className,
          )}
          {...props}
        />
        {hint && !error && <p className="text-[10px] text-[#8793a2]">{hint}</p>}
        {error && <p className="text-[10px] text-[#dc2626] font-medium">{error}</p>}
      </div>
    );
  },
);
EdsTextarea.displayName = "EdsTextarea";

// ─────────────────────────────────────────────────────────────────────────────
// EdsCard
// ─────────────────────────────────────────────────────────────────────────────

type EdsCardVariant = "default" | "glass" | "flat" | "danger";

interface EdsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: EdsCardVariant;
  padding?: "none" | "sm" | "md" | "lg";
}

const cardVariants: Record<EdsCardVariant, string> = {
  default:
    "bg-white border border-[#e4eaf0] shadow-[0_2px_8px_rgba(16,45,72,0.06)] rounded-xl",
  glass:
    "bg-white/70 backdrop-blur-md border border-white/60 shadow-[0_4px_16px_rgba(16,45,72,0.08)] rounded-xl",
  flat:
    "bg-[#f5f8fb] border border-[#e4eaf0] rounded-xl",
  danger:
    "bg-[#fff5f5] border border-[#f5c6cc] rounded-xl",
};

const cardPaddings = {
  none: "",
  sm:   "p-3",
  md:   "p-5",
  lg:   "p-7",
};

export const EdsCard = React.forwardRef<HTMLDivElement, EdsCardProps>(
  ({ className, variant = "default", padding = "md", children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants[variant], cardPaddings[padding], className)}
      {...props}
    >
      {children}
    </div>
  ),
);
EdsCard.displayName = "EdsCard";

export const EdsCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center justify-between pb-3 mb-3 border-b border-[#f0f3f7]", className)}
      {...props}
    />
  ),
);
EdsCardHeader.displayName = "EdsCardHeader";

export const EdsCardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-[13px] font-bold text-[#142c42] tracking-tight", className)}
      {...props}
    />
  ),
);
EdsCardTitle.displayName = "EdsCardTitle";

// ─────────────────────────────────────────────────────────────────────────────
// Edsbadge (inline status badge)
// ─────────────────────────────────────────────────────────────────────────────

type EdsBadgeTone = "blue" | "green" | "orange" | "red" | "gray" | "violet";

interface EdsBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: EdsBadgeTone;
  dot?: boolean;
}

const badgeTones: Record<EdsBadgeTone, string> = {
  blue:   "bg-[#e6f1fc] text-[#4a86b7] border-[#c6ddf5]",
  green:  "bg-[#e5f7ef] text-[#379d78] border-[#c8edd8]",
  orange: "bg-[#fff0db] text-[#ba7938] border-[#fde9b8]",
  red:    "bg-[#ffe5e5] text-[#c55d63] border-[#f5c6cc]",
  gray:   "bg-[#eef2f5] text-[#71808d] border-[#dce4ec]",
  violet: "bg-[#ecebff] text-[#6e6ac3] border-[#d5d3fa]",
};

const dotColors: Record<EdsBadgeTone, string> = {
  blue:   "bg-[#4a86b7]",
  green:  "bg-[#379d78]",
  orange: "bg-[#ba7938]",
  red:    "bg-[#c55d63]",
  gray:   "bg-[#71808d]",
  violet: "bg-[#6e6ac3]",
};

export const EdsBadge = React.forwardRef<HTMLSpanElement, EdsBadgeProps>(
  ({ className, tone = "gray", dot = false, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold",
        badgeTones[tone],
        className,
      )}
      {...props}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", dotColors[tone])} />}
      {children}
    </span>
  ),
);
EdsBadge.displayName = "EdsBadge";
