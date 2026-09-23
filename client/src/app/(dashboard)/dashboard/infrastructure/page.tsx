"use client";

import { AlertCircle, CheckCircle2, Cloud, Database, HardDrive, RefreshCw, Server, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { StatCard } from "@/components/layout/DashboardShared";

const systemEvents = [
  ["Sauvegarde automatique", "Toutes les données des écoles ont été sauvegardées", "il y a 6h", "green"],
  ["Mise à jour de sécurité", "Protections à jour sur toute la plateforme", "il y a 8h", "blue"],
  ["Certificats renouvelés", "Connexion sécurisée renouvelée sans interruption", "il y a 1j", "green"],
  ["Ralentissement corrigé", "Un ralentissement temporaire a été résolu automatiquement", "il y a 2j", "orange"],
];

export default function Infrastructure() {
  const [notice, setNotice] = useState("");

  return (
    <>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-[9px] text-[#81909d]">
            <span className="rounded bg-[#e8f1f7] px-2 py-1 font-bold uppercase tracking-[0.07em] text-[#436b85]">
              ▦ EDUGOMA SAAS › PLATFORM CONTROL CENTER
            </span>
            <span>•</span>
            <span>État du service</span>
          </div>
          <h1 className="text-[23px] font-bold tracking-[-0.04em] text-[#172f45]">État du service</h1>
          <p className="mt-1 text-[11px] text-[#778894]">Vérifiez que tout fonctionne bien sur la plateforme EduGoma</p>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-[#dce8e1] bg-white px-3 py-2 shadow-[0_2px_6px_rgba(33,60,84,0.025)]">
          <span className="h-2 w-2 rounded-full bg-[#2bad7d]" />
          <div>
            <p className="text-[8px] font-semibold text-[#74818c]">Disponibilité</p>
            <p className="text-[10px] font-bold text-[#2d9d77]">—</p>
          </div>
        </div>
      </div>

      {notice && (
        <div className="mb-3 flex items-center justify-between rounded-md border border-[#cde9dc] bg-[#effaf5] px-3 py-2 text-[10px] font-semibold text-[#2b8e6b]">
          {notice}
          <button onClick={() => setNotice("")} aria-label="Fermer">
            <AlertCircle size={13} />
          </button>
        </div>
      )}

      {/* 4 cartes principales — libellés simples */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Services actifs"
          value="3/3"
          icon={Server}
          accent="green"
          detail={<><span>Tous les services</span><strong className="text-[#2e9d76]">fonctionnent</strong></>}
        />
        <StatCard
          label="Vitesse de réponse"
          value="74 ms"
          icon={RefreshCw}
          accent="blue"
          detail={<><span>Sur les dernières 24h</span><strong className="text-[#4a86b7]">-8 ms vs hier</strong></>}
        />
        <StatCard
          label="Espace de stockage"
          value="148.5 Go"
          icon={HardDrive}
          accent="violet"
          detail={<><span>Données des écoles</span><strong className="text-[#7167bd]">62% de 240 Go</strong></>}
        />
        <StatCard
          label="Dernière sauvegarde"
          value="il y a 6h"
          icon={Cloud}
          accent="green"
          detail={<><span>Prochaine dans 2h</span><strong className="text-[#2e9d76]">Données protégées</strong></>}
        />
      </div>

      {/* Services — libellés simples */}
      <div className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="rounded-xl border border-[#e4eaf0] bg-white p-4 shadow-[0_2px_8px_rgba(20,40,65,0.03)]">
          <div className="flex items-center gap-2 mb-3">
            <Database size={16} className="text-sky-600" />
            <h2 className="text-[12px] font-bold text-[#1a2f42]">Base de données</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-bold text-emerald-700">Connectée</span>
          </div>
          <p className="mt-1 text-[9px] text-[#8e9ca8]">Temps de réponse : 18 ms (très rapide)</p>
        </div>
        <div className="rounded-xl border border-[#e4eaf0] bg-white p-4 shadow-[0_2px_8px_rgba(20,40,65,0.03)]">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={16} className="text-emerald-600" />
            <h2 className="text-[12px] font-bold text-[#1a2f42]">Sécurité</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-bold text-emerald-700">Protégée</span>
          </div>
          <p className="mt-1 text-[9px] text-[#8e9ca8]">Connexions sécurisées · certificats à jour</p>
        </div>
        <div className="rounded-xl border border-[#e4eaf0] bg-white p-4 shadow-[0_2px_8px_rgba(20,40,65,0.03)]">
          <div className="flex items-center gap-2 mb-3">
            <Cloud size={16} className="text-violet-600" />
            <h2 className="text-[12px] font-bold text-[#1a2f42]">Sauvegardes</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-bold text-emerald-700">À jour</span>
          </div>
          <p className="mt-1 text-[9px] text-[#8e9ca8]">Dernière : il y a 6h · Prochaine : dans 2h</p>
        </div>
      </div>

      {/* Historique — langage simple */}
      <div className="rounded-xl border border-[#e4eaf0] bg-white shadow-[0_2px_8px_rgba(20,40,65,0.03)]">
        <div className="border-b border-[#edf1f4] px-4 py-3">
          <h2 className="text-[12px] font-bold text-[#1a2f42]">Historique récent</h2>
        </div>
        <div className="divide-y divide-[#f0f4f7]">
          {systemEvents.map(([title, desc, time, tone]) => (
            <div key={title} className="flex items-start gap-3 px-4 py-3">
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                  tone === "green" ? "bg-emerald-50 text-emerald-600" : tone === "blue" ? "bg-sky-50 text-sky-600" : "bg-orange-50 text-orange-600"
                }`}
              >
                {tone === "orange" ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-[#1a2f42]">{title}</p>
                <p className="text-[9px] text-[#6d7f90]">{desc}</p>
              </div>
              <span className="shrink-0 text-[9px] text-[#9aa6b2]">{time}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
