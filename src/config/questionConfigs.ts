// 🧪 A/B TESTING QUESTION CONFIGURATIONS
// Switch between different question flows by changing ACTIVE_CONFIG

export interface QuestionOption {
  label: string;
  value: string;
  id?: number;
}

export interface Question {
  id: string;
  type: 'input' | 'radio' | 'checkbox' | 'custom';
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
  description: "Clear branching: New users (6 questions) vs Existing users (7 questions)",
  totalQuestions: 7,
  questions: [
    {
      id: "contact_info",
      type: "custom",
      label: "Almost done! Get your FREE recommendation",
      helpText: "Trusted by 1,000+ Indian traders • Your data stays private 🔒",
      field_name: "contact",
      validation: {
        required: true,
        customValidation: (data: unknown) => {
          const userData = data as { name?: string; mobile?: string };
          return (userData.name?.length || 0) >= 2 && (userData.mobile?.length || 0) >= 10;
        }
      }
    },
    {
      id: "demat_account_check",
      type: "radio",
      label: "Do you currently trade stocks?",
      helpText: "⏱️ Takes 60 seconds • Free personalized match",
      field_name: "hasAccount",
      options: [
        { label: "✓ Yes, I already trade", value: "yes" },
        { label: "✗ No, I'm new to trading", value: "no" }
      ],
      validation: { required: true }
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
      id: "user_type",
      type: "radio",
      label: "What's your PRIMARY goal?",
      helpText: "Pick the one that fits best",
      field_name: "userType",
      options: [
        { label: "📊 Build wealth long-term", value: "investor" },
        { label: "💰 Active trading for income", value: "trader" },
        { label: "📚 Learning markets first", value: "learner" },
        { label: "🎯 Already expert trader", value: "professional" }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "yes"
      },
      validation: { required: true }
    },
    {
      id: "main_challenge",
      type: "radio",
      label: "What's your BIGGEST frustration?",
      helpText: "Select the most important one",
      field_name: "mainChallenge",
      options: [
        { label: "💸 High charges eating profits", value: "charges" },
        { label: "📉 Platform crashes during trades", value: "reliability" },
        { label: "😤 Poor customer support", value: "support" },
        { label: "🔍 Need better research/tools", value: "research" },
        { label: "✅ I'm actually quite happy", value: "satisfied" }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "yes"
      },
      validation: { required: true }
    },
    {
      id: "trading_frequency",
      type: "radio",
      label: "How often do you trade?",
      field_name: "tradingFrequency",
      options: [
        { label: "Daily (multiple trades per day)", value: "daily" },
        { label: "Weekly (few trades per week)", value: "weekly" },
        { label: "Monthly (occasional trades)", value: "monthly" },
        { label: "Rarely (few times per year)", value: "rarely" }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "yes"
      },
      validation: { required: true }
    },
    {
      id: "what_matters_most",
      type: "radio",
      label: "What matters MOST to you?",
      helpText: "Choose your top priority",
      field_name: "whatMattersMost",
      options: [
        { label: "💰 Lowest possible charges", value: "cost" },
        { label: "⚡ Speed & reliability", value: "speed" },
        { label: "📊 Research & stock picks", value: "research" },
        { label: "🛠️ Advanced trading tools", value: "tools" },
        { label: "🎓 Learning & education", value: "education" }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "yes"
      },
      validation: { required: true }
    },
    // 🆕 NEW USER QUESTIONS (for hasAccount = "no") - ENHANCED FOR BETTER PERSONALIZATION
    {
      id: "new_user_type",
      type: "radio",
      label: "What's your PRIMARY goal?",
      field_name: "userType",
      helpText: "Pick the one that fits best",
      options: [
        { label: "📊 Build wealth long-term", value: "investor" },
        { label: "💰 Learn active trading", value: "trader" },
        { label: "📚 Just exploring markets", value: "learner" }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "no"
      },
      validation: { required: true }
    },
    {
      id: "new_user_investment_amount",
      type: "radio",
      label: "How much are you planning to start with?",
      field_name: "investmentAmount",
      helpText: "This helps us recommend the right platform for your budget",
      options: [
        { label: "Just exploring (under ₹10,000)", value: "exploring" },
        { label: "Small start (₹10,000 - ₹50,000)", value: "small" },
        { label: "Moderate (₹50,000 - ₹2,00,000)", value: "medium" },
        { label: "Serious investment (₹2,00,000+)", value: "large" }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "no"
      },
      validation: { required: true }
    },
    {
      id: "new_user_knowledge_level",
      type: "radio",
      label: "What's your current knowledge about stock markets?",
      field_name: "experienceLevel",
      helpText: "Be honest - this helps us recommend the right learning resources",
      options: [
        { label: "Complete beginner - know nothing", value: "beginner" },
        { label: "Some basic understanding", value: "intermediate" },
        { label: "Good understanding, ready to trade", value: "advanced" }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "no"
      },
      validation: { required: true }
    },
    {
      id: "new_user_trading_frequency_plan",
      type: "radio",
      label: "How often are you planning to trade?",
      field_name: "tradingFrequency",
      helpText: "This affects which broker saves you the most money",
      options: [
        { label: "Very rarely - long-term holdings only", value: "rarely" },
        { label: "Few times a month", value: "monthly" },
        { label: "Weekly - active trading", value: "weekly" },
        { label: "Daily - day trading", value: "daily" }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "no"
      },
      validation: { required: true }
    },
    {
      id: "new_user_priority",
      type: "radio",
      label: "What matters MOST to you?",
      field_name: "whatMattersMost",
      helpText: "Choose your top priority",
      options: [
        { label: "🎓 Best learning resources", value: "education" },
        { label: "💰 Lowest charges", value: "cost" },
        { label: "👍 Excellent support", value: "support" },
        { label: "📱 Easy-to-use app", value: "ease_of_use" },
        { label: "🏆 Trusted brand", value: "trust" }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "no"
      },
      validation: { required: true }
    }
  ]
};

