// 💰 BROKER CHARGES DATABASE
// Complete pricing data for all 16 brokers (accurate as of 2025)

export interface BrokerCharges {
  delivery: string; // Delivery brokerage (long-term investing)
  intraday: string; // Intraday brokerage (same-day trading)
  fo: string; // F&O brokerage (futures & options)
  amc: string; // Annual Maintenance Charges
  demat_opening: string; // Account opening charges
  notes?: string; // Special notes about pricing
}

export const BROKER_CHARGES: Record<string, BrokerCharges> = {
  // ===== PARTNER BROKERS (Discount) =====

  zerodha: {
    delivery: "₹0",
    intraday: "₹20 or 0.03% (whichever is lower)",
    fo: "₹20 or 0.03% (whichever is lower)",
    amc: "₹300/year",
    demat_opening: "₹0",
    notes: "Best for long-term investors - zero delivery charges"
  },

  angel_one: {
    delivery: "₹20 or 0.1% (whichever is lower)",
    intraday: "₹20 or 0.03% (whichever is lower)",
    fo: "₹20 flat per order",
    amc: "₹0 (1st year), ₹240/year (from 2nd year)",
    demat_opening: "₹0",
    notes: "Delivery NO LONGER FREE since Nov 1, 2024. First 30 days promotional pricing only"
  },

  upstox: {
    delivery: "₹20 or 2.5% (whichever is lower)",
    intraday: "₹20 or 0.05% (whichever is lower)",
    fo: "₹20 or 0.05% (whichever is lower)",
    amc: "₹300/year",
    demat_opening: "₹0",
    notes: "Similar to Zerodha but charges for delivery"
  },

  fyers: {
    delivery: "₹20 or 0.3% (check for zero promos)",
    intraday: "₹20 or 0.03% (whichever is lower)",
    fo: "₹20 or 0.03% (whichever is lower)",
    amc: "₹0 (promotional 'Free for Life') or ₹400/year - verify current offer",
    demat_opening: "₹0",
    notes: "TradingView integration. Promotional pricing active - confirm delivery & AMC before opening"
  },

  '5paisa': {
    delivery: "₹20 flat (standard plan) or ₹10 (premium ₹599-1199/mo)",
    intraday: "₹20 flat (standard plan) or ₹10 (premium ₹599-1199/mo)",
    fo: "₹20 flat (standard plan) or ₹10 (premium ₹599-1199/mo)",
    amc: "₹0 (BSDA < ₹4L), ₹100/yr (₹4-10L), ₹300/yr (> ₹10L)",
    demat_opening: "₹0",
    notes: "Standard: ₹20 flat. Premium plans with ₹10 brokerage require monthly subscription"
  },

  // ===== NON-PARTNER BROKERS (Discount) =====

  groww: {
    delivery: "₹20 or 0.1% (whichever is lower, min ₹5)",
    intraday: "₹20 or 0.1% (whichever is lower)",
    fo: "₹20 flat per order",
    amc: "₹0 (Free)",
    demat_opening: "₹0",
    notes: "Good for beginners - simple UI, zero AMC. Pricing verified January 2025"
  },

  dhan: {
    delivery: "₹0",
    intraday: "₹20 or 0.03% (whichever is lower)",
    fo: "₹20 or 0.03% (whichever is lower)",
    amc: "₹0",
    demat_opening: "₹0",
    notes: "Newer broker, zero delivery charges like Zerodha"
  },

  paytm: {
    delivery: "₹20 or 2.5% (whichever is lower)",
    intraday: "₹20 or 0.05% (whichever is lower)",
    fo: "₹20 flat per order",
    amc: "₹0 (Free)",
    demat_opening: "₹200 (KYC charges)",
    notes: "Integrated with Paytm wallet. First 15 days free brokerage offer"
  },

  // ===== TRADITIONAL BROKERS (Full-Service - EXPENSIVE) =====

  icici: {
    delivery: "0.29-0.50% (varies by plan)",
    intraday: "0.029-0.05% or ₹20 (iValue plan)",
    fo: "0.029-0.05% or ₹20 (iValue plan)",
    amc: "₹300-700/year (plan dependent)",
    demat_opening: "₹0",
    notes: "Multiple plans: MoneySaver (0.29%), iValue (₹20 flat), Prime (tiered). 3-in-1 account"
  },

  hdfc: {
    delivery: "₹0 (current promo) or 0.10-0.32% (varies by plan)",
    intraday: "₹20 (promo) or 0.010-0.032% (varies by plan)",
    fo: "₹20 (promo) or per plan rates",
    amc: "₹750/year",
    demat_opening: "₹999 one-time",
    notes: "2025 offer: Free delivery + ₹20 F&O. Value plans available ₹199-₹5,999/year"
  },

  kotak: {
    delivery: "0.25% or ₹20 (whichever is higher) - Trade Free Plan",
    intraday: "₹10 flat per order",
    fo: "₹10 flat per order",
    amc: "₹600/year",
    demat_opening: "₹0",
    notes: "Competitive ₹10 flat intraday/F&O. Trade Free Youth plan for <30 years. First 30 days free delivery"
  },

  sharekhan: {
    delivery: "₹0 (promo) or 0.30-0.50% (varies by plan)",
    intraday: "₹20 (promo) or 0.02-0.10% (varies by plan)",
    fo: "₹20 (promo) - Options: ₹20 per lot, Futures: 0.02%",
    amc: "₹400/year (Free first year)",
    demat_opening: "₹0",
    notes: "2025 promo: Free delivery + ₹20 intraday/F&O. Prepaid plans ₹750-₹2L/year. Mirae Asset backed"
  },

  sbi: {
    delivery: "₹0 (Free)",
    intraday: "₹20 flat per order",
    fo: "₹20 flat per order",
    amc: "₹0 (Free)",
    demat_opening: "₹0",
    notes: "Free delivery + ₹0 AMC. Government bank backed. Subscription plans available with additional benefits"
  },

  motilal: {
    delivery: "0.20%",
    intraday: "₹0 (Free - special offer)",
    fo: "0.02% Futures, ₹20 Options",
    amc: "₹199/year (Free first year)",
    demat_opening: "₹0",
    notes: "Free intraday trading (lifetime offer). Good for wealth management + research"
  },

  iifl: {
    delivery: "₹0 (Zero Brokerage plan) or ₹20 (Basic plan)",
    intraday: "₹20 or 0.05% (varies by plan)",
    fo: "₹20 flat per lot (Options)",
    amc: "₹250-450/year (Free first year)",
    demat_opening: "₹0",
    notes: "Multiple plans: Zero Brokerage (free delivery), Basic (₹20 flat), 0.5% standard"
  },

  axis: {
    delivery: "₹0 (Trade@20 plan) or 0.50% (Standard)",
    intraday: "₹20 (Trade@20) or 0.05% (Standard)",
    fo: "₹20 (Trade@20) or segment rates (Standard)",
    amc: "₹600-650/year",
    demat_opening: "₹0",
    notes: "Trade@20 plan: Free delivery + ₹20 F&O (requires ₹75k AQB in linked Axis bank account)"
  }
};

