import React from 'react';

const DataTable = ({ stockData, onAnalyze }) => {
  // Helper function to safely format numbers
  const formatNumber = (value, decimals = 2) => {
    const num = parseFloat(value);
    return isNaN(num) ? '0.00' : num.toFixed(decimals);
  };

  return (
    <section className="breakdown-section">
      <h2>Complete Sector Breakdown</h2>
      <div className="table-container">
        <table className="breakdown-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Company</th>
              <th>Price</th>
              <th>Market Cap</th>
              <th>P/E Ratio</th>
              <th>P/B Ratio</th>
              <th>ROE</th>
              <th>Change</th>
              <th>Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {stockData.map((stock) => (
              <tr key={stock.symbol}>
                <td className="symbol-cell">{stock.symbol}</td>
                <td className="company-cell">{stock.name}</td>
                <td className="price-cell">${formatNumber(stock.currentPrice || stock.price || 0, 2)}</td>
                <td className="market-cap-cell">
                  {stock.marketCap ?
                    `$${formatNumber(stock.marketCap / 1e9, 1)}B` :
                    'N/A'
                  }
                </td>
                <td className="pe-cell">
                  {formatNumber(stock.metrics?.peRatio || stock.peRatio || 0, 1)}
                </td>
                <td className="pb-cell">
                  {formatNumber(stock.metrics?.pbRatio || stock.pbRatio || 0, 2)}
                </td>
                <td className="roe-cell">
                  {formatNumber(stock.metrics?.roe || stock.roe || 0, 1)}%
                </td>
                <td
                  className={`change-cell ${
                    parseFloat(stock.dayChangePercent || stock.change || 0) >= 0 ? 'positive' : 'negative'
                  }`}
                >
                  {formatNumber(stock.dayChangePercent || stock.change || 0, 2)}%
                </td>
                <td className="rating-cell">
                  <span
                    className={`rating-badge ${
                      (stock.valuation?.rating || stock.rating) === 'Undervalued' ? 'undervalued' : 
                      (stock.valuation?.rating || stock.rating) === 'Overvalued' ? 'overvalued' : 'fair'
                    }`}
                  >
                    {stock.valuation?.rating || stock.rating || 'Unknown'}
                  </span>
                </td>
                <td className="action-cell">
                  <button
                    className="analyze-btn"
                    onClick={() => onAnalyze(stock)}
                  >
                    Analyze
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default DataTable;