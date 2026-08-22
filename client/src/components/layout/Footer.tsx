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
        { label: "Goma, Nord-Kivu", href: "#" },
        { label: "Kinshasa", href: "#" },
      ],
    },
    {
      title: "Légal",
      links: [
        { label: "Confidentialité", href: "#" },
        { label: "Conditions d'utilisation", href: "#" },
      ],
    },
    {
      title: "Aide",
      links: [
        { label: "Contact Support", href: "#" },
        { label: "Centre d'aide", href: "#" },
      ],
    },
  ];

  const cols = columns || defaultColumns;

  return (
    <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo & Mission */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded bg-brand-primary text-white flex items-center justify-center font-bold text-sm">
                Eg
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                EduGoma
              </span>
            </Link>
            <p className="text-gray-600 max-w-sm">
              La gestion scolaire pensée pour les établissements congolais.
            </p>
          </div>

          {/* Links Columns */}
          {cols.map((col, idx) => (
            <div key={idx}>
              <h4 className="font-bold text-gray-900 mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-brand-primary transition-colors text-sm"
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
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} EduGoma. Tous droits réservés.</p>
          <p className="flex items-center gap-1">
            Fait avec <span className="text-red-500">❤</span> pour Goma.
          </p>
        </div>
      </div>
    </footer>
  );
}
