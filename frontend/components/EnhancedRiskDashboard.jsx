import React, { useState, useEffect } from 'react';

const EnhancedRiskDashboard = () => {
  // Sample data - in a real app, this would come from the BotContext
  const [riskData, setRiskData] = useState({
    dailyLoss: 12.5,
    maxExposure: 500,
    drawdown: 7.8,
    riskScore: 65,
    volatility: 23.4,
    maxDrawdown: 15.2,
    sharpeRatio: 1.25,
    exposure: 350,
    marginLevel: 28.4
  });
  
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Trigger animation on mount
  useEffect(() => {
    setIsAnimating(true);
  }, []);

  // Get color based on value severity
  const getSeverityColor = (value, thresholds) => {
    const { low, medium, high } = thresholds;
    
    if (value <= low) return 'green';
    if (value <= medium) return 'yellow';
    return 'red';
  };
  
  // Animated circular progress
  const CircularProgress = ({ value, max, title, unit = '', size = 120, color = 'blue' }) => {
    const percentage = Math.min((value / max) * 100, 100);
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    const [offset, setOffset] = useState(circumference);
    
    useEffect(() => {
      if (isAnimating) {
        const timer = setTimeout(() => {
          setOffset(strokeDashoffset);
        }, 300);
        return () => clearTimeout(timer);
      }
    }, [isAnimating, strokeDashoffset]);

    return (
      <div className="flex flex-col items-center justify-center">
        <div className="relative" style={{ width: size, height: size }}>
          {/* Background circle */}
          <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth={strokeWidth}
            />
            
            {/* Foreground circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={`var(--color-${color}-500)`}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-xl font-bold text-${color}-600`}>
              {value}{unit}
            </span>
            <span className="text-xs text-gray-500">/ {max}{unit}</span>
          </div>
        </div>
        <p className="mt-2 text-center text-sm font-medium text-gray-700">{title}</p>
      </div>
    );
  };
  
  // Linear progress bar
  const ProgressBar = ({ label, value, max, color = "blue" }) => {
    const percentage = Math.min((value / max) * 100, 100);
    const [width, setWidth] = useState(0);
    
    useEffect(() => {
      if (isAnimating) {
        const timer = setTimeout(() => {
          setWidth(percentage);
        }, 500);
        return () => clearTimeout(timer);
      }
    }, [isAnimating, percentage]);

    return (
      <div className="mb-4">
        <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
          <span>{label}</span>
          <span>{value.toFixed(1)}/{max}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div 
            className={`h-full bg-${color}-500 rounded-full transition-all duration-1000 ease-out`}
            style={{ width: `${width}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
        Risk Management Dashboard
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6">
        <CircularProgress 
          value={riskData.riskScore} 
          max={100} 
          title="Risk Score" 
          color={getSeverityColor(riskData.riskScore, { low: 30, medium: 60, high: 100 })} 
        />
        
        <CircularProgress 
          value={riskData.drawdown} 
          max={25} 
          title="Drawdown" 
          unit="%" 
          color={getSeverityColor(riskData.drawdown, { low: 5, medium: 15, high: 25 })} 
        />
        
        <CircularProgress 
          value={riskData.volatility} 
          max={50} 
          title="Volatility" 
          unit="%" 
          color={getSeverityColor(riskData.volatility, { low: 10, medium: 30, high: 50 })} 
        />
      </div>
      
      <div className="space-y-4 mb-6">
        <ProgressBar 
          label="Max Drawdown" 
          value={riskData.maxDrawdown} 
          max={25} 
          color={getSeverityColor(riskData.maxDrawdown, { low: 5, medium: 15, high: 25 })} 
        />
        
        <ProgressBar 
          label="Exposure" 
          value={riskData.exposure} 
          max={1000} 
          color={getSeverityColor(riskData.exposure / 1000 * 100, { low: 30, medium: 70, high: 100 })} 
        />
        
        <ProgressBar 
          label="Margin Level" 
          value={riskData.marginLevel} 
          max={100} 
          color={getSeverityColor(100 - riskData.marginLevel, { low: 30, medium: 60, high: 100 })} 
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Sharpe Ratio</p>
          <p className="text-xl font-bold text-blue-600 animate-fadeIn">
            {riskData.sharpeRatio.toFixed(2)}
          </p>
          <div className="mt-1 flex items-center">
            <span className="text-xs bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded">
              {riskData.sharpeRatio > 1 ? 'Good' : 'Poor'}
            </span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Daily Loss</p>
          <p className="text-xl font-bold text-purple-600 animate-fadeIn">
            ${riskData.dailyLoss.toFixed(2)}
          </p>
          <div className="mt-1 flex items-center">
            <span className="text-xs bg-purple-200 text-purple-800 px-1.5 py-0.5 rounded">
              {riskData.dailyLoss < 20 ? 'Within Limits' : 'Exceeding'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
          Adjust Risk Parameters
        </button>
      </div>
    </div>
  );
};

export default EnhancedRiskDashboard;