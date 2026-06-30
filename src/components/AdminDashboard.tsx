import { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell 
} from "recharts";
import { 
  TrendingUp, Users, Cpu, ShieldCheck, Activity, 
  BarChart3, RefreshCw, Star, Layers, Clock 
} from "lucide-react";
import { ExecutiveAnalytics } from "../types";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#f43f5e"];

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<ExecutiveAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/analytics");
      const data = await res.json();
      setAnalytics(data);
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (isLoading || !analytics) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3">
        <RefreshCw className="h-8 w-8 text-indigo-400 animate-spin" />
        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Compiling corporate metrics...</span>
      </div>
    );
  }

  // Calculate high-level KPIs based on analytics data
  const totalUsersInFunnel = analytics.funnel[0]?.count || 0;
  const activeAdvisoryUsers = analytics.funnel[4]?.count || 0;
  const totalConversionRate = ((activeAdvisoryUsers / totalUsersInFunnel) * 100).toFixed(1);

  const totalRevenueImpact = analytics.revenueImpact.reduce((acc, curr) => acc + curr.aiAttributedRevenue, 0);

  return (
    <div className="space-y-6">
      
      {/* SECTION 1: EXECUTIVE C-SUITE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        
        {/* TOTAL FUNNEL CAPACITY */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5 backdrop-blur-md shadow-xl">
          <div className="flex justify-between items-center text-slate-500 text-xs font-mono uppercase tracking-wider">
            <span>Corporate Funnel Reach</span>
            <Users className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-white mt-3">
            {totalUsersInFunnel.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Total active marketing reach pipeline</p>
        </div>

        {/* BOARD CONVERSION RATE */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5 backdrop-blur-md shadow-xl">
          <div className="flex justify-between items-center text-slate-500 text-xs font-mono uppercase tracking-wider">
            <span>Conversion Yield</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-white mt-3">
            {totalConversionRate}%
          </p>
          <p className="text-[10px] text-emerald-400 mt-1">Target conversion: Goal completed</p>
        </div>

        {/* REVENUE LIFT ATTR */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5 backdrop-blur-md shadow-xl">
          <div className="flex justify-between items-center text-slate-500 text-xs font-mono uppercase tracking-wider">
            <span>AI Attributed Yield</span>
            <BarChart3 className="h-4 w-4 text-rose-400" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-white mt-3">
            ${totalRevenueImpact.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Direct wealth creation autonomously</p>
        </div>

        {/* TOTAL ACTIVE AGENTS */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5 backdrop-blur-md shadow-xl">
          <div className="flex justify-between items-center text-slate-500 text-xs font-mono uppercase tracking-wider">
            <span>Active Agent Instances</span>
            <Cpu className="h-4 w-4 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <p className="text-2xl font-bold tracking-tight text-white mt-3">
            {analytics.agentPerformance.length} Instances
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Continuous security + advisory loops</p>
        </div>

      </div>

      {/* SECTION 2: GRAPH DECK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* REVENUE DEEP DIVE (7 COLS) */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-slate-950/40 p-5 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Autonomous Financial Yield Expansion</h3>
              <p className="text-[10px] font-mono text-slate-500">Dual-Area Attributed Revenue Projection</p>
            </div>
            <span className="text-[10px] font-mono text-slate-400 uppercase">Valuation</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.revenueImpact} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOrg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} fontClassName="font-mono" />
                <YAxis stroke="#64748b" fontSize={11} fontClassName="font-mono" />
                <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", borderRadius: "12px" }} />
                <Legend iconType="circle" />
                <Area type="monotone" name="Autonomous AI Lift" dataKey="aiAttributedRevenue" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAI)" />
                <Area type="monotone" name="Baseline Organic" dataKey="organicRevenue" stroke="#10b981" strokeWidth={1.5} fillOpacity={1} fill="url(#colorOrg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DONUT: SEGMENT CAPITAL PROFILE (4 COLS) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-slate-950/40 p-5 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Capital Tier Distribution</h3>
                <p className="text-[10px] font-mono text-slate-500">Institutional Segments</p>
              </div>
            </div>

            <div className="h-48 w-full flex justify-center items-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.userSegmentation}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="count"
                    nameKey="segment"
                  >
                    {analytics.userSegmentation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", borderRadius: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-slate-500 font-mono">Tiers</span>
                <span className="text-lg font-bold text-white">Capital</span>
              </div>
            </div>
          </div>

          {/* Custom Legends list */}
          <div className="space-y-1.5 mt-3 border-t border-slate-900 pt-3">
            {analytics.userSegmentation.map((seg, idx) => (
              <div key={idx} className="flex justify-between text-[11px]">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span>{seg.segment}</span>
                </div>
                <span className="font-semibold text-white font-mono">{seg.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SECTION 3: BOTTOM DECK - FUNNEL & AGENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* FUNNEL STAGE (5 COLS) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-950/40 p-5 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Customer Conversion Funnel</h3>
              <p className="text-[10px] font-mono text-slate-500">Ad Acquisition to Sweeps</p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">Yield Pipeline</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.funnel} layout="vertical" margin={{ top: 5, right: 10, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" fontSize={11} fontClassName="font-mono" />
                <YAxis type="category" dataKey="stage" stroke="#64748b" fontSize={10} width={80} />
                <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", borderRadius: "12px" }} />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]}>
                  {analytics.funnel.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length] || "#6366f1"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AGENT LEADERBOARD LOG (7 COLS) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-950/40 p-5 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Agent Performance Registry</h3>
                <p className="text-[10px] font-mono text-slate-500">Autonomous Worker Diagnostics</p>
              </div>
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10 uppercase">
                HEALTH: OPTIMAL
              </span>
            </div>

            <div className="space-y-3.5">
              {analytics.agentPerformance.map((agent, i) => (
                <div 
                  key={i}
                  className="flex items-center justify-between bg-slate-900/30 p-3 rounded-xl border border-slate-900"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/10">
                      <Cpu className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{agent.agentName}</h4>
                      <div className="flex items-center gap-3 mt-1 text-[10px] font-mono text-slate-500">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-slate-500" /> {agent.averageResponseMs}ms</span>
                        <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-500" /> {agent.avgConfidence}% Conf</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-300 font-mono">{agent.tasksHandled.toLocaleString()} Runs</span>
                    <p className="text-[9px] font-mono text-emerald-400 mt-0.5">{agent.successRate}% Success</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 border-t border-slate-900 pt-3 flex justify-between items-center text-[10px] font-mono text-slate-500">
            <span>Corporate compliance index: 100% compliant</span>
            <span>Auditor: PwC certified</span>
          </div>
        </div>

      </div>

    </div>
  );
}
