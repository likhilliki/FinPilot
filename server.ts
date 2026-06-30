import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { 
  AgentRunLog, 
  Transaction, 
  AccountBalances, 
  FinancialHealth, 
  OnboardingStatus, 
  LifeGoal, 
  AIRecommendation, 
  ActiveWorkflow,
  LifeEvent,
  DigitalTwinSim,
  MemoryNode,
  AuditLog,
  AgentResponse,
  ExecutiveAnalytics
} from "./src/types";

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Google GenAI client initialized successfully with API key.");
  } catch (err) {
    console.error("Failed to initialize Google GenAI client:", err);
  }
} else {
  console.log("No GEMINI_API_KEY found or using placeholder. Running in rich heuristic simulation mode.");
}

const app = express();
app.use(express.json());

const PORT = 3000;

// === IN-MEMORY STATE FOR FINPILOT ===
let state = {
  balances: {
    checking: 8420.50,
    savings: 34500.00,
    investments: 12500.00,
    creditCardLimit: 15000.00,
    creditCardUsed: 2150.30
  } as AccountBalances,
  
  transactions: [
    { id: "tx_1", date: "2026-06-28", category: "Salary", description: "Initech Corp - Monthly Net Salary", amount: 5200.00, type: "credit" },
    { id: "tx_2", date: "2026-06-27", category: "Rent", description: "Apex Apartments - Rent payment", amount: 1800.00, type: "debit" },
    { id: "tx_3", date: "2026-06-26", category: "Subscription", description: "Netflix Inc - Monthly Premium", amount: 19.99, type: "debit" },
    { id: "tx_4", date: "2026-06-25", category: "Food", description: "Whole Foods Market - Groceries", amount: 154.20, type: "debit" },
    { id: "tx_5", date: "2026-06-24", category: "Shopping", description: "Amazon.com - Household essentials", amount: 89.90, type: "debit" },
    { id: "tx_6", date: "2026-06-22", category: "Investment", description: "SIP Auto-Debit - Vanguard Total Stock", amount: 500.00, type: "debit" }
  ] as Transaction[],
  
  health: {
    score: 72,
    digitalAdoptionScore: 40,
    monthlyIncome: 5200.00,
    monthlySavings: 1200.00,
    monthlyExpenses: 4000.00,
    savingsRate: 23,
    investmentRatio: 10,
    status: "Healthy"
  } as FinancialHealth,
  
  onboarding: {
    step: "start",
    ocrData: undefined,
    faceVerified: false,
    complianceChecked: false
  } as OnboardingStatus,
  
  goals: [
    { id: "goal_1", name: "Modern Penthouse 🏠", targetAmount: 150000.00, currentAmount: 8500.00, targetDate: "2031-12", sipAmount: 600.00, status: "On Track" },
    { id: "goal_2", name: "Premium Tesla ⚡", targetAmount: 60000.00, currentAmount: 4000.00, targetDate: "2028-06", sipAmount: 400.00, status: "On Track" }
  ] as LifeGoal[],
  
  workflows: [
    { id: "wf_1", name: "Vanguard ETF SIP", status: "Active", type: "sip", details: "$500 on 22nd monthly" },
    { id: "wf_2", name: "Rent AutoPay", status: "Active", type: "autopay", details: "$1800 on 27th monthly" }
  ] as ActiveWorkflow[],

  events: [
    { id: "evt_1", name: "Career Promotion 📈", expectedDate: "2026-09", estimatedCost: 0, probability: 85, impactOnAdvisory: "Will boost income by 25%. Suggest locking high salary multipliers in index funds.", status: "Forecasted" },
    { id: "evt_2", name: "Buying a House 🏠", expectedDate: "2031-12", estimatedCost: 150000, probability: 70, impactOnAdvisory: "Major capital accrual needed. Initiating 7.2% auto-sweep FD trigger.", status: "Forecasted" },
    { id: "evt_3", name: "Premium Car Purchase ⚡", expectedDate: "2028-06", estimatedCost: 60000, probability: 90, impactOnAdvisory: "Under active SIP tracking. Low-interest green vehicle loan pre-approval active.", status: "Forecasted" }
  ] as LifeEvent[],

  twin: {
    sixMonthSavings: 41700.00,
    loanEligibility: "Pre-approved up to ₹55,00,000 SBI Green Car Loan",
    investmentGrowthEstimate: 16800.00,
    emergencyProbability: 14,
    retirementScore: 78
  } as DigitalTwinSim,

  memories: [
    { id: "mem_1", category: "Preference", detail: "Enjoys green tech; expressed strong desire for Tesla car goal.", lastUpdated: "2026-06-25", weight: 0.95 },
    { id: "mem_2", category: "Behavior", detail: "Clears credit card bills immediately upon high utilization alert.", lastUpdated: "2026-06-26", weight: 0.88 },
    { id: "mem_3", category: "Habit", detail: "Maintains active $500 monthly index sweep on the 22nd.", lastUpdated: "2026-06-22", weight: 0.90 },
    { id: "mem_4", category: "Preference", detail: "Prefers asset preservation with high liquidity check buffers.", lastUpdated: "2026-06-28", weight: 0.82 }
  ] as MemoryNode[],

  audits: [
    { timestamp: "2026-06-28 09:30:11", agent: "Sovereign Compliance Officer", event: "Automated AML scanning completed on Net Salary", status: "PASSED", hash: "sha256-a1b2c3d4..." },
    { timestamp: "2026-06-27 00:01:45", agent: "Operations Manager", event: "AutoPay Trigger executed for Apex Rent", status: "PASSED", hash: "sha256-e5f6g7h8..." }
  ] as AuditLog[],
  
  agentLogs: [] as AgentRunLog[]
};

