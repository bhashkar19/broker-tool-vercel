// 🏦 BROKER CONFIGURATION - Easy to modify priorities and add new brokers
// Change priority numbers to reorder recommendations

export interface BrokerConfig {
  id: string;
  name: string;
  logo_url: string; // Supabase CDN URL for broker logo
  affiliate_url: string;
  priority: number; // Lower number = higher priority
  best_for: string[];
  real_insights: {
    pros: string[];
    cons: string[];
    perfect_for: string;
    cost_summary: string;
    why_we_recommend: string;
  };
  features: string[];
  charges: {
    intraday_brokerage: number;
    delivery_brokerage: number;
    fo_brokerage: number;
    amc_charges: number;
  };
  scoring: {
    beginners: number;
    professionals: number;
    cost_conscious: number;
    speed_focused: number;
    learning_focused: number;
  };
}

// 🔄 EASILY MODIFY BROKER PRIORITIES HERE
// Just change the priority numbers: 1 = highest, 5 = lowest
export const BROKER_CONFIGS: Record<string, BrokerConfig> = {
  'zerodha': {
    id: 'zerodha',
    name: 'Zerodha',
    logo_url: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/zerodha.svg',
    affiliate_url: 'https://zerodha.com/open-account?c=ZMPLLT',
    priority: 1, // 🏆 Currently highest priority
    best_for: ['beginners', 'long_term_investing', 'learning', 'cost_conscious'],
    real_insights: {
      pros: [
        "India's largest broker with 1.6 crore active users",
        "Actually FREE delivery trading - no brokerage charges",
        "Kite app rated #1 by users - genuinely user-friendly",
        "Best educational content (Varsity) - completely free"
      ],
      cons: [
        "Servers crash on volatile days (Budget, results) - we've tracked this",
        "Customer support is mostly chatbots - 2-3 day email responses",
        "Basic research reports compared to full-service brokers"
      ],
      perfect_for: "Buy-and-hold investors who want to learn without paying fees",
      cost_summary: "Long-term investors: ₹0 brokerage + ₹300 AMC = ₹25/month",
      why_we_recommend: "Best balance of features, cost, and learning resources for most people"
    },
    features: [
      "Free equity delivery trading",
      "Advanced TradingView charts",
      "Kite mobile app (most popular)",
      "Console web platform",
      "Varsity educational platform"
    ],
    charges: {
      intraday_brokerage: 20,
      delivery_brokerage: 0,
      fo_brokerage: 20,
      amc_charges: 300
    },
    scoring: {
      beginners: 9,
      professionals: 6,
      cost_conscious: 8,
      speed_focused: 5,
      learning_focused: 9
    }
  },

  'upstox': {
    id: 'upstox',
    name: 'Upstox',
    logo_url: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/upstox.svg',
    affiliate_url: 'https://upstox.com/open-account/?f=E3MQ',
    priority: 2, // 🥈 Second priority
    best_for: ['day_trading', 'speed_execution', 'active_traders', 'professionals'],
    real_insights: {
      pros: [
        "Backed by Ratan Tata - solid financial backing",
        "Consistently faster execution than Zerodha during market hours",
        "Better tech infrastructure - 60% fewer server crashes",
        "Lower AMC than most competitors"
      ],
      cons: [
        "Smaller user community - fewer tips and discussions",
        "Limited educational content vs Zerodha",
        "Interface slightly more complex for complete beginners"
      ],
      perfect_for: "Active intraday traders who prioritize speed over everything else",
      cost_summary: "Active traders: ₹20 per trade + ₹150 AMC = ₹12.5/month",
      why_we_recommend: "Best execution speed and reliability for serious traders"
    },
    features: [
      "Lightning-fast order execution",
      "Professional trading tools",
      "Advanced charts and technical analysis",
      "24/7 customer support"
    ],
    charges: {
      intraday_brokerage: 20,
      delivery_brokerage: 0,
      fo_brokerage: 20,
      amc_charges: 150
    },
    scoring: {
      beginners: 7,
      professionals: 9,
      cost_conscious: 7,
      speed_focused: 9,
      learning_focused: 5
    }
  },

  'angel_one': {
    id: 'angel_one',
    name: 'Angel One',
    logo_url: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/angelone.png',
    affiliate_url: 'https://angelone.in/signup/register/?rne_source=B2B_NXT&btype=SVRQUg&referrer=MAQT::rne_source=B2B_NXT::btype=SVRQUg',
    priority: 3, // 🥉 Third priority
    best_for: ['research_advisory', 'guided_investing', 'recommendations', 'support_focused'],
    real_insights: {
      pros: [
        "Best research reports and stock recommendations in industry",
        "Multiple professional trading platforms available",
        "Strong investment advisory services with dedicated RMs",
        "Excellent customer support with human agents"
      ],
      cons: [
        "Higher charges for premium advisory services",
        "Complex pricing structure with multiple fee types",
        "Interface can overwhelm complete beginners"
      ],
      perfect_for: "Investors who want professional research and don't mind paying for quality",
      cost_summary: "Premium service: ₹20 per trade + ₹240 AMC + advisory fees",
      why_we_recommend: "Best choice when you need professional guidance and research"
    },
    features: [
      "Professional research reports",
      "Angel SpeedPro trading platform",
      "Investment advisory services",
      "Multiple trading interfaces"
    ],
    charges: {
      intraday_brokerage: 20,
      delivery_brokerage: 0,
      fo_brokerage: 20,
      amc_charges: 240
    },
    scoring: {
      beginners: 6,
      professionals: 8,
      cost_conscious: 5,
      speed_focused: 7,
      learning_focused: 8
    }
  },

  'fyers': {
    id: 'fyers',
    name: 'Fyers',
    logo_url: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/fyers.svg',
    affiliate_url: 'https://signup.fyers.in/?utm-source=AP-Leads&utm-medium=AP0225',
    priority: 4, // Fourth priority
    best_for: ['advanced_tools', 'algo_trading', 'professional_traders', 'technical_analysis'],
    real_insights: {
      pros: [
        "Most advanced trading tools and professional-grade charts",
        "API access for algorithmic trading strategies",
        "Excellent for complex options strategies",
        "Best technical analysis features in discount broking"
      ],
      cons: [
        "Highest AMC charges among major discount brokers",
        "Very complex for beginners - steep learning curve",
        "Limited customer support for basic trading queries"
      ],
      perfect_for: "Professional traders who need advanced tools and can handle complexity",
      cost_summary: "Professional grade: ₹20 per trade + ₹400 AMC = ₹33/month",
      why_we_recommend: "Unmatched tools for serious traders who've outgrown basic platforms"
    },
    features: [
      "Advanced trading and charting tools",
      "Professional technical analysis",
      "API access for algorithmic trading",
      "Options strategy builder"
    ],
    charges: {
      intraday_brokerage: 20,
      delivery_brokerage: 0,
      fo_brokerage: 20,
      amc_charges: 400
    },
    scoring: {
      beginners: 3,
      professionals: 9,
      cost_conscious: 4,
      speed_focused: 8,
      learning_focused: 4
    }
  },

  '5paisa': {
    id: '5paisa',
    name: '5paisa',
    logo_url: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/5paisa.svg',
    affiliate_url: 'https://www.5paisa.com/demat-account?ReferralCode=56765996&ReturnUrl=invest-open-account',
    priority: 5, // Fifth priority
    best_for: ['cost_conscious', 'high_volume_trading', 'budget_focused'],
    real_insights: {
      pros: [
        "Lowest brokerage charges in the market - ₹10 per trade",
        "Zero AMC charges - completely free account maintenance",
        "Good for high-volume traders who trade very frequently",
        "Simple, straightforward pricing structure"
      ],
      cons: [
        "Charges ₹10 for delivery trades while others are free",
        "Very basic platform with limited advanced features",
        "Poor customer support and frequent technical issues"
      ],
      perfect_for: "High-volume traders who prioritize low costs over features",
      cost_summary: "Budget option: ₹10 per trade + ₹0 AMC = No monthly fees",
      why_we_recommend: "Only if you trade very frequently and every rupee saved matters"
    },
    features: [
      "Lowest brokerage charges",
      "Zero AMC charges",
      "Basic mobile trading app",
      "Simple investment products"
    ],
    charges: {
      intraday_brokerage: 10,
      delivery_brokerage: 10,
      fo_brokerage: 10,
      amc_charges: 0
    },
    scoring: {
      beginners: 4,
      professionals: 4,
      cost_conscious: 9,
      speed_focused: 4,
      learning_focused: 2
    }
  }
};

// 🎯 RECOMMENDATION SCORING MATRICES
export const PRIORITY_SCORING = {
  'cost': {
    '5paisa': 9,
    'zerodha': 8,
    'upstox': 7,
    'angel_one': 5,
    'fyers': 4
  },
  'speed': {
    'upstox': 9,
    'fyers': 8,
    'angel_one': 7,
    'zerodha': 5,
    '5paisa': 4
  },
  'tools': {
    'fyers': 9,
    'upstox': 8,
    'angel_one': 7,
    'zerodha': 6,
    '5paisa': 3
  },
  'support': {
    'angel_one': 9,
    'upstox': 7,
    'fyers': 6,
    'zerodha': 4,
    '5paisa': 3
  },
  'education': {
    'zerodha': 9,
    'angel_one': 7,
    'upstox': 5,
    'fyers': 4,
    '5paisa': 2
  }
};

export const FREQUENCY_SCORING = {
  'daily': {
    'upstox': 9,
    'fyers': 8,
    'angel_one': 7,
    'zerodha': 6,
    '5paisa': 7
  },
  'weekly': {
    'zerodha': 8,
    'upstox': 7,
    'angel_one': 8,
    'fyers': 6,
    '5paisa': 6
  },
  'monthly': {
    'zerodha': 9,
    'angel_one': 8,
    'upstox': 6,
    'fyers': 5,
    '5paisa': 7
  },
  'rarely': {
    'zerodha': 9,
    'angel_one': 7,
    'upstox': 5,
    'fyers': 4,
    '5paisa': 6
  }
};

export const EXPERIENCE_SCORING = {
  'beginner': {
    'zerodha': 9,
    'upstox': 7,
    'angel_one': 6,
    'fyers': 3,
    '5paisa': 5
  },
  'novice': {
    'zerodha': 8,
    'upstox': 8,
    'angel_one': 7,
    'fyers': 5,
    '5paisa': 6
  },
  'intermediate': {
    'upstox': 8,
    'fyers': 7,
    'zerodha': 7,
    'angel_one': 8,
    '5paisa': 5
  },
  'expert': {
    'fyers': 9,
    'upstox': 8,
    'angel_one': 7,
    'zerodha': 6,
    '5paisa': 4
  }
};

// 🔍 EXPANDABLE BROKER ISSUES DATABASE
// Add new issues as you discover them - this will make recommendations more credible
export const BROKER_ISSUES = {
  'zerodha': {
    server_crashes: "Servers crash during Budget/Election results - users miss selling opportunities during volatile markets",
    slow_support: "Customer support takes 2-3 days, mostly chatbots - real human help is rare",
    basic_research: "Limited research reports compared to full-service brokers - just basic fundamentals",
    weekend_maintenance: "Platform unavailable during weekend maintenance - can't prepare for Monday",
    chart_limitations: "Basic charting tools compared to professional platforms",
    no_advisory: "No personalized stock recommendations - you're on your own for stock picking"
  },
  'angel_one': {
    hidden_charges: "Advisory fees ₹500+ monthly that users don't realize - bills pile up quietly",
    complex_pricing: "Multiple fee types confuse users - hard to calculate actual costs",
    overwhelming_interface: "Too many features overwhelm beginners - analysis paralysis",
    forced_advisory: "Pushes advisory services even when not needed - sales-first approach",
    high_margin_charges: "Higher margin charges compared to discount brokers",
    legacy_platform: "Older technology platform - slower than modern apps"
  },
  'upstox': {
    small_community: "Smaller user base - fewer online discussions and tips sharing",
    limited_education: "No educational content like Zerodha Varsity - limited learning resources",
    interface_complexity: "Learning curve for users switching from Zerodha - different layout",
    fewer_integrations: "Limited third-party app integrations compared to Zerodha",
    research_gaps: "Basic research compared to full-service brokers - limited analysis",
    support_hours: "Limited customer support hours compared to larger brokers"
  },
  'fyers': {
    complex_interface: "Professional interface overwhelming for beginners - steep learning curve",
    higher_costs: "Higher charges than discount brokers for casual traders",
    limited_popularity: "Smaller user base - less community support and resources",
    advanced_focus: "Focused on advanced traders - beginners might feel left out",
    fewer_branches: "Limited physical presence for offline support"
  },
  '5paisa': {
    delivery_charges: "Charges ₹10 for delivery trades while others offer FREE - unnecessary cost",
    basic_platform: "Very basic platform with limited advanced features - feels outdated",
    poor_support: "Poor customer support and frequent technical issues - user complaints",
    limited_research: "Minimal research and advisory services - very basic reports",
    brand_perception: "Less trusted brand compared to established players",
    fewer_features: "Missing many features that other brokers provide standard"
  }
};

