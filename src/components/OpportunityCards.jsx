const OpportunityCards = ({ undervaluedStocks, onGenerateReport }) => {
  // Helper function to safely format numbers
  const formatNumber = (value, decimals = 2) => {
    const num = parseFloat(value);
    return isNaN(num) ? '0.00' : num.toFixed(decimals);
  };

  if (undervaluedStocks.length === 0) {
    return (
      <section className="opportunities-section">
        <h2>Undervalued Opportunities</h2>
        <div className="no-opportunities">
          <p>No undervalued opportunities found in this sector at current prices.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="opportunities-section">
      <h2>Undervalued Opportunities</h2>
      <div className="opportunity-cards">
        {undervaluedStocks.map((stock, index) => (
          <div key={stock.symbol} className="opportunity-card">
            <div className="card-header">
              <div className="stock-info">
                <h3>{stock.symbol}</h3>
                <p>{stock.name}</p>
              </div>
              <div className="undervalued-badge">{stock.valuation?.rating || stock.rating || 'Undervalued'}</div>
            </div>
            <div className="metrics-grid">
              <div className="metric">
                <span className="metric-label">Price</span>
                <span className="metric-value">${formatNumber(stock.currentPrice || stock.price || 0, 2)}</span>
              </div>
              <div className="metric">
                <span className="metric-label">P/E Ratio</span>
                <span className="metric-value">{formatNumber(stock.metrics?.peRatio || stock.peRatio || 0, 1)}</span>
              </div>
              <div className="metric">
                <span className="metric-label">ROE</span>
                <span className="metric-value">{formatNumber(stock.metrics?.roe || stock.roe || 0, 1)}%</span>
              </div>
              <div className="metric">
                <span className="metric-label">Change</span>
                <span
                  className={`metric-value ${
                    parseFloat(stock.dayChangePercent || stock.change || 0) >= 0 ? 'positive' : 'negative'
                  }`}
                >
                  {formatNumber(stock.dayChangePercent || stock.change || 0, 2)}%
                </span>
              </div>
              {stock.valuation?.confidenceScore && (
                <div className="metric">
                  <span className="metric-label">Confidence</span>
                  <span className="metric-value">{formatNumber(stock.valuation.confidenceScore, 0)}%</span>
                </div>
              )}
            </div>
            <button
              className="ai-report-btn"
              onClick={() => onGenerateReport(stock)}
            >
              Generate AI Report
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OpportunityCards;