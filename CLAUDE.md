# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Seedling🌱" is a React-based financial analysis platform with Firebase backend integration. The application provides user authentication, portfolio tracking, watchlist management, and sector analysis for identifying undervalued investment opportunities across 11 primary sectors.

## Development Commands

### Primary Commands

- `npm run dev` - Start development server with hot reload (runs on `http://localhost:5173`)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint on codebase

## Architecture Overview

### Application Structure

```
src/
├── components/
│   ├── auth/            # Authentication components
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── auth.css
│   ├── Header.jsx       # Navigation and branding
│   ├── Footer.jsx       # App footer
│   ├── LandingPage.jsx  # Public landing page
│   ├── Dashboard.jsx    # Main authenticated dashboard
│   ├── SectorDropdown.jsx # Sector selection
│   ├── Chart.jsx        # Data visualization (Recharts)
│   ├── DataTable.jsx    # Stock data tables
│   └── OpportunityCards.jsx # Investment opportunities
├── contexts/
│   └── AuthContext.jsx  # Firebase Auth integration
├── config/
│   ├── firebase.js      # Firebase configuration
│   └── firestoreSchema.js # Database schema definitions
├── services/
│   ├── firestoreService.js    # Database operations
│   ├── financialApiService.js # External API integration
│   └── screening.js           # Advanced stock screening engine
├── constants/
│   └── sectorData.js    # Static sector data
├── App.jsx             # Main routing and auth logic
└── main.jsx           # React app entry point
```

### Firebase Integration

**Authentication & User Management:**

- Firebase Auth with email/password authentication
- User profile creation and management in Firestore
- Protected routes for authenticated content
- User preferences and settings persistence

**Firestore Database Collections:**

- `users` - User profiles, preferences, settings
- `watchlists` - User-created stock watchlists
- `portfolios` - User portfolio tracking
- `reports` - AI-generated analysis reports
- `stock_data` - Cached financial data
- `sector_analytics` - Sector performance metrics

### Data Architecture

**Real-time Financial Data:**

- Integration with multiple financial APIs (Alpha Vantage, Yahoo Finance)
- Automatic fallback between API providers
- Data caching in Firestore with 1-hour refresh intervals
- Rate limiting and error handling for external APIs

**User Data Flow:**

1. **Authentication** via Firebase Auth creates user session
2. **Profile Loading** fetches user data from Firestore
3. **Dashboard Data** combines user data with cached financial metrics
4. **Real-time Updates** sync user actions (watchlist changes, portfolio updates)

### Key Technical Patterns

**State Management:**

- React Context for authentication state (`AuthContext`)
- React Router v6 for client-side routing
- Local component state for UI-specific data
- Firestore real-time listeners for data synchronization

**API Integration:**

- Service layer abstraction (`FinancialApiService`)
- Multi-provider fallback strategy for reliability
- Sophisticated rate limiting and caching
- Valuation calculations (Graham Number, DCF estimation)
- Environment variable configuration for all API keys

**Security & Error Handling:**

- Firebase Security Rules for data access control
- Input validation and sanitization
- Graceful error handling with user feedback
- Safe number formatting with `formatNumber()` helpers
- API key management via Vite environment variables (`import.meta.env.VITE_*`)

**Configuration Management:**

- Dynamic Firebase configuration loading from environment
- Vite-compatible environment variable format
- Development/production environment separation
- Secure credential handling with `.env` file exclusion

## Development Workflow

### Firebase Setup Required

Before development, configure Firebase:

