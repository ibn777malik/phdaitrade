import React, { useContext } from 'react';
import Layout from '../components/Layout';
import TradeList from '../components/TradeList';
import { BotContext } from '../contexts/BotContext';

export default function Dashboard() {
  const { botStatus } = useContext(BotContext);

  return (
    <Layout>
      <div className="mb-4">
        <strong>Bot Status: </strong>
        <span className={botStatus === 'connected' ? 'text-green-600' : 'text-red-600'}>
          {botStatus}
        </span>
      </div>

      <TradeList />
    </Layout>
  );
}
