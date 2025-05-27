import React, { useState, useEffect } from 'react';

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);

  // This could be wired up to WebSocket events in BotContext later

  useEffect(() => {
    // Example: fetch past notifications or subscribe to new ones
  }, []);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Notifications</h3>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul>
          {notifications.map((note, idx) => (
            <li key={idx} className="mb-1 border-b border-gray-200 pb-1">{note.message}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
