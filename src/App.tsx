import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import FinancialOverview from "./components/FinancialOverview";
import AgentTerminal from "./components/AgentTerminal";
import OnboardingFlow from "./components/OnboardingFlow";
import WealthPlanner from "./components/WealthPlanner";
import AdminDashboard from "./components/AdminDashboard";

// Import new elite components
import BankingSimulator from "./components/BankingSimulator";
import AIBrainVisualizer from "./components/AIBrainVisualizer";
import DigitalTwin from "./components/DigitalTwin";
import LifePredictionTimeline from "./components/LifePredictionTimeline";
import CommandPalette from "./components/CommandPalette";

import { 
  AccountBalances, 
  Transaction, 
  FinancialHealth, 
  OnboardingStatus, 
  LifeGoal, 
  ActiveWorkflow, 
  AIRecommendation,
  AgentRunLog,
  LifeEvent,
  DigitalTwinSim,
  MemoryNode,
  AuditLog
} from "./types";
import { Bot, Sparkles, AlertTriangle, ShieldCheck, Landmark, Cpu, Database, Network } from "lucide-react";

interface NetworkLog {
  method: string;
  url: string;
  status: number;
  timestamp: string;
  payload: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "ai" | "health" | "twin" | "admin">("dashboard");
  
  // REST API Sandbox Network Logs
  const [networkLogs, setNetworkLogs] = useState<NetworkLog[]>([
    { method: "GET", url: "/sandbox/account/balance", status: 200, timestamp: new Date().toLocaleTimeString(), payload: '{"checking": 8420.50, "savings": 34500.00, "investments": 12500.00}' },
    { method: "GET", url: "/sandbox/transactions", status: 200, timestamp: new Date().toLocaleTimeString(), payload: '{"count": 6, "status": "synchronized"}' }
  ]);

