// 🧪 A/B TESTING QUESTION CONFIGURATIONS
// Switch between different question flows by changing ACTIVE_CONFIG

export interface QuestionOption {
  label: string;
  value: string;
  id?: number;
  description?: string; // Optional subtitle/description for visual cards
  icon?: string; // Optional custom icon (emoji or icon name)
}

export interface Question {
  id: string;
  type: 'input' | 'radio' | 'checkbox' | 'custom' | 'priority';
  label: string;
  field_name: string;
  options?: QuestionOption[];
  validation?: {
    required?: boolean;
    minLength?: number;
    pattern?: string;
    customValidation?: (value: unknown) => boolean;
  };
  conditional?: {
    showIf: string; // field_name
    equals: string; // value
  };
  placeholder?: string;
  helpText?: string;
  visualCard?: boolean; // Use large visual cards for 2-3 options (no scrolling)
  gridLayout?: '2x2' | '2x3' | '3x2'; // Grid layout for checkbox questions (uses space better)
  allowCustom?: boolean; // Show "Other (specify)" option with text input
  maxSelections?: number; // For priority questions: max number of selections (e.g., 3 for TOP 3)
}

export interface QuestionFlow {
  name: string;
  description: string;
  questions: Question[];
  totalQuestions: number;
}

// 🔄 VERSION A: ENHANCED TWO-PATH FLOW
export const QUESTION_FLOW_A: QuestionFlow = {
  name: "Enhanced Two-Path Flow",
  description: "Clear branching: New users (6 questions) vs Existing users (6 questions)",
  totalQuestions: 6,
  questions: [
    {
      id: "contact_info",
      type: "custom",
      label: "One last step to get your perfect match!",
      helpText: "Get your personalized recommendation + exclusive broker links instantly",
      field_name: "contact",
      validation: {
        required: false, // Not blocking - accept any input
        customValidation: (data: unknown) => {
          // ✅ ACCEPT EVERYTHING:
          // - Form looks required (psychology)
          // - But technically accepts any/no input
          // - Zero drop-offs at contact form
          // - Facebook optimizes for InitiateCheckout (not Lead)
          // - Real conversions = CSV upload (not contact form)
          return true; // Always valid!
        }
      }
    },
    {
      id: "demat_account_check",
      type: "radio",
      label: "Do you have a demat/trading account?",
      helpText: "⏱️ Takes 60 seconds • Free personalized match",
      field_name: "hasAccount",
      options: [
        { label: "Yes, I do", value: "yes" },
        { label: "No, I don't", value: "no" }
      ],
      validation: { required: true },
      visualCard: true // 2 options - perfect for large visual cards
    },
    {
      id: "combined_broker_selection",
      type: "custom",
      label: "Tell us about your current brokers",
      field_name: "brokerInfo",
      helpText: "First select how many, then choose which brokers you use",
      conditional: {
        showIf: "hasAccount",
        equals: "yes"
      },
      validation: {
        required: true,
        customValidation: (data: unknown) => {
          // Flexible validation - just need at least one broker selected
          const brokerData = data as { count?: string; brokers?: string[] } | undefined;
          return (brokerData?.brokers?.length || 0) > 0;
        }
      }
    },
    {
      id: "trading_style",
      type: "radio",
      label: "What's your trading style?",
      helpText: "Choose the one that best describes you",
      field_name: "tradingStyle",
      options: [
        { label: "Active day trader", value: "day_trader", description: "Multiple trades daily", icon: "📊" },
        { label: "Swing trader", value: "swing_trader", description: "Hold for days/weeks", icon: "⚡" },
        { label: "Long-term investor", value: "long_term_investor", description: "Buy & hold strategy", icon: "📈" },
        { label: "Mix of trading + investing", value: "hybrid", description: "Both short & long term", icon: "🎯" }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "yes"
      },
      validation: { required: true },
      visualCard: true
    },
    {
      id: "investment_capital",
      type: "radio",
      label: "What's your typical investment amount?",
      helpText: "This helps us recommend the right broker for your needs",
      field_name: "investmentCapital",
      options: [
        { label: "Just starting", value: "beginner", description: "₹10,000 - ₹50,000", icon: "🌱" },
        { label: "Growing portfolio", value: "growing", description: "₹50,000 - ₹5 lakh", icon: "📊" },
        { label: "Established investor", value: "established", description: "₹5 lakh - ₹25 lakh", icon: "💼" },
        { label: "Serious capital", value: "serious", description: "₹25 lakh+", icon: "🏆" }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "yes"
      },
      validation: { required: true },
      visualCard: true
    },
    {
      id: "main_challenge",
      type: "checkbox",
      label: "What frustrates you about your current broker?",
      helpText: "👆 Click all that frustrate you",
      field_name: "mainChallenge",
      options: [
        { label: "💸 High charges", value: "charges" },
        { label: "📉 Platform crashes", value: "reliability" },
        { label: "😤 Poor support", value: "support" },
        { label: "🔍 Limited research", value: "research" },
        { label: "🛠️ Basic tools", value: "tools" }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "yes"
      },
      validation: { required: true },
      gridLayout: "2x3", // Display in 2x3 grid (2 columns, 3 rows)
      allowCustom: true // Allow "Other (specify)" option
    },
    {
      id: "what_matters_most",
      type: "checkbox",
      label: "What matters to you when choosing a broker?",
      helpText: "👆 Click your top priorities",
      field_name: "whatMattersMost",
      options: [
        { label: "💰 Lowest charges", value: "cost" },
        { label: "⚡ Speed & reliability", value: "speed" },
        { label: "📊 Research & tools", value: "research" },
        { label: "👍 Good support", value: "support" },
        { label: "🎓 Learning resources", value: "education" }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "yes"
      },
      validation: { required: true },
      gridLayout: "2x3", // Display in 2x3 grid
      allowCustom: true // Allow "Other (specify)" option
    },
    // 🆕 NEW USER QUESTIONS (for hasAccount = "no") - STRATEGIC REDESIGN (5 Questions, All Fit On Screen)
    {
      id: "new_user_type",
      type: "radio",
      label: "What brings you to stock market?",
      field_name: "userType",
      helpText: "Choose what best describes your goal",
      options: [
        {
          label: "I want to invest",
          value: "investor",
          icon: "📈",
          description: "Build wealth over time"
        },
        {
          label: "I want to trade",
          value: "trader",
          icon: "📊",
          description: "Active buying & selling"
        },
        {
          label: "Both investing & trading",
          value: "both",
          icon: "🎯",
          description: "Long-term + short-term goals"
        }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "no"
      },
      validation: { required: true },
      visualCard: true // 3 options - fits on screen
    },
    {
      id: "new_user_experience_level",
      type: "radio",
      label: "What's your experience level?",
      field_name: "experienceLevel",
      helpText: "Be honest - helps us personalize recommendations",
      options: [
        {
          label: "Complete beginner",
          value: "beginner",
          icon: "🌱",
          description: "Never invested before"
        },
        {
          label: "Some knowledge",
          value: "intermediate",
          icon: "📚",
          description: "Learned basics, ready to start"
        },
        {
          label: "Experienced",
          value: "advanced",
          icon: "💼",
          description: "Invested before, switching brokers"
        }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "no"
      },
      validation: { required: true },
      visualCard: true // 3 options - fits on screen
    },
    {
      id: "new_user_investing_goal",
      type: "radio",
      label: "What's your main investing goal?",
      field_name: "investingGoal",
      helpText: "What are you looking to achieve?",
      options: [
        {
          label: "Build long-term wealth",
          value: "long_term_wealth",
          icon: "🎯",
          description: "Retirement, future planning"
        },
        {
          label: "Generate regular income",
          value: "regular_income",
          icon: "💰",
          description: "Dividends, steady returns"
        },
        {
          label: "Grow money faster",
          value: "high_growth",
          icon: "🚀",
          description: "Higher risk, higher returns"
        }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "no"
      },
      validation: { required: true },
      visualCard: true // 3 options - fits on screen
    },
    {
      id: "new_user_time_dedication",
      type: "radio",
      label: "How much time can you dedicate?",
      field_name: "timeDedication",
      helpText: "For monitoring & managing investments",
      options: [
        {
          label: "15-30 mins per week",
          value: "minimal",
          icon: "⏰",
          description: "Minimal monitoring needed"
        },
        {
          label: "1-2 hours per week",
          value: "moderate",
          icon: "📅",
          description: "Regular check-ins & research"
        },
        {
          label: "Several hours daily",
          value: "high",
          icon: "⚡",
          description: "Active trading & monitoring"
        }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "no"
      },
      validation: { required: true },
      visualCard: true // 3 options - fits on screen
    },
    {
      id: "new_user_top_priorities",
      type: "priority",
      label: "Select your TOP 3 priorities",
      field_name: "topPriorities",
      helpText: "Tap to select - first tap = 1st priority, second tap = 2nd priority",
      options: [
        {
          label: "Low costs & fees",
          value: "low_costs",
          icon: "💰",
          description: "Zero brokerage options"
        },
        {
          label: "Trusted brand name",
          value: "trusted_brand",
          icon: "🏆",
          description: "Reputed, established"
        },
        {
          label: "Learning & guidance",
          value: "learning",
          icon: "🎓",
          description: "Research, tips, lessons"
        },
        {
          label: "24/7 Customer support",
          value: "support",
          icon: "👍",
          description: "Quick help anytime"
        },
        {
          label: "Easy fund transfers",
          value: "fund_transfers",
          icon: "💳",
          description: "Instant deposits"
        },
        {
          label: "Advanced tools",
          value: "advanced_tools",
          icon: "📊",
          description: "Charts, analysis"
        }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "no"
      },
      validation: {
        required: true,
        customValidation: (value: unknown) => {
          const priorities = value as { rank: number; value: string }[] | undefined;
          return (priorities?.length || 0) === 3; // Must select exactly 3
        }
      },
      gridLayout: "2x3", // 2 columns, 3 rows
      maxSelections: 3 // TOP 3 priorities
    }
  ]
};

