import express from 'express';
import WebSocket from 'ws';
import winston from 'winston';
import { createServer } from 'http';
import { authorize, getUsername } from './services/userService.js';
import init from './scripts/init.js';
import handleMessage from './ws/channels.js';


const app = express();
const port = 8080;

init();

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.prettyPrint()
  ),
  transports: [
    new winston.transports.File({ filename: './pong.log', level: 'info' }),
  ],
});

export const loggerUser1 = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.prettyPrint()
  ),
  transports: [
    new winston.transports.File({ filename: './pong-user1.log', level: 'info' }),
  ],
});

export const loggerUser2 = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.prettyPrint()
  ),
  transports: [
    new winston.transports.File({ filename: './pong-user2.log', level: 'info' }),
  ],
});

const server = createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, request) => {
  if (authorize(request.headers)) {
    const username = getUsername(request.headers.apikey);
    console.log(`authorized connection: ${username}`);
    logger.log('info', `Authorized user ${username}`);
    if (username === 'user1') {
      loggerUser1.log('info', 'Authorized connection');
    }
    if (username === 'user2') {
      loggerUser2.log('info', 'Authorized connection');
    }
    ws.on('message', (message) => {
      handleMessage(ws, message, username);
    });
    ws.send('Connected');
  }
});

server.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});