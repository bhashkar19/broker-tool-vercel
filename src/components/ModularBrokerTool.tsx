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
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserProfile>({
    name: '',
    mobile: '',
    sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  });

  // Get A/B test version from URL parameter (?v=a or ?v=b)
  const getVersionFromURL = (): 'A' | 'B' | undefined => {
    if (typeof window === 'undefined') return undefined;
    const searchParams = new URLSearchParams(window.location.search);
    const version = searchParams.get('v')?.toUpperCase();
    return version === 'A' || version === 'B' ? version : undefined;
  };

  const abTestVersion = getVersionFromURL();
  const questionConfig = getQuestionConfig(abTestVersion);
  const visibleQuestions = questionConfig.questions.filter(q => shouldShowQuestion(q, userData));
  const currentQuestion = visibleQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex >= visibleQuestions.length - 1;

  // Progress calculation
  const progressPercentage = showRecommendation ? 100 : ((currentQuestionIndex + 1) / visibleQuestions.length) * 100;

  // Facebook Pixel + Supabase Backup Tracking
  useEffect(() => {
    // Facebook Pixel
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', 'ToolStarted', {
        session_id: userData.sessionId,
        config_version: questionConfig.name,
        ab_test_version: abTestVersion || 'A',
        timestamp: new Date().toISOString()
      });
    }

    // Supabase Backup Tracking
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: 'tool_started',
        session_id: userData.sessionId,
        event_data: { config_version: questionConfig.name }
      })
    }).catch(err => console.error('Tracking error:', err));
  }, [userData.sessionId, questionConfig.name]);

  // Handle answer selection
  const handleAnswerSelect = (value: string) => {
    let processedValue: unknown = value;

    // Handle checkbox data (stored as JSON string)
    if (currentQuestion.type === 'checkbox') {
      try {
        processedValue = JSON.parse(value);
      } catch {
        processedValue = [value];
      }
    }

    // Handle combined broker selection (stored as JSON string)
    if (currentQuestion.type === 'custom' && currentQuestion.id === 'combined_broker_selection') {
      try {
        processedValue = JSON.parse(value);
      } catch {
        processedValue = { count: '', brokers: [] };
      }
    }

    setUserData(prev => ({
      ...prev,
      [currentQuestion.field_name]: processedValue
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

    // Track Google Analytics event
    if (typeof window !== 'undefined' && 'gtag' in window) {
      const gtag = (window as Window & { gtag: (...args: unknown[]) => void }).gtag;
      gtag('event', 'question_answered', {
        question_id: currentQuestion.id,
        question_number: currentQuestionIndex + 1,
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

    // Track Contact event when user starts filling form (Facebook standard event)
    if (field === 'name' && value.length === 1 && typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Contact', {
        content_name: 'broker_recommendation_form',
        content_category: 'lead_form'
      });
    }
  };

  // Validate current question
  const isCurrentQuestionValid = () => {
    if (currentQuestion.type === 'custom') {
      if (currentQuestion.id === 'contact_info') {
        const isValid = validateQuestion(currentQuestion, userData, userData);
        console.log('Contact validation:', {
          name: userData.name,
          mobile: userData.mobile,
          nameLength: userData.name?.length,
          mobileLength: userData.mobile?.length,
          isValid
        });
        return isValid;
      }
      if (currentQuestion.id === 'current_brokers_smart') {
        const expectedCount = parseInt(userData.brokerCount || '1');
        let selectedBrokers = (userData.currentBrokers as string[]) || [];

        // Handle JSON string parsing if needed
        if (typeof userData.currentBrokers === 'string') {
          try {
            selectedBrokers = JSON.parse(userData.currentBrokers);
          } catch {
            selectedBrokers = [];
          }
        }

        console.log('Broker validation:', {
          expectedCount,
          selectedBrokers,
          selectedLength: selectedBrokers.length,
          isValid: selectedBrokers.length === expectedCount,
          rawData: userData.currentBrokers
        });

        return selectedBrokers.length === expectedCount;
      }

      if (currentQuestion.id === 'combined_broker_selection') {
        // Flexible validation - just need at least one broker selected
        let brokerData = userData.brokerInfo as { count?: string; brokers?: string[] } | undefined;

        // Handle case where brokerInfo might still be a JSON string
        if (typeof userData.brokerInfo === 'string') {
          try {
            brokerData = JSON.parse(userData.brokerInfo);
          } catch {
            brokerData = { count: '', brokers: [] };
          }
        }

        const selectedBrokers = brokerData?.brokers || [];

        console.log('Combined broker validation:', {
          rawBrokerInfo: userData.brokerInfo,
          brokerData,
          selectedBrokers,
          selectedLength: selectedBrokers.length,
          isValid: selectedBrokers.length > 0
        });

        return selectedBrokers.length > 0;
      }
    }
    const value = userData[currentQuestion.field_name as keyof UserProfile];
    return validateQuestion(currentQuestion, value);
  };

  // Move to next question
  const nextQuestion = () => {
    if (currentQuestionIndex === 0) {
      // Track lead capture (FB Standard + Custom + Supabase)
      if (typeof window !== 'undefined' && window.fbq) {
        // Standard Lead event (helps Facebook optimize for lead generation)
        window.fbq('track', 'Lead', {
          content_name: 'broker_finder_lead',
          content_category: 'financial_services',
          value: 100, // Estimated value of a lead
          currency: 'INR'
        });

        // Google Analytics Lead event
        if ('gtag' in window) {
          const gtag = (window as Window & { gtag: (...args: unknown[]) => void }).gtag;
          gtag('event', 'generate_lead', {
            currency: 'INR',
            value: 100
          });
        }

        // Custom event for detailed tracking
        window.fbq('trackCustom', 'LeadCaptured', {
          session_id: userData.sessionId,
          name_length: userData.name?.length || 0,
          has_mobile: !!userData.mobile
        });
      }
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_name: 'lead_captured',
          session_id: userData.sessionId,
          event_data: { name: userData.name, mobile: userData.mobile }
        })
      }).catch(err => console.error('Tracking error:', err));
    }

    if (isLastQuestion) {
      setShowRecommendation(true);

      // Generate recommendation
      const recommendation = generateRecommendation(userData);

      // Track recommendation view (FB Standard + Custom + Supabase)
      if (typeof window !== 'undefined' && window.fbq) {
        // Standard AddToCart (user received recommendation)
        window.fbq('track', 'AddToCart', {
          content_name: recommendation.primary.brokerId,
          content_category: 'broker_recommendation',
          value: 300, // Estimated value of engaged user
          currency: 'INR'
        });

        // Standard ViewContent for better tracking
        window.fbq('track', 'ViewContent', {
          content_name: `broker_${recommendation.primary.brokerId}`,
          content_type: 'recommendation',
          value: 300,
          currency: 'INR'
        });

        // Custom event for detailed tracking
        window.fbq('trackCustom', 'RecommendationViewed', {
          recommended_broker: recommendation.primary.brokerId,
          current_broker: userData.currentBroker,
          should_switch: recommendation.shouldSwitch,
          match_percentage: recommendation.primary.matchPercentage,
          session_id: userData.sessionId
        });
      }
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_name: 'recommendation_viewed',
          session_id: userData.sessionId,
          broker_id: recommendation.primary.brokerId,
          event_data: {
            match_percentage: recommendation.primary.matchPercentage,
            should_switch: recommendation.shouldSwitch
          }
        })
      }).catch(err => console.error('Tracking error:', err));
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }

    // Track progress (FB + Supabase)
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', 'QuestionProgressed', {
        completed_questions: currentQuestionIndex + 1,
        total_questions: visibleQuestions.length,
        session_id: userData.sessionId
      });
    }
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: 'question_progressed',
        session_id: userData.sessionId,
        event_data: {
          completed_questions: currentQuestionIndex + 1,
          total_questions: visibleQuestions.length
        }
      })
    }).catch(err => console.error('Tracking error:', err));
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

      {/* Question Counter & Progress Dots */}
      {!showRecommendation && (
        <div className="px-8 pt-6 pb-2">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-700">
              Question {currentQuestionIndex + 1} of {visibleQuestions.length}
            </p>
            <p className="text-sm font-medium text-blue-600">
              {Math.round(progressPercentage)}% Complete
            </p>
          </div>
          {/* Progress Dots */}
          <div className="flex gap-1.5 justify-center">
            {visibleQuestions.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index <= currentQuestionIndex
                    ? 'w-8 bg-blue-600'
                    : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      )}

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
              {/* Motivational message */}
              {currentQuestionIndex > 0 && currentQuestionIndex < visibleQuestions.length - 1 && (
                <p className="text-center text-sm text-green-600 font-medium mb-4">
                  {currentQuestionIndex === 1 ? "Great! We're learning about you..." :
                   currentQuestionIndex >= visibleQuestions.length - 2 ? "Almost there! Just one more..." :
                   "You're doing great! Keep going..."}
                </p>
              )}

              <QuestionRenderer
                question={currentQuestion}
                userData={userData}
                onAnswerSelect={handleAnswerSelect}
                onContactUpdate={handleContactUpdate}
              />

              <motion.button
                onClick={nextQuestion}
                disabled={!isCurrentQuestionValid()}
                className={`w-full mt-6 py-5 rounded-xl font-bold text-lg transition-all hover:shadow-lg ${
                  !isCurrentQuestionValid()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : isLastQuestion
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:-translate-y-1'
                }`}
                whileHover={isCurrentQuestionValid() ? { scale: 1.02 } : {}}
                whileTap={isCurrentQuestionValid() ? { scale: 0.98 } : {}}
              >
                {isLastQuestion ? '🎯 Show My Perfect Match' :
                 currentQuestionIndex >= visibleQuestions.length - 2 ? 'Almost There! Continue →' :
                 'Next Question →'}
              </motion.button>

              {/* Helper text */}
              {!isCurrentQuestionValid() && currentQuestion.type === 'custom' && currentQuestion.id === 'contact_info' && (
                <p className="text-center text-xs text-gray-500 mt-3">
                  ↑ Fill both fields above to continue
                </p>
              )}
              {!isLastQuestion && currentQuestion.type !== 'custom' && !isCurrentQuestionValid() && (
                <p className="text-center text-xs text-gray-500 mt-3">
                  Select an option to continue →
                </p>
              )}
            </motion.div>
          )}

          {showRecommendation && (
            <RecommendationSection
              userData={userData}
              apiError={apiError}
              apiSuccess={apiSuccess}
              setApiError={setApiError}
              setApiSuccess={setApiSuccess}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Minimal Footer */}
      <footer className="mt-20 pb-4 text-center border-t border-gray-50">
        <div className="text-[9px] text-gray-400 space-x-2 pt-6 tracking-wide">
          <a
            href="https://www.paisowala.com/privacy-policy/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-500 transition-colors"
          >
            Privacy Policy
          </a>
          <span className="text-gray-300">·</span>
          <a
            href="https://www.paisowala.com/terms-of-service/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-500 transition-colors"
          >
            Terms of Service
          </a>
          <span className="text-gray-300">·</span>
          <span>© 2024 Paisowala</span>
        </div>
      </footer>
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
                  href="https://www.paisowala.com/privacy-policy/"
                  target="_blank"
                  rel="noopener noreferrer"
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
  }

  if (question.type === 'custom' && question.id === 'current_brokers_smart') {
    return <SmartBrokerSelection userData={userData} onAnswerSelect={onAnswerSelect} />;
  }

  if (question.type === 'custom' && question.id === 'combined_broker_selection') {
    return <CombinedBrokerSelection userData={userData} onAnswerSelect={onAnswerSelect} />;
  }

  if (question.type === 'radio') {
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-3 text-center">
          {question.label}
        </h2>
        {question.helpText && (
          <p className="text-sm text-blue-600 mb-5 text-center font-medium">{question.helpText}</p>
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

  if (question.type === 'checkbox') {
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
  }

  return null;
};

// 🎯 SMART BROKER SELECTION COMPONENT
const SmartBrokerSelection = ({
  userData,
  onAnswerSelect
}: {
  userData: UserProfile;
  onAnswerSelect: (value: string) => void;
}) => {
  // Initialize selectedBrokers with proper parsing
  const initializeBrokers = () => {
    let brokers = (userData.currentBrokers as string[]) || [];
    if (typeof userData.currentBrokers === 'string') {
      try {
        brokers = JSON.parse(userData.currentBrokers);
      } catch {
        brokers = [];
      }
    }
    return Array.isArray(brokers) ? brokers : [];
  };

  const [selectedBrokers, setSelectedBrokers] = useState<string[]>(initializeBrokers);
  const [otherBroker, setOtherBroker] = useState('');
  const [showAllBrokers, setShowAllBrokers] = useState(false);

  const expectedCount = parseInt(userData.brokerCount || '1');
  const isCountMatching = selectedBrokers.length === expectedCount;

  // Sync initial selection when userData changes
  useEffect(() => {
    let currentBrokers = (userData.currentBrokers as string[]) || [];

    // Parse JSON string if needed
    if (typeof userData.currentBrokers === 'string') {
      try {
        currentBrokers = JSON.parse(userData.currentBrokers);
      } catch {
        currentBrokers = [];
      }
    }

    // Ensure it's an array
    if (!Array.isArray(currentBrokers)) {
      currentBrokers = [];
    }

    // Update state if needed and trigger answer selection
    if (currentBrokers.length > 0) {
      setSelectedBrokers(currentBrokers);
      onAnswerSelect(JSON.stringify(currentBrokers));
    }
  }, [userData.currentBrokers, onAnswerSelect]);

  // Also trigger validation when selectedBrokers changes
  useEffect(() => {
    if (selectedBrokers.length > 0) {
      onAnswerSelect(JSON.stringify(selectedBrokers));
    }
  }, [selectedBrokers, onAnswerSelect]);

  // Broker options: Sorted by popularity with working logos and fallback emojis
  const brokerOptions = [
    // TOP TIER - Most Popular (Partner brokers)
    { value: 'zerodha', label: 'Zerodha', logo: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/zerodha.svg', fallback: '🟢', popularity: 1, isPartner: true },
    { value: 'groww', label: 'Groww', logo: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/groww.png', fallback: '🌱', popularity: 2, isPartner: false },
    { value: 'angel_one', label: 'Angel One', logo: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/angelone.png', fallback: '😇', popularity: 3, isPartner: true },
    { value: 'upstox', label: 'Upstox', logo: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/upstox.svg', fallback: '🟠', popularity: 4, isPartner: true },

    // MID TIER - Popular brokers
    { value: 'icici', label: 'ICICI Direct', logo: '🏦', fallback: '🏦', popularity: 5, isPartner: false },
    { value: 'hdfc', label: 'HDFC Securities', logo: '🏛️', fallback: '🏛️', popularity: 6, isPartner: false },
    { value: 'kotak', label: 'Kotak Securities', logo: '🔷', fallback: '🔷', popularity: 7, isPartner: false },
    { value: 'dhan', label: 'DHAN', logo: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/dhan.svg', fallback: '⚡', popularity: 8, isPartner: false },
    { value: 'paytm', label: 'Paytm Money', logo: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/paytm.png', fallback: '💰', popularity: 9, isPartner: false },

    // LOWER TIER - Less popular but still relevant
    { value: '5paisa', label: '5paisa', logo: '5️⃣', fallback: '5️⃣', popularity: 10, isPartner: true },
    { value: 'fyers', label: 'Fyers', logo: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/fyers.svg', fallback: '🟣', popularity: 11, isPartner: true },
    { value: 'sharekhan', label: 'Sharekhan', logo: '📈', fallback: '📈', popularity: 12, isPartner: false },
    { value: 'sbi', label: 'SBI Securities', logo: '🏦', fallback: '🏦', popularity: 13, isPartner: false },
    { value: 'motilal', label: 'Motilal Oswal', logo: '💼', fallback: '💼', popularity: 14, isPartner: false },
    { value: 'iifl', label: 'IIFL Securities', logo: '📊', fallback: '📊', popularity: 15, isPartner: false },
    { value: 'axis', label: 'Axis Direct', logo: '🔴', fallback: '🔴', popularity: 16, isPartner: false }
  ];

  // Debug: Log broker logos on mount
  useEffect(() => {
    console.log('🖼️ Broker logos loaded:', brokerOptions.map(b => ({ name: b.label, logo: b.logo })));
  }, []);

  // Show top 8 popular brokers by default, rest on "Show More"
  const topBrokers = brokerOptions.filter(b => (b.popularity || 999) <= 8);
  const moreBrokers = brokerOptions.filter(b => (b.popularity || 999) > 8);
  const displayedBrokers = showAllBrokers ? brokerOptions : topBrokers;

  const handleBrokerToggle = (brokerId: string) => {
    const newSelection = selectedBrokers.includes(brokerId)
      ? selectedBrokers.filter(id => id !== brokerId)
      : [...selectedBrokers, brokerId];

    // Prevent selecting more than expected count
    if (newSelection.length <= expectedCount) {
      setSelectedBrokers(newSelection);

      // Always update the answer, regardless of count
      onAnswerSelect(JSON.stringify(newSelection));
    }
  };

  const handleOtherBrokerAdd = () => {
    if (otherBroker.trim() && selectedBrokers.length < expectedCount) {
      const newSelection = [...selectedBrokers, `other_${otherBroker.toLowerCase().replace(/\s+/g, '_')}`];
      setSelectedBrokers(newSelection);
      setOtherBroker('');

      // Always update the answer
      onAnswerSelect(JSON.stringify(newSelection));
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Select exactly {expectedCount} broker{expectedCount > 1 ? 's' : ''}
      </h2>

      <p className="text-sm text-gray-600 mb-6 text-center">
        You mentioned you use {expectedCount} broker{expectedCount > 1 ? 's' : ''}.
        Please select them below.
      </p>

      {/* Progress indicator */}
      <div className="mb-6 p-3 bg-gray-50 rounded-lg">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Selected: {selectedBrokers.length}</span>
          <span>Required: {expectedCount}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              isCountMatching ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${(selectedBrokers.length / expectedCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Broker selection grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {displayedBrokers.map((broker) => (
          <button
            key={broker.value}
            onClick={() => handleBrokerToggle(broker.value)}
            disabled={!selectedBrokers.includes(broker.value) && selectedBrokers.length >= expectedCount}
            className={`p-4 border-2 rounded-xl font-medium transition-all flex items-center gap-3 ${
              selectedBrokers.includes(broker.value)
                ? 'border-blue-600 bg-blue-50 text-blue-900'
                : selectedBrokers.length >= expectedCount
                ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-900'
            }`}
          >
            {broker.logo.startsWith('http') ? (
              <img
                src={broker.logo}
                alt={broker.label}
                className="w-10 h-10 object-contain flex-shrink-0"
                onError={(e) => {
                  console.error(`Failed to load logo for ${broker.label}:`, broker.logo);
                  e.currentTarget.style.display = 'none';
                  const fallback = document.createElement('span');
                  fallback.textContent = broker.fallback || '📊';
                  fallback.className = 'text-3xl';
                  e.currentTarget.parentElement?.appendChild(fallback);
                }}
                loading="lazy"
              />
            ) : (
              <span className="text-3xl">{broker.fallback || broker.logo}</span>
            )}
            <span className="text-sm">{broker.label}</span>
            {selectedBrokers.includes(broker.value) && (
              <CheckCircle className="w-4 h-4 text-blue-600 ml-auto" />
            )}
          </button>
        ))}
      </div>

      {/* Show More / Show Less Button */}
      {moreBrokers.length > 0 && (
        <button
          onClick={() => setShowAllBrokers(!showAllBrokers)}
          className="w-full mb-4 py-3 border-2 border-blue-400 text-blue-600 rounded-xl font-medium text-sm hover:bg-blue-50 transition-colors"
        >
          {showAllBrokers ? `↑ Show Less` : `↓ Show ${moreBrokers.length} More Brokers`}
        </button>
      )}

      {/* Others option */}
      {selectedBrokers.length < expectedCount && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Don&apos;t see your broker? Add it here:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={otherBroker}
              onChange={(e) => setOtherBroker(e.target.value)}
              placeholder="Enter broker name"
              className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-sm text-gray-900 bg-white placeholder-gray-400"
            />
            <button
              onClick={handleOtherBrokerAdd}
              disabled={!otherBroker.trim()}
              className="px-4 py-3 bg-gray-600 text-white rounded-xl text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Validation message */}
      {selectedBrokers.length > 0 && !isCountMatching && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          {selectedBrokers.length < expectedCount
            ? `Please select ${expectedCount - selectedBrokers.length} more broker${expectedCount - selectedBrokers.length > 1 ? 's' : ''}`
            : `You selected too many. Please remove ${selectedBrokers.length - expectedCount} broker${selectedBrokers.length - expectedCount > 1 ? 's' : ''}`
          }
        </div>
      )}

      {/* Success message */}
      {isCountMatching && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Perfect! You&apos;ve selected exactly {expectedCount} broker{expectedCount > 1 ? 's' : ''}.
        </div>
      )}

      {/* Selected brokers list */}
      {selectedBrokers.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700 font-medium mb-2">Selected brokers:</p>
          <div className="flex flex-wrap gap-2">
            {selectedBrokers.map((brokerId) => {
              const broker = brokerOptions.find(b => b.value === brokerId);
              const isOther = brokerId.startsWith('other_');
              return (
                <span
                  key={brokerId}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                >
                  {broker?.logo?.startsWith('http') ? (
                    <img src={broker.logo} alt={broker.label} className="w-5 h-5 object-contain inline" />
                  ) : (
                    <span className="text-base">{broker?.fallback || '📊'}</span>
                  )}
                  {broker?.label || (isOther ? brokerId.replace('other_', '').replace(/_/g, ' ') : brokerId)}
                  <button
                    onClick={() => handleBrokerToggle(brokerId)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// 🚀 COMBINED BROKER SELECTION COMPONENT (NEW DROPDOWN-STYLE)
const CombinedBrokerSelection = ({
  userData,
  onAnswerSelect
}: {
  userData: UserProfile;
  onAnswerSelect: (value: string) => void;
}) => {
  // Initialize state from existing data
  const initializeCombinedData = () => {
    let existingData = userData.brokerInfo as { count?: string; brokers?: string[] } | undefined;

    // Handle case where brokerInfo might be a JSON string
    if (typeof userData.brokerInfo === 'string') {
      try {
        existingData = JSON.parse(userData.brokerInfo);
      } catch {
        existingData = { count: '', brokers: [] };
      }
    }

    if (!existingData) {
      existingData = { count: '', brokers: [] };
    }

    console.log('Initializing combined data:', {
      rawBrokerInfo: userData.brokerInfo,
      parsedData: existingData
    });

    return existingData;
  };

  const [brokerData, setBrokerData] = useState(initializeCombinedData);
  const [otherBroker, setOtherBroker] = useState('');
  const [showAllBrokers, setShowAllBrokers] = useState(false);

  // Update parent data whenever our state changes
  useEffect(() => {
    console.log('CombinedBrokerSelection updating parent with:', brokerData);
    onAnswerSelect(JSON.stringify(brokerData));
  }, [brokerData, onAnswerSelect]);

  // Broker options with logos
  // Broker options: Sorted by popularity with working logos and fallback emojis
  const brokerOptions = [
    // TOP TIER - Most Popular (Partner brokers)
    { value: 'zerodha', label: 'Zerodha', logo: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/zerodha.svg', fallback: '🟢', popularity: 1, isPartner: true },
    { value: 'groww', label: 'Groww', logo: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/groww.png', fallback: '🌱', popularity: 2, isPartner: false },
    { value: 'angel_one', label: 'Angel One', logo: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/angelone.png', fallback: '😇', popularity: 3, isPartner: true },
    { value: 'upstox', label: 'Upstox', logo: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/upstox.svg', fallback: '🟠', popularity: 4, isPartner: true },

    // MID TIER - Popular brokers
    { value: 'icici', label: 'ICICI Direct', logo: '🏦', fallback: '🏦', popularity: 5, isPartner: false },
    { value: 'hdfc', label: 'HDFC Securities', logo: '🏛️', fallback: '🏛️', popularity: 6, isPartner: false },
    { value: 'kotak', label: 'Kotak Securities', logo: '🔷', fallback: '🔷', popularity: 7, isPartner: false },
    { value: 'dhan', label: 'DHAN', logo: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/dhan.svg', fallback: '⚡', popularity: 8, isPartner: false },
    { value: 'paytm', label: 'Paytm Money', logo: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/paytm.png', fallback: '💰', popularity: 9, isPartner: false },

    // LOWER TIER - Less popular but still relevant
    { value: '5paisa', label: '5paisa', logo: '5️⃣', fallback: '5️⃣', popularity: 10, isPartner: true },
    { value: 'fyers', label: 'Fyers', logo: 'https://dqmpityshhywzayjysru.supabase.co/storage/v1/object/public/broker-logos/fyers.svg', fallback: '🟣', popularity: 11, isPartner: true },
    { value: 'sharekhan', label: 'Sharekhan', logo: '📈', fallback: '📈', popularity: 12, isPartner: false },
    { value: 'sbi', label: 'SBI Securities', logo: '🏦', fallback: '🏦', popularity: 13, isPartner: false },
    { value: 'motilal', label: 'Motilal Oswal', logo: '💼', fallback: '💼', popularity: 14, isPartner: false },
    { value: 'iifl', label: 'IIFL Securities', logo: '📊', fallback: '📊', popularity: 15, isPartner: false },
    { value: 'axis', label: 'Axis Direct', logo: '🔴', fallback: '🔴', popularity: 16, isPartner: false }
  ];

  const countOptions = [
    { value: '1', label: '1 broker' },
    { value: '2', label: '2 brokers' },
    { value: '3', label: '3 brokers' },
    { value: '4+', label: '4 or more brokers' }
  ];

  const handleCountChange = (count: string) => {
    setBrokerData(prev => ({
      ...prev,
      count,
      // Keep existing brokers if count allows, otherwise trim
      brokers: prev.brokers || []
    }));
  };

  const handleBrokerToggle = (brokerId: string) => {
    setBrokerData(prev => {
      const currentBrokers = prev.brokers || [];
      const newBrokers = currentBrokers.includes(brokerId)
        ? currentBrokers.filter(id => id !== brokerId)
        : [...currentBrokers, brokerId];

      return {
        ...prev,
        brokers: newBrokers
      };
    });
  };

  const handleOtherBrokerAdd = () => {
    if (otherBroker.trim()) {
      const newBrokerId = `other_${otherBroker.toLowerCase().replace(/\s+/g, '_')}`;
      setBrokerData(prev => ({
        ...prev,
        brokers: [...(prev.brokers || []), newBrokerId]
      }));
      setOtherBroker('');
    }
  };

  const selectedBrokers = brokerData.brokers || [];
  const showBrokerSelection = brokerData.count && brokerData.count !== '';

  // Show top 8 popular brokers by default, rest on "Show More"
  const topBrokers = brokerOptions.filter(b => (b.popularity || 999) <= 8);
  const moreBrokers = brokerOptions.filter(b => (b.popularity || 999) > 8);
  const displayedBrokers = showAllBrokers ? brokerOptions : topBrokers;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Tell us about your current brokers
      </h2>

      {/* Step 1: Broker Count Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-4">How many brokers do you currently use?</h3>
        <div className="grid grid-cols-2 gap-3">
          {countOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleCountChange(option.value)}
              className={`p-4 border-2 rounded-xl text-center font-medium transition-all ${
                brokerData.count === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-900'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Broker Selection (Auto-appears when count is selected) */}
      {showBrokerSelection && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-medium text-gray-700">Which brokers do you use?</h3>


          {/* Progress indicator */}
          {selectedBrokers.length > 0 && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex justify-between text-sm text-blue-700 mb-2">
                <span>{selectedBrokers.length} selected</span>
                <span>{brokerData.count} total</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-blue-500 transition-all"
                  style={{ width: `${Math.min((selectedBrokers.length / parseInt(brokerData.count || '1')) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Broker selection grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {displayedBrokers.map((broker) => (
              <button
                key={broker.value}
                onClick={() => handleBrokerToggle(broker.value)}
                className={`p-4 border-2 rounded-xl font-medium transition-all flex items-center gap-3 ${
                  selectedBrokers.includes(broker.value)
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-900'
                }`}
              >
                {broker.logo.startsWith('http') ? (
                  <img
                    src={broker.logo}
                    alt={broker.label}
                    className="w-10 h-10 object-contain flex-shrink-0"
                    onError={(e) => {
                      console.error(`Failed to load logo for ${broker.label}:`, broker.logo);
                      e.currentTarget.style.display = 'none';
                      const fallback = document.createElement('span');
                      fallback.textContent = broker.fallback || '📊';
                      fallback.className = 'text-3xl';
                      e.currentTarget.parentElement?.appendChild(fallback);
                    }}
                    loading="lazy"
                  />
                ) : (
                  <span className="text-3xl">{broker.fallback || broker.logo}</span>
                )}
                <span className="text-sm">{broker.label}</span>
                {selectedBrokers.includes(broker.value) && (
                  <CheckCircle className="w-4 h-4 text-blue-600 ml-auto" />
                )}
              </button>
            ))}
          </div>

          {/* Show More / Show Less Button */}
          {moreBrokers.length > 0 && (
            <button
              onClick={() => setShowAllBrokers(!showAllBrokers)}
              className="w-full mb-4 py-3 border-2 border-blue-400 text-blue-600 rounded-xl font-medium text-sm hover:bg-blue-50 transition-colors"
            >
              {showAllBrokers ? `↑ Show Less` : `↓ Show ${moreBrokers.length} More Brokers`}
            </button>
          )}

          {/* Others option */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Other broker:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={otherBroker}
                onChange={(e) => setOtherBroker(e.target.value)}
                placeholder="Enter broker name"
                className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-sm text-gray-900 bg-white placeholder-gray-400"
              />
              <button
                onClick={handleOtherBrokerAdd}
                disabled={!otherBroker.trim()}
                className="px-4 py-3 bg-gray-600 text-white rounded-xl text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Selected brokers list */}
          {selectedBrokers.length > 0 && (
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700 font-medium mb-2">Selected:</p>
              <div className="flex flex-wrap gap-2">
                {selectedBrokers.map((brokerId) => {
                  const broker = brokerOptions.find(b => b.value === brokerId);
                  const isOther = brokerId.startsWith('other_');
                  return (
                    <span
                      key={brokerId}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
                    >
                      {broker?.logo?.startsWith('http') ? (
                    <img src={broker.logo} alt={broker.label} className="w-5 h-5 object-contain inline" />
                  ) : (
                    <span className="text-base">{broker?.fallback || '📊'}</span>
                  )}
                      {broker?.label || (isOther ? brokerId.replace('other_', '').replace(/_/g, ' ') : brokerId)}
                      <button
                        onClick={() => handleBrokerToggle(brokerId)}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

// 🎯 RECOMMENDATION SECTION
const RecommendationSection = ({
  userData,
  apiError,
  apiSuccess,
  setApiError,
  setApiSuccess
}: {
  userData: UserProfile;
  apiError: string | null;
  apiSuccess: boolean;
  setApiError: (error: string | null) => void;
  setApiSuccess: (success: boolean) => void;
}) => {
  const recommendation = generateRecommendation(userData);
  const primaryBroker = getBrokerById(recommendation.primary.brokerId);

  const handleConversion = async () => {
    // Track Facebook InitiateCheckout with enhanced parameters
    if (typeof window !== 'undefined' && window.fbq) {
      // Standard InitiateCheckout event (critical for conversion optimization)
      window.fbq('track', 'InitiateCheckout', {
        value: 500, // Estimated conversion value
        currency: 'INR',
        content_name: recommendation.primary.brokerId,
        content_category: 'broker_recommendation',
        content_ids: [recommendation.primary.brokerId],
        num_items: 1
      });

      // Google Analytics begin_checkout event
      if ('gtag' in window) {
        const gtag = (window as Window & { gtag: (...args: unknown[]) => void }).gtag;
        gtag('event', 'begin_checkout', {
          currency: 'INR',
          value: 500,
          items: [{
            item_id: recommendation.primary.brokerId,
            item_name: recommendation.primary.brokerId,
            item_category: 'broker_recommendation'
          }]
        });
      }

      // Custom event for detailed tracking
      window.fbq('trackCustom', 'AffiliateClicked', {
        broker: recommendation.primary.brokerId,
        switching_from: userData.currentBroker,
        match_percentage: recommendation.primary.matchPercentage,
        should_switch: recommendation.shouldSwitch,
        session_id: userData.sessionId,
        user_type: userData.tradingExperience || 'unknown'
      });
    }

    // Supabase Backup Tracking for CTA click
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: 'cta_clicked',
        session_id: userData.sessionId,
        broker_id: recommendation.primary.brokerId,
        event_data: {
          match_percentage: recommendation.primary.matchPercentage,
          affiliate_url: recommendation.primary.affiliate_url
        }
      })
    }).catch(err => console.error('Tracking error:', err));

    // Submit data to backend with retry mechanism
    let submitSuccess = false;
    let retryCount = 0;
    const maxRetries = 2;

    while (!submitSuccess && retryCount < maxRetries) {
      try {
        const response = await fetch('/api/submit', {
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

        if (response.ok) {
          submitSuccess = true;
          setApiSuccess(true);
          setApiError(null);
        } else {
          throw new Error(`API returned ${response.status}`);
        }
      } catch (error) {
        console.error(`Error submitting data (attempt ${retryCount + 1}/${maxRetries}):`, error);
        retryCount++;

        if (retryCount >= maxRetries) {
          setApiError('Unable to save your data. But don\'t worry - you can still open your account!');
          setApiSuccess(false);
        } else {
          // Wait 1 second before retry
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    // Redirect to affiliate link (regardless of API success)
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

      {/* Trust & Stats Bar - Real Numbers */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-5 mb-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-blue-600">
              {primaryBroker?.id === 'zerodha' ? '1.6Cr+' :
               primaryBroker?.id === 'upstox' ? '1.3Cr+' :
               primaryBroker?.id === 'angel_one' ? '2Cr+' :
               primaryBroker?.id === 'fyers' ? '10L+' :
               primaryBroker?.id === '5paisa' ? '40L+' : '50L+'}
            </span>
            <span className="text-xs text-gray-600 mt-1">Active Users</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-green-600">
              {primaryBroker?.charges.delivery_brokerage === 0 ? '₹0' : `₹${primaryBroker?.charges.delivery_brokerage}`}
            </span>
            <span className="text-xs text-gray-600 mt-1">Delivery Fee</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-purple-600">
              {primaryBroker?.id === 'zerodha' ? '4.5★' :
               primaryBroker?.id === 'upstox' ? '4.5★' :
               primaryBroker?.id === 'angel_one' ? '4.3★' :
               primaryBroker?.id === 'fyers' ? '4.4★' : '4.2★'}
            </span>
            <span className="text-xs text-gray-600 mt-1">App Rating</span>
          </div>
        </div>
      </div>

      {/* Why We Recommend - Simplified */}
      <div className="bg-white border-2 border-green-200 rounded-xl p-5 mb-6 text-left">
        <h4 className="font-bold text-gray-800 mb-4 text-base flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Why {primaryBroker?.name} is Perfect for You
        </h4>

        {/* Top 3 Benefits Only */}
        <div className="space-y-2.5 mb-4">
          {primaryBroker?.real_insights.pros.slice(0, 3).map((pro, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-green-600 font-bold text-base mt-0.5">✓</span>
              <p className="text-gray-800 text-sm">{pro}</p>
            </div>
          ))}
        </div>

        {/* Cost Savings - Prominent */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg p-4">
          <p className="font-bold text-gray-800 text-sm mb-1">
            💰 {primaryBroker?.real_insights.cost_summary}
          </p>
          {primaryBroker?.id === 'zerodha' && (
            <p className="text-green-700 font-semibold text-xs mt-1">
              Save up to ₹10,000/year vs traditional brokers
            </p>
          )}
          {primaryBroker?.id === 'upstox' && (
            <p className="text-green-700 font-semibold text-xs mt-1">
              Best uptime during market volatility
            </p>
          )}
        </div>
      </div>

      {/* Specific Reasons Based on User Profile */}
      {recommendation.primary.reasons.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6 text-left">
          <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <Star className="w-5 h-5 text-blue-600" />
            Personalized Benefits for Your Trading Style:
          </h4>
          <ul className="text-blue-800 space-y-2">
            {recommendation.primary.reasons.map((reason, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-1 text-green-600 flex-shrink-0" />
                <span className="text-sm">{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Removed alternatives - single recommendation only per business requirement */}

      {/* Trust Reassurance */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4 text-center">
        <p className="text-blue-800 font-semibold text-sm mb-1">✓ 100% Free Account Opening</p>
        <p className="text-blue-700 text-xs">
          {primaryBroker?.id === 'zerodha' ? 'Trusted by 1.6 Crore+ traders • SEBI registered' :
          primaryBroker?.id === 'upstox' ? 'Trusted by 1.3 Crore+ traders • SEBI registered' :
          primaryBroker?.id === 'angel_one' ? 'Trusted by 2 Crore+ traders • SEBI registered' :
          'SEBI registered • Bank-grade security'}
        </p>
      </div>

      {/* Primary CTA Button */}
      <motion.button
        onClick={handleConversion}
        className="w-full py-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-xl shadow-lg transition-all hover:shadow-2xl mb-3 hover:from-green-600 hover:to-green-700"
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        Open FREE {primaryBroker?.name} Account →
      </motion.button>

      {/* Referral Disclosure */}
      <p className="text-[10px] text-gray-400 text-center mt-4 leading-relaxed">
        Free service · We earn from broker partnerships
      </p>

      <p className="text-center text-gray-600 text-sm mb-4 font-medium">
        ✓ Takes 5 minutes • ✓ No hidden costs • ✓ Start today
      </p>

      {/* API Success/Error Notifications */}
      {apiError && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg text-sm text-yellow-800 flex items-start gap-2">
          <span className="text-yellow-600 font-bold">⚠️</span>
          <span>{apiError}</span>
        </div>
      )}
      {apiSuccess && (
        <div className="mt-4 p-3 bg-green-50 border border-green-300 rounded-lg text-sm text-green-800 flex items-start gap-2">
          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
          <span>Your details have been saved successfully!</span>
        </div>
      )}

      {/* Trust Indicators */}
      <div className="mt-6 text-sm text-gray-600 flex flex-wrap items-center justify-center gap-4">
        <span className="flex items-center gap-1">
          <CheckCircle className="w-4 h-4 text-green-500" />
          FREE Account Opening
        </span>
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