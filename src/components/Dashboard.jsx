import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import SectorDropdown from './SectorDropdown';
import Chart from './Chart';
import OpportunityCards from './OpportunityCards';
import DataTable from './DataTable';
import { SECTOR_STOCKS } from '../constants/sectorData';
import { financialApiService, sectorAnalysisHelpers } from '../services/financialApiService';
import { userService } from '../services/firestoreService';

const Dashboard = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  
  const [selectedSector, setSelectedSector] = useState('healthcare');
  const [stockData, setStockData] = useState([]);
  const [sectorMean, setSectorMean] = useState(0);
  const [sectorPE, setSectorPE] = useState(0);
  const [sectorPB, setSectorPB] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState(null);
  const [sectorMetrics, setSectorMetrics] = useState(null);


  const fetchStockData = async (sector) => {
    setLoading(true);
    setError(null);
    
    try {
      const stocks = SECTOR_STOCKS[sector];
      const symbols = stocks.map(stock => stock.symbol);
      
      // Fetch real stock data from financial API
      const realStockData = await financialApiService.getMultipleStocksData(symbols);
      
      // If API fails, fallback to mock data with a warning
      if (realStockData.length === 0) {
        console.warn('Financial API returned no data, using fallback mock data');
        setError('Using demo data - API unavailable');
        
        // Fallback mock data generation
        const mockStockData = stocks.map((stock) => ({
          symbol: stock.symbol,
          name: stock.name,
          sector: sector,
          currentPrice: Math.floor(Math.random() * 400) + 50,
          previousClose: Math.floor(Math.random() * 400) + 50,
          dayChange: (Math.random() * 10 - 5).toFixed(2),
          dayChangePercent: (Math.random() * 10 - 5).toFixed(2),
          volume: Math.floor(Math.random() * 1000000) + 100000,
          metrics: {
            peRatio: parseFloat((Math.random() * 30 + 5).toFixed(2)),
            pbRatio: parseFloat((Math.random() * 5 + 0.5).toFixed(2)),
            roe: parseFloat((Math.random() * 25 + 5).toFixed(2)),
          },
          valuation: {
            rating: Math.random() > 0.3 ? 'Undervalued' : 'Fair Value',
            confidenceScore: Math.floor(Math.random() * 40) + 50
          }
        }));
        
        processStockData(mockStockData);
        return;
      }
      
      processStockData(realStockData);
      
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setError('Failed to fetch market data. Please try again.');
      setLoading(false);
    }
  };
  
  const processStockData = (stocksData) => {
    // Calculate sector metrics
    const metrics = sectorAnalysisHelpers.calculateSectorMetrics(stocksData);
    
    if (metrics) {
      setSectorMetrics(metrics);
      setSectorMean(Math.round(metrics.meanPrice * 100) / 100);
      setSectorPE(Math.round(metrics.averagePE * 100) / 100);
      setSectorPB(Math.round(metrics.averagePB * 100) / 100);
    }
    
    // Sort stocks by price in ascending order (lowest to highest)
    const sortedStocks = stocksData
      .filter(stock => stock && stock.currentPrice > 0)
      .sort((a, b) => a.currentPrice - b.currentPrice);
    
    setStockData(sortedStocks);
    setLoading(false);
  };

  useEffect(() => {
    // Load user's default sector preference if available
    if (userProfile?.preferences?.defaultSector) {
      setSelectedSector(userProfile.preferences.defaultSector);
    }
  }, [userProfile]);

  useEffect(() => {
    fetchStockData(selectedSector);
  }, [selectedSector]);

  const handleSectorChange = (sector) => {
    setSelectedSector(sector);
    setDropdownOpen(false);
  };

  const getUndervaluedStocks = () => {
    if (!sectorMetrics) return [];
    
    return sectorAnalysisHelpers.findUndervaluedStocks(stockData, sectorMetrics)
      .slice(0, 2); // Show top 2 opportunities
  };

  const generateAIReport = async (stock) => {
    try {
      setLoading(true);
      
      // TODO: Implement AI report generation
      // This would integrate with OpenAI/Claude API
      const reportData = {
        stockSymbol: stock.symbol,
        reportType: 'full_analysis',
        title: `Investment Analysis: ${stock.name} (${stock.symbol})`,
        summary: `Comprehensive analysis of ${stock.name} based on fundamental and technical indicators.`,
        recommendation: stock.valuation?.rating === 'Undervalued' ? 'Buy' : 'Hold',
        targetPrice: stock.currentPrice * 1.2, // Simple 20% target
        riskLevel: 'Medium',
        analysis: {
          fundamentalAnalysis: `Current P/E: ${stock.metrics?.peRatio || 'N/A'}, P/B: ${stock.metrics?.pbRatio || 'N/A'}`,
          technicalAnalysis: 'Technical analysis coming soon...',
          riskFactors: ['Market volatility', 'Sector-specific risks'],
          catalysts: ['Earnings growth', 'Market expansion']
        }
      };
      
      alert(
        `AI Report Generated for ${stock.name} (${stock.symbol})\n\n` +
        `Recommendation: ${reportData.recommendation}\n` +
        `Target Price: $${reportData.targetPrice.toFixed(2)}\n` +
        `Risk Level: ${reportData.riskLevel}\n\n` +
        `Current Price: $${stock.currentPrice}\n` +
        `P/E Ratio: ${stock.metrics?.peRatio || 'N/A'}\n` +
        `Valuation: ${stock.valuation?.rating || 'N/A'}\n\n` +
        `Full AI-powered reports coming soon!`
      );
      
      // TODO: Save report to Firestore
      // await reportService.saveReport(currentUser.uid, reportData);
      
    } catch (error) {
      console.error('Error generating AI report:', error);
      alert('Failed to generate AI report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="dashboard">
      {/* Dashboard Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
              >
                <rect
                  width="32"
                  height="32"
                  rx="8"
                  fill="#667eea"
                />
                <path
                  d="M8 24V12l4-4h8l4 4v12"
                  stroke="white"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M12 16h8M12 20h8"
                  stroke="white"
                  strokeWidth="2"
                />
              </svg>
              <span>Seedling 🌱</span>
            </div>
          </div>
          
          <div className="user-section">
            <span className="welcome-text">
              Welcome back, {userProfile?.displayName || currentUser?.displayName || 'User'}!
            </span>
            <button className="logout-btn" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        {/* Hero Section */}
        <section className="hero-section">
          <h1>Your Investment Dashboard</h1>
          <p>
            Analyze undervalued opportunities with advanced fundamental analysis and AI-powered insights
          </p>
        </section>

        <SectorDropdown
          selectedSector={selectedSector}
          sectors={SECTOR_STOCKS}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          onSectorChange={handleSectorChange}
        />

        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
          </div>
        )}
        
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Fetching real market data...</p>
          </div>
        ) : (
          <>
            <Chart
              stockData={stockData}
              sectorMean={sectorMean}
              sectorPE={sectorPE}
              sectorPB={sectorPB}
              selectedSector={selectedSector}
            />

            <OpportunityCards
              undervaluedStocks={getUndervaluedStocks()}
              onGenerateReport={generateAIReport}
            />

            <DataTable
              stockData={stockData}
              onAnalyze={generateAIReport}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;