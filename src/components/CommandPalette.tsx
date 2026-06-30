import React, { useState, useEffect } from "react";
import { 
  Sparkles, Terminal, Shield, RefreshCw, X, HelpCircle, Bot, Landmark, Zap 
} from "lucide-react";

interface CommandPaletteProps {
  onRunAction: (action: string) => void;
  onSendMessage: (msg: string) => void;
}

export default function CommandPalette({ onRunAction, onSendMessage }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Toggle Command Palette on Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const COMMANDS = [
    { id: "fd", title: "FD Auto-Sweep", desc: "Execute 7.25% Sovereign Sweep of checking surplus", category: "Action", action: "create_fd" },
    { id: "cancel", title: "Cancel CineStream", desc: "Deactivate identified overlapping ghost subscription", category: "Action", action: "cancel_sub" },
    { id: "sim_salary", title: "Simulate: Corporate Salary Inflow", desc: "Test automated sweep logic and digital twin trajectory", category: "Simulation", action: "salary_deposit" },
    { id: "sim_cyber", title: "Simulate: Moscow Security attack", desc: "Trigger 12ms fraud blocker and token rotation", category: "Simulation", action: "cyber_threat" },
    { id: "sim_rate", title: "Simulate: Central Bank Rate Hike", desc: "Trigger 8.5% interest rate recalculation on central ledger", category: "Simulation", action: "rate_change" }
  ];

  const filtered = COMMANDS.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Floating Copilot launcher button */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        <button
          id="cmd-palette-trigger"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 rounded-full border border-indigo-500/30 bg-slate-950/80 px-4 py-3 text-xs font-bold text-slate-100 shadow-2xl backdrop-blur-md hover:border-indigo-500/80 transition-all duration-300 cursor-pointer"
        >
          <Bot className="h-4 w-4 text-indigo-400 group-hover:rotate-12 transition-transform" />
          <span>FinPilot Assistant</span>
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-slate-800 bg-slate-900 px-1.5 font-mono text-[9px] text-slate-400">
            <span>⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Modal dialog overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] bg-slate-950/80 backdrop-blur-sm transition-opacity">
          <div className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
            
            {/* Header bar */}
            <div className="flex items-center gap-3 border-b border-slate-900 p-4">
              <Terminal className="h-5 w-5 text-indigo-400 shrink-0" />
              <input
                id="cmd-palette-search"
                type="text"
                autoFocus
                placeholder="Search commands or speak to SBI advisory board..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent border-0 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-0"
              />
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-900 text-slate-400 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* List results */}
            <div className="overflow-y-auto p-2 space-y-1">
              {filtered.length === 0 ? (
                <div 
                  className="flex flex-col items-center justify-center text-center py-10 cursor-pointer"
                  onClick={() => {
                    onSendMessage(search);
                    setIsOpen(false);
                    setSearch("");
                  }}
                >
                  <Bot className="h-8 w-8 text-indigo-400 mb-2 animate-pulse" />
                  <p className="text-xs text-slate-300 font-semibold">Prompt SBI Advisory: &ldquo;{search}&rdquo;</p>
                  <p className="text-[10px] text-slate-500 max-w-xs mt-1">
                    Press Enter to delegate this statement directly to the joint board of directors.
                  </p>
                </div>
              ) : (
                filtered.map((cmd) => (
                  <div
                    key={cmd.id}
                    onClick={() => {
                      onRunAction(cmd.action);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-900/50 cursor-pointer border border-transparent hover:border-slate-900 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/5 border border-indigo-500/10 text-indigo-400">
                        {cmd.category === "Action" ? <Zap className="h-4 w-4" /> : <Landmark className="h-4 w-4" />}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">{cmd.title}</h4>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">{cmd.desc}</p>
                      </div>
                    </div>

                    <span className="text-[9px] font-mono font-bold uppercase text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-850">
                      {cmd.category}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Footer with keyboard layout tips */}
            <div className="border-t border-slate-900 p-3 bg-slate-950/80 flex justify-between items-center text-[10px] text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Use keyboard shortcuts</span>
              </span>
              <span>ESC to dismiss</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
