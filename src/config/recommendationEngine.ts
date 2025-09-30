// 🧠 RECOMMENDATION ENGINE - Smart broker matching logic

import { BROKER_CONFIGS, BROKER_ISSUES, BROKER_SOLUTIONS, BROKER_BUSINESS_PRIORITY } from './brokerConfigs';

export interface UserProfile extends Record<string, unknown> {
  // Contact info
  name: string;
  mobile: string;

  // Core questions (ENHANCED TWO-PATH FLOW)
  hasAccount?: string;
  brokerCount?: string; // NEW: How many brokers user has
  currentBrokers?: string[]; // Handle multiple brokers selection
  userType?: string; // NEW: investor/trader/learner/professional
  mainChallenge?: string; // NEW: Biggest challenge with current broker
  tradingFrequency?: string; // NEW: Enhanced trading frequency
  whatMattersMost?: string; // NEW: Most important factor

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
      priority: userProfile.whatMattersMost || userProfile.tradingPriority || userProfile.topPriority || 'balanced',
      frequency: userProfile.tradingFrequency || 'moderate',
      experience: userProfile.experienceLevel || 'intermediate',
      challenge: userProfile.mainChallenge || userProfile.mainIssue || 'none',
      brokerCount: userProfile.brokerCount || '0'
    }
  };
};

// 📊 OLD SCORING ALGORITHM - REMOVED
// Now using business priority-based recommendation system

