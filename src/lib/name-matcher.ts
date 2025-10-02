/**
 * Name Matching Engine for Broker CSV Import
 *
 * Challenge: Broker CSVs only contain names (no mobile/email), so we must match by name alone.
 * This module provides fuzzy name matching with confidence scoring.
 *
 * Expected Accuracy: 85-90% with manual review for uncertain matches (60-85% confidence)
 */

import crypto from 'crypto';

// Levenshtein distance algorithm for fuzzy string matching
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  // Initialize matrix
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Calculate distances
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[len1][len2];
}

// Normalize name for comparison
export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')              // normalize multiple spaces
    .replace(/[^\w\s]/g, '')           // remove special characters
    .replace(/\b(mr|mrs|ms|dr|prof)\b\.?/gi, ''); // remove titles
}

// Extract tokens (words) from name
function getTokens(name: string): string[] {
  return normalizeName(name).split(' ').filter(Boolean);
}

// Calculate token-based similarity (handles word reordering)
function tokenSimilarity(name1: string, name2: string): number {
  const tokens1 = getTokens(name1);
  const tokens2 = getTokens(name2);

  if (tokens1.length === 0 || tokens2.length === 0) return 0;

  // Count matching tokens
  let matchCount = 0;
  const used = new Set<number>();

  for (const token1 of tokens1) {
    for (let i = 0; i < tokens2.length; i++) {
      if (used.has(i)) continue;

      const token2 = tokens2[i];
      const distance = levenshteinDistance(token1, token2);
      const maxLen = Math.max(token1.length, token2.length);
      const similarity = 1 - (distance / maxLen);

      // Consider it a match if > 80% similar
      if (similarity > 0.8) {
        matchCount++;
        used.add(i);
        break;
      }
    }
  }

  // Calculate percentage of tokens matched
  const totalTokens = Math.max(tokens1.length, tokens2.length);
  return (matchCount / totalTokens) * 100;
}

// Calculate string similarity using Levenshtein distance
function stringSimilarity(str1: string, str2: string): number {
  const normalized1 = normalizeName(str1);
  const normalized2 = normalizeName(str2);

  if (normalized1 === normalized2) return 100;

  const distance = levenshteinDistance(normalized1, normalized2);
  const maxLen = Math.max(normalized1.length, normalized2.length);

  if (maxLen === 0) return 0;

  return ((maxLen - distance) / maxLen) * 100;
}

// Main name matching function with confidence score
export function calculateNameMatchConfidence(name1: string, name2: string): number {
  // Exact match after normalization
  if (normalizeName(name1) === normalizeName(name2)) {
    return 100;
  }

  // Calculate both string similarity and token similarity
  const stringScore = stringSimilarity(name1, name2);
  const tokenScore = tokenSimilarity(name1, name2);

  // Use the higher score, but average them if both are high
  if (stringScore > 90 || tokenScore > 90) {
    return Math.max(stringScore, tokenScore);
  }

  // For moderate scores, use weighted average (favor token matching)
  return (tokenScore * 0.6) + (stringScore * 0.4);
}

// Match broker CSV name against database submissions
export interface NameMatchResult {
  submissionId: number;
  submissionName: string;
  mobile: string;
  createdAt: string;
  recommendedBroker: string;
  confidence: number;
}

export interface MatchResult {
  status: 'exact' | 'high_confidence' | 'medium_confidence' | 'low_confidence' | 'no_match';
  confidence: number;
  bestMatch?: NameMatchResult;
  alternativeMatches: NameMatchResult[];
}

