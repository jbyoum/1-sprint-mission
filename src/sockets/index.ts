import { Server as HttpServer } from 'http';
import { Socket, Server as SocketIOServer } from 'socket.io';
import UnauthError from '../lib/errors/UnauthError';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/constants';
import { JwtPayload } from '../types/JwtPayload';
import CommonError from '../lib/errors/CommonError';

let io: SocketIOServer;

export const getIO = () => {
  if (!io && process.env.NODE_ENV !== 'test') {
    throw new CommonError('Socket.io not initialized', 500);
  }
  return io;
};

export default function registerSocketServer(server: HttpServer) {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });
  io.use((socket, next) => {
    const token = socket.handshake.auth.accessToken;
    if (!token) {
      return next(new UnauthError());
    }
    try {
      const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
      socket.join(`user_${payload.userId}`);
      next();
    } catch (err) {
      next(new UnauthError());
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
}
