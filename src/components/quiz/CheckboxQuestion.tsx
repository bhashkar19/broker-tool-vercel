'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';
import type { Question } from '@/config/questionConfigs';
import type { UserProfile } from '@/config/recommendationEngine';

interface CheckboxQuestionProps {
  question: Question;
  userData: UserProfile;
  onAnswerSelect: (value: string) => void;
}

/**
 * CheckboxQuestion Component
 * Handles multi-select checkbox questions
 * Extracted from ModularBrokerTool.tsx for better modularity
 */
const CheckboxQuestion: React.FC<CheckboxQuestionProps> = ({
  question,
  userData,
  onAnswerSelect
}) => {
  // 🐛 FIX: Safely parse selectedValues - handle JSON strings, arrays, null, undefined
  const selectedValues = (() => {
    const raw = userData[question.field_name as keyof UserProfile];

    // If already an array, return it
    if (Array.isArray(raw)) return raw;

    // If it's a string, try parsing as JSON
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        // If parsing fails, return empty array
        return [];
      }
    }

    // Default: empty array
    return [];
  })();

  const handleCheckboxChange = (value: string) => {
    const currentValues = selectedValues || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];

    onAnswerSelect(JSON.stringify(newValues)); // Store as JSON string
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-2 text-center leading-tight">
        {question.label}
      </h2>
      {question.helpText && (
        <p className="text-xs text-blue-600 mb-3 text-center font-medium">{question.helpText}</p>
      )}
      <div className="space-y-2.5">
        {question.options?.map((option) => (
          <button
            key={option.value}
            onClick={() => handleCheckboxChange(option.value)}
            className={`w-full p-3 border-2 rounded-xl text-left text-sm font-medium transition-all ${
              selectedValues.includes(option.value)
                ? 'border-blue-600 bg-blue-50 text-blue-900'
                : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{option.label}</span>
              {selectedValues.includes(option.value) && (
                <CheckCircle className="w-4 h-4 text-blue-600" />
              )}
            </div>
          </button>
        ))}
      </div>
      {selectedValues.length > 0 && (
        <p className="text-xs text-center text-blue-600 mt-2 font-medium">
          ✓ {selectedValues.length} selected
        </p>
      )}
    </div>
  );
};

export default CheckboxQuestion;
