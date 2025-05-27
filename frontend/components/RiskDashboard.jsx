import React from 'react';

export default function RiskDashboard() {
  // Placeholder data for now
  const dailyLoss = 12.5; // Example values, replace with real data
  const maxExposure = 500;
  const drawdown = 7.8;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Risk Overview</h3>
      <ul>
        <li>Daily Loss: ${dailyLoss.toFixed(2)}</li>
        <li>Max Exposure: ${maxExposure}</li>
        <li>Drawdown: {drawdown}%</li>
      </ul>
    </div>
  );
}
