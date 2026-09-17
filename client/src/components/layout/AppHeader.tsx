"use client";

import React from "react";
import { Menu } from "lucide-react";

interface AppHeaderProps {
  onMenuToggle: () => void;
}

export function AppHeader({ onMenuToggle }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-14 bg-white/80 backdrop-blur-md border-b border-gray-200/60 flex items-center px-4 md:hidden flex-shrink-0">
      <button
        onClick={onMenuToggle}
        className="p-2 -ml-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
        aria-label="Ouvrir le menu"
      >
        <Menu size={20} />
      </button>
      <span className="ml-3 text-sm font-bold text-brand-primary tracking-tight">
        EduGoma
      </span>
    </header>
  );
}
