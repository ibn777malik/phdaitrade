// Dummy function to process trade signals
function processSignal(signal) {
  // signal can be { symbol, side: 'buy'|'sell', volume }
  // Validate and prepare for order
  if (!signal.symbol || !signal.side || !signal.volume) {
    throw new Error('Invalid trade signal');
  }
  return signal;
}

module.exports = { processSignal };
