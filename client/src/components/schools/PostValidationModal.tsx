"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Phone,
  Mail,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PostValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  school: {
    id: string;
    name: string;
    phone: string;
    email?: string | null;
    city?: string;
  } | null;
}

export function PostValidationModal({
  isOpen,
  onClose,
  school,
}: PostValidationModalProps) {
  const [copied, setCopied] = useState(false);
  const [waTriggered, setWaTriggered] = useState(false);
  const [emailTriggered, setEmailTriggered] = useState(false);

  if (!school) return null;

  const cleanPhone = (school.phone || "").replace(/[^\d+]/g, "").replace(/^\+/, "");
  const accessUrl = "https://app.edugoma.cd/login";

  const messageText = `Bonjour ! 🎉

Votre établissement *${school.name}* a été validé avec succès sur la plateforme EduGoma.

🔗 Accès à votre espace : ${accessUrl}
📱 Identifiant de connexion : ${school.phone}

Bienvenue dans l'écosystème scolaire connecté du Nord-Kivu !
Pour toute assistance, répondez directement à ce message.`;

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(messageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleOpenWhatsApp = () => {
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setWaTriggered(true);
  };

  const handleOpenEmail = () => {
    if (!school.email) return;
    const subject = encodeURIComponent(`Activation de votre compte EduGoma — ${school.name}`);
    const body = encodeURIComponent(messageText);
    window.location.href = `mailto:${school.email}?subject=${subject}&body=${body}`;
    setEmailTriggered(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-[#e2e8f0] bg-white shadow-2xl rounded-2xl">
        {/* Header célébration */}
        <div className="bg-linear-to-r from-[#102d48] to-[#184269] px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 size={22} className="animate-in zoom-in-50 duration-300" />
            </div>
            <div>
              <DialogTitle className="text-[16px] font-bold text-white tracking-tight">
                Établissement validé avec succès !
              </DialogTitle>
              <DialogDescription className="text-[11px] text-[#c0d4e7] mt-0.5">
                {school.name} est maintenant actif sur EduGoma
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Badge statut actif */}
          <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/80 px-3.5 py-2.5">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-600" />
              <span className="text-[11px] font-bold text-emerald-900">
                Statut : Compte actif (Essai gratuit initialisé)
              </span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
              Opérationnel
            </span>
          </div>

          <p className="text-[11px] text-[#55697a] leading-relaxed">
            Les notifications d&apos;accueil peuvent être transmises directement aux responsables de l&apos;école :
          </p>

          {/* Grille d'actions rapides */}
          <div className="space-y-2.5">
            {/* WhatsApp */}
            <button
              onClick={handleOpenWhatsApp}
              className="w-full flex items-center justify-between gap-3 rounded-xl border border-[#d2e4d9] bg-[#f4fbf7] p-3.5 text-left transition-all hover:border-[#25d366] hover:bg-[#eaf8f0] group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#25d366]/15 text-[#128c7e] group-hover:scale-105 transition-transform">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#1a382d]">
                    Envoyer les accès par WhatsApp
                  </p>
                  <p className="text-[10px] text-[#5c7a6e]">
                    Vers le {school.phone || "numéro officiel"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-semibold text-[#128c7e]">
                {waTriggered ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                    <Check size={12} /> Ouvert
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1">
                    Envoyer <ExternalLink size={11} />
                  </span>
                )}
              </div>
            </button>

            {/* Email institutionnel */}
            {school.email ? (
              <button
                onClick={handleOpenEmail}
                className="w-full flex items-center justify-between gap-3 rounded-xl border border-[#d5e2ec] bg-[#f6f9fc] p-3.5 text-left transition-all hover:border-[#2b6cb0] hover:bg-[#edf4fb] group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2b6cb0]/15 text-[#2b6cb0] group-hover:scale-105 transition-transform">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#1b3652]">
                      Envoyer par E-mail officiel
                    </p>
                    <p className="text-[10px] text-[#5b7289]">
                      {school.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-semibold text-[#2b6cb0]">
                  {emailTriggered ? (
                    <span className="inline-flex items-center gap-1 text-blue-700 font-bold">
                      <Check size={12} /> Préparé
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      Ouvrir <ExternalLink size={11} />
                    </span>
                  )}
                </div>
              </button>
            ) : null}

            {/* Copier message complet */}
            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-between gap-3 rounded-xl border border-[#e2e8f0] bg-white p-3.5 text-left transition-all hover:border-[#94a3b8] hover:bg-slate-50 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#1e293b]">
                    {copied ? "Texte copié dans le presse-papier !" : "Copier le texte d'accueil"}
                  </p>
                  <p className="text-[10px] text-[#64748b]">
                    Identifiants, lien et instructions de démarrage
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-slate-600">
                {copied ? "✓ Copié" : "Copier"}
              </span>
            </button>
          </div>

          {/* Bouton Fermer */}
          <div className="mt-5 pt-3 border-t border-[#edf2f6] flex justify-end">
            <button
              onClick={onClose}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-[#102d48] px-5 py-2 text-[11px] font-bold text-white shadow-sm hover:bg-[#183d5f] active:scale-[0.98] transition-all"
            >
              Continuer
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
