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

  if (question.type === 'custom' && question.id === 'current_brokers_smart') {
    return <SmartBrokerSelection userData={userData} onAnswerSelect={onAnswerSelect} />;
  }

  if (question.type === 'custom' && question.id === 'combined_broker_selection') {
    return <CombinedBrokerSelection userData={userData} onAnswerSelect={onAnswerSelect} />;
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

  // Broker options with logos (placeholder for now)
  const brokerOptions = [
    { value: 'zerodha', label: 'Zerodha', logo: '🟢' },
    { value: 'upstox', label: 'Upstox', logo: '🟠' },
    { value: 'angel_one', label: 'Angel One', logo: '🔵' },
    { value: 'groww', label: 'Groww', logo: '🟡' },
    { value: 'fyers', label: 'Fyers', logo: '🟣' },
    { value: '5paisa', label: '5paisa', logo: '🔴' }
  ];

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
      <div className="grid grid-cols-2 gap-3 mb-6">
        {brokerOptions.map((broker) => (
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
            <span className="text-2xl">{broker.logo}</span>
            <span className="text-sm">{broker.label}</span>
            {selectedBrokers.includes(broker.value) && (
              <CheckCircle className="w-4 h-4 text-blue-600 ml-auto" />
            )}
          </button>
        ))}
      </div>

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
              className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-sm"
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
                  {broker?.logo || '📊'}
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

  // Update parent data whenever our state changes
  useEffect(() => {
    console.log('CombinedBrokerSelection updating parent with:', brokerData);
    onAnswerSelect(JSON.stringify(brokerData));
  }, [brokerData, onAnswerSelect]);

  // Broker options with logos
  const brokerOptions = [
    { value: 'zerodha', label: 'Zerodha', logo: '🟢' },
    { value: 'upstox', label: 'Upstox', logo: '🟠' },
    { value: 'angel_one', label: 'Angel One', logo: '🔵' },
    { value: 'groww', label: 'Groww', logo: '🟡' },
    { value: 'fyers', label: 'Fyers', logo: '🟣' },
    { value: '5paisa', label: '5paisa', logo: '🔴' }
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
          <div className="grid grid-cols-2 gap-3">
            {brokerOptions.map((broker) => (
              <button
                key={broker.value}
                onClick={() => handleBrokerToggle(broker.value)}
                className={`p-4 border-2 rounded-xl font-medium transition-all flex items-center gap-3 ${
                  selectedBrokers.includes(broker.value)
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-900'
                }`}
              >
                <span className="text-2xl">{broker.logo}</span>
                <span className="text-sm">{broker.label}</span>
                {selectedBrokers.includes(broker.value) && (
                  <CheckCircle className="w-4 h-4 text-blue-600 ml-auto" />
                )}
              </button>
            ))}
          </div>

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
                className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-sm"
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
                      {broker?.logo || '📊'}
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

      {/* Removed alternatives - single recommendation only per business requirement */}

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