import { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

const STATUS_MESSAGES = {
  pending: '⏳ Your order is pending confirmation',
  accepted: '✅ Your order has been accepted!',
  preparing: '👨‍🍳 Your order is being prepared',
  ready: '🎉 Your order is ready!',
  'out-for-delivery': '🚚 Your order is out for delivery',
  delivered: '🎊 Your order has been delivered!',
  cancelled: '❌ Your order has been cancelled'
};

export function SocketProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    socketRef.current = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected');
    });

    socketRef.current.on('order-status-update', (data) => {
      const msg = STATUS_MESSAGES[data.status] || `Order status: ${data.status}`;
      toast(msg, {
        duration: 4000,
        style: { background: '#4A2C2A', color: '#fff' }
      });
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated, token]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
