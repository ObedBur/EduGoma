"use client";

import React, { useState, useTransition, useEffect, useRef } from "react";
import { X, Loader2, CheckCircle2, AlertCircle, Phone, Building2, User, Mail, Users, MessageSquare } from "lucide-react";
import { Button } from "../ui/Button";
import { submitDemoRequest } from "../../app/actions/demo";

interface DemoRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STUDENT_RANGES = [
  { value: "moins-de-100", label: "Moins de 100 élèves" },
  { value: "100-300", label: "100 – 300 élèves" },
  { value: "300-600", label: "300 – 600 élèves" },
  { value: "plus-de-600", label: "Plus de 600 élèves" },
];

const INITIAL_FORM = {
  contactName: "",
  schoolName: "",
  phone: "",
  email: "",
  studentRange: "",
  message: "",
};

type FormState = typeof INITIAL_FORM;
type FieldErrors = Partial<Record<keyof FormState, string>>;

function validateClient(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.contactName.trim()) errors.contactName = "Champ obligatoire";
  if (!form.schoolName.trim()) errors.schoolName = "Champ obligatoire";
  if (!form.phone.trim()) {
    errors.phone = "Champ obligatoire";
  } else if (!/^(\+243|0)[0-9]{9}$/.test(form.phone.replace(/\s/g, ""))) {
    errors.phone = "Format attendu : +243XXXXXXXXX ou 0XXXXXXXXX";
  }
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Adresse email invalide";
  }
  return errors;
}

export function DemoRequestModal({ isOpen, onClose }: DemoRequestModalProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Focus sur le 1er champ à l'ouverture
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
      setForm(INITIAL_FORM);
      setFieldErrors({});
      setServerError(null);
      setIsSuccess(false);
    }
  }, [isOpen]);

  // Fermeture avec Échap
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Bloquer le scroll du body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Effacer l'erreur du champ modifié
    if (fieldErrors[name as keyof FormState]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const errors = validateClient(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    startTransition(async () => {
      const result = await submitDemoRequest(form);
      if (result.success) {
        setIsSuccess(true);
      } else {
        setServerError(result.error ?? "Une erreur est survenue.");
      }
    });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-start justify-between rounded-t-2xl z-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-primary mb-1">
              Gratuit · Sans engagement
            </p>
            <h2 id="demo-modal-title" className="text-xl font-bold text-gray-900">
              Demander une démonstration
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100 mt-1"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {isSuccess ? (
            <SuccessState onClose={onClose} />
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              
              {/* Erreur serveur */}
              {serverError && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
                  <span>{serverError}</span>
                </div>
              )}

              {/* Nom du contact */}
              <Field
                label="Nom complet du contact"
                required
                error={fieldErrors.contactName}
                icon={<User size={16} />}
              >
                <input
                  ref={firstInputRef}
                  type="text"
                  name="contactName"
                  value={form.contactName}
                  onChange={handleChange}
                  placeholder="Ex : Jean-Pierre Mwamba"
                  disabled={isPending}
                  className={inputClass(!!fieldErrors.contactName)}
                />
              </Field>

              {/* Nom de l'établissement */}
              <Field
                label="Nom de l'établissement"
                required
                error={fieldErrors.schoolName}
                icon={<Building2 size={16} />}
              >
                <input
                  type="text"
                  name="schoolName"
                  value={form.schoolName}
                  onChange={handleChange}
                  placeholder="Ex : Institut Supérieur de Goma"
                  disabled={isPending}
                  className={inputClass(!!fieldErrors.schoolName)}
                />
              </Field>

              {/* Téléphone */}
              <Field
                label="Téléphone"
                required
                hint="Format RDC uniquement"
                error={fieldErrors.phone}
                icon={<Phone size={16} />}
              >
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+243 XXX XXX XXX"
                  disabled={isPending}
                  className={inputClass(!!fieldErrors.phone)}
                />
              </Field>

              {/* Email */}
              <Field
                label="Email"
                error={fieldErrors.email}
                icon={<Mail size={16} />}
              >
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="contact@ecole.cd (facultatif)"
                  disabled={isPending}
                  className={inputClass(!!fieldErrors.email)}
                />
              </Field>

              {/* Tranche d'élèves */}
              <Field
                label="Nombre approximatif d'élèves"
                icon={<Users size={16} />}
              >
                <select
                  name="studentRange"
                  value={form.studentRange}
                  onChange={handleChange}
                  disabled={isPending}
                  className={inputClass(false) + " appearance-none cursor-pointer"}
                >
                  <option value="">Sélectionner (facultatif)</option>
                  {STUDENT_RANGES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </Field>

              {/* Message */}
              <Field
                label="Message"
                icon={<MessageSquare size={16} />}
              >
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Décrivez votre besoin ou posez une question (facultatif)"
                  disabled={isPending}
                  rows={3}
                  className={inputClass(false) + " resize-none"}
                />
              </Field>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-brand-primary/90 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 shadow-sm"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Envoi en cours…
                    </>
                  ) : (
                    "Envoyer ma demande"
                  )}
                </button>
                <p className="text-center text-xs text-gray-400 mt-3">
                  Nous vous répondrons dans les 24 heures.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sous-composants internes ───────────────────────────────────────────────

interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

function Field({ label, required, hint, error, icon, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
        {icon && (
          <span className="text-brand-primary">{icon}</span>
        )}
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
        {hint && <span className="text-xs font-normal text-gray-400 ml-1">({hint})</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
}

function inputClass(hasError: boolean): string {
  return [
    "w-full px-4 py-2.5 rounded-xl border text-sm transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary",
    "disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed",
    hasError
      ? "border-red-400 bg-red-50/50 focus:ring-red-200 focus:border-red-400"
      : "border-gray-200 bg-white hover:border-gray-300",
  ].join(" ");
}

function SuccessState({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center text-center py-8 gap-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle2 className="w-9 h-9 text-green-500" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Demande envoyée avec succès !
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">
          Nous avons bien reçu votre demande. Notre équipe vous contactera
          dans les <strong>24 heures</strong> pour organiser votre démonstration.
        </p>
      </div>
      <Button variant="primary" size="lg" onClick={onClose}>
        Parfait, merci !
      </Button>
    </div>
  );
}
