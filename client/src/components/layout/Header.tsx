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
  { href: "#ecoles-pilotes", label: "École Pilotes" },
  { href: "#a-propos", label: "À Propos" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -80% 0px" }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));
    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200/60"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-brand-primary tracking-tight focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:ring-offset-2 rounded-md px-1 -ml-1"
          >
            EduGoma
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Navigation principale">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:ring-offset-1 ${
                  activeSection === link.href.substring(1)
                    ? "text-brand-primary"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/60"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:ring-offset-2"
            >
              Connexion
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-brand-primary text-white hover:bg-brand-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:ring-offset-2 shadow-sm"
            >
              Demander une démo
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:ring-offset-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-200 ${
          mobileMenuOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav className="px-4 pb-4 pt-1 bg-white border-b border-gray-200 flex flex-col gap-1" aria-label="Navigation mobile">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                activeSection === link.href.substring(1)
                  ? "text-brand-primary bg-brand-primary/5"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-gray-100">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Connexion
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg bg-brand-primary text-white hover:bg-brand-primary/90 transition-colors shadow-sm"
            >
              Demander une démo
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
