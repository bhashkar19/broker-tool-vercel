// =====================================================
// BROKER REPOSITORY (Simplified - No Database)
// Simple wrapper around hardcoded config for clean imports
// =====================================================

import type { BrokerConfig } from '@/config/brokerConfigs';
import { BROKER_CONFIGS } from '@/config/brokerConfigs';

/**
 * Get all brokers from hardcoded config
 */
export function getAllBrokers(): Record<string, BrokerConfig> {
  return BROKER_CONFIGS;
}

/**
 * Get single broker by ID
 */
export function getBrokerById(brokerId: string): BrokerConfig | null {
  return BROKER_CONFIGS[brokerId] || null;
}

/**
 * Get partner brokers only
 */
export function getPartnerBrokers(): Record<string, BrokerConfig> {
  const partnerIds = ['zerodha', 'angel_one', 'upstox', 'fyers', '5paisa'];
  const partners: Record<string, BrokerConfig> = {};

  Object.entries(BROKER_CONFIGS).forEach(([id, config]) => {
    if (partnerIds.includes(id)) {
      partners[id] = config;
    }
  });

  return partners;
}

/**
 * Get brokers sorted by priority
 */
export function getBrokersByPriority(): BrokerConfig[] {
  return Object.values(BROKER_CONFIGS).sort((a, b) => a.priority - b.priority);
}