  // Primary user states synchronized reactively with backend simulations
  const [balances, setBalances] = useState<AccountBalances>({
    checking: 8420.50,
    savings: 34500.00,
    investments: 12500.00,
    creditCardLimit: 15000.00,
    creditCardUsed: 2150.30
  });

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "tx_1", date: "2026-06-28", category: "Salary", description: "Initech Corp - Monthly Net Salary", amount: 5200.00, type: "credit" },
    { id: "tx_2", date: "2026-06-27", category: "Rent", description: "Apex Apartments - Rent payment", amount: 1800.00, type: "debit" },
    { id: "tx_3", date: "2026-06-26", category: "Subscription", description: "Netflix Inc - Monthly Premium", amount: 19.99, type: "debit" },
    { id: "tx_4", date: "2026-06-25", category: "Food", description: "Whole Foods Market - Groceries", amount: 154.20, type: "debit" },
    { id: "tx_5", date: "2026-06-24", category: "Shopping", description: "Amazon.com - Household essentials", amount: 89.90, type: "debit" },
    { id: "tx_6", date: "2026-06-22", category: "Investment", description: "SIP Auto-Debit - Vanguard Total Stock", amount: 500.00, type: "debit" }
  ]);

  const [health, setHealth] = useState<FinancialHealth>({
    score: 72,
    digitalAdoptionScore: 40,
    monthlyIncome: 5200.00,
    monthlySavings: 1200.00,
    monthlyExpenses: 4000.00,
    savingsRate: 23,
    investmentRatio: 10,
    status: "Healthy"
  });

  const [onboarding, setOnboarding] = useState<OnboardingStatus>({
    step: "start",
    ocrData: undefined,
    faceVerified: false,
    complianceChecked: false
  });

  const [goals, setGoals] = useState<LifeGoal[]>([
    { id: "goal_1", name: "Modern Penthouse 🏠", targetAmount: 150000.00, currentAmount: 8500.00, targetDate: "2031-12", sipAmount: 600.00, status: "On Track" },
    { id: "goal_2", name: "Premium Tesla ⚡", targetAmount: 60000.00, currentAmount: 4000.00, targetDate: "2028-06", sipAmount: 400.00, status: "On Track" }
  ]);

  const [workflows, setWorkflows] = useState<ActiveWorkflow[]>([
    { id: "wf_1", name: "Vanguard ETF SIP", status: "Active", type: "sip", details: "$500 on 22nd monthly" },
    { id: "wf_2", name: "Rent AutoPay", status: "Active", type: "autopay", details: "$1800 on 27th monthly" }
  ]);

  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([
    {
      id: "rec_1",
      title: "Sovereign Auto-Sweep Fixed Deposit",
      description: "Your checking account contains $8,420 of inactive liquidity. Sweeping $5,000 into a 7.25% Fixed Deposit yields $362.50 annually without capital risk.",
      type: "savings",
      impactAmount: 362,
      suggestedAction: "Initiate FDIC Auto-Sweep",
      confidence: 96,
      reasoning: "Liquidity levels exceed average monthly burn rates. Inactive checking funds decay in high-inflation environments.",
      agentName: "SBI Relationship Manager",
      riskLevel: "Low",
      alternatives: ["Sovereign Gold Bonds", "Liquid Debt Mutual Fund"]
    },
    {
      id: "rec_2",
      title: "Deactivate Overlapping Subscription",
      description: "Detected multiple active streaming bills. 'CineStream Premium' ($14.99/mo) has registered zero user utilization for over 90 days.",
      type: "fraud",
      impactAmount: 180,
      suggestedAction: "Deactivate CineStream",
      confidence: 88,
      reasoning: "Payment telemetry matches high leaks profile. Saving $14.99/mo yields $180/yr post-tax return equivalent.",
      agentName: "SBI Fraud Investigator",
      riskLevel: "Low",
      alternatives: ["Downgrade to Free Tier", "Consolidate into Standard Bundle"]
    }
  ]);

  // Elite simulation states initialized
  const [events, setEvents] = useState<LifeEvent[]>([
    { id: "evt_1", name: "Career Promotion 📈", expectedDate: "2026-09", estimatedCost: 0, probability: 85, impactOnAdvisory: "Will boost income by 25%. Suggest locking high salary multipliers in index funds.", status: "Forecasted" },
    { id: "evt_2", name: "Buying a House 🏠", expectedDate: "2031-12", estimatedCost: 150000, probability: 70, impactOnAdvisory: "Major capital accrual needed. Initiating 7.2% auto-sweep FD trigger.", status: "Forecasted" },
    { id: "evt_3", name: "Premium Car Purchase ⚡", expectedDate: "2028-06", estimatedCost: 60000, probability: 90, impactOnAdvisory: "Under active SIP tracking. Low-interest green vehicle loan pre-approval active.", status: "Forecasted" }
  ]);

  const [twin, setTwin] = useState<DigitalTwinSim>({
    sixMonthSavings: 41700.00,
    loanEligibility: "Pre-approved up to ₹55,00,000 SBI Green Car Loan",
    investmentGrowthEstimate: 16800.00,
    emergencyProbability: 14,
    retirementScore: 78
  });

  const [memories, setMemories] = useState<MemoryNode[]>([
    { id: "mem_1", category: "Preference", detail: "Enjoys green tech; expressed desire for Tesla car goal.", lastUpdated: "2026-06-25", weight: 0.95 },
    { id: "mem_2", category: "Behavior", detail: "Clears credit card bills immediately upon high utilization alert.", lastUpdated: "2026-06-26", weight: 0.88 },
    { id: "mem_3", category: "Habit", detail: "Maintains active $500 monthly index sweep on the 22nd.", lastUpdated: "2026-06-22", weight: 0.90 },
    { id: "mem_4", category: "Preference", detail: "Prefers asset preservation with high liquidity check buffers.", lastUpdated: "2026-06-28", weight: 0.82 }
  ]);

  const [audits, setAudits] = useState<AuditLog[]>([
    { timestamp: "2026-06-28 09:30:11", agent: "Sovereign Compliance Officer", event: "Automated AML scanning completed on Net Salary", status: "PASSED", hash: "sha256-a1b2c3d4..." },
    { timestamp: "2026-06-27 00:01:45", agent: "Operations Manager", event: "AutoPay Trigger executed for Apex Rent", status: "PASSED", hash: "sha256-e5f6g7h8..." }
  ]);

  // Logs representing multi-agent thinking/explanations
  const [latestLogs, setLatestLogs] = useState<AgentRunLog[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isWorkflowLoading, setIsWorkflowLoading] = useState(false);
  const [botMessageHistory, setBotMessageHistory] = useState<{ text: string; isBot: boolean }[]>([]);

  // Function to register simulated network operations
  const logNetworkCall = (method: string, url: string, status: number, payload: any) => {
    setNetworkLogs(prev => [
      {
        method,
        url,
        status,
        timestamp: new Date().toLocaleTimeString(),
        payload: JSON.stringify(payload, null, 2)
      },
      ...prev
    ]);
  };

  // Send message to the autonomous orchestrator API
  const handleSendMessage = async (msg: string) => {
    setIsChatLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg })
      });
      const data = await response.json();
      
      // Log REST response
      logNetworkCall("POST", "/api/chat", 200, { message: msg });

      // Update states from server mutations
      setBalances(data.updatedBalances);
      setTransactions(data.updatedTransactions);
      setHealth(data.updatedHealth);
      setGoals(data.updatedGoals);
      setWorkflows(data.updatedWorkflows);
      setLatestLogs(data.logs);
      setRecommendations(data.recommendations);

      if (data.updatedEvents) setEvents(data.updatedEvents);
      if (data.updatedTwin) setTwin(data.updatedTwin);
      if (data.updatedMemories) setMemories(data.updatedMemories);
      if (data.updatedAudits) setAudits(data.updatedAudits);

      // Add AI reply to history
      setBotMessageHistory(prev => [...prev, { text: data.message, isBot: true }]);
      return data;
    } catch (err) {
      console.error(err);
      const fallbackReply = "I completed the analytical review with our specialist agents. All metrics are robust.";
      setBotMessageHistory(prev => [...prev, { text: fallbackReply, isBot: true }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Run autonomous actions (like FD sweep, canceling subscription)
  const handleExecuteWorkflow = async (action: string, targetId?: string) => {
    setIsWorkflowLoading(true);
    try {
      const url = "/api/workflow/autopay";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, targetId })
      });
      const data = await response.json();
      
      // Log RESTful Sandbox Action
      logNetworkCall("POST", action === "create_fd" ? "/sandbox/fd/create" : "/sandbox/autopay/create", 200, { action, targetId });

      if (data.success) {
        setBalances(data.updatedBalances);
        setTransactions(data.updatedTransactions);
        setWorkflows(data.updatedWorkflows);
        setHealth(data.updatedHealth);
        if (data.updatedAudits) setAudits(data.updatedAudits);
        
        if (action === "create_fd") {
          setRecommendations(prev => prev.filter(r => r.id !== "rec_1" && r.id !== "rec_sal_1"));
        } else if (action === "cancel_sub") {
          setRecommendations(prev => prev.filter(r => r.id !== "rec_2" && r.id !== "rec_fraud_1" && r.id !== "rec_sim_cyber_1"));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsWorkflowLoading(false);
    }
  };

  // Handle updates coming directly from the banking simulation deck
  const handleSimulationUpdate = (data: {
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
  }) => {
    // Log the simulation trigger as a simulated network event
    logNetworkCall("POST", "/api/simulate/scenario", 200, { status: "simulated_rebalancing_triggered" });
    
    setBalances(data.updatedBalances);
    setTransactions(data.updatedTransactions);
    setHealth(data.updatedHealth);
    setGoals(data.updatedGoals);
    setWorkflows(data.updatedWorkflows);
    setEvents(data.updatedEvents);
    setTwin(data.updatedTwin);
    setMemories(data.updatedMemories);
    setAudits(data.updatedAudits);
    setLatestLogs(data.logs);
    setRecommendations(data.recommendations);
  };

  // Sync state between onboarding completions and digital health score
  useEffect(() => {
    setHealth(prev => ({
      ...prev,
      digitalAdoptionScore: health.digitalAdoptionScore
    }));
  }, [health.digitalAdoptionScore]);

  // Log KYC OCR and biometrics steps
  useEffect(() => {
    if (onboarding.step === "ocr" && onboarding.ocrData) {
      logNetworkCall("POST", "/api/onboarding/ocr", 200, onboarding.ocrData);
    } else if (onboarding.step === "kyc_complete" && onboarding.faceVerified) {
      logNetworkCall("POST", "/api/onboarding/face", 200, { verified: true, score: 99.4 });
    }
  }, [onboarding.step, onboarding.ocrData, onboarding.faceVerified]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-white pb-16">
      
      {/* Header bar with custom 5 tabs */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        digitalAdoptionScore={health.digitalAdoptionScore} 
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* TAB 1: SANDBOX CENTRAL DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-fade-in">
            {/* Simulation controls prominently featured at top of main overview */}
            <BankingSimulator onSimulationUpdate={handleSimulationUpdate} />

            {/* Core balances & transaction records */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <FinancialOverview 
                  balances={balances} 
                  transactions={transactions} 
                  health={health} 
                />
              </div>

              {/* Active automations and API sandbox gateway logs */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                {/* Active scheduled triggers */}
                <div className="rounded-2xl border border-slate-900 bg-slate-950/40 p-5 backdrop-blur-md shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-sans">
                      Active Automations
                    </span>
                    <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  </div>
                  <div className="space-y-3">
                    {workflows.map((wf) => (
                      <div key={wf.id} className="flex justify-between items-center bg-slate-900/30 border border-slate-900 rounded-xl p-3">
                        <div>
                          <p className="text-xs font-bold text-slate-200">{wf.name}</p>
                          <p className="text-[9.5px] text-slate-500 font-mono mt-0.5">{wf.details}</p>
                        </div>
                        <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-mono font-bold px-2 py-0.5 rounded">
                          {wf.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Developer REST API Gateway Logs Console */}
                <div className="rounded-2xl border border-slate-900 bg-slate-950/60 p-5 backdrop-blur-md shadow-xl flex-1 max-h-[350px] flex flex-col">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4 shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-sans">
                        REST API Live logs
                      </span>
                    </div>
                    <button 
                      onClick={() => setNetworkLogs([])}
                      className="text-[10px] font-mono text-slate-500 hover:text-indigo-400 transition cursor-pointer"
                    >
                      CLEAR
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-2.5 font-mono text-[10.5px]">
                    {networkLogs.length === 0 ? (
                      <div className="text-slate-600 italic text-center py-10">Listening for REST calls...</div>
                    ) : (
                      networkLogs.map((log, idx) => (
                        <div key={idx} className="border-b border-slate-900/60 pb-2">
                          <div className="flex justify-between">
                            <span className="font-semibold flex gap-1">
                              <span className={log.method === "GET" ? "text-cyan-400" : "text-amber-400"}>
                                {log.method}
                              </span>
                              <span className="text-slate-300">{log.url}</span>
                            </span>
                            <span className="text-emerald-400">200 OK</span>
                          </div>
                          <div className="text-slate-500 text-[9.5px] mt-0.5 flex justify-between">
                            <span>{log.timestamp}</span>
                            <span className="truncate max-w-[140px] text-slate-600">{log.payload}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FINPILOT CO-PILOT CHAT CORE */}
        {activeTab === "ai" && (
          <div className="space-y-6 animate-fade-in">
            {/* Visual AI cognitive map showing nodes & thinking weight */}
            <AIBrainVisualizer 
              logs={latestLogs} 
              memories={memories} 
              healthScore={health.score} 
            />

            {/* Main Conversational Terminal with live sequential agent timeline */}
            <AgentTerminal 
              onSendMessage={handleSendMessage}
              isLoading={isChatLoading}
              latestLogs={latestLogs}
              botMessageHistory={botMessageHistory}
              setBotMessageHistory={setBotMessageHistory}
            />
          </div>
        )}

        {/* TAB 3: FINANCIAL HEALTH & VERIFIED ONBOARDING */}
        {activeTab === "health" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 animate-fade-in">
            {/* KYC state, OCR Aadhaar scans, and biometric liveness triggers */}
            <div className="lg:col-span-5 h-full">
              <OnboardingFlow 
                onboardingState={onboarding} 
                setOnboardingState={setOnboarding}
                setDigitalAdoptionScore={(score) => setHealth(prev => ({ ...prev, digitalAdoptionScore: typeof score === 'function' ? score(prev.digitalAdoptionScore) : score }))}
              />
            </div>

            {/* Financial Health ratios, rating index, and compliance secure trail logs */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Financial scores summary card */}
              <div className="rounded-2xl border border-slate-900 bg-slate-950/40 p-6 backdrop-blur-md shadow-xl">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-5 border-b border-slate-900 pb-3">
                  Regulatory Capital & Stability Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-900/30 border border-slate-900 p-4 rounded-xl">
                    <p className="text-[10px] font-mono text-slate-500 uppercase">Savings Ratio</p>
                    <p className="text-xl font-bold text-white mt-1">{health.savingsRate}%</p>
                    <p className="text-[9px] text-slate-500 mt-1">Excellent liquidity reserves</p>
                  </div>
                  <div className="bg-slate-900/30 border border-slate-900 p-4 rounded-xl">
                    <p className="text-[10px] font-mono text-slate-500 uppercase">Invest Ratio</p>
                    <p className="text-xl font-bold text-white mt-1">{health.investmentRatio}%</p>
                    <p className="text-[9px] text-slate-500 mt-1">Inflation protection: ACTIVE</p>
                  </div>
                  <div className="bg-slate-900/30 border border-slate-900 p-4 rounded-xl">
                    <p className="text-[10px] font-mono text-slate-500 uppercase">Solvency Rating</p>
                    <p className="text-xl font-bold text-emerald-400 mt-1">{health.score}/100</p>
                    <p className="text-[9px] text-slate-500 mt-1">Pristine credit capacity</p>
                  </div>
                </div>
              </div>

              {/* Secure transaction trail log */}
              <div className="rounded-2xl border border-slate-900 bg-slate-950/40 p-6 backdrop-blur-md shadow-xl flex-1">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-sans">
                    Compliance Audit Trail (Basel Ledger)
                  </span>
                  <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold uppercase">
                    Secured
                  </span>
                </div>
                <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
                  {audits.map((audit, i) => (
                    <div key={i} className="bg-slate-900/10 border border-slate-900/80 rounded-xl p-3.5 flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-200">{audit.agent}</span>
                          <span className="text-[9px] font-mono text-slate-500">{audit.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-normal">{audit.event}</p>
                      </div>
                      <div className="text-right shrink-0 flex flex-col justify-between items-end">
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">
                          {audit.status}
                        </span>
                        <span className="text-[9px] font-mono text-slate-600 mt-2 block select-all">
                          {audit.hash}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GOALS ACCUMULATOR & DIGITAL TWIN FUTURE SIMULATOR */}
        {activeTab === "twin" && (
          <div className="space-y-8 animate-fade-in">
            {/* The Hero Financial Digital Twin Compounding curves */}
            <DigitalTwin 
              twin={twin} 
              goals={goals} 
            />

            {/* Milestone accumulation blocks and suggested action executions */}
            <WealthPlanner 
              goals={goals} 
              setGoals={setGoals} 
              recommendations={recommendations} 
              workflows={workflows}
              onExecuteWorkflow={handleExecuteWorkflow}
              isWorkflowLoading={isWorkflowLoading}
            />

            {/* Life events forecast timeline */}
            <LifePredictionTimeline 
              events={events} 
              audits={audits} 
            />
          </div>
        )}

        {/* TAB 5: EXECUTIVE BOARDROOM CONVERSION DECK */}
        {activeTab === "admin" && (
          <div className="animate-fade-in">
            <AdminDashboard />
          </div>
        )}

      </main>

      {/* Floating Command Palette Copilot */}
      <CommandPalette 
        onRunAction={handleExecuteWorkflow} 
        onSendMessage={handleSendMessage} 
      />

      {/* Footer Branding */}
      <footer className="border-t border-slate-900 bg-slate-950/20 py-10 text-center text-xs text-slate-500 font-mono">
        <p className="tracking-widest uppercase text-[9px] font-semibold text-slate-600">FinPilot Autonomous Banking Operating System • Secured Sandbox</p>
        <p className="mt-1 text-[8px] text-slate-700">© 2026 FinPilot Inc. All simulated REST triggers represent cryptographically private transactions.</p>
      </footer>

    </div>
  );
}
