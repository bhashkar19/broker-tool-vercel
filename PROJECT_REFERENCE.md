# Broker Recommendation Tool - Project Reference

## 🎯 Project Overview
An intelligent broker recommendation system that provides authentic, consultative advice through validated user issue recognition and expert insights.

## 🚀 Live Demo
- **Production URL**: https://broker-tool-vercel-91j2d7l7j-bhashkar19s-projects.vercel.app
- **Test Page**: https://broker-tool-vercel-91j2d7l7j-bhashkar19s-projects.vercel.app/test

## 📁 Project Structure
```
broker-tool-vercel/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Main landing page
│   │   └── test/page.tsx              # Testing interface
│   ├── components/
│   │   └── ModularBrokerTool.tsx      # Main recommendation component
│   └── config/
│       ├── brokerConfigs.ts           # Broker data & business logic
│       ├── questionConfigs.ts         # A/B testing questionnaire flows
│       ├── recommendationEngine.ts    # Core recommendation algorithm
│       └── comprehensiveBrokerIssues.ts # Validated broker issues database
├── package.json
├── next.config.js
└── README.md
```

## 🛠 Technology Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Deployment**: Vercel
- **Analytics**: Facebook Pixel integration

## 🎨 Key Features

### 1. Enhanced Two-Path Questionnaire Flow
- **New Users**: 3 simple questions
- **Existing Users**: 7 detailed questions with multi-select options
- **Combined Broker Selection**: Dropdown with flexible validation

### 2. Comprehensive Validation System
- **User Issue Acknowledgment**: Validates selected problems with documented evidence
- **Expert Insights**: Provides additional challenges users didn't think of
- **Balanced Perspective**: Shows both broker strengths and weaknesses
- **Authentic Data**: All claims are publicly verifiable

### 3. Business-Priority Algorithm
- Never recommends brokers users already have
- Priority order: Zerodha = Angel One (1) → Upstox (2) → Fyers (3) → 5paisa (4)
- Single recommendation approach for better conversion

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Local Development Setup

1. **Clone the Repository**
```bash
git clone https://github.com/bhashkar19/broker-tool-vercel.git
cd broker-tool-vercel
```

2. **Install Dependencies**
```bash
npm install
```

3. **Run Development Server**
```bash
npm run dev
```

4. **Access the Application**
- Main Tool: http://localhost:3000
- Test Page: http://localhost:3000/test

### Environment Variables
Create `.env.local` file:
```
# Facebook Pixel (optional)
NEXT_PUBLIC_FB_PIXEL_ID=your_pixel_id

# Add other environment variables as needed
```

## 📊 Testing the System

### Console Testing
1. Navigate to `/test` page
2. Click "Run Test Scenarios"
3. Check browser console for detailed results

### Test Scenarios Included
- New user (no brokers)
- User with single broker (Zerodha, Angel One, etc.)
- User with multiple brokers
- Various user types and challenges

### Expected Behavior
- ✅ Never recommends existing brokers
- ✅ Always shows 95%+ match confidence
- ✅ Provides issue-specific reasoning
- ✅ Follows business priority order

## 🎯 Core Configuration Files

### 1. Broker Issues Database (`comprehensiveBrokerIssues.ts`)
```typescript
export const COMPREHENSIVE_BROKER_ISSUES = {
  'zerodha': {
    user_selectable: {
      "charges": "Already among the lowest for delivery trades...",
      "reliability": "Platform stability issues during high-volume days..."
    },
    additional_insights: [
      "Server stability issues during major market events...",
      "Weekend maintenance periods can make platform unavailable..."
    ],
    positive_aspects: [
      "Industry-leading educational content through Zerodha Varsity",
      "Transparent, honest pricing with no hidden charges"
    ]
  }
}
```

### 2. Question Flow Configuration (`questionConfigs.ts`)
- Three different A/B testing flows (A, B, C)
- Multi-select vs single-select question types
- Conditional question logic

### 3. Recommendation Engine (`recommendationEngine.ts`)
- Business priority-based selection
- User issue validation system
- Multi-select field handling

## 🔧 Customization Guide

### Adding New Brokers
1. Update `BROKER_CONFIGS` in `brokerConfigs.ts`
2. Add broker issues in `comprehensiveBrokerIssues.ts`
3. Update business priority in `BROKER_BUSINESS_PRIORITY`

### Modifying Question Flow
1. Edit questions in `questionConfigs.ts`
2. Update validation logic in `ModularBrokerTool.tsx`
3. Adjust recommendation logic if needed

### Changing Business Logic
1. Modify priority order in `BROKER_BUSINESS_PRIORITY`
2. Update selection algorithm in `selectBestBrokerFromAvailable`

## 📈 Deployment

### Vercel Deployment
1. **Connect to Vercel**
```bash
npx vercel
```

2. **Deploy to Production**
```bash
npx vercel --prod
```

3. **Environment Variables**
Configure in Vercel dashboard under Settings → Environment Variables

## 🧪 A/B Testing
Switch between question flows by changing `ACTIVE_QUESTION_CONFIG` in `questionConfigs.ts`:
```typescript
export const ACTIVE_QUESTION_CONFIG = QUESTION_FLOW_A; // or B, C
```

## 📝 Data Validation Principles
- All broker issues are publicly documented
- No false performance claims
- Balanced perspective (pros and cons)
- User empathy before solution offering
- Expert insights beyond user knowledge

## 🔍 Key Business Rules
1. **Never recommend existing brokers**
2. **Single recommendation only** (not multiple options)
3. **Priority-based selection** (not scoring-based)
4. **High confidence display** (95%+ match)
5. **Issue-specific reasoning** (validate user concerns)

## 🤝 Support & Maintenance
- All data should be regularly validated for accuracy
- Monitor broker policy changes
- Update affiliate URLs as needed
- Validate claims against public sources

## 📞 Contact Information
- **Developer**: Bhashkaranand Joshi
- **Repository**: https://github.com/bhashkar19/broker-tool-vercel
- **Live URL**: https://broker-tool-vercel-91j2d7l7j-bhashkar19s-projects.vercel.app

---

## 🎯 Quick Start Commands
```bash
# Clone and setup
git clone https://github.com/bhashkar19/broker-tool-vercel.git
cd broker-tool-vercel
npm install

# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Deployment
npx vercel              # Deploy to Vercel
npx vercel --prod       # Deploy to production
```

**Note**: This system prioritizes authentic user validation over feature dumping. Every claim should be fact-checkable and the approach should feel consultative rather than sales-focused.