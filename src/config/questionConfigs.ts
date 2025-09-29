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
    customValidation?: (value: any) => boolean;
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

// 🔄 VERSION A: Current System (Improved)
export const QUESTION_FLOW_A: QuestionFlow = {
  name: "Current Improved",
  description: "Current system with better neutral questions",
  totalQuestions: 7,
  questions: [
    {
      id: "contact_info",
      type: "custom",
      label: "Let's get started with your personalized assessment",
      field_name: "contact",
      validation: {
        required: true,
        customValidation: (data: any) => {
          return data.name?.length >= 2 && data.mobile?.length >= 10;
        }
      }
    },
    {
      id: "account_status",
      type: "radio",
      label: "Do you currently have a trading/demat account?",
      field_name: "hasAccount",
      options: [
        { label: "Yes, I actively trade", value: "active" },
        { label: "Yes, but I rarely use it", value: "inactive" },
        { label: "No, I'm completely new", value: "none" }
      ],
      validation: { required: true }
    },
    {
      id: "current_broker",
      type: "radio",
      label: "Which broker do you currently use?",
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
        showIf: "hasAccount",
        equals: "active"
      },
      validation: { required: true }
    },
    {
      id: "trading_priority",
      type: "radio",
      label: "What's most important to you in trading?",
      field_name: "tradingPriority",
      options: [
        { label: "Fast execution speed", value: "speed" },
        { label: "Low charges and fees", value: "cost" },
        { label: "Advanced tools and charts", value: "tools" },
        { label: "Good customer support", value: "support" },
        { label: "Learning and education", value: "education" }
      ],
      validation: { required: true }
    },
    {
      id: "trading_frequency",
      type: "radio",
      label: "How often do you plan to trade?",
      field_name: "tradingFrequency",
      options: [
        { label: "Daily (intraday trading)", value: "daily" },
        { label: "Weekly (short-term)", value: "weekly" },
        { label: "Monthly (long-term)", value: "monthly" },
        { label: "Rarely (buy and hold)", value: "rarely" }
      ],
      validation: { required: true }
    },
    {
      id: "experience_level",
      type: "radio",
      label: "What's your trading experience?",
      field_name: "experienceLevel",
      options: [
        { label: "Complete beginner", value: "beginner" },
        { label: "Made a few trades", value: "novice" },
        { label: "Reasonable experience", value: "intermediate" },
        { label: "Very experienced", value: "expert" }
      ],
      validation: { required: true }
    },
    {
      id: "main_issue",
      type: "radio",
      label: "What's the biggest issue with your current broker?",
      field_name: "mainIssue",
      options: [
        { label: "Slow execution during market hours", value: "speed" },
        { label: "High or hidden charges", value: "charges" },
        { label: "Poor customer support", value: "support" },
        { label: "Limited tools and features", value: "tools" },
        { label: "Actually, I'm quite satisfied", value: "satisfied" }
      ],
      conditional: {
        showIf: "hasAccount",
        equals: "active"
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
        customValidation: (data: any) => {
          return data.name?.length >= 2 && data.mobile?.length >= 10;
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
        customValidation: (data: any) => {
          return data.name?.length >= 2 && data.mobile?.length >= 10;
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

export const shouldShowQuestion = (question: Question, userData: any) => {
  if (!question.conditional) return true;
  return userData[question.conditional.showIf] === question.conditional.equals;
};

export const validateQuestion = (question: Question, value: any, userData?: any) => {
  if (!question.validation) return true;

  if (question.validation.required && (!value || value === '')) {
    return false;
  }

  if (question.validation.minLength && value.length < question.validation.minLength) {
    return false;
  }

  if (question.validation.pattern && !new RegExp(question.validation.pattern).test(value)) {
    return false;
  }

  if (question.validation.customValidation && !question.validation.customValidation(userData || value)) {
    return false;
  }

  return true;
};