// 🧪 VERSION B: Simplified Flow
// 🔄 VERSION B: Contact Form LAST (Better Conversion)
// Same as Version A, but contact_info moved to second-to-last position
export const QUESTION_FLOW_B: QuestionFlow = {
  name: "Contact Last Flow",
  description: "Find your perfect broker in 60 seconds",
  totalQuestions: 6,
  questions: [
    {
      id: "demat_account_check",
      type: "radio",
      label: "Do you have a demat/trading account?",
      helpText: "⏱️ Takes 60 seconds • Free personalized match",
      field_name: "hasAccount",
      options: [
        {
          label: "Yes, I have an account",
          value: "yes",
          icon: "✅",
          description: "I'm already trading or investing"
        },
        {
          label: "No, I'm just starting",
          value: "no",
          icon: "🆕",
          description: "Help me choose my first broker"
        }
      ],
      validation: { required: true },
      visualCard: true // 2 options - perfect for large visual cards
    },
    {
      id: "combined_broker_selection",
      type: "custom",
      label: "Tell us about your current brokers",
      field_name: "brokerInfo",
      helpText: "First select how many, then choose which brokers you use",
      conditional: {
        showIf: "hasAccount",
        equals: "yes"
      },
      validation: {
        required: true,
        customValidation: (data: unknown) => {
          const brokerData = data as { count?: string; brokers?: string[] } | undefined;
          return (brokerData?.brokers?.length || 0) > 0;
        }
      }
    },
    {
      id: "trading_style",
      type: "radio",
      label: "What's your trading style?",
      helpText: "Choose the one that best describes you",
      field_name: "tradingStyle",
      options: [
        { label: "Active day trader", value: "day_trader", description: "Multiple trades daily", icon: "📊" },
        { label: "Swing trader", value: "swing_trader", description: "Hold for days/weeks", icon: "⚡" },
        { label: "Long-term investor", value: "long_term_investor", description: "Buy & hold strategy", icon: "📈" },
        { label: "Mix of trading + investing", value: "hybrid", description: "Both short & long term", icon: "🎯" }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "yes"
      },
      validation: { required: true },
      visualCard: true
    },
    {
      id: "investment_capital",
      type: "radio",
      label: "What's your typical investment amount?",
      helpText: "This helps us recommend the right broker for your needs",
      field_name: "investmentCapital",
      options: [
        { label: "Just starting", value: "beginner", description: "₹10,000 - ₹50,000", icon: "🌱" },
        { label: "Growing portfolio", value: "growing", description: "₹50,000 - ₹5 lakh", icon: "📊" },
        { label: "Established investor", value: "established", description: "₹5 lakh - ₹25 lakh", icon: "💼" },
        { label: "Serious capital", value: "serious", description: "₹25 lakh+", icon: "🏆" }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "yes"
      },
      validation: { required: true },
      visualCard: true
    },
    {
      id: "main_challenge",
      type: "checkbox",
      label: "What frustrates you about your current broker?",
      helpText: "👆 Click all that frustrate you",
      field_name: "mainChallenge",
      options: [
        { label: "💸 High charges", value: "charges" },
        { label: "📉 Platform crashes", value: "reliability" },
        { label: "😤 Poor support", value: "support" },
        { label: "🔍 Limited research", value: "research" },
        { label: "🛠️ Basic tools", value: "tools" }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "yes"
      },
      validation: { required: true },
      gridLayout: "2x3", // Display in 2x3 grid (2 columns, 3 rows)
      allowCustom: true // Allow "Other (specify)" option
    },
    {
      id: "most_important",
      type: "checkbox",
      label: "What matters to you when choosing a broker?",
      helpText: "👆 Click your top priorities",
      field_name: "whatMattersMost",
      options: [
        { label: "💰 Lowest charges", value: "charges" },
        { label: "⚡ Speed & reliability", value: "speed" },
        { label: "🛠️ Advanced tools", value: "tools" },
        { label: "👍 Good support", value: "support" },
        { label: "🎓 Learning resources", value: "education" }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "yes"
      },
      validation: { required: true },
      gridLayout: "2x3", // Display in 2x3 grid
      allowCustom: true // Allow "Other (specify)" option
    },
    // 🆕 NEW USER QUESTIONS (for hasAccount = "no") - STRATEGIC REDESIGN (5 Questions, All Fit On Screen)
    {
      id: "new_user_type",
      type: "radio",
      label: "What brings you to stock market?",
      field_name: "userType",
      helpText: "Choose what best describes your goal",
      options: [
        {
          label: "I want to invest",
          value: "investor",
          icon: "📈",
          description: "Build wealth over time"
        },
        {
          label: "I want to trade",
          value: "trader",
          icon: "📊",
          description: "Active buying & selling"
        },
        {
          label: "Both investing & trading",
          value: "both",
          icon: "🎯",
          description: "Long-term + short-term goals"
        }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "no"
      },
      validation: { required: true },
      visualCard: true // 3 options - fits on screen
    },
    {
      id: "new_user_experience_level",
      type: "radio",
      label: "What's your experience level?",
      field_name: "experienceLevel",
      helpText: "Be honest - helps us personalize recommendations",
      options: [
        {
          label: "Complete beginner",
          value: "beginner",
          icon: "🌱",
          description: "Never invested before"
        },
        {
          label: "Some knowledge",
          value: "intermediate",
          icon: "📚",
          description: "Learned basics, ready to start"
        },
        {
          label: "Experienced",
          value: "advanced",
          icon: "💼",
          description: "Invested before, switching brokers"
        }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "no"
      },
      validation: { required: true },
      visualCard: true // 3 options - fits on screen
    },
    {
      id: "new_user_investing_goal",
      type: "radio",
      label: "What's your main investing goal?",
      field_name: "investingGoal",
      helpText: "What are you looking to achieve?",
      options: [
        {
          label: "Build long-term wealth",
          value: "long_term_wealth",
          icon: "🎯",
          description: "Retirement, future planning"
        },
        {
          label: "Generate regular income",
          value: "regular_income",
          icon: "💰",
          description: "Dividends, steady returns"
        },
        {
          label: "Grow money faster",
          value: "high_growth",
          icon: "🚀",
          description: "Higher risk, higher returns"
        }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "no"
      },
      validation: { required: true },
      visualCard: true // 3 options - fits on screen
    },
    {
      id: "new_user_time_dedication",
      type: "radio",
      label: "How much time can you dedicate?",
      field_name: "timeDedication",
      helpText: "For monitoring & managing investments",
      options: [
        {
          label: "15-30 mins per week",
          value: "minimal",
          icon: "⏰",
          description: "Minimal monitoring needed"
        },
        {
          label: "1-2 hours per week",
          value: "moderate",
          icon: "📅",
          description: "Regular check-ins & research"
        },
        {
          label: "Several hours daily",
          value: "high",
          icon: "⚡",
          description: "Active trading & monitoring"
        }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "no"
      },
      validation: { required: true },
      visualCard: true // 3 options - fits on screen
    },
    {
      id: "new_user_top_priorities",
      type: "priority",
      label: "Select your TOP 3 priorities",
      field_name: "topPriorities",
      helpText: "Tap to select - first tap = 1st priority, second tap = 2nd priority",
      options: [
        {
          label: "Low costs & fees",
          value: "low_costs",
          icon: "💰",
          description: "Zero brokerage options"
        },
        {
          label: "Trusted brand name",
          value: "trusted_brand",
          icon: "🏆",
          description: "Reputed, established"
        },
        {
          label: "Learning & guidance",
          value: "learning",
          icon: "🎓",
          description: "Research, tips, lessons"
        },
        {
          label: "24/7 Customer support",
          value: "support",
          icon: "👍",
          description: "Quick help anytime"
        },
        {
          label: "Easy fund transfers",
          value: "fund_transfers",
          icon: "💳",
          description: "Instant deposits"
        },
        {
          label: "Advanced tools",
          value: "advanced_tools",
          icon: "📊",
          description: "Charts, analysis"
        }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "no"
      },
      validation: {
        required: true,
        customValidation: (value: unknown) => {
          const priorities = value as { rank: number; value: string }[] | undefined;
          return (priorities?.length || 0) === 3; // Must select exactly 3
        }
      },
      gridLayout: "2x3", // 2 columns, 3 rows
      maxSelections: 3 // TOP 3 priorities
    },
    // ⭐ CONTACT FORM - MOVED TO SECOND-TO-LAST POSITION
    {
      id: "contact_info",
      type: "custom",
      label: "One last step to get your perfect match!",
      helpText: "Get your personalized recommendation + exclusive broker links instantly",
      field_name: "contact",
      validation: {
        required: false, // Not blocking - accept any input
        customValidation: (data: unknown) => {
          // ✅ ACCEPT EVERYTHING - Zero drop-offs strategy
          return true; // Always valid!
        }
      }
    }
  ]
};

