"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
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

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    setIsLoading(true);

    try {
      await login(email, password, rememberMe);
      toast.success("Connexion réussie", { description: "Bienvenue sur EduGoma." });
      router.push("/dashboard");
    } catch (err: any) {
      let errorMsg = "Identifiants incorrects ou erreur de connexion";
      if (err instanceof Error) {
        if (typeof err.message === 'string') {
          errorMsg = err.message;
        } else if (typeof err.message === 'object') {
          errorMsg = JSON.stringify(err.message);
        }
      }
      toast.error("Échec de la connexion", { description: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans">

      {/* Left Side - Image Slideshow & Branding (Hidden on mobile) */}
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

        {/* Content Wrapper */}
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

          {/* Large Hero Text at the bottom */}
          <div className="max-w-lg mb-8">
            <h1 className="text-5xl font-bold text-white leading-[1.15] mb-6 tracking-tight drop-shadow-md">
              Gérez plus vite.<br />
              Décidez mieux.<br />
              Enseignez partout.
            </h1>
            <p className="text-slate-100 text-lg leading-relaxed font-light drop-shadow">
              De la gestion des présences à la facturation, notre outil puissant
              vous permet de diriger votre établissement sans friction.
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

    {/* Right Side - Login Form */}
    <div className="w-full lg:w-1/2 relative flex items-center justify-center p-8 sm:p-12 lg:p-24 min-h-screen">

      {/* Bouton Accueil en haut à droite (accessible sur tous les écrans) */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-30">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-all hover:-translate-y-0.5 shadow-md shadow-slate-900/15 active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Accueil</span>
        </Link>
      </div>

      <div className="w-full max-w-[420px]">
        {/* Mobile Logo */}
        <Link href="/" className="flex items-center gap-3 mb-10 lg:hidden w-fit">
          <div className="bg-slate-900 p-2 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
            </svg>
          </div>
          <span className="text-slate-900 text-2xl font-bold tracking-tight">EduGoma</span>
        </Link>

          <div className="mb-8">
            <h2 className="text-[32px] font-bold text-slate-900 mb-2 tracking-tight">Bienvenue !</h2>
            <p className="text-slate-500 text-[15px]">Connectez-vous à votre compte EduGoma.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                Votre Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all text-[15px]"
                placeholder="nom@exemple.com"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-4 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all text-[15px]"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer peer appearance-none checked:bg-slate-900 checked:border-slate-900 transition-all"
                  />
                  <svg className="w-3 h-3 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[14px] text-slate-600 group-hover:text-slate-900 transition-colors">Se souvenir de moi</span>
              </label>
              <Link href="/forgot-password" className="text-[14px] text-slate-500 hover:text-slate-900 transition-colors">
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 mt-2 bg-slate-900 text-white rounded-full font-medium text-[15px] hover:bg-slate-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          {/* Bottom Homepage Link */}
          <p className="mt-8 text-center text-[14px] text-slate-500">
            Découvrez EduGoma pour votre école.{" "}
            <Link href="/" className="font-semibold text-slate-900 hover:underline">
              En savoir plus
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