// 🔄 HELPER FUNCTIONS
const getCurrentBrokers = (profile: UserProfile): string[] => {
  // Handle both single broker (legacy) and multiple brokers (FluentForm)
  if (profile.currentBrokers && profile.currentBrokers.length > 0) {
    return profile.currentBrokers;
  }
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

const getFrequencyFromGoal = (goal?: string): string => {
  switch(goal) {
    case 'professional': return 'daily';
    case 'profit': return 'weekly';
    case 'learning': return 'monthly';
    default: return 'weekly';
  }
};

const getExperienceFromGoal = (goal?: string): string => {
  switch(goal) {
    case 'professional': return 'expert';
    case 'profit': return 'intermediate';
    case 'learning': return 'beginner';
    default: return 'novice';
  }
};

const getUserType = (profile: UserProfile): string => {
  // Use new userType field first, then fall back to legacy fields
  if (profile.userType) {
    switch(profile.userType) {
      case 'investor': return 'Long-term Investor';
      case 'trader': return 'Active Trader';
      case 'learner': return 'Learning Explorer';
      case 'professional': return 'Professional Trader';
      default: return 'Active Trader';
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

const applyIssueAdjustments = (scores: Record<string, number>, issue: string) => {
  switch(issue) {
    case 'speed':
      scores['upstox'] += 3;
      scores['fyers'] += 2;
      scores['zerodha'] -= 2;
      break;
    case 'charges':
      scores['5paisa'] += 3;
      scores['zerodha'] += 2;
      scores['angel_one'] -= 1;
      break;
    case 'support':
      scores['angel_one'] += 3;
      scores['upstox'] += 1;
      scores['zerodha'] -= 2;
      break;
    case 'tools':
      scores['fyers'] += 3;
      scores['upstox'] += 2;
      scores['5paisa'] -= 2;
      break;
  }
};

const applyInvestmentAmountAdjustments = (scores: Record<string, number>, amount: string) => {
  switch(amount) {
    case 'small':
      scores['zerodha'] += 2;
      scores['5paisa'] += 1;
      break;
    case 'very_large':
      scores['fyers'] += 2;
      scores['angel_one'] += 2;
      scores['5paisa'] -= 1;
      break;
  }
};

const applySatisfactionAdjustments = (scores: Record<string, number>, satisfaction: string, currentBroker?: string) => {
  const satisfactionLevel = parseInt(satisfaction);
  if (satisfactionLevel >= 4 && currentBroker) {
    // User is satisfied, don't recommend switching
    scores[currentBroker] += 5;
  }
};

const convertScoresToRecommendations = (scores: Record<string, number>): BrokerRecommendation[] => {
  const maxScore = Math.max(...Object.values(scores));

  return Object.entries(scores)
    .map(([brokerId, score]) => {
      const broker = BROKER_CONFIGS[brokerId];
      return {
        brokerId,
        brokerName: broker.name,
        score,
        reasons: generateReasons(brokerId, score),
        affiliate_url: broker.affiliate_url,
        matchPercentage: Math.round((score / maxScore) * 100)
      };
    })
    .sort((a, b) => b.score - a.score);
};

const generateReasons = (brokerId: string, score: number): string[] => {
  const broker = BROKER_CONFIGS[brokerId];
  const reasons = [];

  // Add top 2-3 pros as reasons
  reasons.push(...broker.real_insights.pros.slice(0, 2));

  // Add specific reason based on score
  if (score > 12) {
    reasons.push("Perfect match for your trading profile");
  } else if (score > 10) {
    reasons.push("Great fit with minor trade-offs");
  }

  return reasons;
};

const determineShouldSwitch = (profile: UserProfile, primary: BrokerRecommendation): boolean => {
  // Don't recommend switching if user is satisfied
  if (profile.satisfaction && parseInt(profile.satisfaction) >= 4) {
    return false;
  }

  // Don't recommend switching if already using the recommended broker
  if (profile.currentBroker === primary.brokerId) {
    return false;
  }

  // Recommend switching if they have specific issues
  if (profile.mainIssue && profile.mainIssue !== 'satisfied') {
    return true;
  }

  // Recommend switching if match percentage is significantly better
  return primary.matchPercentage >= 85;
};

// 🎯 NEW ISSUE-BASED REASONING SYSTEM
const generateSpecificReasons = (currentBrokers: string[], recommendedBrokerId: string, userProfile: UserProfile): string[] => {
  const recommendedBroker = BROKER_CONFIGS[recommendedBrokerId];
  const reasons = [];

  // CHALLENGE-BASED REASONING (NEW ENHANCED APPROACH)
  const challenge = userProfile.mainChallenge || userProfile.mainIssue;
  const whatMatters = userProfile.whatMattersMost || userProfile.tradingPriority;
  const userType = userProfile.userType;
  const frequency = userProfile.tradingFrequency;

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

const generateIssueBasedReasoning = (currentBrokers: string[], recommendedBrokerId: string, profile: UserProfile): string => {
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
    // Single broker user - highlight specific issues with current broker
    const currentBroker = currentBrokers[0];
    const issues = BROKER_ISSUES[currentBroker as keyof typeof BROKER_ISSUES];
    const solutions = BROKER_SOLUTIONS[recommendedBrokerId as keyof typeof BROKER_SOLUTIONS];

    let reasoning = `**Why ${recommendedBroker.name} is better than your current ${BROKER_CONFIGS[currentBroker]?.name}:**

`;

    // Highlight 2-3 specific issues with current broker
    if (issues) {
      const issueList = Object.values(issues);
      reasoning += `**Problems with ${BROKER_CONFIGS[currentBroker]?.name}:**
• ${issueList[0]}
• ${issueList[1]}

`;
    }

    // Show how recommended broker solves these
    const solutionKey = `from_${currentBroker}` as keyof typeof solutions;
    const specificSolution = solutions?.[solutionKey];
    if (specificSolution) {
      reasoning += `**How ${recommendedBroker.name} fixes this:**
• ${specificSolution}
• ${recommendedBroker.real_insights.perfect_for}`;
    }

    return reasoning;
  }

  // Multiple brokers - show optimization strategy
  return `**You have ${currentBrokers.length} brokers. Here's why adding ${recommendedBroker.name} optimizes your setup:**

• ${recommendedBroker.real_insights.perfect_for}
• Fills the gap that your current brokers don't cover
• ${recommendedBroker.real_insights.cost_summary}

Complete your trading toolkit with the missing piece.`;
};

const generateReasoning = (profile: UserProfile, primary: BrokerRecommendation): string => {
  // This function is kept for compatibility but redirects to new logic
  return generateIssueBasedReasoning(getCurrentBrokers(profile), primary.brokerId, profile);
};