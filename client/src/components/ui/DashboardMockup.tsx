import React from "react";
import { CheckCircle2, MoreHorizontal } from "lucide-react";

export interface DashboardMockupProps {
  variant: "browser" | "phone";
  title: string;
  stats: { value: string; label: string }[];
  rows: { name: string; badge: string; badgeVariant: "good" | "pending" }[];
  showChart?: boolean;
  chartData?: number[];
  className?: string;
}

export function DashboardMockup({
  variant,
  title,
  stats,
  rows,
  showChart,
  chartData = [40, 70, 45, 90, 65, 85, 50],
  className = "",
}: DashboardMockupProps) {
  const renderContent = () => (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
      
      {/* Stats */}
      <div className={`grid gap-3 ${variant === "browser" ? "grid-cols-3" : "grid-cols-2"}`}>
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
            <div className="text-xl font-bold text-brand-primary">{stat.value}</div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Chart Mockup */}
      {showChart && (
        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex items-end gap-2 h-32 mt-2">
          {chartData.map((h, i) => (
            <div key={i} className="flex-1 bg-brand-primary/20 rounded-t-sm" style={{ height: `${h}%` }}>
              <div className="w-full bg-brand-primary rounded-t-sm" style={{ height: '40%' }}></div>
            </div>
          ))}
        </div>
      )}

      {/* Rows */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm mt-2 overflow-hidden">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center justify-between p-3 border-b border-gray-50 last:border-0 text-sm">
            <span className="font-medium text-gray-700">{row.name}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              row.badgeVariant === "good" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
            }`}>
              {row.badge}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  if (variant === "browser") {
    return (
      <div className={`bg-gray-50 rounded-xl overflow-hidden shadow-2xl border border-gray-200/60 ${className}`}>
        {/* Browser Top Bar */}
        <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
        </div>
        {/* Browser Content */}
        <div className="flex h-full min-h-[400px]">
          {/* Sidebar */}
          <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-6">
            <div className="w-8 h-8 rounded bg-brand-primary text-white flex items-center justify-center font-bold text-xs">Eg</div>
            <div className="w-6 h-6 rounded bg-gray-100"></div>
            <div className="w-6 h-6 rounded bg-gray-100"></div>
            <div className="w-6 h-6 rounded bg-gray-100"></div>
          </div>
          {/* Main Area */}
          <div className="flex-1 bg-gray-50/50">
            {renderContent()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative mx-auto w-[300px] bg-gray-50 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-gray-900 ${className}`}>
      {/* Phone Notch */}
      <div className="absolute top-0 inset-x-0 h-6 flex justify-center">
        <div className="w-24 h-4 bg-gray-900 rounded-b-xl"></div>
      </div>
      
      {/* Phone Content */}
      <div className="pt-8 pb-20 min-h-[500px]">
        {renderContent()}
      </div>

      {/* Phone Tab Bar */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around px-4">
        <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
          <CheckCircle2 size={18} />
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
          <MoreHorizontal size={18} />
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
          <MoreHorizontal size={18} />
        </div>
      </div>
    </div>
  );
}
