"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Loader2, Eye, EyeOff, ShieldCheck, AlertCircle } from "lucide-react";
import { authApi } from "@/lib/api";
import { toast } from "sonner";

const AUTH_SCENES = [
  { src: "/images/class1.png", alt: "Salle de classe et enseignant à Goma, RDC" },
  { src: "/images/class2.png", alt: "Élèves en cours de révision et d'étude, RDC" },
  { src: "/images/class3.png", alt: "Cour d'école et élèves en uniforme, RDC" },
];

const SLIDE_DURATION = 5000;

const PASSWORD_RULE =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

function SetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [schoolName, setSchoolName] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((s) => (s + 1) % AUTH_SCENES.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  const loadInfo = useCallback(async () => {
    if (!token) {
      setLoadError("Lien incomplet — jeton manquant.");
      return;
    }
    try {
      const info = await authApi.getSetupInfo(token);
      setSchoolName(info.schoolName);
      setExpiresAt(info.expiresAt);
      setLoadError(null);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Lien invalide ou expiré";
      setLoadError(msg);
    }
  }, [token]);

  useEffect(() => {
    void loadInfo();
  }, [loadInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadError(null);

    if (!PASSWORD_RULE.test(password)) {
      toast.error("Mot de passe trop faible", {
        description: "8+ caractères, majuscule, minuscule, chiffre et caractère spécial.",
      });
      return;
    }
    if (password !== confirm) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    setIsLoading(true);
    try {
      await authApi.completeSetup(token, password);
      setIsDone(true);
      toast.success("Mot de passe créé", {
        description: "Vous pouvez maintenant vous connecter.",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Impossible de créer le mot de passe";
      setLoadError(msg);
      toast.error("Échec", { description: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const ttlMinutes = expiresAt
    ? Math.max(1, Math.round((new Date(expiresAt).getTime() - Date.now()) / 60000))
    : null;

  return (
    <div className="flex min-h-screen w-full bg-white font-sans">
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900">
        {AUTH_SCENES.map((scene, i) => (
          <Image
            key={scene.src}
            src={scene.src}
            alt={scene.alt}
            fill
            unoptimized
            priority={i === 0}
            className={`transition-opacity duration-700 ${
              i === currentSlide ? "opacity-100" : "opacity-0"
            } object-cover`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/40 to-slate-900/20" />
        <div className="absolute bottom-0 left-0 right-0 p-10 text-white">
          <p className="text-[13px] font-bold tracking-[0.2em] uppercase text-emerald-300/90">
            EduGoma
          </p>
          <h1 className="mt-2 text-[32px] font-extrabold tracking-tight leading-tight">
            Créez le mot de passe
            <br />
            de votre école
          </h1>
          <p className="mt-3 max-w-md text-[14px] text-slate-200/85">
            Lien sécurisé à usage unique. Après validation, connectez-vous avec votre
            téléphone ou email.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center px-5 py-10 lg:w-1/2">
        <div className="w-full max-w-[420px]">
          <div className="mb-6 flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#102d48] text-white">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-[15px] font-extrabold tracking-tight text-[#172f45]">
                EduGoma
              </p>
              <p className="text-[11px] text-slate-500">Création du mot de passe</p>
            </div>
          </div>

          {isDone ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-[16px] font-bold text-slate-900">
                Mot de passe créé
              </h2>
              <p className="mt-1 text-[13px] text-slate-600">
                {schoolName ? `${schoolName} est prête.` : "Votre compte est prêt."}
              </p>
              <Link
                href="/login"
                className="mt-5 inline-flex rounded-lg bg-[#102d48] px-5 py-2.5 text-[13px] font-bold text-white hover:bg-[#183d5f] transition-colors"
              >
                Aller à la connexion
              </Link>
            </div>
          ) : loadError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <div className="flex items-start gap-2.5">
                <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-600" />
                <div>
                  <h2 className="text-[14px] font-bold text-red-900">Lien indisponible</h2>
                  <p className="mt-1 text-[12px] leading-relaxed text-red-700">{loadError}</p>
                  <p className="mt-2 text-[12px] text-red-700">
                    Demandez une nouvelle invitation à l&apos;équipe EduGoma.
                  </p>
                </div>
              </div>
              <Link
                href="/login"
                className="mt-4 inline-flex text-[12px] font-semibold text-[#2b6cb0] hover:underline"
              >
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-[12px] font-semibold text-slate-700">
                  {schoolName ?? "Chargement…"}
                </p>
                {ttlMinutes !== null && (
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    Lien valable encore ~{ttlMinutes} min
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-[12px] font-semibold text-slate-700"
                >
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 pr-11 text-[14px] outline-none focus:border-[#102d48] focus:ring-2 focus:ring-[#102d48]/10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? "Masquer" : "Afficher"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  8+ caractères · majuscule · minuscule · chiffre · spécial
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirm"
                  className="mb-1 block text-[12px] font-semibold text-slate-700"
                >
                  Confirmer le mot de passe
                </label>
                <input
                  id="confirm"
                  type={showPassword ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-[14px] outline-none focus:border-[#102d48] focus:ring-2 focus:ring-[#102d48]/10"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !token}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#102d48] text-[13px] font-bold text-white hover:bg-[#183d5f] disabled:opacity-60 transition-colors"
              >
                {isLoading && <Loader2 size={15} className="animate-spin" />}
                Créer mon mot de passe
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <Loader2 size={22} className="animate-spin text-[#102d48]" />
        </div>
      }
    >
      <SetPasswordForm />
    </Suspense>
  );
}
