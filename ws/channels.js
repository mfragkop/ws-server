import { logger, loggerUser1, loggerUser2 } from '../app.js';

const handleMessage = (ws, message, username) => {
  const msg = JSON.parse(message);
  switch(msg.type) {
    case 'ping':
      ping(ws, username);
      break;
    case 'subscribe':
      subscribe(ws, msg);
      break;
    case 'unsubscribe':
      unsubscribe(ws, msg);
      break;
      case 'session':
        break;
    default:
      console.log('Invalid request');
  }
};

const ping = (ws, username) => {
  console.log(`ping from ${username}`)
  ws.send('{ "type": "pong" }');
  logger.log('info',`Pong to: ${username}`);
  if (username === 'user1') {
    loggerUser1.log('info', 'pong');
  }
  if (username === 'user2') {
    loggerUser2.log('info', 'pong');
  }
};

const subscribe = (ws, message) => {
  if (message.chan_name === 'trade') {
    return trade(ws, message.subchan_name);
  }
};

const unsubscribe = (ws, message) => {
  console.log(`Unsubscribing: ${message}`);
  if (message.chan_name === 'trade') {
    if (message.subchan_name === 'btc-eur' && ws.tradeBtcEur) {
      clearInterval(ws.tradeBtcEur);
      console.log('Unsubscribed from Trade channel Btc-Eur subchannel');
    }
    else if (message.subchan_name === 'eth-eur' && ws.tradeEthEur) {
      clearInterval(ws.tradeEthEur);
      console.log('Unsubscribed from Trade channel Eth-Eur subchannel');
    }
  }
};

const trade = (ws, subChannel) => {
  switch (subChannel) {
    case 'btc-eur':
      tradeBtcEur(ws);
      break;
    case 'eth-eur':
      tradeEthEur(ws);
      break;
    default:
      console.log('Sub-channel does not exist');
      break;
  }
};

const tradeBtcEur = (ws) => {
  const interval = setInterval(() => {
    console.log('sending Bitcoin to Euro Trades');
    ws.send(getTradeData('btc-eur'));
  }, 10000);
  ws.tradeBtcEur = interval;
};

const tradeEthEur = (ws) => {
  const interval = setInterval(() => {
    console.log('sending Ethereum to Euro Trades');
    ws.send(getTradeData('eth-eur'));
  }, 10000);
  ws.tradeEthEur = interval;
};

const getTradeData = (subChannel) => {
  return `{"chan_name": "trade", "subchan_name": "${subChannel}", "type":"data","data":[{"price":"8267.7","side":"sell","size":"0","market":"${subChannel}"},{"price":"8267.6","side":"sell","size":"3.02385214","market":"${subChannel}"}]}`
};

export default handleMessage;



