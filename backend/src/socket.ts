import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { env } from './config/env.config';
import { JwtPayload } from './middlewares/auth';
import { Block } from './models/Block';
import { Conversation } from './models/Conversation';
import { Connection } from './models/Connection';

let io: Server;

export const initSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
  });

  // Auth Middleware for Socket
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      socket.data.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.data.user.userId;
    
    // Join a personal room for direct events
    socket.join(`user:${userId}`);

    socket.on('join_conversation', async (conversationId: string) => {
      // Security: Verify user is part of the conversation
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) return;
      if (conversation.participants.some(p => p.toString() === userId)) {
        socket.join(`conversation:${conversationId}`);
      }
    });

    socket.on('leave_conversation', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on('typing', (conversationId: string) => {
      socket.to(`conversation:${conversationId}`).emit('typing', { conversationId, userId });
    });

    socket.on('disconnect', () => {
      // Handle disconnect
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};

export const emitMessage = async (conversationId: string, message: any, senderId: string, recipientId: string) => {
  // Check if blocked
  const isBlocked = await Block.findOne({
    $or: [
      { blockerId: recipientId, blockedId: senderId },
      { blockerId: senderId, blockedId: recipientId }
    ]
  });

  if (isBlocked) return false;

  // Emit to conversation room (so sender and recipient receive it if they are in the room)
  io.to(`conversation:${conversationId}`).emit('receive_message', message);
  
  // Also emit a general notification to the recipient's personal room for inbox updates
  io.to(`user:${recipientId}`).emit('new_message_alert', message);

  return true;
};
