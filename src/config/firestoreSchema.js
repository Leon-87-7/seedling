// Firestore Database Schema Documentation
// This file documents the database structure for the Seedling investment platform

export const FIRESTORE_COLLECTIONS = {
  // User profiles and authentication data
  USERS: 'users',
  
  // User watchlists and saved stocks
  WATCHLISTS: 'watchlists',
  
  // Cached financial data for performance
  STOCK_DATA: 'stockData',
  
  // AI-generated reports and analysis
  REPORTS: 'reports',
  
  // User portfolio holdings
  PORTFOLIOS: 'portfolios',
  
  // System-wide sector analytics
  SECTOR_ANALYTICS: 'sectorAnalytics'
};

// User Document Schema
export const USER_SCHEMA = {
  // Document ID: Firebase Auth UID
  email: 'string',
  displayName: 'string',
  createdAt: 'timestamp',
  lastLoginAt: 'timestamp',
  
  // User preferences
  preferences: {
    defaultSector: 'string', // 'healthcare', 'technology', etc.
    alertsEnabled: 'boolean',
    theme: 'string', // 'light', 'dark'
    riskTolerance: 'string', // 'conservative', 'moderate', 'aggressive'
    defaultCurrency: 'string', // 'USD', 'EUR', etc.
    notificationSettings: {
      emailAlerts: 'boolean',
      priceAlerts: 'boolean',
      weeklyReports: 'boolean'
    }
  },
  
  // Subscription and billing
  subscription: {
    plan: 'string', // 'free', 'pro', 'enterprise'
    status: 'string', // 'active', 'cancelled', 'expired'
    expiresAt: 'timestamp',
    stripeCustomerId: 'string'
  },
  
  // Usage tracking
  usage: {
    reportsGenerated: 'number',
    apiCallsThisMonth: 'number',
    lastReportGenerated: 'timestamp'
  }
};

// Watchlist Document Schema
export const WATCHLIST_SCHEMA = {
  // Document ID: auto-generated
  userId: 'string', // Reference to users collection
  name: 'string', // 'My Tech Stocks', 'Undervalued Picks', etc.
  description: 'string',
  isDefault: 'boolean',
  createdAt: 'timestamp',
  updatedAt: 'timestamp',
  
  // Array of stock objects
  stocks: [
    {
      symbol: 'string', // 'AAPL', 'GOOGL', etc.
      name: 'string',
      sector: 'string',
      addedAt: 'timestamp',
      addedPrice: 'number',
      notes: 'string', // User notes about the stock
      alerts: {
        priceTarget: 'number',
        stopLoss: 'number',
        enabled: 'boolean'
      }
    }
  ],
  
  // Watchlist metadata
  tags: ['string'], // ['value', 'growth', 'dividend']
  isPublic: 'boolean', // Allow sharing with other users
  performance: {
    totalReturn: 'number',
    lastCalculated: 'timestamp'
  }
};

// Stock Data Cache Schema (for performance optimization)
export const STOCK_DATA_SCHEMA = {
  // Document ID: stock symbol (e.g., 'AAPL')
  symbol: 'string',
  name: 'string',
  sector: 'string',
  exchange: 'string',
  
  // Current price data
  currentPrice: 'number',
  previousClose: 'number',
  dayChange: 'number',
  dayChangePercent: 'number',
  volume: 'number',
  
  // Financial metrics
  metrics: {
    peRatio: 'number',
    pbRatio: 'number',
    pegRatio: 'number',
    roe: 'number',
    roa: 'number',
    debtToEquity: 'number',
    currentRatio: 'number',
    quickRatio: 'number',
    grossMargin: 'number',
    operatingMargin: 'number',
    netMargin: 'number'
  },
  
  // Valuation analysis
  valuation: {
    intrinsicValue: 'number',
    grahamNumber: 'number',
    bookValue: 'number',
    tangibleBookValue: 'number',
    rating: 'string', // 'Undervalued', 'Fair Value', 'Overvalued'
    confidenceScore: 'number' // 0-100
  },
  
  // Data freshness tracking
  lastUpdated: 'timestamp',
  dataSource: 'string', // 'alpha_vantage', 'iex_cloud', etc.
  updateFrequency: 'string' // 'realtime', 'daily', 'weekly'
};

