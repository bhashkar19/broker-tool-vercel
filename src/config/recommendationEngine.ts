// 🧠 RECOMMENDATION ENGINE - Smart broker matching logic

import { BROKER_CONFIGS, BROKER_ISSUES, BROKER_SOLUTIONS, BROKER_BUSINESS_PRIORITY } from './brokerConfigs';
import { COMPREHENSIVE_BROKER_ISSUES, QUESTIONNAIRE_TO_ISSUES_MAP } from './comprehensiveBrokerIssues';

export interface UserProfile extends Record<string, unknown> {
  // Contact info
  name: string;
  mobile: string;

  // Core questions (ENHANCED TWO-PATH FLOW)
  hasAccount?: string;
  brokerInfo?: { count?: string; brokers?: string[] }; // NEW: Combined broker count + selection
  brokerCount?: string; // Legacy: How many brokers user has
  currentBrokers?: string[]; // Legacy: Handle multiple brokers selection
  userType?: string[] | string; // NEW: investor/trader/learner/professional (now multi-select)
  mainChallenge?: string[] | string; // NEW: Challenges with current broker (now multi-select)
  tradingFrequency?: string; // NEW: Enhanced trading frequency (kept single)
  whatMattersMost?: string[] | string; // NEW: Important factors (now multi-select)

  // Legacy fields (keep for compatibility)
  investmentPurpose?: string;
  currentBroker?: string;
  experienceLevel?: string;
  mainIssue?: string;
  tradingPriority?: string;
  tradingGoal?: string;
  investmentAmount?: string;
  currentBrokerQuick?: string;
  mainConcern?: string;

  // Detailed flow questions (legacy)
  accountStatus?: string;
  tradingStyle?: string;
  monthlyVolume?: string;
  topPriority?: string;
  satisfaction?: string;
  switchingReason?: string;
  learningPreference?: string;

  sessionId: string;
}

export interface BrokerRecommendation {
  brokerId: string;
  brokerName: string;
  score: number;
  reasons: string[];
  affiliate_url: string;
  matchPercentage: number;
}

export interface RecommendationResult {
  primary: BrokerRecommendation;
  alternatives: BrokerRecommendation[];
  reasoning: string;
  shouldSwitch: boolean;
  userProfile: {
    type: string;
    priority: string;
    frequency: string;
    experience: string;
    challenge: string;
    brokerCount: string;
  };
}

// 🎯 MAIN RECOMMENDATION ENGINE - NEW BUSINESS-FOCUSED LOGIC
export const generateRecommendation = (userProfile: UserProfile): RecommendationResult => {
  // Step 1: Get current brokers (never recommend these)
  const currentBrokers = getCurrentBrokers(userProfile);

  // Step 2: Get available brokers (exclude current ones)
  const availableBrokers = getAvailableBrokers(currentBrokers);

  // Step 3: Select best broker from available ones based on business priority
  const recommendedBrokerId = selectBestBrokerFromAvailable(availableBrokers);

  // Step 4: Create single recommendation
  const primary: BrokerRecommendation = {
    brokerId: recommendedBrokerId,
    brokerName: BROKER_CONFIGS[recommendedBrokerId].name,
    score: 100, // Always show as perfect match
    reasons: generateSpecificReasons(currentBrokers, recommendedBrokerId, userProfile),
    affiliate_url: BROKER_CONFIGS[recommendedBrokerId].affiliate_url,
    matchPercentage: 95 // Always show high match to create confidence
  };

  // Step 5: Generate issue-based reasoning
  const reasoning = generateIssueBasedReasoning(currentBrokers, recommendedBrokerId, userProfile);

  // Step 6: Always recommend switching to new broker (business logic)
  const shouldSwitch = currentBrokers.length > 0;

  return {
    primary,
    alternatives: [], // No alternatives - single recommendation only
    reasoning,
    shouldSwitch,
    userProfile: {
      type: getUserType(userProfile),
      priority: getArrayFromField(userProfile.whatMattersMost)?.[0] || userProfile.tradingPriority || userProfile.topPriority || 'balanced',
      frequency: userProfile.tradingFrequency || 'moderate',
      experience: userProfile.experienceLevel || 'intermediate',
      challenge: getArrayFromField(userProfile.mainChallenge)?.[0] || userProfile.mainIssue || 'none',
      brokerCount: userProfile.brokerInfo?.count || userProfile.brokerCount || '0'
    }
  };
};

