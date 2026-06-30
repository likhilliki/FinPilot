import React, { useState, useEffect } from "react";
import { 
  Cpu, Database, Sparkles, CheckCircle2, ShieldAlert, Zap,
  Compass, TrendingUp, Users, RefreshCw, Key, Landmark 
} from "lucide-react";
import { AgentRunLog, MemoryNode } from "../types";

interface AIBrainVisualizerProps {
  logs: AgentRunLog[];
  memories: MemoryNode[];
  healthScore: number;
}

const AGENTS = [
  { name: "SBI Branch Manager", role: "Board Chairman", icon: Landmark, color: "text-amber-400 border-amber-500/20 bg-amber-500/5" },
  { name: "SBI Relationship Manager", role: "Elite Advisor", icon: Users, color: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5" },
  { name: "SBI Investment Advisor", role: "Asset Placement", icon: TrendingUp, color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" },
  { name: "SBI Fraud Investigator", role: "Shield & Security", icon: ShieldAlert, color: "text-rose-400 border-rose-500/20 bg-rose-500/5" },
  { name: "SBI Compliance Officer", role: "Basel III Auditor", icon: Key, color: "text-violet-400 border-violet-500/20 bg-violet-500/5" },
  { name: "SBI Loan Officer", role: "Capital Mortgages", icon: Compass, color: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5" }
];

export default function AIBrainVisualizer({ logs, memories, healthScore }: AIBrainVisualizerProps) {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [pulsingAgent, setPulsingAgent] = useState<string>("SBI Relationship Manager");

  // Cycle pulsing agent to make the "Brain" feel completely alive and ambient
  useEffect(() => {
    const interval = setInterval(() => {
      const activeFromLogs = logs[0]?.agentName;
      if (activeFromLogs) {
        setPulsingAgent(activeFromLogs);
      } else {
        const randomAgent = AGENTS[Math.floor(Math.random() * AGENTS.length)].name;
        setPulsingAgent(randomAgent);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [logs]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* LEFT PANEL: REALTIME AGENT COLLABORATION MAP (7 COLS) */}
      <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-950/40 p-5 backdrop-blur-md shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-4">
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-indigo-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-sans">Live Agent Collaboration Map</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              Continuous Synergy
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            The World&apos;s first autonomous bank operating system runs on concurrent multi-agent protocols. 
            When transactions settle or events fire, specialized agents collaborate on our secure central memory loop.
          </p>

          {/* DYNAMIC COLLABORATION MAP CANVAS (SVG Grid) */}
          <div className="relative border border-slate-900 bg-slate-950/60 rounded-xl p-6 overflow-hidden h-64 flex items-center justify-center">
            
            {/* SVG Connecting Paths */}
            <svg className="absolute inset-0 h-full w-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="grad-active" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#34d399" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              {/* Core central node connections */}
              <line x1="50%" y1="50%" x2="20%" y2="25%" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="50%" y1="50%" x2="80%" y2="25%" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="50%" y1="50%" x2="20%" y2="75%" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="50%" y1="50%" x2="80%" y2="75%" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="50%" y1="50%" x2="50%" y2="15%" stroke="#334155" strokeWidth="1" />
              <line x1="50%" y1="50%" x2="50%" y2="85%" stroke="#334155" strokeWidth="1" />

              {/* Pulsing connection line to signify dynamic communication */}
              <circle cx="50%" cy="50%" r="6" fill="#6366f1" className="animate-ping" style={{ animationDuration: '3s' }} />
            </svg>

            {/* Central Memory Core Node */}
            <div className="absolute z-10 flex flex-col items-center justify-center h-16 w-16 rounded-full border border-indigo-500/40 bg-slate-950/90 shadow-lg shadow-indigo-500/5">
              <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" />
              <span className="text-[9px] font-mono font-bold text-slate-300 mt-1 uppercase tracking-widest">Core</span>
            </div>

            {/* Top Agent (Branch Manager) */}
            <div className={`absolute top-4 left-1/2 -translate-x-1/2 p-2 rounded-lg border flex items-center gap-1.5 transition-all duration-500 ${
              pulsingAgent === "SBI Branch Manager" ? "border-amber-500 bg-amber-500/10 scale-105 shadow-md shadow-amber-500/5" : "border-slate-850 bg-slate-900/40"
            }`}>
              <Landmark className={`h-4 w-4 ${pulsingAgent === "SBI Branch Manager" ? "text-amber-400 animate-bounce" : "text-slate-500"}`} />
              <span className="text-[10px] font-bold text-slate-200">Branch Manager</span>
            </div>

            {/* Top-Left Agent (Relationship Manager) */}
            <div className={`absolute top-12 left-4 p-2 rounded-lg border flex items-center gap-1.5 transition-all duration-500 ${
              pulsingAgent === "SBI Relationship Manager" ? "border-indigo-500 bg-indigo-500/10 scale-105 shadow-md shadow-indigo-500/5" : "border-slate-850 bg-slate-900/40"
            }`}>
              <Users className={`h-4 w-4 ${pulsingAgent === "SBI Relationship Manager" ? "text-indigo-400 animate-pulse" : "text-slate-500"}`} />
              <span className="text-[10px] font-bold text-slate-200">Relationship Manager</span>
            </div>

            {/* Top-Right Agent (Investment Advisor) */}
            <div className={`absolute top-12 right-4 p-2 rounded-lg border flex items-center gap-1.5 transition-all duration-500 ${
              pulsingAgent === "SBI Investment Advisor" ? "border-emerald-500 bg-emerald-500/10 scale-105 shadow-md shadow-emerald-500/5" : "border-slate-850 bg-slate-900/40"
            }`}>
              <TrendingUp className={`h-4 w-4 ${pulsingAgent === "SBI Investment Advisor" ? "text-emerald-400 animate-pulse" : "text-slate-500"}`} />
              <span className="text-[10px] font-bold text-slate-200">Investment Advisor</span>
            </div>

            {/* Bottom-Left Agent (Fraud Investigator) */}
            <div className={`absolute bottom-12 left-4 p-2 rounded-lg border flex items-center gap-1.5 transition-all duration-500 ${
              pulsingAgent === "SBI Fraud Investigator" ? "border-rose-500 bg-rose-500/10 scale-105 shadow-md shadow-rose-500/5" : "border-slate-850 bg-slate-900/40"
            }`}>
              <ShieldAlert className={`h-4 w-4 ${pulsingAgent === "SBI Fraud Investigator" ? "text-rose-400 animate-pulse" : "text-slate-500"}`} />
              <span className="text-[10px] font-bold text-slate-200">Fraud Investigator</span>
            </div>

            {/* Bottom-Right Agent (Compliance Officer) */}
            <div className={`absolute bottom-12 right-4 p-2 rounded-lg border flex items-center gap-1.5 transition-all duration-500 ${
              pulsingAgent === "SBI Compliance Officer" ? "border-violet-500 bg-violet-500/10 scale-105 shadow-md shadow-violet-500/5" : "border-slate-850 bg-slate-900/40"
            }`}>
              <Key className={`h-4 w-4 ${pulsingAgent === "SBI Compliance Officer" ? "text-violet-400 animate-pulse" : "text-slate-500"}`} />
              <span className="text-[10px] font-bold text-slate-200">Compliance Officer</span>
            </div>

            {/* Bottom Agent (Loan Officer) */}
            <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 p-2 rounded-lg border flex items-center gap-1.5 transition-all duration-500 ${
              pulsingAgent === "SBI Loan Officer" ? "border-cyan-500 bg-cyan-500/10 scale-105 shadow-md shadow-cyan-500/5" : "border-slate-850 bg-slate-900/40"
            }`}>
              <Compass className={`h-4 w-4 ${pulsingAgent === "SBI Loan Officer" ? "text-cyan-400 animate-bounce" : "text-slate-500"}`} />
              <span className="text-[10px] font-bold text-slate-200">Loan Officer</span>
            </div>
          </div>
        </div>

        {/* Live Active Thought Display */}
        <div className="mt-4 bg-slate-900/40 border border-slate-900 rounded-xl p-3.5">
          <div className="flex justify-between items-center mb-1 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            <span>Active Reflection Stream</span>
            <span className="text-indigo-400">Speaker: {pulsingAgent}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed italic">
            &ldquo;{logs.find(l => l.agentName === pulsingAgent)?.reasoning || 
            `Monitoring central banking liquidity ratios... Evaluating risk coverage matching customer goal timelines.`}&rdquo;
          </p>
        </div>
      </div>

      {/* RIGHT PANEL: DYNAMIC PERSISTENT MEMORY ENGINE (5 COLS) */}
      <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-950/40 p-5 backdrop-blur-md shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-4">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-sans">Cognitive Memory Nodes</span>
            </div>
            <span className="text-[10px] font-mono text-indigo-400">Context Weightings</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Our embedded vector database stores your goals, preferences, recurring schedules, and behavior metrics to optimize predictions over time.
          </p>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {memories.map((mem) => {
              const weightPct = Math.round(mem.weight * 100);
              return (
                <div 
                  key={mem.id}
                  onClick={() => setActiveNodeId(activeNodeId === mem.id ? null : mem.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all duration-300 ${
                    activeNodeId === mem.id 
                      ? "border-indigo-500/50 bg-indigo-500/5 shadow-md" 
                      : "border-slate-900 bg-slate-900/20 hover:border-slate-800"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                      mem.category === "Goal" ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/10" :
                      mem.category === "Behavior" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10" :
                      mem.category === "Preference" ? "bg-amber-500/10 text-amber-400 border border-amber-500/10" :
                      "bg-slate-800/50 text-slate-400"
                    }`}>
                      {mem.category}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">Weight: {weightPct}%</span>
                  </div>
                  
                  <p className="text-xs text-slate-200 leading-normal">{mem.detail}</p>
                  
                  {activeNodeId === mem.id && (
                    <div className="mt-2.5 pt-2 border-t border-slate-900 text-[10px] font-mono text-slate-500 flex justify-between">
                      <span>Last Synced: {mem.lastUpdated}</span>
                      <span className="text-indigo-400">Ready for next projection sweep</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-3.5 border-t border-slate-900 flex justify-between items-center">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>AI Trust Meter standing: 99.8%</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">HEALTH: {healthScore}/100</span>
        </div>
      </div>

    </div>
  );
}
