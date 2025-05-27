import React from 'react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">AI Trading Bot Dashboard</h1>
      </header>
      <main>{children}</main>
    </div>
  );
}