// 📊 OLD SCORING ALGORITHM - REMOVED
// Now using business priority-based recommendation system

// 🔄 HELPER FUNCTIONS
const getArrayFromField = (field: string[] | string | undefined): string[] | undefined => {
  if (!field) return undefined;

  if (Array.isArray(field)) {
    return field;
  }

  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [field];
    } catch {
      return [field];
    }
  }

  return undefined;
};
const getCurrentBrokers = (profile: UserProfile): string[] => {
  // Handle new combined broker data structure first
  if (profile.brokerInfo?.brokers && profile.brokerInfo.brokers.length > 0) {
    return profile.brokerInfo.brokers;
  }

  // Handle legacy multiple brokers (FluentForm/old structure)
  if (profile.currentBrokers && profile.currentBrokers.length > 0) {
    return profile.currentBrokers;
  }

  // Handle legacy single broker
  if (profile.currentBroker && profile.currentBroker !== 'none') {
    return [profile.currentBroker];
  }

  return [];
};

const getAvailableBrokers = (currentBrokers: string[]): string[] => {
  // Get all broker IDs from our config
  const allBrokers = Object.keys(BROKER_CONFIGS);

  // Filter out brokers user already has
  return allBrokers.filter(brokerId => !currentBrokers.includes(brokerId));
};

const selectBestBrokerFromAvailable = (availableBrokers: string[]): string => {
  // If no brokers available (user has all our brokers), return highest priority
  if (availableBrokers.length === 0) {
    return 'zerodha'; // Fallback to highest priority
  }

  // Find broker with highest business priority from available ones
  let bestBroker = availableBrokers[0];
  let bestPriority = BROKER_BUSINESS_PRIORITY[bestBroker as keyof typeof BROKER_BUSINESS_PRIORITY] || 999;

  for (const brokerId of availableBrokers) {
    const priority = BROKER_BUSINESS_PRIORITY[brokerId as keyof typeof BROKER_BUSINESS_PRIORITY] || 999;
    if (priority < bestPriority) {
      bestPriority = priority;
      bestBroker = brokerId;
    }
  }

  return bestBroker;
};


const getUserType = (profile: UserProfile): string => {
  // Handle new multi-select userType field
  if (profile.userType) {
    let userTypes: string[] = [];

    // Handle both array and string formats
    if (Array.isArray(profile.userType)) {
      userTypes = profile.userType;
    } else if (typeof profile.userType === 'string') {
      try {
        userTypes = JSON.parse(profile.userType);
      } catch {
        userTypes = [profile.userType];
      }
    }

    // Return combined types or first one
    if (userTypes.length > 1) {
      return userTypes.map(type => {
        switch(type) {
          case 'investor': return 'Investor';
          case 'trader': return 'Trader';
          case 'learner': return 'Learner';
          case 'professional': return 'Pro';
          default: return type;
        }
      }).join(' + ');
    } else if (userTypes.length === 1) {
      switch(userTypes[0]) {
        case 'investor': return 'Long-term Investor';
        case 'trader': return 'Active Trader';
        case 'learner': return 'Learning Explorer';
        case 'professional': return 'Professional Trader';
        default: return 'Active Trader';
      }
    }
  }

  // Legacy logic for backward compatibility
  if (profile.investmentPurpose === 'gain_knowledge' || profile.experienceLevel === 'beginner') {
    return 'Learning Investor';
  }
  if (profile.investmentPurpose === 'day_trader' || profile.experienceLevel === 'expert') {
    return 'Day Trader';
  }
  if (profile.investmentPurpose === 'earn_money') {
    return 'Wealth Builder';
  }
  return 'Active Trader';
};