// 💡 SAVINGS CALCULATOR
export const calculateYearlySavings = (
  currentBroker: string,
  recommendedBroker: string,
  tradingFrequency: string
): {
  deliveryTrades: number;
  intradayTrades: number;
  currentCost: number;
  recommendedCost: number;
  savings: number;
  savingsPerTrade: number;
} => {
  // Estimate trades per month based on frequency
  const tradesPerMonth = {
    daily: { delivery: 20, intraday: 40 }, // Active daily trader
    weekly: { delivery: 10, intraday: 10 }, // Weekly trader
    monthly: { delivery: 5, intraday: 2 }, // Occasional trader
    occasional: { delivery: 2, intraday: 1 } // Very occasional
  };

  const trades = tradesPerMonth[tradingFrequency as keyof typeof tradesPerMonth] || tradesPerMonth.monthly;

  const currentCharges = BROKER_CHARGES[currentBroker];
  const recommendedCharges = BROKER_CHARGES[recommendedBroker];

  // Simplified calculation (assuming ₹20 for most discount brokers, ₹0 for zero-brokerage)
  const parseCharge = (charge: string): number => {
    if (charge.includes("₹0")) return 0;
    if (charge.includes("₹10")) return 10;
    if (charge.includes("₹20")) return 20;
    if (charge.includes("0.5%")) return 500; // Assuming ₹1L trade
    return 20; // Default
  };

  const currentDeliveryCharge = parseCharge(currentCharges.delivery);
  const currentIntradayCharge = parseCharge(currentCharges.intraday);
  const recommendedDeliveryCharge = parseCharge(recommendedCharges.delivery);
  const recommendedIntradayCharge = parseCharge(recommendedCharges.intraday);

  // Calculate monthly costs
  const currentMonthlyCost =
    (currentDeliveryCharge * trades.delivery) +
    (currentIntradayCharge * trades.intraday);

  const recommendedMonthlyCost =
    (recommendedDeliveryCharge * trades.delivery) +
    (recommendedIntradayCharge * trades.intraday);

  // Annual costs (12 months)
  const currentYearlyCost = currentMonthlyCost * 12;
  const recommendedYearlyCost = recommendedMonthlyCost * 12;

  return {
    deliveryTrades: trades.delivery * 12, // Annual delivery trades
    intradayTrades: trades.intraday * 12, // Annual intraday trades
    currentCost: currentYearlyCost,
    recommendedCost: recommendedYearlyCost,
    savings: currentYearlyCost - recommendedYearlyCost,
    savingsPerTrade: currentDeliveryCharge - recommendedDeliveryCharge
  };
};

// 📊 COMPARISON TABLE DATA
export const generateComparisonTable = (
  currentBroker: string,
  recommendedBroker: string
) => {
  const current = BROKER_CHARGES[currentBroker];
  const recommended = BROKER_CHARGES[recommendedBroker];

  return {
    current: {
      name: currentBroker,
      charges: current
    },
    recommended: {
      name: recommendedBroker,
      charges: recommended
    },
    differences: {
      delivery: current.delivery !== recommended.delivery,
      intraday: current.intraday !== recommended.intraday,
      fo: current.fo !== recommended.fo,
      amc: current.amc !== recommended.amc
    }
  };
};