// Seed Recommendations with enhanced tags
let recommendations: AIRecommendation[] = [
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
];

// === HELPERS FOR MULTI-AGENT COLLABORATION GENERATION ===
function createLog(
  agentName: string,
  goal: string,
  memory: string[],
  planning: string[],
  reasoning: string,
  toolUsed: string | undefined,
  selfReflection: string,
  output: string
): AgentRunLog {
  return {
    agentName,
    goal,
    memory,
    planning,
    reasoning,
    toolUsed,
    selfReflection,
    output,
    timestamp: new Date().toLocaleTimeString()
  };
}

// Generate the fully simulated SBI joint board of agents
function generateSpecialistSbiSession(message: string, isSalary = false, isFraud = false, isLifeEvent = false, isRateHike = false): AgentRunLog[] {
  const sessionLogs: AgentRunLog[] = [];

  // 1. Branch Manager (Head of Collaboration)
  sessionLogs.push(createLog(
    "SBI Branch Manager",
    "Orchestrate inter-departmental advisory panel to coordinate custom response.",
    [
      `Checking: $${state.balances.checking}`, 
      `Customer Level: Elite Wealth Prospect`,
      `Active Life Milestones: Penthouse, Tesla`
    ],
    [
      "Step 1: Convene advisory board of Loan Officer, RM, and Investment Advisor.",
      "Step 2: Cross-verify sovereign regulatory limitations with Compliance Officer.",
      "Step 3: Render optimized asset placement map."
    ],
    `Addressing client request: "${message}". In corporate banking operations, we strive to maximize high-yield allocations while respecting the customer's cash-flow safety thresholds.`,
    "Collaborative Agent Router",
    "We must prevent excessive locking of funds if the credit card bill cycle has imminent payments scheduled.",
    "Convened specialist session. Delegated credit risk to Loan Officer, asset placement to Investment Advisor, and KYC to Compliance Officer."
  ));

  // 2. SBI Relationship Manager
  sessionLogs.push(createLog(
    "SBI Relationship Manager",
    "Analyze personalized customer financial profiles to maintain highly loyal capital retention.",
    ["Customer prefers low risk with high liquidity buffers", "Salary cycle: 28th of month"],
    ["Identify high-interest savings leaks.", "Formulate custom sovereign sweeps.", "Maintain high customer trust meter."],
    `Analyzing current assets. The checking account has an inactive surplus. We recommend our signature Auto-Sweep FD product to retain maximum returns without sacrificing immediate liquidity.`,
    "SBI Core Banking Ledger API",
    "The client has a goal of buying a house. Proactively notifying the Loan Officer to pre-approve mortgage capacities makes strategic sense.",
    "Formulated a 7.25% auto-sweep FD suggestion of $5,000."
  ));

  if (isLifeEvent) {
    // 3. SBI Loan Officer
    sessionLogs.push(createLog(
      "SBI Loan Officer",
      "Assess capital requirements and mortgage limits for imminent life milestones.",
      ["Proposed Buying House in 2031", "Expected Car Goal in 2028"],
      ["Analyze debt-to-income limits.", "Determine pre-approved mortgage ranges.", "Enforce regulatory debt-service capacity rules."],
      `With a current monthly net salary of $5,200.00, our client has a pristine debt service capacity. We have calculated a pre-approved Green Vehicle loan capacity of ₹55 Lakhs and a mortgage range up to ₹2.5 Crores.`,
      "Mortgage Eligibility Assessor",
      "Ensure mortgage calculations do not exceed 40% debt-service ratio limit of Basel III standards.",
      "Updated pre-approved credit caps. Digital Twin simulation modified to display instant green loan approval."
    ));

    // 4. SBI Financial Planner
    sessionLogs.push(createLog(
      "SBI Financial Planner",
      "Develop comprehensive multi-year savings trajectories for life milestone completion.",
      ["Checking: $8,420.50", "Pension score: 78%"],
      ["Stagger SIP contributions across goals.", "Calculate dynamic time-to-achievement rates.", "Adjust retirement forecasts."],
      "If the customer initiates a $200 boost to their property fund, they will complete the housing downpayment 14 months ahead of schedule.",
      "Actuarial Future Projections Model",
      "Aggressive goal contributions must be balanced against an emergency corpus of at least 3 months.",
      "Simulated savings trajectory updated. Recommended downpayment acceleration plans."
    ));
  }

  if (isRateHike) {
    // 5. SBI Investment Advisor
    sessionLogs.push(createLog(
      "SBI Investment Advisor",
      "Rebalance portfolio distributions in response to macro-economic changes.",
      ["Central Bank hiked interest rates", "Current index portfolio: $12,500"],
      ["Evaluate impact of interest rate hike on broad equity indices.", "Draft sovereign gold bond and fixed debt recommendation tweaks."],
      "The RBI interest rate hike has pushed Fixed Deposit yields to 8.5%. This makes locking liquid cash in debt instruments highly favorable compared to short-term equities.",
      "Macro Interest Arbitrage Tracker",
      "Slightly rebalance short-term cash out of volatile equities into high-yield sovereign deposits.",
      "Created an 8.5% Fixed Deposit sweep offer."
    ));
  }

  if (isFraud) {
    // 6. SBI Fraud Investigator
    sessionLogs.push(createLog(
      "SBI Fraud Investigator",
      "Shield customer checking accounts against credential theft, cyber hacks, and ghost subscriptions.",
      ["Alert of suspicious international card swipe", "Inactive CineStream subscription"],
      ["Pinpoint location discrepancy of transaction.", "Trigger immediate card freeze.", "Notify compliance of merchant spoofing."],
      "A suspicious attempt of $4,120 was detected from an unrecognized IP address in Moscow, RU. Automated shield protocols blocked the charge within 12 milliseconds.",
      "Cyber Threat Intelligence Engine",
      "Though the transaction was blocked, the physical card details might be compromised. Immediate virtual card token reissue is necessary.",
      "BLOCKED cyber threat. Reissued security patch. Logged security audit trail."
    ));

    // 7. SBI Compliance Officer
    sessionLogs.push(createLog(
      "SBI Compliance Officer",
      "Verify transaction integrity and KYC standards against financial regulation frameworks.",
      ["Audit record of Moscow threat", "AML compliance checks"],
      ["Enforce biometric compliance guidelines.", "Log cryptographic hashes of suspicious attempts.", "File SAR (Suspicious Activity Report) securely."],
      "Audit logs have been cryptographically verified. Recommending two-factor biometrics check on next app launch to fully secure access.",
      "Sovereign AML Registry API",
      "Compliance parameters strictly met. Security level is fully certified.",
      "Cryptographic block hash generated and committed to the FinPilot ledger."
    ));
  }

  // Fallback default agents to show collaboration
  if (sessionLogs.length < 4) {
    sessionLogs.push(createLog(
      "SBI Customer Success Manager",
      "Optimize customer digital onboarding adoption rate and general user experience satisfaction.",
      [`Digital Adoption: ${state.health.digitalAdoptionScore}%`],
      ["Track completed kyc pillars.", "Trigger personalized notifications.", "Provide premium assistance alerts."],
      "User has completed 40% of standard onboarding. Recommending immediate face verification and biometric matching to unlock full high-limit transfer privileges.",
      "Customer Satisfaction Tracker",
      "Adoption rates of automated sweeps are highly correlated with 5-star app satisfaction feedback.",
      "Generated personalized nudge cards for Biometric Verification."
    ));

    sessionLogs.push(createLog(
      "SBI Operations Manager",
      "Manage real-time execution of automated ledger sweeps, bill schedules, and smart-contract actions.",
      ["Pending rent and investment SIPs"],
      ["Process queue of automated bank clearings.", "Settle Vanguard Index fund receipts."],
      "Processed Vanguard SIP auto-debit of $500. Rent autopay of $1,800 is locked for execution.",
      "ACH Settlement Clearing Engine",
      "All automated balances reconciled with zero liquidity errors.",
      "All routine clearing ledger runs finalized successfully."
    ));
  }

  return sessionLogs;
}

