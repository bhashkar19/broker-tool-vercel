'use client';

import React, { useState } from 'react';
import { type UserProfile } from '@/config/recommendationEngine';
import { UNIFIED_BROKER_CONFIGS } from '@/config/unifiedBrokerConfig';
import ModularBrokerTool from '@/components/ModularBrokerTool';

const PARTNER_BROKERS = [
  { id: 'zerodha', name: 'Zerodha', priority: 1 },
  { id: 'angel_one', name: 'Angel One', priority: 1 },
  { id: 'upstox', name: 'Upstox', priority: 2 },
  { id: 'fyers', name: 'Fyers', priority: 3 },
  { id: '5paisa', name: '5Paisa', priority: 4 }
];

// Create user profiles to trigger each specific broker recommendation
const getUserProfileForBroker = (brokerId: string, userType: 'new' | 'existing'): UserProfile => {
  const baseProfile: UserProfile = {
    name: 'Preview User',
    mobile: '9876543210',
    sessionId: 'preview-' + Date.now(),
    userType: ['investor'],
    tradingFrequency: 'weekly',
    whatMattersMost: ['cost']
  };

  if (userType === 'new') {
    // New users - no account
    return {
      ...baseProfile,
      hasAccount: 'no',
    };
  } else {
    // Existing users - exclude all brokers EXCEPT the one we want to preview
    const allPartnerBrokerIds = PARTNER_BROKERS.map(b => b.id);
    const brokersToExclude = allPartnerBrokerIds.filter(id => id !== brokerId);

    return {
      ...baseProfile,
      hasAccount: 'yes',
      brokerInfo: {
        count: String(brokersToExclude.length),
        brokers: brokersToExclude
      }
    };
  }
};

export default function PreviewTempPage() {
  const [selectedBroker, setSelectedBroker] = useState<string | null>(null);
  const [userType, setUserType] = useState<'new' | 'existing'>('new');

  if (selectedBroker) {
    const userProfile = getUserProfileForBroker(selectedBroker, userType);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        {/* Back Button Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={() => setSelectedBroker(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              ← Back to Broker List
            </button>
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-blue-600">
                PREVIEW MODE
              </span>
              <span className="text-xs text-gray-500">
                {userType === 'new' ? 'New User' : 'Existing User'} → {UNIFIED_BROKER_CONFIGS[selectedBroker]?.name}
              </span>
              <span className="text-xs text-green-600 font-medium mt-1">
                ✓ Real Component (ModularBrokerTool)
              </span>
            </div>
          </div>
        </div>

        {/* EXACT SAME COMPONENT AS REAL USERS SEE */}
        {/* Temporarily disabled - props need to be updated */}
        <div className="text-center py-8 text-gray-600">
          Preview temporarily unavailable - use main tool instead
        </div>
        {/* <ModularBrokerTool
          key={selectedBroker + userType}
          initialUserData={userProfile}
          skipToResults={true}
        /> */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔍 Broker Results Preview
          </h1>
          <p className="text-gray-600">
            Click any broker to see EXACTLY what real users see after completing the quiz.
          </p>
          <p className="text-sm text-red-600 mt-2">
            ⚠️ Temporary file - Delete after testing: <code className="bg-gray-100 px-2 py-1 rounded">rm -rf src/app/admin/preview-temp</code>
          </p>
        </div>

        {/* SECTION 1: NEW USERS */}
        <section className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              📱 NEW USERS
            </h2>
            <p className="text-gray-600 text-sm">
              Users who answer &quot;No, I don&apos;t have a demat account yet&quot;
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Logic:</strong> ALL new users get Zerodha (forced in priorityBroker.ts - highest commission)
            </p>
          </div>

          <div className="flex justify-center">
            <div
              onClick={() => {
                setUserType('new');
                setSelectedBroker('zerodha');
              }}
              className="bg-white border-2 border-blue-500 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all max-w-xs w-full"
            >
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {UNIFIED_BROKER_CONFIGS['zerodha'].name}
                </h3>
                <p className="text-sm text-blue-600 font-semibold mb-4">
                  FORCED FOR ALL NEW USERS
                </p>
                <p className="text-xs text-gray-600 mb-4">
                  Priority: 1 (Highest Commission Partner)
                </p>
                <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all">
                  View Results Page →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: EXISTING USERS */}
        <section className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              👥 EXISTING USERS
            </h2>
            <p className="text-gray-600 text-sm">
              Users who already have a demat account - recommend based on business priority
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800">
              <strong>Logic:</strong> Recommend highest priority broker they DON&apos;T already have
            </p>
            <p className="text-xs text-green-700 mt-1">
              Priority: Zerodha/Angel One (1) → Upstox (2) → Fyers (3) → 5Paisa (4)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {PARTNER_BROKERS.map(broker => (
              <div
                key={broker.id}
                onClick={() => {
                  setUserType('existing');
                  setSelectedBroker(broker.id);
                }}
                className="bg-white border-2 border-gray-200 rounded-xl p-4 cursor-pointer hover:border-green-500 hover:shadow-lg transition-all"
              >
                <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                  {broker.name}
                </h3>
                <p className="text-sm text-gray-600 text-center mb-3">
                  Priority: {broker.priority}
                </p>
                <button className="w-full py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg text-sm hover:from-green-700 hover:to-emerald-700 transition-all">
                  View Results →
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>💡 Tip: Resize browser window to test mobile responsiveness</p>
        </div>
      </div>
    </div>
  );
}