// AI Reports Schema
export const REPORT_SCHEMA = {
  // Document ID: auto-generated
  userId: 'string',
  stockSymbol: 'string',
  reportType: 'string', // 'full_analysis', 'quick_insight', 'risk_assessment'
  
  // Report content
  title: 'string',
  summary: 'string',
  recommendation: 'string', // 'Strong Buy', 'Buy', 'Hold', 'Sell', 'Strong Sell'
  targetPrice: 'number',
  riskLevel: 'string', // 'Low', 'Medium', 'High'
  
  // Detailed analysis sections
  analysis: {
    fundamentalAnalysis: 'string',
    technicalAnalysis: 'string',
    riskFactors: ['string'],
    catalysts: ['string'],
    comparisons: [
      {
        symbol: 'string',
        metric: 'string',
        comparison: 'string'
      }
    ]
  },
  
  // AI model information
  aiModel: 'string', // 'gpt-4', 'claude-3', etc.
  confidence: 'number', // 0-100
  
  // Report metadata
  createdAt: 'timestamp',
  isPublic: 'boolean',
  tags: ['string'],
  
  // User interaction
  userFeedback: {
    rating: 'number', // 1-5 stars
    helpful: 'boolean',
    comments: 'string'
  }
};

// Portfolio Holdings Schema
export const PORTFOLIO_SCHEMA = {
  // Document ID: auto-generated
  userId: 'string',
  name: 'string', // 'Main Portfolio', 'Retirement Account', etc.
  type: 'string', // 'investment', 'retirement', 'trading'
  
  // Holdings array
  holdings: [
    {
      symbol: 'string',
      name: 'string',
      quantity: 'number',
      averageCost: 'number',
      currentPrice: 'number',
      totalValue: 'number',
      gainLoss: 'number',
      gainLossPercent: 'number',
      purchaseDates: [
        {
          date: 'timestamp',
          quantity: 'number',
          price: 'number'
        }
      ]
    }
  ],
  
  // Portfolio analytics
  analytics: {
    totalValue: 'number',
    totalCost: 'number',
    totalGainLoss: 'number',
    totalGainLossPercent: 'number',
    sectorAllocation: {
      healthcare: 'number',
      technology: 'number',
      finance: 'number',
      energy: 'number',
      retail: 'number'
    }
  },
  
  // Portfolio settings
  settings: {
    isPublic: 'boolean',
    trackDividends: 'boolean',
    autoRebalance: 'boolean'
  },
  
  createdAt: 'timestamp',
  updatedAt: 'timestamp'
};

// Sector Analytics Schema (system-wide data)
export const SECTOR_ANALYTICS_SCHEMA = {
  // Document ID: sector name (e.g., 'healthcare')
  sector: 'string',
  
  // Aggregate metrics
  metrics: {
    averagePE: 'number',
    averagePB: 'number',
    averageROE: 'number',
    averageROA: 'number',
    averageMargin: 'number',
    medianPrice: 'number',
    meanPrice: 'number'
  },
  
  // Sector performance
  performance: {
    oneDay: 'number',
    oneWeek: 'number',
    oneMonth: 'number',
    threeMonths: 'number',
    oneYear: 'number'
  },
  
  // Top performers in sector
  topPerformers: [
    {
      symbol: 'string',
      name: 'string',
      performance: 'number',
      metric: 'string' // 'price_change', 'roe', 'growth'
    }
  ],
  
  // Undervalued opportunities
  undervaluedStocks: [
    {
      symbol: 'string',
      name: 'string',
      currentPrice: 'number',
      intrinsicValue: 'number',
      discount: 'number' // percentage below intrinsic value
    }
  ],
  
  // Data freshness
  lastUpdated: 'timestamp',
  stockCount: 'number' // number of stocks in this sector
};

// Firestore Security Rules Template
export const SECURITY_RULES_TEMPLATE = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write their own watchlists
    match /watchlists/{watchlistId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Stock data is readable by authenticated users, writable by cloud functions only
    match /stockData/{symbol} {
      allow read: if request.auth != null;
      allow write: if false; // Only cloud functions can write
    }
    
    // Users can read/write their own reports
    match /reports/{reportId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Users can read/write their own portfolios
    match /portfolios/{portfolioId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Sector analytics are readable by all authenticated users
    match /sectorAnalytics/{sector} {
      allow read: if request.auth != null;
      allow write: if false; // Only cloud functions can write
    }
  }
}
`;

// Helper functions for database operations
export const DB_HELPERS = {
  // Generate user document reference
  getUserRef: (uid) => `users/${uid}`,
  
  // Generate watchlist query for user
  getUserWatchlistsQuery: (uid) => ({
    collection: 'watchlists',
    where: ['userId', '==', uid],
    orderBy: ['createdAt', 'desc']
  }),
  
  // Generate stock data reference
  getStockDataRef: (symbol) => `stockData/${symbol.toUpperCase()}`,
  
  // Generate user reports query
  getUserReportsQuery: (uid) => ({
    collection: 'reports',
    where: ['userId', '==', uid],
    orderBy: ['createdAt', 'desc']
  }),
  
  // Generate sector analytics reference
  getSectorAnalyticsRef: (sector) => `sectorAnalytics/${sector.toLowerCase()}`
};