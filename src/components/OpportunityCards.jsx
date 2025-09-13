const OpportunityCards = ({ undervaluedStocks, onGenerateReport }) => {
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
              <div className="undervalued-badge">Undervalued</div>
            </div>
            <div className="metrics-grid">
              <div className="metric">
                <span className="metric-label">Price</span>
                <span className="metric-value">${stock.price}</span>
              </div>
              <div className="metric">
                <span className="metric-label">P/E Ratio</span>
                <span className="metric-value">{stock.peRatio}</span>
              </div>
              <div className="metric">
                <span className="metric-label">ROE</span>
                <span className="metric-value">{stock.roe}%</span>
              </div>
              <div className="metric">
                <span className="metric-label">Change</span>
                <span
                  className={`metric-value ${
                    parseFloat(stock.change) >= 0 ? 'positive' : 'negative'
                  }`}
                >
                  {stock.change}%
                </span>
              </div>
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