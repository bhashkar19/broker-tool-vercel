'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle, AlertTriangle } from 'lucide-react';

interface UserData {
  name: string;
  mobile: string;
  currentBroker: string;
  executionIssues: string;
  toolsSatisfaction: string;
  supportExperience: string;
  chargesConcern: string;
  sessionId: string;
}

const BrokerTool = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    mobile: '',
    currentBroker: '',
    executionIssues: '',
    toolsSatisfaction: '',
    supportExperience: '',
    chargesConcern: '',
    sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  });

  const totalQuestions = 6;

  const isQuestion1Valid = userData.name.trim().length >= 2 && userData.mobile.trim().length >= 10;

  useEffect(() => {
    // Initialize Facebook Pixel if available
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', 'ToolStarted', {
        session_id: userData.sessionId,
        timestamp: new Date().toISOString()
      });
    }
  }, [userData.sessionId]);

  const handleOptionSelect = (questionNum: number, value: string) => {
    setUserData(prev => {
      const updated = { ...prev };
      switch(questionNum) {
        case 2: updated.currentBroker = value; break;
        case 3: updated.executionIssues = value; break;
        case 4: updated.toolsSatisfaction = value; break;
        case 5: updated.supportExperience = value; break;
        case 6: updated.chargesConcern = value; break;
      }
      return updated;
    });

    // Track Facebook pixel event
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', 'QuestionAnswered', {
        question_number: questionNum,
        answer: value,
        session_id: userData.sessionId
      });
    }
  };

  const nextQuestion = () => {
    if (currentQuestion === 1) {
      // Track lead capture
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('trackCustom', 'LeadCaptured', {
          session_id: userData.sessionId
        });
      }
    }

    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowRecommendation(true);
      // Track recommendation view
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'AddToCart');
        window.fbq('trackCustom', 'RecommendationViewed', {
          recommended_broker: 'upstox',
          current_broker: userData.currentBroker,
          session_id: userData.sessionId
        });
      }
    }

    // Track progress
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', 'QuestionProgressed', {
        completed_questions: currentQuestion,
        total_questions: totalQuestions,
        session_id: userData.sessionId
      });
    }
  };

  const generateProblems = () => {
    const problems = [];

    if (userData.executionIssues === 'frequently' || userData.executionIssues === 'sometimes') {
      problems.push('Slow order execution causing potential losses');
    }

    if (userData.toolsSatisfaction === 'need_better' || userData.toolsSatisfaction === 'average') {
      problems.push('Limited trading tools and research quality');
    }

    if (userData.supportExperience === 'very_poor' || userData.supportExperience === 'slow') {
      problems.push('Poor customer support during critical moments');
    }

    if (userData.chargesConcern === 'many_times' || userData.chargesConcern === 'sometimes') {
      problems.push('Hidden charges reducing your profits');
    }

    // Add broker-specific problems
    if (userData.currentBroker === 'zerodha') {
      problems.push('Zerodha servers often crash during volatile markets');
    } else if (userData.currentBroker === 'groww') {
      problems.push('Groww lacks advanced F&O trading features');
    } else if (userData.currentBroker === 'angel_one') {
      problems.push('Angel One has complex fee structure');
    }

    return problems;
  };

  const handleConversion = async () => {
    // Track Facebook conversion
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Purchase', {
        value: 500,
        currency: 'INR'
      });

      window.fbq('trackCustom', 'AffiliateClicked', {
        broker: 'upstox',
        switching_from: userData.currentBroker,
        expected_commission: 500,
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
          recommended_broker: 'upstox',
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
    const affiliateUrl = `https://upstox.com/open-account/?ref=YOUR_AFFILIATE_ID&utm_source=broker_tool&utm_medium=recommendation&utm_campaign=facebook_ads&session_id=${userData.sessionId}`;
    window.open(affiliateUrl, '_blank');
  };

  const progressPercentage = showRecommendation ? 100 : (currentQuestion / totalQuestions) * 100;

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 text-center">
        <h1 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <Target className="w-6 h-6" />
          Find Your Perfect Trading Setup
        </h1>
        <p className="text-blue-100">Discover if your current broker is limiting your potential</p>
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
          {!showRecommendation && (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {currentQuestion === 1 && <Question1 userData={userData} setUserData={setUserData} />}
              {currentQuestion === 2 && <Question2 onSelect={handleOptionSelect} selected={userData.currentBroker} />}
              {currentQuestion === 3 && <Question3 onSelect={handleOptionSelect} selected={userData.executionIssues} />}
              {currentQuestion === 4 && <Question4 onSelect={handleOptionSelect} selected={userData.toolsSatisfaction} />}
              {currentQuestion === 5 && <Question5 onSelect={handleOptionSelect} selected={userData.supportExperience} />}
              {currentQuestion === 6 && <Question6 onSelect={handleOptionSelect} selected={userData.chargesConcern} />}

              <motion.button
                onClick={nextQuestion}
                disabled={
                  (currentQuestion === 1 && !isQuestion1Valid) ||
                  (currentQuestion === 2 && !userData.currentBroker) ||
                  (currentQuestion === 3 && !userData.executionIssues) ||
                  (currentQuestion === 4 && !userData.toolsSatisfaction) ||
                  (currentQuestion === 5 && !userData.supportExperience) ||
                  (currentQuestion === 6 && !userData.chargesConcern)
                }
                className="w-full mt-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold text-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:-translate-y-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {currentQuestion === totalQuestions ? 'Get My Recommendation' : 'Continue Assessment'}
              </motion.button>
            </motion.div>
          )}

          {showRecommendation && (
            <RecommendationSection
              problems={generateProblems()}
              onConversion={handleConversion}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Question Components
const Question1 = ({ userData, setUserData }: { userData: UserData; setUserData: React.Dispatch<React.SetStateAction<UserData>> }) => (
  <div>
    <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
      Let&apos;s get started with your personalized assessment
    </h2>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Your Name</label>
        <input
          type="text"
          value={userData.name}
          onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
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
            onChange={(e) => setUserData(prev => ({ ...prev, mobile: e.target.value }))}
            placeholder="Enter your mobile number"
            className="flex-1 p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-900 bg-white"
          />
        </div>
      </div>
    </div>
  </div>
);

const Question2 = ({ onSelect, selected }: { onSelect: (q: number, value: string) => void; selected: string }) => (
  <div>
    <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
      Which broker do you currently use for trading?
    </h2>
    <div className="space-y-3">
      {[
        { value: 'zerodha', label: 'Zerodha' },
        { value: 'groww', label: 'Groww' },
        { value: 'upstox', label: 'Upstox' },
        { value: 'angel_one', label: 'Angel One' },
        { value: 'fyers', label: 'Fyers' },
        { value: '5paisa', label: '5paisa' },
        { value: 'others', label: 'Others' },
        { value: 'no_account', label: "I don&apos;t have a trading account" }
      ].map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(2, option.value)}
          className={`w-full p-4 border-2 rounded-xl text-left font-medium transition-all ${
            selected === option.value
              ? 'border-gray-800 bg-gray-800 text-white'
              : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-900'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
);

const Question3 = ({ onSelect, selected }: { onSelect: (q: number, value: string) => void; selected: string }) => (
  <div>
    <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
      Do you face slow order execution during high market volatility?
    </h2>
    <div className="space-y-3">
      {[
        { value: 'frequently', label: 'Yes, frequently - causes losses' },
        { value: 'sometimes', label: 'Sometimes - quite frustrating' },
        { value: 'rarely', label: 'Rarely - not a major issue' },
        { value: 'never', label: 'Never noticed any problems' }
      ].map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(3, option.value)}
          className={`w-full p-4 border-2 rounded-xl text-left font-medium transition-all ${
            selected === option.value
              ? 'border-gray-800 bg-gray-800 text-white'
              : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-900'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
);

const Question4 = ({ onSelect, selected }: { onSelect: (q: number, value: string) => void; selected: string }) => (
  <div>
    <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
      Are you satisfied with your current trading tools and research quality?
    </h2>
    <div className="space-y-3">
      {[
        { value: 'need_better', label: 'Need much better tools' },
        { value: 'average', label: 'Tools are just average' },
        { value: 'satisfied', label: 'Quite satisfied' },
        { value: 'very_satisfied', label: 'Very satisfied' }
      ].map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(4, option.value)}
          className={`w-full p-4 border-2 rounded-xl text-left font-medium transition-all ${
            selected === option.value
              ? 'border-gray-800 bg-gray-800 text-white'
              : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-900'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
);

const Question5 = ({ onSelect, selected }: { onSelect: (q: number, value: string) => void; selected: string }) => (
  <div>
    <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
      How is your broker&apos;s customer support during urgent trading issues?
    </h2>
    <div className="space-y-3">
      {[
        { value: 'very_poor', label: 'Very poor - never helpful' },
        { value: 'slow', label: 'Takes too long to respond' },
        { value: 'average', label: 'Average - could be better' },
        { value: 'good', label: 'Good and responsive' }
      ].map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(5, option.value)}
          className={`w-full p-4 border-2 rounded-xl text-left font-medium transition-all ${
            selected === option.value
              ? 'border-gray-800 bg-gray-800 text-white'
              : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-900'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
);

const Question6 = ({ onSelect, selected }: { onSelect: (q: number, value: string) => void; selected: string }) => (
  <div>
    <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
      Have you noticed unexpected or hidden charges in your trading account?
    </h2>
    <div className="space-y-3">
      {[
        { value: 'many_times', label: 'Yes, many times - quite annoying' },
        { value: 'sometimes', label: 'Sometimes - not transparent' },
        { value: 'rarely', label: 'Rarely - mostly clear' },
        { value: 'never', label: 'Never - completely transparent' }
      ].map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(6, option.value)}
          className={`w-full p-4 border-2 rounded-xl text-left font-medium transition-all ${
            selected === option.value
              ? 'border-gray-800 bg-gray-800 text-white'
              : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-900'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
);

const RecommendationSection = ({ problems, onConversion }: { problems: string[]; onConversion: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-center"
  >
    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-2">
      <Target className="w-6 h-6" />
      Your Personalized Broker Recommendation
    </h2>

    {problems.length > 0 && (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6 text-left">
        <h4 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Issues Identified with Your Current Setup:
        </h4>
        <ul className="text-yellow-700 space-y-2">
          {problems.map((problem, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
              {problem}
            </li>
          ))}
        </ul>
      </div>
    )}

    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 mb-6">
      <h3 className="text-2xl font-bold mb-2">🏆 Recommended: Upstox</h3>
      <p className="text-green-100">
        Based on your responses, Upstox is the perfect match for your trading needs
      </p>
    </div>

    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6 text-left">
      <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
        <CheckCircle className="w-5 h-5" />
        Why Upstox Solves Your Problems:
      </h4>
      <ul className="text-blue-700 space-y-2">
        <li className="flex items-start gap-2">
          <CheckCircle className="w-4 h-4 mt-1 text-green-500 flex-shrink-0" />
          Lightning-fast execution even during high volatility
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle className="w-4 h-4 mt-1 text-green-500 flex-shrink-0" />
          Advanced trading tools and professional charts
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle className="w-4 h-4 mt-1 text-green-500 flex-shrink-0" />
          24/7 customer support with live chat
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle className="w-4 h-4 mt-1 text-green-500 flex-shrink-0" />
          Completely transparent pricing with no hidden charges
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle className="w-4 h-4 mt-1 text-green-500 flex-shrink-0" />
          Free account opening with instant activation
        </li>
      </ul>
    </div>

    <motion.button
      onClick={onConversion}
      className="w-full py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold text-lg uppercase tracking-wide transition-all hover:shadow-xl"
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      🚀 Open Free Upstox Account Now
    </motion.button>

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

export default BrokerTool;