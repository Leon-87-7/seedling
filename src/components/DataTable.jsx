const DataTable = ({ stockData, onAnalyze }) => {
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
                <td className="price-cell">${(stock.currentPrice || stock.price || 0).toFixed(2)}</td>
                <td className="market-cap-cell">
                  {stock.marketCap ? 
                    `$${(stock.marketCap / 1e9).toFixed(1)}B` : 
                    'N/A'
                  }
                </td>
                <td className="pe-cell">
                  {(stock.metrics?.peRatio || stock.peRatio || 0).toFixed(1)}
                </td>
                <td className="pb-cell">
                  {(stock.metrics?.pbRatio || stock.pbRatio || 0).toFixed(2)}
                </td>
                <td className="roe-cell">
                  {(stock.metrics?.roe || stock.roe || 0).toFixed(1)}%
                </td>
                <td
                  className={`change-cell ${
                    parseFloat(stock.dayChangePercent || stock.change || 0) >= 0 ? 'positive' : 'negative'
                  }`}
                >
                  {(stock.dayChangePercent || stock.change || 0).toFixed(2)}%
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