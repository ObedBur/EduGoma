"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, ArrowLeft, Mail, CheckCircle2, KeyRound } from "lucide-react";
import { authApi } from "@/lib/api";
import { toast } from "sonner";

/* ─── Images authentiques pour le slideshow ────────────── */
const AUTH_SCENES = [
  {
    src: "/images/class1.png",
    alt: "Salle de classe et enseignant à Goma, RDC",
  },
  {
    src: "/images/class2.png",
    alt: "Élèves en cours de révision et étude, RDC",
  },
  {
    src: "/images/class3.png",
    alt: "Cour d'école et élèves en uniforme, Goma",
  },
];

const SLIDE_DURATION = 5000; // 5 secondes par image

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slideshow timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % AUTH_SCENES.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Veuillez saisir votre adresse email");
      return;
    }

    setIsLoading(true);

    try {
      await authApi.forgotPassword({ email });
      setIsSubmitted(true);
      toast.success("Demande enregistrée", {
        description: "Un lien de réinitialisation vous a été envoyé si le compte existe.",
      });
    } catch (err: any) {
      // En production, pour des raisons de sécurité, on affiche tout de même l'état de succès
      // ou le message retourné par l'API
      setIsSubmitted(true);
      toast.success("Demande enregistrée", {
        description: "Vérifiez votre boîte de réception pour réinitialiser votre mot de passe.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans">
      {/* Volet Gauche - Image Slideshow & Branding EduGoma (masqué sur mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
        {/* Slideshow Background Images - Native Full Quality (no blur, lossless) */}
        {AUTH_SCENES.map((scene, index) => (
          <Image
            key={scene.src}
            src={scene.src}
            alt={scene.alt}
            fill
            unoptimized
            className={`object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            sizes="50vw"
            priority={index === 0}
          />
        ))}
        {/* Subtle Gradient Overlay: keeps center crystal clear while ensuring text contrast */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-slate-950/40 pointer-events-none" />

        <div className="relative z-20 flex flex-col justify-between w-full p-12 h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 w-fit group">
            <div className="bg-white p-2 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <svg className="w-6 h-6 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
              </svg>
            </div>
            <span className="text-white text-2xl font-bold tracking-tight">EduGoma</span>
          </Link>

          {/* Textes inspirants */}
          <div className="max-w-lg mb-8">
            <h1 className="text-4xl font-bold text-white leading-[1.2] mb-5 tracking-tight drop-shadow-md">
              Sécurité & accès garanti à votre établissement.
            </h1>
            <p className="text-slate-100 text-base leading-relaxed font-light drop-shadow">
              Récupérez votre mot de passe en quelques secondes grâce à notre procédure sécurisée.
              Vos données scolaires restent strictement protégées.
            </p>
            {/* Dynamic Pagination Dots */}
            <div className="flex gap-2 mt-8">
              {AUTH_SCENES.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i === currentSlide
                      ? "w-8 bg-white"
                      : "w-2 bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Volet Droit - Formulaire de réinitialisation */}
      <div className="w-full lg:w-1/2 relative flex items-center justify-center p-8 sm:p-12 lg:p-24 min-h-screen">
        {/* Bouton Connexion / Retour en haut à droite */}
        <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-30">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-all hover:-translate-y-0.5 shadow-md shadow-slate-900/15 active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Connexion</span>
          </Link>
        </div>

        <div className="w-full max-w-[420px]">
          {/* Logo mobile */}
          <Link href="/" className="flex items-center gap-3 mb-10 lg:hidden w-fit">
            <div className="bg-slate-900 p-2 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
              </svg>
            </div>
            <span className="text-slate-900 text-2xl font-bold tracking-tight">EduGoma</span>
          </Link>

          {!isSubmitted ? (
            <>
              {/* En-tête formulaire */}
              <div className="mb-8">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-brand-secondary mb-4">
                  <KeyRound className="h-6 w-6" />
                </div>
                <h2 className="text-[30px] font-bold text-slate-900 mb-2 tracking-tight">
                  Mot de passe oublié ?
                </h2>
                <p className="text-slate-500 text-[15px] leading-relaxed">
                  Saisissez l&apos;adresse email de votre compte pour recevoir un lien de réinitialisation.
                </p>
              </div>

              {/* Formulaire */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label htmlFor="reset-email" className="block text-sm font-semibold text-slate-700">
                    Votre Email
                  </label>
                  <div className="relative">
                    <input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all text-[15px]"
                      placeholder="directeur@ecole.cd"
                    />
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-slate-900 text-white rounded-full font-medium text-[15px] hover:bg-slate-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    "Envoyer le lien de réinitialisation"
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Confirmation après envoi */
            <div className="text-center py-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-5">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
                Vérifiez votre boîte email
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Si un compte existe pour <span className="font-semibold text-slate-900">{email}</span>,
                vous recevrez un email contenant les instructions pour réinitialiser votre mot de passe.
              </p>

              <div className="space-y-3">
                <Link
                  href="/login"
                  className="block w-full py-3.5 bg-slate-900 text-white rounded-full font-medium text-sm hover:bg-slate-800 transition-all shadow-md shadow-slate-900/15"
                >
                  Retour à la connexion
                </Link>

                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="block w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Renvoyer avec une autre adresse email
                </button>
              </div>
            </div>
          )}

          {/* Lien retour en bas */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Retour à la connexion</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
