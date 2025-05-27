// frontend/components/Header.jsx
import React, { useContext } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BotContext } from '../contexts/BotContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { botStatus } = useContext(BotContext);

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100';
      case 'disconnected': return 'text-red-600 bg-red-100';
      case 'error': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Trading Bot
              </h1>
            </div>
            
            {/* Bot Status */}
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(botStatus)} animate-pulse`}>
              <span className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${botStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'} animate-ping`}></div>
                {botStatus.toUpperCase()}
              </span>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-900">Welcome back!</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>

            {/* User Avatar */}
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold animate-pulse">
              {user?.email?.charAt(0).toUpperCase()}
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;