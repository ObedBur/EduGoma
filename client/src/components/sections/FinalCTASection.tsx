"use client";
import Link from "next/link";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { DemoRequestModal } from "../ui/DemoRequestModal";

const CTA_CONTENT = {
  eyebrow: "Passez à l'action",
  title: "Prêt à moderniser la gestion de votre établissement ?",
  description: "Rejoignez les écoles pilotes de Goma qui transforment déjà leur quotidien avec EduGoma.",
  buttonPrimary: "Demander une démonstration",
  buttonSecondary: "Créer mon établissement",
};

export function FinalCTASection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section id="cta" className="bg-white py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-primary via-[#183b78] to-brand-secondary p-8 text-center shadow-2xl shadow-brand-primary/20 md:p-16">

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-48 h-48 bg-brand-accent/20 rounded-full blur-2xl" />

            <div className="relative z-10">
              <span className="mb-6 inline-block rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-brand-accent">
                {CTA_CONTENT.eyebrow}
              </span>

              <h2 className="mx-auto mb-6 max-w-2xl text-3xl font-extrabold tracking-tight text-white md:text-5xl">
                {CTA_CONTENT.title}
              </h2>

              <p className="mx-auto mb-10 max-w-xl text-lg text-white/75">
                {CTA_CONTENT.description}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {/* Bouton principal — ouvre la modal */}
                <Button
                  variant="default"
                  size="lg"
                  className="w-full sm:w-auto font-bold text-brand-primary"
                  onClick={() => setIsModalOpen(true)}
                >
                  {CTA_CONTENT.buttonPrimary}
                </Button>

                {/* Bouton secondaire — ancre vers l'inscription (à brancher plus tard) */}
                <Button variant="outline" size="lg" asChild><Link href="/login" className="w-full sm:w-auto">
                  {CTA_CONTENT.buttonSecondary}
                </Link>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Modal de demande de démonstration */}
      <DemoRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
