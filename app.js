import express from 'express';
import WebSocket from 'ws';
import { createServer } from 'http';
import { authorize } from './services/userService.js';
import init from './scripts/init.js';

const app = express();
const port = 8080;

init();


const server = createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, request) => {
  console.log(request.headers);
  if (authorize(request.headers)) {
    console.log('connected');
    ws.on('message', (message) => {
      console.log('received: %s', message);
      const msg = JSON.parse(message);
      if (msg.type === 'ping') {
        ws.send('pong');
        console.log('ping recieved and pong sent');
      }
    });
    ws.on('ping', () => {
      console.log('ping received');
      ws.send(JSON.stringify({ "type": 'pong' }));
    });

    ws.send('msg from server');
  }
});

server.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});