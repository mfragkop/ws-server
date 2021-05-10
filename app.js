import express from 'express';
import WebSocket from 'ws';
import { createServer } from 'http';
import { authorize } from './services/userService.js';
import init from './scripts/init.js';
import handleMessage from './ws/channels.js';

const app = express();
const port = 8080;

init();

const server = createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, request) => {
  if (authorize(request.headers)) {
    ws.on('message', (message) => {
      handleMessage(ws, message);
    });
    ws.send('Connected');
  }
});

server.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});