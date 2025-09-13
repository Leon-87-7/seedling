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
                <td className="price-cell">${stock.price}</td>
                <td className="market-cap-cell">{stock.marketCap}</td>
                <td className="pe-cell">{stock.peRatio}</td>
                <td className="pb-cell">{stock.pbRatio}</td>
                <td className="roe-cell">{stock.roe}%</td>
                <td
                  className={`change-cell ${
                    parseFloat(stock.change) >= 0 ? 'positive' : 'negative'
                  }`}
                >
                  {stock.change}%
                </td>
                <td className="rating-cell">
                  <span
                    className={`rating-badge ${
                      stock.rating === 'Undervalued' ? 'undervalued' : 'fair'
                    }`}
                  >
                    {stock.rating}
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