"use client";

import {
  Check,
  CheckCircle2,
  ChevronRight,
  Edit3,
  Plus,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  ToggleLeft,
  ToggleRight,
  Users,
} from "lucide-react";
import { useState } from "react";


type Role = { id: string; name: string; description: string; count: string; active: boolean; initials: string };
type PermissionGroup = { module: string; permissions: string[] };

const initialRoles: Role[] = [
  { id: "direction", name: "Direction (Préfet)", description: "Pilotage de l'établissement et validation des opérations", count: "184 utilisateurs", active: true, initials: "DP" },
  { id: "administration", name: "Administration", description: "Gestion quotidienne des comptes et dossiers", count: "236 utilisateurs", active: true, initials: "AD" },
  { id: "pedagogique", name: "Personnel pédagogique", description: "Suivi pédagogique et coordination des équipes", count: "96 utilisateurs", active: true, initials: "PP" },
  { id: "enseignant", name: "Enseignant", description: "Accès aux classes, élèves et évaluations", count: "1 840 utilisateurs", active: true, initials: "EN" },
  { id: "titulaire", name: "Titulaire de classe", description: "Responsable du suivi d'une classe attribuée", count: "420 utilisateurs", active: true, initials: "TC" },
  { id: "eleve", name: "Élève", description: "Accès personnel aux cours et résultats", count: "38 210 utilisateurs", active: false, initials: "EL" },
];

const permissionGroups: PermissionGroup[] = [
  { module: "Inscriptions", permissions: ["Consulter", "Créer", "Modifier", "Valider"] },
  { module: "Paiements", permissions: ["Consulter", "Créer", "Modifier", "Valider"] },
  { module: "Communication", permissions: ["Consulter", "Créer", "Modifier", "Supprimer"] },
  { module: "Notes & Bulletins", permissions: ["Consulter", "Créer", "Modifier", "Valider"] },
  { module: "Utilisateurs", permissions: ["Consulter", "Créer", "Modifier", "Supprimer"] },
  { module: "Rapports", permissions: ["Consulter", "Créer", "Exporter"] },
];

const initialPermissions: Record<string, Record<string, boolean>> = {
  direction: { "Inscriptions-Consulter": true, "Inscriptions-Créer": true, "Inscriptions-Modifier": true, "Inscriptions-Valider": true, "Paiements-Consulter": true, "Paiements-Créer": true, "Paiements-Modifier": true, "Paiements-Valider": true, "Communication-Consulter": true, "Communication-Créer": true, "Communication-Modifier": true, "Communication-Supprimer": false, "Notes & Bulletins-Consulter": true, "Notes & Bulletins-Créer": true, "Notes & Bulletins-Modifier": true, "Notes & Bulletins-Valider": true, "Utilisateurs-Consulter": true, "Utilisateurs-Créer": true, "Utilisateurs-Modifier": true, "Utilisateurs-Supprimer": false, "Rapports-Consulter": true, "Rapports-Créer": true, "Rapports-Exporter": true },
  administration: { "Inscriptions-Consulter": true, "Inscriptions-Créer": true, "Inscriptions-Modifier": true, "Inscriptions-Valider": false, "Paiements-Consulter": true, "Paiements-Créer": true, "Paiements-Modifier": true, "Paiements-Valider": false, "Communication-Consulter": true, "Communication-Créer": true, "Communication-Modifier": false, "Communication-Supprimer": false, "Notes & Bulletins-Consulter": true, "Notes & Bulletins-Créer": false, "Notes & Bulletins-Modifier": false, "Notes & Bulletins-Valider": false, "Utilisateurs-Consulter": true, "Utilisateurs-Créer": true, "Utilisateurs-Modifier": true, "Utilisateurs-Supprimer": false, "Rapports-Consulter": true, "Rapports-Créer": false, "Rapports-Exporter": true },
  pedagogique: { "Inscriptions-Consulter": true, "Inscriptions-Créer": false, "Inscriptions-Modifier": false, "Inscriptions-Valider": false, "Paiements-Consulter": false, "Paiements-Créer": false, "Paiements-Modifier": false, "Paiements-Valider": false, "Communication-Consulter": true, "Communication-Créer": true, "Communication-Modifier": true, "Communication-Supprimer": false, "Notes & Bulletins-Consulter": true, "Notes & Bulletins-Créer": true, "Notes & Bulletins-Modifier": true, "Notes & Bulletins-Valider": true, "Utilisateurs-Consulter": true, "Utilisateurs-Créer": false, "Utilisateurs-Modifier": false, "Utilisateurs-Supprimer": false, "Rapports-Consulter": true, "Rapports-Créer": true, "Rapports-Exporter": true },
  enseignant: { "Inscriptions-Consulter": true, "Inscriptions-Créer": false, "Inscriptions-Modifier": false, "Inscriptions-Valider": false, "Paiements-Consulter": false, "Paiements-Créer": false, "Paiements-Modifier": false, "Paiements-Valider": false, "Communication-Consulter": true, "Communication-Créer": true, "Communication-Modifier": false, "Communication-Supprimer": false, "Notes & Bulletins-Consulter": true, "Notes & Bulletins-Créer": true, "Notes & Bulletins-Modifier": true, "Notes & Bulletins-Valider": false, "Utilisateurs-Consulter": false, "Utilisateurs-Créer": false, "Utilisateurs-Modifier": false, "Utilisateurs-Supprimer": false, "Rapports-Consulter": true, "Rapports-Créer": false, "Rapports-Exporter": false },
};

