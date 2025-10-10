'use client';

import React from 'react';
import type { Question } from '@/config/questionConfigs';
import type { UserProfile } from '@/config/recommendationEngine';

interface ContactFormProps {
  question: Question;
  userData: UserProfile;
  onContactUpdate: (field: string, value: string) => void;
}

/**
 * ContactForm Component - ENHANCED
 * Improved UX with better messaging, validation, and trust signals
 * Mandatory for lead capture but feels helpful, not intrusive
 */
const ContactForm: React.FC<ContactFormProps> = ({
  question,
  userData,
  onContactUpdate
}) => {
  // ✅ RELAXED VALIDATION: Accept any input (1+ characters)
  // Shows green checkmark immediately to encourage completion
  // But doesn't block users who want to skip
  const isNameValid = (userData.name?.length || 0) >= 1;
  const isMobileValid = (userData.mobile?.length || 0) >= 1;

  // Format mobile number for better readability (98765 43210)
  const formatMobileDisplay = (value: string) => {
    if (value.length > 5) {
      return `${value.slice(0, 5)} ${value.slice(5)}`;
    }
    return value;
  };

  return (
    <div>
      {/* Heading - More helpful, less salesy */}
      <h2 className="text-lg font-bold text-gray-900 mb-2 text-center leading-tight">
        {question.label}
      </h2>

      {/* Compact value proposition - single line */}
      <p className="text-sm text-blue-600 mb-4 text-center font-medium">
        Get your personalized match + exclusive broker links instantly 🎯
      </p>

      <div className="space-y-3.5">
        {/* Name Field - With explanation */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Your Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={userData.name}
              onChange={(e) => onContactUpdate('name', e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all text-base font-medium text-gray-900 bg-white placeholder:text-gray-400"
            />
            {isNameValid && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 text-xl font-bold">✓</span>
            )}
          </div>
          {/* Removed strict validation message - accept any input */}
        </div>

        {/* Mobile Field - With character count and explanation */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-gray-700">
              Mobile Number
            </label>
            {userData.mobile && userData.mobile.length > 0 && !isMobileValid && (
              <span className="text-xs text-gray-500">{userData.mobile.length}/10 digits</span>
            )}
          </div>
          <div className="flex gap-3">
            <div className="bg-gray-100 px-4 py-3.5 rounded-xl border-2 border-gray-200 font-bold text-gray-700 text-base">
              +91
            </div>
            <div className="relative flex-1">
              <input
                type="tel"
                value={formatMobileDisplay(userData.mobile || '')}
                onChange={(e) => onContactUpdate('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="98765 43210"
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all text-base font-medium text-gray-900 bg-white placeholder:text-gray-400"
              />
              {isMobileValid && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 text-xl font-bold">✓</span>
              )}
            </div>
          </div>
          {/* Removed strict validation message - accept any input */}
        </div>

      </div>

      {/* Trust signals - compact footer */}
      <div className="mt-3 flex items-center justify-center gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="text-green-600 font-bold">✓</span>
          <span>100% Free</span>
        </span>
        <span className="text-gray-300">•</span>
        <span className="flex items-center gap-1">
          <span className="text-green-600 font-bold">✓</span>
          <span>No Spam</span>
        </span>
        <span className="text-gray-300">•</span>
        <span className="flex items-center gap-1">
          <span className="text-green-600 font-bold">✓</span>
          <span>Instant Results</span>
        </span>
      </div>
    </div>
  );
};

export default ContactForm;
