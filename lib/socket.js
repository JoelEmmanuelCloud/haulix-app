'use client';

import { io } from 'socket.io-client';

// Socket connection state
let socket = null;
let isConnected = false;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;

// Get socket URL based on environment
const getSocketUrl = () => {
  if (typeof window === 'undefined') return null;
  
  return process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_SOCKET_URL || 'https://haulix.delivery'
    : 'http://localhost:3000';
};

// Socket configuration options
const socketOptions = {
  transports: ['websocket', 'polling'],
  timeout: 20000,
  forceNew: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: maxReconnectAttempts,
  maxReconnectionAttempts: maxReconnectAttempts,
  autoConnect: true,
  pingTimeout: 60000,
  pingInterval: 25000
};

// Initialize socket connection
export function initializeSocket() {
  if (typeof window === 'undefined') return null;
  
  const url = getSocketUrl();
  if (!url) return null;

  // Return existing socket if already connected
  if (socket && isConnected) {
    return socket;
  }

  // Create new socket connection
  socket = io(url, socketOptions);

  // Connection event handlers
  socket.on('connect', () => {
    isConnected = true;
    reconnectAttempts = 0;
    console.log('[Socket] Connected to server');
    
    // Emit custom connect event for listeners
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('socket-connected'));
    }
  });

  socket.on('disconnect', (reason) => {
    isConnected = false;
    console.log('[Socket] Disconnected:', reason);
    
    // Emit custom disconnect event for listeners
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('socket-disconnected', { 
        detail: { reason } 
      }));
    }
  });

  socket.on('connect_error', (error) => {
    isConnected = false;
    reconnectAttempts++;
    console.error('[Socket] Connection error:', error);
    
    // Emit custom error event for listeners
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('socket-error', { 
        detail: { error, attempts: reconnectAttempts } 
      }));
    }
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log('[Socket] Reconnected after', attemptNumber, 'attempts');
    reconnectAttempts = 0;
  });

  socket.on('reconnect_failed', () => {
    console.error('[Socket] Failed to reconnect after', maxReconnectAttempts, 'attempts');
  });

  return socket;
}

// Get current socket instance
export function getSocket() {
  return socket;
}

// Check if socket is connected
export function isSocketConnected() {
  return socket && isConnected;
}

// Disconnect socket
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    isConnected = false;
  }
}

// Customer chat utilities
export const customerChat = {
  // Join a chat session
  joinChat: (sessionId) => {
    if (!socket) return false;
    socket.emit('join_chat', sessionId);
    return true;
  },

  // Send message as customer
  sendMessage: (sessionId, message, customerName = 'Anonymous Customer') => {
    if (!socket) return false;
    
    const messageData = {
      sessionId,
      message,
      customerName,
      timestamp: new Date().toISOString()
    };
    
    socket.emit('customer_message', messageData);
    return true;
  },

  // Listen for admin responses
  onAdminResponse: (callback) => {
    if (!socket) return () => {};
    
    socket.on('admin_response', callback);
    
    // Return cleanup function
    return () => socket.off('admin_response', callback);
  },

  // Listen for order notifications
  onOrderNotification: (callback) => {
    if (!socket) return () => {};
    
    socket.on('order_notification', callback);
    
    // Return cleanup function
    return () => socket.off('order_notification', callback);
  },

  // Listen for typing indicators
  onTypingIndicator: (callback) => {
    if (!socket) return () => {};
    
    socket.on('admin_typing', callback);
    
    // Return cleanup function
    return () => socket.off('admin_typing', callback);
  }
};

