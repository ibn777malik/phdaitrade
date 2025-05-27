import React, { useContext, useState, useEffect } from 'react';
import { BotContext } from '../contexts/BotContext';

export default function LiveNotifications() {
  const { notifications } = useContext(BotContext);
  const [showExpandedView, setShowExpandedView] = useState(false);

  // Animation for new notifications
  const [animatedNotifications, setAnimatedNotifications] = useState([]);
  
  useEffect(() => {
    if (notifications.length > 0) {
      // Add new notifications with animation state
      const latestNotification = notifications[0];
      setAnimatedNotifications(prev => {
        // Check if notification already exists
        if (prev.findIndex(n => n.id === latestNotification.id) === -1) {
          return [
            { ...latestNotification, isNew: true },
            ...prev.slice(0, 9).map(n => ({ ...n, isNew: false }))
          ];
        }
        return prev;
      });
    }
  }, [notifications]);
  
  // Reset the "new" animation after displaying
  useEffect(() => {
    if (animatedNotifications.length > 0 && animatedNotifications[0].isNew) {
      const timer = setTimeout(() => {
        setAnimatedNotifications(prev => 
          prev.map((notification, index) => 
            index === 0 ? { ...notification, isNew: false } : notification
          )
        );
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [animatedNotifications]);

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return 'border-green-200 bg-gradient-to-r from-green-50 to-green-100';
      case 'error': return 'border-red-200 bg-gradient-to-r from-red-50 to-red-100';
      case 'info': return 'border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100';
      default: return 'border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '📝';
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="relative">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            {notifications.length > 0 && (
              <span className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full animate-ping"></span>
            )}
          </span>
          Live Notifications
        </h3>
        
        <button 
          onClick={() => setShowExpandedView(!showExpandedView)}
          className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
        >
          {showExpandedView ? 'Collapse' : 'Expand'}
        </button>
      </div>
      
      <div className={`space-y-2 overflow-y-auto transition-all duration-300 ${showExpandedView ? 'max-h-96' : 'max-h-64'}`}>
        {animatedNotifications.length === 0 ? (
          <div className="text-gray-500 text-sm text-center py-8 border border-dashed border-gray-200 rounded-lg">
            <div className="animate-bounce mb-2">📬</div>
            <p>No notifications yet</p>
            <p className="text-xs mt-1 text-gray-400">System events will appear here</p>
          </div>
        ) : (
          animatedNotifications.map((notification, index) => (
            <div 
              key={notification.id} 
              className={`p-3 rounded-lg border ${getNotificationColor(notification.type)} ${notification.isNew ? 'animate-slideInRight' : 'transition-all duration-300'} transform hover:scale-[1.01] hover:shadow-sm`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start">
                <div className="mr-2 text-lg mt-0.5">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{notification.message}</p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">{formatTime(notification.timestamp)}</p>
                    {notification.isNew && (
                      <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full animate-pulse">
                        New
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {notifications.length > 0 && (
        <div className="mt-4 pt-2 border-t border-gray-100 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Showing {Math.min(notifications.length, 10)} of {notifications.length} notifications
          </span>
          
          <button 
            className="text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors duration-200"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}