export function findBestNameMatch(
  brokerName: string,
  brokerDate: Date,
  brokerId: string,
  submissions: Array<{
    id: number;
    name: string;
    mobile: string;
    created_at: string;
    recommended_broker: string;
  }>,
  options: {
    dateRangeDays?: number;      // Search within X days before broker date
    minConfidence?: number;       // Minimum confidence to consider (default: 60)
    maxAlternatives?: number;     // Max alternative matches to return (default: 5)
  } = {}
): MatchResult {
  const {
    dateRangeDays = 30,
    minConfidence = 60,
    maxAlternatives = 5
  } = options;

  // Filter submissions by date range and recommended broker
  const dateThreshold = new Date(brokerDate);
  dateThreshold.setDate(dateThreshold.getDate() - dateRangeDays);

  const relevantSubmissions = submissions.filter(sub => {
    const subDate = new Date(sub.created_at);
    return (
      sub.recommended_broker === brokerId &&
      subDate >= dateThreshold &&
      subDate <= brokerDate
    );
  });

  if (relevantSubmissions.length === 0) {
    return {
      status: 'no_match',
      confidence: 0,
      alternativeMatches: []
    };
  }

  // Calculate confidence for each submission
  const matches: NameMatchResult[] = relevantSubmissions
    .map(sub => ({
      submissionId: sub.id,
      submissionName: sub.name,
      mobile: sub.mobile,
      createdAt: sub.created_at,
      recommendedBroker: sub.recommended_broker,
      confidence: calculateNameMatchConfidence(brokerName, sub.name)
    }))
    .filter(match => match.confidence >= minConfidence)
    .sort((a, b) => b.confidence - a.confidence);

  if (matches.length === 0) {
    return {
      status: 'no_match',
      confidence: 0,
      alternativeMatches: []
    };
  }

  const bestMatch = matches[0];
  const alternativeMatches = matches.slice(1, maxAlternatives + 1);

  // Determine status based on confidence
  let status: MatchResult['status'];
  if (bestMatch.confidence >= 95) {
    status = 'exact';
  } else if (bestMatch.confidence >= 85) {
    status = 'high_confidence';
  } else if (bestMatch.confidence >= 70) {
    status = 'medium_confidence';
  } else {
    status = 'low_confidence';
  }

  return {
    status,
    confidence: bestMatch.confidence,
    bestMatch,
    alternativeMatches
  };
}

// Batch matching function for processing entire CSV
export interface BatchMatchInput {
  brokerName: string;
  brokerClientId?: string;
  brokerDate: string;
  csvRowData: Record<string, unknown>;
}

export interface BatchMatchOutput {
  autoMatched: Array<{
    input: BatchMatchInput;
    match: NameMatchResult;
    confidence: number;
  }>;
  needsReview: Array<{
    input: BatchMatchInput;
    bestMatch?: NameMatchResult;
    alternativeMatches: NameMatchResult[];
    confidence: number;
  }>;
  noMatch: Array<{
    input: BatchMatchInput;
  }>;
}

export function batchMatchNames(
  inputs: BatchMatchInput[],
  submissions: Array<{
    id: number;
    name: string;
    mobile: string;
    created_at: string;
    recommended_broker: string;
  }>,
  brokerId: string,
  options: {
    autoMatchThreshold?: number;   // Auto-approve if >= this confidence (default: 90)
    reviewThreshold?: number;       // Manual review if >= this confidence (default: 70)
    dateRangeDays?: number;
  } = {}
): BatchMatchOutput {
  const {
    autoMatchThreshold = 90,
    reviewThreshold = 70,
    dateRangeDays = 30
  } = options;

  const result: BatchMatchOutput = {
    autoMatched: [],
    needsReview: [],
    noMatch: []
  };

  for (const input of inputs) {
    const brokerDate = new Date(input.brokerDate);
    const matchResult = findBestNameMatch(
      input.brokerName,
      brokerDate,
      brokerId,
      submissions,
      { dateRangeDays, minConfidence: reviewThreshold }
    );

    if (!matchResult.bestMatch) {
      result.noMatch.push({ input });
      continue;
    }

    if (matchResult.confidence >= autoMatchThreshold) {
      result.autoMatched.push({
        input,
        match: matchResult.bestMatch,
        confidence: matchResult.confidence
      });
    } else if (matchResult.confidence >= reviewThreshold) {
      result.needsReview.push({
        input,
        bestMatch: matchResult.bestMatch,
        alternativeMatches: matchResult.alternativeMatches,
        confidence: matchResult.confidence
      });
    } else {
      result.noMatch.push({ input });
    }
  }

  return result;
}

// Generate import hash for deduplication
export function generateImportHash(
  name: string,
  clientId: string,
  date: string
): string {
  const data = `${normalizeName(name)}_${clientId}_${date}`;
  return crypto.createHash('md5').update(data).digest('hex');
}
