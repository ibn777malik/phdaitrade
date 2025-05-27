import React, { useContext, useState, useEffect } from 'react';
import { BotContext } from '../contexts/BotContext';

const AnimatedTradingStats = () => {
  const { trades } = useContext(BotContext);
  
  // Animation states
  const [animatedStats, setAnimatedStats] = useState({
    activeTrades: 0,
    totalTrades: 0,
    totalProfit: 0,
    winRate: 0,
    avgProfit: 0,
    bestTrade: 0,
    worstTrade: 0,
    dailyVolume: 0
  });
  
  // Calculate actual stats
  const stats = React.useMemo(() => {
    const activeTrades = trades.filter(t => t.status === 'open');
    const totalProfit = trades.reduce((sum, t) => sum + (t.profit || 0), 0);
    const winningTrades = trades.filter(t => (t.profit || 0) > 0);
    const winRate = trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0;
    
    const profits = trades.map(t => t.profit || 0);
    const bestTrade = profits.length > 0 ? Math.max(...profits) : 0;
    const worstTrade = profits.length > 0 ? Math.min(...profits) : 0;
    
    return {
      activeTrades: activeTrades.length,
      totalTrades: trades.length,
      totalProfit,
      winRate,
      avgProfit: trades.length > 0 ? totalProfit / trades.length : 0,
      bestTrade,
      worstTrade,
      dailyVolume: trades.length * 0.03 // Example calculation
    };
  }, [trades]);
  
  // Animate the stats from 0 to their actual values
  useEffect(() => {
    const duration = 1500; // Animation duration in ms
    const steps = 60; // Number of animation steps
    const interval = duration / steps;
    
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setAnimatedStats({
        activeTrades: Math.round(stats.activeTrades * progress),
        totalTrades: Math.round(stats.totalTrades * progress),
        totalProfit: stats.totalProfit * progress,
        winRate: stats.winRate * progress,
        avgProfit: stats.avgProfit * progress,
        bestTrade: stats.bestTrade * progress,
        worstTrade: stats.worstTrade * progress,
        dailyVolume: stats.dailyVolume * progress
      });
      
      if (step >= steps) {
        clearInterval(timer);
        setAnimatedStats(stats); // Ensure final values are exact
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [stats]);
  
  // Stat cards with beautiful animations
  const StatCard = ({ title, value, change, icon, iconBg, format = 'number', prefix = '', suffix = '' }) => {
    // Format the value based on type
    const formatValue = (val) => {
      if (format === 'currency') {
        return `${prefix}${Math.abs(val).toFixed(2)}${suffix}`;
      } else if (format === 'percent') {
        return `${prefix}${val.toFixed(1)}${suffix}`;
      } else {
        return `${prefix}${val}${suffix}`;
      }
    };
    
    // Determine text color based on positive/negative values
    const getValueColor = (val) => {
      if (format === 'currency' || format === 'percent') {
        return val >= 0 ? 'text-green-600' : 'text-red-600';
      }
      return 'text-gray-800';
    };
    
    return (
      <div className="bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:shadow-lg hover:scale-105">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center text-white`}>
            {icon}
          </div>
        </div>
        
        <div className="mb-2">
          <p className={`text-2xl font-bold ${getValueColor(value)}`}>
            {formatValue(value)}
          </p>
        </div>
        
        {change !== undefined && (
          <div className="flex items-center text-xs">
            <span className={`mr-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
            </span>
            <span className="text-gray-500">from last period</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fadeIn">
      <StatCard 
        title="Active Trades" 
        value={animatedStats.activeTrades} 
        change={5.2}
        icon="📈" 
        iconBg="bg-blue-500"
      />
      
      <StatCard 
        title="Total Profit" 
        value={animatedStats.totalProfit} 
        change={animatedStats.totalProfit >= 0 ? 12.5 : -8.3}
        icon="💰" 
        iconBg={animatedStats.totalProfit >= 0 ? "bg-green-500" : "bg-red-500"}
        format="currency"
        prefix="$"
      />
      
      <StatCard 
        title="Win Rate" 
        value={animatedStats.winRate} 
        change={2.1}
        icon="🎯" 
        iconBg="bg-purple-500"
        format="percent"
        suffix="%"
      />
      
      <StatCard 
        title="Total Trades" 
        value={animatedStats.totalTrades} 
        change={15.7}
        icon="📊" 
        iconBg="bg-indigo-500"
      />
      
      <StatCard 
        title="Average Profit" 
        value={animatedStats.avgProfit} 
        icon="⚖️" 
        iconBg={animatedStats.avgProfit >= 0 ? "bg-green-500" : "bg-red-500"}
        format="currency"
        prefix="$"
      />
      
      <StatCard 
        title="Best Trade" 
        value={animatedStats.bestTrade} 
        icon="🌟" 
        iconBg="bg-yellow-500"
        format="currency"
        prefix="$"
      />
      
      <StatCard 
        title="Worst Trade" 
        value={animatedStats.worstTrade} 
        icon="📉" 
        iconBg="bg-red-500"
        format="currency"
        prefix="$"
      />
      
      <StatCard 
        title="Daily Volume" 
        value={animatedStats.dailyVolume} 
        icon="🔄" 
        iconBg="bg-blue-400"
        format="currency"
        prefix="$"
        suffix="M"
      />
    </div>
  );
};

export default AnimatedTradingStats;