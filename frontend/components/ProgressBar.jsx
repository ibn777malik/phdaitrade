// frontend/components/ProgressBar.jsx
import React, { useState, useEffect } from 'react';

const ProgressBar = ({ label, value, max, color = "blue", animated = true }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setAnimatedValue(value), 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedValue(value);
    }
  }, [value, animated]);
  
  const percentage = Math.min((animatedValue / max) * 100, 100);
  
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
        <span>{label}</span>
        <span className="animate-fadeIn">{animatedValue.toFixed(1)}/{max}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r from-${color}-400 to-${color}-600 rounded-full transition-all duration-1000 ease-out relative`}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;