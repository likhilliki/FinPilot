export interface AgentRunLog {
  agentName: string;
  goal: string;
  memory: string[];
  planning: string[];
  reasoning: string;
  toolUsed?: string;
  selfReflection: string;
  output: string;
  timestamp: string;
}

export interface Transaction {
  id: string;
  date: string;
  category: "Salary" | "Shopping" | "Food" | "Utilities" | "Rent" | "Investment" | "Subscription" | "Transfer" | "Others";
  description: string;
  amount: number;
  type: "credit" | "debit";
}

export interface AccountBalances {
  checking: number;
  savings: number;
  investments: number;
  creditCardLimit: number;
  creditCardUsed: number;
}

export interface FinancialHealth {
  score: number; // 0-100
  digitalAdoptionScore: number; // 0-100
  monthlyIncome: number;
  monthlySavings: number;
  monthlyExpenses: number;
  savingsRate: number; // percentage
  investmentRatio: number; // percentage
  status: "Needs Attention" | "Healthy" | "Excellent" | "Elite";
}

export interface OnboardingStatus {
  step: "start" | "ocr" | "face" | "kyc_complete";
  ocrData?: {
    name: string;
    idNumber: string;
    dob: string;
    address: string;
    confidence: number;
  };
  faceVerified?: boolean;
  complianceChecked?: boolean;
}

export interface LifeGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  sipAmount: number;
  status: "On Track" | "Off Track" | "Completed";
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  type: "savings" | "investment" | "credit_card" | "insurance" | "autopay" | "fraud";
  impactAmount?: number;
  suggestedAction: string;
  confidence: number; // 0-100
  reasoning: string;
  agentName: string; // which agent produced it
  riskLevel: "Low" | "Medium" | "High";
  alternatives: string[];
}

export interface ActiveWorkflow {
  id: string;
  name: string;
  status: "Active" | "Pending" | "Completed";
  type: "sip" | "fd" | "autopay" | "badge";
  details: string;
}

export interface LifeEvent {
  id: string;
  name: string;
  expectedDate: string;
  estimatedCost: number;
  probability: number; // 0-100
  impactOnAdvisory: string;
  status: "Forecasted" | "Imminent" | "Active" | "Completed";
}

export interface DigitalTwinSim {
  sixMonthSavings: number;
  loanEligibility: string;
  investmentGrowthEstimate: number;
  emergencyProbability: number;
  retirementScore: number;
}

export interface MemoryNode {
  id: string;
  category: "Conversation" | "Goal" | "Preference" | "Behavior" | "Habit" | "Transaction" | "Audit";
  detail: string;
  lastUpdated: string;
  weight: number; // connection strength 0-1
}

export interface AuditLog {
  timestamp: string;
  agent: string;
  event: string;
  status: "PASSED" | "FLAGGED" | "RESOLVED";
  hash: string;
}

export interface AgentResponse {
  message: string;
  thoughtProcess: string;
  logs: AgentRunLog[];
  recommendations: AIRecommendation[];
  updatedBalances: AccountBalances;
  updatedTransactions: Transaction[];
  updatedHealth: FinancialHealth;
  updatedGoals: LifeGoal[];
  updatedWorkflows: ActiveWorkflow[];
  updatedEvents: LifeEvent[];
  updatedTwin: DigitalTwinSim;
  updatedMemories: MemoryNode[];
  updatedAudits: AuditLog[];
}

export interface ExecutiveAnalytics {
  funnel: {
    stage: string;
    count: number;
    conversionRate: number;
  }[];
  agentPerformance: {
    agentName: string;
    tasksHandled: number;
    successRate: number; // 0-100
    avgConfidence: number; // 0-100
    averageResponseMs: number;
  }[];
  revenueImpact: {
    month: string;
    aiAttributedRevenue: number;
    organicRevenue: number;
  }[];
  userSegmentation: {
    segment: string;
    count: number;
    percentage: number;
  }[];
  digitalAdoptionByPillar: {
    pillar: string;
    rate: number; // 0-100
  }[];
  customerSatisfaction: number; // 0-100
  lifetimeValue: number; // rupees/USD
  churnRiskIndex: number; // 0-100
  regionalStats: {
    region: string;
    activeUsers: number;
    volume: number; // billions
  }[];
}
