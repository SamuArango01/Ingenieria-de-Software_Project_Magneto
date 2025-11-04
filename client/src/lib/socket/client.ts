import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3211";

export interface SocketConfig {
  token: string;
}

/**
 * Create Socket.IO connection to interviews-tts namespace
 */
export function createSocketConnection(config: SocketConfig): Socket {
  const socket = io(`${SOCKET_URL}/interviews-tts`, {
    auth: {
      token: config.token,
    },
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 10000,
  });

  return socket;
}