// 🧪 VERSION B: Simplified Flow
// 🔄 VERSION B: Contact Form LAST (Better Conversion)
// Same as Version A, but contact_info moved to second-to-last position
export const QUESTION_FLOW_B: QuestionFlow = {
  name: "Contact Last Flow",
  description: "Find your perfect broker in 60 seconds",
  totalQuestions: 7,
  questions: [
    {
      id: "demat_account_check",
      type: "radio",
      label: "Do you currently trade stocks?",
      helpText: "⏱️ Takes 60 seconds • Free personalized match",
      field_name: "hasAccount",
      options: [
        { label: "✓ Yes, I already trade", value: "yes" },
        { label: "✗ No, I'm new to trading", value: "no" }
      ],
      validation: { required: true }
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
      id: "user_type",
      type: "radio",
      label: "What's your PRIMARY goal?",
      helpText: "Pick the one that fits best",
      field_name: "userType",
      options: [
        { label: "📊 Build wealth long-term", value: "investor" },
        { label: "💰 Active trading for income", value: "trader" },
        { label: "📚 Learning markets first", value: "learner" },
        { label: "🎯 Already expert trader", value: "professional" }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "yes"
      },
      validation: { required: true }
    },
    {
      id: "main_challenge",
      type: "radio",
      label: "What's your BIGGEST frustration?",
      helpText: "Select the most important one",
      field_name: "mainChallenge",
      options: [
        { label: "💸 High charges eating profits", value: "charges" },
        { label: "📉 Platform crashes during trades", value: "reliability" },
        { label: "😤 Poor customer support", value: "support" },
        { label: "🔍 Need better research/tools", value: "research" },
        { label: "✅ I'm actually quite happy", value: "satisfied" }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "yes"
      },
      validation: { required: true }
    },
    {
      id: "trading_frequency",
      type: "radio",
      label: "How often do you trade?",
      field_name: "tradingFrequency",
      options: [
        { label: "Very rarely - long-term holdings", value: "rarely" },
        { label: "Few times a month", value: "monthly" },
        { label: "Weekly - active trading", value: "weekly" },
        { label: "Daily - day trading", value: "daily" }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "yes"
      },
      validation: { required: true }
    },
    {
      id: "most_important",
      type: "radio",
      label: "What matters MOST to you?",
      helpText: "Choose your top priority",
      field_name: "mostImportant",
      options: [
        { label: "💰 Lowest possible charges", value: "charges" },
        { label: "⚡ Speed & reliability", value: "speed" },
        { label: "🛠️ Advanced trading tools", value: "tools" },
        { label: "👍 Good customer support", value: "support" },
        { label: "🎓 Learning & education", value: "education" }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "yes"
      },
      validation: { required: true }
    },
    {
      id: "new_user_type",
      type: "radio",
      label: "What's your PRIMARY goal?",
      field_name: "userType",
      helpText: "Pick the one that fits best",
      options: [
        { label: "📊 Build wealth long-term", value: "investor" },
        { label: "💰 Learn active trading", value: "trader" },
        { label: "📚 Just exploring markets", value: "learner" }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "no"
      },
      validation: { required: true }
    },
    {
      id: "new_user_investment_amount",
      type: "radio",
      label: "How much are you planning to invest?",
      field_name: "investmentAmount",
      helpText: "This helps us recommend the right account type",
      options: [
        { label: "Under ₹50,000 - starting small", value: "small" },
        { label: "₹50,000 - ₹2,00,000 - moderate amount", value: "medium" },
        { label: "₹2,00,000 - ₹10,00,000 - significant capital", value: "large" },
        { label: "Over ₹10,00,000 - serious investment", value: "very_large" }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "no"
      },
      validation: { required: true }
    },
    {
      id: "new_user_experience",
      type: "radio",
      label: "Your experience with stock markets?",
      field_name: "experienceLevel",
      helpText: "Be honest - this helps us recommend the right learning resources",
      options: [
        { label: "Complete beginner - know nothing", value: "beginner" },
        { label: "Some basic understanding", value: "intermediate" },
        { label: "Good understanding, ready to trade", value: "advanced" }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "no"
      },
      validation: { required: true }
    },
    {
      id: "new_user_trading_frequency_plan",
      type: "radio",
      label: "How often are you planning to trade?",
      field_name: "tradingFrequency",
      helpText: "This affects which broker saves you the most money",
      options: [
        { label: "Very rarely - long-term holdings only", value: "rarely" },
        { label: "Few times a month", value: "monthly" },
        { label: "Weekly - active trading", value: "weekly" },
        { label: "Daily - day trading", value: "daily" }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "no"
      },
      validation: { required: true }
    },
    // ⭐ CONTACT FORM - MOVED TO SECOND-TO-LAST POSITION
    {
      id: "contact_info",
      type: "custom",
      label: "Almost done! Get your FREE recommendation",
      helpText: "Trusted by 1,000+ Indian traders • Your data stays private 🔒",
      field_name: "contact",
      validation: {
        required: true,
        customValidation: (data: unknown) => {
          const userData = data as { name?: string; mobile?: string };
          return (userData.name?.length || 0) >= 2 && (userData.mobile?.length || 0) >= 10;
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
        required: true,
        customValidation: (data: unknown) => {
          const userData = data as { name?: string; mobile?: string };
          return (userData.name?.length || 0) >= 2 && (userData.mobile?.length || 0) >= 10;
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