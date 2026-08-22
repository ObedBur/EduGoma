"use client";

import React, { useState } from "react";
import { Button } from "../ui/Button";
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
      <section id="cta" className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-primary rounded-3xl p-10 md:p-16 text-center shadow-xl relative overflow-hidden">

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-48 h-48 bg-brand-accent/20 rounded-full blur-2xl" />

            <div className="relative z-10">
              <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-white/90 text-sm font-semibold mb-6 tracking-wide uppercase">
                {CTA_CONTENT.eyebrow}
              </span>

              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight max-w-2xl mx-auto">
                {CTA_CONTENT.title}
              </h2>

              <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
                {CTA_CONTENT.description}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {/* Bouton principal — ouvre la modal */}
                <Button
                  variant="white"
                  size="lg"
                  className="w-full sm:w-auto font-bold text-brand-primary"
                  onClick={() => setIsModalOpen(true)}
                >
                  {CTA_CONTENT.buttonPrimary}
                </Button>

                {/* Bouton secondaire — ancre vers l'inscription (à brancher plus tard) */}
                <Button variant="outline-light" size="lg" href="#" className="w-full sm:w-auto">
                  {CTA_CONTENT.buttonSecondary}
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
