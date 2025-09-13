import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const CustomYAxisTick = ({ x, y, payload, sectorMean }) => {
  const isHighlighted = payload.value === Math.round(sectorMean);
  return (
    <g transform={`translate(${x},${y})`}>
      <text 
        x={0} 
        y={0} 
        dy={4} 
        textAnchor="end" 
        fill={isHighlighted ? '#ef4444' : '#6b7280'}
        fontSize={13}
        fontWeight={isHighlighted ? 600 : 400}
      >
        ${payload.value}
      </text>
    </g>
  );
};

const Chart = ({ 
  stockData, 
  sectorMean, 
  sectorPE, 
  sectorPB, 
  selectedSector 
}) => {
  const sectorDisplayName = selectedSector.charAt(0).toUpperCase() + selectedSector.slice(1);

  return (
    <section className="chart-section">
      <div className="chart-header">
        <h2 className="chart-title">{sectorDisplayName} Sector Overview</h2>
        <div className="chart-stats">
          <div className="chart-stat">
            <span className="chart-stat-label">Sector Mean</span>
            <span className="chart-stat-value">${sectorMean}</span>
          </div>
          <div className="chart-stat">
            <span className="chart-stat-label">Sector P/E</span>
            <span className="chart-stat-value">{sectorPE}</span>
          </div>
          <div className="chart-stat">
            <span className="chart-stat-label">Sector P/B</span>
            <span className="chart-stat-value">{sectorPB}</span>
          </div>
          <div className="chart-stat">
            <span className="chart-stat-label">Total Stocks</span>
            <span className="chart-stat-value">{stockData.length}</span>
          </div>
        </div>
      </div>
      
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={450}>
          <BarChart
            data={stockData}
            margin={{
              top: 40,
              right: 40,
              left: 40,
              bottom: 60,
            }}
          >
            <CartesianGrid 
              strokeDasharray="1 1" 
              stroke="#e5e7eb" 
              horizontal={true}
              vertical={false}
            />
            <XAxis 
              dataKey="symbol" 
              fontSize={13}
              fontWeight={500}
              color="#6b7280"
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              width={60}
              domain={['dataMin - 20', 'dataMax + 20']}
              ticks={(() => {
                const min = Math.min(...stockData.map(s => s.price)) - 20;
                const max = Math.max(...stockData.map(s => s.price)) + 20;
                const step = (max - min) / 5;
                const regularTicks = [...Array(6)].map((_, i) => Math.round(min + (step * i)));
                // Add sector mean to the ticks and sort them
                const allTicks = [...regularTicks, Math.round(sectorMean)];
                return [...new Set(allTicks)].sort((a, b) => a - b);
              })()}
              tick={(props) => <CustomYAxisTick {...props} sectorMean={sectorMean} />}
            />
            <Tooltip
              formatter={(value, name) => [`$${value}`, 'Stock Price']}
              labelFormatter={(label) => {
                const stock = stockData.find((s) => s.symbol === label);
                return stock ? `${stock.name} (${label})` : label;
              }}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                fontSize: '14px',
                fontWeight: '500'
              }}
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
            />
            <Legend 
              verticalAlign="bottom"
              height={36}
              iconType="rect"
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            />
            <ReferenceLine
              y={sectorMean}
              stroke="#ef4444"
              strokeDasharray="8 8"
              strokeWidth={2}
            />
            <Bar
              dataKey="price"
              name="Stock Price ($)"
              radius={[0, 0, 0, 0]}
              stroke="none"
            >
              {stockData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.price < sectorMean ? '#10b981' : '#3b82f6'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default Chart;