// === MAIN CHAT API ROUTE ===
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const query = message.toLowerCase();
  const logs: AgentRunLog[] = [];
  let botReply = "";
  let thoughtProcess = "";

  // Dynamic memory logging based on user input
  const newMemoryId = `mem_${Date.now()}`;
  state.memories.unshift({
    id: newMemoryId,
    category: "Conversation",
    detail: `User initiated query: "${message.substring(0, 50)}..."`,
    lastUpdated: new Date().toISOString().split('T')[0],
    weight: 0.85
  });

  // Risk Classification & Planning
  thoughtProcess = `Triggered SBI multi-agent orchestrator. Parsing query for intent: "${message}". Cross-matching database memories.`;

  let isSalaryEvent = query.includes("salary") || query.includes("received pay") || query.includes("got paid");
  let isInvestEvent = query.includes("invest") || query.includes("investment") || query.includes("sip") || query.includes("mutual fund") || query.includes("fd") || query.includes("fixed deposit");
  let isCardEvent = query.includes("credit card") || query.includes("card bill") || query.includes("pay bill");
  let isFraudEvent = query.includes("fraud") || query.includes("scam") || query.includes("suspicious") || query.includes("alert") || query.includes("hack");
  let isGoalEvent = query.includes("goal") || query.includes("penthouse") || query.includes("tesla") || query.includes("dream");

  // Combine collaborative logs
  const sbiLogs = generateSpecialistSbiSession(message, isSalaryEvent, isFraudEvent, isGoalEvent, isInvestEvent);
  logs.push(...sbiLogs);

  if (isSalaryEvent) {
    const salaryAmount = 5200.00;
    state.balances.checking += salaryAmount;
    
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      category: "Salary",
      description: "Direct Deposit - Initech Corp Salary",
      amount: salaryAmount,
      type: "credit"
    };
    state.transactions.unshift(newTx);

    state.health.score = Math.min(state.health.score + 3, 100);
    state.health.monthlyIncome += salaryAmount;
    state.health.monthlySavings += 1500.00;
    state.health.savingsRate = Math.round((state.health.monthlySavings / state.health.monthlyIncome) * 100);
    
    // Update digital twin forecast
    state.twin.sixMonthSavings += 6200.00;
    state.twin.retirementScore = Math.min(state.twin.retirementScore + 2, 100);

    // Commit to audit trail
    state.audits.unshift({
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      agent: "Compliance Officer",
      event: "AML Verified: Initech Salary source cleared",
      status: "PASSED",
      hash: `sha256-${Math.random().toString(36).substring(2, 10)}`
    });

    botReply = `Good day. Our **SBI Specialist Agents** have successfully reconciled your Initech Corp Salary deposit of **$5,200.00**! 🚀\n\n1. **SBI Relationship Manager**: Recommends sweeping **$3,000** of inactive checking funds into our high-yield Fixed Deposit to earn **$219** in risk-free interest.\n2. **SBI Loan Officer**: Your mortgage threshold is now elevated. Your digital twin projections indicate a car loan capacity of **₹55 Lakhs**.\n3. **SBI Compliance Officer**: Cleared and logged into the regulatory audit trail under Basel III rules.\n\nShall we initiate the automated high-yield sweeps post-salary arrival?`;

  } else if (isFraudEvent) {
    state.audits.unshift({
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      agent: "Fraud Investigator",
      event: "BLOCKED cyber threat: Suspicious $4,120 transaction from Moscow, RU",
      status: "RESOLVED",
      hash: `sha256-${Math.random().toString(36).substring(2, 10)}`
    });

    botReply = `🚨 **HIGH RISK AUDIT WARNING**: My **Fraud & Security Agent** has completed an immediate transaction scan. We detected a suspicious attempt of **$4,120** from Moscow, RU. \n\n**Action Taken**: Blocked in 12ms. No capital was lost. We have issued a security patch and flagged this on your secure ledger. I recommend updating your biometrics via our Onboarding tab to fully secure your profile against credential leaks.`;

  } else if (isInvestEvent) {
    botReply = `Your investment profile has been analyzed. Total portfolio value: **$12,500.00**.\n\n* **Asset Allocation**: Underweight in green equities.\n* **Smart Recommendation**: Initiate our **Vanguard Tech ETF Booster** at **$150/month**. This shaves 5 months off your Tesla target. Shall we deploy?`;
  } else if (isCardEvent) {
    botReply = `Outstanding credit card bill: **$2,150.30**. Utilization score is a highly optimized **14.3%**. I can schedule an instant payment from your checking account to clear this fully. Cleared debts maintain your 790+ credit score capacity. Let me know if you would like me to process this payment.`;
  } else {
    // LLM query
    if (ai) {
      try {
        const promptText = `
          You are the SBI Chief Digital Advisor at FinPilot, an elite partnership between Google AI and State Bank of India.
          User says: "${message}".
          
          Current Banking Metrics:
          - Checking: $${state.balances.checking}
          - Savings: $${state.balances.savings}
          - Investments: $${state.balances.investments}
          - Debt Outstanding: $${state.balances.creditCardUsed}
          - Financial Health Score: ${state.health.score}/100
          
          Provide a highly polished, intelligent, professional, and elite response speaking like an experienced Senior SBI Bank Advisor. Focus on concrete suggestions, use clear bullet points, and offer to execute actions. Keep it clean and direct without any fake system console logs.
        `;
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: promptText,
        });
        
        botReply = response.text || "I am analyzing your finances. What can I adjust for you today?";
      } catch (err) {
        console.error("Gemini query error:", err);
        botReply = `Greetings. As your senior SBI Executive Advisor, I have reviewed your portfolio. Your current liquid assets stand at **$${(state.balances.checking + state.balances.savings).toLocaleString()}**. How can our joint AI specialist agents help you rebalance your targets today?`;
      }
    } else {
      botReply = `Greetings. As your senior SBI Executive Advisor, I have reviewed your portfolio. Your current liquid assets stand at **$${(state.balances.checking + state.balances.savings).toLocaleString()}**. How can our joint AI specialist agents help you rebalance your targets today?`;
    }
  }

  res.json({
    message: botReply,
    thoughtProcess,
    logs,
    recommendations: recommendations,
    updatedBalances: state.balances,
    updatedTransactions: state.transactions,
    updatedHealth: state.health,
    updatedGoals: state.goals,
    updatedWorkflows: state.workflows,
    updatedEvents: state.events,
    updatedTwin: state.twin,
    updatedMemories: state.memories,
    updatedAudits: state.audits
  } as AgentResponse);
});

