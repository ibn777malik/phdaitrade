// frontend/components/TradingStats.jsx
import React, { useContext } from 'react';
import { BotContext } from '../contexts/BotContext';
import StatCard from './StatCard';

const TradingStats = () => {
  const { trades } = useContext(BotContext);
  
  const stats = React.useMemo(() => {
    const activeTrades = trades.filter(t => t.status === 'open');
    const totalProfit = trades.reduce((sum, t) => sum + (t.profit || 0), 0);
    const winningTrades = trades.filter(t => (t.profit || 0) > 0);
    const winRate = trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0;
    
    return {
      activeTrades: activeTrades.length,
      totalTrades: trades.length,
      totalProfit,
      winRate,
      avgProfit: trades.length > 0 ? totalProfit / trades.length : 0,
    };
  }, [trades]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard 
        title="Active Trades" 
        value={stats.activeTrades} 
        icon="📈" 
        color="blue"
        change={5.2}
      />
      <StatCard 
        title="Total Profit" 
        value={`$${stats.totalProfit.toFixed(2)}`} 
        icon="💰" 
        color={stats.totalProfit >= 0 ? "green" : "red"}
        change={stats.totalProfit >= 0 ? 12.5 : -8.3}
      />
      <StatCard 
        title="Win Rate" 
        value={`${stats.winRate.toFixed(1)}%`} 
        icon="🎯" 
        color="purple"
        change={2.1}
      />
      <StatCard 
        title="Total Trades" 
        value={stats.totalTrades} 
        icon="📊" 
        color="indigo"
        change={15.7}
      />
    </div>
  );
};

export default TradingStats;