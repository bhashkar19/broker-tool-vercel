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
        "1.6 crore+ clients, India's 2nd largest broker by active users (7.4M) - high trust and liquidity",
        "Truly FREE delivery trading - zero brokerage charges forever",
        "Kite app rated #1 - most popular trading app in India",
        "Varsity educational platform - comprehensive free trading courses",
        "Among the lowest overall costs for delivery-focused investors",
        "Transparent pricing with no hidden charges"
      ],
      cons: [
        "Server crashes occasionally on high-volatility days (Budget Day, Earnings Announcements, Market Crashes)",
        "Customer support primarily chatbot-based - email responses typically take 2-3 days",
        "No phone support available - cannot call for urgent trading issues or account problems",
        "Basic research and analysis - no premium stock recommendations or expert analyst calls like full-service brokers",
        "Not ideal for very active intraday traders - ₹20 per trade charges add up quickly (100 trades = ₹2,000/day)"
      ],
      perfect_for: "Buy-and-hold delivery investors who want to learn and keep costs minimal",
      cost_summary: "Best for long-term: ₹0 delivery brokerage + ₹300 AMC annually",
      why_we_recommend: "Best overall balance of cost, features, and learning resources for most investors. Pricing as of Jan 2025."
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
        "Ratan Tata backed - strong financial stability and credibility",
        "Fast execution speed with modern platform technology",
        "Improved platform stability with regular technology updates",
        "Competitive delivery charges - ₹20 or 2.5% (whichever is lower)",
        "₹0 AMC for first year, then ₹300/year - competitive pricing",
        "Clean modern interface with advanced features"
      ],
      cons: [
        "Delivery NOT free - charges ₹20 or 2.5% (whichever is lower) per trade, while top discount brokers offer ₹0",
        "Poor customer service rated 1.3-1.7/5 with slow response times during peak trading hours",
        "App stability issues reported during extremely high-volatility sessions",
        "No unlimited monthly trading plans available unlike some competitors",
        "AMC charges ₹300/year after first year (first year free for new users)",
        "Account freeze issues reported - users locked out waiting for ticket resolution",
        "No 3-in-1 account integration with banks like full-service brokers offer"
      ],
      perfect_for: "Active intraday traders who prioritize speed and reliability over everything else",
      cost_summary: "Speed-focused: ₹20/2.5% delivery + ₹20 intraday + ₹300 AMC (free 1st year)",
      why_we_recommend: "Best execution speed and reliability - saves losses from platform crashes. Pricing as of Jan 2025."
    },
    features: [
      "Lightning-fast order execution",
      "Professional trading tools",
      "Advanced charts and technical analysis",
      "24/7 customer support"
    ],
    charges: {
      intraday_brokerage: 20,
      delivery_brokerage: 20,
      fo_brokerage: 20,
      amc_charges: 300
    },
    scoring: {
      beginners: 7,
      professionals: 9,
      cost_conscious: 6,
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
        "Professional research reports and daily stock recommendations",
        "SmartAPI - powerful API for algo trading with multi-language support",
        "Angel SpeedPro trading platform with advanced features",
        "Lower AMC than competitors - ₹240/year (free 1st year)",
        "First 30 days promotional FREE delivery (up to ₹500 waiver)",
        "AI-powered Angel Insights app for portfolio analysis"
      ],
      cons: [
        "IMPORTANT: Delivery trading NO LONGER FREE since Nov 1, 2024 - now charges ₹20 brokerage per trade",
        "Platform crashes and technical glitches during trading hours - users unable to square off positions, portfolios showing zero balance",
        "Poor customer service rated 1.13/5 with low issue resolution rates reported",
        "Delayed customer support response especially during peak trading hours when help is most urgent",
        "Margin penalty interest charged daily - 0.0342% per day on cash shortfall above ₹50,000 (for margin traders)",
        "Auto square-off penalty charges apply if positions not closed on time (for F&O traders)",
        "Peak margin shortfall interest charged even if you square off by day end (for margin traders)"
      ],
      perfect_for: "Investors who need professional research and guidance, willing to pay for quality",
      cost_summary: "Research-focused: ₹20 per trade + ₹240 AMC (delivery no longer free)",
      why_we_recommend: "Best choice if you value premium research - but know delivery now has brokerage. Pricing as of Jan 2025."
    },
    features: [
      "Professional research reports",
      "Angel SpeedPro trading platform",
      "Investment advisory services",
      "Multiple trading interfaces"
    ],
    charges: {
      intraday_brokerage: 20,
      delivery_brokerage: 20,
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
        "TradingView Premium integration included - saves separate subscription cost",
        "Best API access for algorithmic trading with multi-platform support",
        "Professional-grade options chain with advanced Greeks and analytics",
        "100+ technical indicators vs limited options on other platforms",
        "Excellent for complex options strategies and professional trading",
        "FREE delivery brokerage and lifetime zero AMC (promotional offers active)"
      ],
      cons: [
        "Steep learning curve - complex platform takes time to master effectively for beginners",
        "TradingView charts only on desktop/web - not available on mobile app",
        "Not ideal for casual traders - platform built for active professional traders"
      ],
      perfect_for: "Professional traders and algo enthusiasts who utilize advanced tools daily",
      cost_summary: "Premium tools: ₹20 per trade + ₹0 AMC (includes TradingView integration)",
      why_we_recommend: "Unmatched professional tools - but only if you'll actually use them. Pricing as of Jan 2025 - Lifetime FREE AMC promo active."
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
      amc_charges: 0
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
        "Flat ₹20 brokerage across all segments - simplified pricing",
        "Premium plans with ₹10 brokerage available (₹599-1199/month)",
        "Tiered AMC: ₹0 for holdings <₹50k (good for small investors)",
        "Among the lowest brokerage charges in the industry",
        "Simple flat-fee pricing structure - easy to calculate costs"
      ],
      cons: [
        "Standard ₹20 brokerage per trade (₹10 only with premium ₹599-1199/month subscription - adds up for active traders)",
        "Tiered AMC structure: ₹0 (<₹50k), ₹96/year (₹50k-2L), ₹300/year (>₹2L holdings) - can confuse users",
        "Customer service quality concerns reported - average support with no toll-free number",
        "Some users report occasional platform stability issues during peak market hours"
      ],
      perfect_for: "Extremely high-volume traders (100+ trades/month) prioritizing low cost",
      cost_summary: "Ultra-budget: ₹20 per trade + tiered AMC (₹0-300 based on holdings)",
      why_we_recommend: "Only if trading volume is very high - otherwise free delivery brokers better. Pricing as of Jan 2025. Premium plans offer ₹10 brokerage."
    },
    features: [
      "Lowest brokerage charges",
      "Zero AMC charges",
      "Basic mobile trading app",
      "Simple investment products"
    ],
    charges: {
      intraday_brokerage: 20,
      delivery_brokerage: 20,
      fo_brokerage: 20,
      amc_charges: 0
    },
    scoring: {
      beginners: 4,
      professionals: 4,
      cost_conscious: 9,
      speed_focused: 4,
      learning_focused: 2
    }
  },

  // 🆕 ADDITIONAL BROKERS (Validated Jan 2025)

  'groww': {
    id: 'groww',
    name: 'Groww',
    logo_url: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/groww.svg',
    affiliate_url: 'https://groww.in/stocks',
    priority: 6,
    best_for: ['beginners', 'simple_investing', 'mutual_funds', 'casual_traders'],
    real_insights: {
      pros: [
        "Extremely simple and user-friendly interface - perfect for absolute beginners",
        "Strong mutual fund and SIP platform - seamless investing experience",
        "Low delivery charges compared to traditional brokers",
        "Popular among young investors - large growing community",
        "Clean modern app design with intuitive navigation",
        "24/7 phone support available at 9108800000"
      ],
      cons: [
        "Poor customer support rated 1.8/5 on Trustpilot despite 24/7 phone availability",
        "Delivery NOT free - charges ₹20 or 0.1% (whichever lower, min ₹5) while top discount brokers offer ₹0",
        "Recurring technical glitches during peak market hours documented across 2024-2025",
        "Frequent automatic logout issues - users forced to re-login multiple times per session",
        "Order rejections without clear reasons requiring customer support contact",
        "Major technical outages in Jan 2024 - users couldn't login or see balances for hours",
        "Limited commodity trading - only 4 MCX commodities (Gold, Silver, Crude Oil, Natural Gas), no currency trading"
      ],
      perfect_for: "New investors who want simplicity and are okay with some delivery charges",
      cost_summary: "Beginner-friendly: ₹20 or 0.1% delivery (min ₹5) + ₹20 intraday + ₹0 AMC",
      why_we_recommend: "Best for absolute beginners prioritizing simplicity - but note delivery charges. Pricing updated June 2025."
    },
    features: [
      "Simple interface for beginners",
      "Mutual funds and SIP investing",
      "IPO applications",
      "Basic charting tools"
    ],
    charges: {
      intraday_brokerage: 20,
      delivery_brokerage: 20,
      fo_brokerage: 20,
      amc_charges: 0
    },
    scoring: {
      beginners: 9,
      professionals: 4,
      cost_conscious: 6,
      speed_focused: 5,
      learning_focused: 7
    }
  },

  'dhan': {
    id: 'dhan',
    name: 'Dhan',
    logo_url: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/dhan.svg',
    affiliate_url: 'https://dhan.co',
    priority: 7,
    best_for: ['cost_conscious', 'active_traders', 'options_trading', 'zero_amc'],
    real_insights: {
      pros: [
        "₹0 AMC forever - cheaper than Zerodha (₹300) and most competitors",
        "Free delivery trading like Zerodha - zero brokerage on equity delivery",
        "Excellent complaint resolution (80% vs industry avg ~35%)",
        "Only 10 complaints for 995K+ users - exceptional service quality",
        "Same competitive pricing as Zerodha (₹20 intraday/F&O)",
        "Modern platform with advanced options chain and analytics"
      ],
      cons: [
        "Advanced platform features may overwhelm absolute beginners (better suited for traders with some experience)",
        "High call & trade charges at ₹50 per order (2.5× more expensive than ₹20 at most brokers)",
        "No physical branches - account opening strictly online only, may be inconvenient for some users",
        "No research reports, stock tips, or relationship managers for portfolio guidance - self-directed trading only",
        "No insurance products available - focuses on stocks, F&O, mutual funds, and bonds only"
      ],
      perfect_for: "Cost-conscious traders who want Zerodha-level pricing with zero AMC",
      cost_summary: "Best value: ₹0 delivery + ₹20 intraday/F&O + ₹0 AMC (saves ₹300/year vs Zerodha)",
      why_we_recommend: "Hidden gem - same pricing as Zerodha but ₹0 AMC saves ₹300 annually. Founded 2021, growing rapidly. Pricing as of Jan 2025."
    },
    features: [
      "Free equity delivery trading",
      "Zero AMC charges forever",
      "Advanced options chain",
      "TradingView integration"
    ],
    charges: {
      intraday_brokerage: 20,
      delivery_brokerage: 0,
      fo_brokerage: 20,
      amc_charges: 0
    },
    scoring: {
      beginners: 7,
      professionals: 8,
      cost_conscious: 10,
      speed_focused: 7,
      learning_focused: 6
    }
  },

  'paytm_money': {
    id: 'paytm_money',
    name: 'Paytm Money',
    logo_url: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/paytm.svg',
    affiliate_url: 'https://www.paytmmoney.com/stocks',
    priority: 8,
    best_for: ['beginners', 'paytm_users', 'simple_interface'],
    real_insights: {
      pros: [
        "Seamless integration with Paytm ecosystem for easy fund transfers",
        "Clean simple interface perfect for beginners",
        "Competitive ₹20 delivery charges with ₹0 delivery promo for 15 days",
        "Zero AMC for demat account - no annual maintenance fees",
        "27 lakh+ active users - growing user base",
        "SEBI-registered and properly regulated broker"
      ],
      cons: [
        "Restricted NRI trading - no commodity (MCX) or currency trading available for NRI accounts",
        "No physical branches or call center - support only via email (feedback@paytmmoney.com) and app",
        "Customer support concerns reported - some users face challenges reaching responsive assistance",
        "Limited international investment options - primarily focuses on Indian financial instruments only",
        "Overcrowded interface - app has become cluttered with features, can overwhelm new users",
        "Delivery charges ₹20 per trade while top discount brokers offer ₹0"
      ],
      perfect_for: "Paytm users who want simple stock trading with familiar app experience",
      cost_summary: "Paytm ecosystem: ₹20 delivery + ₹20 intraday/F&O + ₹0 demat AMC, ₹300 trading AMC",
      why_we_recommend: "Good for existing Paytm users - but note limited to equity/F&O only. Pricing as of Jan 2025."
    },
    features: [
      "Paytm wallet integration",
      "Simple interface",
      "15 days free delivery promo",
      "IPO applications"
    ],
    charges: {
      intraday_brokerage: 20,
      delivery_brokerage: 20,
      fo_brokerage: 20,
      amc_charges: 300
    },
    scoring: {
      beginners: 8,
      professionals: 4,
      cost_conscious: 6,
      speed_focused: 5,
      learning_focused: 6
    }
  },

  'icici_direct': {
    id: 'icici_direct',
    name: 'ICICI Direct',
    logo_url: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/icici.svg',
    affiliate_url: 'https://www.icicidirect.com',
    priority: 14,
    best_for: ['icici_customers', 'full_service', '3in1_account'],
    real_insights: {
      pros: [
        "3-in-1 account linking savings, demat, and trading accounts",
        "ICICI Bank integration for seamless fund transfers",
        "Full-service broker with comprehensive research and advisory",
        "Multiple pricing plans available - flexibility for different traders",
        "Established brand with decades of market presence",
        "Access to IPOs, bonds, and wide range of investment products"
      ],
      cons: [
        "Poor customer satisfaction rated 2.06/5 on MouthShut with 93% complaint resolution (below industry average)",
        "Significantly expensive - 0.29% delivery brokerage (₹290 per ₹1L) while top discount brokers charge ₹0-20",
        "High AMC of ₹700/year (waived 1st year) - more than double most discount brokers",
        "Platform stability issues during high volatility - order execution problems reported",
        "Long wait times for customer support - no live chat, only phone and WhatsApp available",
        "Poor service for small traders - prioritizes high-net-worth individuals over retail investors",
        "Minimum ₹35 brokerage per trade challenging for small traders",
        "Research quality described as \"generally good, not quite at level of top global brokerages\""
      ],
      perfect_for: "Existing ICICI Bank customers who want 3-in-1 convenience despite higher costs",
      cost_summary: "Full-service premium: 0.29% delivery (₹290 per ₹1L) + ₹700 AMC - expensive vs discount brokers",
      why_we_recommend: "Only for ICICI Bank customers valuing 3-in-1 convenience - significantly more expensive than discount brokers. Pricing as of Jan 2025."
    },
    features: [
      "3-in-1 account integration",
      "Full-service research",
      "Multiple plan options",
      "Wide product range"
    ],
    charges: {
      intraday_brokerage: 29,
      delivery_brokerage: 290,
      fo_brokerage: 20,
      amc_charges: 700
    },
    scoring: {
      beginners: 5,
      professionals: 6,
      cost_conscious: 2,
      speed_focused: 5,
      learning_focused: 7
    }
  },

  'hdfc_securities': {
    id: 'hdfc_securities',
    name: 'HDFC Securities',
    logo_url: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/hdfc.svg',
    affiliate_url: 'https://www.hdfcsec.com',
    priority: 15,
    best_for: ['hdfc_customers', 'full_service', '3in1_account'],
    real_insights: {
      pros: [
        "3-in-1 account with HDFC Bank for integrated banking and trading",
        "2025 promotional pricing: ₹0 delivery brokerage and ₹20 intraday/F&O",
        "Full-service broker with comprehensive research reports",
        "Established brand with strong market reputation",
        "Multiple plan options (Standard, Value Plan subscriptions)",
        "Access to wide range of investment products and IPOs"
      ],
      cons: [
        "Platform experienced 30-40 minute outage during market hours on April 8, 2025 - users couldn't login or trade",
        "Lowest customer satisfaction among major brokers - rated 1.5/5 on MouthShut",
        "No commodity trading available - cannot trade at MCX or NCDEX exchanges",
        "High brokerage charges - significantly more expensive than discount brokers",
        "BLINK terminal is fee-based unlike competitors offering free platforms"
      ],
      perfect_for: "HDFC Bank customers willing to overlook platform issues for 3-in-1 convenience",
      cost_summary: "Promo pricing: ₹0 delivery + ₹20 intraday/F&O + ₹750 AMC (standard 0.32% delivery after promo)",
      why_we_recommend: "Caution advised - lowest customer rating (1.5/5) and April 2025 outage. Only for HDFC customers needing 3-in-1. Pricing as of Jan 2025."
    },
    features: [
      "3-in-1 HDFC Bank integration",
      "Full-service research",
      "2025 promotional pricing",
      "Multiple plan options"
    ],
    charges: {
      intraday_brokerage: 20,
      delivery_brokerage: 0,
      fo_brokerage: 20,
      amc_charges: 750
    },
    scoring: {
      beginners: 5,
      professionals: 6,
      cost_conscious: 4,
      speed_focused: 3,
      learning_focused: 7
    }
  },

  'kotak_securities': {
    id: 'kotak_securities',
    name: 'Kotak Securities',
    logo_url: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/kotak.svg',
    affiliate_url: 'https://www.kotaksecurities.com',
    priority: 16,
    best_for: ['kotak_customers', 'young_traders', 'under_30'],
    real_insights: {
      pros: [
        "Trade Free Youth plan for under 30 years - ₹0 delivery brokerage",
        "Kotak Bank integration for 3-in-1 convenience",
        "30-day free trial with ₹0 delivery charges",
        "Easy 5-minute online account opening process",
        "Competitive ₹10 or 0.05% intraday charges",
        "Multiple plan options for different trading needs"
      ],
      cons: [
        "Lowest customer satisfaction among all major brokers - rated 1.38/5 on MouthShut",
        "High delivery charges 0.20% (₹200 per ₹1L) while top discount brokers offer ₹0-20",
        "Zero Brokerage \"Trade Free Youth\" Plan ONLY available for traders aged 30 years or below",
        "Very high AMC of ₹600/year - significantly higher than most discount brokers",
        "Time-consuming account opening process - users report tedious and frustrating experience",
        "Limited leverage offered - maximum 5× intraday margin vs higher leverage at some competitors",
        "Poor customer service quality - users report issues remaining unresolved for weeks"
      ],
      perfect_for: "Traders under 30 years old with Trade Free Youth plan - otherwise very expensive",
      cost_summary: "Youth plan: ₹0 delivery (if <30 yrs) / Standard: 0.20% delivery (₹200 per ₹1L) + ₹600 AMC",
      why_we_recommend: "Only for under-30 traders (Youth plan) or Kotak Bank customers - lowest customer rating at 1.38/5. Pricing as of Jan 2025."
    },
    features: [
      "Trade Free Youth (<30 yrs)",
      "3-in-1 Kotak Bank account",
      "30-day free trial",
      "5-min online opening"
    ],
    charges: {
      intraday_brokerage: 10,
      delivery_brokerage: 200,
      fo_brokerage: 10,
      amc_charges: 600
    },
    scoring: {
      beginners: 6,
      professionals: 5,
      cost_conscious: 3,
      speed_focused: 5,
      learning_focused: 5
    }
  },

  'sharekhan': {
    id: 'sharekhan',
    name: 'Sharekhan',
    logo_url: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/sharekhan.svg',
    affiliate_url: 'https://www.sharekhan.com',
    priority: 17,
    best_for: ['full_service', 'research', 'established_brand'],
    real_insights: {
      pros: [
        "2025 promotional pricing: ₹0 delivery brokerage and ₹20 flat intraday/F&O",
        "Free AMC for first year - no maintenance charges initially",
        "Mirae Asset backing - strong financial stability",
        "Full-service broker with research and advisory",
        "Established brand with decades of market presence",
        "Multiple channels for customer support"
      ],
      cons: [
        "MAJOR ISSUE: Cannot close account online - requires branch visit with physical forms and 7-15 working days processing",
        "Account closure billing issues reported - some users continue receiving AMC charges after submitting closure requests",
        "Promotional ₹0 delivery pricing (current offer) - standard 0.30% delivery charges may apply after promotion ends",
        "Zero fee transparency - no pricing information on website, must contact customer support for cost details",
        "Limited payment options - only bank transfer available (no UPI, wallets, or digital payment methods)",
        "No 3-in-1 account available (Sharekhan is not a bank, cannot offer integrated banking)",
        "Mobile app glitches reported after updates - no biometric authentication login support"
      ],
      perfect_for: "Traders comfortable with traditional brokers and won't need to close account",
      cost_summary: "Promo: ₹0 delivery + ₹20 intraday/F&O + ₹400 AMC (free 1st year) - but difficult account closure",
      why_we_recommend: "Caution - account closure issues widespread. Only if confident you won't close account. Pricing as of Jan 2025."
    },
    features: [
      "2025 promotional pricing",
      "Full-service research",
      "Free AMC first year",
      "Mirae Asset backing"
    ],
    charges: {
      intraday_brokerage: 20,
      delivery_brokerage: 0,
      fo_brokerage: 20,
      amc_charges: 400
    },
    scoring: {
      beginners: 5,
      professionals: 6,
      cost_conscious: 6,
      speed_focused: 5,
      learning_focused: 6
    }
  },

  'sbi_securities': {
    id: 'sbi_securities',
    name: 'SBI Securities',
    logo_url: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/sbi.svg',
    affiliate_url: 'https://www.sbisecurities.in',
    priority: 9,
    best_for: ['sbi_customers', 'government_backing', 'trust'],
    real_insights: {
      pros: [
        "FREE delivery trading - ₹0 brokerage on equity delivery (competitive with discount brokers)",
        "₹0 AMC - no annual maintenance charges for demat account",
        "Government bank backing - highest trust and security",
        "SBI ecosystem integration for existing SBI customers",
        "Competitive ₹20 flat intraday and F&O charges",
        "5 million+ trusted investors - large user base"
      ],
      cons: [
        "Low customer satisfaction reported - among the lower-rated major brokers with customer service complaints",
        "High account opening fees - charges ₹850 for 3-in-1 account compared to ₹0 at discount brokers",
        "Time-consuming account opening process - takes 3-5 days with offline paperwork and documentation required",
        "No live chat support - customer service limited to phone (8:45am-5:30pm Mon-Fri) and email only",
        "Technology gap - platform features lag behind modern discount brokers in terms of innovation",
        "User interface feels outdated - documented UX issues with cumbersome transaction processes on dated interfaces"
      ],
      perfect_for: "SBI Bank customers who prioritize trust and ₹0 delivery despite app issues",
      cost_summary: "Govt-backed value: ₹0 delivery + ₹20 intraday/F&O + ₹0 AMC - best pricing but app issues",
      why_we_recommend: "Excellent pricing (₹0 delivery, ₹0 AMC) but note low rating (1.43/5) and app stability concerns. Pricing as of Jan 2025."
    },
    features: [
      "Free equity delivery",
      "Zero AMC charges",
      "Government bank backing",
      "SBI ecosystem integration"
    ],
    charges: {
      intraday_brokerage: 20,
      delivery_brokerage: 0,
      fo_brokerage: 20,
      amc_charges: 0
    },
    scoring: {
      beginners: 7,
      professionals: 5,
      cost_conscious: 9,
      speed_focused: 4,
      learning_focused: 5
    }
  },

  'motilal_oswal': {
    id: 'motilal_oswal',
    name: 'Motilal Oswal',
    logo_url: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/motilal.svg',
    affiliate_url: 'https://www.motilaloswal.com',
    priority: 13,
    best_for: ['full_service', 'research', 'advisory'],
    real_insights: {
      pros: [
        "FREE intraday trading for lifetime - significant savings for active traders",
        "Full-service broker with comprehensive research and advisory",
        "Delivery brokerage 0.20% - lower than other full-service brokers",
        "AMC ₹199/year (free 1st year) - lower than most full-service brokers",
        "Established brand with strong market research team",
        "Multiple investment products and services"
      ],
      cons: [
        "Poor customer ratings - advisors reported making false commitments and providing unsuitable product recommendations",
        "Aggressive telemarketing - persistent calls every 10 minutes even after repeated unsubscribe requests",
        "Higher delivery charges (0.20% = ₹200 per ₹1L) while top discount brokers offer ₹0-20",
        "Hidden charges not explained during account opening - complaints about unexpected fees"
      ],
      perfect_for: "Active intraday traders who can handle aggressive marketing and advisor push",
      cost_summary: "Mixed value: FREE intraday lifetime + 0.20% delivery (₹200 per ₹1L) + ₹199 AMC - but low rating 1.85/5",
      why_we_recommend: "Free intraday attractive but caution on advisor recommendations and aggressive marketing. Pricing as of Jan 2025."
    },
    features: [
      "FREE intraday lifetime",
      "Full-service research",
      "Advisory services",
      "AMC ₹199/year (free 1st year)"
    ],
    charges: {
      intraday_brokerage: 0,
      delivery_brokerage: 200,
      fo_brokerage: 20,
      amc_charges: 199
    },
    scoring: {
      beginners: 4,
      professionals: 7,
      cost_conscious: 5,
      speed_focused: 6,
      learning_focused: 7
    }
  },

  'iifl_securities': {
    id: 'iifl_securities',
    name: 'IIFL Securities',
    logo_url: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/iifl.svg',
    affiliate_url: 'https://www.indiainfoline.com',
    priority: 10,
    best_for: ['multiple_plans', 'flexibility', 'options'],
    real_insights: {
      pros: [
        "Z20 Plan offers FREE delivery trading like discount brokers",
        "Multiple pricing plans (iPrime, iInvest, iValue, Z20) - flexibility for all traders",
        "Platform rated 4.3/5 - highest among full-service brokers",
        "Low AMC ₹250 (free 1st year) - competitive with discount brokers",
        "Super Trader plan for professionals - ₹10 per lot options",
        "Strong technology platform with good reviews"
      ],
      cons: [
        "Past SEBI violations (2011-2017) - client fund misuse and account nomenclature issues (since resolved with ₹20L penalty)",
        "SEBI ban on new clients (2023) was overturned by SAT in Dec 2023 - now operating normally",
        "Higher brokerage than pure discount brokers - full-service pricing not the cheapest option",
        "Free delivery only available on Z20 plan - standard plans charge brokerage fees",
        "Customer service delays reported specifically on Z20 plan - slower than premium plan support",
        "Time-consuming offline account opening process - requires branch visits and physical paperwork",
        "Steep learning curve for beginners - advanced features can overwhelm new traders initially"
      ],
      perfect_for: "Traders wanting flexibility - choose from multiple plans based on trading style",
      cost_summary: "Flexible: Z20 plan ₹0 delivery / Super Trader 0.10% delivery + ₹250 AMC (free 1st year)",
      why_we_recommend: "Strong broker with multiple plan options and 4.3/5 rating - great for those wanting choices. Pricing as of Jan 2025."
    },
    features: [
      "Multiple pricing plans",
      "Z20 free delivery plan",
      "4.3/5 platform rating",
      "Super Trader option"
    ],
    charges: {
      intraday_brokerage: 20,
      delivery_brokerage: 0,
      fo_brokerage: 20,
      amc_charges: 250
    },
    scoring: {
      beginners: 7,
      professionals: 8,
      cost_conscious: 8,
      speed_focused: 7,
      learning_focused: 6
    }
  },

  'axis_direct': {
    id: 'axis_direct',
    name: 'Axis Direct',
    logo_url: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/axis.svg',
    affiliate_url: 'https://www.axisdirect.in',
    priority: 18,
    best_for: ['axis_customers', 'high_balance', '3in1_account'],
    real_insights: {
      pros: [
        "Trade@20 offers competitive ₹20 flat brokerage across all segments",
        "Axis Bank 3-in-1 account integration for seamless banking",
        "Competitive pricing IF ₹75,000 balance maintained",
        "Multiple plan options for different trading needs",
        "Established bank backing - trusted brand",
        "Access to wide range of investment products"
      ],
      cons: [
        "TRAP ALERT: Trade@20 plan requires ₹75,000 average quarterly balance OR ₹250/month subscription - very high barrier for small investors",
        "Automatically reverts to expensive 0.50% delivery brokerage (₹500 per ₹1L) if balance requirement not met or you miss even 1 trade per quarter",
        "High non-negotiable minimum ₹25 brokerage per trade - more expensive than ₹20 charged by most competitors",
        "Very high AMC of ₹499/year - among the most expensive in the discount broking space",
        "Terminal-based advanced platform requires paid subscription unlike free platforms offered by competitors",
        "Poor customer service quality - users report multiple unresolved complaints and regret choosing Axis",
        "Below-average complaint resolution rates reported",
        "Missing essential reports like Option Turnover Report (critical for F&O traders' tax filing)"
      ],
      perfect_for: "Axis Bank customers with ₹75,000+ balance who trade regularly every quarter",
      cost_summary: "Conditional: ₹20 flat (with ₹75k AQB) / Trap: 0.50% delivery (₹500 per ₹1L) if requirements not met",
      why_we_recommend: "CAUTION: Easy to fall into expensive 0.50% plan if ₹75k balance not maintained or miss quarterly trade. Only for Axis customers with high balance. Pricing as of Jan 2025."
    },
    features: [
      "Trade@20 plan",
      "3-in-1 Axis Bank account",
      "Multiple plan options",
      "Bank integration"
    ],
    charges: {
      intraday_brokerage: 20,
      delivery_brokerage: 500,
      fo_brokerage: 20,
      amc_charges: 499
    },
    scoring: {
      beginners: 3,
      professionals: 5,
      cost_conscious: 2,
      speed_focused: 5,
      learning_focused: 4
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
// 🤝 PARTNER BROKER IDS - Only these can be recommended
export const PARTNER_BROKER_IDS = ['zerodha', 'upstox', 'angel_one', 'fyers', '5paisa'];

// Helper function to check if broker is a partner
export const isPartnerBroker = (brokerId: string): boolean => {
  return PARTNER_BROKER_IDS.includes(brokerId);
};

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