// 🧪 VERSION C: Detailed Analysis
export const QUESTION_FLOW_C: QuestionFlow = {
  name: "Detailed Analysis",
  description: "Comprehensive assessment for precise recommendations",
  totalQuestions: 9,
  questions: [
    {
      id: "contact_info",
      type: "custom",
      label: "Comprehensive broker analysis - Get your perfect match",
      field_name: "contact",
      validation: {
        required: false, // Not blocking - accept any input
        customValidation: (data: unknown) => {
          // ✅ ACCEPT EVERYTHING - Zero drop-offs strategy
          return true; // Always valid!
        }
      }
    },
    {
      id: "account_status_detailed",
      type: "radio",
      label: "Current trading account status?",
      field_name: "accountStatus",
      options: [
        { label: "Active trader with current broker", value: "active" },
        { label: "Have account but not actively trading", value: "dormant" },
        { label: "Planning to switch from current broker", value: "switching" },
        { label: "No trading experience yet", value: "new" }
      ],
      validation: { required: true }
    },
    {
      id: "current_broker_detailed",
      type: "radio",
      label: "Your current broker?",
      field_name: "currentBroker",
      options: [
        { label: "Zerodha", value: "zerodha" },
        { label: "Upstox", value: "upstox" },
        { label: "Groww", value: "groww" },
        { label: "Angel One", value: "angel_one" },
        { label: "Fyers", value: "fyers" },
        { label: "5paisa", value: "5paisa" },
        { label: "Others", value: "others" }
      ],
      conditional: {
        showIf: "accountStatus",
        equals: "active"
      },
      validation: { required: true }
    },
    {
      id: "trading_style",
      type: "radio",
      label: "Your preferred trading style?",
      field_name: "tradingStyle",
      options: [
        { label: "Day trading (buy/sell same day)", value: "daytrading" },
        { label: "Swing trading (hold few days/weeks)", value: "swing" },
        { label: "Long-term investing (months/years)", value: "longterm" },
        { label: "Mix of everything", value: "mixed" }
      ],
      validation: { required: true }
    },
    {
      id: "monthly_volume",
      type: "radio",
      label: "Monthly trading volume?",
      field_name: "monthlyVolume",
      options: [
        { label: "Under ₹1 lakh", value: "low" },
        { label: "₹1-5 lakhs", value: "medium" },
        { label: "₹5-20 lakhs", value: "high" },
        { label: "Over ₹20 lakhs", value: "very_high" }
      ],
      validation: { required: true }
    },
    {
      id: "priority_ranking",
      type: "radio",
      label: "Rank your top priority (1 = most important)",
      field_name: "topPriority",
      options: [
        { label: "Lowest possible charges", value: "cost" },
        { label: "Fastest execution speed", value: "speed" },
        { label: "Best research and recommendations", value: "research" },
        { label: "Advanced charting tools", value: "tools" },
        { label: "Excellent customer support", value: "support" }
      ],
      validation: { required: true }
    },
    {
      id: "current_satisfaction",
      type: "radio",
      label: "Overall satisfaction with current broker? (1-5 scale)",
      field_name: "satisfaction",
      options: [
        { label: "1 - Very unsatisfied", value: "1" },
        { label: "2 - Somewhat unsatisfied", value: "2" },
        { label: "3 - Neutral", value: "3" },
        { label: "4 - Quite satisfied", value: "4" },
        { label: "5 - Very satisfied", value: "5" }
      ],
      conditional: {
        showIf: "accountStatus",
        equals: "active"
      },
      validation: { required: true }
    },
    {
      id: "switching_reason",
      type: "radio",
      label: "Main reason for considering a switch?",
      field_name: "switchingReason",
      options: [
        { label: "Platform crashes during important trades", value: "reliability" },
        { label: "Hidden charges discovered later", value: "transparency" },
        { label: "Poor customer service experience", value: "service" },
        { label: "Need better tools for analysis", value: "features" },
        { label: "Friend/expert recommended different broker", value: "recommendation" }
      ],
      conditional: {
        showIf: "accountStatus",
        equals: "switching"
      },
      validation: { required: true }
    },
    {
      id: "learning_preference",
      type: "radio",
      label: "How do you prefer to learn about trading?",
      field_name: "learningPreference",
      options: [
        { label: "Video tutorials and courses", value: "videos" },
        { label: "Written guides and articles", value: "articles" },
        { label: "Personal advisory and recommendations", value: "advisory" },
        { label: "Community discussions and forums", value: "community" },
        { label: "I prefer to figure it out myself", value: "self" }
      ],
      validation: { required: true }
    }
  ]
};

