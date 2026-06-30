import { 
  TrendingUp, TrendingDown, Wallet, ShieldAlert, 
  ArrowUpRight, ArrowDownLeft, Landmark, Award, BadgeAlert 
} from "lucide-react";
import { AccountBalances, Transaction, FinancialHealth } from "../types";

interface FinancialOverviewProps {
  balances: AccountBalances;
  transactions: Transaction[];
  health: FinancialHealth;
}

export default function FinancialOverview({ balances, transactions, health }: FinancialOverviewProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Salary": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Rent": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "Investment": return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "Subscription": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default: return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Needs Attention": return "text-amber-400";
      case "Excellent":
      case "Elite":
        return "text-indigo-400";
      default: return "text-emerald-400";
    }
  };

  return (
    <div className="space-y-6">
      
      {/* SECTION 1: ACCOUNT CARDS (GRID OF 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* CHECKING ACCOUNT */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/40 p-5 backdrop-blur-md shadow-xl hover:border-slate-700 transition-all duration-300">
          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-indigo-500/5 blur-xl"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Checking Liquidity</span>
            <Wallet className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-white">
            ${balances.checking.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="mt-2.5 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-0.5 rounded bg-emerald-500/10 px-1 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="h-2.5 w-2.5" />
              Active Buffer
            </span>
            <span className="text-[10px] font-mono text-slate-500">Auto-sweep ready</span>
          </div>
        </div>

        {/* SAVINGS ACCOUNT */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/40 p-5 backdrop-blur-md shadow-xl hover:border-slate-700 transition-all duration-300">
          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-emerald-500/5 blur-xl"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">High-Yield Savings</span>
            <Landmark className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-white">
            ${balances.savings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="mt-2.5 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-0.5 rounded bg-emerald-500/10 px-1 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
              7.15% APY
            </span>
            <span className="text-[10px] font-mono text-slate-500">Interest Maturing Monthly</span>
          </div>
        </div>

        {/* INVESTMENTS */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/40 p-5 backdrop-blur-md shadow-xl hover:border-slate-700 transition-all duration-300">
          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-rose-500/5 blur-xl"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Wealth Investments</span>
            <TrendingUp className="h-4 w-4 text-rose-400" />
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-white">
            ${balances.investments.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="mt-2.5 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-0.5 rounded bg-indigo-500/10 px-1 py-0.5 text-[10px] font-medium text-indigo-400 border border-indigo-500/20">
              SIP Multiplier
            </span>
            <span className="text-[10px] font-mono text-slate-500">2 active schedules</span>
          </div>
        </div>

      </div>

      {/* SECTION 2: HEALTH SCORE & CREDIT STATUS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* FINANCIAL HEALTH CARD (5 COLS) */}
        <div className="md:col-span-5 rounded-2xl border border-slate-800 bg-slate-950/40 p-5 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-sans">Financial Health Quotient</span>
            <Award className="h-4 w-4 text-indigo-400" />
          </div>

          <div className="flex items-center gap-6">
            <div className="relative h-20 w-20 shrink-0">
              <svg className="h-full w-full" viewBox="0 0 36 36">
                <path
                  className="text-slate-850"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-indigo-500 transition-all duration-500"
                  strokeDasharray={`${health.score}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-sans">
                <span className="text-lg font-bold text-white">{health.score}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-slate-200">
                Overall Standing: <span className={getStatusColor(health.status)}>{health.status}</span>
              </p>
              <p className="text-[11px] text-slate-400 leading-normal">
                Your savings rate stands at <span className="font-semibold text-white">{health.savingsRate}%</span>. Swapping checking surpluses will boost this rating significantly.
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-900 pt-3 font-mono text-[11px] text-slate-400">
            <div>
              <p className="text-slate-500">MON CASH FLOW</p>
              <p className="font-semibold text-white">+${health.monthlyIncome.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-slate-500">SAVINGS VELOCITY</p>
              <p className="font-semibold text-white">+${health.monthlySavings.toLocaleString()}/mo</p>
            </div>
          </div>
        </div>

        {/* CREDIT UTILIZATION & LIMIT (7 COLS) */}
        <div className="md:col-span-7 rounded-2xl border border-slate-800 bg-slate-950/40 p-5 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-sans">Premium Card Status & Risk</span>
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/5 border border-indigo-500/10 px-2 py-0.5 rounded">
                Mastercard World Elite
              </span>
            </div>

            <div className="space-y-3.5">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-slate-400">Outstanding Balance</p>
                  <p className="text-xl font-bold text-white">${balances.creditCardUsed.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Total Credit Limit</p>
                  <p className="text-xs font-semibold text-slate-300">${balances.creditCardLimit.toLocaleString()}</p>
                </div>
              </div>

              {/* Progress Utilization Line */}
              <div className="space-y-1">
                <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden border border-slate-850">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-rose-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((balances.creditCardUsed / balances.creditCardLimit) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>Utilization: {Math.round((balances.creditCardUsed / balances.creditCardLimit) * 100)}%</span>
                  <span>Safety Threshold: 30%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-[11px] text-emerald-400/90 leading-tight">
            <TrendingUp className="h-4 w-4 shrink-0" />
            <span>Debt coverage index is highly robust. Fully clear card balances monthly to secure peak credit score of 790+.</span>
          </div>
        </div>

      </div>

      {/* SECTION 3: TRANSACTION STREAM */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5 backdrop-blur-md shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-sans">Active Financial Stream</span>
          <span className="text-[10px] font-mono text-slate-500">Updated Real-Time</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-900 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                <th className="pb-2.5 font-normal">Transaction Date</th>
                <th className="pb-2.5 font-normal">Category</th>
                <th className="pb-2.5 font-normal">Description</th>
                <th className="pb-2.5 font-normal text-right">Value Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-900/30 transition-colors">
                  <td className="py-3 text-xs font-mono text-slate-400">{tx.date}</td>
                  <td className="py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${getCategoryColor(tx.category)}`}>
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-3 text-xs font-medium text-slate-200">{tx.description}</td>
                  <td className={`py-3 text-right font-mono text-xs font-bold ${
                    tx.type === "credit" ? "text-emerald-400" : "text-rose-400"
                  }`}>
                    {tx.type === "credit" ? "+" : "-"}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
