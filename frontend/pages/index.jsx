import React, { useContext } from 'react';
import Layout from '../components/Layout';
import TradeList from '../components/TradeList';
import BotStatus from '../components/BotStatus';
import RiskDashboard from '../components/RiskDashboard';
import NotificationPanel from '../components/NotificationPanel';
import { BotContext } from '../contexts/BotContext';

export default function Dashboard() {
  const { trades, botStatus } = useContext(BotContext);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Status Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <BotStatus />
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-blue-50 rounded">
              <div className="font-semibold text-blue-800">Active Trades</div>
              <div className="text-2xl font-bold text-blue-600">
                {trades.filter(t => t.status === 'open').length}
              </div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded">
              <div className="font-semibold text-green-800">Total Profit</div>
              <div className="text-2xl font-bold text-green-600">
                ${trades.reduce((sum, t) => sum + (t.profit || 0), 0).toFixed(2)}
              </div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded">
              <div className="font-semibold text-purple-800">Total Trades</div>
              <div className="text-2xl font-bold text-purple-600">
                {trades.length}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trades List - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow">
              <TradeList />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Risk Dashboard */}
            <div className="bg-white p-6 rounded-lg shadow">
              <RiskDashboard />
            </div>

            {/* Notifications */}
            <div className="bg-white p-6 rounded-lg shadow">
              <NotificationPanel />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}