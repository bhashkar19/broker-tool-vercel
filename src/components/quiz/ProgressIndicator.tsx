'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Question } from '@/config/questionConfigs';

interface ProgressIndicatorProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  progressPercentage: number;
  visibleQuestions: Question[];
  showRecommendation: boolean;
}

/**
 * ProgressIndicator Component
 * Displays progress bar, question counter, and progress dots
 * Extracted from ModularBrokerTool.tsx for better modularity
 */
const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentQuestionIndex,
  totalQuestions,
  progressPercentage,
  visibleQuestions,
  showRecommendation
}) => {
  return (
    <>
      {/* Progress Bar */}
      <div className="h-1 bg-blue-200">
        <motion.div
          className="h-full bg-white"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Question Counter & Progress Dots */}
      {!showRecommendation && (
        <div className="px-6 pt-4 pb-1">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs font-semibold text-gray-700">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </p>
            <p className="text-xs font-medium text-blue-600">
              {Math.round(progressPercentage)}% Complete
            </p>
          </div>

          {/* Progress Dots */}
          <div className="flex gap-1 justify-center">
            {visibleQuestions.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  index <= currentQuestionIndex
                    ? 'w-6 bg-blue-600'
                    : 'w-1.5 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ProgressIndicator;
