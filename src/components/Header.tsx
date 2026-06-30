import React from "react";
import { 
  Bot, Cpu, Sparkles, LayoutDashboard, Activity, TrendingUp, Landmark 
} from "lucide-react";

interface HeaderProps {
  activeTab: "dashboard" | "ai" | "health" | "twin" | "admin";
  setActiveTab: (tab: "dashboard" | "ai" | "health" | "twin" | "admin") => void;
  digitalAdoptionScore: number;
}

export default function Header({ activeTab, setActiveTab, digitalAdoptionScore }: HeaderProps) {
  const tabs = [
    { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard, color: "text-blue-400" },
    { id: "ai" as const, label: "FinPilot AI", icon: Bot, color: "text-indigo-400" },
    { id: "health" as const, label: "Financial Health", icon: Activity, color: "text-emerald-400" },
    { id: "twin" as const, label: "Goals & Twin", icon: TrendingUp, color: "text-amber-400" },
    { id: "admin" as const, label: "Executive Boardroom", icon: Cpu, color: "text-rose-400" }
  ];

  return (
    <div className="sticky top-0 z-40 w-full flex flex-col">
      {/* Sandbox Indicator Banner */}
      <div className="bg-slate-900 border-b border-indigo-500/20 text-center py-2 px-4 text-[11px] font-mono text-indigo-300 flex items-center justify-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
        </span>
        <span>
          <strong>Sandbox Banking Environment</strong>: All actions run on a secure, simulated central banking ledger API.
        </span>
      </div>

      <header className="w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600/10 border border-indigo-500/30">
              <Bot className="h-5 w-5 text-indigo-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-display font-bold tracking-tight text-white text-base">SBI FinPilot</span>
                <span className="rounded bg-indigo-500/10 px-1.5 py-0.2 text-[9px] font-semibold text-indigo-400 border border-indigo-500/20">
                  OS Sandbox
                </span>
              </div>
              <p className="text-[9px] font-mono text-slate-500">Multi-Agent Autopilot</p>
            </div>
          </div>

          {/* Navigation Options (Scrollable on small mobile screens) */}
          <nav className="flex space-x-1.5 bg-slate-900/40 p-1 rounded-xl border border-slate-900 overflow-x-auto max-w-full">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  id={`tab-btn-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium font-sans whitespace-nowrap transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm border border-slate-800"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/20 border border-transparent"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${tab.color}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Digital Adoption Meter */}
          <div className="hidden lg:flex items-center gap-3.5 pl-4 border-l border-slate-900">
            <div className="text-right">
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Adoption Score</p>
              <p className="text-xs font-semibold text-slate-300">{digitalAdoptionScore}%</p>
            </div>
            <div className="relative h-7 w-7">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  className="text-slate-900"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  className="text-indigo-500 transition-all duration-500"
                  strokeDasharray={`${digitalAdoptionScore} 100`}
                  strokeWidth="3"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                />
              </svg>
            </div>

            {/* Profile */}
            <div className="flex items-center gap-2 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-900">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-bold">
                LG
              </div>
              <div className="text-left">
                <p className="text-[10.5px] font-medium text-slate-300 leading-none">Likhil Gowda</p>
                <p className="text-[8.5px] font-mono text-slate-500">Elite Wealth</p>
              </div>
            </div>
          </div>

        </div>
      </header>
    </div>
  );
}
