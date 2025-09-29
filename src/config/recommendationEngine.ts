// 🧠 RECOMMENDATION ENGINE - Smart broker matching logic

import { BROKER_CONFIGS, PRIORITY_SCORING, FREQUENCY_SCORING, EXPERIENCE_SCORING } from './brokerConfigs';

export interface UserProfile {
  // Contact info
  name: string;
  mobile: string;

  // Core questions
  hasAccount?: string;
  currentBroker?: string;
  tradingPriority?: string;
  tradingFrequency?: string;
  experienceLevel?: string;
  mainIssue?: string;

  // Alternative flow questions
  tradingGoal?: string;
  investmentAmount?: string;
  currentBrokerQuick?: string;
  mainConcern?: string;

  // Detailed flow questions
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

// 🎯 MAIN RECOMMENDATION ENGINE
export const generateRecommendation = (userProfile: UserProfile): RecommendationResult => {
  const scores = calculateBrokerScores(userProfile);
  const brokerRecommendations = convertScoresToRecommendations(scores);

  const primary = brokerRecommendations[0];
  const alternatives = brokerRecommendations.slice(1, 3);

  const shouldSwitch = determineShouldSwitch(userProfile, primary);
  const reasoning = generateReasoning(userProfile, primary, shouldSwitch);

  return {
    primary,
    alternatives,
    reasoning,
    shouldSwitch,
    userProfile: {
      type: getUserType(userProfile),
      priority: userProfile.tradingPriority || userProfile.topPriority || 'balanced',
      frequency: userProfile.tradingFrequency || 'moderate',
      experience: userProfile.experienceLevel || 'intermediate'
    }
  };
};

// 📊 SCORING ALGORITHM
const calculateBrokerScores = (profile: UserProfile): Record<string, number> => {
  const scores: Record<string, number> = {};

  // Initialize all brokers with base scores
  Object.keys(BROKER_CONFIGS).forEach(brokerId => {
    scores[brokerId] = 5; // Base score
  });

  // Priority-based scoring
  const priority = profile.tradingPriority || profile.topPriority || profile.mainConcern;
  if (priority && PRIORITY_SCORING[priority as keyof typeof PRIORITY_SCORING]) {
    const priorityScores = PRIORITY_SCORING[priority as keyof typeof PRIORITY_SCORING];
    Object.entries(priorityScores).forEach(([brokerId, score]) => {
      scores[brokerId] += score * 0.4; // 40% weight
    });
  }

  // Frequency-based scoring
  const frequency = profile.tradingFrequency || getFrequencyFromGoal(profile.tradingGoal);
  if (frequency && FREQUENCY_SCORING[frequency as keyof typeof FREQUENCY_SCORING]) {
    const frequencyScores = FREQUENCY_SCORING[frequency as keyof typeof FREQUENCY_SCORING];
    Object.entries(frequencyScores).forEach(([brokerId, score]) => {
      scores[brokerId] += score * 0.3; // 30% weight
    });
  }

  // Experience-based scoring
  const experience = profile.experienceLevel || getExperienceFromGoal(profile.tradingGoal);
  if (experience && EXPERIENCE_SCORING[experience as keyof typeof EXPERIENCE_SCORING]) {
    const experienceScores = EXPERIENCE_SCORING[experience as keyof typeof EXPERIENCE_SCORING];
    Object.entries(experienceScores).forEach(([brokerId, score]) => {
      scores[brokerId] += score * 0.2; // 20% weight
    });
  }

  // Issue-based adjustments
  if (profile.mainIssue) {
    applyIssueAdjustments(scores, profile.mainIssue);
  }

  // Current broker penalty (if switching)
  if (profile.currentBroker && profile.currentBroker !== 'none') {
    scores[profile.currentBroker] *= 0.7; // Penalty for current broker
  }

  // Investment amount adjustments
  if (profile.investmentAmount) {
    applyInvestmentAmountAdjustments(scores, profile.investmentAmount);
  }

  // Satisfaction-based adjustments
  if (profile.satisfaction) {
    applySatisfactionAdjustments(scores, profile.satisfaction, profile.currentBroker);
  }

  return scores;
};

// 🔄 HELPER FUNCTIONS
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
  if (profile.tradingGoal === 'professional' || profile.experienceLevel === 'expert') {
    return 'Professional Trader';
  }
  if (profile.tradingGoal === 'learning' || profile.experienceLevel === 'beginner') {
    return 'Beginner Investor';
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

const generateReasoning = (profile: UserProfile, primary: BrokerRecommendation, shouldSwitch: boolean): string => {
  const userType = getUserType(profile);
  const broker = BROKER_CONFIGS[primary.brokerId];

  let reasoning = `**Based on your profile as a ${userType}:**\n\n`;

  if (profile.currentBroker && !shouldSwitch) {
    reasoning += `You seem satisfied with ${profile.currentBroker}. We recommend sticking with your current broker.`;
  } else if (shouldSwitch && profile.currentBroker) {
    reasoning += `We recommend switching from ${profile.currentBroker} to ${primary.brokerName} because:\n\n`;
    reasoning += `• ${broker.real_insights.why_we_recommend}\n`;
    reasoning += `• ${broker.real_insights.perfect_for}\n`;
    reasoning += `• ${broker.real_insights.cost_summary}`;
  } else {
    reasoning += `${primary.brokerName} is perfect for you because:\n\n`;
    reasoning += `• ${broker.real_insights.perfect_for}\n`;
    reasoning += `• ${broker.real_insights.cost_summary}\n`;
    reasoning += `• ${broker.real_insights.why_we_recommend}`;
  }

  return reasoning;
};