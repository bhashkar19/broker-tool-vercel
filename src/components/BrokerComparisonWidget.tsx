'use client';

import React, { useState } from 'react';
import { Check, TrendingDown, Sparkles, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { getBrokerById } from '@/lib/broker-repository';
import { BROKER_CHARGES } from '@/config/brokerCharges';

interface BrokerComparisonWidgetProps {
  currentBrokerId: string;
  recommendedBrokerId: string;
  onSwitchConfirm: () => void;
  onViewAlternatives: () => void;
  tradingFrequency: string;
}

// 📊 Calculate cost savings
const calculateSavings = (
  currentId: string,
  recommendedId: string,
  frequency: string
) => {
  const currentCharges = BROKER_CHARGES[currentId];
  const recommendedCharges = BROKER_CHARGES[recommendedId];

  if (!currentCharges || !recommendedCharges) return null;

  // Parse charges (simplified)
  const parseCharge = (charge: string): number => {
    if (charge.includes('₹0')) return 0;
    if (charge.includes('₹10')) return 10;
    if (charge.includes('₹20')) return 20;
    if (charge.includes('0.5%')) return 500; // Assuming ₹1L trade
    if (charge.includes('0.05%')) return 50;
    return 20;
  };

  const parseAMC = (amc: string): number => {
    const match = amc.match(/₹(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const currentDelivery = parseCharge(currentCharges.delivery);
  const currentIntraday = parseCharge(currentCharges.intraday);
  const currentAMC = parseAMC(currentCharges.amc);

  const recommendedDelivery = parseCharge(recommendedCharges.delivery);
  const recommendedIntraday = parseCharge(recommendedCharges.intraday);
  const recommendedAMC = parseAMC(recommendedCharges.amc);

  // Estimate trades per month
  const tradesPerMonth = {
    daily: { delivery: 20, intraday: 40 },
    weekly: { delivery: 10, intraday: 10 },
    monthly: { delivery: 5, intraday: 2 },
    occasional: { delivery: 2, intraday: 1 }
  };

  const trades = tradesPerMonth[frequency as keyof typeof tradesPerMonth] || tradesPerMonth.monthly;

  // Monthly costs
  const currentMonthlyCost = (currentDelivery * trades.delivery) + (currentIntraday * trades.intraday) + (currentAMC / 12);
  const recommendedMonthlyCost = (recommendedDelivery * trades.delivery) + (recommendedIntraday * trades.intraday) + (recommendedAMC / 12);

  const monthlySavings = currentMonthlyCost - recommendedMonthlyCost;
  const yearlySavings = monthlySavings * 12;

  return {
    monthlySavings: Math.round(monthlySavings),
    yearlySavings: Math.round(yearlySavings),
    isCheaper: monthlySavings > 0,
    percentageSavings: currentMonthlyCost > 0 ? Math.round((monthlySavings / currentMonthlyCost) * 100) : 0
  };
};

const BrokerComparisonWidget: React.FC<BrokerComparisonWidgetProps> = ({
  currentBrokerId,
  recommendedBrokerId,
  onSwitchConfirm,
  onViewAlternatives,
  tradingFrequency
}) => {
  const [selectedChoice, setSelectedChoice] = useState<'switch' | 'alternatives' | null>(null);

  const currentBroker = getBrokerById(currentBrokerId);
  const recommendedBroker = getBrokerById(recommendedBrokerId);
  const savings = calculateSavings(currentBrokerId, recommendedBrokerId, tradingFrequency);

  if (!currentBroker || !recommendedBroker) return null;

  // Comparison data
  const comparisons = [
    {
      category: '💰 Delivery Charges',
      current: BROKER_CHARGES[currentBrokerId]?.delivery || 'N/A',
      recommended: BROKER_CHARGES[recommendedBrokerId]?.delivery || 'N/A',
      winner: 'recommended' as const
    },
    {
      category: '⚡ Intraday Charges',
      current: BROKER_CHARGES[currentBrokerId]?.intraday || 'N/A',
      recommended: BROKER_CHARGES[recommendedBrokerId]?.intraday || 'N/A',
      winner: 'recommended' as const
    },
    {
      category: '📈 Platform Quality',
      current: currentBroker.scoring?.speed_focused || 5,
      recommended: recommendedBroker.scoring?.speed_focused || 5,
      winner: recommendedBroker.scoring.speed_focused >= currentBroker.scoring.speed_focused ? 'recommended' : 'current'
    },
    {
      category: '🎓 Learning Resources',
      current: currentBroker.scoring?.learning_focused || 5,
      recommended: recommendedBroker.scoring?.learning_focused || 5,
      winner: recommendedBroker.scoring.learning_focused >= currentBroker.scoring.learning_focused ? 'recommended' : 'current'
    },
    {
      category: '🛠️ Features',
      current: currentBroker.features.length,
      recommended: recommendedBroker.features.length,
      winner: recommendedBroker.features.length >= currentBroker.features.length ? 'recommended' : 'current'
    }
  ];

  const handleChoice = (choice: 'switch' | 'alternatives') => {
    setSelectedChoice(choice);

    // Track choice in analytics
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', 'ComparisonChoice', {
        choice,
        current_broker: currentBrokerId,
        recommended_broker: recommendedBrokerId
      });
    }

    // Execute action
    setTimeout(() => {
      if (choice === 'switch') {
        onSwitchConfirm();
      } else {
        onViewAlternatives();
      }
    }, 300);
  };

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl p-8 mb-6 border-2 border-blue-200 animate-slide-up">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-3">
          <Sparkles className="inline w-4 h-4 mr-1" />
          Quick Comparison
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Is {recommendedBroker.name} Really Better?
        </h3>
        <p className="text-gray-600">
          See how {recommendedBroker.name} compares to {currentBroker.name}
        </p>
      </div>

      {/* Broker Logos */}
      <div className="flex justify-center items-center gap-8 mb-8">
        <div className="text-center">
          <div className="relative w-24 h-24 mb-2 bg-white rounded-xl shadow-lg p-4 border-2 border-gray-200">
            <Image
              src={currentBroker.logo_url}
              alt={currentBroker.name}
              fill
              className="object-contain p-2"
            />
          </div>
          <p className="text-sm font-medium text-gray-700">Current</p>
          <p className="text-xs text-gray-500">{currentBroker.name}</p>
        </div>

        <div className="text-4xl text-gray-300">→</div>

        <div className="text-center">
          <div className="relative w-24 h-24 mb-2 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl shadow-lg p-4 border-2 border-green-400 ring-4 ring-green-100">
            <Image
              src={recommendedBroker.logo_url}
              alt={recommendedBroker.name}
              fill
              className="object-contain p-2"
            />
            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
              Better
            </div>
          </div>
          <p className="text-sm font-medium text-green-700">Recommended</p>
          <p className="text-xs text-gray-500">{recommendedBroker.name}</p>
        </div>
      </div>

      {/* Cost Savings Highlight */}
      {savings && savings.isCheaper && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-6 mb-6 shadow-xl animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-2">
            <TrendingDown className="w-6 h-6" />
            <h4 className="text-xl font-bold">Save Money Every Month!</h4>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black mb-1">₹{savings.monthlySavings.toLocaleString()}/month</p>
            <p className="text-green-100">
              That&apos;s ₹{savings.yearlySavings.toLocaleString()}/year in your pocket! ({savings.percentageSavings}% savings)
            </p>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-inner border border-gray-200">
        <h4 className="font-bold text-gray-900 mb-4 text-center">Feature Comparison</h4>
        <div className="space-y-3">
          {comparisons.map((item, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 items-center py-2 border-b border-gray-100 last:border-0">
              <div className="text-sm font-medium text-gray-700">{item.category}</div>

              {/* Current Broker Value */}
              <div className={`text-sm text-center ${item.winner === 'current' ? 'font-bold text-green-600' : 'text-gray-500'}`}>
                {typeof item.current === 'number' ? `${item.current}/10` : item.current}
                {item.winner === 'current' && <Check className="inline w-4 h-4 ml-1 text-green-600" />}
              </div>

              {/* Recommended Broker Value */}
              <div className={`text-sm text-center ${item.winner === 'recommended' ? 'font-bold text-green-600' : 'text-gray-500'}`}>
                {typeof item.recommended === 'number' ? `${item.recommended}/10` : item.recommended}
                {item.winner === 'recommended' && <Check className="inline w-4 h-4 ml-1 text-green-600" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top 3 Benefits */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 mb-6 border border-blue-200">
        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          Top 3 Reasons to Switch
        </h4>
        <ul className="space-y-2">
          {recommendedBroker.real_insights.pros.slice(0, 3).map((pro, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">{pro}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => handleChoice('switch')}
          disabled={selectedChoice !== null}
          className={`w-full py-5 rounded-xl font-bold text-lg shadow-xl btn-interactive ${
            selectedChoice === 'switch'
              ? 'bg-green-600 text-white scale-105'
              : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-2xl'
          }`}
        >
          {selectedChoice === 'switch' ? (
            <span className="flex items-center justify-center gap-2">
              <Check className="w-6 h-6" /> Opening {recommendedBroker.name}...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Yes, Switch to {recommendedBroker.name}
              <ChevronRight className="w-6 h-6" />
            </span>
          )}
        </button>

        <button
          onClick={() => handleChoice('alternatives')}
          disabled={selectedChoice !== null}
          className={`w-full py-4 rounded-xl font-semibold border-2 btn-interactive ${
            selectedChoice === 'alternatives'
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-300 bg-white text-gray-700 hover:border-blue-500 hover:bg-blue-50'
          }`}
        >
          {selectedChoice === 'alternatives' ? (
            'Loading alternatives...'
          ) : (
            'Show me other options'
          )}
        </button>
      </div>

      {/* Trust Badge */}
      <div className="text-center mt-4 text-xs text-gray-500">
        <p>✅ Trusted by 1,000+ traders • 🔒 SEBI registered</p>
      </div>
    </div>
  );
};

export default BrokerComparisonWidget;