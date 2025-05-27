// frontend/components/RiskMetrics.jsx
import React, { useContext } from 'react';
import { BotContext } from '../contexts/BotContext';
import ProgressBar from './ProgressBar';

const RiskMetrics = () => {
  const { trades } = useContext(BotContext);
  
  const riskMetrics = React.useMemo(() => {
    const activeTrades = trades.filter(t => t.status === 'open');
    const totalExposure = activeTrades.reduce((sum, t) => sum + (t.volume * 100000), 0); // Assuming standard lot
    const maxDrawdown = 15.5; // Example value
    const dailyVaR = 8.2; // Value at Risk
    const sharpeRatio = 1.45;
    
    return {
      totalExposure,
      maxDrawdown,
      dailyVaR,
      sharpeRatio,
      riskScore: Math.min((totalExposure / 50000) * 100, 100), // Risk score out of 100
    };
  }, [trades]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
        <span className="w-3 h-3 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
        Risk Metrics
      </h3>
      
      <div className="space-y-4">
        <ProgressBar 
          label="Risk Exposure" 
          value={riskMetrics.riskScore} 
          max={100} 
          color={riskMetrics.riskScore > 70 ? "red" : riskMetrics.riskScore > 40 ? "yellow" : "green"} 
        />
        
        <ProgressBar 
          label="Drawdown" 
          value={riskMetrics.maxDrawdown} 
          max={25} 
          color="orange" 
        />
        
        <ProgressBar 
          label="Daily VaR" 
          value={riskMetrics.dailyVaR} 
          max={15} 
          color="purple" 
        />
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Exposure</p>
            <p className="text-xl font-bold text-blue-600">
              ${riskMetrics.totalExposure.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Sharpe Ratio</p>
            <p className="text-xl font-bold text-green-600">
              {riskMetrics.sharpeRatio.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskMetrics;