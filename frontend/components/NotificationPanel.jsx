import React, { useContext } from 'react';
import { BotContext } from '../contexts/BotContext';

export default function NotificationPanel() {
  const { notifications } = useContext(BotContext);

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
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
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
        Live Notifications
      </h3>
      
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-gray-500 text-sm text-center py-4">
            No notifications yet
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-3 rounded border text-sm ${getNotificationColor(notification.type)}`}
            >
              <div className="flex justify-between items-start">
                <span className="flex-1">{notification.message}</span>
                <span className="text-xs opacity-70 ml-2">
                  {formatTime(notification.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      
      {notifications.length > 0 && (
        <div className="mt-3 text-xs text-gray-500 text-center">
          Showing last {Math.min(notifications.length, 10)} notifications
        </div>
      )}
    </div>
  );
}