1. Set up Firebase project at https://console.firebase.google.com/
2. Enable Authentication with Email/Password and Google providers
3. Set up Firestore database with security rules
4. Configure environment variables in `.env` file:
   - **Firebase Configuration:**
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`
     - `VITE_FIREBASE_MEASUREMENT_ID`
   - **API Keys:**
     - `VITE_ALPHA_VANTAGE_API_KEY` for Alpha Vantage API access
     - `VITE_OPENAI_API_KEY` for future AI features (optional)
     - `VITE_ANTHROPIC_API_KEY` for future AI features (optional)

### Key Development Areas

**Authentication Flow:**

- Landing page → Login/Signup OR Demo Access → Dashboard
- Dashboard accessible in both authenticated and demo modes
- Protected features (watchlists, portfolios) require authentication within dashboard
- User profile creation on first signup
- Password reset functionality included

**Financial Data Management:**

- Service layer handles all external API calls
- Automatic data caching and refresh logic
- Multi-provider redundancy for reliability
- Complex valuation algorithms for stock analysis
- Advanced stock screening engine with fundamental analysis

**Demo Mode Implementation:**

- Public dashboard access without authentication required
- Smart data loading: real API data for authenticated users, mock data for demos
- Seamless fallback to mock data when APIs fail
- Demo UI indicators and special messaging for non-authenticated users

**User Features:**

- Personal watchlists and portfolios
- AI report generation (framework in place)
- Customizable preferences and settings
- Historical data tracking and analytics

### Advanced Stock Screening Engine

The `src/services/screening.js` file implements a sophisticated fundamental analysis system:

- **StockScreener Class**: Comprehensive screening with sector comparison
- **Composite Scoring Algorithm**: Weighted scoring system
  - Valuation (40% weight): P/E, P/B, P/S ratios vs sector averages
  - Financial Health (30% weight): ROE, debt-to-equity, cash flow metrics
  - Growth (20% weight): Revenue and net income growth trends
  - Management Efficiency (10% weight): ROE vs sector, operating margins
- **Sector-Specific Criteria**: Customized screening parameters by industry (Technology, Healthcare, Finance, Utilities)
- **Performance Features**: 15-minute caching system, batch processing, red flag detection
- **Filtering System**: Multi-layer validation including penny stock filters, debt thresholds, and growth requirements
- **Transparency**: Detailed score breakdowns and red flag identification for each stock

## Important Implementation Notes

### API Integration

The application implements a three-tier fallback strategy:

- **Primary**: Alpha Vantage - Comprehensive data, 500 calls/day limit
- **Secondary**: Yahoo Finance - Free, no API key required
- **Tertiary**: Mock data generation for demos and API failures

**Smart Data Loading:**
- Authenticated users receive real API data with mock fallback
- Demo users get immediate mock data for instant functionality
- Graceful error handling with user-friendly messaging

**Note:** IEX Cloud API was officially retired on August 31, 2024, and has been removed from the integration.

### Firestore Schema

User data is structured with clear relationships:

- User profiles link to watchlists, portfolios, and reports
- Stock data is cached globally with update timestamps
- Sector analytics are pre-computed and stored

### Chart Implementation

Uses Recharts library with advanced customizations:

- Sector mean reference lines
- Color-coded valuation indicators
- Custom Y-axis formatting
- Responsive design for mobile devices

## Branding & Content

- Application name: "Seedling🌱"
- Company: "Seedling Analytics"
- Professional financial disclaimers required
- Focus on conservative value investing principles

## Troubleshooting

### Common Issues and Solutions

#### Firebase Configuration Errors
- **Error**: `auth/configuration-not-found` or `Firebase: Error (auth/configuration-not-found)`
- **Solution**: Ensure Firebase config uses environment variables correctly in `src/config/firebase.js`
- **Check**: Verify all `VITE_FIREBASE_*` variables are set in `.env` file

#### TypeError: `.toFixed is not a function`
- **Error**: JavaScript errors when displaying financial data
- **Solution**: All financial display components use `formatNumber()` helper function
- **Check**: Ensure components like `DataTable.jsx` and `OpportunityCards.jsx` have proper number formatting

#### Landing Page UI Issues
- **Issue**: Poor contrast or invisible buttons
- **Solution**: Hero title uses `color: #ffffff` with `text-shadow` for readability
- **Check**: `.cta-button.demo` class exists for "Try Demo" button styling

#### Environment Variables Not Loading
- **Issue**: API calls failing or Firebase not initializing
- **Solution**: Use `import.meta.env.VITE_*` format (not `process.env.REACT_APP_*`)
- **Check**: Restart dev server after changing `.env` file

#### Development Server Issues
- **Issue**: Changes not reflecting in browser
- **Solution**: Hard refresh (Ctrl+F5) or restart dev server
- **Command**: `npm run dev` to start development server

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

### Quick Setup Checklist

1. ✅ Firebase project configured with Authentication and Firestore
2. ✅ Environment variables set in `.env` file
3. ✅ Google Authentication enabled in Firebase Console
4. ✅ Alpha Vantage API key obtained (optional for demo mode)
5. ✅ Development server running (`npm run dev`)

### File Structure Notes

- **Components**: All React components have proper imports and error handling
- **Services**: Firebase and API services use environment variables
- **Styling**: CSS uses consistent naming and responsive breakpoints
- **Configuration**: Firebase config dynamically loads from environment
