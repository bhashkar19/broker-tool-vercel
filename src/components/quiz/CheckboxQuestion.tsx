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
  const selectedValues = (userData[question.field_name as keyof UserProfile] as string[]) || [];

  const handleCheckboxChange = (value: string) => {
    const currentValues = selectedValues || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];

    onAnswerSelect(JSON.stringify(newValues)); // Store as JSON string
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        {question.label}
      </h2>
      {question.helpText && (
        <p className="text-sm text-gray-600 mb-4 text-center">{question.helpText}</p>
      )}
      <div className="space-y-3">
        {question.options?.map((option) => (
          <button
            key={option.value}
            onClick={() => handleCheckboxChange(option.value)}
            className={`w-full p-4 border-2 rounded-xl text-left font-medium transition-all ${
              selectedValues.includes(option.value)
                ? 'border-blue-600 bg-blue-50 text-blue-900'
                : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{option.label}</span>
              {selectedValues.includes(option.value) && (
                <CheckCircle className="w-5 h-5 text-blue-600" />
              )}
            </div>
          </button>
        ))}
      </div>
      {selectedValues.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            Selected: {selectedValues.length} broker{selectedValues.length > 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default CheckboxQuestion;
