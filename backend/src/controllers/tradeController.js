const metaApiClient = require('../metaapi/metaApiClient');
const notifier = require('../services/notifier');
const { log } = require('../utils/logger');

async function executeTrade(signal) {
  try {
    // Process signal (validate)
    // This can be replaced with more advanced strategy checks
    if (!signal.symbol || !signal.side || !signal.volume) {
      throw new Error('Invalid trade signal');
    }

    // Place market order via MetaApi
    const order = await metaApiClient.createMarketOrder(
      signal.symbol,
      signal.volume,
      signal.side,
      signal.stopLossPips,
      signal.takeProfitPips,
    );

    // Notify user about the trade
    const message = `Trade executed: ${signal.side.toUpperCase()} ${signal.volume} ${signal.symbol}`;
    await notifier.sendTelegramMessage(message);
    log(message);

    return order;
  } catch (err) {
    log(`Trade execution error: ${err.message}`, 'error');
    await notifier.sendTelegramMessage(`Trade execution failed: ${err.message}`);
    throw err;
  }
}

module.exports = { executeTrade };
