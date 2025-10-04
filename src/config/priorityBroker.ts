// 💰 PRIORITY BROKER CONFIGURATION
// Change this when commission agreements change
// This broker will be recommended to ALL new users (no demat account)

export const PRIORITY_BROKER_CONFIG = {
  // Current priority broker (highest commission)
  brokerId: 'zerodha', // Change to 'upstox', 'angel_one', 'fyers', or '5paisa' when needed

  // Reason for priority (internal note)
  reason: 'Highest commission partner as of Jan 2025',

  // Force this broker for new users?
  forceForNewUsers: true, // When true, ALL first-time users get this broker regardless of quiz answers

  // Last updated
  lastUpdated: '2025-01-04'
} as const;

// Helper function to get priority broker ID
export const getPriorityBrokerId = (): string => {
  return PRIORITY_BROKER_CONFIG.brokerId;
};

// Helper function to check if we should force priority broker for new users
export const shouldForcePriorityBroker = (hasExistingAccount: boolean): boolean => {
  return !hasExistingAccount && PRIORITY_BROKER_CONFIG.forceForNewUsers;
};
