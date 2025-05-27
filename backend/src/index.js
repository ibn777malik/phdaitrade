const http = require('http');
const express = require('express');
const config = require('./config/config');
const { log } = require('./utils/logger');
const { startSocketServer } = require('./websocket/socketServer');
const { generateTradeSignal } = require('./strategies/aiStrategy');
const { executeTrade } = require('./controllers/tradeController');

const app = express();
const server = http.createServer(app);

// Start WebSocket server
startSocketServer(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  log(`Backend server listening on port ${PORT}`);
});

// Example loop to generate and execute trades every minute (replace with real triggers)
setInterval(async () => {
  try {
    // Here you would fetch real market data to pass to your strategy
    const marketData = {}; // placeholder

    const signal = generateTradeSignal(marketData);
    if (signal) {
      const order = await executeTrade(signal);
      // Here you can emit order updates via WebSocket if needed
    }
  } catch (err) {
    log(`Error in trade loop: ${err.message}`, 'error');
  }
}, 60 * 1000);
