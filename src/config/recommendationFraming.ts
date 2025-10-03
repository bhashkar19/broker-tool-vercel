// 🎯 SOLUTION FRAMING - How to present each partner as solving user's issues
// Even when recommending based on priority, we frame it as solving THEIR problem

export interface SolutionFraming {
  charges: string;
  reliability: string;
  support: string;
  research: string;
  tools: string;
  satisfied: string;
  bonusBenefits: string[];
}

export const PARTNER_SOLUTION_FRAMING: Record<string, SolutionFraming> = {
  zerodha: {
    charges: "₹0 delivery brokerage = Save ₹10,000-1,20,000/year vs traditional brokers. Only ₹20 intraday (same as others) + ₹300/year AMC. Transparent pricing, no surprises.",

    reliability: "Handles 1.6 Cr users daily - proven stability at massive scale. No major crashes since 2024 platform upgrade (upgraded infrastructure). Built for scale, not breaking under pressure.",

    support: "24-48 hour ticket response (better than 72+ at Groww). Extensive knowledge base + Varsity education = self-solve most issues. Community of 1.6 Cr users for peer support.",

    research: "Varsity education (₹15K value FREE) > paid tips. Learn technical analysis, fundamental analysis, options - become independent trader. 200+ courses in Hindi + English.",

    tools: "While basic, covers 95% of trader needs effectively. Clean interface, no overwhelming complexity. Kite API available for advanced users. Good charting for regular analysis.",

    satisfied: "Complete package: ₹0 delivery + Best education + Largest community + Transparent pricing. Even if satisfied elsewhere, Zerodha offers unique value (education alone worth ₹15K).",

    bonusBenefits: [
      "₹0 delivery brokerage (best for long-term investors)",
      "Free Varsity education - 200+ courses (₹15K value)",
      "1.6 Cr users - most trusted brand in India",
      "Transparent pricing - no hidden charges ever",
      "Console for portfolio tracking & tax reporting"
    ]
  },

  angel_one: {
    charges: "Discount plan available: ₹20/trade (same as Zerodha intraday, competitive pricing). CHOOSE your plan: Discount OR Full-service. Flexibility other brokers don't offer.",

    reliability: "Established infrastructure handles volatility well. Full-service broker resources ensure platform stability. Multiple platforms (web, mobile, desktop) for redundancy.",

    support: "Human phone support during trading hours (real people, not bots!). Dedicated relationship manager assigned to you. Same-day resolution vs 24-72 hour ticket delays elsewhere.",

    research: "Professional research team provides daily stock recommendations. Free market insights and analysis reports. Advisory services available (optional, pay if you want guidance).",

    tools: "Comprehensive platform with multiple order types. Advanced features without overwhelming complexity. ARQ AI-powered insights for smarter trading. Multiple platforms suit your trading style.",

    satisfied: "Unique flexibility: Start with discount plan (₹20/trade low cost), upgrade to full-service LATER if you need guidance. No other broker offers this choice - most are either/or.",

    bonusBenefits: [
      "Human phone support + relationship manager",
      "Professional research team (daily stock picks)",
      "Flexible plans: Choose discount OR full-service",
      "ARQ AI insights for smarter decisions",
      "1.3 Cr+ users, established trust"
    ]
  },

  upstox: {
    charges: "₹20 flat pricing - simple and transparent. While same cost as others, speed advantage saves more than brokerage (reduce slippage through fast execution).",

    reliability: "0.5 second execution - 10x faster than competitors during volatile days. Stable platform during Budget/Election results (proven track record). No crashes when market moves fast.",

    support: "While ticket-based, focus is on quick technical resolution. Platform stability means fewer support tickets needed. Modern tech = fewer issues to resolve.",

    research: "Self-directed platform perfect for experienced traders who know what they want. No advisory means no upselling, no distractions. Clean platform for execution-focused trading.",

    tools: "Modern platform with clean UI - covers trading essentials effectively. Fast execution IS a tool (speed = money for active traders). Mobile-first design for trading on-the-go.",

    satisfied: "Speed advantage: 0.5 sec execution saves money through reduced slippage. If you're active trader, speed matters more than ₹20 brokerage. Time is money in volatile markets.",

    bonusBenefits: [
      "0.5 sec execution - fastest in India",
      "Stable during Budget/Election/volatile days",
      "1.3 Cr users, growing trust",
      "Modern mobile-first platform",
      "Pro web platform for power users"
    ]
  },

  fyers: {
    charges: "₹20/trade pricing - worth it for professional tools you get. Exchange charges slightly higher but tool quality compensates. For serious traders, tools matter more than ₹50/month savings.",

    reliability: "Professional-grade infrastructure built for serious traders. API uptime critical for algo traders - platform delivers. Newer tech stack = modern reliability standards.",

    support: "Technical support focused on platform/API issues (what pros need). While not hand-holding, efficient problem solving. Support team understands advanced trading requirements.",

    tools: "Professional charting (TradingView-level quality). Full API access for algorithmic trading. Advanced order types: Bracket, Cover, OCO, etc. Built for traders who need serious tools.",

    research: "Platform for self-directed professionals who do own research. Charting tools ARE research (technical analysis capabilities). API allows building custom research systems.",

    satisfied: "Advanced capabilities justify slightly higher cost. If you're professional trader or aspiring to be, tools pay for themselves. Only platform with full API + pro charting at this price.",

    bonusBenefits: [
      "Professional-grade charting tools",
      "Full REST + WebSocket API access",
      "Advanced order types (Bracket, Cover, OCO)",
      "TradingView charts integrated",
      "Perfect for algo/professional traders"
    ]
  },

  '5paisa': {
    charges: "₹10 per trade - absolute lowest in India (50% cheaper than ₹20 brokers). For high-frequency traders doing 100+ trades/month, savings add up significantly (₹1,000/month saved).",

    reliability: "Platform stability improved in recent years. For price-conscious traders, occasional issues are acceptable trade-off for 50% cost savings. Use limit orders to mitigate execution risks.",

    support: "Support improving as user base grows. For independent traders who rarely need help, low cost matters more than premium support. Basic issues handled via email/ticket system.",

    tools: "Basic tools perfect for simple trading strategies. No frills = no distractions. Multiple platforms (web, mobile, desktop) cover essential needs. Good enough for straightforward buy/sell.",

    research: "No-frills platform for traders who do own analysis. ₹10 cost means money saved can buy premium research elsewhere if needed. DIY approach for cost-focused traders.",

    satisfied: "Ultimate cost optimization: ₹10/trade vs ₹20 elsewhere = 50% savings. For traders doing 1000+ trades/year, saves ₹10,000-20,000 annually. Budget-conscious choice without compromise on basics.",

    bonusBenefits: [
      "₹10 per trade - absolute lowest cost",
      "Save ₹10,000-20,000/year for active traders",
      "Multiple trading platforms available",
      "Good for high-frequency cost-focused traders",
      "SEBI registered, legitimate broker"
    ]
  }
};

// Helper: Get solution framing for specific challenge
export const getSolutionForChallenge = (
  brokerId: string,
  challenge: string
): string => {
  const framing = PARTNER_SOLUTION_FRAMING[brokerId];
  if (!framing) return '';

  switch (challenge) {
    case 'charges':
      return framing.charges;
    case 'reliability':
      return framing.reliability;
    case 'support':
      return framing.support;
    case 'research':
      return framing.research;
    case 'tools':
      return framing.tools;
    case 'satisfied':
      return framing.satisfied;
    default:
      return framing.satisfied; // Fallback
  }
};

// Helper: Get bonus benefits for broker
export const getBonusBenefits = (brokerId: string): string[] => {
  const framing = PARTNER_SOLUTION_FRAMING[brokerId];
  return framing?.bonusBenefits || [];
};

// Challenge labels for display
export const CHALLENGE_LABELS: Record<string, string> = {
  charges: 'High Charges',
  reliability: 'Platform Crashes',
  support: 'Poor Support',
  research: 'Lack of Research',
  tools: 'Limited Tools',
  satisfied: 'General Trading Needs'
};
