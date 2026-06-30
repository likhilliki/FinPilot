import React from "react";
import { 
  Compass, ShieldCheck, Clock, ShieldAlert, CheckCircle2, AlertTriangle, 
  Sparkles, Layers 
} from "lucide-react";
import { LifeEvent, AuditLog } from "../types";

interface LifePredictionTimelineProps {
  events: LifeEvent[];
  audits: AuditLog[];
}

export default function LifePredictionTimeline({ events, audits }: LifePredictionTimelineProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* LEFT COLUMN: BEHAVIOR PREDICTION ENGINE (7 COLS) */}
      <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-950/40 p-5 backdrop-blur-md shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-4">
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-sans">Behavior Prediction Engine</span>
            </div>
            <span className="text-[10px] font-mono text-indigo-400">Life Milestones</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mb-5">
            Continuous background diagnostics estimate the probability and timing of major future life transitions, automatically adapting dynamic advisory weights.
          </p>

          {/* TIMELINE LIST */}
          <div className="relative border-l border-slate-900 pl-4 ml-2.5 space-y-5">
            {events.map((evt) => {
              const isHighProb = evt.probability >= 80;
              return (
                <div key={evt.id} className="relative group">
                  {/* Timeline bullet dot */}
                  <div className={`absolute -left-[21px] top-1 h-3.5 w-3.5 rounded-full border-2 bg-slate-950 transition-colors duration-300 ${
                    evt.status === "Imminent" 
                      ? "border-rose-500 bg-rose-500/20" 
                      : isHighProb ? "border-emerald-500 bg-emerald-500/20" : "border-indigo-500"
                  }`} />

                  <div className="p-3 bg-slate-900/25 border border-slate-900 hover:border-slate-800 rounded-xl transition-all duration-300">
                    <div className="flex justify-between items-start mb-1.5">
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">{evt.name}</h4>
                        <p className="text-[10px] font-mono text-slate-500 mt-0.5">Forecast Target: {evt.expectedDate}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                          evt.status === "Imminent" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}>
                          {evt.status}
                        </span>
                        <p className="text-[9px] font-mono text-slate-500 mt-0.5">Prob: {evt.probability}%</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-normal mb-2">{evt.impactOnAdvisory}</p>

                    {evt.estimatedCost > 0 && (
                      <div className="flex justify-between items-center bg-slate-950/60 rounded px-2.5 py-1 text-[10px] font-mono text-slate-500 border border-slate-900">
                        <span>ESTIMATED LIQUID GAP:</span>
                        <span className="font-bold text-slate-300">${evt.estimatedCost.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 border-t border-slate-900 pt-3 flex justify-between items-center text-[10px] font-mono text-slate-500">
          <span>* Predictions generated matching sovereign bank guidelines</span>
          <span className="text-indigo-400">Recalculating hourly</span>
        </div>
      </div>

      {/* RIGHT COLUMN: SOVEREIGN AUDIT LEDGER (5 COLS) */}
      <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-950/40 p-5 backdrop-blur-md shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-sans">Sovereign Compliance Ledger</span>
            </div>
            <span className="text-[10px] font-mono text-rose-400">Basel III Compliant</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Every autonomous agent action, sweep limit update, and KYC check commits a hashed verification record directly to your private security audit trail.
          </p>

          <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
            {audits.map((aud, i) => (
              <div 
                key={i} 
                className="p-3 bg-slate-900/30 border border-slate-900 rounded-xl space-y-2"
              >
                <div className="flex justify-between items-center border-b border-slate-950 pb-1.5">
                  <span className="text-[10px] font-bold text-slate-300">{aud.agent}</span>
                  <span className={`text-[9px] font-semibold font-mono uppercase px-1.5 py-0.5 rounded ${
                    aud.status === "PASSED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                    aud.status === "RESOLVED" ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" :
                    "bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse"
                  }`}>
                    {aud.status}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-normal">{aud.event}</p>

                <div className="flex justify-between text-[8px] font-mono text-slate-600">
                  <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> {aud.timestamp}</span>
                  <span className="truncate max-w-[120px]">{aud.hash}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-900 text-center">
          <span className="text-[9px] font-mono text-slate-500 tracking-wider">
            SECURED LEDGER DEPLOYED • RBI LICENSED OPERATING SYSTEM
          </span>
        </div>
      </div>

    </div>
  );
}
