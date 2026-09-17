import React from "react";
import Link from "next/link";

interface FooterProps {
  columns?: {
    title: string;
    links: { label: string; href: string }[];
  }[];
}

export function Footer({ columns }: FooterProps) {
  const defaultColumns = [
    {
      title: "Bureaux",
      links: [
        { label: "Goma, Nord-Kivu", href: "#ecoles-pilotes" },
        { label: "Kinshasa", href: "#ecoles-pilotes" },
      ],
    },
    {
      title: "Légal",
      links: [
        { label: "Confidentialité", href: "#pourquoi" },
        { label: "Conditions d'utilisation", href: "#fonctionnalites" },
      ],
    },
    {
      title: "Aide",
      links: [
        { label: "Contact Support", href: "#cta" },
        { label: "Centre d'aide", href: "#comment-ca-marche" },
      ],
    },
  ];

  const cols = columns || defaultColumns;

  return (
    <footer className="border-t border-slate-200/80 bg-brand-primary pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo & Mission */}
          <div className="lg:col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-secondary to-brand-accent text-sm font-bold text-white">
                Eg
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                EduGoma
              </span>
            </Link>
            <p className="max-w-sm text-white/60">
              La gestion scolaire pensée pour les établissements congolais.
            </p>
          </div>

          {/* Links Columns */}
          {cols.map((col, idx) => (
            <div key={idx}>
              <h4 className="mb-4 font-bold text-white">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-brand-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/45 md:flex-row">
          <p>© {new Date().getFullYear()} EduGoma. Tous droits réservés.</p>
          <p className="flex items-center gap-1">
            Fait avec <span className="text-brand-accent">❤</span> pour Goma.
          </p>
        </div>
      </div>
    </footer>
  );
}