// === SCENARIO SIMULATOR ENDPOINT ===
app.post("/api/simulate/scenario", (req, res) => {
  const { scenario } = req.body;
  const logs: AgentRunLog[] = [];
  let detailMessage = "";

  // Re-seed audits and memories based on action
  if (scenario === "salary_deposit") {
    const salaryAmount = 5500.00;
    state.balances.checking += salaryAmount;
    
    const newTx: Transaction = {
      id: `tx_sim_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      category: "Salary",
      description: "Direct Deposit - Monthly Corporate Inflow",
      amount: salaryAmount,
      type: "credit"
    };
    state.transactions.unshift(newTx);

    state.health.score = Math.min(state.health.score + 5, 100);
    state.health.monthlyIncome += salaryAmount;
    state.twin.sixMonthSavings += 7500.00;
    state.twin.retirementScore = Math.min(state.twin.retirementScore + 3, 100);

    state.audits.unshift({
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      agent: "SBI Operations Manager",
      event: "Direct deposit credit settled securely on central ledger",
      status: "PASSED",
      hash: `sha256-${Math.random().toString(36).substring(2, 10)}`
    });

    state.memories.unshift({
      id: `mem_sim_${Date.now()}`,
      category: "Behavior",
      detail: `Corporate payroll salary processed on schedule. High checking buffer generated.`,
      lastUpdated: new Date().toISOString().split('T')[0],
      weight: 0.94
    });

    // Automatically perform the auto-sweep Fixed Deposit sweep if check surplus high
    if (state.balances.checking > 8000) {
      state.balances.checking -= 4000;
      state.balances.investments += 4000;
      
      state.transactions.unshift({
        id: `tx_sim_sweep_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        category: "Investment",
        description: "Autonomous High-Yield FD Sweep Plan",
        amount: 4000.00,
        type: "debit"
      });

      state.workflows.push({
        id: `wf_sim_fd_${Date.now()}`,
        name: "Autonomous High-Yield Sweep",
        status: "Active",
        type: "fd",
        details: "$4,000 principal earning 7.25% APY"
      });

      state.audits.unshift({
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        agent: "SBI Branch Manager",
        event: "Autonomous Auto-Sweep executed: $4,000 directed to FD to avoid inflation decay",
        status: "PASSED",
        hash: `sha256-${Math.random().toString(36).substring(2, 10)}`
      });

      detailMessage = "Corporate Salary of $5,500 deposited. Autopilot detected high checked balance surplus and automatically swept $4,000 to high-yield Fixed Deposit!";
    } else {
      detailMessage = "Corporate Salary of $5,500 deposited. Balance is fully available in Checking.";
    }

    const sbiLogs = generateSpecialistSbiSession("Corporate Direct Deposit Credit", true, false, false, false);
    logs.push(...sbiLogs);

  } else if (scenario === "card_billing") {
    const billAmount = 1450.00;
    state.balances.creditCardUsed = Math.min(state.balances.creditCardUsed + billAmount, state.balances.creditCardLimit);
    
    state.transactions.unshift({
      id: `tx_sim_cc_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      category: "Shopping",
      description: "Amex Statement Settlement Charge",
      amount: billAmount,
      type: "debit"
    });

    state.health.score = Math.max(state.health.score - 4, 30);
    
    state.audits.unshift({
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      agent: "Compliance Officer",
      event: "Credit card utilization surge alert. Score updated.",
      status: "FLAGGED",
      hash: `sha256-${Math.random().toString(36).substring(2, 10)}`
    });

    state.memories.unshift({
      id: `mem_sim_cc_${Date.now()}`,
      category: "Transaction",
      detail: `High Amex bill settlement of $${billAmount}. Debt utilization increased to 24%.`,
      lastUpdated: new Date().toISOString().split('T')[0],
      weight: 0.89
    });

    detailMessage = "Monthly Amex Card Bill charged. Utilization rose to 24%. Health Score temporarily modified. Relationship Manager suggests cleared repayment.";

    const sbiLogs = generateSpecialistSbiSession("Credit Card Utilization Surge", false, false, false, false);
    logs.push(...sbiLogs);

  } else if (scenario === "cyber_threat") {
    // Generate suspicious blocked charge
    state.audits.unshift({
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      agent: "Fraud Investigator",
      event: "CYBER ATTACK THREAT: Unauthorised $4,120 transaction from Moscow, RU",
      status: "FLAGGED",
      hash: `sha256-comp-moscow-hack`
    });

    // Resolve immediately
    state.audits.unshift({
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      agent: "Compliance Officer",
      event: "BLOCKED and RESOLVED cyber threat. Virtual card token cycle initiated.",
      status: "RESOLVED",
      hash: `sha256-comp-moscow-resolved`
    });

    state.memories.unshift({
      id: `mem_sim_sec_${Date.now()}`,
      category: "Audit",
      detail: `Blocked fraudulent foreign transaction. Secured with immediate IP blacklists.`,
      lastUpdated: new Date().toISOString().split('T')[0],
      weight: 0.99
    });

    recommendations.unshift({
      id: "rec_sim_cyber_1",
      title: "Cycle Compromised Card Tokens",
      description: "Our Fraud Agent blocked a $4,120 card swipe. We recommend rotating your virtual cards and enabling 2FA immediately.",
      type: "fraud",
      impactAmount: 0,
      suggestedAction: "Rotate Cards & Cycle Pins",
      confidence: 99,
      reasoning: "Credential compromise detected. Rotating tokens eliminates continuous malicious retry attempts.",
      agentName: "SBI Fraud Investigator",
      riskLevel: "High",
      alternatives: ["Block Physical Card Entirely", "Cycle Virtual Card Tokens"]
    });

    detailMessage = "🚨 CRITICAL ATTACK SIMULATED: A $4,120 fraud swipe from Moscow, RU was blocked in 12ms. Secured transaction token; compiled security incident report.";

    const sbiLogs = generateSpecialistSbiSession("Compromised credential swipe", false, true, false, false);
    logs.push(...sbiLogs);

  } else if (scenario === "rate_change") {
    // Modify recommendation values to reflect high rate
    recommendations = recommendations.map(rec => {
      if (rec.id === "rec_1") {
        return {
          ...rec,
          title: "Sovereign 8.5% High-Yield FD",
          description: "RBI rate hikes have pushed sovereign deposits to 8.5% APY! Sweeping $5,000 into our peak tier yields $425 annually with zero risk.",
          impactAmount: 425,
          reasoning: "Rate hike arbitrage makes cash locked in fixed sovereign instruments extremely favorable.",
        };
      }
      return rec;
    });

    state.twin.retirementScore = Math.min(state.twin.retirementScore + 5, 100);
    state.twin.investmentGrowthEstimate += 2500;

    state.audits.unshift({
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      agent: "SBI Branch Manager",
      event: "Sovereign Interest Rate Change logged: FD rates elevated to 8.50%",
      status: "PASSED",
      hash: `sha256-${Math.random().toString(36).substring(2, 10)}`
    });

    state.memories.unshift({
      id: `mem_sim_rate_${Date.now()}`,
      category: "Preference",
      detail: `Central bank interest rate hike occurred. Re-optimized yield target to 8.50%.`,
      lastUpdated: new Date().toISOString().split('T')[0],
      weight: 0.91
    });

    detailMessage = "Central Bank hiked interest rates by 125bps! Fixed Deposit yield rose from 7.25% to 8.5%. Investment advisor automatically rebalanced all projections.";

    const sbiLogs = generateSpecialistSbiSession("Central Bank rate change", false, false, false, true);
    logs.push(...sbiLogs);

  } else if (scenario === "life_event") {
    // Add a major goal and imminent event
    state.events.unshift({
      id: `evt_sim_child_${Date.now()}`,
      name: "New Child Plan 👶",
      expectedDate: "2027-04",
      estimatedCost: 35000,
      probability: 95,
      impactOnAdvisory: "Imminent healthcare and childcare coverage required. Recommend establishing an education trust fund.",
      status: "Imminent"
    });

    state.twin.emergencyProbability = 28; // Child plans boost emergency buffers
    state.twin.loanEligibility = "Pre-approved up to ₹75,00,000 SBI Sovereign Education Fund";

    recommendations.unshift({
      id: "rec_sim_life_1",
      title: "Establish child trust fund",
      description: "With an imminent family event forecasted, establishing an education savings corpus yields 8.1% tax-exempt interest.",
      type: "investment",
      impactAmount: 1200,
      suggestedAction: "Launch Education SIP",
      confidence: 94,
      reasoning: "Pre-empting Child education funds reduces emergency load probability as goal timeline approaches.",
      agentName: "SBI Financial Planner",
      riskLevel: "Low",
      alternatives: ["Public Provident Fund", "Sovereign Child Shield Deposit"]
    });

    state.memories.unshift({
      id: `mem_sim_life_${Date.now()}`,
      category: "Goal",
      detail: `Family event 'New Child Plan' added to core context graph. Expected 2027.`,
      lastUpdated: new Date().toISOString().split('T')[0],
      weight: 0.98
    });

    detailMessage = "Major Life Event triggered: 'New Child Plan'. Financial Digital Twin recalculated emergency thresholds. Pre-approved sovereign trust options generated!";

    const sbiLogs = generateSpecialistSbiSession("Imminent family life milestone", false, false, true, false);
    logs.push(...sbiLogs);
  }

  res.json({
    success: true,
    message: detailMessage,
    logs,
    updatedBalances: state.balances,
    updatedTransactions: state.transactions,
    updatedHealth: state.health,
    updatedGoals: state.goals,
    updatedWorkflows: state.workflows,
    updatedEvents: state.events,
    updatedTwin: state.twin,
    updatedMemories: state.memories,
    updatedAudits: state.audits,
    recommendations
  });
});

// === OCR SIMULATION ENDPOINT ===
app.post("/api/onboarding/ocr", (req, res) => {
  state.onboarding.step = "ocr";
  state.onboarding.ocrData = {
    name: "Likhil Gowda",
    idNumber: "ID-9848529452",
    dob: "1994-04-12",
    address: "742 Evergreen Terrace, Bengaluru, India",
    confidence: 98.7
  };
  state.health.digitalAdoptionScore = Math.min(state.health.digitalAdoptionScore + 15, 100);

  state.audits.unshift({
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    agent: "Sovereign Compliance Officer",
    event: "Biometric ID document scan parsed and verified against database",
    status: "PASSED",
    hash: `sha256-${Math.random().toString(36).substring(2, 10)}`
  });

  res.json({
    success: true,
    message: "SBI Compliance Engine validated Aadhaar / PAN card with 98.7% AI Confidence.",
    ocrData: state.onboarding.ocrData,
    digitalAdoptionScore: state.health.digitalAdoptionScore,
    updatedAudits: state.audits
  });
});

// === FACE VERIFICATION ENDPOINT ===
app.post("/api/onboarding/face", (req, res) => {
  state.onboarding.step = "kyc_complete";
  state.onboarding.faceVerified = true;
  state.onboarding.complianceChecked = true;
  state.health.digitalAdoptionScore = Math.min(state.health.digitalAdoptionScore + 20, 100);

  state.audits.unshift({
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    agent: "Sovereign Compliance Officer",
    event: "Liveness biometric checks completed. KYC profile fully activated.",
    status: "PASSED",
    hash: `sha256-${Math.random().toString(36).substring(2, 10)}`
  });

  res.json({
    success: true,
    message: "Biometric Face Match succeeded with 99.4% similarity. Compliance verified against KYC database.",
    digitalAdoptionScore: state.health.digitalAdoptionScore,
    updatedAudits: state.audits
  });
});

// === WORKFLOWS AUTOPAY ENABLER ENDPOINT ===
app.post("/api/workflow/autopay", (req, res) => {
  const { action, targetId } = req.body;

  if (action === "create_fd") {
    if (state.balances.checking >= 5000) {
      state.balances.checking -= 5000;
      state.balances.investments += 5000;
      
      const newTx: Transaction = {
        id: `tx_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        category: "Investment",
        description: "Auto-Sweep 7.25% Sovereign Fixed Deposit",
        amount: 5000.00,
        type: "debit"
      };
      state.transactions.unshift(newTx);
      
      state.workflows.push({
        id: `wf_${Date.now()}`,
        name: "Fixed Deposit Sovereign Sweep",
        status: "Active",
        type: "fd",
        details: "$5,000 principal maturing in 12 months"
      });

      state.health.digitalAdoptionScore = Math.min(state.health.digitalAdoptionScore + 15, 100);
      state.health.score = Math.min(state.health.score + 5, 100);

      // Audit log
      state.audits.unshift({
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        agent: "SBI Operations Manager",
        event: "Successfully created Fixed Deposit of $5,000",
        status: "PASSED",
        hash: `sha256-${Math.random().toString(36).substring(2, 10)}`
      });

      recommendations = recommendations.filter(r => r.id !== "rec_1");

      return res.json({
        success: true,
        message: "Successfully generated 7.25% Fixed Deposit of $5,000 autonomously!",
        updatedBalances: state.balances,
        updatedTransactions: state.transactions,
        updatedWorkflows: state.workflows,
        updatedHealth: state.health,
        updatedAudits: state.audits
      });
    } else {
      return res.status(400).json({ error: "Insufficient funds in Checking to perform sweep." });
    }
  }

  if (action === "cancel_sub") {
    state.transactions = state.transactions.filter(t => !t.description.includes("Netflix") && !t.description.includes("CineStream"));
    state.health.monthlyExpenses -= 19.99;
    state.health.digitalAdoptionScore = Math.min(state.health.digitalAdoptionScore + 10, 100);
    state.health.score = Math.min(state.health.score + 3, 100);
    recommendations = recommendations.filter(r => r.id !== "rec_2" && r.id !== "rec_sim_cyber_1");

    state.audits.unshift({
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      agent: "SBI Fraud Investigator",
      event: "Canceled inactive leak subscription 'CineStream'",
      status: "PASSED",
      hash: `sha256-${Math.random().toString(36).substring(2, 10)}`
    });

    return res.json({
      success: true,
      message: "Subscription canceled successfully. Future billing stopped.",
      updatedBalances: state.balances,
      updatedTransactions: state.transactions,
      updatedHealth: state.health,
      updatedAudits: state.audits
    });
  }

  return res.status(400).json({ error: "Unknown workflow action" });
});

