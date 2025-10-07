// 🏦 UNIFIED BROKER CONFIGURATION - SINGLE SOURCE OF TRUTH
// All broker data consolidated: pricing, pros/cons, validation issues, features
// This replaces: brokerConfigs.ts, brokerCharges.ts, brokerValidationMessages.ts

// =====================================================
// INTERFACES
// =====================================================

export interface ChargeDetail {
  amount: number;          // Simplified amount for calculations (0, 10, 20, 200, etc.)
  formula: string;         // Full formula shown to users ("₹20 or 0.03% whichever lower")
  shortFormula?: string;   // Short version for mobile cards (max 15 chars, e.g. "₹20/0.1%")
  notes?: string;          // Additional context ("First 30 days free", "Promotional pricing")
}

export interface BrokerValidationIssue {
  issues: string[];        // List of specific issues
  impact: string;          // Impact on users
  userQuotes?: string;     // Real user complaints/feedback
}

export interface UnifiedBrokerConfig {
  // ===== BASIC INFO =====
  id: string;
  name: string;
  logo_url: string;
  affiliate_url: string;
  priority: number;        // Lower = higher priority (1 = highest)
  best_for: string[];      // Use cases: 'beginners', 'cost_conscious', 'professionals', etc.

  // ===== COMPLETE PRICING (merged from brokerCharges.ts) =====
  charges: {
    delivery: ChargeDetail;
    intraday: ChargeDetail;
    fo: ChargeDetail;       // Futures & Options
    amc: ChargeDetail;      // Annual Maintenance Charges
    demat_opening: ChargeDetail;
  };

  // ===== HIGH-LEVEL INSIGHTS (from brokerConfigs.ts) =====
  insights: {
    pros: string[];                // Key strengths
    cons: string[];                // Key weaknesses
    perfect_for: string;           // Ideal user profile
    cost_summary: string;          // Pricing summary
    why_we_recommend: string;      // Recommendation reasoning
  };

  // ===== DETAILED VALIDATION ISSUES (from brokerValidationMessages.ts) =====
  validation_issues: {
    charges: BrokerValidationIssue;
    reliability: BrokerValidationIssue;
    support: BrokerValidationIssue;
    research: BrokerValidationIssue;
    tools: BrokerValidationIssue;
    satisfied: BrokerValidationIssue;
    positive_aspects: string[];    // Balanced view - what broker does well
  };

  // ===== FEATURES & SCORING =====
  features: string[];
  scoring: {
    beginners: number;             // 1-10 rating
    professionals: number;
    cost_conscious: number;
    speed_focused: number;
    learning_focused: number;
  };
}

// =====================================================
// UNIFIED BROKER DATA - ALL 16 BROKERS
// =====================================================

