import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/auth.store';

let socket: Socket | null = null;

// Initialize socket connection using the token from the Zustand store
export const initializeSocket = () => {
  const token = useAuthStore.getState().accessToken;
  const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

  if (!token) {
    console.warn('Cannot initialize socket without auth token');
    return null;
  }

  if (socket) {
    socket.disconnect(); // Disconnect existing socket to prevent duplicates
  }

  socket = io(API_URL, {
    auth: {
      token
    },
    transports: ['websocket', 'polling'], // Prefer websocket
  });

  socket.on('connect', () => {
    console.log('[Socket] Connected to server:', socket?.id);
  });

  socket.on('connect_error', (error) => {
    console.error('[Socket] Connection error:', error.message);
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket] Disconnected:', reason);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