// === EXECUTIVE ANALYTICS ENDPOINT (FOR BOARDROOM ADMIN DASHBOARD) ===
app.get("/api/analytics", (req, res) => {
  const analytics: ExecutiveAnalytics = {
    funnel: [
      { stage: "Ad Landing", count: 24500, conversionRate: 100 },
      { stage: "KYC Onboarding", count: 18200, conversionRate: 74 },
      { stage: "First Funding Sweep", count: 12400, conversionRate: 68 },
      { stage: "SIP Auto-Investment", count: 9100, conversionRate: 73 },
      { stage: "Wealth Advisory Retention", count: 7200, conversionRate: 79 }
    ],
    agentPerformance: [
      { agentName: "Chief Banking Orchestrator", tasksHandled: 48920, successRate: 99.8, avgConfidence: 99.1, averageResponseMs: 140 },
      { agentName: "SBI Relationship Manager", tasksHandled: 34200, successRate: 98.4, avgConfidence: 94.5, averageResponseMs: 110 },
      { agentName: "SBI Investment Advisor", tasksHandled: 21500, successRate: 96.2, avgConfidence: 92.1, averageResponseMs: 190 },
      { agentName: "SBI Fraud Investigator", tasksHandled: 108400, successRate: 99.9, avgConfidence: 98.5, averageResponseMs: 45 },
      { agentName: "SBI Compliance Officer", tasksHandled: 112000, successRate: 100, avgConfidence: 100, averageResponseMs: 30 },
      { agentName: "SBI Loan Officer", tasksHandled: 15400, successRate: 97.5, avgConfidence: 95.8, averageResponseMs: 165 },
      { agentName: "SBI Financial Planner", tasksHandled: 28900, successRate: 98.1, avgConfidence: 93.9, averageResponseMs: 120 }
    ],
    revenueImpact: [
      { month: "Jan", aiAttributedRevenue: 124000, organicRevenue: 450000 },
      { month: "Feb", aiAttributedRevenue: 189000, organicRevenue: 470000 },
      { month: "Mar", aiAttributedRevenue: 245000, organicRevenue: 485000 },
      { month: "Apr", aiAttributedRevenue: 312000, organicRevenue: 510000 },
      { month: "May", aiAttributedRevenue: 428000, organicRevenue: 520000 },
      { month: "Jun", aiAttributedRevenue: 541000, organicRevenue: 545000 }
    ],
    userSegmentation: [
      { segment: "Elite Wealth Preservation", count: 1240, percentage: 12.4 },
      { segment: "Active Goal Accumulators", count: 4850, percentage: 48.5 },
      { segment: "Debt Minimizers", count: 2120, percentage: 21.2 },
      { segment: "Sovereign Bond Sweepers", count: 1790, percentage: 17.9 }
    ],
    digitalAdoptionByPillar: [
      { pillar: "Automated Bill Sweep", rate: 84 },
      { pillar: "AI Life Goal Matching", rate: 72 },
      { pillar: "Biometric AI KYC", rate: 94 },
      { pillar: "Pension Fixed Sweep", rate: 61 }
    ],
    customerSatisfaction: 98.4,
    lifetimeValue: 14200,
    churnRiskIndex: 2.1,
    regionalStats: [
      { region: "Mumbai Hub", activeUsers: 84500, volume: 14.2 },
      { region: "Bengaluru Corp", activeUsers: 62100, volume: 11.5 },
      { region: "Delhi National", activeUsers: 54000, volume: 9.8 },
      { region: "Hyderabad Tech", activeUsers: 41800, volume: 7.6 }
    ]
  };

  res.json(analytics);
});

