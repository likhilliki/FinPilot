import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, Send, Sparkles, Cpu, Layers, ShieldCheck, 
  HelpCircle, ChevronRight, Play, RefreshCw, Eye, CornerDownRight, Zap, CheckCircle2 
} from "lucide-react";
import { AgentRunLog, AgentResponse } from "../types";

interface AgentTerminalProps {
  onSendMessage: (msg: string) => Promise<AgentResponse>;
  isLoading: boolean;
  latestLogs: AgentRunLog[];
  botMessageHistory: { text: string; isBot: boolean }[];
  setBotMessageHistory: React.Dispatch<React.SetStateAction<{ text: string; isBot: boolean }[]>>;
}

const AGENT_STEPS = [
  { name: "Chief Orchestrator", desc: "Decomposing natural language intent & routing...", icon: "🧠", color: "text-amber-400 bg-amber-500/5 border-amber-500/20" },
  { name: "Financial Coach", desc: "Recalculating cash reserves & debt-to-income...", icon: "📊", color: "text-blue-400 bg-blue-500/5 border-blue-500/20" },
  { name: "Savings Agent", desc: "Formulating 7.25% sovereign auto-sweep tiers...", icon: "💰", color: "text-emerald-400 bg-emerald-500/5 border-emerald-500/20" },
  { name: "Investment Agent", desc: "Modeling compounding trajectories for milestones...", icon: "📈", color: "text-violet-400 bg-violet-500/5 border-violet-500/20" },
  { name: "Risk & Compliance", desc: "Validating transaction safety & Basel III ratios...", icon: "⚠", color: "text-rose-400 bg-rose-500/5 border-rose-500/20" },
  { name: "Core Banking API", desc: "Committing state transition to simulated sandbox ledger...", icon: "⚙️", color: "text-cyan-400 bg-cyan-500/5 border-cyan-500/20" }
];

