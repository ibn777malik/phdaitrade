const MetaApi = require('metaapi.cloud-sdk').default;
const config = require('../config/config');
const { log } = require('../utils/logger');

// Create API instance only if token is provided
let api;
if (config.metaApiToken) {
  api = new MetaApi(config.metaApiToken);
} else {
  log('MetaApi token not configured, running in demo mode', 'warn');
}

async function getAccount() {
  if (!api) {
    throw new Error('MetaApi not configured. Please set METAAPI_TOKEN in .env');
  }
  
  try {
    const account = await api.metatraderAccountApi.getAccount(config.mtAccountId);
    await account.deploy(); // deploy if not deployed
    await account.waitConnected();
    log('MetaApi account connected');
    return account;
  } catch (err) {
    log(`MetaApi connection error: ${err.message}`, 'error');
    throw err;
  }
}

async function createMarketOrder(symbol, volume, side, stopLossPips, takeProfitPips) {
  if (!api) {
    // Demo mode - simulate order creation
    const demoOrder = {
      id: `demo_${Date.now()}`,
      symbol,
      volume,
      side,
      status: 'TRADE_RETCODE_DONE',
      openPrice: side === 'buy' ? 1.1234 : 1.1230,
      stopLoss: stopLossPips,
      takeProfit: takeProfitPips,
      comment: 'Demo order - MetaApi not configured'
    };
    log(`Demo Order Created: ${JSON.stringify(demoOrder)}`);
    return demoOrder;
  }

  const account = await getAccount();
  const connection = account.getRPCConnection();
  await connection.connect();

  const sl = stopLossPips || 50;
  const tp = takeProfitPips || 100;

  try {
    if (side === 'buy') {
      const order = await connection.createMarketBuyOrder(symbol, volume, { 
        stopLoss: sl, 
        takeProfit: tp 
      });
      log(`Created Buy Order: ${JSON.stringify(order)}`);
      return order;
    } else {
      const order = await connection.createMarketSellOrder(symbol, volume, { 
        stopLoss: sl, 
        takeProfit: tp 
      });
      log(`Created Sell Order: ${JSON.stringify(order)}`);
      return order;
    }
  } catch (err) {
    log(`Order creation error: ${err.message}`, 'error');
    throw err;
  }
}

module.exports = {
  getAccount,
  createMarketOrder,
};