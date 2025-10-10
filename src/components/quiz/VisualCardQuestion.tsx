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
  const getIcon = (option: { value: string; icon?: string }) => {
    // If custom icon provided, use it
    if (option.icon) return option.icon;

    // Otherwise use default icon mapping
    const iconMap: Record<string, string> = {
      // "Do you trade?" question
      'yes': '✅',
      'no': '🆕',
      // "What's your goal?" question
      'investor': '📈',
      'trader': '⚡',
      'learner': '🎓',
      'professional': '🎯',
      // "Knowledge level" question
      'beginner': '🌱',
      'intermediate': '📊',
      'advanced': '🚀',
      // Trading style question
      'day_trader': '📊',
      'swing_trader': '⚡',
      'long_term_investor': '📈',
      'hybrid': '🎯',
      // Investment capital question
      'growing': '📊',
      'established': '💼',
      'serious': '🏆'
    };
    return iconMap[option.value] || '⭐';
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2.5 text-center leading-tight">
        {question.label}
      </h2>
      {question.helpText && (
        <p className="text-sm text-blue-600 mb-5 text-center font-medium">{question.helpText}</p>
      )}

      <div className={`grid gap-2 ${question.options && question.options.length <= 2 ? 'grid-cols-2' : question.options && question.options.length >= 4 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {question.options?.map((option) => (
          <button
            key={option.value}
            onClick={() => onAnswerSelect(option.value)}
            className={`
              relative overflow-hidden rounded-xl border-2 transition-all flex flex-col items-center justify-center
              ${option.description ? 'py-3 px-4' : 'py-3 px-4'}
              ${question.options && question.options.length === 2 ? '' : ''}
              ${selectedValue === option.value
                ? 'border-blue-600 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
              }
            `}
          >
            {/* Icon - Centered on top */}
            <div className="flex-shrink-0 text-3xl mb-2 text-center">
              {getIcon(option)}
            </div>

            {/* Text content */}
            <div className="flex-1 text-center w-full">
              {/* Label */}
              <p className={`font-bold leading-tight ${
                option.description ? 'text-sm mb-1' : 'text-sm'
              } ${selectedValue === option.value ? 'text-blue-900' : 'text-gray-900'}`}>
                {option.label.replace(/^[✓✗📊💰📚🎯🌱📈🚀⚡🎓]\s*/, '')}
              </p>

              {/* Description (if provided) */}
              {option.description && (
                <p className={`text-xs leading-snug ${
                  selectedValue === option.value ? 'text-blue-700' : 'text-gray-700'
                }`}>
                  {option.description}
                </p>
              )}
            </div>

            {/* Selected indicator */}
            {selectedValue === option.value && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