export default function AgentTerminal({ 
  onSendMessage, 
  isLoading, 
  latestLogs, 
  botMessageHistory,
  setBotMessageHistory
}: AgentTerminalProps) {
  const [inputText, setInputText] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<AgentRunLog | null>(null);
  const [timelineStep, setTimelineStep] = useState<number>(-1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quick Action Chips to instantly trigger Sandbox operations
  const suggestionChips = [
    { label: "Received Salary Inflow 💰", text: "I received my salary." },
    { label: "Scan & cancel stream leaks 🚨", text: "Analyze accounts for fraud and check streaming subscriptions." },
    { label: "Check credit card bills 💳", text: "What is my credit utilization and card bill status?" },
    { label: "Suggest high-yield sweeps 📈", text: "Show me a personalized wealth investment plan." }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [botMessageHistory, isLoading]);

  useEffect(() => {
    if (latestLogs && latestLogs.length > 0) {
      setSelectedAgent(latestLogs[0]);
    }
  }, [latestLogs]);

  // Handle active loading timeline animation
  useEffect(() => {
    if (isLoading) {
      setTimelineStep(0);
      const timers: NodeJS.Timeout[] = [];
      
      AGENT_STEPS.forEach((_, idx) => {
        const t = setTimeout(() => {
          setTimelineStep(idx + 1);
        }, (idx + 1) * 800);
        timers.push(t);
      });

      return () => timers.forEach(clearTimeout);
    } else {
      setTimelineStep(-1);
    }
  }, [isLoading]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const textToSend = inputText;
    setInputText("");
    
    setBotMessageHistory(prev => [...prev, { text: textToSend, isBot: false }]);
    await onSendMessage(textToSend);
  };

  const handleChipClick = async (text: string) => {
    if (isLoading) return;
    setBotMessageHistory(prev => [...prev, { text, isBot: false }]);
    await onSendMessage(text);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 h-full">
      
      {/* LEFT COLUMN: THE PREMIUM CONVERSATIONAL CHAT (5 Cols) */}
      <div className="lg:col-span-5 flex flex-col h-[650px] rounded-2xl border border-slate-900 bg-slate-950/70 backdrop-blur-md overflow-hidden shadow-2xl">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-slate-900 bg-slate-900/40 px-4 py-3">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-sans">FinPilot Advisory Board</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">Active Node</span>
          </div>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {botMessageHistory.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center p-6">
              <div className="relative h-12 w-12 flex items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-4">
                <Bot className="h-6 w-6 text-indigo-400 animate-pulse" />
              </div>
              <h3 className="text-sm font-bold text-slate-200 font-sans">SBI FinPilot OS Panel</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed font-sans">
                Initiate sandboxed banking actions like automatic salary sweeps, debt payoff, virtual card cycling, or portfolio rebalancing.
              </p>
            </div>
          )}

          {botMessageHistory.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
            >
              <div className={`max-w-[85%] rounded-xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                msg.isBot 
                  ? "bg-slate-900/60 border border-slate-900 text-slate-300 shadow-sm"
                  : "bg-indigo-600 text-white shadow-md shadow-indigo-600/15 font-medium"
              }`}>
                {msg.isBot ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 border-b border-slate-900 pb-1 mb-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                      <span className="text-[9px] font-mono text-indigo-400 uppercase font-bold tracking-wider">FinPilot Core</span>
                    </div>
                    <div className="whitespace-pre-wrap font-sans text-slate-300 text-xs sm:text-sm">
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  <span>{msg.text}</span>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-xl px-4 py-3 bg-slate-900/40 border border-slate-900 text-slate-300">
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-3.5 w-3.5 text-indigo-400 animate-spin" />
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider animate-pulse">
                    Polling expert multi-agents...
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-4 py-3 border-t border-slate-900 bg-slate-950/40">
          <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-2 font-semibold">Sandbox Command Shortcuts</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestionChips.map((chip, i) => (
              <button
                key={i}
                id={`suggestion-chip-${i}`}
                disabled={isLoading}
                onClick={() => handleChipClick(chip.text)}
                className="rounded-lg bg-slate-900/80 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 px-2.5 py-1.5 text-left text-[11.5px] font-medium text-slate-300 transition-colors cursor-pointer active:scale-95 disabled:opacity-40"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSubmit} className="border-t border-slate-900 bg-slate-900/30 p-3 flex gap-2">
          <input
            id="chat-input-field"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Instruct joint board (e.g., 'sweep surplus to FD' or 'check fraud')"
            disabled={isLoading}
            className="flex-1 rounded-xl bg-slate-950 border border-slate-900 px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all duration-300 disabled:opacity-50"
          />
          <button
            id="chat-submit-btn"
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* RIGHT COLUMN: MULTI-AGENT COLLABORATION VISUALIZER (7 Cols) */}
      <div className="lg:col-span-7 flex flex-col h-[650px] rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-md overflow-hidden shadow-2xl">
        {/* Visualizer Header */}
        <div className="flex items-center justify-between border-b border-slate-900 bg-slate-900/30 px-4 py-3">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-rose-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-sans">Cognitive Operating Matrix</span>
          </div>
          <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wider text-[9px] font-bold">
            6 Concurrent Nodes
          </span>
        </div>

        {/* Visualizer Area */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden h-full">
          
          {/* Active Agents Flow Map (5 Cols) */}
          <div className="md:col-span-5 border-r border-slate-900 bg-slate-950/80 p-4 overflow-y-auto space-y-4">
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pb-1 border-b border-slate-900 font-semibold">
              Advisory Board Nodes
            </p>

            {latestLogs.length === 0 && !isLoading ? (
              <div className="flex h-full flex-col items-center justify-center text-center py-10 opacity-30">
                <Layers className="h-8 w-8 text-slate-400 mb-2" />
                <p className="text-xs font-mono">No Active Logs Available</p>
              </div>
            ) : (
              <div className="relative pl-4 border-l border-slate-800 space-y-5 pt-2">
                {(isLoading ? [] : latestLogs).map((log, idx) => {
                  const isSelected = selectedAgent?.agentName === log.agentName;
                  return (
                    <div 
                      key={idx}
                      onClick={() => setSelectedAgent(log)}
                      className={`relative group cursor-pointer p-2.5 rounded-xl transition-all duration-300 border ${
                        isSelected 
                          ? "bg-indigo-600/10 border-indigo-500/30 shadow-md" 
                          : "border-transparent hover:bg-slate-900/40"
                      }`}
                    >
                      {/* Connected Dot */}
                      <span className={`absolute -left-[21px] top-4 flex h-2 w-2 rounded-full transition-all duration-300 ${
                        isSelected 
                          ? "bg-indigo-400 scale-125 shadow-lg shadow-indigo-500" 
                          : "bg-slate-700 group-hover:bg-indigo-500"
                      }`} />

                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          {log.agentName}
                          {log.agentName.includes("Compliance") && <ShieldCheck className="h-3 w-3 text-emerald-400" />}
                          {log.agentName.includes("Orchestrator") && <Zap className="h-3 w-3 text-amber-400" />}
                        </span>
                        <span className="text-[8.5px] font-mono text-slate-500 mt-0.5">
                          REVERSED LEDGER COMMITTED
                        </span>
                      </div>
                    </div>
                  );
                })}
                {isLoading && (
                  <div className="text-xs font-mono text-slate-500 animate-pulse py-4">
                    Orchestrator invoking micro-advisors...
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Deep Agent Inspector OR Animating Timeline (7 Cols) */}
          <div className="md:col-span-7 bg-slate-950/20 p-4 overflow-y-auto flex flex-col justify-between h-full">
            
            {isLoading ? (
              /* LIVE SEQUENTIAL AI COLLABORATION TIMELINE OVERLAY */
              <div className="flex-1 flex flex-col justify-center py-6 space-y-4">
                <div className="border-b border-slate-900 pb-3 mb-2">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4.5 w-4.5 text-indigo-400 animate-spin" />
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-sans">
                      Autonomous Board Collaboration
                    </h3>
                  </div>
                  <p className="text-[10px] font-mono text-slate-500 mt-1">
                    Witnessing live sandbox decision-tree coordination
                  </p>
                </div>

                <div className="space-y-3">
                  {AGENT_STEPS.map((step, idx) => {
                    const isActive = timelineStep === idx;
                    const isCompleted = timelineStep > idx;
                    const isWaiting = timelineStep < idx;

                    return (
                      <div 
                        key={idx}
                        className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all duration-300 ${
                          isActive 
                            ? "border-indigo-500 bg-indigo-500/10 scale-[1.02] shadow-lg shadow-indigo-500/5" 
                            : isCompleted 
                              ? "border-emerald-500/20 bg-emerald-500/5 opacity-70" 
                              : "border-slate-900 bg-slate-950/40 opacity-40"
                        }`}
                      >
                        <div className="text-lg shrink-0 mt-0.5">{step.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-200">{step.name}</span>
                            {isCompleted && (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                            )}
                            {isActive && (
                              <RefreshCw className="h-3 w-3 text-indigo-400 animate-spin shrink-0" />
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 leading-normal mt-0.5 font-sans truncate">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {timelineStep >= 6 && (
                  <div className="text-[10px] font-mono text-emerald-400 text-center animate-bounce mt-4 bg-emerald-950/20 border border-emerald-500/20 py-2 rounded-xl">
                    ✓ All agents satisfied. Preparing terminal response.
                  </div>
                )}
              </div>
            ) : selectedAgent ? (
              /* DETAILED AGENT COGNITIVE INSPECTOR */
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5 font-sans">
                      {selectedAgent.agentName}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500 uppercase font-semibold">Autonomous Inspection</span>
                  </div>
                  <span className="rounded bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[9px] font-mono text-indigo-400 uppercase font-bold">
                    VERIFIED
                  </span>
                </div>

                {/* Agent Goal */}
                <div className="bg-slate-900/30 border border-slate-900 rounded-xl p-3">
                  <h4 className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1 font-bold">Agent Mission Objective</h4>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">{selectedAgent.goal}</p>
                </div>

                {/* Agent Memory & Planning */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-slate-900/30 border border-slate-900 rounded-xl p-3">
                    <h4 className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest mb-1.5 font-bold">Memory Nodes Pulled</h4>
                    <ul className="text-[10.5px] text-slate-400 space-y-1 font-sans">
                      {selectedAgent.memory.map((item, i) => (
                        <li key={i} className="flex gap-1.5 items-start">
                          <span className="text-indigo-500">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-slate-900/30 border border-slate-900 rounded-xl p-3">
                    <h4 className="text-[9px] font-mono text-rose-400 uppercase tracking-widest mb-1.5 font-bold">Logical Steps Plotted</h4>
                    <ul className="text-[10.5px] text-slate-400 space-y-1 font-sans">
                      {selectedAgent.planning.map((item, i) => (
                        <li key={i} className="flex gap-1.5 items-start">
                          <span className="text-rose-500">→</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Reasoning & Self Reflection */}
                <div className="space-y-3">
                  <div className="bg-slate-900/30 border border-slate-900 rounded-xl p-3">
                    <h4 className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1 font-bold">In-Context Reasoning Trace</h4>
                    <p className="text-xs text-slate-300 font-mono bg-slate-950/60 p-2.5 rounded-lg border border-slate-900 text-[10.5px] leading-relaxed">
                      {selectedAgent.reasoning}
                    </p>
                  </div>

                  {selectedAgent.toolUsed && (
                    <div className="bg-slate-900/30 border border-slate-900 rounded-xl p-3 flex justify-between items-center">
                      <span className="text-[9px] font-mono text-amber-500 uppercase tracking-wider font-bold">Sovereign API Executed</span>
                      <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded px-2 py-0.5 text-[9.5px] font-mono font-bold">
                        {selectedAgent.toolUsed}
                      </span>
                    </div>
                  )}

                  <div className="bg-slate-900/30 border border-slate-900 rounded-xl p-3">
                    <h4 className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest mb-1 font-bold">Compliance Attestation</h4>
                    <p className="text-xs text-emerald-400/90 font-sans italic leading-relaxed">{selectedAgent.selfReflection}</p>
                  </div>
                </div>

                {/* Output */}
                <div className="bg-slate-900/60 border border-slate-900 rounded-xl p-3">
                  <h4 className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest mb-1 font-bold">Agent Recommendation Output</h4>
                  <div className="flex gap-2 items-start mt-1">
                    <CornerDownRight className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-200 font-semibold font-sans">{selectedAgent.output}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center opacity-30 py-10">
                <HelpCircle className="h-10 w-10 text-slate-400 mb-2" />
                <p className="text-xs font-mono">Select a Department Agent to Inspect Live Brain State</p>
              </div>
            )}

            <div className="border-t border-slate-900 pt-3 mt-4 text-[9px] font-mono text-slate-600 text-center flex justify-between font-semibold">
              <span>SANDBOX HOST: 127.0.0.1</span>
              <span>BASEL III REBALANCING: READY</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
