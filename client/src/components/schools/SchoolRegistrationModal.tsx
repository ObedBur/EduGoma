"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { tenantsApi } from "@/lib/api";

interface SchoolRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const COMMUNES = [
  { value: "Goma", label: "Commune de Goma" },
  { value: "Karisimbi", label: "Commune de Karisimbi" },
  { value: "Mugunga", label: "Mugunga" },
  { value: "Nyiragongo", label: "Territoire de Nyiragongo" },
  { value: "Other", label: "Autre localité (Nord-Kivu)" },
];

const SCHOOL_TYPES = [
  { value: "conventionned", label: "Conventionné (Catholique / Protestant)" },
  { value: "private", label: "Privé agréé" },
  { value: "public", label: "Public officiel" },
  { value: "community", label: "Communautaire" },
];

const STUDENT_RANGES = [
  { value: "moins-de-300", label: "Moins de 300 élèves" },
  { value: "300-600", label: "300 à 600 élèves" },
  { value: "600-1200", label: "600 à 1 200 élèves" },
  { value: "plus-de-1200", label: "Plus de 1 200 élèves" },
];

const CYCLES = [
  { id: "maternelle", label: "Maternelle" },
  { id: "primaire", label: "Primaire" },
  { id: "secondaire", label: "7e & 8e EB" },
  { id: "humanites", label: "Humanités" },
];

const INITIAL_FORM = {
  name: "",
  sigle: "",
  phone: "",
  email: "",
  commune: "Goma",
  address: "",
  type: "conventionned",
  studentRange: "300-600",
  cycles: ["secondaire", "humanites"],
};

