import React, { useContext, useState, useEffect } from 'react';
import { BotContext } from '../contexts/BotContext';

const EnhancedBotStatus = () => {
  const { botStatus, trades } = useContext(BotContext);
  const [showDetails, setShowDetails] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(false);
  
  // Demo metrics - in a real app, these would come from the backend
  const metrics = {
    uptime: '3d 7h 22m',
    tradesExecuted: trades.length,
    lastActivity: new Date().toISOString(),
    cpuUsage: 12,
    memoryUsage: 237,
    tradesPerHour: 4.2,
    successRate: 96.7,
    apiLatency: 124,
    pingMs: 32,
    activeTrades: trades.filter(t => t.status === 'open').length
  };
  
  // Status dot pulse animation effect
  useEffect(() => {
    // Start pulse animation
    if (botStatus === 'connected') {
      const interval = setInterval(() => {
        setPulseAnimation(true);
        setTimeout(() => setPulseAnimation(false), 1000);
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [botStatus]);
  
  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'green';
      case 'connecting': return 'yellow';
      case 'disconnected': return 'red';
      case 'error': return 'red';
      default: return 'gray';
    }
  };
  
  // Status label mapping
  const getStatusLabel = (status) => {
    switch (status) {
      case 'connected': return 'Online';
      case 'connecting': return 'Connecting...';
      case 'disconnected': return 'Offline';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };
  
  // Formatted timestamp
  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  // System health indicators
  const HealthIndicator = ({ value, label, max, unit, good = 'low' }) => {
    // Determine if the value indicates good health
    const getHealthStatus = () => {
      const ratio = value / max;
      if (good === 'low') {
        if (ratio < 0.3) return 'good';
        if (ratio < 0.7) return 'warning';
        return 'critical';
      } else {
        if (ratio > 0.7) return 'good';
        if (ratio > 0.3) return 'warning';
        return 'critical';
      }
    };
    
    const status = getHealthStatus();
    const statusColor = {
      good: 'bg-green-500',
      warning: 'bg-yellow-500',
      critical: 'bg-red-500'
    };
    
    return (
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">{label}</span>
        <div className="flex items-center">
          <span className="text-sm font-medium">
            {value}{unit}
          </span>
          <div className={`w-2 h-2 rounded-full ml-2 ${statusColor[status]}`}></div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Main Status Header */}
      <div className={`p-6 bg-gradient-to-r ${
        botStatus === 'connected' 
          ? 'from-green-50 to-green-100 border-b border-green-200' 
          : 'from-red-50 to-red-100 border-b border-red-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative">
              <div className={`w-4 h-4 rounded-full bg-${getStatusColor(botStatus)}-500`}></div>
              {pulseAnimation && (
                <div className={`absolute top-0 left-0 w-4 h-4 rounded-full bg-${getStatusColor(botStatus)}-400 animate-ping`}></div>
              )}
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-800">
              AI Trading Bot Status: <span className={`text-${getStatusColor(botStatus)}-600`}>
                {getStatusLabel(botStatus)}
              </span>
            </h3>
          </div>
          
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
              showDetails 
                ? 'bg-gray-200 text-gray-700' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
      </div>
      
      {/* Detailed Metrics */}
      {showDetails && (
        <div className="p-6 animate-slideInUp">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* System Status */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">System Status</h4>
              <div className="space-y-2">
                <HealthIndicator value={metrics.cpuUsage} label="CPU Usage" max={100} unit="%" good="low" />
                <HealthIndicator value={metrics.memoryUsage} label="Memory" max={512} unit="MB" good="low" />
                <HealthIndicator value={metrics.apiLatency} label="API Latency" max={500} unit="ms" good="low" />
                <HealthIndicator value={metrics.pingMs} label="Ping" max={100} unit="ms" good="low" />
              </div>
            </div>
            
            {/* Trading Stats */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Trading Activity</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Trades</span>
                  <span className="text-sm font-medium">{metrics.activeTrades}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Trades</span>
                  <span className="text-sm font-medium">{metrics.tradesExecuted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Trades/Hour</span>
                  <span className="text-sm font-medium">{metrics.tradesPerHour}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="text-sm font-medium">{metrics.successRate}%</span>
                </div>
              </div>
            </div>
            
            {/* System Info */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">System Information</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Uptime</span>
                  <span className="text-sm font-medium">{metrics.uptime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Activity</span>
                  <span className="text-sm font-medium">{formatTime(metrics.lastActivity)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Version</span>
                  <span className="text-sm font-medium">v1.2.4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Broker Status</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium">Connected</span>
                    <div className="w-2 h-2 rounded-full ml-2 bg-green-500"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between">
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors duration-200">
                Restart Bot
              </button>
              <button className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors duration-200">
                Pause Trading
              </button>
              <button className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors duration-200">
                Emergency Stop
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Quick Status Summary (when details are hidden) */}
      {!showDetails && (
        <div className="grid grid-cols-1 md:grid-cols-4 divide-x divide-gray-200">
          <div className="p-4 text-center">
            <p className="text-sm text-gray-500">Active Trades</p>
            <p className="text-xl font-bold text-blue-600">{metrics.activeTrades}</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-sm text-gray-500">Success Rate</p>
            <p className="text-xl font-bold text-green-600">{metrics.successRate}%</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-sm text-gray-500">Last Activity</p>
            <p className="text-xl font-bold text-gray-800">{formatTime(metrics.lastActivity)}</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-sm text-gray-500">System Health</p>
            <p className="text-xl font-bold text-green-600">Good</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedBotStatus;