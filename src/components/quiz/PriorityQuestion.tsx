'use client';

import React from 'react';
import type { Question } from '@/config/questionConfigs';
import type { UserProfile } from '@/config/recommendationEngine';

interface PriorityQuestionProps {
  question: Question;
  userData: UserProfile;
  onAnswerSelect: (value: { rank: number; value: string }[]) => void;
}

/**
 * PriorityQuestion Component
 * Allows users to select TOP 3 priorities with visual ranking (1st, 2nd, 3rd)
 * Shows dynamic badges on each selection in order of clicks
 */
const PriorityQuestion: React.FC<PriorityQuestionProps> = ({
  question,
  userData,
  onAnswerSelect
}) => {
  const selectedPriorities = (userData[question.field_name as keyof UserProfile] as { rank: number; value: string }[]) || [];
  const maxSelections = question.maxSelections || 3;

  const toggleOption = (value: string) => {
    // Check if already selected
    const existingIndex = selectedPriorities.findIndex(p => p.value === value);

    if (existingIndex !== -1) {
      // Deselect: Remove this priority and re-rank remaining
      const newPriorities = selectedPriorities
        .filter(p => p.value !== value)
        .map((p, index) => ({ ...p, rank: index + 1 }));
      onAnswerSelect(newPriorities);
    } else {
      // Select: Add as next rank (if under max)
      if (selectedPriorities.length < maxSelections) {
        const newPriorities = [
          ...selectedPriorities,
          { rank: selectedPriorities.length + 1, value }
        ];
        onAnswerSelect(newPriorities);
      }
    }
  };

  // Grid layout classes
  const gridClass = {
    '2x2': 'grid-cols-2 gap-3',
    '2x3': 'grid-cols-2 gap-2.5',
    '3x2': 'grid-cols-3 gap-2.5'
  }[question.gridLayout || '2x2'];

  const getPriorityRank = (value: string): number | null => {
    const priority = selectedPriorities.find(p => p.value === value);
    return priority ? priority.rank : null;
  };

  const isSelected = (value: string) => getPriorityRank(value) !== null;
  const isDisabled = selectedPriorities.length >= maxSelections;

  // Badge styles for each rank
  const getBadgeStyle = (rank: number) => {
    const styles = {
      1: { bg: 'bg-green-500', text: 'text-green-500', label: '1️⃣ TOP PRIORITY', border: 'border-green-500' },
      2: { bg: 'bg-blue-500', text: 'text-blue-500', label: '2️⃣ 2ND PRIORITY', border: 'border-blue-500' },
      3: { bg: 'bg-purple-500', text: 'text-purple-500', label: '3️⃣ 3RD PRIORITY', border: 'border-purple-500' }
    };
    return styles[rank as 1 | 2 | 3] || styles[3];
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-2 text-center leading-tight">
        {question.label}
      </h2>
      {question.helpText && (
        <p className="text-xs text-blue-600 mb-3 text-center font-medium">{question.helpText}</p>
      )}

      <div className={`grid ${gridClass} mb-2.5`}>
        {question.options?.map((option) => {
          const rank = getPriorityRank(option.value);
          const selected = rank !== null;
          const badgeStyle = rank ? getBadgeStyle(rank) : null;

          return (
            <button
              key={option.value}
              onClick={() => toggleOption(option.value)}
              disabled={!selected && isDisabled}
              className={`
                relative px-3 py-4 border-2 rounded-xl text-left font-semibold transition-all overflow-hidden
                ${selected
                  ? `${badgeStyle?.border} bg-gradient-to-br from-white to-${badgeStyle?.bg.replace('bg-', '')}/10 shadow-lg text-gray-900`
                  : isDisabled
                    ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-900'
                }
              `}
            >
              {/* Priority Badge - TOP LEFT (inside card, doesn't overlap) */}
              {selected && badgeStyle && (
                <div className={`absolute top-2 left-2 ${badgeStyle.bg} text-white px-1.5 py-0.5 rounded-md text-[9px] font-bold shadow-sm`}>
                  {rank === 1 ? '1ST' : rank === 2 ? '2ND' : '3RD'}
                </div>
              )}

              {/* Icon - with right padding when selected */}
              <div className={`text-2xl mb-1.5 ${selected ? 'pr-12' : ''}`}>
                {option.icon}
              </div>

              {/* Label - Clear and readable */}
              <div className="text-xs font-bold leading-tight mb-1 pr-1 text-gray-900">
                {option.label}
              </div>

              {/* Description */}
              {option.description && (
                <div className="text-[10px] text-gray-700 leading-snug pr-1">
                  {option.description}
                </div>
              )}

              {/* Priority Label - BOTTOM (cleaner design) */}
              {selected && badgeStyle && (
                <div className={`mt-2 pt-1.5 border-t ${badgeStyle.border} border-opacity-30`}>
                  <div className={`text-[9px] font-bold ${badgeStyle.text} uppercase tracking-wide flex items-center gap-1`}>
                    <span>{rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}</span>
                    <span>{rank === 1 ? 'Top Priority' : rank === 2 ? '2nd Priority' : '3rd Priority'}</span>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Progress indicator */}
      <div className="mt-3 text-center">
        {selectedPriorities.length === 0 && (
          <p className="text-xs text-gray-500 font-medium">
            Tap to select your top {maxSelections} priorities
          </p>
        )}
        {selectedPriorities.length > 0 && selectedPriorities.length < maxSelections && (
          <p className="text-xs text-blue-600 font-medium">
            ✓ {selectedPriorities.length} selected • Select {maxSelections - selectedPriorities.length} more
          </p>
        )}
        {selectedPriorities.length === maxSelections && (
          <p className="text-xs text-green-600 font-bold animate-in fade-in duration-300">
            ✓ All {maxSelections} priorities selected! Tap to reorder
          </p>
        )}
      </div>

      {/* Reorder hint */}
      {selectedPriorities.length === maxSelections && (
        <p className="text-[10px] text-center text-gray-500 mt-2 italic">
          Tap a selected option to remove it
        </p>
      )}
    </div>
  );
};

export default PriorityQuestion;
