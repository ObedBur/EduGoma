"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const WHATSAPP_NUMBER = "243XXXXXXXXXXX";

const WHATSAPP_MESSAGE = encodeURIComponent(
  "Bonjour, je souhaite une démonstration d'EduGoma pour mon établissement."
);

const NAV_LINKS = [
  { href: "#fonctionnalites", label: "Fonctionnalités" },
  { href: "#comment-ca-marche", label: "Comment ça marche" },
  { href: "#ecoles-pilotes", label: "Écoles pilotes" },
  { href: "#pourquoi", label: "Pourquoi EduGoma" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-slate-200/80 bg-white/85 shadow-[0_10px_35px_rgba(16,42,86,0.08)] backdrop-blur-xl"
          : "border-b border-transparent bg-white/70 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[4.5rem] items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-2 rounded-lg px-1 text-xl font-extrabold tracking-tight text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-accent/40"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-secondary to-brand-accent text-sm text-white shadow-lg shadow-brand-secondary/20">E</span>
            <span>Edu<span className="text-brand-secondary">Goma</span></span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation principale">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent/40 ${
                  activeSection === link.href.substring(1)
                    ? "bg-brand-secondary/10 text-brand-secondary"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-brand-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-accent/40">
              Connexion
            </Link>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-primary/20 transition hover:-translate-y-0.5 hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-accent/50">
              Demander une démo
            </a>
          </div>

          <button
            className="inline-flex rounded-lg p-2 text-brand-primary transition hover:bg-brand-primary/5 focus:outline-none focus:ring-2 focus:ring-brand-accent/40 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div className={`overflow-hidden transition-all duration-300 md:hidden ${mobileMenuOpen ? "max-h-[28rem]" : "max-h-0"}`}>
        <nav className="border-t border-slate-200/80 bg-white/95 px-4 pb-5 pt-3 shadow-xl shadow-brand-primary/5" aria-label="Navigation mobile">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className={`block rounded-lg px-3 py-3 text-sm font-semibold transition-colors ${activeSection === link.href.substring(1) ? "bg-brand-secondary/10 text-brand-secondary" : "text-slate-600 hover:bg-slate-50 hover:text-brand-primary"}`}>
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-4">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Connexion</Link>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`} target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="rounded-lg bg-brand-primary px-4 py-2.5 text-center text-sm font-semibold text-white shadow-lg shadow-brand-primary/20">Demander une démo</a>
          </div>
        </nav>
      </div>
    </header>
  );
}
