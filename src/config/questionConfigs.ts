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
      label: "Get your personalized broker recommendation",
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
      label: "Do you have a demat account with any broker?",
      field_name: "hasAccount",
      options: [
        { label: "Yes, I have a demat account", value: "yes" },
        { label: "No, I'm completely new", value: "no" }
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
      type: "checkbox",
      label: "Which best describes you?",
      field_name: "userType",
      options: [
        { label: "Long-term investor", value: "investor" },
        { label: "Active trader", value: "trader" },
        { label: "Learning & exploring", value: "learner" },
        { label: "Professional trader", value: "professional" }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "yes"
      },
      validation: { required: true }
    },
    {
      id: "main_challenge",
      type: "checkbox",
      label: "What challenges do you face?",
      field_name: "mainChallenge",
      options: [
        { label: "High charges", value: "charges" },
        { label: "Platform crashes", value: "reliability" },
        { label: "Poor support", value: "support" },
        { label: "Lack of research", value: "research" },
        { label: "Limited tools", value: "tools" },
        { label: "No major issues", value: "satisfied" }
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
      type: "checkbox",
      label: "What matters to you?",
      field_name: "whatMattersMost",
      options: [
        { label: "Low charges", value: "cost" },
        { label: "Speed & reliability", value: "speed" },
        { label: "Research & picks", value: "research" },
        { label: "Advanced tools", value: "tools" },
        { label: "Good support", value: "support" },
        { label: "Education", value: "education" }
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
      type: "checkbox",
      label: "What best describes your goal?",
      field_name: "userType",
      helpText: "Select all that apply - helps us understand your needs better",
      options: [
        { label: "Start investing for long-term wealth", value: "investor" },
        { label: "Learn trading actively", value: "trader" },
        { label: "Explore and understand markets first", value: "learner" }
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
      type: "checkbox",
      label: "What matters most to you when choosing a broker?",
      field_name: "whatMattersMost",
      helpText: "Select your top priorities - we'll match you accordingly",
      options: [
        { label: "Best learning resources & education", value: "education" },
        { label: "Absolutely lowest charges", value: "cost" },
        { label: "Excellent customer support", value: "support" },
        { label: "User-friendly mobile app", value: "ease_of_use" },
        { label: "Trusted brand with large user base", value: "trust" }
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
export const QUESTION_FLOW_B: QuestionFlow = {
  name: "Simplified",
  description: "Shorter, more direct questions for faster completion",
  totalQuestions: 5,
  questions: [
    {
      id: "contact_info",
      type: "custom",
      label: "Quick broker recommendation in 2 minutes",
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
      id: "trading_goal",
      type: "radio",
      label: "What's your main trading goal?",
      field_name: "tradingGoal",
      options: [
        { label: "Learn and start investing slowly", value: "learning" },
        { label: "Make money through active trading", value: "profit" },
        { label: "Professional day trading", value: "professional" }
      ],
      validation: { required: true }
    },
    {
      id: "investment_amount",
      type: "radio",
      label: "How much do you plan to invest initially?",
      field_name: "investmentAmount",
      options: [
        { label: "Under ₹50,000", value: "small" },
        { label: "₹50,000 - ₹2,00,000", value: "medium" },
        { label: "₹2,00,000 - ₹10,00,000", value: "large" },
        { label: "Over ₹10,00,000", value: "very_large" }
      ],
      validation: { required: true }
    },
    {
      id: "current_broker_quick",
      type: "radio",
      label: "Do you have a broker currently?",
      field_name: "currentBrokerQuick",
      options: [
        { label: "Yes, and I'm happy with them", value: "satisfied" },
        { label: "Yes, but have some issues", value: "issues" },
        { label: "No broker yet", value: "none" }
      ],
      validation: { required: true }
    },
    {
      id: "main_concern",
      type: "radio",
      label: "What concerns you most about trading?",
      field_name: "mainConcern",
      options: [
        { label: "High charges eating my profits", value: "charges" },
        { label: "Making wrong investment decisions", value: "decisions" },
        { label: "Platform being slow or unreliable", value: "reliability" },
        { label: "Not understanding how to use tools", value: "complexity" }
      ],
      validation: { required: true }
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
export const ACTIVE_QUESTION_CONFIG = QUESTION_FLOW_A;

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