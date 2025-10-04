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
 * ContactForm Component
 * Handles name and mobile number collection with validation
 * Extracted from ModularBrokerTool.tsx for better modularity
 */
const ContactForm: React.FC<ContactFormProps> = ({
  question,
  userData,
  onContactUpdate
}) => {
  const isNameValid = (userData.name?.length || 0) >= 3;
  const isMobileValid = (userData.mobile?.length || 0) === 10;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">
        {question.label}
      </h2>
      {question.helpText && (
        <p className="text-sm text-gray-600 mb-5 text-center">{question.helpText}</p>
      )}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Your Name</label>
          <div className="relative">
            <input
              type="text"
              value={userData.name}
              onChange={(e) => onContactUpdate('name', e.target.value)}
              placeholder="Enter your full name"
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all text-gray-900 bg-white"
            />
            {isNameValid && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 font-bold">✓</span>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">WhatsApp Number</label>
          <div className="flex gap-3">
            <div className="bg-gray-100 px-3 py-4 rounded-xl border-2 border-gray-200 font-semibold text-gray-600">
              +91
            </div>
            <div className="relative flex-1">
              <input
                type="tel"
                value={userData.mobile}
                onChange={(e) => onContactUpdate('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10-digit mobile number"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all text-gray-900 bg-white"
              />
              {isMobileValid && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 font-bold">✓</span>
              )}
            </div>
          </div>
        </div>
        {/* Privacy Badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-3">
          <span>🔒</span>
          <span>Your data stays private & secure</span>
        </div>

        {/* Consent Checkbox */}
        <div className="mt-4 mb-2">
          <label className="flex items-start gap-2.5 text-sm text-gray-600 cursor-pointer group">
            <input
              type="checkbox"
              required
              className="mt-0.5 w-4 h-4 cursor-pointer accent-blue-600"
            />
            <span className="leading-snug">
              I agree to receive broker recommendations.{' '}
              <a
                href="/privacy-policy"
                className="text-blue-600 underline decoration-1 underline-offset-2 hover:text-blue-700"
              >
                Privacy Policy
              </a>
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
