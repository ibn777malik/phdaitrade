import React, { useContext } from 'react';
import { BotContext } from '../contexts/BotContext';

export default function TradeList() {
  const { trades } = useContext(BotContext);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Active Trades</h2>
      {trades.length === 0 ? (
        <p>No active trades</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Symbol</th>
              <th className="border border-gray-300 p-2">Side</th>
              <th className="border border-gray-300 p-2">Volume</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Profit</th>
            </tr>
          </thead>
          <tbody>
            {trades.map(trade => (
              <tr key={trade.id}>
                <td className="border border-gray-300 p-2">{trade.symbol}</td>
                <td className="border border-gray-300 p-2">{trade.side}</td>
                <td className="border border-gray-300 p-2">{trade.volume}</td>
                <td className="border border-gray-300 p-2">{trade.status}</td>
                <td className="border border-gray-300 p-2">{trade.profit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
