import { NextResponse } from 'next/server';

// Broker data - in a real app, this would come from a database
const brokers = [
  {
    id: 'zerodha',
    name: 'Zerodha',
    intraday_brokerage: 20,
    delivery_brokerage: 0,
    fo_brokerage: 20,
    amc_charges: 300,
    features: [
      'Free equity delivery trading',
      'Advanced charting with TradingView',
      'Kite mobile app',
      'Console web platform'
    ],
    pros: [
      'Most popular broker in India',
      'Zero brokerage for delivery',
      'Good educational content'
    ],
    cons: [
      'Server issues during volatile markets',
      'Limited customer support',
      'Basic research reports'
    ]
  },
  {
    id: 'upstox',
    name: 'Upstox',
    intraday_brokerage: 20,
    delivery_brokerage: 0,
    fo_brokerage: 20,
    amc_charges: 150,
    features: [
      'Free equity delivery trading',
      'Professional trading tools',
      'Fast order execution',
      '24/7 customer support'
    ],
    pros: [
      'Faster execution speed',
      'Lower AMC charges',
      'Better customer support',
      'Professional trading platform'
    ],
    cons: [
      'Smaller market share',
      'Limited educational content'
    ]
  },
  {
    id: 'groww',
    name: 'Groww',
    intraday_brokerage: 20,
    delivery_brokerage: 0,
    fo_brokerage: 20,
    amc_charges: 0,
    features: [
      'Free equity delivery trading',
      'Zero AMC charges',
      'Simple user interface',
      'Mutual funds investment'
    ],
    pros: [
      'Zero AMC charges',
      'Beginner-friendly interface',
      'Good for long-term investing'
    ],
    cons: [
      'Limited F&O features',
      'Basic charting tools',
      'Newer platform'
    ]
  },
  {
    id: 'angel_one',
    name: 'Angel One',
    intraday_brokerage: 20,
    delivery_brokerage: 0,
    fo_brokerage: 20,
    amc_charges: 240,
    features: [
      'Free equity delivery trading',
      'Angel SpeedPro platform',
      'Research reports',
      'Investment advisory'
    ],
    pros: [
      'Strong research and advisory',
      'Multiple trading platforms',
      'Good customer support'
    ],
    cons: [
      'Higher charges for some services',
      'Complex pricing structure'
    ]
  },
  {
    id: 'fyers',
    name: 'Fyers',
    intraday_brokerage: 20,
    delivery_brokerage: 0,
    fo_brokerage: 20,
    amc_charges: 400,
    features: [
      'Free equity delivery trading',
      'Advanced trading tools',
      'API access',
      'Professional charts'
    ],
    pros: [
      'Professional trading tools',
      'Good for active traders',
      'API access for algorithmic trading'
    ],
    cons: [
      'Higher AMC charges',
      'Complex for beginners'
    ]
  },
  {
    id: '5paisa',
    name: '5paisa',
    intraday_brokerage: 10,
    delivery_brokerage: 10,
    fo_brokerage: 10,
    amc_charges: 0,
    features: [
      'Low brokerage charges',
      'Zero AMC',
      'Mobile trading app',
      'Investment products'
    ],
    pros: [
      'Very low brokerage',
      'Zero AMC charges',
      'Good for high-volume traders'
    ],
    cons: [
      'Charges for delivery trades',
      'Limited features',
      'Basic platform'
    ]
  }
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      brokers,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching brokers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}