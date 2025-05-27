// frontend/components/PerformanceChart.jsx
import React, { useContext, useState } from 'react';
import { BotContext } from '../contexts/BotContext';

const PerformanceChart = () => {
  const { trades } = useContext(BotContext);
  const [timeFrame, setTimeFrame] = useState('1D');
  
  const chartData = React.useMemo(() => {
    let cumulativeProfit = 0;
    return trades.map((trade, index) => {
      cumulativeProfit += trade.profit || 0;
      return {
        x: index,
        y: cumulativeProfit,
        profit: trade.profit || 0
      };
    });
  }, [trades]);
  
  const maxProfit = Math.max(...chartData.map(d => d.y), 0);
  const minProfit = Math.min(...chartData.map(d => d.y), 0);
  const range = maxProfit - minProfit || 1;
  const currentProfit = chartData[chartData.length - 1]?.y || 0;
  
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
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      
      <div className="relative h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-4 overflow-hidden">
        {chartData.length > 1 ? (
          <svg className="w-full h-full" viewBox="0 0 400 200">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.1} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Area under curve */}
            <path
              d={`M 10,190 L ${chartData.map((d, i) => 
                `${(i / (chartData.length - 1)) * 380 + 10},${190 - ((d.y - minProfit) / range) * 170}`
              ).join(' L ')} L ${380 + 10},190 Z`}
              fill="url(#gradient)"
              className="animate-fadeIn"
            />
            
            {/* Main line */}
            <path
              d={`M ${chartData.map((d, i) => 
                `${(i / (chartData.length - 1)) * 380 + 10},${190 - ((d.y - minProfit) / range) * 170}`
              ).join(' L ')}`}
              stroke="#3B82F6"
              strokeWidth="3"
              fill="none"
              filter="url(#glow)"
              className="animate-drawLine"
            />
            
            {/* Data points */}
            {chartData.map((d, i) => (
              <circle
                key={i}
                cx={(i / (chartData.length - 1)) * 380 + 10}
                cy={190 - ((d.y - minProfit) / range) * 170}
                r="4"
                fill="#3B82F6"
                className="hover:r-6 transition-all duration-200 animate-pulse"
              />
            ))}
          </svg>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p>Waiting for trade data...</p>
            </div>
          </div>
        )}
        
        <div className="absolute bottom-2 left-4 text-sm text-gray-600">
          Total P&L: <span className={`font-bold ${currentProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${currentProfit.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;