export const UNIFIED_BROKER_CONFIGS: Record<string, UnifiedBrokerConfig> = {

  // ===== PARTNER BROKER 1: ZERODHA =====
  zerodha: {
    id: 'zerodha',
    name: 'Zerodha',
    logo_url: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/zerodha.svg',
    affiliate_url: 'https://zerodha.com/open-account?c=ZMPLLT',
    priority: 1,
    best_for: ['beginners', 'long_term_investing', 'learning', 'cost_conscious'],

    charges: {
      delivery: {
        amount: 0,
        formula: '₹0',
        shortFormula: '₹0',
        notes: 'FREE equity delivery - best for long-term investors'
      },
      intraday: {
        amount: 20,
        formula: '₹20 or 0.03% (whichever is lower)',
        notes: 'Per executed order'
      },
      fo: {
        amount: 20,
        formula: '₹20 or 0.03% (whichever is lower)',
        notes: 'Per executed order'
      },
      amc: {
        amount: 300,
        formula: '₹300/year',
        notes: 'Annual maintenance charges'
      },
      demat_opening: {
        amount: 0,
        formula: '₹0',
        notes: 'FREE account opening'
      }
    },

    insights: {
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

    validation_issues: {
      charges: {
        issues: [
          "₹20 intraday adds up for frequent traders (₹400/day = ₹8,000/month)",
          "₹300 AMC per account (multiple accounts = ₹600-900)",
          "DP charges on selling (₹13.5 per scrip, standard but still cost)"
        ],
        impact: "Costs matter for high-volume daily trading",
        userQuotes: "Active traders report: '₹20 per trade feels low until you do 50 trades/day'"
      },
      reliability: {
        issues: [
          "Platform crashes during Budget/Election days (Feb 1, 2024 Kite down 2+ hours)",
          "Weekend maintenance blocks Monday market preparation",
          "Server load issues during high volatility (documented NSE)"
        ],
        impact: "Can't trade when market moves fast - critical for active traders",
        userQuotes: "Users on Reddit: 'Budget day 2024, Kite frozen, missed my trades'"
      },
      support: {
        issues: [
          "Ticket-based support only (24-48 hour response time)",
          "No phone support during trading hours (no instant help)",
          "Community forums ≠ dedicated assistance (DIY approach)"
        ],
        impact: "Urgent trading issues take days to resolve",
        userQuotes: "Forum posts: 'Ticket #12345 pending 3 days, money stuck'"
      },
      research: {
        issues: [
          "No stock recommendations or market tips (education-focused)",
          "Advisory approach: Learn yourself, no hand-holding",
          "Must do your own research (time-consuming for beginners)"
        ],
        impact: "DIY model not suitable for those wanting guidance",
        userQuotes: "Beginners say: 'Varsity is great but WHO do I buy?'"
      },
      tools: {
        issues: [
          "Basic charting compared to professional platforms (TradingView level)",
          "No advanced order types (bracket, cover orders limited)",
          "Limited API capabilities compared to competitors"
        ],
        impact: "Professional traders need more sophisticated tools",
        userQuotes: "Pro traders: 'Good for basics, not for serious technical analysis'"
      },
      satisfied: {
        issues: [
          "Platform stability during volatile days can be improved",
          "Support response time could be faster for urgent issues"
        ],
        impact: "Even satisfied users face occasional limitations",
        userQuotes: "Overall happy but: 'Wish support was quicker during emergencies'"
      },
      positive_aspects: [
        "Industry-leading educational content through Zerodha Varsity",
        "Transparent, honest pricing with no hidden charges",
        "Largest user base in India (1.6 Cr+) with proven track record",
        "Zero brokerage for delivery trades (best for long-term investors)",
        "Strong technology foundation despite occasional high-volume issues"
      ]
    },

    features: [
      "Free equity delivery trading",
      "Advanced TradingView charts",
      "Kite mobile app (most popular)",
      "Console web platform",
      "Varsity educational platform"
    ],

    scoring: {
      beginners: 9,
      professionals: 6,
      cost_conscious: 8,
      speed_focused: 5,
      learning_focused: 9
    }
  },

  // ===== PARTNER BROKER 2: UPSTOX =====
  upstox: {
    id: 'upstox',
    name: 'Upstox',
    logo_url: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/upstox.svg',
    affiliate_url: 'https://upstox.com/open-account/?f=E3MQ',
    priority: 2,
    best_for: ['day_trading', 'speed_execution', 'active_traders', 'professionals'],

    charges: {
      delivery: {
        amount: 20,
        formula: '₹20 or 2.5% (whichever lower)',
        shortFormula: '₹20/2.5%',
        notes: 'Per order or SEBI limit - verified Jan 2025'
      },
      intraday: {
        amount: 20,
        formula: '₹20 or 0.05% (whichever lower)',
        notes: 'Per executed order'
      },
      fo: {
        amount: 20,
        formula: '₹20 or 0.05% (whichever lower)',
        notes: 'Per executed order'
      },
      amc: {
        amount: 300,
        formula: '₹300/year (FREE 1st year)',
        notes: 'Free for first year, then ₹300 annually'
      },
      demat_opening: {
        amount: 0,
        formula: '₹0',
        notes: 'FREE account opening'
      }
    },

    insights: {
      pros: [
        "Ratan Tata backed - strong financial stability and credibility",
        "Fast execution speed with modern platform technology",
        "Improved platform stability with regular technology updates",
        "Competitive delivery charges - ₹20 or 2.5% (whichever lower)",
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

    validation_issues: {
      charges: {
        issues: [
          "₹20/trade same as competitors but fewer value-added services",
          "No free educational content like Zerodha Varsity",
          "DP charges and other fees similar to competitors"
        ],
        impact: "Same price, less value compared to others",
        userQuotes: "Users compare: 'Same ₹20 but Zerodha has free courses'"
      },
      reliability: {
        issues: [
          "Smaller user base means less stress-tested infrastructure",
          "Occasional technical glitches during platform updates",
          "Fewer offline branches for those preferring in-person support"
        ],
        impact: "Infrastructure reliability matters for peace of mind",
        userQuotes: "Some users: 'App works fine until it doesn't - then no quick fix'"
      },
      support: {
        issues: [
          "Poor customer service with long response times (documented complaints)",
          "Support asks to 'record video and send' for issues (time-consuming)",
          "No 24/7 support, limited hours vs 24/7 market needs"
        ],
        impact: "Critical trading issues can go unresolved for days",
        userQuotes: "Complaint forums: 'Support useless, takes forever to respond'"
      },
      research: {
        issues: [
          "Limited educational content and research compared to Zerodha/Angel One",
          "No stock recommendations or market insights",
          "Smaller community means fewer online resources and tips"
        ],
        impact: "DIY without the educational support",
        userQuotes: "Users miss: 'No learning resources like Zerodha Varsity'"
      },
      tools: {
        issues: [
          "No API access for algorithmic trading (vs Fyers which has it)",
          "Complicated UI/UX compared to simpler platforms",
          "Learning curve for users switching from other platforms"
        ],
        impact: "Interface differences require adjustment period",
        userQuotes: "Switchers say: 'Had to relearn everything, interface is different'"
      },
      satisfied: {
        issues: [
          "Policies can change without adequate notice (user complaints)",
          "Platform updates sometimes break familiar workflows"
        ],
        impact: "Unexpected changes disrupt trading routine",
        userQuotes: "Long-time users: 'Policies changed overnight, caught off-guard'"
      },
      positive_aspects: [
        "Fast execution speed with modern technology platform",
        "Competitive pricing similar to other discount brokers",
        "Good mobile app with clean, modern interface",
        "Growing user base with improving services",
        "Focus on technology and speed for active traders"
      ]
    },

    features: [
      "Lightning-fast order execution",
      "Professional trading tools",
      "Advanced charts and technical analysis",
      "24/7 customer support"
    ],

    scoring: {
      beginners: 7,
      professionals: 9,
      cost_conscious: 6,
      speed_focused: 9,
      learning_focused: 5
    }
  },

  // ===== PARTNER BROKER 3: ANGEL ONE =====
  angel_one: {
    id: 'angel_one',
    name: 'Angel One',
    logo_url: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/angelone.png',
    affiliate_url: 'https://angelone.in/signup/register/?rne_source=B2B_NXT&btype=SVRQUg&referrer=MAQT::rne_source=B2B_NXT::btype=SVRQUg',
    priority: 3,
    best_for: ['research_advisory', 'guided_investing', 'recommendations', 'support_focused'],

    charges: {
      delivery: {
        amount: 20,
        formula: '₹20 or 0.1% (whichever is lower)',
        shortFormula: '₹20/0.1%',
        notes: 'Delivery NO LONGER FREE since Nov 1, 2024. First 30 days promotional pricing only'
      },
      intraday: {
        amount: 20,
        formula: '₹20 or 0.03% (whichever is lower)',
        notes: 'Per executed order'
      },
      fo: {
        amount: 20,
        formula: '₹20 flat per order',
        notes: 'Flat fee for F&O trades'
      },
      amc: {
        amount: 240,
        formula: '₹0 (1st year), ₹240/year (from 2nd year)',
        notes: 'Lower AMC than competitors - free first year'
      },
      demat_opening: {
        amount: 0,
        formula: '₹0',
        notes: 'FREE account opening'
      }
    },

    insights: {
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

    validation_issues: {
      charges: {
        issues: [
          "Hidden advisory fees ₹500-999/month NOT disclosed upfront (₹6K-12K/year)",
          "Higher delivery brokerage ₹10-20 vs ₹0 at discount brokers",
          "Complex pricing = surprise bills at month-end (multiple fee structures)"
        ],
        impact: "Users report shock when seeing first bill",
        userQuotes: "Complaint forums: 'Charged ₹7,000 on 31 trades, expected ₹20/trade'"
      },
      reliability: {
        issues: [
          "Legacy platform technology vs newer, faster trading apps",
          "Occasional slowdowns during peak market hours",
          "Platform complexity can cause execution delays"
        ],
        impact: "Speed matters in volatile markets",
        userQuotes: "Users report: 'Platform feels slow compared to modern apps'"
      },
      support: {
        issues: [
          "Advisory-focused approach may feel pushy for self-directed traders",
          "Relationship manager quality varies (not all are helpful)",
          "Upselling of premium services during support calls"
        ],
        impact: "Some users want help, not sales pitches",
        userQuotes: "Complaints: 'Called for support, got sales pitch instead'"
      },
      research: {
        issues: [
          "Research recommendations may not align with personal investment style",
          "Advisory service fees required for full research access",
          "Tips can be generic, not personalized to individual goals"
        ],
        impact: "Paid research ≠ always valuable for everyone",
        userQuotes: "Users say: 'Research reports don't match my risk appetite'"
      },
      tools: {
        issues: [
          "Platform can feel overwhelming for beginners (too many features)",
          "Interface not as clean as modern discount brokers",
          "Multiple fee structures make cost calculation complex"
        ],
        impact: "Complexity discourages simple buy-hold investors",
        userQuotes: "Beginners: 'Too complicated, just want to buy stocks'"
      },
      satisfied: {
        issues: [
          "Full-service approach not needed by experienced self-directed traders",
          "Higher costs than pure discount brokers for basic trading"
        ],
        impact: "Paying for services you might not use",
        userQuotes: "Experienced traders: 'Don't need advisory, just want low cost'"
      },
      positive_aspects: [
        "Professional research team with regular stock recommendations",
        "Human customer support and relationship managers",
        "Comprehensive advisory services for guided investing",
        "Established full-service broker with long market presence",
        "Good for users who want hand-holding and advice"
      ]
    },

    features: [
      "Professional research reports",
      "Angel SpeedPro trading platform",
      "Investment advisory services",
      "Multiple trading interfaces"
    ],

    scoring: {
      beginners: 6,
      professionals: 8,
      cost_conscious: 5,
      speed_focused: 7,
      learning_focused: 8
    }
  },

  // ===== PARTNER BROKER 4: FYERS =====
  fyers: {
    id: 'fyers',
    name: 'Fyers',
    logo_url: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/fyers.svg',
    affiliate_url: 'https://signup.fyers.in/?utm-source=AP-Leads&utm-medium=AP0225',
    priority: 4,
    best_for: ['advanced_tools', 'algo_trading', 'professional_traders', 'technical_analysis'],

    charges: {
      delivery: {
        amount: 0,
        formula: '₹0 (promotional FREE delivery)',
        shortFormula: '₹0 (promo)',
        notes: 'FREE delivery brokerage - promotional offer active. Verify current offer before opening'
      },
      intraday: {
        amount: 20,
        formula: '₹20 or 0.03% (whichever is lower)',
        notes: 'Per executed order'
      },
      fo: {
        amount: 20,
        formula: '₹20 or 0.03% (whichever is lower)',
        notes: 'Per executed order'
      },
      amc: {
        amount: 0,
        formula: "₹0 (promotional 'Free for Life')",
        notes: 'Lifetime FREE AMC - promotional offer active. Verify current offer before opening'
      },
      demat_opening: {
        amount: 0,
        formula: '₹0',
        notes: 'FREE account opening'
      }
    },

    insights: {
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

    validation_issues: {
      charges: {
        issues: [
          "Higher exchange transaction charges than other discount brokers",
          "Research reports are PAID (₹500+ monthly vs free at Zerodha)",
          "Total cost higher than pure discount brokers for regular traders"
        ],
        impact: "Pro tools come at a price - not for everyone",
        userQuotes: "Users compare: 'Better tools but ₹200 more per month adds up'"
      },
      reliability: {
        issues: [
          "Smaller user base (less proven at scale vs Zerodha's 1.6Cr)",
          "11% of complaints unresolved (89% resolution rate per data)",
          "Newer platform means less battle-tested infrastructure"
        ],
        impact: "Scale and track record matter for reliability",
        userQuotes: "Some hesitate: 'Prefer larger, more established platforms'"
      },
      support: {
        issues: [
          "Support focused on technical/platform issues, less hand-holding",
          "Smaller support team vs larger brokers",
          "Limited offline presence for in-person assistance"
        ],
        impact: "Professional platform assumes you know what you're doing",
        userQuotes: "Beginners struggle: 'Assumed I knew advanced features'"
      },
      research: {
        issues: [
          "No free research reports (₹500+ for premium research)",
          "No beginner education like Zerodha Varsity",
          "Platform assumes users are experienced, no basic guides"
        ],
        impact: "Not suitable for those needing learning resources",
        userQuotes: "Learners miss: 'No tutorials, expected to know everything'"
      },
      tools: {
        issues: [
          "Advanced tools can overwhelm non-professional traders",
          "Steep learning curve for API and algo trading features",
          "Too complex for simple buy-hold investors"
        ],
        impact: "Power tools = complexity not everyone needs",
        userQuotes: "Casual traders: 'Too many features I'll never use'"
      },
      satisfied: {
        issues: [
          "Higher costs justified only for professional traders using advanced features",
          "Overkill for simple trading needs"
        ],
        impact: "Paying for pro tools when basics would suffice",
        userQuotes: "Regular users: 'Don't need all this, just want simple trading'"
      },
      positive_aspects: [
        "Most advanced trading and charting tools in the market",
        "Excellent for professional and technical analysis-focused traders",
        "API access for algorithmic trading and automation",
        "High-quality execution and professional-grade infrastructure",
        "Options strategy builder and advanced derivatives tools"
      ]
    },

    features: [
      "Advanced trading and charting tools",
      "Professional technical analysis",
      "API access for algorithmic trading",
      "Options strategy builder"
    ],

    scoring: {
      beginners: 3,
      professionals: 9,
      cost_conscious: 4,
      speed_focused: 8,
      learning_focused: 4
    }
  },

  // ===== PARTNER BROKER 5: 5PAISA =====
  '5paisa': {
    id: '5paisa',
    name: '5paisa',
    logo_url: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/5paisa.svg',
    affiliate_url: 'https://www.5paisa.com/demat-account?ReferralCode=56765996&ReturnUrl=invest-open-account',
    priority: 5,
    best_for: ['cost_conscious', 'high_volume_trading', 'budget_focused'],

    charges: {
      delivery: {
        amount: 20,
        formula: '₹20 flat (standard plan) or ₹10 (premium ₹599-1199/mo)',
        shortFormula: '₹20 or ₹10*',
        notes: 'Standard: ₹20 flat. Premium plans with ₹10 brokerage require monthly subscription'
      },
      intraday: {
        amount: 20,
        formula: '₹20 flat (standard plan) or ₹10 (premium ₹599-1199/mo)',
        notes: 'Per executed order'
      },
      fo: {
        amount: 20,
        formula: '₹20 flat (standard plan) or ₹10 (premium ₹599-1199/mo)',
        notes: 'Per executed order'
      },
      amc: {
        amount: 0,
        formula: '₹0 (BSDA < ₹4L), ₹100/yr (₹4-10L), ₹300/yr (> ₹10L)',
        notes: 'Tiered AMC structure based on holdings'
      },
      demat_opening: {
        amount: 0,
        formula: '₹0',
        notes: 'FREE account opening'
      }
    },

    insights: {
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

    validation_issues: {
      charges: {
        issues: [
          "₹10/trade is low but occasional hidden charges surprise users",
          "Late payment charges despite healthy cash balance (user complaints)",
          "Total cost can be similar to ₹20 brokers after all fees"
        ],
        impact: "Ultra-low pricing sometimes comes with fine print",
        userQuotes: "Users surprised: 'Charged ₹500 penalty despite having balance'"
      },
      reliability: {
        issues: [
          "Platform freezes on F&O expiry days (users couldn't login - documented)",
          "Technical issues during high market volatility (peak hour failures)",
          "Stability concerns during crucial trading periods"
        ],
        impact: "Options traders lost money due to expiry day crashes",
        userQuotes: "Complaint forums: 'Nifty expiry day, app frozen, couldn't exit'"
      },
      support: {
        issues: [
          "Customer helpline always busy (can't reach when needed)",
          "Account closure takes 4+ months with no response to emails",
          "Support quality lower compared to premium brokers"
        ],
        impact: "Critical issues go unresolved for extended periods",
        userQuotes: "Frustrated users: 'Helpline busy for 30 minutes, gave up'"
      },
      research: {
        issues: [
          "Minimal educational content compared to Zerodha",
          "No stock recommendations or research reports",
          "Basic platform with no value-added services"
        ],
        impact: "Ultra-budget = bare-bones service",
        userQuotes: "Users expect: 'At ₹10/trade, you get what you pay for'"
      },
      tools: {
        issues: [
          "Basic platform with limited charting capabilities",
          "No advanced order types or professional features",
          "Multiple platforms (web, mobile, desktop) but all basic"
        ],
        impact: "Low cost = basic tools, not for serious traders",
        userQuotes: "Active traders: 'Cheap but lacks tools I need daily'"
      },
      satisfied: {
        issues: [
          "Withdrawal rejections despite sufficient balance (documented complaints)",
          "Platform stability concerns during critical moments"
        ],
        impact: "Even satisfied users face occasional serious issues",
        userQuotes: "Generally happy but: 'Withdrawal blocked randomly, stressful'"
      },
      positive_aspects: [
        "Lowest intraday brokerage charges in the market (₹10 per trade)",
        "Zero AMC charges - no annual maintenance fees",
        "Good for high-volume traders focused purely on cost savings",
        "Simple, straightforward pricing without complex fee structures",
        "Suitable for traders who prioritize cost over features"
      ]
    },

    features: [
      "Lowest brokerage charges",
      "Zero AMC charges",
      "Basic mobile trading app",
      "Simple investment products"
    ],

    scoring: {
      beginners: 4,
      professionals: 4,
      cost_conscious: 9,
      speed_focused: 4,
      learning_focused: 2
    }
  },

  // ===== NON-PARTNER BROKER 1: GROWW =====
  groww: {
    id: 'groww',
    name: 'Groww',
    logo_url: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/groww.svg',
    affiliate_url: 'https://groww.in/stocks',
    priority: 6,
    best_for: ['beginners', 'simple_investing', 'mutual_funds', 'casual_traders'],

    charges: {
      delivery: {
        amount: 20,
        formula: '₹20 or 0.1% (whichever is lower, min ₹5)',
        notes: 'Good for beginners - simple UI, zero AMC. Pricing verified January 2025'
      },
      intraday: {
        amount: 20,
        formula: '₹20 or 0.1% (whichever is lower)',
        notes: 'Per executed order'
      },
      fo: {
        amount: 20,
        formula: '₹20 flat per order',
        notes: 'Flat fee for F&O trades'
      },
      amc: {
        amount: 0,
        formula: '₹0 (Free)',
        notes: 'No annual maintenance charges'
      },
      demat_opening: {
        amount: 0,
        formula: '₹0',
        notes: 'FREE account opening'
      }
    },

    insights: {
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

    validation_issues: {
      charges: {
        issues: [
          "₹20/trade for all segments (no ₹0 delivery like Zerodha)",
          "Charges apply to both delivery and intraday uniformly",
          "No cost advantage over other discount brokers"
        ],
        impact: "Same pricing but fewer features than competitors",
        userQuotes: "Users note: 'Same cost as Zerodha but no Varsity education'"
      },
      reliability: {
        issues: [
          "May 12, 2025: Complete app crash during volatile market (documented, users lost money)",
          "SEBI penalty ₹48 lakh for ledger errors & AML issues (Jan 2025)",
          "Users couldn't exit positions during volatility - forced holding"
        ],
        impact: "Money stuck when you need to act - critical trading failure",
        userQuotes: "Trending complaint: 'May 12 crash, couldn't sell, lost ₹15,000'"
      },
      support: {
        issues: [
          "Customer support delays: 24-72 hours per reply (documented)",
          "Helpline doesn't answer during critical trading situations",
          "24-hour delay for EACH reply = 72+ hours for resolution"
        ],
        impact: "No help when you need it most - support is useless in emergencies",
        userQuotes: "Frustrated users: 'Support replied after 3 days, issue already cost money'"
      },
      research: {
        issues: [
          "Limited educational resources compared to Zerodha Varsity",
          "No stock recommendations or research reports",
          "Good for mutual funds, but stock trading lacks guidance"
        ],
        impact: "Minimal learning support for stock traders",
        userQuotes: "Beginners: 'Great for SIP, but lost for stock picking'"
      },
      tools: {
        issues: [
          "Basic platform focused on simplicity over advanced features",
          "No professional charting or technical analysis tools",
          "App-first design limits desktop power users"
        ],
        impact: "Too simple for serious technical traders",
        userQuotes: "Technical traders: 'Interface is nice but lacks depth'"
      },
      satisfied: {
        issues: [
          "False data display (Upper Circuit values wrong - users lost money)",
          "Unable to start new SIPs for 15+ days (technical issues)"
        ],
        impact: "Even when satisfied, reliability issues cause problems",
        userQuotes: "Generally happy but: 'Data glitches make me nervous about accuracy'"
      },
      positive_aspects: [
        "Excellent mutual fund platform with large fund selection",
        "Clean, modern interface focused on simplicity",
        "Good for beginners starting with SIPs and basic investing",
        "Fast account opening process",
        "Growing user base with improving features"
      ]
    },

    features: [
      "Simple interface for beginners",
      "Mutual funds and SIP investing",
      "IPO applications",
      "Basic charting tools"
    ],

    scoring: {
      beginners: 9,
      professionals: 4,
      cost_conscious: 6,
      speed_focused: 5,
      learning_focused: 7
    }
  },

  // ===== NON-PARTNER BROKER 2: DHAN =====
  dhan: {
    id: 'dhan',
    name: 'Dhan',
    logo_url: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/dhan.svg',
    affiliate_url: 'https://dhan.co',
    priority: 7,
    best_for: ['cost_conscious', 'active_traders', 'options_trading', 'zero_amc'],

    charges: {
      delivery: {
        amount: 0,
        formula: '₹0',
        notes: 'FREE equity delivery - zero brokerage like Zerodha'
      },
      intraday: {
        amount: 20,
        formula: '₹20 or 0.03% (whichever is lower)',
        notes: 'Per executed order'
      },
      fo: {
        amount: 20,
        formula: '₹20 or 0.03% (whichever is lower)',
        notes: 'Per executed order'
      },
      amc: {
        amount: 0,
        formula: '₹0',
        notes: 'Zero AMC forever - cheaper than Zerodha'
      },
      demat_opening: {
        amount: 0,
        formula: '₹0',
        notes: 'FREE account opening'
      }
    },

    insights: {
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

    validation_issues: {
      charges: {
        issues: [
          "₹20/trade competitive but no unique cost advantage",
          "Newer broker means fewer proven cost optimizations",
          "Similar pricing to established players without track record"
        ],
        impact: "Same cost as competitors but less proven",
        userQuotes: "Users compare: 'Why pay same as Zerodha with less features?'"
      },
      reliability: {
        issues: [
          "Relatively new (trust concerns for some conservative traders)",
          "Smaller user base = less stress-tested at scale",
          "Limited track record during major market events"
        ],
        impact: "Newness creates uncertainty about crisis handling",
        userQuotes: "Cautious users: 'Prefer brokers proven during crashes'"
      },
      support: {
        issues: [
          "Smaller support team vs established brokers",
          "Growing pains as user base expands",
          "Limited offline presence for in-person support"
        ],
        impact: "Support infrastructure still scaling up",
        userQuotes: "Users note: 'Support is good now but will it scale?'"
      },
      research: {
        issues: [
          "Limited educational content vs Zerodha Varsity",
          "No comprehensive learning platform for beginners",
          "Newer broker means less educational material accumulated"
        ],
        impact: "Learners miss structured education resources",
        userQuotes: "Beginners: 'No learning resources, have to go elsewhere'"
      },
      tools: {
        issues: [
          "Modern platform but still building feature set",
          "Some advanced features missing vs mature competitors",
          "Fewer third-party integrations than established brokers"
        ],
        impact: "Good basics but evolving feature set",
        userQuotes: "Power users: 'Missing some features I need, waiting for updates'"
      },
      satisfied: {
        issues: [
          "Smaller community means fewer online resources/discussions",
          "Less content about using platform vs popular brokers"
        ],
        impact: "Limited peer support and community knowledge",
        userQuotes: "Users: 'Hard to find help online, small community'"
      },
      positive_aspects: [
        "Modern, fast platform with clean interface",
        "Options trading focused features",
        "Competitive pricing at ₹20/trade",
        "Growing feature set with regular updates",
        "Good for traders wanting newer technology"
      ]
    },

    features: [
      "Free equity delivery trading",
      "Zero AMC charges forever",
      "Advanced options chain",
      "TradingView integration"
    ],

    scoring: {
      beginners: 7,
      professionals: 8,
      cost_conscious: 10,
      speed_focused: 7,
      learning_focused: 6
    }
  },

  // ===== NON-PARTNER BROKER 3: PAYTM MONEY =====
  paytm_money: {
    id: 'paytm_money',
    name: 'Paytm Money',
    logo_url: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/paytm.svg',
    affiliate_url: 'https://www.paytmmoney.com/stocks',
    priority: 8,
    best_for: ['beginners', 'paytm_users', 'simple_interface'],

    charges: {
      delivery: {
        amount: 20,
        formula: '₹20 or 2.5% (whichever is lower)',
        notes: 'First 15 days free brokerage offer'
      },
      intraday: {
        amount: 20,
        formula: '₹20 or 0.05% (whichever is lower)',
        notes: 'Per executed order'
      },
      fo: {
        amount: 20,
        formula: '₹20 flat per order',
        notes: 'Flat fee for F&O trades'
      },
      amc: {
        amount: 300,
        formula: '₹0 (Free demat AMC), ₹300 trading AMC',
        notes: 'Zero demat AMC, ₹300 trading AMC'
      },
      demat_opening: {
        amount: 200,
        formula: '₹200 (KYC charges)',
        notes: 'KYC charges apply'
      }
    },

    insights: {
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

    validation_issues: {
      charges: {
        issues: [
          "Brokerage competitive but Paytm ecosystem lock-in concerns",
          "Limited to specific segments initially (no F&O for some time)",
          "Pricing tied to Paytm wallet/ecosystem (dependency)"
        ],
        impact: "Must use Paytm ecosystem for full benefits",
        userQuotes: "Users note: 'Good if you use Paytm, otherwise no advantage'"
      },
      reliability: {
        issues: [
          "Fintech company, not dedicated brokerage (divided focus)",
          "Smaller presence in stock trading vs payments focus",
          "Platform stability less proven than dedicated brokers"
        ],
        impact: "Trading is side business, not core focus",
        userQuotes: "Traders cautious: 'Paytm is payments company, stocks are sideline'"
      },
      support: {
        issues: [
          "Support team smaller vs dedicated brokerage firms",
          "Paytm app support different from trading support (confusion)",
          "Trading queries mixed with general Paytm support (slower)"
        ],
        impact: "Support not specialized for trading issues",
        userQuotes: "Users frustrated: 'Support doesn't understand trading questions'"
      },
      research: {
        issues: [
          "No educational resources for learning trading",
          "No stock recommendations or market insights",
          "Focus on mutual funds, limited stock trading guidance"
        ],
        impact: "Good for MF investing, weak for stock trading",
        userQuotes: "Stock traders: 'Paytm is for SIP, not serious stock trading'"
      },
      tools: {
        issues: [
          "Limited to stocks/MF initially (no F&O, commodities)",
          "Fewer advanced trading features vs dedicated platforms",
          "Paytm app ecosystem can feel cluttered (not trading-focused)"
        ],
        impact: "Basic trading, not comprehensive platform",
        userQuotes: "Advanced traders: 'Missing F&O and tools I need daily'"
      },
      satisfied: {
        issues: [
          "Ecosystem lock-in (must use Paytm services for benefits)",
          "Trading features secondary to fintech offerings"
        ],
        impact: "Good for Paytm users only, not standalone appeal",
        userQuotes: "Non-Paytm users: 'No reason to choose over Zerodha/Upstox'"
      },
      positive_aspects: [
        "Integrated with Paytm wallet for seamless money transfer",
        "Good for existing Paytm ecosystem users",
        "Simple interface focused on mutual funds and basic stocks",
        "Easy account opening for Paytm users",
        "Suitable for beginners starting with small investments"
      ]
    },

    features: [
      "Paytm wallet integration",
      "Simple interface",
      "15 days free delivery promo",
      "IPO applications"
    ],

    scoring: {
      beginners: 8,
      professionals: 4,
      cost_conscious: 6,
      speed_focused: 5,
      learning_focused: 6
    }
  },

  // ===== NON-PARTNER BROKER 4: ICICI DIRECT =====
  icici_direct: {
    id: 'icici_direct',
    name: 'ICICI Direct',
    logo_url: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/icici.svg',
    affiliate_url: 'https://www.icicidirect.com',
    priority: 14,
    best_for: ['icici_customers', 'full_service', '3in1_account'],

    charges: {
      delivery: {
        amount: 290,
        formula: '0.29-0.50% (varies by plan)',
        notes: 'Multiple plans: MoneySaver (0.29%), iValue (₹20 flat), Prime (tiered). 3-in-1 account'
      },
      intraday: {
        amount: 29,
        formula: '0.029-0.05% or ₹20 (iValue plan)',
        notes: 'Per executed order - varies by plan'
      },
      fo: {
        amount: 20,
        formula: '0.029-0.05% or ₹20 (iValue plan)',
        notes: 'Per executed order - varies by plan'
      },
      amc: {
        amount: 700,
        formula: '₹300-700/year (plan dependent)',
        notes: 'High AMC - waived 1st year'
      },
      demat_opening: {
        amount: 0,
        formula: '₹0',
        notes: 'FREE account opening'
      }
    },

    insights: {
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

    validation_issues: {
      charges: {
        issues: [
          "0.5% brokerage = ₹500 per ₹1L trade (25x more than discount brokers)",
          "Annual AMC ₹500-1000 vs ₹300 at Zerodha",
          "Hidden charges: DP fees, call & trade charges, account maintenance"
        ],
        impact: "₹50,000-1,20,000 annual cost for active traders vs ₹300-5,000 at discount brokers",
        userQuotes: "Switchers saved: 'Moved to Zerodha, saving ₹80,000/year!'"
      },
      reliability: {
        issues: [
          "Legacy platform with old technology (slow vs modern apps)",
          "Execution delays compared to discount broker speeds",
          "Complex interface built for traditional desktop trading"
        ],
        impact: "Old tech = slower execution = missed opportunities",
        userQuotes: "Users complain: 'Platform feels like using Windows XP'"
      },
      support: {
        issues: [
          "Relationship manager quality varies (not all are knowledgeable)",
          "Branch visits required for many tasks (time-consuming)",
          "Support tied to banking relationship (not always helpful)"
        ],
        impact: "Full-service promise doesn't always deliver value",
        userQuotes: "Some say: 'RM doesn't know stocks, just pushes bank products'"
      },
      research: {
        issues: [
          "Research reports available but often generic, not personalized",
          "Advisory focused on bank's product sales, not your goals",
          "Recommendations favor bank's IPO/bond distribution"
        ],
        impact: "Research quality questionable - conflict of interest",
        userQuotes: "Experienced traders: 'Tips are bank's inventory clearance'"
      },
      tools: {
        issues: [
          "Old platform interface, not intuitive for new traders",
          "Complex navigation compared to simple modern apps",
          "Desktop-focused, mobile app is secondary"
        ],
        impact: "Steep learning curve, discourages active trading",
        userQuotes: "New users: 'Took weeks to understand how to place simple order'"
      },
      satisfied: {
        issues: [
          "Account opening takes days/weeks vs instant at discount brokers",
          "Lots of paperwork and documentation required"
        ],
        impact: "Slow onboarding vs modern instant account opening",
        userQuotes: "Switchers: 'ICICI took 10 days, Zerodha took 10 minutes'"
      },
      positive_aspects: [
        "Bank-backed security and trust from established ICICI brand",
        "3-in-1 account linking bank, demat, and trading",
        "Extensive branch network for offline support",
        "Relationship manager for high-value clients",
        "Comprehensive financial services under one roof"
      ]
    },

    features: [
      "3-in-1 account integration",
      "Full-service research",
      "Multiple plan options",
      "Wide product range"
    ],

    scoring: {
      beginners: 5,
      professionals: 6,
      cost_conscious: 2,
      speed_focused: 5,
      learning_focused: 7
    }
  },

  // ===== NON-PARTNER BROKER 5: HDFC SECURITIES =====
  hdfc_securities: {
    id: 'hdfc_securities',
    name: 'HDFC Securities',
    logo_url: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/hdfc.svg',
    affiliate_url: 'https://www.hdfcsec.com',
    priority: 15,
    best_for: ['hdfc_customers', 'full_service', '3in1_account'],

    charges: {
      delivery: {
        amount: 0,
        formula: '₹0 (current promo) or 0.10-0.32% (varies by plan)',
        notes: '2025 offer: Free delivery + ₹20 F&O. Value plans available ₹199-₹5,999/year'
      },
      intraday: {
        amount: 20,
        formula: '₹20 (promo) or 0.010-0.032% (varies by plan)',
        notes: 'Promotional pricing active in 2025'
      },
      fo: {
        amount: 20,
        formula: '₹20 (promo) or per plan rates',
        notes: 'Promotional pricing active in 2025'
      },
      amc: {
        amount: 750,
        formula: '₹750/year',
        notes: 'Annual maintenance charges'
      },
      demat_opening: {
        amount: 999,
        formula: '₹999 one-time',
        notes: 'One-time account opening charges'
      }
    },

    insights: {
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

    validation_issues: {
      charges: {
        issues: [
          "0.5% delivery, 0.05% intraday = extremely expensive for active traders",
          "High AMC ₹750-999/year vs ₹300 at discount brokers",
          "Multiple hidden charges add up quickly"
        ],
        impact: "100x more expensive than discount brokers for frequent trading",
        userQuotes: "Active traders: 'Monthly bill ₹30,000 vs ₹1,500 at Zerodha'"
      },
      reliability: {
        issues: [
          "Legacy technology platform (built in 2000s, not modernized)",
          "Slow execution speeds compared to new-age brokers",
          "Platform downtime during updates affects trading"
        ],
        impact: "Old infrastructure can't match modern broker speeds",
        userQuotes: "Users frustrated: 'Order takes 5-10 seconds vs instant at Upstox'"
      },
      support: {
        issues: [
          "Relationship managers prioritize high-value clients (HNI)",
          "Regular traders get generic support, not personalized",
          "Branch dependency for issues vs instant online resolution"
        ],
        impact: "Full-service only for wealthy clients, others left out",
        userQuotes: "Regular traders: 'RM only calls if I have ₹50L+ portfolio'"
      },
      research: {
        issues: [
          "Research reports are paid/included in high AMC (not free)",
          "Recommendations often push bank's distribution agenda",
          "Generic tips, not tailored to individual risk profiles"
        ],
        impact: "Paying for research that doesn't add value",
        userQuotes: "Skeptical users: 'Research is sales pitch for bank products'"
      },
      tools: {
        issues: [
          "Platform interface outdated compared to modern apps",
          "Mobile app is afterthought, desktop is primary (inconvenient)",
          "Limited charting and technical analysis tools"
        ],
        impact: "Tools lag behind modern discount broker offerings",
        userQuotes: "Technical traders: 'Charting tools feel like 2010 version'"
      },
      satisfied: {
        issues: [
          "Complex account opening process with excessive documentation",
          "Multiple fees not disclosed upfront during account opening"
        ],
        impact: "Hidden costs revealed only after starting trading",
        userQuotes: "New users shocked: 'Found out about ₹999 AMC after account opened'"
      },
      positive_aspects: [
        "Strong HDFC Bank backing and brand trust",
        "3-in-1 account convenience for existing HDFC customers",
        "Wide branch network across India",
        "Full-service support for premium clients",
        "Integrated banking and investment services"
      ]
    },

    features: [
      "3-in-1 HDFC Bank integration",
      "Full-service research",
      "2025 promotional pricing",
      "Multiple plan options"
    ],

    scoring: {
      beginners: 5,
      professionals: 6,
      cost_conscious: 4,
      speed_focused: 3,
      learning_focused: 7
    }
  },

  // ===== NON-PARTNER BROKER 6: KOTAK SECURITIES =====
  kotak_securities: {
    id: 'kotak_securities',
    name: 'Kotak Securities',
    logo_url: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/kotak.svg',
    affiliate_url: 'https://www.kotaksecurities.com',
    priority: 16,
    best_for: ['kotak_customers', 'young_traders', 'under_30'],

    charges: {
      delivery: {
        amount: 200,
        formula: '0.25% or ₹20 (whichever is higher) - Trade Free Plan',
        notes: 'Competitive ₹10 flat intraday/F&O. Trade Free Youth plan for <30 years. First 30 days free delivery'
      },
      intraday: {
        amount: 10,
        formula: '₹10 flat per order',
        notes: 'Per executed order'
      },
      fo: {
        amount: 10,
        formula: '₹10 flat per order',
        notes: 'Per executed order'
      },
      amc: {
        amount: 600,
        formula: '₹600/year',
        notes: 'Annual maintenance charges'
      },
      demat_opening: {
        amount: 0,
        formula: '₹0',
        notes: 'FREE account opening'
      }
    },

    insights: {
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

    validation_issues: {
      charges: {
        issues: [
          "0.49% delivery, 0.049% intraday = high for discount broker era",
          "Annual charges ₹600-750 + various hidden fees",
          "Complex fee structure hard to calculate actual costs"
        ],
        impact: "Expensive vs discount brokers, complex to understand total cost",
        userQuotes: "Users complain: 'Bill always higher than expected, fees everywhere'"
      },
      reliability: {
        issues: [
          "Legacy platform not as fast as modern discount brokers",
          "Occasional technical issues during high volatility",
          "Platform upgrades cause temporary disruptions"
        ],
        impact: "Traditional tech can't match new-age broker speeds",
        userQuotes: "Active traders: 'Execution lag vs Upstox costs me money'"
      },
      support: {
        issues: [
          "Customer service quality inconsistent across branches",
          "Slow response times for online queries",
          "Support prioritizes banking customers over trading-only clients"
        ],
        impact: "Support tied to bank relationship, not standalone",
        userQuotes: "Non-bank customers: 'Treated differently if no Kotak account'"
      },
      research: {
        issues: [
          "Basic research reports, not comprehensive like dedicated advisors",
          "Research quality lower than specialized firms",
          "Generic market commentary, limited actionable insights"
        ],
        impact: "Research doesn't justify higher costs",
        userQuotes: "Users say: 'Research is just news summary, nothing unique'"
      },
      tools: {
        issues: [
          "Platform feels dated compared to modern apps",
          "Limited customization options for advanced traders",
          "Mobile experience secondary to desktop (not mobile-first)"
        ],
        impact: "Tools adequate but not competitive with new-age platforms",
        userQuotes: "Traders: 'Platform works but nothing special vs Zerodha/Upstox'"
      },
      satisfied: {
        issues: [
          "Complex pricing makes cost comparison difficult",
          "Account maintenance requires active monitoring of charges"
        ],
        impact: "Transparency issues with multiple fee components",
        userQuotes: "Even satisfied users: 'Wish pricing was simpler like Zerodha'"
      },
      positive_aspects: [
        "Kotak Bank integration for existing customers",
        "3-in-1 account convenience",
        "Established banking brand with regulatory compliance",
        "Branch network for offline support needs",
        "Suitable for bank customers wanting integrated services"
      ]
    },

    features: [
      "Trade Free Youth (<30 yrs)",
      "3-in-1 Kotak Bank account",
      "30-day free trial",
      "5-min online opening"
    ],

    scoring: {
      beginners: 6,
      professionals: 5,
      cost_conscious: 3,
      speed_focused: 5,
      learning_focused: 5
    }
  },

  // ===== NON-PARTNER BROKER 7: SHAREKHAN =====
  sharekhan: {
    id: 'sharekhan',
    name: 'Sharekhan',
    logo_url: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/sharekhan.svg',
    affiliate_url: 'https://www.sharekhan.com',
    priority: 17,
    best_for: ['full_service', 'research', 'established_brand'],

    charges: {
      delivery: {
        amount: 0,
        formula: '₹0 (promo) or 0.30-0.50% (varies by plan)',
        notes: '2025 promo: Free delivery + ₹20 intraday/F&O. Prepaid plans ₹750-₹2L/year. Mirae Asset backed'
      },
      intraday: {
        amount: 20,
        formula: '₹20 (promo) or 0.02-0.10% (varies by plan)',
        notes: 'Promotional pricing active in 2025'
      },
      fo: {
        amount: 20,
        formula: '₹20 (promo) - Options: ₹20 per lot, Futures: 0.02%',
        notes: 'Promotional pricing active in 2025'
      },
      amc: {
        amount: 400,
        formula: '₹400/year (Free first year)',
        notes: 'Free for first year'
      },
      demat_opening: {
        amount: 0,
        formula: '₹0',
        notes: 'FREE account opening'
      }
    },

    insights: {
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

    validation_issues: {
      charges: {
        issues: [
          "High brokerage charges (traditional model, not discount)",
          "Annual maintenance charges higher than discount brokers",
          "Complex pricing structure with multiple fee components"
        ],
        impact: "₹40,000-80,000 annual cost vs ₹5,000 at discount brokers",
        userQuotes: "Switchers: 'Bills were shockingly high every month'"
      },
      reliability: {
        issues: [
          "Legacy platform, old technology (slower execution)",
          "Platform feels dated compared to modern apps",
          "Limited mobile-first features (desktop era platform)"
        ],
        impact: "Old tech = slower trading = missed opportunities",
        userQuotes: "Users: 'Platform stuck in 2010, need modern speed'"
      },
      support: {
        issues: [
          "Full-service support quality varies by branch",
          "Relationship manager availability inconsistent",
          "Support prioritizes HNI clients over regular traders"
        ],
        impact: "Full-service promise doesn't deliver equally to all",
        userQuotes: "Regular users: 'Only big clients get attention'"
      },
      research: {
        issues: [
          "Research and tips available but often generic",
          "Recommendations not always aligned with user risk profiles",
          "Advisory services have additional fees"
        ],
        impact: "Research quality doesn't justify high costs",
        userQuotes: "Users: 'Tips are hit-or-miss, not worth premium price'"
      },
      tools: {
        issues: [
          "Platform interface outdated vs modern discount brokers",
          "Limited charting and technical analysis capabilities",
          "Mobile app secondary, desktop primary (inconvenient)"
        ],
        impact: "Tools lag modern platforms significantly",
        userQuotes: "Technical traders: 'Charting tools are basic, need better'"
      },
      satisfied: {
        issues: [
          "Long-established brand but high cost is major concern",
          "Loyal users stay despite better alternatives available"
        ],
        impact: "Brand loyalty costs money vs modern options",
        userQuotes: "Long-time users: 'Like Sharekhan but Zerodha is 10x cheaper'"
      },
      positive_aspects: [
        "Long-established broker with decades of market presence",
        "Research and advisory services for guided investing",
        "Branch network across India for offline support",
        "Full-service broker with relationship managers",
        "Good for investors wanting professional guidance"
      ]
    },

    features: [
      "2025 promotional pricing",
      "Full-service research",
      "Free AMC first year",
      "Mirae Asset backing"
    ],

    scoring: {
      beginners: 5,
      professionals: 6,
      cost_conscious: 6,
      speed_focused: 5,
      learning_focused: 6
    }
  },

  // ===== NON-PARTNER BROKER 8: SBI SECURITIES =====
  sbi_securities: {
    id: 'sbi_securities',
    name: 'SBI Securities',
    logo_url: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/sbi.svg',
    affiliate_url: 'https://www.sbisecurities.in',
    priority: 9,
    best_for: ['sbi_customers', 'government_backing', 'trust'],

    charges: {
      delivery: {
        amount: 0,
        formula: '₹0 (Free)',
        notes: 'Free delivery + ₹0 AMC. Government bank backed. Subscription plans available with additional benefits'
      },
      intraday: {
        amount: 20,
        formula: '₹20 flat per order',
        notes: 'Per executed order'
      },
      fo: {
        amount: 20,
        formula: '₹20 flat per order',
        notes: 'Per executed order'
      },
      amc: {
        amount: 0,
        formula: '₹0 (Free)',
        notes: 'No annual maintenance charges'
      },
      demat_opening: {
        amount: 0,
        formula: '₹0',
        notes: 'FREE account opening'
      }
    },

    insights: {
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

    validation_issues: {
      charges: {
        issues: [
          "Very high brokerage (traditional pricing 0.5%+)",
          "High AMC ₹500+ annually",
          "Multiple hidden charges for various services"
        ],
        impact: "Government bank trust factor comes at steep price",
        userQuotes: "Users shocked: 'SBI name doesn't mean low cost'"
      },
      reliability: {
        issues: [
          "Slow platform and execution speeds (old technology)",
          "Complex account processes tied to bank bureaucracy",
          "Platform feels dated compared to modern brokers"
        ],
        impact: "Old infrastructure, slow processes",
        userQuotes: "Users: 'Platform speed like bank branch - slow'"
      },
      support: {
        issues: [
          "Support quality tied to bank relationship",
          "Branch-based support means offline visits required",
          "Long resolution times for issues (bureaucratic)"
        ],
        impact: "Government bank processes = slow support",
        userQuotes: "Frustrated users: 'Support slower than SBI bank itself'"
      },
      research: {
        issues: [
          "Research reports basic, not comprehensive",
          "Advisory services favor bank products",
          "Generic market commentary, limited insights"
        ],
        impact: "Research doesn't add value for cost",
        userQuotes: "Users: 'Research is just news, nothing actionable'"
      },
      tools: {
        issues: [
          "Old technology stack (not modernized)",
          "Platform interface complex and dated",
          "Mobile app weak compared to competitors"
        ],
        impact: "Tools from another era, not competitive",
        userQuotes: "Traders: 'Platform looks like 2005 version'"
      },
      satisfied: {
        issues: [
          "Government bank trust but trading tech lags far behind",
          "Name recognition doesn't translate to trading experience"
        ],
        impact: "Trust in SBI ≠ good trading platform",
        userQuotes: "Users: 'Trust SBI bank, but trading platform is poor'"
      },
      positive_aspects: [
        "Backed by India's largest government bank (trust factor)",
        "3-in-1 account integration for SBI customers",
        "Extensive branch network across India",
        "Government backing provides security perception",
        "Good for conservative investors wanting bank-backed trading"
      ]
    },

    features: [
      "Free equity delivery",
      "Zero AMC charges",
      "Government bank backing",
      "SBI ecosystem integration"
    ],

    scoring: {
      beginners: 7,
      professionals: 5,
      cost_conscious: 9,
      speed_focused: 4,
      learning_focused: 5
    }
  },

  // ===== NON-PARTNER BROKER 9: MOTILAL OSWAL =====
  motilal_oswal: {
    id: 'motilal_oswal',
    name: 'Motilal Oswal',
    logo_url: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/motilal.svg',
    affiliate_url: 'https://www.motilaloswal.com',
    priority: 13,
    best_for: ['full_service', 'research', 'advisory'],

    charges: {
      delivery: {
        amount: 200,
        formula: '0.20%',
        notes: 'Good for wealth management + research'
      },
      intraday: {
        amount: 0,
        formula: '₹0 (Free - special offer)',
        notes: 'Free intraday trading (lifetime offer)'
      },
      fo: {
        amount: 20,
        formula: '0.02% Futures, ₹20 Options',
        notes: 'Per executed order'
      },
      amc: {
        amount: 199,
        formula: '₹199/year (Free first year)',
        notes: 'Lower than most full-service brokers'
      },
      demat_opening: {
        amount: 0,
        formula: '₹0',
        notes: 'FREE account opening'
      }
    },

    insights: {
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

    validation_issues: {
      charges: {
        issues: [
          "Higher charges than discount brokers (traditional model)",
          "AMC and annual fees add to cost",
          "Complex pricing for beginners to understand"
        ],
        impact: "Traditional pricing in discount broker era",
        userQuotes: "Users: 'Costs more than Zerodha for same trades'"
      },
      reliability: {
        issues: [
          "Traditional platform, not as modern as discount brokers",
          "Execution speeds adequate but not fastest",
          "Platform updates less frequent than new-age brokers"
        ],
        impact: "Reliable but not cutting-edge technology",
        userQuotes: "Users note: 'Platform stable but dated feel'"
      },
      support: {
        issues: [
          "Full-service for HNI/wealth clients, basic for regular traders",
          "Support quality varies by account size",
          "Smaller traders get generic assistance"
        ],
        impact: "Full-service promise mainly for wealthy clients",
        userQuotes: "Regular traders: 'Support depends on portfolio size'"
      },
      research: {
        issues: [
          "Research team strong but for HNI clients primarily",
          "Regular traders get basic research, not premium",
          "Quality insights reserved for wealth management clients"
        ],
        impact: "Best research not accessible to all clients",
        userQuotes: "Users: 'Premium research only for big accounts'"
      },
      tools: {
        issues: [
          "Platform adequate but not feature-rich like modern apps",
          "Charting and analysis tools basic vs competitors",
          "Interface not as intuitive as discount brokers"
        ],
        impact: "Tools sufficient but not exceptional",
        userQuotes: "Traders: 'Platform works but nothing special'"
      },
      satisfied: {
        issues: [
          "Established brand but higher costs vs modern options",
          "Good for wealth management, expensive for just trading"
        ],
        impact: "Value proposition weaker in discount broker era",
        userQuotes: "Users: 'Motilal great for wealth, pricey for trading'"
      },
      positive_aspects: [
        "Strong research team for wealth management clients",
        "Established name in financial services",
        "Good for HNI and wealth management needs",
        "Professional advisory for large portfolios",
        "Comprehensive financial planning services"
      ]
    },

    features: [
      "FREE intraday lifetime",
      "Full-service research",
      "Advisory services",
      "AMC ₹199/year (free 1st year)"
    ],

    scoring: {
      beginners: 4,
      professionals: 7,
      cost_conscious: 5,
      speed_focused: 6,
      learning_focused: 7
    }
  },

  // ===== NON-PARTNER BROKER 10: IIFL SECURITIES =====
  iifl_securities: {
    id: 'iifl_securities',
    name: 'IIFL Securities',
    logo_url: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/iifl.svg',
    affiliate_url: 'https://www.indiainfoline.com',
    priority: 10,
    best_for: ['multiple_plans', 'flexibility', 'options'],

    charges: {
      delivery: {
        amount: 0,
        formula: '₹0 (Zero Brokerage plan) or ₹20 (Basic plan)',
        notes: 'Multiple plans: Zero Brokerage (free delivery), Basic (₹20 flat), 0.5% standard'
      },
      intraday: {
        amount: 20,
        formula: '₹20 or 0.05% (varies by plan)',
        notes: 'Per executed order - varies by plan'
      },
      fo: {
        amount: 20,
        formula: '₹20 flat per lot (Options)',
        notes: 'Per executed order'
      },
      amc: {
        amount: 250,
        formula: '₹250-450/year (Free first year)',
        notes: 'Lower than most full-service brokers'
      },
      demat_opening: {
        amount: 0,
        formula: '₹0',
        notes: 'FREE account opening'
      }
    },

    insights: {
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

    validation_issues: {
      charges: {
        issues: [
          "Higher brokerage than discount brokers",
          "Annual charges ₹500-800 vs ₹300 at Zerodha",
          "Multiple fees make total cost calculation complex"
        ],
        impact: "Traditional pricing model, expensive vs discount brokers",
        userQuotes: "Users: 'Expected lower cost, bills are high'"
      },
      reliability: {
        issues: [
          "Platform technology adequate but legacy feel",
          "Execution speeds good but not fastest",
          "Occasional technical issues during updates"
        ],
        impact: "Reliable but not cutting-edge performance",
        userQuotes: "Users: 'Platform stable but feels old'"
      },
      support: {
        issues: [
          "Support quality inconsistent across branches",
          "Response times adequate but not fastest",
          "Full-service promise varies by location"
        ],
        impact: "Support experience depends on branch/manager",
        userQuotes: "Users: 'Support good in some cities, poor in others'"
      },
      research: {
        issues: [
          "Research and advisory available but for premium clients",
          "Regular traders get basic market updates",
          "In-depth research has additional fees"
        ],
        impact: "Quality research not included for all",
        userQuotes: "Users: 'Good research but have to pay extra'"
      },
      tools: {
        issues: [
          "Platform covers basics but lacks advanced features",
          "Charting tools adequate, not professional-grade",
          "Interface not as modern as new-age brokers"
        ],
        impact: "Tools functional but not competitive with leaders",
        userQuotes: "Traders: 'Platform okay, but Zerodha/Fyers better tools'"
      },
      satisfied: {
        issues: [
          "Good for wealth management, expensive for plain trading",
          "Value proposition weaker vs focused discount brokers"
        ],
        impact: "Jack of all trades, master of none",
        userQuotes: "Users: 'IIFL does many things, none exceptionally well'"
      },
      positive_aspects: [
        "Full-service financial services provider",
        "Wealth management and advisory services available",
        "Established presence in financial sector",
        "Branch network for offline support",
        "Good for comprehensive financial planning needs"
      ]
    },

    features: [
      "Multiple pricing plans",
      "Z20 free delivery plan",
      "4.3/5 platform rating",
      "Super Trader option"
    ],

    scoring: {
      beginners: 7,
      professionals: 8,
      cost_conscious: 8,
      speed_focused: 7,
      learning_focused: 6
    }
  },

  // ===== NON-PARTNER BROKER 11: AXIS DIRECT =====
  axis_direct: {
    id: 'axis_direct',
    name: 'Axis Direct',
    logo_url: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/axis.svg',
    affiliate_url: 'https://www.axisdirect.in',
    priority: 18,
    best_for: ['axis_customers', 'high_balance', '3in1_account'],

    charges: {
      delivery: {
        amount: 500,
        formula: '₹0 (Trade@20 plan) or 0.50% (Standard)',
        notes: 'Trade@20 plan: Free delivery + ₹20 F&O (requires ₹75k AQB in linked Axis bank account)'
      },
      intraday: {
        amount: 20,
        formula: '₹20 (Trade@20) or 0.05% (Standard)',
        notes: 'Per executed order - varies by plan'
      },
      fo: {
        amount: 20,
        formula: '₹20 (Trade@20) or segment rates (Standard)',
        notes: 'Per executed order - varies by plan'
      },
      amc: {
        amount: 499,
        formula: '₹600-650/year',
        notes: 'Annual maintenance charges'
      },
      demat_opening: {
        amount: 0,
        formula: '₹0',
        notes: 'FREE account opening'
      }
    },

    insights: {
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

    validation_issues: {
      charges: {
        issues: [
          "High brokerage (traditional model 0.5%+)",
          "AMC charges ₹500+ annually",
          "Complex pricing hard to understand total costs"
        ],
        impact: "Bank-backed broker = bank-level high charges",
        userQuotes: "Users: 'Axis bank trust but trading costs are high'"
      },
      reliability: {
        issues: [
          "Platform slower than modern discount brokers",
          "Legacy technology, not mobile-first design",
          "Execution delays compared to new-age platforms"
        ],
        impact: "Traditional tech can't match discount broker speeds",
        userQuotes: "Users: 'Order execution feels slow vs Upstox'"
      },
      support: {
        issues: [
          "Support tied to Axis Bank relationship",
          "Branch-based support means offline visits",
          "Non-bank customers treated as secondary"
        ],
        impact: "Support quality depends on banking relationship",
        userQuotes: "Users: 'Better support if you have Axis Bank account'"
      },
      research: {
        issues: [
          "Research reports basic, bank-focused recommendations",
          "Advisory pushes bank products, not pure trading advice",
          "Generic market updates, limited actionable insights"
        ],
        impact: "Research quality questionable, bank agenda visible",
        userQuotes: "Users skeptical: 'Research is bank product sales pitch'"
      },
      tools: {
        issues: [
          "Platform dated compared to modern apps",
          "Limited customization and advanced features",
          "Desktop-primary, mobile app is afterthought"
        ],
        impact: "Tools lag behind modern broker standards",
        userQuotes: "Traders: 'Platform feels 10 years old'"
      },
      satisfied: {
        issues: [
          "Axis Bank name doesn't translate to great trading experience",
          "Traditional approach in modern trading era"
        ],
        impact: "Bank trust ≠ good brokerage platform",
        userQuotes: "Users: 'Trust Axis Bank, but trading platform is weak'"
      },
      positive_aspects: [
        "Axis Bank brand trust and security",
        "3-in-1 account for existing Axis customers",
        "Branch network for offline support",
        "Banking integration for existing customers",
        "Suitable for bank customers wanting integrated services"
      ]
    },

    features: [
      "Trade@20 plan",
      "3-in-1 Axis Bank account",
      "Multiple plan options",
      "Bank integration"
    ],

    scoring: {
      beginners: 3,
      professionals: 5,
      cost_conscious: 2,
      speed_focused: 5,
      learning_focused: 4
    }
  }

};

// =====================================================
// HELPER FUNCTIONS
// =====================================================

export const getUnifiedBrokerById = (id: string): UnifiedBrokerConfig | null => {
  return UNIFIED_BROKER_CONFIGS[id] || null;
};

export const getAllUnifiedBrokers = (): Record<string, UnifiedBrokerConfig> => {
  return UNIFIED_BROKER_CONFIGS;
};

export const getUnifiedBrokersByPriority = (): UnifiedBrokerConfig[] => {
  return Object.values(UNIFIED_BROKER_CONFIGS).sort((a, b) => a.priority - b.priority);
};

// 🤝 PARTNER BROKER IDS
export const PARTNER_BROKER_IDS = ['zerodha', 'upstox', 'angel_one', 'fyers', '5paisa'];

export const isPartnerBroker = (brokerId: string): boolean => {
  return PARTNER_BROKER_IDS.includes(brokerId);
};
