import React, { useState, useEffect, useContext } from 'react';
import { BotContext } from '../contexts/BotContext';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import EnhancedBotStatus from '../components/EnhancedBotStatus';
import EnhancedTradeList from '../components/EnhancedTradeList';
import EnhancedTradeChart from '../components/EnhancedTradeChart';
import EnhancedRiskDashboard from '../components/EnhancedRiskDashboard';
import LiveNotifications from '../components/LiveNotifications';
import AnimatedTradingStats from '../components/AnimatedTradingStats';

export default function Dashboard() {
  const { trades, botStatus, notifications, addNotification } = useContext(BotContext);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [dashboardView, setDashboardView] = useState('overview'); // overview, trades, risk
  
  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Handle welcome animation
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);
  
  // Demo welcome notification
  useEffect(() => {
    if (!showWelcome && !isLoading) {
      setTimeout(() => {
        addNotification(`Welcome back, ${user?.email?.split('@')[0] || 'Trader'}!`, 'success');
        
        if (trades.filter(t => t.status === 'open').length > 0) {
          setTimeout(() => {
            addNotification(`You have ${trades.filter(t => t.status === 'open').length} active trades running`, 'info');
          }, 3000);
        }
      }, 1000);
    }
  }, [showWelcome, isLoading, addNotification, user, trades]);

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
              <div className="w-20 h-20 border-4 border-blue-600 rounded-full absolute top-0 left-0 animate-spin border-t-transparent"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Trading Bot</h2>
          <p className="text-gray-600">Connecting to secure server...</p>
        </div>
      </div>
    );
  }

  // Welcome screen
  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md animate-fadeIn">
          <div className="mb-6 text-5xl">👋</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome back, {user?.email?.split('@')[0] || 'Trader'}</h2>
          <p className="text-gray-600 mb-6">Your AI trading assistant is online and ready</p>
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
          </div>
        </div>
      </div>
    );
  }

  // View selector for dashboard
  const ViewSelector = () => (
    <div className="bg-white rounded-xl shadow-md p-3 mb-6 flex justify-center animate-fadeIn">
      <div className="inline-flex rounded-md shadow-sm" role="group">
        <button
          type="button"
          onClick={() => setDashboardView('overview')}
          className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
            dashboardView === 'overview' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          } border border-gray-200 transition-colors duration-200`}
        >
          Overview
        </button>
        <button
          type="button"
          onClick={() => setDashboardView('trades')}
          className={`px-4 py-2 text-sm font-medium ${
            dashboardView === 'trades' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          } border-t border-b border-gray-200 transition-colors duration-200`}
        >
          Active Trades
        </button>
        <button
          type="button"
          onClick={() => setDashboardView('risk')}
          className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
            dashboardView === 'risk' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          } border border-gray-200 transition-colors duration-200`}
        >
          Risk Analysis
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* View Selector */}
        <ViewSelector />
        
        {/* Bot Status */}
        <div className="mb-6 animate-slideInUp" style={{ animationDelay: "0.1s" }}>
          <EnhancedBotStatus />
        </div>
        
        {/* Trading Stats */}
        {(dashboardView === 'overview' || dashboardView === 'trades') && (
          <div className="animate-slideInUp" style={{ animationDelay: "0.2s" }}>
            <AnimatedTradingStats />
          </div>
        )}
        
        {/* Main Content */}
        {dashboardView === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Performance Chart - Takes 2 columns */}
            <div className="lg:col-span-2 animate-slideInUp" style={{ animationDelay: "0.3s" }}>
              <EnhancedTradeChart />
            </div>
            
            {/* Risk Metrics */}
            <div className="animate-slideInUp" style={{ animationDelay: "0.4s" }}>
              <EnhancedRiskDashboard />
            </div>
          </div>
        )}
        
        {dashboardView === 'risk' && (
          <div className="animate-slideInUp" style={{ animationDelay: "0.3s" }}>
            <div className="grid grid-cols-1 gap-6 mb-6">
              <EnhancedRiskDashboard />
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trade List - Takes 2 columns on overview and full width on trades view */}
          <div className={`${
            dashboardView === 'trades' ? 'lg:col-span-3' : 'lg:col-span-2'
          } animate-slideInUp`} style={{ animationDelay: "0.5s" }}>
            <EnhancedTradeList />
          </div>
          
          {/* Notifications - Hidden in trades view */}
          {dashboardView !== 'trades' && (
            <div className="animate-slideInUp" style={{ animationDelay: "0.6s" }}>
              <LiveNotifications />
            </div>
          )}
        </div>
      </main>
      
      {/* Bot Status Float */}
      <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center animate-fadeIn ${botStatus === 'connected' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
        <div className={`w-3 h-3 rounded-full mr-2 ${botStatus === 'connected' ? 'bg-white' : 'bg-white'} animate-ping`}></div>
        <span className="font-medium">AI Bot {botStatus === 'connected' ? 'Online' : 'Offline'}</span>
      </div>
    </div>
  );
}