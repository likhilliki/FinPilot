import React, { useState } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import { 
  Sparkles, Sliders, TrendingUp, ShieldCheck, Wallet, Activity, ArrowUpRight 
} from "lucide-react";
import { DigitalTwinSim, LifeGoal } from "../types";

interface DigitalTwinProps {
  twin: DigitalTwinSim;
  goals: LifeGoal[];
}

export default function DigitalTwin({ twin, goals }: DigitalTwinProps) {
  const [multiplier, setMultiplier] = useState<number>(1.2);
  const [years, setYears] = useState<number>(5);

  // Generate responsive future projection data based on sliders
  const currentTotalLiquid = 42920; // checking + savings
  const monthlySips = goals.reduce((acc, goal) => acc + goal.sipAmount, 0) || 1000;
  
  const generateChartData = () => {
    const data = [];
    let currentSavings = currentTotalLiquid;
    let currentInvestments = 12500;
    
    // Monthly composite interest rates
    const savingsApy = 0.045; // 4.5% standard
    const investmentsApy = 0.115 * multiplier; // 11.5% average boosted by multiplier
    
    const yearNames = ["Current", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8"];
    const maxYears = Math.min(years, 8);

    for (let i = 0; i <= maxYears; i++) {
      if (i > 0) {
        // Compound growth
        currentSavings = currentSavings * (1 + savingsApy) + (monthlySips * 12 * 0.4);
        currentInvestments = currentInvestments * (1 + investmentsApy) + (monthlySips * 12 * 0.6);
      }
      data.push({
        name: yearNames[i],
        Savings: Math.round(currentSavings),
        Investments: Math.round(currentInvestments),
        Combined: Math.round(currentSavings + currentInvestments)
      });
    }
    return data;
  };

  const chartData = generateChartData();
  const projectedTotal = chartData[chartData.length - 1]?.Combined || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* LEFT COLUMN: SIMULATOR SLIDERS & DIGITAL KPIs (5 COLS) */}
      <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-950/40 p-5 backdrop-blur-md shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-sans">Banking Digital Twin Simulator</span>
            </div>
            <span className="text-[10px] font-mono text-indigo-400">Continuous Forecast</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mb-5">
            Your Digital Twin runs stochastic projections of your net worth, loan capacities, and retirement safety indicators, synchronizing with active macro interest shifts.
          </p>

          {/* DYNAMIC KPIs */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-3">
              <span className="text-[9px] font-mono text-slate-500 uppercase">Projected 6m Savings</span>
              <p className="text-sm font-bold text-slate-100 font-mono mt-0.5">${twin.sixMonthSavings.toLocaleString()}</p>
            </div>
            <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-3">
              <span className="text-[9px] font-mono text-slate-500 uppercase">Emergency Probability</span>
              <p className="text-sm font-bold text-rose-400 font-mono mt-0.5">{twin.emergencyProbability}% Risk</p>
            </div>
            <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-3">
              <span className="text-[9px] font-mono text-slate-500 uppercase">Retirement Score</span>
              <p className="text-sm font-bold text-emerald-400 font-mono mt-0.5">{twin.retirementScore}/100</p>
            </div>
            <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-3">
              <span className="text-[9px] font-mono text-slate-500 uppercase">Sovereign Credit Cap</span>
              <p className="text-[10px] font-bold text-indigo-400 font-mono mt-1 leading-tight truncate">{twin.loanEligibility.split("SBI")[0] || twin.loanEligibility}</p>
            </div>
          </div>

          {/* SIMULATION SLIDERS */}
          <div className="bg-slate-900/20 border border-slate-900 rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-1.5 border-b border-slate-900 pb-2 mb-2 text-[10px] font-mono text-slate-500 uppercase">
              <Sliders className="h-4 w-4 text-indigo-400" />
              <span>Yield & Duration Overrides</span>
            </div>

            {/* Slider 1: Yield Modifier */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Portfolio Return Rate</span>
                <span className="font-semibold text-white font-mono">{Math.round(11.5 * multiplier)}% APY</span>
              </div>
              <input
                id="yield-rate-slider"
                type="range"
                min="0.5"
                max="2.5"
                step="0.1"
                value={multiplier}
                onChange={(e) => setMultiplier(Number(e.target.value))}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Slider 2: Forecast Years */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Forecast Horizon</span>
                <span className="font-semibold text-white font-mono">{years} Years</span>
              </div>
              <input
                id="forecast-years-slider"
                type="range"
                min="2"
                max="8"
                step="1"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3.5 border-t border-slate-900 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase">Projected Net Worth</span>
            <p className="text-base font-bold text-white font-mono mt-0.5">${projectedTotal.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Optimum Target</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: INTERACTIVE AREA CHART (7 COLS) */}
      <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-950/40 p-5 backdrop-blur-md shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Financial Growth Trajectory</h3>
              <p className="text-[10px] font-mono text-slate-500">Stochastic Dual-Channel Projections</p>
            </div>
            <span className="text-[10px] font-mono text-slate-400 uppercase">Growth</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCombined" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorInvestments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} fontClassName="font-mono" />
                <YAxis stroke="#64748b" fontSize={11} fontClassName="font-mono" />
                <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", borderRadius: "12px" }} />
                <Area type="monotone" name="Combined Net Asset" dataKey="Combined" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCombined)" />
                <Area type="monotone" name="Investments Segment" dataKey="Investments" stroke="#10b981" strokeWidth={1.5} fillOpacity={1} fill="url(#colorInvestments)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-4 border-t border-slate-900 pt-3 flex justify-between items-center text-[10px] font-mono text-slate-500">
          <span className="flex items-center gap-1"><Activity className="h-3.5 w-3.5 text-indigo-400" /> Simulations run with real compounding rates</span>
          <span className="text-indigo-400 font-semibold cursor-pointer flex items-center gap-0.5">Adjust plans <ArrowUpRight className="h-3 w-3" /></span>
        </div>
      </div>

    </div>
  );
}
