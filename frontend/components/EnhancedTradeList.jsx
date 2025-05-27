// frontend/components/EnhancedTradeList.jsx
import React, { useContext, useState } from 'react';
import { BotContext } from '../contexts/BotContext';

const EnhancedTradeList = () => {
  const { trades } = useContext(BotContext);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('openedAt');

  const filteredTrades = React.useMemo(() => {
    let filtered = trades;
    
    if (filter !== 'all') {
      filtered = trades.filter(trade => trade.status === filter);
    }
    
    return filtered.sort((a, b) => {
      if (sortBy === 'profit') return (b.profit || 0) - (a.profit || 0);
      if (sortBy === 'openedAt') return new Date(b.openedAt) - new Date(a.openedAt);
      return 0;
    });
  }, [trades, filter, sortBy]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProfitColor = (profit) => {
    if (profit > 0) return 'text-green-600';
    if (profit < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Active Trades</h3>
          <div className="flex space-x-2">
            {['all', 'open', 'closed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                  filter === status 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="openedAt">Time</option>
            <option value="profit">Profit</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        {filteredTrades.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="animate-bounce mb-4">📈</div>
            <p>No {filter !== 'all' ? filter : ''} trades found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Side</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTrades.map((trade, index) => (
                <tr 
                  key={trade.id} 
                  className="hover:bg-gray-50 transition-colors duration-200 animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">{trade.symbol}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      trade.side === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {trade.side === 'buy' ? '↗ BUY' : '↘ SELL'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {trade.volume}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(trade.status)}`}>
                      {trade.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getProfitColor(trade.profit)}`}>
                      ${(trade.profit || 0).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTime(trade.openedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EnhancedTradeList;