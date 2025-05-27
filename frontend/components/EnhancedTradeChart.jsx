import React, { useState, useEffect, useContext } from 'react';
import { BotContext } from '../contexts/BotContext';

const EnhancedTradeChart = () => {
  const { trades } = useContext(BotContext);
  const [timeFrame, setTimeFrame] = useState('1D');
  const [animate, setAnimate] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  
  // Calculate chart data
  useEffect(() => {
    let cumulativeProfit = 0;
    const data = trades.map((trade, index) => {
      cumulativeProfit += trade.profit || 0;
      return {
        x: index,
        y: cumulativeProfit,
        profit: trade.profit || 0,
        symbol: trade.symbol,
        side: trade.side,
        timestamp: trade.openedAt || new Date()
      };
    });
    
    setChartData(data);
    
    // Trigger animation after data is loaded
    if (data.length > 0) {
      setTimeout(() => setAnimate(true), 300);
    }
  }, [trades]);
  
  const maxProfit = Math.max(...chartData.map(d => d.y), 0.1);
  const minProfit = Math.min(...chartData.map(d => d.y), -0.1);
  const range = Math.max(maxProfit - minProfit, 1);
  const currentProfit = chartData[chartData.length - 1]?.y || 0;
  
  // Format date based on timeframe
  const formatDate = (date) => {
    if (!date) return '';
    
    switch(timeFrame) {
      case '1D':
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case '1W':
        return new Date(date).toLocaleDateString([], { weekday: 'short' });
      case '1M':
      case '3M':
        return new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric' });
      default:
        return new Date(date).toLocaleDateString();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Performance Chart</h3>
        <div className="flex space-x-2">
          {['1D', '1W', '1M', '3M'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeFrame(tf)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                timeFrame === tf 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      
      <div className="relative h-80 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 overflow-hidden">
        {chartData.length > 1 ? (
          <>
            <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={currentProfit >= 0 ? "#3B82F6" : "#EF4444"} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={currentProfit >= 0 ? "#3B82F6" : "#EF4444"} stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#3B82F6" floodOpacity="0.3"/>
                </filter>
              </defs>
              
              {/* Zero line */}
              <line 
                x1="0" 
                y1={190 - ((0 - minProfit) / range) * 170} 
                x2="400" 
                y2={190 - ((0 - minProfit) / range) * 170} 
                stroke="#CBD5E1" 
                strokeWidth="1" 
                strokeDasharray="4,4"
              />
              
              {/* Area under curve */}
              {animate && (
                <path
                  d={`M 10,${190 - ((chartData[0]?.y - minProfit) / range) * 170} ${chartData.map((d, i) => 
                    `L ${(i / (chartData.length - 1)) * 380 + 10},${190 - ((d.y - minProfit) / range) * 170}`
                  ).join(' ')} L ${380 + 10},${190 - ((chartData[0]?.y - minProfit) / range) * 170} L 10,${190 - ((chartData[0]?.y - minProfit) / range) * 170} Z`}
                  fill="url(#areaGradient)"
                  className="animate-fadeIn"
                />
              )}
              
              {/* Main line */}
              {animate && (
                <path
                  d={`M ${chartData.map((d, i) => 
                    `${(i / (chartData.length - 1)) * 380 + 10},${190 - ((d.y - minProfit) / range) * 170}`
                  ).join(' L ')}`}
                  stroke="url(#lineGradient)"
                  strokeWidth="3"
                  fill="none"
                  filter="url(#glow)"
                  className="animate-drawLine"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              
              {/* Data points */}
              {animate && chartData.map((d, i) => (
                <g key={i} className="animate-fadeIn" style={{ animationDelay: `${0.5 + i * 0.1}s` }}>
                  <circle
                    cx={(i / (chartData.length - 1)) * 380 + 10}
                    cy={190 - ((d.y - minProfit) / range) * 170}
                    r={hoveredPoint === i ? "6" : "4"}
                    fill={d.profit >= 0 ? "#3B82F6" : "#EF4444"}
                    stroke="white"
                    strokeWidth="1"
                    filter="url(#shadow)"
                    className="transition-all duration-200"
                    onMouseEnter={() => setHoveredPoint(i)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                </g>
              ))}
              
              {/* Tooltip */}
              {hoveredPoint !== null && (
                <g className="animate-fadeIn">
                  <rect 
                    x={(hoveredPoint / (chartData.length - 1)) * 380 + 10 - 50}
                    y={190 - ((chartData[hoveredPoint].y - minProfit) / range) * 170 - 60}
                    width="100"
                    height="50"
                    rx="4"
                    fill="rgba(255, 255, 255, 0.95)"
                    stroke="#E2E8F0"
                    strokeWidth="1"
                  />
                  <text 
                    x={(hoveredPoint / (chartData.length - 1)) * 380 + 10}
                    y={190 - ((chartData[hoveredPoint].y - minProfit) / range) * 170 - 40}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="bold"
                    fill="#1E293B"
                  >
                    {chartData[hoveredPoint].symbol} ({chartData[hoveredPoint].side.toUpperCase()})
                  </text>
                  <text 
                    x={(hoveredPoint / (chartData.length - 1)) * 380 + 10}
                    y={190 - ((chartData[hoveredPoint].y - minProfit) / range) * 170 - 25}
                    textAnchor="middle"
                    fontSize="10"
                    fill={chartData[hoveredPoint].profit >= 0 ? "#10B981" : "#EF4444"}
                  >
                    {chartData[hoveredPoint].profit >= 0 ? "+" : ""}{chartData[hoveredPoint].profit.toFixed(2)}
                  </text>
                  <text 
                    x={(hoveredPoint / (chartData.length - 1)) * 380 + 10}
                    y={190 - ((chartData[hoveredPoint].y - minProfit) / range) * 170 - 10}
                    textAnchor="middle"
                    fontSize="9"
                    fill="#64748B"
                  >
                    {formatDate(chartData[hoveredPoint].timestamp)}
                  </text>
                </g>
              )}
            </svg>
            
            {/* X-axis labels */}
            <div className="flex justify-between px-2 text-xs text-gray-500 mt-1">
              {chartData.length > 5 && [0, Math.floor(chartData.length / 2), chartData.length - 1].map((index) => (
                <div key={index} className="text-center" style={{
                  position: 'absolute',
                  left: `${(index / (chartData.length - 1)) * 100}%`,
                  transform: 'translateX(-50%)'
                }}>
                  {formatDate(chartData[index]?.timestamp)}
                </div>
              ))}
            </div>
            
            {/* Stats */}
            <div className="absolute bottom-2 left-4 bg-white bg-opacity-80 p-2 rounded-lg shadow-sm">
              <div className="text-sm text-gray-600 flex items-center">
                <span className="mr-1">Total P&L:</span>
                <span className={`font-bold ${currentProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${currentProfit.toFixed(2)}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p>Waiting for trade data...</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Chart Legend */}
      {chartData.length > 1 && (
        <div className="flex justify-center mt-4">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Profit</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Loss</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-0.5 bg-gray-300 rounded-full mr-2"></div>
              <span className="text-gray-600">Baseline</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EnhancedTradeChart;