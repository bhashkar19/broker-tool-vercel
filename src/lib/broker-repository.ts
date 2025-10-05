// =====================================================
// BROKER REPOSITORY (Simplified - No Database)
// Simple wrapper around unified config for clean imports
// =====================================================

import type { BrokerConfig } from '@/config/brokerConfigs';
import { UNIFIED_BROKER_CONFIGS, PARTNER_BROKER_IDS, isPartnerBroker, getUnifiedBrokersByPriority } from '@/config/unifiedBrokerConfig';

// Create compatibility layer for legacy BrokerConfig type
function convertToLegacyConfig(unifiedConfig: typeof UNIFIED_BROKER_CONFIGS[keyof typeof UNIFIED_BROKER_CONFIGS]): BrokerConfig {
  return {
    id: unifiedConfig.id,
    name: unifiedConfig.name,
    logo_url: unifiedConfig.logo_url,
    affiliate_url: unifiedConfig.affiliate_url,
    priority: unifiedConfig.priority,
    best_for: unifiedConfig.best_for,
    real_insights: unifiedConfig.insights,
    features: unifiedConfig.features,
    charges: {
      intraday_brokerage: unifiedConfig.charges.intraday.amount,
      delivery_brokerage: unifiedConfig.charges.delivery.amount,
      fo_brokerage: unifiedConfig.charges.fo.amount,
      amc_charges: unifiedConfig.charges.amc.amount
    },
    scoring: unifiedConfig.scoring
  } as BrokerConfig;
}

/**
 * Get all brokers from unified config
 */
export function getAllBrokers(): Record<string, BrokerConfig> {
  const result: Record<string, BrokerConfig> = {};
  Object.entries(UNIFIED_BROKER_CONFIGS).forEach(([id, config]) => {
    result[id] = convertToLegacyConfig(config);
  });
  return result;
}

/**
 * Get single broker by ID
 */
export function getBrokerById(brokerId: string): BrokerConfig | null {
  const unified = UNIFIED_BROKER_CONFIGS[brokerId];
  return unified ? convertToLegacyConfig(unified) : null;
}

/**
 * Get partner brokers only
 */
export function getPartnerBrokers(): Record<string, BrokerConfig> {
  const partners: Record<string, BrokerConfig> = {};

  Object.entries(UNIFIED_BROKER_CONFIGS).forEach(([id, config]) => {
    if (isPartnerBroker(id)) {
      partners[id] = convertToLegacyConfig(config);
    }
  });

  return partners;
}

/**
 * Get brokers sorted by priority
 */
export function getBrokersByPriority(): BrokerConfig[] {
  return getUnifiedBrokersByPriority().map(config => convertToLegacyConfig(config));
}
