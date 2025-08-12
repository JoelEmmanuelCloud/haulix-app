const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://haulix.delivery', 'https://www.haulix.delivery']
        : ['http://localhost:3000'],
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ['websocket', 'polling']
  });

  // Store connected clients
  const connectedClients = new Map();
  const adminClients = new Set();
  const chatRooms = new Map();

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Handle customer joining chat
    socket.on('join_chat', (sessionId) => {
      socket.join(`chat_${sessionId}`);
      connectedClients.set(socket.id, { sessionId, type: 'customer' });
      
      // Track chat room
      if (!chatRooms.has(sessionId)) {
        chatRooms.set(sessionId, {
          sessionId,
          customers: new Set(),
          createdAt: new Date()
        });
      }
      chatRooms.get(sessionId).customers.add(socket.id);
      
      console.log(`Customer joined chat: ${sessionId}`);
      
      // Notify admins of customer activity
      socket.to('admin_room').emit('customer_activity', {
        sessionId,
        type: 'joined',
        timestamp: new Date(),
        socketId: socket.id
      });
    });

    // Handle admin joining
    socket.on('admin_join', () => {
      socket.join('admin_room');
      adminClients.add(socket.id);
      connectedClients.set(socket.id, { type: 'admin' });
      
      console.log(`Admin connected: ${socket.id}`);
      
      // Send current stats to admin
      socket.emit('admin_stats', {
        totalCustomers: Array.from(connectedClients.values()).filter(conn => conn.type === 'customer').length,
        activeChatRooms: chatRooms.size,
        timestamp: new Date()
      });
    });

    // Handle customer messages
    socket.on('customer_message', async (data) => {
      const { sessionId, message, customerName } = data;
      
      if (!sessionId || !message) {
        socket.emit('error', { message: 'Session ID and message are required' });
        return;
      }

      const messageData = {
        sessionId,
        message: message.trim(),
        customerName: customerName || 'Anonymous Customer',
        timestamp: new Date(),
        sender: 'customer',
        socketId: socket.id
      };

      // Broadcast to admins
      socket.to('admin_room').emit('new_customer_message', messageData);
      
      // Send confirmation back to customer
      socket.emit('message_sent', {
        sessionId,
        messageId: `msg_${Date.now()}`,
        timestamp: messageData.timestamp
      });

      console.log(`Customer message in ${sessionId}: ${message}`);
    });

    // Handle admin messages
    socket.on('admin_message', async (data) => {
      const { sessionId, message } = data;
      
      if (!sessionId || !message) {
        socket.emit('error', { message: 'Session ID and message are required' });
        return;
      }

      const messageData = {
        message: message.trim(),
        timestamp: new Date(),
        sender: 'admin',
        adminSocketId: socket.id
      };

      // Send to specific customer chat
      socket.to(`chat_${sessionId}`).emit('admin_response', messageData);
      
      // Send confirmation to admin
      socket.emit('message_sent', {
        sessionId,
        messageId: `admin_msg_${Date.now()}`,
        timestamp: messageData.timestamp
      });

      console.log(`Admin message to ${sessionId}: ${message}`);
    });

    // Handle typing indicators
    socket.on('customer_typing', (data) => {
      const { sessionId, isTyping } = data;
      socket.to('admin_room').emit('customer_typing_status', {
        sessionId,
        isTyping,
        socketId: socket.id
      });
    });

    socket.on('admin_typing', (data) => {
      const { sessionId, isTyping } = data;
      socket.to(`chat_${sessionId}`).emit('admin_typing_status', {
        isTyping
      });
    });

    // Handle order creation
    socket.on('order_created', (data) => {
      const { sessionId, trackingId, orderDetails } = data;
      
      // Notify customer in the chat
      socket.to(`chat_${sessionId}`).emit('order_notification', {
        type: 'order_created',
        trackingId,
        orderDetails,
        timestamp: new Date()
      });

      // Notify all admins
      socket.to('admin_room').emit('new_order_created', {
        sessionId,
        trackingId,
        orderDetails,
        timestamp: new Date()
      });

      console.log(`Order created: ${trackingId} for session ${sessionId}`);
    });

    // Handle order status updates
    socket.on('order_status_update', (data) => {
      const { trackingId, status, note } = data;
      
      // Broadcast to all tracking pages and relevant chats
      io.emit('tracking_update', {
        trackingId,
        status,
        note,
        timestamp: new Date(),
        updatedBy: 'admin'
      });

      console.log(`Order ${trackingId} status updated to: ${status}`);
    });

    // Handle chat closure
    socket.on('close_chat', (data) => {
      const { sessionId } = data;
      
      // Notify customer
      socket.to(`chat_${sessionId}`).emit('chat_closed', {
        message: 'This chat has been closed by the admin. Thank you for using Haulix!',
        timestamp: new Date()
      });

      // Remove from active chats
      if (chatRooms.has(sessionId)) {
        chatRooms.delete(sessionId);
      }

      console.log(`Chat ${sessionId} closed by admin`);
    });

    // Handle admin requesting chat history
    socket.on('get_chat_history', async (data) => {
      const { sessionId } = data;
      
      try {
        // This would typically fetch from database
        // For now, we'll send a placeholder response
        socket.emit('chat_history', {
          sessionId,
          messages: [],
          customerInfo: {
            name: 'Loading...',
            joinedAt: new Date()
          }
        });
      } catch (error) {
        socket.emit('error', { message: 'Failed to load chat history' });
      }
    });

    // Handle heartbeat/ping
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: new Date() });
    });

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      const connection = connectedClients.get(socket.id);
      
      if (connection) {
        if (connection.type === 'admin') {
          adminClients.delete(socket.id);
          console.log(`Admin disconnected: ${socket.id} (${reason})`);
        } else if (connection.type === 'customer') {
          const { sessionId } = connection;
          
          // Remove from chat room tracking
          if (sessionId && chatRooms.has(sessionId)) {
            const chatRoom = chatRooms.get(sessionId);
            chatRoom.customers.delete(socket.id);
            
            // If no customers left in chat room, mark as inactive
            if (chatRoom.customers.size === 0) {
              chatRoom.lastActivity = new Date();
            }
          }
          
          // Notify admins
          socket.to('admin_room').emit('customer_activity', {
            sessionId,
            type: 'disconnected',
            timestamp: new Date(),
            reason,
            socketId: socket.id
          });
          
          console.log(`Customer disconnected: ${socket.id} from session ${sessionId} (${reason})`);
        }
        
        connectedClients.delete(socket.id);
      }
    });

    // Handle connection errors
    socket.on('error', (error) => {
      console.error(`Socket error for ${socket.id}:`, error);
      socket.emit('error', { message: 'Connection error occurred' });
    });
  });

  // Periodic cleanup of stale connections
  setInterval(() => {
    const now = new Date();
    const staleThreshold = 30 * 60 * 1000; // 30 minutes

    for (const [sessionId, chatRoom] of chatRooms.entries()) {
      if (chatRoom.customers.size === 0 && 
          chatRoom.lastActivity && 
          (now - chatRoom.lastActivity) > staleThreshold) {
        chatRooms.delete(sessionId);
        console.log(`Cleaned up stale chat room: ${sessionId}`);
      }
    }
  }, 5 * 60 * 1000); // Run every 5 minutes

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log('Socket.IO server initialized successfully');
    });
});