// 🎯 BROKER SOLUTIONS DATABASE
// What each broker solves for users coming from other brokers
export const BROKER_SOLUTIONS = {
  'zerodha': {
    from_angel_one: "Zero hidden charges and transparent pricing - know exactly what you pay",
    from_upstox: "Best educational content (Varsity) - learn while you trade",
    from_5paisa: "Free delivery trading saves money - keep more of your profits",
    from_fyers: "Simplified interface perfect for beginners - easy to start",
    general: "Most trusted discount broker with largest user base - proven track record"
  },
  'angel_one': {
    from_zerodha: "Professional research team picks winning stocks - stop guessing which stocks to buy",
    from_upstox: "Comprehensive advisory services and stock recommendations - guided trading",
    from_5paisa: "Quality research reports and market analysis - make informed decisions",
    from_fyers: "Better customer support with human agents - real help when needed",
    general: "Full-service experience with research-backed recommendations"
  },
  'upstox': {
    from_zerodha: "3x faster execution speed - crucial during volatile market movements",
    from_angel_one: "Lower costs without advisory fees - pure execution focused",
    from_5paisa: "Better technology platform and reliability - modern trading experience",
    from_fyers: "Simpler interface while maintaining speed - best of both worlds",
    general: "Speed and reliability for active traders - when every second counts"
  },
  'fyers': {
    from_zerodha: "Advanced professional tools and analytics - serious trader features",
    from_angel_one: "Lower costs for high-volume trading - save on frequent trades",
    from_upstox: "More sophisticated charting and analysis tools - professional grade",
    from_5paisa: "Superior technology and platform stability - institutional quality",
    general: "Professional-grade platform for serious traders"
  },
  '5paisa': {
    from_zerodha: "Lowest possible brokerage charges - maximum savings on frequent trading",
    from_angel_one: "No advisory fees or hidden charges - pure cost savings",
    from_upstox: "Zero AMC charges - completely free account maintenance",
    from_fyers: "Simplified pricing structure - easy to understand costs",
    general: "Rock-bottom pricing for cost-conscious traders"
  }
};

// 🏆 BUSINESS PRIORITY ORDER
// Higher priority = recommend first (better affiliate commissions)
export const BROKER_BUSINESS_PRIORITY = {
  'zerodha': 1,    // Highest priority
  'angel_one': 1,  // Equal highest priority
  'upstox': 2,     // Second priority
  'fyers': 3,      // Third priority
  '5paisa': 4      // Lowest priority
};

// 🚀 EASY CONFIGURATION FUNCTIONS
export const updateBrokerPriority = (brokerId: string, newPriority: number) => {
  if (BROKER_CONFIGS[brokerId]) {
    BROKER_CONFIGS[brokerId].priority = newPriority;
  }
};

export const addNewBroker = (brokerConfig: BrokerConfig) => {
  BROKER_CONFIGS[brokerConfig.id] = brokerConfig;
};

export const getBrokersByPriority = () => {
  return Object.values(BROKER_CONFIGS).sort((a, b) => a.priority - b.priority);
};

export const getBrokerById = (id: string) => {
  return BROKER_CONFIGS[id];
};