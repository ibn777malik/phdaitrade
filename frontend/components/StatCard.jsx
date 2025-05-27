// frontend/components/StatCard.jsx
import React from 'react';

const StatCard = ({ title, value, change, icon, color = "blue", isLoading = false }) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 border-${color}-500 transform hover:scale-105 transition-all duration-300 hover:shadow-xl`}>
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className={`text-2xl font-bold text-${color}-600 animate-fadeIn`}>{value}</p>
            {change !== undefined && (
              <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center mt-1`}>
                <span className="mr-1 animate-bounce">{change >= 0 ? '↗' : '↘'}</span>
                {Math.abs(change).toFixed(1)}%
              </p>
            )}
          </div>
          <div className={`text-3xl text-${color}-500 animate-pulse`}>{icon}</div>
        </div>
      )}
    </div>
  );
};

export default StatCard;