export default function RolesPermissions() {
  
  const [roles, setRoles] = useState(initialRoles);
  const [selectedRole, setSelectedRole] = useState("direction");
  const [permissions, setPermissions] = useState(initialPermissions);
  const [dirty, setDirty] = useState(false);
  const [notice, setNotice] = useState("");
  const role = roles.find((item) => item.id === selectedRole) ?? roles[0];
  const currentPermissions = permissions[selectedRole] ?? {};

  const togglePermission = (module: string, permission: string) => {
    const key = `${module}-${permission}`;
    setPermissions((current) => ({ ...current, [selectedRole]: { ...current[selectedRole], [key]: !current[selectedRole]?.[key] } }));
    setDirty(true);
    setNotice("");
  };
  const toggleRole = (id: string) => setRoles((current) => current.map((item) => item.id === id ? { ...item, active: !item.active } : item));

  return (<><div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><div className="mb-2 flex items-center gap-1.5 text-[9px] text-[#81909d]"><span className="rounded bg-[#e8f1f7] px-2 py-1 font-bold uppercase tracking-[0.07em] text-[#436b85]">▦ EDUGOMA SAAS › PLATFORM CONTROL CENTER</span><span>•</span><span>Utilisateurs &amp; accès</span></div><h1 className="text-[23px] font-bold tracking-[-0.04em] text-[#172f45]">Rôles &amp; Permissions</h1><p className="mt-1 text-[11px] text-[#778894]">Définition des rôles disponibles et de leurs permissions sur la plateforme EduGoma</p></div><button onClick={() => setNotice("Le formulaire de création de rôle sera disponible prochainement.")} className="flex h-8 items-center gap-1.5 rounded-md bg-[#102d48] px-3 text-[10px] font-bold text-white shadow-sm hover:bg-[#193d5e]"><Plus size={13} /> Créer un rôle</button></div>{notice && <div className="mb-3 flex items-center justify-between rounded-md border border-[#cde9dc] bg-[#effaf5] px-3 py-2 text-[10px] font-semibold text-[#2b8e6b]">{notice}<button onClick={() => setNotice("")}><Check size={13} /></button></div>}<div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(280px,0.32fr)_minmax(0,0.68fr)]"><section className="rounded-md border border-[#e4eaf0] bg-white p-3 shadow-[0_2px_7px_rgba(33,60,84,0.025)]"><div className="mb-3 flex items-center justify-between px-1"><div><h2 className="text-[12px] font-bold text-[#23394e]">Rôles disponibles</h2><p className="mt-1 text-[9px] text-[#8a97a4]">Modèles utilisés par les écoles</p></div><span className="rounded-full bg-[#eef3f7] px-2 py-1 text-[8px] font-bold text-[#687f8f]">{roles.length} rôles</span></div><div className="space-y-2">{roles.map((item) => <button key={item.id} onClick={() => { setSelectedRole(item.id); setNotice(""); }} className={`w-full rounded-md border p-3 text-left transition ${selectedRole === item.id ? "border-[#a9c4d5] bg-[#f2f8fb] shadow-[0_2px_7px_rgba(44,92,121,0.08)]" : "border-[#e8eef1] bg-white hover:border-[#cadbe5]"}`}><div className="flex items-start gap-2.5"><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[9px] font-extrabold ${selectedRole === item.id ? "bg-[#102d48] text-white" : "bg-[#eaf1f5] text-[#5d7b8e]"}`}>{item.initials}</span><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><span className="text-[10px] font-bold text-[#40596b]">{item.name}</span>{selectedRole === item.id && <ChevronRight size={13} className="text-[#4b7b96" />}</span><span className="mt-1 block text-[8px] leading-[1.4] text-[#8b99a4]">{item.description}</span><span className="mt-2 flex items-center gap-1 text-[8px] font-semibold text-[#80919d]"><Users size={10} />{item.count}</span></span><span onClick={(event) => { event.stopPropagation(); toggleRole(item.id); }} className="mt-0.5 text-[#6c8999]" title={item.active ? "Désactiver le rôle" : "Activer le rôle"}>{item.active ? <ToggleRight size={19} /> : <ToggleLeft size={19} />}</span><span onClick={(event) => { event.stopPropagation(); setNotice(`Modification du rôle « ${item.name} ».`); }} className="mt-0.5 text-[#92a1ab] hover:text-[#4e7893]"><Edit3 size={12} /></span></div></button>)}</div></section><section className="relative rounded-md border border-[#e4eaf0] bg-white shadow-[0_2px_7px_rgba(33,60,84,0.025)]"><div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#edf1f4] px-4 py-3"><div><div className="flex items-center gap-2"><span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#e8f1f7] text-[#52718a]"><ShieldCheck size={13} /></span><div><p className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#8d9aa5]">Matrice de permissions</p><h2 className="mt-0.5 text-[13px] font-bold text-[#23394e]">{role.name}</h2></div></div></div><span className={`rounded px-2 py-1 text-[9px] font-bold ${role.active ? "bg-[#e5f7ef] text-[#379d78]" : "bg-[#eef2f5] text-[#71808d]"}`}>{role.active ? "Actif" : "Désactivé"}</span></div><div className="mx-4 mt-3 flex gap-2 rounded-md border border-[#d6e7ef] bg-[#f1f8fb] px-3 py-2.5 text-[9px] leading-[1.5] text-[#617b8a]"><InfoIcon /> <span>Ces rôles sont des modèles par défaut. Chaque école peut adapter les intitulés de fonction à son organisation réelle, sans changer les permissions sous-jacentes.</span></div><div className="p-4"><div className="mb-3 flex items-center justify-between"><p className="text-[10px] font-semibold text-[#6c7e8a]">Permissions accordées</p><p className="text-[9px] text-[#9aa6af]">Cliquez sur une permission pour la modifier</p></div><div className="space-y-2.5">{permissionGroups.map((group) => <div key={group.module} className="overflow-hidden rounded-md border border-[#e7edf0]"><div className="flex items-center justify-between bg-[#f8fafc] px-3 py-2"><span className="text-[10px] font-bold text-[#536a79]">{group.module}</span><span className="text-[8px] text-[#9aa5af]">{group.permissions.filter((permission) => currentPermissions[`${group.module}-${permission}`]).length}/{group.permissions.length} autorisées</span></div><div className="grid grid-cols-2 gap-x-2 gap-y-1 px-3 py-2 sm:grid-cols-4">{group.permissions.map((permission) => { const key = `${group.module}-${permission}`; const enabled = !!currentPermissions[key]; return <button key={permission} onClick={() => togglePermission(group.module, permission)} className="flex items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-[#f5f8fa]"><span className={`flex h-4 w-4 items-center justify-center rounded border ${enabled ? "border-[#3b9d7a] bg-[#3b9d7a] text-white" : "border-[#cdd9df] bg-white text-transparent"}`}><Check size={10} /></span><span className={`text-[9px] font-semibold ${enabled ? "text-[#4e6c7b]" : "text-[#9aa6af]"}`}>{permission}</span></button>; })}</div></div>)}</div></div>{dirty && <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-[#dfe8ec] bg-white/95 px-4 py-3 backdrop-blur-sm"><span className="text-[9px] font-semibold text-[#ba7938]">Modifications non enregistrées</span><button onClick={() => { setDirty(false); setNotice(`Les permissions du rôle « ${role.name} » ont été enregistrées.`); }} className="flex items-center gap-2 rounded-md bg-[#102d48] px-3 py-2 text-[9px] font-bold text-white hover:bg-[#193d5e]"><Save size={12} /> Enregistrer les modifications</button></div>}</section></div></>);
}

function InfoIcon() {
  return <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#dcecf3] text-[9px] font-extrabold text-[#54819a]">i</span>;
}

