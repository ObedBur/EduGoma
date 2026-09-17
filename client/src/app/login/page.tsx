"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
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

      {/* Left Side - Image & Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
        {/* Background Image (Modern Architecture/Glass) */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop')",
          }}
        />
        {/* Gradient Overlay to make text readable */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-slate-900/40 via-slate-900/60 to-slate-900/90" />

        {/* Content Wrapper */}
        <div className="relative z-20 flex flex-col justify-between w-full p-12 h-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
              </svg>
            </div>
            <span className="text-white text-2xl font-bold tracking-tight">EduGoma</span>
          </div>

          {/* Large Hero Text at the bottom */}
          <div className="max-w-lg mb-8">
            <h1 className="text-5xl font-bold text-white leading-[1.15] mb-6 tracking-tight">
              Gérez plus vite.<br />
              Décidez mieux.<br />
              Enseignez partout.
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed font-light">
              De la gestion des présences à la facturation, notre outil puissant
              vous permet de diriger votre établissement sans friction.
            </p>
            {/* Pagination / Dots indicator */}
            <div className="flex gap-2 mt-8">
              <div className="w-8 h-1 bg-white rounded-full"></div>
              <div className="w-2 h-1 bg-white/30 rounded-full"></div>
              <div className="w-2 h-1 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24">

        {/* Sign in button top right (optional, matching Realnest style) */}
        <div className="absolute top-8 right-8 hidden sm:block">
          <Link href="/register" className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors">
            Inscription
          </Link>
        </div>

        <div className="w-full max-w-[420px]">
          {/* Mobile Logo (only shows when left side is hidden) */}
          <div className="flex items-center gap-3 mb-12 lg:hidden">
            <div className="bg-slate-900 p-2 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
              </svg>
            </div>
            <span className="text-slate-900 text-2xl font-bold tracking-tight">EduGoma</span>
          </div>

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

          {/* Divider */}
          <div className="relative flex items-center py-8">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">Ou continuer avec</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors text-[14px] font-medium text-slate-700">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
            <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors text-[14px] font-medium text-slate-700">
              <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>

          {/* Bottom Homepage Link */}
          <p className="mt-10 text-center text-[14px] text-slate-500">
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
