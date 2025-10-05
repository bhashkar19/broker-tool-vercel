'use client';

import React, { useState } from 'react';
import type { Question } from '@/config/questionConfigs';
import type { UserProfile } from '@/config/recommendationEngine';

interface GridCheckboxQuestionProps {
  question: Question;
  userData: UserProfile;
  onAnswerSelect: (value: string[]) => void;
}

/**
 * GridCheckboxQuestion Component
 * Multi-select checkbox question with grid layout for better space usage
 * Supports 2x2, 2x3, 3x2 grids and custom "Other" option
 */
const GridCheckboxQuestion: React.FC<GridCheckboxQuestionProps> = ({
  question,
  userData,
  onAnswerSelect
}) => {
  const selectedValues = (userData[question.field_name as keyof UserProfile] as string[]) || [];
  const [customValue, setCustomValue] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const toggleOption = (value: string) => {
    if (value === 'custom') {
      setShowCustomInput(!showCustomInput);
      if (showCustomInput) {
        // Remove custom value when unchecking
        const filtered = selectedValues.filter(v => !v.startsWith('custom:'));
        onAnswerSelect(filtered);
        setCustomValue('');
      }
      return;
    }

    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];

    onAnswerSelect(newValues);
  };

  const handleCustomSubmit = () => {
    if (customValue.trim()) {
      const filtered = selectedValues.filter(v => !v.startsWith('custom:'));
      onAnswerSelect([...filtered, `custom:${customValue.trim()}`]);
    }
  };

  // Grid layout classes
  const gridClass = {
    '2x2': 'grid-cols-2 gap-3',
    '2x3': 'grid-cols-2 gap-2.5',
    '3x2': 'grid-cols-3 gap-2.5'
  }[question.gridLayout || '2x2'];

  const isSelected = (value: string) => selectedValues.includes(value);
  const hasCustomValue = selectedValues.some(v => v.startsWith('custom:'));

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2.5 text-center leading-tight">
        {question.label}
      </h2>
      {question.helpText && (
        <p className="text-sm text-blue-600 mb-4 text-center font-medium">{question.helpText}</p>
      )}

      <div className={`grid ${gridClass} mb-3`}>
        {question.options?.map((option) => (
          <button
            key={option.value}
            onClick={() => toggleOption(option.value)}
            className={`
              relative px-4 py-5 border-2 rounded-xl text-center font-semibold transition-all
              ${isSelected(option.value)
                ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-md'
                : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-900'
              }
            `}
          >
            {/* Checkbox indicator */}
            <div className={`absolute top-2 right-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
              isSelected(option.value)
                ? 'border-blue-600 bg-blue-600'
                : 'border-gray-300 bg-white'
            }`}>
              {isSelected(option.value) && (
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>

            {/* Option label */}
            <span className="text-sm leading-tight block pr-6">
              {option.label}
            </span>
          </button>
        ))}

        {/* Custom "Other" option */}
        {question.allowCustom && (
          <button
            onClick={() => toggleOption('custom')}
            className={`
              relative px-4 py-5 border-2 rounded-xl text-center font-semibold transition-all
              ${showCustomInput || hasCustomValue
                ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-md'
                : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-900'
              }
            `}
          >
            {/* Checkbox indicator */}
            <div className={`absolute top-2 right-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
              showCustomInput || hasCustomValue
                ? 'border-blue-600 bg-blue-600'
                : 'border-gray-300 bg-white'
            }`}>
              {(showCustomInput || hasCustomValue) && (
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>

            <span className="text-sm leading-tight block pr-6">
              💬 Other
            </span>
          </button>
        )}
      </div>

      {/* Custom input field */}
      {question.allowCustom && showCustomInput && (
        <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Please specify:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              onBlur={handleCustomSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCustomSubmit();
                  e.currentTarget.blur();
                }
              }}
              placeholder="Type here and press Enter..."
              className="flex-1 px-4 py-3 border-2 border-blue-400 rounded-lg text-base font-medium text-gray-900 bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 placeholder:text-gray-400"
              autoFocus
            />
          </div>
          {hasCustomValue && (
            <p className="text-xs text-green-600 mt-1.5 font-medium">
              ✓ &ldquo;{selectedValues.find(v => v.startsWith('custom:'))?.replace('custom:', '')}&rdquo; added
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Press Enter or tap outside to save
          </p>
        </div>
      )}

      {/* Selection counter */}
      {selectedValues.length > 0 && (
        <p className="text-xs text-center text-gray-500 mt-3">
          {selectedValues.length} selected
        </p>
      )}
    </div>
  );
};

export default GridCheckboxQuestion;
