import { useState, useEffect } from 'react';
import './App.css';

// Components
import Header from './components/Header';
import SectorDropdown from './components/SectorDropdown';
import Chart from './components/Chart';
import OpportunityCards from './components/OpportunityCards';
import DataTable from './components/DataTable';
import Footer from './components/Footer';

// Constants
import { SECTOR_STOCKS } from './constants/sectorData';

function App() {
  const [selectedSector, setSelectedSector] = useState('healthcare');
  const [stockData, setStockData] = useState([]);
  const [sectorMean, setSectorMean] = useState(0);
  const [sectorPE, setSectorPE] = useState(0);
  const [sectorPB, setSectorPB] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const generateMockMetrics = () => ({
    price: Math.floor(Math.random() * 400) + 50,
    peRatio: (Math.random() * 30 + 5).toFixed(2),
    pbRatio: (Math.random() * 5 + 0.5).toFixed(2),
    roe: (Math.random() * 25 + 5).toFixed(2),
    change: (Math.random() * 10 - 5).toFixed(2),
    rating: Math.random() > 0.3 ? 'Undervalued' : 'Fair Value',
  });

  const fetchStockData = async (sector) => {
    setLoading(true);
    const stocks = SECTOR_STOCKS[sector];

    const stockPrices = stocks.map((stock) => ({
      ...stock,
      ...generateMockMetrics(),
    }));

    const mean =
      stockPrices.reduce((sum, stock) => sum + stock.price, 0) /
      stockPrices.length;
    
    const avgPE =
      stockPrices.reduce((sum, stock) => sum + parseFloat(stock.peRatio), 0) /
      stockPrices.length;
    
    const avgPB =
      stockPrices.reduce((sum, stock) => sum + parseFloat(stock.pbRatio), 0) /
      stockPrices.length;

    // Sort stocks by price in ascending order (lowest to highest)
    const sortedStockPrices = stockPrices.sort((a, b) => a.price - b.price);

    setStockData(sortedStockPrices);
    setSectorMean(Math.round(mean * 100) / 100);
    setSectorPE(Math.round(avgPE * 100) / 100);
    setSectorPB(Math.round(avgPB * 100) / 100);
    setLoading(false);
  };

  useEffect(() => {
    fetchStockData(selectedSector);
  }, [selectedSector]);

  const handleSectorChange = (sector) => {
    setSelectedSector(sector);
    setDropdownOpen(false);
  };

  const getUndervaluedStocks = () => {
    return stockData
      .filter(
        (stock) =>
          stock.rating === 'Undervalued' && stock.price < sectorMean
      )
      .sort((a, b) => a.price - b.price)
      .slice(0, 2);
  };

  const generateAIReport = (stock) => {
    alert(
      `Generating AI report for ${stock.name} (${stock.symbol})...\n\nThis would open a detailed analysis including:\n- Technical indicators\n- Fundamental analysis\n- Risk assessment\n- Price targets`
    );
  };

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <h1>Market Mean Reversion Analysis</h1>
          <p>
            Identify undervalued opportunities with advanced sector
            analysis and AI-powered insights
          </p>
        </section>

        <SectorDropdown
          selectedSector={selectedSector}
          sectors={SECTOR_STOCKS}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          onSectorChange={handleSectorChange}
        />

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Analyzing market data...</p>
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

      <Footer />
    </div>
  );
}

export default App;