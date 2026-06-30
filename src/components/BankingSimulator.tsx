import React, { useState } from "react";
import { 
  Play, Wallet, AlertTriangle, ShieldCheck, TrendingUp, Sparkles, 
  RefreshCw, CheckCircle2, Cpu 
} from "lucide-react";
import { 
  AccountBalances, Transaction, FinancialHealth, LifeGoal, 
  ActiveWorkflow, LifeEvent, DigitalTwinSim, MemoryNode, AuditLog, 
  AIRecommendation, AgentRunLog 
} from "../types";

interface BankingSimulatorProps {
  onSimulationUpdate: (data: {
    updatedBalances: AccountBalances;
    updatedTransactions: Transaction[];
    updatedHealth: FinancialHealth;
    updatedGoals: LifeGoal[];
    updatedWorkflows: ActiveWorkflow[];
    updatedEvents: LifeEvent[];
    updatedTwin: DigitalTwinSim;
    updatedMemories: MemoryNode[];
    updatedAudits: AuditLog[];
    logs: AgentRunLog[];
    recommendations: AIRecommendation[];
  }) => void;
}

export default function BankingSimulator({ onSimulationUpdate }: BankingSimulatorProps) {
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [systemLogs, setSystemLogs] = useState<string[]>([]);

  const runScenario = async (scenario: string, label: string) => {
    setIsLoading(true);
    setActiveScenario(scenario);
    setSystemLogs([
      `Initializing stochastic protocol for: ${label}`,
      "Retrieving cryptographic central ledger context...",
      "Convening SBI multi-agent collaborative board..."
    ]);

    // Simulate real-time ticking delay to let users read "AI reasoning" instead of a basic spinner!
    await new Promise(resolve => setTimeout(resolve, 1200));

    try {
      const res = await fetch("/api/simulate/scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario })
      });
      const data = await res.json();

      if (data.success) {
        setSystemLogs(prev => [
          ...prev,
          "Collaborative consensus achieved.",
          "Verifying compliance against Basel III rules...",
          "State committed. Rebalancing frontend widgets!"
        ]);
        await new Promise(resolve => setTimeout(resolve, 600));

        onSimulationUpdate({
          updatedBalances: data.updatedBalances,
          updatedTransactions: data.updatedTransactions,
          updatedHealth: data.updatedHealth,
          updatedGoals: data.updatedGoals,
          updatedWorkflows: data.updatedWorkflows,
          updatedEvents: data.updatedEvents,
          updatedTwin: data.updatedTwin,
          updatedMemories: data.updatedMemories,
          updatedAudits: data.updatedAudits,
          logs: data.logs,
          recommendations: data.recommendations
        });
      }
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      setIsLoading(false);
      setActiveScenario(null);
    }
  };

  const SCENARIOS = [
    {
      id: "salary_deposit",
      title: "Salary Direct Inflow",
      desc: "Simulate a $5,500 salary credit. Autopilot triggers high-yield sweeps to FD automatically.",
      icon: Wallet,
      color: "border-indigo-500/10 text-indigo-400 hover:border-indigo-500/40 hover:bg-indigo-500/5",
      btnText: "Simulate Credit"
    },
    {
      id: "card_billing",
      title: "CC Utilization Surge",
      desc: "Process a $1,450 card statement. Triggers utilization warning and debt re-payment recommendation.",
      icon: TrendingUp,
      color: "border-amber-500/10 text-amber-400 hover:border-amber-500/40 hover:bg-amber-500/5",
      btnText: "Charge Card"
    },
    {
      id: "cyber_threat",
      title: "Moscow Cyber Threat",
      desc: "Trigger blocked hack attempt of $4,120. Security Agent blocks it in 12ms and reissues virtual tokens.",
      icon: AlertTriangle,
      color: "border-rose-500/10 text-rose-400 hover:border-rose-500/40 hover:bg-rose-500/5",
      btnText: "Trigger Hack"
    },
    {
      id: "rate_change",
      title: "Central Bank Rate Hike",
      desc: "Sovereign interest rate climbs by 125bps. Investment advisor re-optimizes Fixed Deposit yield to 8.5%.",
      icon: Sparkles,
      color: "border-emerald-500/10 text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/5",
      btnText: "Hike Rates"
    },
    {
      id: "life_event",
      title: "Forecast: New Child Plan",
      desc: "Add family milestone. Projections adapt, emergency risk recalibrates, and trust fund suggestions go active.",
      icon: Cpu,
      color: "border-cyan-500/10 text-cyan-400 hover:border-cyan-500/40 hover:bg-cyan-500/5",
      btnText: "Predict Milestone"
    }
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5 backdrop-blur-md shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-5">
        <div className="flex items-center gap-2">
          <Play className="h-5 w-5 text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-sans">Banking OS Simulation Deck</span>
        </div>
        <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/5 border border-indigo-500/10 px-2 py-0.5 rounded uppercase">
          Interactive Controls
        </span>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed mb-6">
        Simulate real production-grade events. Witness how FinPilot&apos;s specialist agents dynamically react, coordinate, log compliance audits, and rewrite widgets in realtime.
      </p>

      {/* GRID SCENARIOS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {SCENARIOS.map((sc) => {
          const isThisActive = activeScenario === sc.id;
          const Icon = sc.icon;
          return (
            <div 
              key={sc.id}
              className={`flex flex-col justify-between p-4 rounded-xl border bg-slate-900/15 backdrop-blur-sm transition-all duration-300 ${sc.color}`}
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  <h4 className="text-xs font-bold text-slate-200">{sc.title}</h4>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed mb-4">{sc.desc}</p>
              </div>

              <button
                id={`simulate-btn-${sc.id}`}
                disabled={isLoading}
                onClick={() => runScenario(sc.id, sc.title)}
                className="w-full py-1.5 rounded-lg bg-slate-950 hover:bg-slate-900 disabled:opacity-50 text-[10px] font-bold tracking-wider uppercase border border-slate-850 text-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {isThisActive ? (
                  <RefreshCw className="h-3 w-3 animate-spin text-indigo-400" />
                ) : (
                  <>
                    <Play className="h-2.5 w-2.5" />
                    <span>{sc.btnText}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* AI Reasoning Log Panel during activation */}
      {isLoading && (
        <div className="mt-5 bg-slate-950/80 rounded-xl p-4 border border-slate-900 font-mono text-[10px] text-slate-500 space-y-1 animate-pulse">
          <div className="flex items-center gap-2 text-indigo-400 mb-1.5 font-sans font-bold uppercase tracking-widest">
            <Cpu className="h-3.5 w-3.5 animate-spin" />
            <span>Active Orchestrator Thinking Trace</span>
          </div>
          {systemLogs.map((log, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-indigo-500">&gt;&gt;</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