// 🎯 NEW ISSUE-BASED REASONING SYSTEM
const generateSpecificReasons = (currentBrokers: string[], recommendedBrokerId: string, userProfile: UserProfile): string[] => {
  const recommendedBroker = BROKER_CONFIGS[recommendedBrokerId];
  const reasons = [];

  // CHALLENGE-BASED REASONING (NEW ENHANCED APPROACH)
  // Handle multi-select fields
  const challenges = getArrayFromField(userProfile.mainChallenge) || getArrayFromField(userProfile.mainIssue) || [];
  const whatMattersArray = getArrayFromField(userProfile.whatMattersMost) || getArrayFromField(userProfile.tradingPriority) || [];
  const userTypes = getArrayFromField(userProfile.userType) || [];
  const frequency = userProfile.tradingFrequency;

  // Use first values for legacy compatibility
  const challenge = challenges[0];
  const whatMatters = whatMattersArray[0];
  const userType = userTypes[0];

  // Add challenge-specific solution first (most important)
  if (challenge && currentBrokers.length > 0) {
    const solutions = BROKER_SOLUTIONS[recommendedBrokerId as keyof typeof BROKER_SOLUTIONS];
    if (solutions) {
      const solutionKey = `from_${currentBrokers[0]}` as keyof typeof solutions;
      const specificSolution = solutions[solutionKey];
      if (specificSolution) {
        reasons.push(specificSolution);
      }
    }
  }

  // Add what-matters-most specific reason
  if (whatMatters === 'education' && recommendedBrokerId === 'zerodha') {
    reasons.push("Comprehensive learning resources including Varsity courses, market tutorials, and beginner guides");
  } else if (whatMatters === 'cost' && recommendedBrokerId === 'zerodha') {
    reasons.push("Lowest total cost structure: ₹0 delivery brokerage + ₹300 AMC = just ₹25/month");
  } else if (whatMatters === 'speed' && recommendedBrokerId === 'upstox') {
    reasons.push("Consistently faster execution than competitors during high-volume market hours");
  } else if (whatMatters === 'tools' && recommendedBrokerId === 'fyers') {
    reasons.push("Most advanced technical analysis tools and professional-grade charting platform");
  } else if (whatMatters === 'support' && recommendedBrokerId === 'angel_one') {
    reasons.push("Dedicated relationship managers and human customer support - not just chatbots");
  } else if (whatMatters === 'research' && recommendedBrokerId === 'angel_one') {
    reasons.push("Professional research team provides daily stock recommendations and market insights");
  }

  // Add user-type specific reason
  if (userType === 'learner' && recommendedBrokerId === 'zerodha') {
    reasons.push("Perfect for beginners: Varsity courses teach you everything from basics to advanced strategies");
  } else if (userType === 'professional' && recommendedBrokerId === 'fyers') {
    reasons.push("Advanced API access and algorithmic trading capabilities for professional traders");
  } else if (userType === 'investor' && recommendedBrokerId === 'zerodha') {
    reasons.push("Zero delivery brokerage means more money stays invested for long-term wealth building");
  } else if (userType === 'trader' && frequency === 'daily' && recommendedBrokerId === 'upstox') {
    reasons.push("Superior execution speed crucial for daily trading strategies");
  }

  // Add general broker strength if no specific reasons yet
  if (reasons.length === 0) {
    reasons.push(recommendedBroker.real_insights.perfect_for);
  }

  // Always include cost advantage if Zerodha
  if (recommendedBrokerId === 'zerodha' && !reasons.some(r => r.includes('cost') || r.includes('₹'))) {
    reasons.push("Zero delivery brokerage saves thousands in trading costs annually");
  }

  return reasons.slice(0, 3); // Limit to top 3 most relevant reasons
};

