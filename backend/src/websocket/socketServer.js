const { Server } = require('socket.io');
const config = require('../config/config');
const { log } = require('../utils/logger');

let io;

function startSocketServer(server) {
  io = new Server(server, {
    cors: {
      origin: '*',  // Adjust for your frontend origin in production
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    log(`Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
      log(`Client disconnected: ${socket.id}`);
    });
  });
}

function emitTradeUpdate(trade) {
  if (io) {
    io.emit('tradeUpdate', trade);
    log('Emitted trade update to clients');
  }
}

module.exports = {
  startSocketServer,
  emitTradeUpdate,
};
