import { io } from 'socket.io-client';

const SERVER_URL = 'http://localhost:8080';

let socket = null;

export const initializeSocket = () => {
  return new Promise((resolve, reject) => {
    if (!socket) {
      socket = io(SERVER_URL);

      socket.on('connect', () => {
        console.log('Connected to WebSocket server');
        resolve(socket);
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
      });

      socket.on('connect_error', (err) => {
        console.error('WebSocket connection error:', err);
        reject(err);
      });
    } else {
      resolve(socket);
    }
  });
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket is not initialized. Initialize socket first.');
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
