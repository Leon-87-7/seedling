# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Seedling🌱" is a React-based market analysis platform for identifying mean reversion opportunities in stock sectors. The application analyzes stocks across 5 sectors (Healthcare, Technology, Finance, Energy, Retail) and highlights undervalued opportunities using sector mean comparisons.

## Development Commands

### Primary Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint on codebase

### Development Server

The app runs on `http://localhost:5173` by default using Vite.

## Architecture Overview

### Component Structure

The application uses a modular component architecture with clear separation of concerns:

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx       # Navigation and branding
│   ├── SectorDropdown.jsx # Interactive sector selection
│   ├── Chart.jsx        # Main data visualization (Recharts)
│   ├── OpportunityCards.jsx # Featured undervalued stocks
│   ├── DataTable.jsx    # Comprehensive sector breakdown
│   └── Footer.jsx       # Professional footer
├── constants/
│   └── sectorData.js    # Centralized stock data definitions
├── App.jsx             # Main application logic and state
├── App.css             # Global styles and responsive design
└── main.jsx           # React application entry point
```

### Data Flow Architecture

1. **App.jsx** manages all application state (sector selection, stock data, loading states)
2. **Mock data generation** creates realistic financial metrics (P/E, P/B, ROE, price changes)
3. **Sector calculations** automatically compute means and identify undervalued opportunities
4. **Props-based component communication** passes data down to specialized components

### Key Technical Patterns

#### State Management

- Uses React hooks (useState, useEffect) for state management
- Centralized state in App.jsx with props passed to child components
- Real-time calculations for sector averages and stock rankings

#### Data Processing

- **generateMockMetrics()** creates realistic financial data
- **fetchStockData()** processes sector data and sorts stocks by price (ascending)
- **getUndervaluedStocks()** filters stocks below sector mean with "Undervalued" rating

#### Chart Implementation

- Uses Recharts library with custom styling
- **CustomYAxisTick** component highlights sector mean value in red on Y-axis
- Color-coded bars: green for undervalued (below mean), blue for overvalued
- Reference line shows sector mean across chart

### Styling Architecture

- **CSS-in-CSS** approach with modular class naming
- **Responsive design** with breakpoints at 1024px, 768px, 480px
- **Professional color palette** with consistent gradient themes
- **Component-specific styling** with clear class hierarchies

### Data Constants

Stock data is centralized in `src/constants/sectorData.js` with:

- 48 companies across 5 sectors
- Market cap information for each company
- Consistent symbol/name/marketCap structure

## Important Implementation Details

### Chart Customization

The Chart component includes sophisticated customizations:

- Custom Y-axis ticks that include sector mean value
- Dynamic tick calculation based on actual price range
- Highlighted sector mean tick in red with bold styling
- Reference line positioning aligned with Y-axis value

### Responsive Behavior

- Mobile-first CSS approach
- Chart header stacks vertically on tablets
- Data table uses horizontal scrolling on mobile
- Opportunity cards collapse to single column

### Mock Data Characteristics

- Prices: $50-$450 range with integer values
- P/E Ratios: 5.00-35.00 range
- P/B Ratios: 0.50-5.50 range
- ROE: 5.00-30.00% range
- Daily Change: -5.00% to +5.00% range
- Rating: 70% "Undervalued", 30% "Fair Value"

## Branding & Content

- Application name: ""Seedling🌱""
- Company: "Seedling Analytics"
- Professional disclaimer required in footer
- AI report generation buttons (mock functionality)
- Investment advice warnings included
