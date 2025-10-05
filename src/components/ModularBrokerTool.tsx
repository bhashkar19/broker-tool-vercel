'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle, TrendingUp, Star, ChevronLeft } from 'lucide-react';

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
import { getBrokerById } from '@/lib/broker-repository';
import { UNIFIED_BROKER_CONFIGS } from '@/config/unifiedBrokerConfig';
import BrokerComparisonWidget from './BrokerComparisonWidget';
import ProgressIndicator from './quiz/ProgressIndicator';
import ContactForm from './quiz/ContactForm';
import RadioQuestion from './quiz/RadioQuestion';
import CheckboxQuestion from './quiz/CheckboxQuestion';
import VisualCardQuestion from './quiz/VisualCardQuestion';
import GridCheckboxQuestion from './quiz/GridCheckboxQuestion';

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

  // Calculate total questions based on user's first answer to avoid counter jumping
  const totalQuestionsToShow = React.useMemo(() => {
    // If user hasn't answered the first question yet, show the config's total
    if (!userData.hasAccount) {
      return questionConfig.totalQuestions;
    }

    // After first answer, calculate based on their path
    const allQuestions = questionConfig.questions;
    const userPath = allQuestions.filter(q => shouldShowQuestion(q, userData));
    return userPath.length;
  }, [userData.hasAccount, userData, questionConfig]);

  // Progress calculation
  const progressPercentage = showRecommendation ? 100 : ((currentQuestionIndex + 1) / totalQuestionsToShow) * 100;

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
        total_questions: totalQuestionsToShow,
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
          total_questions: totalQuestionsToShow
        }
      })
    }).catch(err => console.error('Tracking error:', err));
  };

  // Go back to previous question
  const goBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);

      // Track back navigation
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('trackCustom', 'QuestionBackNavigated', {
          from_question: currentQuestionIndex + 1,
          to_question: currentQuestionIndex,
          session_id: userData.sessionId
        });
      }
    }
  };

  // Check if back button should be shown
  const canGoBack = currentQuestionIndex > 0 && !showRecommendation;

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-5 text-center">
        <h1 className="text-xl font-bold mb-1 flex items-center justify-center gap-2">
          <Target className="w-5 h-5" />
          Find Your Perfect Broker
        </h1>
        <p className="text-blue-100 text-sm">
          {questionConfig.description}
        </p>
      </div>

      {/* Progress Indicator */}
      <ProgressIndicator
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestionsToShow}
        progressPercentage={progressPercentage}
        visibleQuestions={visibleQuestions}
        showRecommendation={showRecommendation}
      />

      {/* Questions Container */}
      <div className="px-6 py-6 min-h-[380px] flex flex-col justify-center pb-20">
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
                <p className="text-center text-xs text-green-600 font-medium mb-3">
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

              {/* Back Button */}
              {canGoBack && (
                <motion.button
                  onClick={goBack}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm font-medium mt-3 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ x: -3 }}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </motion.button>
              )}

              {/* Helper text */}
              {!isCurrentQuestionValid() && currentQuestion.type === 'custom' && currentQuestion.id === 'contact_info' && (
                <p className="text-center text-xs text-gray-500 mt-3">
                  ↑ Fill both fields above to continue
                </p>
              )}
              {!isLastQuestion && currentQuestion.type !== 'custom' && !isCurrentQuestionValid() && (
                <p className="text-center text-xs text-gray-400 mt-3">
                  Tap an option to continue →
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

        {/* Floating Next Button */}
        {!showRecommendation && (
          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-6 pb-4 px-4">
            <div className="max-w-md mx-auto">
              <motion.button
                onClick={nextQuestion}
                disabled={!isCurrentQuestionValid()}
                className={`w-full py-3.5 rounded-xl font-bold text-base transition-all shadow-lg ${
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

              {/* Consent Text - Only show on contact form question */}
              {currentQuestion?.id === 'contact_info' && (
                <p className="text-xs text-gray-500 text-center mt-3 leading-relaxed">
                  By clicking above, you agree to our{' '}
                  <a
                    href="/privacy-policy"
                    className="text-blue-600 hover:underline"
                  >
                    Privacy Policy
                  </a>
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Minimal Footer */}
      <footer className="mt-20 pb-4 text-center border-t border-gray-50">
        <div className="text-[9px] text-gray-400 space-x-2 pt-6 tracking-wide">
          <a
            href="/privacy-policy"
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
    return <ContactForm question={question} userData={userData} onContactUpdate={onContactUpdate} />;
  }

  if (question.type === 'custom' && question.id === 'current_brokers_smart') {
    return <SmartBrokerSelection userData={userData} onAnswerSelect={onAnswerSelect} />;
  }

  if (question.type === 'custom' && question.id === 'combined_broker_selection') {
    return <CombinedBrokerSelection userData={userData} onAnswerSelect={onAnswerSelect} />;
  }

  if (question.type === 'radio') {
    // Use VisualCardQuestion for questions with 2-3 options
    if (question.visualCard) {
      return <VisualCardQuestion question={question} userData={userData} onAnswerSelect={onAnswerSelect} />;
    }
    // Use compact RadioQuestion for 4+ options
    return <RadioQuestion question={question} userData={userData} onAnswerSelect={onAnswerSelect} />;
  }

  if (question.type === 'checkbox') {
    // Use GridCheckboxQuestion for questions with grid layout (2x2, 2x3, 3x2)
    if (question.gridLayout) {
      return <GridCheckboxQuestion
        question={question}
        userData={userData}
        onAnswerSelect={(values: string[]) => onAnswerSelect(JSON.stringify(values))}
      />;
    }
    // Use regular CheckboxQuestion for vertical list
    return <CheckboxQuestion question={question} userData={userData} onAnswerSelect={onAnswerSelect} />;
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
              <Image
                src={broker.logo}
                alt={broker.label}
                width={40}
                height={40}
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
                unoptimized
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
                    <Image src={broker.logo} alt={broker.label} width={20} height={20} className="w-5 h-5 object-contain inline" unoptimized />
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
                  <Image
                    src={broker.logo}
                    alt={broker.label}
                    width={40}
                    height={40}
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
                    unoptimized
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
                    <Image src={broker.logo} alt={broker.label} width={20} height={20} className="w-5 h-5 object-contain inline" unoptimized />
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

  // Collapsible sections state
  const [showValidationDetails, setShowValidationDetails] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [viewAlternatives, setViewAlternatives] = useState(false);
  const [showBeginnerGuide, setShowBeginnerGuide] = useState(false); // Collapsed by default
  const [showStickyButton, setShowStickyButton] = useState(false); // Sticky CTA visibility
  const [showWhatNextModal, setShowWhatNextModal] = useState(false); // Preview modal
  const [redirectCountdown, setRedirectCountdown] = useState(2); // Countdown timer

  // Scroll listener for sticky CTA button
  useEffect(() => {
    const handleScroll = () => {
      // Show sticky button after scrolling past hero section (~800px)
      setShowStickyButton(window.scrollY > 800);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleConversion = async () => {
    // Check if user is new (no demat account)
    const isNewUser = recommendation.recommendationType === 'new_account';

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

    // For new users: Show modal with 2-second auto-redirect
    // For existing users: Redirect immediately
    if (isNewUser) {
      // Show "What Happens Next" modal
      setShowWhatNextModal(true);

      // Track modal view
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('trackCustom', 'WhatNextModalShown', {
          broker: recommendation.primary.brokerId,
          session_id: userData.sessionId,
          user_type: 'new_account'
        });
      }

      // Countdown timer: 2 -> 1 -> redirect
      const countdownInterval = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Auto-redirect after 2 seconds
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.fbq) {
          window.fbq('trackCustom', 'AutoRedirectTriggered', {
            broker: recommendation.primary.brokerId,
            session_id: userData.sessionId
          });
        }
        window.location.href = recommendation.primary.affiliate_url;
      }, 2000);
    } else {
      // Existing users: Direct redirect (no modal)
      window.location.href = recommendation.primary.affiliate_url;
    }
  };

  // Handle final redirect after modal preview
  const handleFinalRedirect = () => {
    // Track modal confirmation
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', 'WhatNextModalConfirmed', {
        broker: recommendation.primary.brokerId,
        session_id: userData.sessionId
      });
    }

    // Redirect in same tab (not new tab)
    window.location.href = recommendation.primary.affiliate_url;
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

      {/* Primary Recommendation - Entire card is clickable */}
      <button
        onClick={handleConversion}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 mb-6 transition-all hover:shadow-2xl hover:scale-[1.02] hover:from-green-600 hover:to-green-700 cursor-pointer"
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <TrendingUp className="w-6 h-6" />
          <h3 className="text-xl font-bold">Your Perfect Match</h3>
        </div>
        <div className="text-center">
          <p className="text-white text-3xl font-bold">
            {primaryBroker?.name}
          </p>
        </div>
      </button>

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
              {UNIFIED_BROKER_CONFIGS[primaryBroker?.brokerId]?.charges.delivery.formula || (primaryBroker?.charges.delivery_brokerage === 0 ? '₹0' : `₹${primaryBroker?.charges.delivery_brokerage}`)}
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

      {/* MAIN CTA - Primary action button with clear instruction */}
      {!showComparison && (
        <motion.button
          onClick={handleConversion}
          className="w-full py-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-xl shadow-lg transition-all hover:shadow-2xl mb-2 hover:from-green-600 hover:to-green-700"
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Click Here to Open FREE {primaryBroker?.name} Account →
        </motion.button>
      )}

      {/* Helper text below main CTA */}
      {!showComparison && (
        <p className="text-center text-sm text-gray-600 mb-6">
          ✓ 100% Free Account Opening • ✓ 5 Minute Setup • ✓ Instant Activation
        </p>
      )}

      {/* FIRST-TIME USER GUIDE - Only for new_account users - ZERODHA SPECIFIC */}
      {recommendation.recommendationType === 'new_account' && (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-300 rounded-xl p-6 mb-6 text-left">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-indigo-900 text-lg flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Starting Your Investment Journey with Zerodha
            </h3>
            <button
              onClick={() => {
                setShowBeginnerGuide(!showBeginnerGuide);
                // Track expand/collapse
                if (typeof window !== 'undefined' && window.fbq) {
                  window.fbq('trackCustom', 'BeginnerGuideToggled', {
                    action: showBeginnerGuide ? 'collapsed' : 'expanded',
                    broker: recommendation.primary.brokerId,
                    session_id: userData.sessionId
                  });
                }
              }}
              className="text-indigo-700 hover:text-indigo-900 font-medium text-sm transition-colors flex items-center gap-1"
            >
              {showBeginnerGuide ? '▲ Hide' : '▼ Show Guide'}
            </button>
          </div>

          <AnimatePresence>
            {showBeginnerGuide && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-gray-800 text-sm mb-4 leading-relaxed">
                  Since this is your <strong>first trading account</strong>, we recommend <strong>Zerodha</strong> - India&apos;s most trusted broker for beginners. Here&apos;s why:
                </p>

          {/* Why Zerodha for First Account */}
          <div className="bg-white rounded-lg p-4 mb-4 border border-indigo-200">
            <h4 className="font-semibold text-gray-800 text-sm mb-3">What makes Zerodha perfect for your first account?</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold mt-0.5">•</span>
                <p className="text-gray-700 text-xs"><strong>Zero learning curve:</strong> Kite app is the easiest to understand - even if you&apos;ve never traded before</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold mt-0.5">•</span>
                <p className="text-gray-700 text-xs"><strong>Free education:</strong> Varsity platform teaches you everything from basics to advanced strategies</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold mt-0.5">•</span>
                <p className="text-gray-700 text-xs"><strong>No cost mistakes:</strong> ₹0 brokerage on delivery means you can practice buying stocks without fees eating your returns</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold mt-0.5">•</span>
                <p className="text-gray-700 text-xs"><strong>Proven track record:</strong> 1.6 crore+ users trust it - you&apos;re joining India&apos;s largest trading community</p>
              </div>
            </div>
          </div>

          {/* Quick Terminology Guide */}
          <div className="bg-amber-50 rounded-lg p-4 mb-4 border border-amber-200">
            <h4 className="font-semibold text-gray-800 text-sm mb-3 flex items-center gap-1">
              <span className="text-base">📖</span> Quick Terms You&apos;ll See
            </h4>
            <div className="space-y-2 text-xs text-gray-700">
              <p><strong>Delivery Trading:</strong> Buy stocks and hold them (like buying property to keep) - This is how most people invest</p>
              <p><strong>Intraday Trading:</strong> Buy and sell same stock on same day (risky, not recommended for beginners)</p>
              <p><strong>Brokerage:</strong> Fee charged per trade - FREE at Zerodha for delivery</p>
              <p><strong>AMC (Annual Charges):</strong> Yearly account maintenance - ₹300/year at Zerodha (₹25/month)</p>
            </div>
          </div>

          {/* What to Expect - Realistic Timeline */}
          <div className="bg-green-50 rounded-lg p-4 mb-4 border border-green-200">
            <h4 className="font-semibold text-gray-800 text-sm mb-3 flex items-center gap-1">
              <span className="text-base">⏱️</span> What Happens Next (Realistic Timeline)
            </h4>
            <div className="space-y-2.5 text-xs text-gray-700">
              <div className="flex items-start gap-2">
                <span className="font-bold text-green-700 min-w-[60px]">Step 1:</span>
                <p><strong>Fill application (5-10 mins)</strong> - Need PAN card, Aadhaar, bank account details, and signature photo</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-green-700 min-w-[60px]">Step 2:</span>
                <p><strong>Verification (4-24 hours)</strong> - Zerodha verifies your documents with SEBI and exchanges</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-green-700 min-w-[60px]">Step 3:</span>
                <p><strong>Account activated</strong> - You&apos;ll get login credentials via email and SMS</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-green-700 min-w-[60px]">Step 4:</span>
                <p><strong>Add money & start</strong> - Transfer funds from your bank account and place your first trade</p>
              </div>
            </div>
          </div>

          {/* Why Not Banks? - Educational Comparison */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-800 text-sm mb-3 flex items-center gap-1">
              <span className="text-base">💡</span> Why Not Open Account at Your Bank?
            </h4>
            <p className="text-gray-700 text-xs mb-3">
              Traditional banks (ICICI, HDFC, Kotak) charge <strong>0.3-0.5% per trade</strong>. Here&apos;s what that means:
            </p>
            <div className="bg-red-50 rounded p-3 mb-2 border border-red-200">
              <p className="text-xs text-gray-800 mb-1"><strong>Example: Buy ₹10,000 worth of Reliance shares</strong></p>
              <p className="text-xs text-red-700">• Bank broker: ₹30-50 brokerage <span className="text-gray-600">(0.3-0.5%)</span></p>
              <p className="text-xs text-green-700">• Zerodha: ₹0 brokerage</p>
            </div>
            <p className="text-xs text-gray-600 italic">
              Over a year with just 2 trades/month: Save ₹720-1200 by choosing Zerodha over traditional banks
            </p>
          </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Broker Strengths - Point-wise (Universal for all 56 brokers) */}
      <div className="bg-white border-2 border-green-200 rounded-xl p-5 mb-6 text-left">
        <h4 className="font-bold text-gray-800 mb-4 text-base flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          {primaryBroker?.name} Strengths
        </h4>

        {/* Show all pros as simple bullet points */}
        <div className="space-y-2.5">
          {primaryBroker?.real_insights.pros.map((pro, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-green-600 font-bold text-base mt-0.5">✓</span>
              <p className="text-gray-800 text-sm">{pro}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Complete Pricing Table - Universal for all brokers */}
      {/* TODO: Future feature - Only show comparison when recommended broker has better pricing */}
      {/* For now: Always show the table when user has current brokers */}
      <div className="bg-white border-2 border-blue-200 rounded-xl p-5 mb-6 text-left overflow-x-auto">
        <h4 className="font-bold text-gray-800 mb-4 text-base flex items-center gap-2">
          <span className="text-xl">💰</span>
          Complete Pricing Breakdown
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-2 pr-4 font-semibold text-gray-700">Charges</th>
                {/* Recommended broker ONLY - hiding current broker to avoid showing their good points */}
                <th className="text-center py-2 px-3 font-semibold text-green-700 whitespace-nowrap bg-green-50">
                  {primaryBroker?.name}
                </th>
                {/* Current brokers - HIDDEN for strategic conversion optimization */}
                {/* Keeping code for future use if needed - just comment out the map */}
                {/* {userData.brokerInfo?.brokers && userData.brokerInfo.brokers.map((brokerId: string) => {
                  const broker = UNIFIED_BROKER_CONFIGS[brokerId];
                  return broker ? (
                    <th key={brokerId} className="text-center py-2 px-3 font-semibold text-gray-700 whitespace-nowrap">
                      {broker.name} (Current)
                    </th>
                  ) : null;
                })} */}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-2 pr-4 text-gray-700">Equity Delivery</td>
                {/* Recommended broker ONLY */}
                <td className="text-center py-2 px-3 font-semibold text-green-700 bg-green-50">
                  {UNIFIED_BROKER_CONFIGS[primaryBroker?.brokerId]?.charges.delivery.formula || `₹${primaryBroker?.charges.delivery_brokerage}`}
                </td>
                {/* Current brokers - HIDDEN */}
                {/* {userData.brokerInfo?.brokers && userData.brokerInfo.brokers.map((brokerId: string) => {
                  const broker = UNIFIED_BROKER_CONFIGS[brokerId];
                  return broker ? (
                    <td key={brokerId} className="text-center py-2 px-3 text-gray-600">
                      {broker.charges.delivery.formula}
                    </td>
                  ) : null;
                })} */}
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 pr-4 text-gray-700">Equity Intraday</td>
                {/* Recommended broker ONLY */}
                <td className="text-center py-2 px-3 font-semibold text-green-700 bg-green-50">
                  {UNIFIED_BROKER_CONFIGS[primaryBroker?.brokerId]?.charges.intraday.formula || `₹${primaryBroker?.charges.intraday_brokerage}`}
                </td>
                {/* Current brokers - HIDDEN */}
                {/* {userData.brokerInfo?.brokers && userData.brokerInfo.brokers.map((brokerId: string) => {
                  const broker = UNIFIED_BROKER_CONFIGS[brokerId];
                  return broker ? (
                    <td key={brokerId} className="text-center py-2 px-3 text-gray-600">
                      {broker.charges.intraday.formula}
                    </td>
                  ) : null;
                })} */}
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 pr-4 text-gray-700">F&O (Futures/Options)</td>
                {/* Recommended broker ONLY */}
                <td className="text-center py-2 px-3 font-semibold text-green-700 bg-green-50">
                  {UNIFIED_BROKER_CONFIGS[primaryBroker?.brokerId]?.charges.fo.formula || `₹${primaryBroker?.charges.fo_brokerage}`}
                </td>
                {/* Current brokers - HIDDEN */}
                {/* {userData.brokerInfo?.brokers && userData.brokerInfo.brokers.map((brokerId: string) => {
                  const broker = UNIFIED_BROKER_CONFIGS[brokerId];
                  return broker ? (
                    <td key={brokerId} className="text-center py-2 px-3 text-gray-600">
                      {broker.charges.fo.formula}
                    </td>
                  ) : null;
                })} */}
              </tr>
              <tr className="border-b border-gray-200 bg-gray-50">
                <td className="py-2 pr-4 text-gray-700 font-medium">AMC (Annual)</td>
                {/* Recommended broker ONLY */}
                <td className="text-center py-2 px-3 font-semibold text-green-700 bg-green-100">
                  {UNIFIED_BROKER_CONFIGS[primaryBroker?.brokerId]?.charges.amc.formula || `₹${primaryBroker?.charges.amc_charges}/year`}
                </td>
                {/* Current brokers - HIDDEN */}
                {/* {userData.brokerInfo?.brokers && userData.brokerInfo.brokers.map((brokerId: string) => {
                  const broker = UNIFIED_BROKER_CONFIGS[brokerId];
                  return broker ? (
                    <td key={brokerId} className="text-center py-2 px-3 text-gray-600 font-medium">
                      {broker.charges.amc.formula}
                    </td>
                  ) : null;
                })} */}
              </tr>
              <tr>
                <td className="py-2 pr-4 text-gray-700">Account Opening</td>
                {/* Recommended broker ONLY */}
                <td className="text-center py-2 px-3 font-semibold text-green-700 bg-green-50">
                  FREE
                </td>
                {/* Current brokers - HIDDEN */}
                {/* {userData.brokerInfo?.brokers && userData.brokerInfo.brokers.map((brokerId: string) => {
                  return (
                    <td key={brokerId} className="text-center py-2 px-3 text-gray-600">
                      FREE
                    </td>
                  );
                })} */}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Show pricing table even if user has no current brokers */}
        {(!userData.brokerInfo?.brokers || userData.brokerInfo.brokers.length === 0) && (
          <div className="space-y-2 mt-4">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-700">Equity Delivery</span>
              <span className="font-semibold text-green-700">{UNIFIED_BROKER_CONFIGS[primaryBroker?.brokerId]?.charges.delivery.formula || `₹${primaryBroker?.charges.delivery_brokerage}`}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-700">Equity Intraday</span>
              <span className="font-semibold text-green-700">{UNIFIED_BROKER_CONFIGS[primaryBroker?.brokerId]?.charges.intraday.formula || `₹${primaryBroker?.charges.intraday_brokerage}`}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-700">F&O (Futures/Options)</span>
              <span className="font-semibold text-green-700">{UNIFIED_BROKER_CONFIGS[primaryBroker?.brokerId]?.charges.fo.formula || `₹${primaryBroker?.charges.fo_brokerage}`}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200 bg-gray-50">
              <span className="text-gray-700 font-medium">AMC (Annual)</span>
              <span className="font-semibold text-green-700">{UNIFIED_BROKER_CONFIGS[primaryBroker?.brokerId]?.charges.amc.formula || `₹${primaryBroker?.charges.amc_charges}/year`}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-700">Account Opening</span>
              <span className="font-semibold text-green-700">{UNIFIED_BROKER_CONFIGS[primaryBroker?.brokerId]?.charges.demat_opening.formula || 'FREE'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Show comparison widget when requested */}
      {showComparison && userData.brokerInfo?.brokers && Array.isArray(userData.brokerInfo.brokers) && userData.brokerInfo.brokers.length > 0 && (
        <BrokerComparisonWidget
          currentBrokerId={userData.brokerInfo.brokers[0]}
          recommendedBrokerId={recommendation.primary.brokerId}
          onSwitchConfirm={handleConversion}
          onViewAlternatives={() => setViewAlternatives(true)}
          tradingFrequency={userData.tradingFrequency || 'monthly'}
        />
      )}

      {/* Show alternatives if requested */}
      {viewAlternatives && recommendation.alternatives.length > 0 && (
        <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4 text-center">Other Good Options</h3>
          <div className="space-y-3">
            {recommendation.alternatives.slice(0, 2).map((alt) => {
              const altBroker = getBrokerById(alt.brokerId);
              return (
                <div key={alt.brokerId} className="bg-white rounded-xl p-4 border border-gray-300">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-900">{alt.brokerName}</h4>
                    <span className="text-sm text-gray-600">{alt.matchPercentage}% match</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{altBroker?.real_insights.perfect_for}</p>
                  <button
                    onClick={() => window.open(alt.affiliate_url, '_blank')}
                    className="w-full py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                  >
                    Open {alt.brokerName} Account →
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Trust Reassurance */}
      {!showComparison && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4 text-center">
          <p className="text-blue-800 font-semibold text-sm mb-1">✓ 100% Free Account Opening</p>
          <p className="text-blue-700 text-xs">
            {primaryBroker?.id === 'zerodha' ? 'Trusted by 1.6 Crore+ traders • SEBI registered' :
            primaryBroker?.id === 'upstox' ? 'Trusted by 1.3 Crore+ traders • SEBI registered' :
            primaryBroker?.id === 'angel_one' ? 'Trusted by 2 Crore+ traders • SEBI registered' :
            'SEBI registered • Bank-grade security'}
          </p>
        </div>
      )}

      {/* Secondary CTA Button - Different text to avoid confusion */}
      {!showComparison && (
        <motion.button
          onClick={handleConversion}
          className="w-full py-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-lg shadow-lg transition-all hover:shadow-2xl mb-3 hover:from-green-600 hover:to-green-700"
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          Start Your FREE {primaryBroker?.name} Account Now →
        </motion.button>
      )}

      {/* Trust Badges - Below CTA */}
      <p className="text-center text-gray-600 text-xs mb-4">
        ✓ FREE Account Opening • ✓ SEBI Registered • ✓ Bank-grade Security • ✓ Instant Activation
      </p>

      {/* Referral Disclosure */}
      <p className="text-[10px] text-gray-400 text-center mt-2 leading-relaxed">
        Free service · We earn from broker partnerships
      </p>

      {/* VALIDATION SECTION - Moved to bottom to lead with positives (SHOWS ALL SELECTED BROKERS) */}
      {recommendation.validation && recommendation.validation.brokerData.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5 mb-6 mt-8 text-left">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="text-xl">📋</span>
            {recommendation.validation.multipleBrokers
              ? "Important Things to Know About Your Current Brokers"
              : `Important Things to Know About ${recommendation.validation.brokerData[0].brokerName}`
            }
          </h3>

          {/* Brief Summary (Always Visible) - Group by challenge type to avoid duplicates */}
          <div className="mb-3">
            {(() => {
              // Group issues by challenge type (not by broker)
              const issuesByChallenge: Record<string, Array<{broker: string, issue: string}>> = {};

              recommendation.validation.brokerData.forEach((broker) => {
                broker.issues.forEach((issueData) => {
                  if (!issuesByChallenge[issueData.label]) {
                    issuesByChallenge[issueData.label] = [];
                  }
                  issuesByChallenge[issueData.label].push({
                    broker: broker.brokerName,
                    issue: issueData.issues[0].split('.')[0]
                  });
                });
              });

              return Object.entries(issuesByChallenge).map(([label, brokerIssues]) => (
                <div key={label} className="mb-2 last:mb-0">
                  <div className="flex items-start gap-2">
                    <span className="text-red-500 font-bold text-sm mt-0.5">⚠️</span>
                    <div className="text-gray-800 text-sm font-medium">
                      <span className="font-semibold">{label}:</span>
                      {recommendation.validation?.multipleBrokers ? (
                        <span className="ml-1">
                          {brokerIssues.map((item, idx) => (
                            <span key={idx}>
                              {item.broker}: {item.issue}
                              {idx < brokerIssues.length - 1 ? '; ' : ''}
                            </span>
                          ))}...
                        </span>
                      ) : (
                        <span className="ml-1">{brokerIssues[0].issue}...</span>
                      )}
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>

          {/* Read More Button */}
          <button
            onClick={() => setShowValidationDetails(!showValidationDetails)}
            className="w-full text-center py-2 px-4 bg-amber-100 hover:bg-amber-200 rounded-lg border border-amber-300 text-amber-900 font-medium text-sm transition-colors"
          >
            {showValidationDetails ? '▲ Hide Details' : '▼ Read Full Details'}
          </button>

          {/* Detailed Information (Collapsible) - Group by challenge to avoid showing same issue type multiple times */}
          {showValidationDetails && (
            <div className="mt-4 pt-4 border-t border-amber-300">
              {(() => {
                // Group issues by challenge label to avoid duplication
                const detailedIssuesByChallenge: Record<string, Array<{
                  broker: string;
                  brokerId: string;
                  issues: string[];
                  impact?: string;
                  userQuotes?: string;
                }>> = {};

                recommendation.validation.brokerData.forEach((broker) => {
                  broker.issues.forEach((issueData) => {
                    if (!detailedIssuesByChallenge[issueData.label]) {
                      detailedIssuesByChallenge[issueData.label] = [];
                    }
                    detailedIssuesByChallenge[issueData.label].push({
                      broker: broker.brokerName,
                      brokerId: broker.brokerId,
                      issues: issueData.issues,
                      impact: issueData.impact,
                      userQuotes: issueData.userQuotes
                    });
                  });
                });

                return (
                  <>
                    {Object.entries(detailedIssuesByChallenge).map(([label, brokerDataList]) => (
                      <div key={label} className="mb-6 last:mb-0">
                        <h5 className="font-semibold text-amber-900 mb-3 text-sm">
                          {label}:
                        </h5>

                        {brokerDataList.map((brokerData, brokerIdx) => (
                          <div key={`${brokerData.brokerId}-${brokerIdx}`} className="mb-4 last:mb-0">
                            {/* Show broker name if multiple brokers have this issue */}
                            {recommendation.validation?.multipleBrokers && (
                              <h6 className="font-medium text-gray-900 mb-2 text-xs">
                                📊 {brokerData.broker}
                              </h6>
                            )}

                            {/* Show all documented issues */}
                            <div className="space-y-1.5 mb-2 ml-4">
                              {brokerData.issues.map((issue, issueIdx) => (
                                <div key={issueIdx} className="flex items-start gap-2">
                                  <span className="text-red-500 font-bold text-sm mt-0.5">❌</span>
                                  <p className="text-gray-700 text-sm">{issue}</p>
                                </div>
                              ))}
                            </div>

                            {/* Show impact */}
                            {brokerData.impact && (
                              <p className="text-amber-800 text-xs italic ml-10">
                                Impact: {brokerData.impact}
                              </p>
                            )}

                            {/* Show user quotes if available */}
                            {brokerData.userQuotes && (
                              <p className="text-gray-600 text-xs mt-2 ml-10 bg-white/50 rounded p-2 border-l-2 border-amber-400">
                                💬 {brokerData.userQuotes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}

                    <div className="mt-4 pt-3 border-t border-amber-300">
                      <p className="text-gray-700 text-sm">
                        <strong>You&apos;re not alone</strong> - these are real, documented issues that thousands of traders face.
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}

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

      {/* Secondary Account Recommendation - ONLY when user has EXACTLY 1 broker (at the very end) */}
      {!showComparison && userData.brokerInfo?.brokers && userData.brokerInfo.brokers.length === 1 && (
        <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-6 mt-8 text-left">
          <h4 className="font-semibold text-purple-900 mb-2 text-sm flex items-center gap-2">
            <span className="text-base">💡</span>
            Consider a Secondary Broker
          </h4>
          <p className="text-purple-800 text-xs mb-2">
            You currently use: <span className="font-semibold">
              {BROKER_CONFIGS[userData.brokerInfo.brokers[0]]?.name}
            </span>
          </p>
          <p className="text-purple-700 text-xs">
            Many traders add <span className="font-semibold">{primaryBroker?.name}</span> as a backup broker for:
          </p>
          <div className="mt-2 space-y-1">
            <p className="text-purple-700 text-xs flex items-start gap-1">
              <span className="mt-0.5">✓</span>
              <span>Backup when your primary broker is down</span>
            </p>
            <p className="text-purple-700 text-xs flex items-start gap-1">
              <span className="mt-0.5">✓</span>
              <span>Access to different features and tools</span>
            </p>
            <p className="text-purple-700 text-xs flex items-start gap-1">
              <span className="mt-0.5">✓</span>
              <span>Additional IPO application opportunities</span>
            </p>
          </div>
          <p className="text-purple-600 text-[10px] mt-2 italic">
            Optional - Can be opened as secondary account alongside {BROKER_CONFIGS[userData.brokerInfo.brokers[0]]?.name}
          </p>
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

      {/* STICKY CTA BUTTON - Shows after scrolling past hero */}
      <AnimatePresence>
        {showStickyButton && !showComparison && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 shadow-2xl p-4"
          >
            <div className="max-w-4xl mx-auto">
              <motion.button
                onClick={handleConversion}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-lg shadow-lg transition-all hover:shadow-2xl hover:from-green-600 hover:to-green-700"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Open Your FREE {primaryBroker?.name} Account (5 Min) →
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WHAT HAPPENS NEXT MODAL - Shows before redirect */}
      <AnimatePresence>
        {showWhatNextModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={() => setShowWhatNextModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="text-3xl">🚀</span>
                  What Happens Next?
                </span>
                <span className="text-lg font-bold text-green-600">
                  Redirecting in {redirectCountdown}s...
                </span>
              </h3>

              {/* 4-Step Process */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-bold text-gray-900">Click to Open {primaryBroker?.name}</h4>
                    <p className="text-sm text-gray-600">You&apos;ll be redirected to {primaryBroker?.name}&apos;s secure website</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="font-bold text-gray-900">Fill the Application Form (5-10 mins)</h4>
                    <p className="text-sm text-gray-600">Have ready: PAN card, Aadhaar, bank details, signature photo</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="font-bold text-gray-900">Verification (4-24 hours)</h4>
                    <p className="text-sm text-gray-600">{primaryBroker?.name} verifies documents with SEBI & exchanges</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
                  <div>
                    <h4 className="font-bold text-gray-900">Start Trading!</h4>
                    <p className="text-sm text-gray-600">Get login credentials, add funds, and place your first trade</p>
                  </div>
                </div>
              </div>

              {/* Required Documents */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-1">
                  <span>📋</span> Required Documents
                </h4>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>✓ PAN Card</li>
                  <li>✓ Aadhaar Card</li>
                  <li>✓ Bank Account Details</li>
                  <li>✓ Signature Photo (white background)</li>
                </ul>
              </div>

              {/* Timeline */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-1">
                  <span>⏱️</span> Account Opens in 24-48 Hours
                </h4>
                <p className="text-sm text-blue-800">
                  You&apos;ll receive login credentials via email and SMS once verification is complete
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowWhatNextModal(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFinalRedirect}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-bold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
                >
                  I&apos;m Ready, Continue to {primaryBroker?.name} →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ModularBrokerTool;