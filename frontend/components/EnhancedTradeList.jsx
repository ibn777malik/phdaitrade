import React, { useContext, useState, useEffect } from 'react';
import { BotContext } from '../contexts/BotContext';

const EnhancedTradeList = () => {
  const { trades } = useContext(BotContext);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('openedAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [animateRows, setAnimateRows] = useState(false);
  
  // Trigger animation on mount
  useEffect(() => {
    setTimeout(() => setAnimateRows(true), 300);
  }, []);
  
  // Handle sort direction toggle
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  // Filter and sort trades
  const filteredTrades = React.useMemo(() => {
    let filtered = [...trades];
    
    // Apply filters
    if (filter !== 'all') {
      filtered = filtered.filter(trade => trade.status === filter);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'symbol':
          comparison = a.symbol.localeCompare(b.symbol);
          break;
        case 'side':
          comparison = a.side.localeCompare(b.side);
          break;
        case 'volume':
          comparison = (a.volume || 0) - (b.volume || 0);
          break;
        case 'profit':
          comparison = (a.profit || 0) - (b.profit || 0);
          break;
        case 'openedAt':
        default:
          comparison = new Date(a.openedAt || 0) - new Date(b.openedAt || 0);
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  }, [trades, filter, sortBy, sortDirection]);

  // Get status color for badge
  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get profit/loss color
  const getProfitColor = (profit) => {
    if (profit > 0) return 'text-green-600';
    if (profit < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  // Format time
  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Sort indicator
  const SortIndicator = ({ field }) => {
    if (sortBy !== field) return null;
    
    return (
      <span className="ml-1">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };
  
  // Trade detail view
  const TradeDetailView = ({ trade }) => {
    if (!trade) return null;
    
    return (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 animate-slideInUp">
        <div className="flex justify-between items-start mb-4">
          <h4 className="text-lg font-semibold text-gray-800">
            Trade Details: {trade.symbol}
          </h4>
          <button 
            onClick={() => setSelectedTrade(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white p-3 rounded border border-gray-200">
            <p className="text-xs text-gray-500">Side</p>
            <p className={`font-semibold ${trade.side === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
              {trade.side.toUpperCase()}
            </p>
          </div>
          
          <div className="bg-white p-3 rounded border border-gray-200">
            <p className="text-xs text-gray-500">Volume</p>
            <p className="font-semibold">{trade.volume}</p>
          </div>
          
          <div className="bg-white p-3 rounded border border-gray-200">
            <p className="text-xs text-gray-500">Status</p>
            <p className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(trade.status)}`}>
              {trade.status.toUpperCase()}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-3 rounded border border-gray-200">
            <p className="text-xs text-gray-500">Opened At</p>
            <p className="font-semibold">{formatDate(trade.openedAt)} {formatTime(trade.openedAt)}</p>
          </div>
          
          <div className="bg-white p-3 rounded border border-gray-200">
            <p className="text-xs text-gray-500">Closed At</p>
            <p className="font-semibold">
              {trade.closedAt ? `${formatDate(trade.closedAt)} ${formatTime(trade.closedAt)}` : 'Still Open'}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white p-3 rounded border border-gray-200">
            <p className="text-xs text-gray-500">Stop Loss (pips)</p>
            <p className="font-semibold">{trade.stopLossPips || 'N/A'}</p>
          </div>
          
          <div className="bg-white p-3 rounded border border-gray-200">
            <p className="text-xs text-gray-500">Take Profit (pips)</p>
            <p className="font-semibold">{trade.takeProfitPips || 'N/A'}</p>
          </div>
          
          <div className="bg-white p-3 rounded border border-gray-200">
            <p className="text-xs text-gray-500">Profit/Loss</p>
            <p className={`font-semibold ${getProfitColor(trade.profit)}`}>
              ${(trade.profit || 0).toFixed(2)}
            </p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors duration-200">
            Modify
          </button>
          {trade.status === 'open' && (
            <button className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors duration-200">
              Close Trade
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-3 sm:space-y-0">
          <h3 className="text-lg font-semibold text-gray-800">Trading Activity</h3>
          <div className="flex space-x-2">
            {['all', 'open', 'closed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                  filter === status 
                    ? 'bg-blue-500 text-white shadow-md' 
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
            onChange={(e) => handleSortChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="openedAt">Time</option>
            <option value="symbol">Symbol</option>
            <option value="side">Side</option>
            <option value="volume">Volume</option>
            <option value="profit">Profit</option>
          </select>
          
          <button
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            {sortDirection === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Selected Trade Detail View */}
      {selectedTrade && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <TradeDetailView trade={filteredTrades.find(t => t.id === selectedTrade)} />
        </div>
      )}

      <div className="overflow-x-auto">
        {filteredTrades.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="animate-bounce mb-4">📈</div>
            <p>No {filter !== 'all' ? filter : ''} trades found</p>
            <p className="text-xs mt-2 text-gray-400">Your trades will appear here when the bot executes them</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSortChange('symbol')}>
                  <div className="flex items-center">
                    Symbol
                    <SortIndicator field="symbol" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSortChange('side')}>
                  <div className="flex items-center">
                    Side
                    <SortIndicator field="side" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSortChange('volume')}>
                  <div className="flex items-center">
                    Volume
                    <SortIndicator field="volume" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSortChange('profit')}>
                  <div className="flex items-center">
                    Profit
                    <SortIndicator field="profit" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSortChange('openedAt')}>
                  <div className="flex items-center">
                    Time
                    <SortIndicator field="openedAt" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTrades.map((trade, index) => (
                <tr 
                  key={trade.id} 
                  className={`hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                    animateRows ? 'animate-slideInUp' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.05 + 0.1}s` }}
                  onClick={() => setSelectedTrade(trade.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">{trade.symbol}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      trade.side === 'buy' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      className="text-blue-600 hover:text-blue-800"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click
                        setSelectedTrade(trade.id);
                      }}
                    >
                      View
                    </button>
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