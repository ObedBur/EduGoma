"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, Sparkles, GraduationCap } from "lucide-react";

const WHATSAPP_NUMBER = "243XXXXXXXXXXX";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Bonjour, je souhaite une démonstration d'EduGoma pour mon établissement scolaire."
);

const NAV_LINKS = [
  { href: "#fonctionnalites", label: "Fonctionnalités" },
  { href: "#roles", label: "Par profil" },
  { href: "#defis", label: "Défis & Solutions" },
  { href: "#comment-ca-marche", label: "Comment ça marche" },
  { href: "#pourquoi", label: "Pourquoi EduGoma" },
  { href: "#ecoles-pilotes", label: "Écoles Pilotes" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Si l'utilisateur est tout en haut (dans le Hero), aucun bouton n'est actif
      if (window.scrollY < 260) {
        setActiveSection("");
        return;
      }

      // Détection fiable de la section visible
      const scrollYWithOffset = window.scrollY + 180;
      let currentActive = "";

      for (const link of NAV_LINKS) {
        const sectionId = link.href.substring(1);
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollYWithOffset >= top && scrollYWithOffset < top + height) {
            currentActive = sectionId;
            break;
          }
        }
      }

      if (currentActive) {
        setActiveSection(currentActive);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Exécution initiale au montage
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_24px_rgba(15,31,58,0.06)] py-2.5"
          : "bg-white/70 backdrop-blur-md border-b border-transparent py-3.5 sm:py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo EduGoma */}
          <Link
            href="/"
            className="group flex items-center gap-3 focus:outline-none"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-primary via-brand-secondary to-brand-accent p-0.5 shadow-md shadow-brand-secondary/20 transition-transform duration-300 group-hover:scale-105">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-brand-primary text-white">
                <GraduationCap className="h-5 w-5 text-brand-accent" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-brand-primary">
                  Edu<span className="text-brand-secondary">Goma</span>
                </span>
                <span className="rounded-full bg-brand-secondary/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-brand-secondary uppercase">
                  RDC
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 leading-none">
                Gestion scolaire unifiée
              </span>
            </div>
          </Link>

          {/* Navigation Links Desktop */}
          <nav
            className="hidden items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/90 px-4 py-1.5 shadow-xs backdrop-blur-md lg:flex"
            aria-label="Navigation principale"
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "bg-brand-primary text-white shadow-sm"
                      : "text-slate-600 hover:text-brand-primary hover:bg-slate-100/80"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Desktop : Connexion seule (aère tout le header) */}
          <div className="hidden items-center md:flex">
            <Link
              href="/login"
              className="inline-flex items-center rounded-xl border border-slate-200/90 bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow-xs transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 hover:text-brand-primary active:scale-[0.98]"
            >
              Connexion
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-50 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          mobileMenuOpen ? "max-h-[30rem] opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-4 rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-xl backdrop-blur-xl">
          <nav className="flex flex-col space-y-1" aria-label="Navigation mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100/80 hover:text-brand-primary"
              >
                <span>{link.label}</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>
            ))}
          </nav>

          <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-3">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
            >
              Espace Connexion
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl bg-brand-primary py-2.5 text-xs font-bold text-white shadow-md shadow-brand-primary/20"
            >
              <Sparkles className="h-3.5 w-3.5 text-brand-accent" />
              <span>Demander une démo WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