// === EXPLICIT REST SANDBOX ENDPOINTS ===
app.get("/sandbox/account/balance", (req, res) => {
  res.json({
    success: true,
    balances: state.balances,
    timestamp: new Date().toISOString()
  });
});

app.get("/sandbox/transactions", (req, res) => {
  res.json({
    success: true,
    transactions: state.transactions,
    timestamp: new Date().toISOString()
  });
});

app.post("/sandbox/fd/create", (req, res) => {
  const { amount } = req.body || { amount: 5000 };
  const numAmount = Number(amount) || 5000;
  
  if (state.balances.checking >= numAmount) {
    state.balances.checking -= numAmount;
    state.balances.investments += numAmount;
    
    const newTx: Transaction = {
      id: `tx_sb_fd_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      category: "Investment",
      description: `Auto-Sweep ₹${numAmount.toLocaleString()} FD @ 7.25%`,
      amount: numAmount,
      type: "debit"
    };
    state.transactions.unshift(newTx);
    
    state.workflows.push({
      id: `wf_sb_fd_${Date.now()}`,
      name: `Sovereign Sweep Fixed Deposit`,
      status: "Active",
      type: "fd",
      details: `₹${numAmount.toLocaleString()} principal at 7.25% APY`
    });

    state.audits.unshift({
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      agent: "SBI Operations Manager",
      event: `Sandbox API Executed: Sweep FD generated for ₹${numAmount}`,
      status: "PASSED",
      hash: `sha256-${Math.random().toString(36).substring(2, 10)}`
    });

    res.json({
      success: true,
      message: `Created Fixed Deposit of ₹${numAmount.toLocaleString()} successfully.`,
      balances: state.balances,
      transactions: state.transactions,
      workflows: state.workflows,
      audits: state.audits
    });
  } else {
    res.status(400).json({ success: false, error: "Insufficient balance in checking account." });
  }
});

app.post("/sandbox/loan/check", (req, res) => {
  const score = state.health.score;
  const capacity = score >= 80 ? 25000000 : score >= 60 ? 15000000 : 5000000;
  res.json({
    success: true,
    score,
    preApprovedMortgageRange: capacity,
    debtServiceRatio: "34.5% (Basel III Limit: 40%)",
    loanOfficerDecision: "PASSED",
    timestamp: new Date().toISOString()
  });
});

app.post("/sandbox/card/apply", (req, res) => {
  state.balances.creditCardLimit += 5000.00;
  
  state.audits.unshift({
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    agent: "Sovereign Compliance Officer",
    event: "Sandbox API Executed: Virtual Credit Limit Upgrade Approved (+₹5,000)",
    status: "PASSED",
    hash: `sha256-${Math.random().toString(36).substring(2, 10)}`
  });

  res.json({
    success: true,
    message: "Virtual Credit Card upgraded successfully. Limit boosted by ₹5,000.",
    creditCardLimit: state.balances.creditCardLimit,
    audits: state.audits
  });
});

app.post("/sandbox/autopay/create", (req, res) => {
  const { name, amount, type } = req.body || { name: "Mutual Fund SIP", amount: 250, type: "sip" };
  const numAmount = Number(amount) || 250;
  const newWf: ActiveWorkflow = {
    id: `wf_sb_sip_${Date.now()}`,
    name: name || "Autonomous SIP Accumulator",
    status: "Active",
    type: type || "sip",
    details: `₹${numAmount.toLocaleString()} scheduled automatically`
  };
  state.workflows.push(newWf);

  state.audits.unshift({
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    agent: "SBI Operations Manager",
    event: `Sandbox API Executed: Scheduled instruction created for ${name}`,
    status: "PASSED",
    hash: `sha256-${Math.random().toString(36).substring(2, 10)}`
  });

  res.json({
    success: true,
    message: `Scheduled instruction generated successfully.`,
    workflows: state.workflows,
    audits: state.audits
  });
});

// === SERVE CLIENT SPA FRONTEND ===
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FinPilot Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
