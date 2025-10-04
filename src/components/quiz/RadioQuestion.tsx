'use client';

import React from 'react';
import type { Question } from '@/config/questionConfigs';
import type { UserProfile } from '@/config/recommendationEngine';

interface RadioQuestionProps {
  question: Question;
  userData: UserProfile;
  onAnswerSelect: (value: string) => void;
}

/**
 * RadioQuestion Component
 * Handles single-select radio button questions
 * Extracted from ModularBrokerTool.tsx for better modularity
 */
const RadioQuestion: React.FC<RadioQuestionProps> = ({
  question,
  userData,
  onAnswerSelect
}) => {
  const selectedValue = userData[question.field_name as keyof UserProfile] as string;

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-2 text-center">
        {question.label}
      </h2>
      {question.helpText && (
        <p className="text-xs text-gray-500 mb-3 text-center">{question.helpText}</p>
      )}
      <div className="space-y-2">
        {question.options?.map((option) => (
          <button
            key={option.value}
            onClick={() => onAnswerSelect(option.value)}
            className={`w-full px-3.5 py-2.5 border-2 rounded-lg text-left text-sm font-medium transition-all flex items-center ${
              selectedValue === option.value
                ? 'border-blue-600 bg-blue-50 text-blue-900'
                : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-900'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RadioQuestion;
