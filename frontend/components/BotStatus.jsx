import React, { useContext } from 'react';
import { BotContext } from '../contexts/BotContext';

export default function BotStatus() {
  const { botStatus } = useContext(BotContext);

  const statusColor = botStatus === 'connected' ? 'text-green-600' : 'text-red-600';

  return (
    <div className={`mb-4 font-semibold ${statusColor}`}>
      Bot Status: {botStatus.toUpperCase()}
    </div>
  );
}
