import React, { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

export const BotContext = createContext();

export const BotProvider = ({ children }) => {
  const [trades, setTrades] = useState([]);
  const [botStatus, setBotStatus] = useState('disconnected');
  
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WS_URL);

    socket.on('connect', () => setBotStatus('connected'));
    socket.on('disconnect', () => setBotStatus('disconnected'));

    socket.on('tradeUpdate', (trade) => {
      setTrades((prevTrades) => {
        const index = prevTrades.findIndex(t => t.id === trade.id);
        if (index !== -1) {
          const updated = [...prevTrades];
          updated[index] = trade;
          return updated;
        }
        return [...prevTrades, trade];
      });
    });

    return () => socket.disconnect();
  }, []);

  return (
    <BotContext.Provider value={{ trades, botStatus }}>
      {children}
    </BotContext.Provider>
  );
};
