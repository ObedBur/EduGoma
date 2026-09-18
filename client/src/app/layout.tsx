import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const sansFont = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EduGoma | Plateforme de Gestion Scolaire Intégrée en RDC",
  description: "Solution complète de gestion pour les écoles congolaises : inscriptions, cotes, présences, délibérations et bulletins officiels sans calcul manuel.",
  keywords: ["EduGoma", "Gestion scolaire", "Goma", "RDC", "Bulletins scolaires", "Palmarès", "Écoles congolaises"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${sansFont.variable} ${monoFont.variable} h-full antialiased scroll-smooth overflow-x-hidden`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#f8fafc] text-slate-900 overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
