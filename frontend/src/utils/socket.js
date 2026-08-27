import { io } from 'socket.io-client';

// Same host-detection logic used for the REST API base URL, so the
// socket connects to the same backend the app is already talking to.
const SOCKET_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5001'
  : (import.meta.env.VITE_API_URL || 'https://nexus-ai-production-72d2.up.railway.app/api').replace(/\/api\/?$/, '');

let socket = null;

// Lazily creates (once) and returns the shared socket instance. Lazy so
// that importing this module never opens a connection by itself — only
// actually calling getSocket() does, e.g. after login or when a
// real-time widget mounts.
export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      transports: ['websocket', 'polling']
    });
  }
  return socket;
}
