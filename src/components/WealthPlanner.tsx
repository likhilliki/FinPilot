import React, { useState } from "react";
import { 
  Target, Sliders, Play, Plus, RefreshCw, CheckCircle2, 
  Trash2, ShieldCheck, Award, Zap, ArrowRight, Wallet, Flame 
} from "lucide-react";
import { LifeGoal, AIRecommendation, ActiveWorkflow } from "../types";

interface WealthPlannerProps {
  goals: LifeGoal[];
  setGoals: React.Dispatch<React.SetStateAction<LifeGoal[]>>;
  recommendations: AIRecommendation[];
  workflows: ActiveWorkflow[];
  onExecuteWorkflow: (action: string, targetId?: string) => Promise<void>;
  isWorkflowLoading: boolean;
}

export default function WealthPlanner({ 
  goals, 
  setGoals, 
  recommendations, 
  workflows, 
  onExecuteWorkflow,
  isWorkflowLoading 
}: WealthPlannerProps) {
  
  // States for simple goal interactive projections
  const [selectedGoalId, setSelectedGoalId] = useState<string>(goals[0]?.id || "");
  const currentGoal = goals.find(g => g.id === selectedGoalId) || goals[0];

  const handleSipChange = (val: number) => {
    setGoals(prev => prev.map(g => {
      if (g.id === selectedGoalId) {
        // Calculate dynamic projection status
        const projectedMonths = (g.targetAmount - g.currentAmount) / val;
        const status = projectedMonths <= 60 ? "On Track" : "Off Track";
        return { ...g, sipAmount: val, status };
      }
      return g;
    }));
  };

  const handleTargetChange = (val: number) => {
    setGoals(prev => prev.map(g => {
      if (g.id === selectedGoalId) {
        return { ...g, targetAmount: val };
      }
      return g;
    }));
  };

  // Projected wealth calculator helper
  const calculateMilestoneDate = (goal: LifeGoal) => {
    if (!goal) return "N/A";
    const balanceNeeded = goal.targetAmount - goal.currentAmount;
    if (balanceNeeded <= 0) return "Achieved";
    const monthsNeeded = Math.ceil(balanceNeeded / goal.sipAmount);
    const date = new Date();
    date.setMonth(date.getMonth() + monthsNeeded);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      
      {/* LEFT COLUMN: ACTIVE GOALS & ACCUMULATION SLIDERS (7 COLS) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* LIFE GOAL CARD SELECTION */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-sans">Active Accumulation Milestones</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 uppercase">Life Goals</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {goals.map((goal) => {
              const pct = Math.round((goal.currentAmount / goal.targetAmount) * 100);
              const isSelected = goal.id === selectedGoalId;
              return (
                <div 
                  key={goal.id}
                  onClick={() => setSelectedGoalId(goal.id)}
                  className={`cursor-pointer rounded-xl p-4 border transition-all duration-300 ${
                    isSelected 
                      ? "bg-slate-900 border-indigo-500/50 shadow-md" 
                      : "bg-slate-950/50 border-slate-900 hover:border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{goal.name}</span>
                    <span className={`text-[9px] font-semibold font-mono uppercase px-1.5 py-0.5 rounded ${
                      goal.status === "On Track" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400"
                    }`}>
                      {goal.status}
                    </span>
                  </div>
                  
                  {/* Progress Line */}
                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>${goal.currentAmount.toLocaleString()}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                      <div 
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DYNAMIC INTERACTIVE PROJECTOR IF GOAL SELECTED */}
          {currentGoal && (
            <div className="bg-slate-900/30 rounded-xl p-4 border border-slate-900 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-900 pb-2 mb-2">
                <Sliders className="h-4 w-4 text-indigo-400" />
                <span className="text-[11px] font-mono text-slate-400 uppercase">Target Milestones Simulator</span>
              </div>

              {/* Slider 1: Target Amount */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Target Value Goal</span>
                  <span className="font-semibold text-white font-mono">${currentGoal.targetAmount.toLocaleString()}</span>
                </div>
                <input
                  id="target-amount-slider"
                  type="range"
                  min="20000"
                  max="300000"
                  step="5000"
                  value={currentGoal.targetAmount}
                  onChange={(e) => handleTargetChange(Number(e.target.value))}
                  className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Slider 2: Monthly SIP contribution */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Monthly Contribution Plan (SIP)</span>
                  <span className="font-semibold text-white font-mono">${currentGoal.sipAmount}/mo</span>
                </div>
                <input
                  id="sip-amount-slider"
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={currentGoal.sipAmount}
                  onChange={(e) => handleSipChange(Number(e.target.value))}
                  className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Calculated Outputs */}
              <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-900 pt-3.5">
                <div>
                  <p className="text-[10px] font-mono text-slate-500">PROJECTED COMPLETION</p>
                  <p className="text-sm font-bold text-indigo-400 font-mono mt-0.5">
                    {calculateMilestoneDate(currentGoal)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-slate-500">REMAINING DEBT BUFFER</p>
                  <p className="text-sm font-bold text-slate-300 font-mono mt-0.5">
                    ${(currentGoal.targetAmount - currentGoal.currentAmount).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ACTIVE WORKFLOWS AUTOMATED SCHEDULER */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-sans">Active Autonomous Triggers</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">Autopilot Engaged</span>
          </div>

          <div className="space-y-2.5">
            {workflows.map((wf) => (
              <div 
                key={wf.id}
                className="flex items-center justify-between bg-slate-900/30 border border-slate-900 rounded-xl p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/10">
                    {wf.type === "sip" ? <Target className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{wf.name}</h4>
                    <p className="text-[10px] text-slate-500 font-mono">{wf.details}</p>
                  </div>
                </div>
                <span className="rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-medium uppercase font-mono">
                  {wf.status}
                </span>
              </div>
            ))}
          </div>

          {/* Gamification Badge board */}
          <div className="mt-5 border-t border-slate-900 pt-4">
            <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">Earned Badges & Shield Level</h4>
            <div className="flex gap-4">
              <div className="flex items-center gap-2.5 bg-slate-900/40 p-2.5 rounded-xl border border-slate-900">
                <Award className="h-5 w-5 text-amber-400" />
                <div>
                  <p className="text-[11px] font-bold text-slate-200">Sovereign Sweeper</p>
                  <p className="text-[9px] text-slate-500">Autonomous FD Active</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 bg-slate-900/40 p-2.5 rounded-xl border border-slate-900">
                <Award className="h-5 w-5 text-indigo-400" />
                <div>
                  <p className="text-[11px] font-bold text-slate-200">Leak Shields Active</p>
                  <p className="text-[9px] text-slate-500">Inactive subscriptions blocked</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: RECOM_DECK INSIGHT FLIGHT (5 COLS) */}
      <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-950/40 p-5 backdrop-blur-md shadow-xl h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-sans">AI Recommendations Engine</span>
            <span className="text-[10px] font-mono text-rose-400">Confidence Tiers</span>
          </div>

          <div className="space-y-4">
            {recommendations.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-12 bg-slate-900/10 rounded-xl border border-slate-900">
                <CheckCircle2 className="h-8 w-8 text-emerald-400 mb-2" />
                <h4 className="text-xs font-semibold text-slate-300">All Suggestions Optimised!</h4>
                <p className="text-[10px] text-slate-500 max-w-xs mt-1">
                  Our continuous background multi-agents find no leakages or underperforming cash positions. Great job!
                </p>
              </div>
            ) : (
              recommendations.map((rec) => (
                <div 
                  key={rec.id}
                  className="relative group p-4 rounded-xl bg-slate-900/30 border border-slate-900 hover:border-slate-850 transition-all duration-300 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-200">{rec.title}</span>
                      <span className="text-[9px] font-mono text-rose-400 uppercase mt-0.5">Confidence: {rec.confidence}%</span>
                    </div>
                    {rec.impactAmount && rec.impactAmount > 0 ? (
                      <span className="rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-mono font-bold">
                        +${rec.impactAmount}/yr
                      </span>
                    ) : null}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">{rec.description}</p>
                  
                  <div className="bg-slate-950 p-2 rounded text-[10px] font-mono text-slate-500 border border-slate-900 italic">
                    {rec.reasoning}
                  </div>

                  <button
                    id={`execute-recommendation-${rec.id}`}
                    onClick={() => {
                      if (rec.id.includes("sal") || rec.id === "rec_1") {
                        onExecuteWorkflow("create_fd");
                      } else if (rec.id.includes("fraud") || rec.id === "rec_2") {
                        onExecuteWorkflow("cancel_sub");
                      } else {
                        onExecuteWorkflow("create_fd");
                      }
                    }}
                    disabled={isWorkflowLoading}
                    className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/10 transition-colors cursor-pointer"
                  >
                    {isWorkflowLoading ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <>
                        <span>{rec.suggestedAction}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border-t border-slate-900 pt-3.5 mt-5">
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Shield Protocol matches active Basel III limits.</span>
          </div>
        </div>
      </div>

    </div>
  );
}
