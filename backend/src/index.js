const http = require('http');
const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const { log } = require('./utils/logger');
const { startSocketServer, emitTradeUpdate } = require('./websocket/socketServer');
const { generateTradeSignal } = require('./strategies/aiStrategy');
const { executeTrade } = require('./controllers/tradeController');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// Routes - Import the auth routes correctly
let authRoutes;
try {
  authRoutes = require('./routes/auth.js'); // Note: using .js extension
  app.use('/api/auth', authRoutes);
  log('✅ Auth routes loaded successfully');
} catch (err) {
  log(`⚠️ Could not load auth routes: ${err.message}`, 'warn');
  log('📝 Creating basic auth endpoint...');
  
  // Fallback basic auth endpoint
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    // Demo credentials
    if (email === 'phdai@abdallamalik.com' && password === '1234567ASD') {
      res.json({
        token: 'demo-jwt-token-' + Date.now(),
        user: {
          id: 'demo-user-1',
          email: email,
          createdAt: new Date()
        }
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'AI Trading Bot Backend',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth/login',
      websocket: 'ws://localhost:3000'
    }
  });
});

// Start WebSocket server
startSocketServer(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  log(`🚀 Backend server listening on port ${PORT}`);
  log(`💊 Health check: http://localhost:${PORT}/health`);
  log(`🔐 Auth API: http://localhost:${PORT}/api/auth/login`);
  log(`🌐 WebSocket server started`);
  
  // Log configuration status
  if (!config.metaApiToken) {
    log('⚠️ MetaApi not configured - running in demo mode', 'warn');
  }
  if (!config.telegramBotToken) {
    log('⚠️ Telegram not configured - notifications will be logged', 'warn');
  }
  
  log('🎯 Demo Login: phdai@abdallamalik.com / 1234567ASD');
});

// Trading loop - runs every 2 minutes (increased interval for demo)
let tradeCount = 0;
const tradingInterval = setInterval(async () => {
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
const shutdown = () => {
  log('📴 Shutting down server...');
  clearInterval(tradingInterval);
  server.close(() => {
    log('✅ Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  log(`💥 Uncaught Exception: ${err.message}`, 'error');
  console.error(err.stack);
  shutdown();
});

process.on('unhandledRejection', (reason, promise) => {
  log(`💥 Unhandled Rejection at: ${promise}, reason: ${reason}`, 'error');
  shutdown();
});