// Admin utilities
export const adminSocket = {
  // Join admin room
  joinAdminRoom: () => {
    if (!socket) return false;
    socket.emit('admin_join');
    return true;
  },

  // Send message as admin
  sendMessage: (sessionId, message) => {
    if (!socket) return false;
    
    const messageData = {
      sessionId,
      message,
      timestamp: new Date().toISOString()
    };
    
    socket.emit('admin_message', messageData);
    return true;
  },

  // Listen for new customer messages
  onCustomerMessage: (callback) => {
    if (!socket) return () => {};
    
    socket.on('new_customer_message', callback);
    
    // Return cleanup function
    return () => socket.off('new_customer_message', callback);
  },

  // Listen for chat activity
  onChatActivity: (callback) => {
    if (!socket) return () => {};
    
    socket.on('chat_activity', callback);
    
    // Return cleanup function
    return () => socket.off('chat_activity', callback);
  },

  // Emit order creation
  emitOrderCreated: (sessionId, trackingId, orderDetails) => {
    if (!socket) return false;
    
    socket.emit('order_created', {
      sessionId,
      trackingId,
      orderDetails,
      timestamp: new Date().toISOString()
    });
    return true;
  },

  // Emit order status update
  emitOrderStatusUpdate: (trackingId, status, note = '') => {
    if (!socket) return false;
    
    socket.emit('order_status_update', {
      trackingId,
      status,
      note,
      timestamp: new Date().toISOString()
    });
    return true;
  },

  // Send typing indicator
  sendTypingIndicator: (sessionId, isTyping) => {
    if (!socket) return false;
    
    socket.emit('admin_typing', {
      sessionId,
      isTyping,
      timestamp: new Date().toISOString()
    });
    return true;
  }
};

// Tracking utilities
export const trackingSocket = {
  // Listen for tracking updates
  onTrackingUpdate: (callback) => {
    if (!socket) return () => {};
    
    socket.on('tracking_update', callback);
    
    // Return cleanup function
    return () => socket.off('tracking_update', callback);
  },

  // Request current status
  requestStatus: (trackingId) => {
    if (!socket) return false;
    
    socket.emit('request_tracking_status', {
      trackingId,
      timestamp: new Date().toISOString()
    });
    return true;
  }
};

// Connection status utilities
export const connectionUtils = {
  // Get connection status
  getStatus: () => ({
    connected: isConnected,
    socket: !!socket,
    attempts: reconnectAttempts
  }),

  // Force reconnection
  forceReconnect: () => {
    if (socket) {
      socket.disconnect();
      socket.connect();
    }
  },

  // Add connection listener
  onConnectionChange: (callback) => {
    if (typeof window === 'undefined') return () => {};
    
    const handleConnect = () => callback(true);
    const handleDisconnect = () => callback(false);
    
    window.addEventListener('socket-connected', handleConnect);
    window.addEventListener('socket-disconnected', handleDisconnect);
    
    // Return cleanup function
    return () => {
      window.removeEventListener('socket-connected', handleConnect);
      window.removeEventListener('socket-disconnected', handleDisconnect);
    };
  }
};

// Message utilities
export const messageUtils = {
  // Validate message data
  validateMessage: (message) => {
    if (!message || typeof message !== 'string') return false;
    if (message.trim().length === 0) return false;
    if (message.length > 1000) return false; // Max message length
    return true;
  },

  // Sanitize message content
  sanitizeMessage: (message) => {
    return message
      .trim()
      .replace(/\n{3,}/g, '\n\n') // Limit consecutive newlines
      .slice(0, 1000); // Enforce max length
  },

  // Generate message ID
  generateMessageId: () => {
    return `msg_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  },

  // Format timestamp
  formatTimestamp: (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
};

// Error handling utilities
export const errorUtils = {
  // Handle socket errors
  handleError: (error, context = '') => {
    console.error(`[Socket Error] ${context}:`, error);
    
    // You could send errors to a logging service here
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('socket-error', {
        detail: { error, context }
      }));
    }
  },

  // Retry mechanism
  retry: async (fn, maxAttempts = 3, delay = 1000) => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === maxAttempts) throw error;
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }
};

// Cleanup function for React components
export function useSocketCleanup() {
  return () => {
    if (socket) {
      socket.removeAllListeners();
    }
  };
}

// Default export with main utilities
export default {
  initialize: initializeSocket,
  getSocket,
  isConnected: isSocketConnected,
  disconnect: disconnectSocket,
  customer: customerChat,
  admin: adminSocket,
  tracking: trackingSocket,
  connection: connectionUtils,
  message: messageUtils,
  error: errorUtils,
  cleanup: useSocketCleanup
};