// 🎯 NEW COMPREHENSIVE SINGLE BROKER VALIDATION SYSTEM
const generateSingleBrokerValidation = (currentBroker: string, recommendedBrokerId: string, userProfile?: UserProfile): string => {
  const currentBrokerData = BROKER_CONFIGS[currentBroker];
  const recommendedBroker = BROKER_CONFIGS[recommendedBrokerId];
  const currentBrokerIssues = COMPREHENSIVE_BROKER_ISSUES[currentBroker];

  if (!currentBrokerData || !currentBrokerIssues) {
    // Fallback to simple reasoning if comprehensive data not available
    return `**${recommendedBroker.name} is a great addition to your trading setup:**

• ${recommendedBroker.real_insights.perfect_for}
• ${recommendedBroker.real_insights.cost_summary}`;
  }

  let reasoning = `**We understand your concerns with ${currentBrokerData.name}:**\n\n`;

  // 1. ACKNOWLEDGE USER-SELECTED ISSUES (Validation & Empathy)
  const userChallenges = getArrayFromField(userProfile?.mainChallenge) || [];
  const acknowledgedIssues: string[] = [];

  userChallenges.forEach(challenge => {
    const issueKey = QUESTIONNAIRE_TO_ISSUES_MAP[challenge as keyof typeof QUESTIONNAIRE_TO_ISSUES_MAP];
    if (issueKey && issueKey !== 'none' && currentBrokerIssues.user_selectable[issueKey]) {
      acknowledgedIssues.push(`• **${capitalize(challenge)}**: ${currentBrokerIssues.user_selectable[issueKey]}`);
    }
  });

  if (acknowledgedIssues.length > 0) {
    reasoning += `**Issues you've experienced (we hear you):**\n${acknowledgedIssues.join('\n')}\n\n`;
  }

  // 2. ADD EXPERT INSIGHTS (Additional problems users didn't think of)
  if (currentBrokerIssues.additional_insights.length > 0) {
    const topInsights = currentBrokerIssues.additional_insights.slice(0, 2);
    reasoning += `**Additional challenges we've observed:**\n`;
    topInsights.forEach(insight => {
      reasoning += `• ${insight}\n`;
    });
    reasoning += '\n';
  }

  // 3. SHOW HOW RECOMMENDED BROKER ADDRESSES THESE
  reasoning += `**How ${recommendedBroker.name} addresses these concerns:**\n`;
  reasoning += `• ${recommendedBroker.real_insights.perfect_for}\n`;
  reasoning += `• ${recommendedBroker.real_insights.cost_summary}\n\n`;

  // 4. BALANCED PERSPECTIVE - Acknowledge current broker's strengths
  if (currentBrokerIssues.positive_aspects.length > 0) {
    const topPositive = currentBrokerIssues.positive_aspects.slice(0, 2);
    reasoning += `**${currentBrokerData.name} has its strengths too:**\n`;
    topPositive.forEach(positive => {
      reasoning += `• ${positive}\n`;
    });
    reasoning += `\nBut ${recommendedBroker.name} fills the gaps where you need improvement.`;
  }

  return reasoning;
};

// Helper function to capitalize first letter
const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const generateIssueBasedReasoning = (currentBrokers: string[], recommendedBrokerId: string, userProfile?: UserProfile): string => {
  const recommendedBroker = BROKER_CONFIGS[recommendedBrokerId];

  if (currentBrokers.length === 0) {
    // New user - simple reasoning
    return `**${recommendedBroker.name} is perfect for starting your investing journey:**

• ${recommendedBroker.real_insights.perfect_for}
• ${recommendedBroker.real_insights.cost_summary}
• ${recommendedBroker.real_insights.why_we_recommend}

Start with India's most trusted broker - no need to switch later.`;
  }

  if (currentBrokers.length === 1) {
    return generateSingleBrokerValidation(currentBrokers[0], recommendedBrokerId, userProfile);
  }

  // Multiple brokers - show optimization strategy
  return `**You have ${currentBrokers.length} brokers. Here's why adding ${recommendedBroker.name} optimizes your setup:**

• ${recommendedBroker.real_insights.perfect_for}
• Fills the gap that your current brokers don't cover
• ${recommendedBroker.real_insights.cost_summary}

Complete your trading toolkit with the missing piece.`;
};

