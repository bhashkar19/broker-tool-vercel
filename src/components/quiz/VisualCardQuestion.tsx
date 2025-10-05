'use client';

import React from 'react';
import type { Question } from '@/config/questionConfigs';
import type { UserProfile } from '@/config/recommendationEngine';

interface VisualCardQuestionProps {
  question: Question;
  userData: UserProfile;
  onAnswerSelect: (value: string) => void;
}

/**
 * VisualCardQuestion Component
 * Large visual cards for questions with 2-3 options
 * Used for key decision points like "Do you trade?" and "What's your goal?"
 */
const VisualCardQuestion: React.FC<VisualCardQuestionProps> = ({
  question,
  userData,
  onAnswerSelect
}) => {
  const selectedValue = userData[question.field_name as keyof UserProfile] as string;

  // Icons for different question types
  const getIcon = (value: string) => {
    const iconMap: Record<string, string> = {
      // "Do you trade?" question
      'yes': '✅',
      'no': '🆕',
      // "What's your goal?" question
      'investor': '📊',
      'trader': '💰',
      'learner': '📚',
      'professional': '🎯',
      // "Knowledge level" question
      'beginner': '🌱',
      'intermediate': '📈',
      'advanced': '🚀'
    };
    return iconMap[value] || '⭐';
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2.5 text-center leading-tight">
        {question.label}
      </h2>
      {question.helpText && (
        <p className="text-sm text-blue-600 mb-5 text-center font-medium">{question.helpText}</p>
      )}

      <div className={`grid gap-4 ${question.options && question.options.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {question.options?.map((option) => (
          <button
            key={option.value}
            onClick={() => onAnswerSelect(option.value)}
            className={`
              relative overflow-hidden rounded-xl border-3 transition-all min-h-[140px] flex flex-col items-center justify-center
              ${question.options && question.options.length === 2 ? 'px-5 py-6' : 'px-6 py-7'}
              ${selectedValue === option.value
                ? 'border-blue-600 bg-blue-50 shadow-lg scale-105'
                : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:scale-102'
              }
            `}
          >
            {/* Icon */}
            <div className={`text-center mb-3 ${question.options && question.options.length === 2 ? 'text-5xl' : 'text-6xl'}`}>
              {getIcon(option.value)}
            </div>

            {/* Label */}
            <p className={`font-bold text-center leading-snug ${
              question.options && question.options.length === 2 ? 'text-base' : 'text-lg'
            } ${selectedValue === option.value ? 'text-blue-900' : 'text-gray-900'}`}>
              {option.label.replace(/^[✓✗📊💰📚🎯🌱📈🚀]\s*/, '')}
            </p>

            {/* Selected indicator */}
            {selectedValue === option.value && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VisualCardQuestion;
