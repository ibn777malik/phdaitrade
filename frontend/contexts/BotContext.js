// frontend/contexts/BotContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';

export const BotContext = createContext();

export const BotProvider = ({ children }) => {
  const [trades, setTrades] = useState([
    // Example initial trades for demonstration
    {
      id: 'demo_1',
      symbol: 'EURUSD',
      side: 'buy',
      volume: 0.01,
      status: 'open',
      profit: 12.50,
      openedAt: new Date(Date.now() - 3600000), // 1 hour ago
      stopLossPips: 30,
      takeProfitPips: 60,
    },
    {
      id: 'demo_2',
      symbol: 'GBPUSD',
      side: 'sell',
      volume: 0.02,
      status: 'open',
      profit: -5.75,
      openedAt: new Date(Date.now() - 7200000), // 2 hours ago
      stopLossPips: 25,
      takeProfitPips: 50,
    },
    {
      id: 'demo_3',
      symbol: 'USDJPY',
      side: 'buy',
      volume: 0.01,
      status: 'closed',
      profit: 8.25,
      openedAt: new Date(Date.now() - 86400000), // 1 day ago
      closedAt: new Date(Date.now() - 43200000), // 12 hours ago
      stopLossPips: 35,
      takeProfitPips: 70,
    }
  ]);
  
  const [botStatus, setBotStatus] = useState('disconnected');
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  
  // Add a notification to the list
  const addNotification = useCallback((message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    
    setNotifications(prev => [notification, ...prev.slice(0, 19)]); // Keep last 20
    return notification.id;
  }, []);
  
  // Remove a notification by ID
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);
  
  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);
  
  // Handle trade updates
  const updateTrade = useCallback((updatedTrade) => {
    setTrades(prevTrades => {
      const index = prevTrades.findIndex(t => t.id === updatedTrade.id);
      
      if (index !== -1) {
        // Update existing trade
        const newTrades = [...prevTrades];
        newTrades[index] = { ...newTrades[index], ...updatedTrade };
        return newTrades;
      } else {
        // Add new trade
        return [...prevTrades, updatedTrade];
      }
    });
    
    // Add notification about trade update
    const action = updatedTrade.status === 'closed' ? 'closed' : 'updated';
    addNotification(`Trade ${action}: ${updatedTrade.side.toUpperCase()} ${updatedTrade.symbol}`, 'info');
  }, [addNotification]);
  
  // Close a trade
  const closeTrade = useCallback((tradeId) => {
    setTrades(prevTrades => {
      return prevTrades.map(trade => {
        if (trade.id === tradeId) {
          return {
            ...trade,
            status: 'closed',
            closedAt: new Date()
          };
        }
        return trade;
      });
    });
    
    // Add notification about trade closure
    addNotification(`Trade manually closed`, 'info');
    
    // In a real app, we would send a request to the backend to close the trade
    // if (socket && socket.connected) {
    //   socket.emit('closeTrade', { tradeId });
    // }
  }, [addNotification]);
  
  // Create a new demo trade
  const createDemoTrade = useCallback(() => {
    const symbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD'];
    const sides = ['buy', 'sell'];
    
    const newTrade = {
      id: `demo_${Date.now()}`,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      side: sides[Math.floor(Math.random() * sides.length)],
      volume: Math.round((Math.random() * 0.09 + 0.01) * 100) / 100,
      status: 'open',
      profit: 0,
      openedAt: new Date(),
      stopLossPips: Math.floor(Math.random() * 30) + 20,
      takeProfitPips: Math.floor(Math.random() * 50) + 40,
    };
    
    setTrades(prev => [...prev, newTrade]);
    addNotification(`New trade opened: ${newTrade.side.toUpperCase()} ${newTrade.symbol}`, 'success');
    
    // Simulate trade updates
    simulateTradeUpdates(newTrade.id);
    
    return newTrade;
  }, [addNotification]);
  
  // Simulate trade profit/loss updates
  const simulateTradeUpdates = useCallback((tradeId) => {
    let updateCount = 0;
    
    const interval = setInterval(() => {
      updateCount++;
      
      setTrades(prevTrades => {
        const index = prevTrades.findIndex(t => t.id === tradeId);
        
        if (index === -1) {
          clearInterval(interval);
          return prevTrades;
        }
        
        const trade = prevTrades[index];
        
        // Random profit change
        const profitChange = (Math.random() - 0.45) * 2;
        const newProfit = trade.profit + profitChange;
        
        // 10% chance to close trade after several updates
        const shouldClose = updateCount > 5 && Math.random() < 0.1;
        
        const updatedTrades = [...prevTrades];
        updatedTrades[index] = {
          ...trade,
          profit: newProfit,
          status: shouldClose ? 'closed' : trade.status,
          closedAt: shouldClose ? new Date() : trade.closedAt
        };
        
        // Add notification if trade is closed
        if (shouldClose) {
          clearInterval(interval);
          addNotification(
            `Trade closed: ${trade.side.toUpperCase()} ${trade.symbol} with ${newProfit > 0 ? 'profit' : 'loss'} $${Math.abs(newProfit).toFixed(2)}`,
            newProfit > 0 ? 'success' : 'error'
          );
        }
        
        return updatedTrades;
      });
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, [addNotification]);
  
  // Initialize socket connection
  useEffect(() => {
    if (!socket && !isConnecting) {
      setIsConnecting(true);
      
      // Simulate connection delay
      setTimeout(() => {
        // In a real app, this would be an actual socket connection
        // const socketInstance = io(process.env.NEXT_PUBLIC_WS_URL, {
        //   transports: ['websocket', 'polling'],
        //   timeout: 5000,
        // });
        
        // For demo purposes, we'll create a mock socket
        const mockSocket = {
          connected: true,
          on: () => {},
          emit: () => {},
          disconnect: () => {}
        };
        
        setSocket(mockSocket);
        setBotStatus('connected');
        setIsConnecting(false);
        
        addNotification('Connected to trading bot', 'success');
        
        // Simulate existing trades
        trades.forEach(trade => {
          if (trade.status === 'open') {
            simulateTradeUpdates(trade.id);
          }
        });
        
        // Simulate new trades appearing every so often
        const newTradeInterval = setInterval(() => {
          if (Math.random() < 0.3) { // 30% chance every interval
            createDemoTrade();
          }
        }, 45000); // Every 45 seconds
        
        return () => {
          clearInterval(newTradeInterval);
        };
      }, 2000);
    }
  }, [socket, isConnecting, addNotification, createDemoTrade, simulateTradeUpdates, trades]);
  
  // Value object to provide in context
  const value = {
    trades,
    botStatus,
    notifications,
    isConnecting,
    connectionError,
    addNotification,
    removeNotification,
    clearNotifications,
    updateTrade,
    closeTrade,
    createDemoTrade
  };

  return (
    <BotContext.Provider value={value}>
      {children}
    </BotContext.Provider>
  );
};