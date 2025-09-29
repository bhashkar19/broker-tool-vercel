'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle, TrendingUp, Star } from 'lucide-react';

// Import our modular configurations
import {
  getQuestionConfig,
  shouldShowQuestion,
  validateQuestion,
  type Question
} from '@/config/questionConfigs';
import {
  generateRecommendation,
  type UserProfile
} from '@/config/recommendationEngine';
import { getBrokerById } from '@/config/brokerConfigs';

// 🎯 MAIN COMPONENT
const ModularBrokerTool = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [userData, setUserData] = useState<UserProfile>({
    name: '',
    mobile: '',
    sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  });

  // Get current question configuration (easily changeable for A/B testing)
  const questionConfig = getQuestionConfig(); // Change to 'A', 'B', or 'C' for testing
  const visibleQuestions = questionConfig.questions.filter(q => shouldShowQuestion(q, userData));
  const currentQuestion = visibleQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex >= visibleQuestions.length - 1;

  // Progress calculation
  const progressPercentage = showRecommendation ? 100 : ((currentQuestionIndex + 1) / visibleQuestions.length) * 100;

  // Facebook Pixel tracking
  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', 'ToolStarted', {
        session_id: userData.sessionId,
        config_version: questionConfig.name,
        timestamp: new Date().toISOString()
      });
    }
  }, [userData.sessionId, questionConfig.name]);

  // Handle answer selection
  const handleAnswerSelect = (value: string) => {
    setUserData(prev => ({
      ...prev,
      [currentQuestion.field_name]: value
    }));

    // Track Facebook pixel event
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', 'QuestionAnswered', {
        question_id: currentQuestion.id,
        question_number: currentQuestionIndex + 1,
        answer: value,
        session_id: userData.sessionId
      });
    }
  };

  // Handle contact info update
  const handleContactUpdate = (field: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Validate current question
  const isCurrentQuestionValid = () => {
    if (currentQuestion.type === 'custom') {
      return validateQuestion(currentQuestion, userData, userData);
    }
    const value = userData[currentQuestion.field_name as keyof UserProfile];
    return validateQuestion(currentQuestion, value);
  };

  // Move to next question
  const nextQuestion = () => {
    if (currentQuestionIndex === 0) {
      // Track lead capture
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('trackCustom', 'LeadCaptured', {
          session_id: userData.sessionId
        });
      }
    }

    if (isLastQuestion) {
      setShowRecommendation(true);

      // Generate recommendation
      const recommendation = generateRecommendation(userData);

      // Track recommendation view
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'AddToCart');
        window.fbq('trackCustom', 'RecommendationViewed', {
          recommended_broker: recommendation.primary.brokerId,
          current_broker: userData.currentBroker,
          should_switch: recommendation.shouldSwitch,
          match_percentage: recommendation.primary.matchPercentage,
          session_id: userData.sessionId
        });
      }
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }

    // Track progress
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', 'QuestionProgressed', {
        completed_questions: currentQuestionIndex + 1,
        total_questions: visibleQuestions.length,
        session_id: userData.sessionId
      });
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 text-center">
        <h1 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <Target className="w-6 h-6" />
          Smart Broker Recommendation
        </h1>
        <p className="text-blue-100">
          {questionConfig.description}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-blue-200">
        <motion.div
          className="h-full bg-white"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Questions Container */}
      <div className="p-8 min-h-[400px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {!showRecommendation && currentQuestion && (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <QuestionRenderer
                question={currentQuestion}
                userData={userData}
                onAnswerSelect={handleAnswerSelect}
                onContactUpdate={handleContactUpdate}
              />

              <motion.button
                onClick={nextQuestion}
                disabled={!isCurrentQuestionValid()}
                className="w-full mt-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold text-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:-translate-y-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLastQuestion ? 'Get My Recommendation' : 'Continue'}
              </motion.button>
            </motion.div>
          )}

          {showRecommendation && (
            <RecommendationSection userData={userData} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// 📝 QUESTION RENDERER COMPONENT
const QuestionRenderer = ({
  question,
  userData,
  onAnswerSelect,
  onContactUpdate
}: {
  question: Question;
  userData: UserProfile;
  onAnswerSelect: (value: string) => void;
  onContactUpdate: (field: string, value: string) => void;
}) => {
  const selectedValue = userData[question.field_name as keyof UserProfile] as string;

  if (question.type === 'custom' && question.id === 'contact_info') {
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          {question.label}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Your Name</label>
            <input
              type="text"
              value={userData.name}
              onChange={(e) => onContactUpdate('name', e.target.value)}
              placeholder="Enter your full name"
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-900 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Mobile Number</label>
            <div className="flex gap-3">
              <div className="bg-gray-100 px-3 py-4 rounded-xl border-2 border-gray-200 font-semibold text-gray-600">
                +91
              </div>
              <input
                type="tel"
                value={userData.mobile}
                onChange={(e) => onContactUpdate('mobile', e.target.value)}
                placeholder="Enter your mobile number"
                className="flex-1 p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-900 bg-white"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (question.type === 'radio') {
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
              onClick={() => onAnswerSelect(option.value)}
              className={`w-full p-4 border-2 rounded-xl text-left font-medium transition-all ${
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
  }

  return null;
};

// 🎯 RECOMMENDATION SECTION
const RecommendationSection = ({ userData }: { userData: UserProfile }) => {
  const recommendation = generateRecommendation(userData);
  const primaryBroker = getBrokerById(recommendation.primary.brokerId);

  const handleConversion = async () => {
    // Track Facebook conversion
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Purchase', {
        value: 500,
        currency: 'INR'
      });

      window.fbq('trackCustom', 'AffiliateClicked', {
        broker: recommendation.primary.brokerId,
        switching_from: userData.currentBroker,
        match_percentage: recommendation.primary.matchPercentage,
        should_switch: recommendation.shouldSwitch,
        session_id: userData.sessionId
      });
    }

    // Submit data to backend
    try {
      await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          recommended_broker: recommendation.primary.brokerId,
          match_percentage: recommendation.primary.matchPercentage,
          should_switch: recommendation.shouldSwitch,
          alternatives: recommendation.alternatives.map(alt => alt.brokerId).join(','),
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
          fb_click_id: new URLSearchParams(window.location.search).get('fbclid'),
          utm_source: new URLSearchParams(window.location.search).get('utm_source'),
          utm_medium: new URLSearchParams(window.location.search).get('utm_medium'),
          utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign')
        })
      });
    } catch (error) {
      console.error('Error submitting data:', error);
    }

    // Redirect to affiliate link
    window.open(recommendation.primary.affiliate_url, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-2">
        <Star className="w-6 h-6 text-yellow-500" />
        Your Perfect Broker Match
      </h2>

      {/* User Profile Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
        <h4 className="font-semibold text-blue-800 mb-2">Your Profile:</h4>
        <p className="text-blue-700 text-sm">
          {recommendation.userProfile.type} • {recommendation.userProfile.priority} priority • {recommendation.userProfile.frequency} trading
        </p>
      </div>

      {/* Primary Recommendation */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <TrendingUp className="w-6 h-6" />
          <h3 className="text-2xl font-bold">Recommended: {primaryBroker?.name}</h3>
        </div>
        <div className="text-green-100 mb-2">
          {recommendation.primary.matchPercentage}% match for your needs
        </div>
        <p className="text-green-100 text-sm">
          {primaryBroker?.real_insights.perfect_for}
        </p>
      </div>

      {/* Reasoning */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6 text-left">
        <h4 className="font-semibold text-gray-800 mb-3">Why we recommend {primaryBroker?.name}:</h4>
        <div className="text-gray-700 text-sm whitespace-pre-line">
          {recommendation.reasoning}
        </div>
      </div>

      {/* Key Benefits */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6 text-left">
        <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Key Benefits for You:
        </h4>
        <ul className="text-blue-700 space-y-2">
          {recommendation.primary.reasons.slice(0, 3).map((reason, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-1 text-green-500 flex-shrink-0" />
              {reason}
            </li>
          ))}
        </ul>
      </div>

      {/* Alternative Options */}
      {recommendation.alternatives.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6 text-left">
          <h4 className="font-semibold text-yellow-800 mb-3">Alternative Options:</h4>
          <div className="space-y-2">
            {recommendation.alternatives.map((alt, index) => (
              <div key={index} className="text-yellow-700 text-sm">
                <strong>{alt.brokerName}</strong> ({alt.matchPercentage}% match) - {getBrokerById(alt.brokerId)?.real_insights.perfect_for}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA Button */}
      <motion.button
        onClick={handleConversion}
        className="w-full py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold text-lg uppercase tracking-wide transition-all hover:shadow-xl"
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        🚀 Open {primaryBroker?.name} Account Now
      </motion.button>

      {/* Trust Indicators */}
      <div className="mt-6 text-sm text-gray-600 flex items-center justify-center gap-6">
        <span className="flex items-center gap-1">
          <CheckCircle className="w-4 h-4 text-green-500" />
          SEBI Registered
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle className="w-4 h-4 text-green-500" />
          Bank-grade Security
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle className="w-4 h-4 text-green-500" />
          Instant Activation
        </span>
      </div>
    </motion.div>
  );
};

export default ModularBrokerTool;