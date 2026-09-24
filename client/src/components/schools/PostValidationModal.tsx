"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Smartphone,
  MessageCircle,
  Mail,
  Minus,
  RefreshCw,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { tenantsApi, type ValidateAccessResult } from "@/lib/api";
import { toast } from "sonner";

interface PostValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  school: {
    id: string;
    name: string;
    phone: string;
    email?: string | null;
  } | null;
  access?: ValidateAccessResult | null;
}

function StatusChip({ status }: { status: boolean | null | undefined }) {
  if (status === null || status === undefined) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
        <Minus size={10} /> —
      </span>
    );
  }
  if (status) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
        <CheckCircle2 size={10} /> Envoyé
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
      Échec
    </span>
  );
}

export function PostValidationModal({
  isOpen,
  onClose,
  school,
  access,
}: PostValidationModalProps) {
  const [resending, setResending] = useState(false);
  const [localAccess, setLocalAccess] = useState<ValidateAccessResult | null>(null);

  if (!school) return null;

  const current = access ?? localAccess;
  const n = current?.notifications;
  const ttlMinutes = (() => {
    if (!current?.setupLinkExpiresAt) return 30;
    const ms = new Date(current.setupLinkExpiresAt).getTime() - Date.now();
    return Math.max(1, Math.round(ms / 60000));
  })();

  const handleResend = async () => {
    setResending(true);
    try {
      const result = await tenantsApi.resendAccess(school.id);
      setLocalAccess(result);
      toast.success("Accès renvoyés", {
        description: "SMS, WhatsApp et email ont été relancés.",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Impossible de renvoyer les accès";
      toast.error("Échec de l'envoi", { description: msg });
    } finally {
      setResending(false);
    }
  };

  const rows = [
    {
      key: "sms",
      icon: Smartphone,
      label: "SMS",
      detail: school.phone,
      status: n?.sms,
    },
    {
      key: "whatsapp",
      icon: MessageCircle,
      label: "WhatsApp",
      detail: school.phone,
      status: n?.whatsapp,
    },
    {
      key: "email",
      icon: Mail,
      label: "Email",
      detail: school.email || "Aucun email enregistré",
      status: school.email ? n?.email : null,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-[#e2e8f0] bg-white shadow-2xl rounded-2xl">
        <div className="bg-linear-to-r from-[#102d48] to-[#184269] px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <DialogTitle className="text-[16px] font-bold text-white tracking-tight">
                Établissement validé avec succès !
              </DialogTitle>
              <DialogDescription className="text-[11px] text-[#c0d4e7] mt-0.5">
                {school.name} — accès envoyés automatiquement
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 px-3.5 py-2.5">
            <p className="text-[11px] font-bold text-emerald-900">
              Compte actif · Lien de mot de passe valable {ttlMinutes} min
            </p>
            <p className="mt-0.5 text-[10px] text-emerald-700">
              L’école reçoit un lien à usage unique pour créer son mot de passe — aucun mot de passe en clair.
            </p>
          </div>

          <p className="text-[11px] text-[#55697a] leading-relaxed">
            Notifications envoyées par le serveur (sans action manuelle) :
          </p>

          <ul className="space-y-2">
            {rows.map((row) => {
              const Icon = row.icon;
              return (
                <li
                  key={row.key}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#e2e8f0] bg-white p-3.5"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-[#1a382d]">{row.label}</p>
                      <p className="truncate text-[10px] text-[#64748b]">{row.detail}</p>
                    </div>
                  </div>
                  <StatusChip status={row.status} />
                </li>
              );
            })}
          </ul>

          <div className="mt-5 pt-3 border-t border-[#edf2f6] flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={handleResend}
              disabled={resending}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-[#e2e8f0] bg-white px-3.5 py-2 text-[11px] font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60 transition-all"
            >
              <RefreshCw size={12} className={resending ? "animate-spin" : ""} />
              Renvoyer les accès
            </button>
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
