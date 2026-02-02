import { io } from 'socket.io-client';

const SOCKET_URL = 'https://trueqq-backend.onrender.com';

let socket = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socket.on('connect', () => {
      console.log('✅ Conectado a Socket.io:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('❌ Desconectado de Socket.io');
    });

    socket.on('connect_error', (error) => {
      console.error('Error de conexión Socket.io:', error);
    });
  }
  
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};