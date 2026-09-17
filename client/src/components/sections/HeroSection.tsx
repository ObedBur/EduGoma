import { ShieldCheck, LayoutGrid, CreditCard, ArrowRight } from "lucide-react";
import { DashboardMockup } from "../ui/DashboardMockup";

const WHATSAPP_NUMBER = "243XXXXXXXXXXX";

const WHATSAPP_MESSAGE = encodeURIComponent(
  "Bonjour, je souhaite une démonstration d'EduGoma pour mon établissement."
);

const PROMISES = [
  { icon: LayoutGrid, text: "Un espace clair pour chaque établissement." },
  { icon: CreditCard, text: "Inscriptions et paiements réunis au même endroit." },
  { icon: ShieldCheck, text: "Des bulletins fiables, sans calcul manuel." },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-20 pt-16 md:pb-28 md:pt-24 lg:pb-32 lg:pt-28">
      <div className="pointer-events-none absolute -right-40 top-0 h-[32rem] w-[32rem] rounded-full bg-brand-secondary/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-brand-accent/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16 lg:px-8">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-accent/20 bg-brand-accent/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-brand-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-accent shadow-[0_0_0_4px_rgba(24,200,216,0.15)]" />
            La gestion scolaire, réinventée
          </div>
          <h1 className="mb-6 text-4xl font-extrabold leading-[1.08] tracking-[-0.04em] text-brand-primary sm:text-5xl lg:text-[4.25rem]">
            Une école mieux gérée, <span className="bg-gradient-to-r from-brand-secondary to-brand-accent bg-clip-text text-transparent">chaque jour.</span>
          </h1>
          <p className="mb-9 max-w-xl text-lg leading-relaxed text-slate-600 sm:text-xl">
            EduGoma rassemble élèves, équipes et familles dans une plateforme simple, pensée pour les réalités des écoles congolaises.
          </p>
          <div className="mb-12 flex flex-col gap-3 sm:flex-row">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-6 py-3.5 text-base font-bold text-white shadow-xl shadow-brand-primary/20 transition hover:-translate-y-0.5 hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:ring-offset-2">
              Demander une démo <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#comment-ca-marche" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-6 py-3.5 text-base font-bold text-brand-primary shadow-sm transition hover:-translate-y-0.5 hover:border-brand-secondary/30 hover:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:ring-offset-2">
              Voir comment ça marche
            </a>
          </div>
          <div className="grid gap-4 border-t border-slate-200/80 pt-7 sm:grid-cols-3 sm:gap-5">
            {PROMISES.map((promise, idx) => {
              const Icon = promise.icon;
              return <div key={idx} className="flex items-start gap-2.5"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-secondary/10 text-brand-secondary"><Icon className="h-3.5 w-3.5" /></span><p className="text-xs font-semibold leading-relaxed text-slate-600">{promise.text}</p></div>;
            })}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-2xl animate-[fadeInUp_0.8s_ease-out_both] lg:ml-auto">
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-brand-secondary/20 via-transparent to-brand-accent/20 blur-2xl" />
          <DashboardMockup
            variant="browser"
            title="Vue d'ensemble"
            stats={[{ value: "1 248", label: "Élèves" }, { value: "42", label: "Classes" }, { value: "96%", label: "Présence" }]}
            rows={[{ name: "Inscriptions 2024–2025", badge: "À jour", badgeVariant: "good" }, { name: "Bulletins du trimestre", badge: "12 prêts", badgeVariant: "pending" }]}
            showChart
            className="relative"
          />
        </div>
      </div>
    </section>
  );
}
