const { MetaApi } = require('metaapi.cloud-sdk');
const config = require('../config/config');
const { log } = require('../utils/logger');

const api = new MetaApi(config.metaApiToken);

async function getAccount() {
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
  const account = await getAccount();
  const connection = account.getRPCConnection();
  await connection.connect();

  const price = side === 'buy' ? 'buy' : 'sell';

  const sl = stopLossPips || 50;
  const tp = takeProfitPips || 100;

  try {
    if (side === 'buy') {
      const order = await connection.createMarketBuyOrder(symbol, volume, { stopLoss: sl, takeProfit: tp });
      log(`Created Buy Order: ${JSON.stringify(order)}`);
      return order;
    } else {
      const order = await connection.createMarketSellOrder(symbol, volume, { stopLoss: sl, takeProfit: tp });
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
