import React, { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

export const BotContext = createContext();

export const BotProvider = ({ children }) => {
  const [trades, setTrades] = useState([]);
  const [botStatus, setBotStatus] = useState('disconnected');
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    // Connect to the same port as the backend
    const socket = io('http://localhost:3000', {
      transports: ['websocket', 'polling'],
      timeout: 5000,
    });

    socket.on('connect', () => {
      setBotStatus('connected');
      console.log('✅ Connected to backend WebSocket');
      addNotification('Connected to trading bot', 'success');
    });
    
    socket.on('disconnect', (reason) => {
      setBotStatus('disconnected');
      console.log('❌ Disconnected from backend:', reason);
      addNotification('Disconnected from trading bot', 'error');
    });

    socket.on('tradeUpdate', (trade) => {
      console.log('📈 Trade update received:', trade);
      setTrades((prevTrades) => {
        const index = prevTrades.findIndex(t => t.id === trade.id);
        if (index !== -1) {
          const updated = [...prevTrades];
          updated[index] = trade;
          return updated;
        }
        return [...prevTrades, trade];
      });
      
      addNotification(`New trade: ${trade.side.toUpperCase()} ${trade.symbol}`, 'info');
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setBotStatus('error');
      addNotification('Connection error to trading bot', 'error');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const addNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10
  };

  return (
    <BotContext.Provider value={{ 
      trades, 
      botStatus, 
      notifications,
      addNotification 
    }}>
      {children}
    </BotContext.Provider>
  );
};