export function SchoolRegistrationModal({
  isOpen,
  onClose,
  onSuccess,
}: SchoolRegistrationModalProps) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetAndClose = () => {
    setForm(INITIAL_FORM);
    setError(null);
    setSuccess(false);
    onClose();
  };

  const toggleCycle = (cycleId: string) => {
    setForm((prev) => {
      const exists = prev.cycles.includes(cycleId);
      if (exists) {
        if (prev.cycles.length <= 1) return prev;
        return { ...prev, cycles: prev.cycles.filter((c) => c !== cycleId) };
      } else {
        return { ...prev, cycles: [...prev.cycles, cycleId] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError("Le nom officiel de l'établissement est requis.");
      return;
    }

    let formattedPhone = form.phone.trim().replace(/\s/g, "");
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "+243" + formattedPhone.slice(1);
    } else if (!formattedPhone.startsWith("+243")) {
      formattedPhone = "+243" + formattedPhone;
    }

    if (!/^\+243[0-9]{9}$/.test(formattedPhone)) {
      setError("Numéro WhatsApp invalide (format : +243 suivi de 9 chiffres, ex. +243812345678).");
      return;
    }

    setLoading(true);

    const displayName = form.sigle.trim()
      ? `${form.name.trim()} (${form.sigle.trim().toUpperCase()})`
      : form.name.trim();

    try {
      await tenantsApi.create({
        name: displayName,
        phone: formattedPhone,
        email: form.email.trim() || undefined,
        commune: form.commune,
        type: form.type,
      });

      setSuccess(true);
      onSuccess?.();
      setTimeout(() => {
        resetAndClose();
      }, 1800);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur lors de l'enregistrement de l'école.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetAndClose()}>
      <DialogContent className="sm:max-w-[560px] p-0 overflow-hidden border border-slate-200/80 bg-white shadow-2xl rounded-2xl max-h-[92vh] flex flex-col">
        {/* En-tête épuré et moderne */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 pr-12">
          <DialogTitle className="text-[17px] font-bold tracking-[-0.02em] text-slate-900">
            Inscrire un établissement
          </DialogTitle>
          <DialogDescription className="mt-0.5 text-[12px] text-slate-500">
            Enregistrement d&apos;une nouvelle école partenaire sur EduGoma
          </DialogDescription>
        </div>

        <div className="p-6 overflow-y-auto flex-1 [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent]">
          {success ? (
            <div className="py-12 text-center animate-in fade-in zoom-in-95 duration-300">
              <div className="mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-[16px] font-bold text-slate-900 tracking-tight">
                Établissement enregistré
              </h3>
              <p className="mt-1 text-[13px] text-slate-500 max-w-sm mx-auto leading-relaxed">
                Le dossier a été créé avec succès en statut « En attente de validation ».
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-start gap-2.5 rounded-xl border border-red-200/80 bg-red-50/80 p-3 text-[12px] text-red-700 animate-in fade-in">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <span className="leading-snug">{error}</span>
                </div>
              )}

              {/* Ligne 1 : Nom complet & Sigle */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[12px] font-medium text-slate-700 mb-1">
                    Nom officiel de l&apos;école <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ex. Institut Technique Industriel de Goma"
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[#102d48] focus:ring-3 focus:ring-[#102d48]/8"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-slate-700 mb-1">
                    Sigle <span className="text-[11px] font-normal text-slate-400">(optionnel)</span>
                  </label>
                  <input
                    type="text"
                    value={form.sigle}
                    onChange={(e) => setForm({ ...form, sigle: e.target.value.toUpperCase() })}
                    placeholder="Ex. ITIG"
                    maxLength={10}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] font-semibold uppercase text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[#102d48] focus:ring-3 focus:ring-[#102d48]/8"
                  />
                </div>
              </div>

              {/* Ligne 2 : Régime de gestion & Tranche d'effectif */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-slate-700 mb-1">
                    Régime de gestion <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-900 outline-none transition-all focus:border-[#102d48] focus:ring-3 focus:ring-[#102d48]/8 cursor-pointer"
                  >
                    {SCHOOL_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-slate-700 mb-1">
                    Effectif estimé
                  </label>
                  <select
                    value={form.studentRange}
                    onChange={(e) => setForm({ ...form, studentRange: e.target.value })}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-900 outline-none transition-all focus:border-[#102d48] focus:ring-3 focus:ring-[#102d48]/8 cursor-pointer"
                  >
                    {STUDENT_RANGES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ligne 3 : Cycles organisés (pills modernes) */}
              <div>
                <label className="block text-[12px] font-medium text-slate-700 mb-1.5">
                  Cycles d&apos;enseignement organisés <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CYCLES.map((cycle) => {
                    const active = form.cycles.includes(cycle.id);
                    return (
                      <button
                        type="button"
                        key={cycle.id}
                        onClick={() => toggleCycle(cycle.id)}
                        className={`h-9 px-3 rounded-lg border text-[12px] font-medium transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center ${
                          active
                            ? "border-[#102d48] bg-[#102d48] text-white shadow-xs"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {cycle.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ligne 4 : Localisation (Commune & Quartier) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-slate-700 mb-1">
                    Commune / Localité <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.commune}
                    onChange={(e) => setForm({ ...form, commune: e.target.value })}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-900 outline-none transition-all focus:border-[#102d48] focus:ring-3 focus:ring-[#102d48]/8 cursor-pointer"
                  >
                    {COMMUNES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-slate-700 mb-1">
                    Quartier &amp; Avenue <span className="text-[11px] font-normal text-slate-400">(optionnel)</span>
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Ex. Katindo, Av. des Touristes"
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[#102d48] focus:ring-3 focus:ring-[#102d48]/8"
                  />
                </div>
              </div>

              {/* Ligne 5 : Coordonnées de contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-slate-700 mb-1">
                    Téléphone WhatsApp officiel <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+243 812 345 678"
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[#102d48] focus:ring-3 focus:ring-[#102d48]/8 font-mono text-[12px]"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    Utilisé pour la transmission des accès
                  </p>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-slate-700 mb-1">
                    Email institutionnel <span className="text-[11px] font-normal text-slate-400">(optionnel)</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="direction@ecole.cd"
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[#102d48] focus:ring-3 focus:ring-[#102d48]/8"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    Notification de validation en copie
                  </p>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={resetAndClose}
                  disabled={loading}
                  className="rounded-lg px-4 py-2.5 text-[13px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#102d48] px-5 py-2.5 text-[13px] font-semibold text-white shadow-xs hover:bg-[#183d5f] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <span>Enregistrer l&apos;établissement</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