// 🎯 ACTIVE CONFIGURATION - Change this to switch between A/B tests
export const ACTIVE_QUESTION_CONFIG = QUESTION_FLOW_B;

// 🔄 Easy A/B Testing Functions
export const getQuestionConfig = (version?: 'A' | 'B' | 'C') => {
  switch(version) {
    case 'A': return QUESTION_FLOW_A;
    case 'B': return QUESTION_FLOW_B;
    case 'C': return QUESTION_FLOW_C;
    default: return ACTIVE_QUESTION_CONFIG;
  }
};

export const getQuestionById = (id: string, version?: 'A' | 'B' | 'C') => {
  const config = getQuestionConfig(version);
  return config.questions.find(q => q.id === id);
};

export const shouldShowQuestion = (question: Question, userData: Record<string, unknown>) => {
  if (!question.conditional) return true;
  return userData[question.conditional.showIf] === question.conditional.equals;
};

export const validateQuestion = (question: Question, value: unknown, userData?: Record<string, unknown>) => {
  if (!question.validation) return true;

  if (question.validation.required && (!value || value === '')) {
    return false;
  }

  if (question.validation.minLength && typeof value === 'string' && value.length < question.validation.minLength) {
    return false;
  }

  if (question.validation.pattern && typeof value === 'string' && !new RegExp(question.validation.pattern).test(value)) {
    return false;
  }

  if (question.validation.customValidation && !question.validation.customValidation(userData ?? value)) {
    return false;
  }

  return true;
};