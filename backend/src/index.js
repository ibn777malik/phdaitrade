const http = require('http');
const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const { log } = require('./utils/logger');
const { startSocketServer, emitTradeUpdate } = require('./websocket/socketServer');
const { generateTradeSignal } = require('./strategies/aiStrategy');
const { executeTrade } = require('./controllers/tradeController');
const { router: authRouter } = require('./routes/auth'); 
const authRoutes = require('./routes/auth');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/auth', authRoutes);
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start WebSocket server
startSocketServer(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  log(`🚀 Backend server listening on port ${PORT}`);
  log(`💊 Health check: http://localhost:${PORT}/health`);
  log(`🔐 Auth API: http://localhost:${PORT}/api/auth/login`);
  
  // Log configuration status
  if (!config.metaApiToken) {
    log('⚠️ MetaApi not configured - running in demo mode', 'warn');
  }
  if (!config.telegramBotToken) {
    log('⚠️ Telegram not configured - notifications will be logged', 'warn');
  }
});

// Trading loop - runs every 2 minutes (increased interval for demo)
let tradeCount = 0;
setInterval(async () => {
  try {
    tradeCount++;
    log(`📊 Trading cycle #${tradeCount} starting...`);
    
    // Here you would fetch real market data to pass to your strategy
    const marketData = {
      timestamp: new Date(),
      prices: {
        EURUSD: 1.1234 + (Math.random() - 0.5) * 0.001,
        GBPUSD: 1.2567 + (Math.random() - 0.5) * 0.001,
        USDJPY: 110.45 + (Math.random() - 0.5) * 0.1
      }
    };

    const signal = generateTradeSignal(marketData);
    if (signal) {
      log(`📈 Generated signal: ${signal.side.toUpperCase()} ${signal.volume} ${signal.symbol}`);
      
      try {
        const order = await executeTrade(signal);
        
        // Create trade object for WebSocket emission
        const trade = {
          id: order.id || `trade_${Date.now()}`,
          symbol: signal.symbol,
          side: signal.side,
          volume: signal.volume,
          status: 'open',
          profit: (Math.random() - 0.5) * 20, // Random profit for demo
          openedAt: new Date(),
          stopLossPips: signal.stopLossPips,
          takeProfitPips: signal.takeProfitPips
        };
        
        // Emit trade update to connected clients
        emitTradeUpdate(trade);
        log(`✅ Trade executed and broadcasted`);
        
      } catch (tradeError) {
        log(`❌ Trade execution failed: ${tradeError.message}`, 'error');
      }
    } else {
      log(`⏸️ No trading signal generated this cycle`);
    }
  } catch (err) {
    log(`❌ Error in trading loop: ${err.message}`, 'error');
  }
}, 120 * 1000); // 2 minutes

// Graceful shutdown
process.on('SIGTERM', () => {
  log('📴 Shutting down server...');
  server.close(() => {
    log('✅ Server closed');
  });
});

process.on('SIGINT', () => {
  log('📴 Received SIGINT, shutting down gracefully');
  server.close(() => {
    log('✅ Server closed');
    process.exit(0);
  });
});