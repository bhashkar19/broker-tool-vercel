# Broker Recommendation Tool

A modern, responsive web application that helps users find the perfect trading broker based on their needs and preferences. Built with Next.js, TypeScript, and deployed on Vercel.

## Features

- **Interactive Assessment**: 6-question survey to understand user trading needs
- **Personalized Recommendations**: AI-powered broker suggestions based on user responses
- **Lead Generation**: Captures user information for follow-up
- **Analytics Integration**: Facebook Pixel tracking and conversion events
- **Mobile-First Design**: Responsive design optimized for all devices
- **Performance Optimized**: Built with Next.js for fast loading and SEO

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Vercel
- **Analytics**: Facebook Pixel

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd broker-tool-vercel
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:
- `NEXT_PUBLIC_FACEBOOK_PIXEL_ID`: Your Facebook Pixel ID
- `UPSTOX_AFFILIATE_ID`: Your Upstox affiliate ID
- Other configuration variables as needed

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
broker-tool-vercel/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── brokers/       # Broker data endpoint
│   │   │   └── submit/        # Form submission endpoint
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout with Facebook Pixel
│   │   └── page.tsx           # Home page
│   └── components/
│       └── BrokerTool.tsx     # Main broker assessment component
├── public/                    # Static assets
├── .env.example              # Environment variables template
├── .env.local               # Local environment variables (git-ignored)
├── vercel.json              # Vercel deployment configuration
└── README.md                # This file
```

## Key Components

### BrokerTool Component
The main interactive component that handles:
- User data collection
- Question flow management
- Progress tracking
- Analytics event tracking
- Recommendation generation

### API Endpoints

#### `/api/submit`
- **Method**: POST
- **Purpose**: Handles form submission data
- **Validation**: Mobile number format, required fields
- **Security**: Input sanitization and validation

#### `/api/brokers`
- **Method**: GET
- **Purpose**: Returns broker comparison data
- **Response**: JSON with broker features, pros, cons, and pricing

## Analytics & Tracking

The application integrates Facebook Pixel for comprehensive tracking:

- **PageView**: Tracks page loads
- **ToolStarted**: When user begins assessment
- **QuestionAnswered**: For each question response
- **LeadCaptured**: When user provides contact information
- **QuestionProgressed**: Progress through assessment
- **RecommendationViewed**: When final recommendation is shown
- **AffiliateClicked**: When user clicks through to broker

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
npm run build
vercel --prod
```

## Environment Variables

### Required Variables
- `NEXT_PUBLIC_FACEBOOK_PIXEL_ID`: Facebook Pixel tracking ID
- `UPSTOX_AFFILIATE_ID`: Affiliate ID for broker referrals

### Optional Variables
- `DATABASE_URL`: Database connection string (if using external DB)
- `API_SECRET_KEY`: API security key
- `GOOGLE_ANALYTICS_ID`: Google Analytics tracking ID

## Configuration

### Facebook Pixel Setup
1. Create Facebook Pixel in Facebook Business Manager
2. Add Pixel ID to environment variables
3. Configure conversion events in Facebook Ads Manager

### Affiliate Links
Update the affiliate URL in `BrokerTool.tsx`:
```typescript
const affiliateUrl = `https://upstox.com/open-account/?ref=${process.env.UPSTOX_AFFILIATE_ID}`;
```

## Customization

### Adding New Brokers
Update the brokers array in `/api/brokers/route.ts`:
```typescript
{
  id: 'new_broker',
  name: 'New Broker',
  intraday_brokerage: 20,
  delivery_brokerage: 0,
  // ... other properties
}
```

### Modifying Questions
Edit the question components in `BrokerTool.tsx` to add or modify assessment questions.

### Styling
- Tailwind CSS classes can be modified throughout components
- Global styles in `src/app/globals.css`
- Component-specific styles using Tailwind utilities

## Performance Optimization

- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic with Next.js App Router
- **Font Optimization**: Using Next.js font optimization
- **Analytics**: Deferred loading of tracking scripts

## Security Features

- **Input Validation**: Server-side validation for all inputs
- **Rate Limiting**: Can be added via Vercel Edge Functions
- **Environment Variables**: Sensitive data stored securely
- **CORS Configuration**: Proper API endpoint security

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
