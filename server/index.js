import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import ioEnchancer from 'socket.io';
import httpEnchancer from 'http';
import expressDomainMiddleware from 'express-domain-middleware';
import staticHandler from './handlers/static';
import chatWsHandler from './handlers/chatWs';
import chatApiHandler from './handlers/chatApi';
import applicationHandler from './handlers/application';

const server = express();
const http = httpEnchancer.Server(server);

const io = ioEnchancer(http, { transports: ['polling', 'websocket'] });
chatWsHandler(io);

server.use(expressDomainMiddleware);
server.use(compression());
server.use(cookieParser());
staticHandler(server);
server.use('/chat/api', chatApiHandler);
server.use(applicationHandler);
server.use((err, req, res, next) => {
  res.status(500).send();
  next();
});

export default http;
