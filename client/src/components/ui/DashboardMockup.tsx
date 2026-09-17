import { CheckCircle2, MoreHorizontal, Bell, LayoutDashboard, Users, BookOpen } from "lucide-react";

export interface DashboardMockupProps {
  variant: "browser" | "phone";
  title: string;
  stats: { value: string; label: string }[];
  rows: { name: string; badge: string; badgeVariant: "good" | "pending" }[];
  showChart?: boolean;
  chartData?: number[];
  className?: string;
}

export function DashboardMockup({ variant, title, stats, rows, showChart, chartData = [40, 70, 45, 90, 65, 85, 50], className = "" }: DashboardMockupProps) {
  const renderContent = () => (
    <div className="flex flex-col gap-4 p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <div><p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-secondary">Tableau de bord</p><h3 className="text-lg font-extrabold tracking-tight text-brand-primary">{title}</h3></div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-secondary/10 text-brand-secondary"><Bell className="h-4 w-4" /></div>
      </div>
      <div className={`grid gap-2.5 ${variant === "browser" ? "grid-cols-3" : "grid-cols-2"}`}>
        {stats.map((stat, i) => <div key={i} className="rounded-xl border border-slate-100 bg-white p-3 shadow-[0_4px_14px_rgba(16,42,86,0.05)]"><div className="text-xl font-extrabold tracking-tight text-brand-primary">{stat.value}</div><div className="mt-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</div></div>)}
      </div>
      {showChart && <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-[0_4px_14px_rgba(16,42,86,0.05)]"><div className="mb-3 flex items-center justify-between"><span className="text-xs font-bold text-slate-600">Activité des élèves</span><span className="text-[10px] font-bold text-emerald-500">+12,8%</span></div><div className="flex h-24 items-end gap-2">{chartData.map((height, i) => <div key={i} className="flex h-full flex-1 items-end rounded-t-md bg-brand-secondary/10" style={{ height: `${Math.max(height, 20)}%` }}><div className="w-full rounded-t-md bg-gradient-to-t from-brand-secondary to-brand-accent" style={{ height: "70%" }} /></div>)}</div></div>}
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_4px_14px_rgba(16,42,86,0.05)]">{rows.map((row, i) => <div key={i} className="flex items-center justify-between border-b border-slate-50 p-3 last:border-0"><div className="flex min-w-0 items-center gap-2.5"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">{i === 0 ? <Users className="h-3.5 w-3.5" /> : <BookOpen className="h-3.5 w-3.5" />}</span><span className="truncate text-xs font-bold text-slate-700">{row.name}</span></div><span className={`ml-2 shrink-0 rounded-full px-2 py-1 text-[9px] font-bold ${row.badgeVariant === "good" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>{row.badge}</span></div>)}</div>
    </div>
  );

  if (variant === "browser") return <div className={`overflow-hidden rounded-2xl border border-white/80 bg-slate-50 shadow-[0_24px_70px_rgba(16,42,86,0.18)] ${className}`}><div className="flex items-center justify-between bg-brand-primary px-4 py-3"><div className="flex gap-1.5"><div className="h-2.5 w-2.5 rounded-full bg-rose-300" /><div className="h-2.5 w-2.5 rounded-full bg-amber-300" /><div className="h-2.5 w-2.5 rounded-full bg-emerald-300" /></div><span className="text-[10px] font-semibold text-white/50">app.edugoma.cd</span><div className="w-10" /></div><div className="flex min-h-[400px]"><aside className="hidden w-16 flex-col items-center gap-6 border-r border-slate-100 bg-white py-5 sm:flex"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-secondary to-brand-accent text-xs font-extrabold text-white">E</div><LayoutDashboard className="h-4 w-4 text-brand-secondary" /><Users className="h-4 w-4 text-slate-300" /><BookOpen className="h-4 w-4 text-slate-300" /></aside><div className="min-w-0 flex-1 bg-[#f7faff]">{renderContent()}</div></div></div>;

  return <div className={`relative mx-auto w-[300px] overflow-hidden rounded-[2.5rem] border-4 border-brand-primary bg-slate-50 shadow-[0_24px_60px_rgba(16,42,86,0.22)] ${className}`}><div className="absolute inset-x-0 top-0 z-10 flex h-6 justify-center"><div className="h-4 w-24 rounded-b-xl bg-brand-primary" /></div><div className="min-h-[500px] pb-20 pt-8">{renderContent()}</div><div className="absolute inset-x-0 bottom-0 flex h-16 items-center justify-around border-t border-slate-100 bg-white px-4"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-secondary/10 text-brand-secondary"><CheckCircle2 size={18} /></div><div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400"><MoreHorizontal size={18} /></div><div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400"><MoreHorizontal size={18} /></div></div></div>;
}
