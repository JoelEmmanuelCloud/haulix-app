'use client';

import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { X, Send, User, Headphones, Package } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ChatWidget({ onClose }) {
  const [socket, setSocket] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isNameSet, setIsNameSet] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    // Generate or retrieve session ID
    const storedSessionId = localStorage.getItem('haulix_session_id');
    const currentSessionId = storedSessionId || `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    
    if (!storedSessionId) {
      localStorage.setItem('haulix_session_id', currentSessionId);
    }
    
    setSessionId(currentSessionId);

    // Load previous messages
    loadChatHistory(currentSessionId);

    // Initialize socket connection
    const newSocket = io(process.env.NODE_ENV === 'production' ? 'https://haulix.delivery' : 'http://localhost:3000');
    
    newSocket.on('connect', () => {
      setIsConnected(true);
      newSocket.emit('join_chat', currentSessionId);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Listen for admin responses
    newSocket.on('admin_response', (data) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'admin',
        message: data.message,
        timestamp: new Date(data.timestamp)
      }]);
      
      // Show notification if widget is closed
      toast.success('New message from support!');
    });

    // Listen for order notifications
    newSocket.on('order_notification', (data) => {
      if (data.type === 'order_created') {
        setMessages(prev => [...prev, {
          id: Date.now(),
          sender: 'system',
          message: `Order created! Your tracking ID is: ${data.trackingId}`,
          timestamp: new Date(data.timestamp),
          trackingId: data.trackingId
        }]);
        
        toast.success(`Order created! Tracking ID: ${data.trackingId}`);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const loadChatHistory = async (sessionId) => {
    try {
      const response = await fetch(`/api/chat?sessionId=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.chat) {
          setMessages(data.chat.messages.map(msg => ({
            id: `${msg._id || Date.now()}_${Math.random()}`,
            sender: msg.sender,
            message: msg.message,
            timestamp: new Date(msg.timestamp)
          })));
          
          if (data.chat.customerName && data.chat.customerName !== 'Anonymous Customer') {
            setCustomerName(data.chat.customerName);
            setIsNameSet(true);
          }
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (customerName.trim()) {
      setIsNameSet(true);
      // Send welcome message
      const welcomeMsg = {
        id: Date.now(),
        sender: 'system',
        message: `Hi ${customerName}! How can we help you with your shipping needs today?`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, welcomeMsg]);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !socket || !sessionId) return;

    const messageData = {
      sessionId,
      message: newMessage.trim(),
      customerName: customerName || 'Anonymous Customer'
    };

    // Add message to local state immediately
    const localMessage = {
      id: Date.now(),
      sender: 'customer',
      message: newMessage.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, localMessage]);
    setNewMessage('');

    // Send via socket
    socket.emit('customer_message', messageData);

    // Save to database
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isNameSet) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center">
              <div className="bg-cyan-100 p-2 rounded-full mr-3">
                <Headphones className="w-6 h-6 text-cyan-700" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Welcome to Haulix Support</h3>
                <p className="text-sm text-gray-600">Let&apos;s get started</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleNameSubmit} className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What should we call you?
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                autoFocus
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-cyan-700 hover:bg-cyan-800 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Start Chat
            </button>
            <button
              type="button"
              onClick={() => {
                setCustomerName('Anonymous Customer');
                setIsNameSet(true);
              }}
              className="w-full mt-2 text-gray-500 hover:text-gray-700 text-sm transition-colors"
            >
              Continue as Anonymous
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-end p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-cyan-700 to-blue-800 text-white rounded-t-2xl">
          <div className="flex items-center">
            <div className="bg-white bg-opacity-20 p-2 rounded-full mr-3">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold">Haulix Support</h3>
              <div className="flex items-center text-sm opacity-90">
                <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                {isConnected ? 'Online' : 'Connecting...'}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'customer' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.sender === 'customer'
                    ? 'bg-cyan-700 text-white'
                    : message.sender === 'system'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.sender === 'admin' && (
                  <div className="flex items-center mb-1">
                    <User className="w-4 h-4 mr-1" />
                    <span className="text-xs font-medium">Support Agent</span>
                  </div>
                )}
                
                <p className="text-sm">{message.message}</p>
                
                {message.trackingId && (
                  <div className="mt-2 p-2 bg-white bg-opacity-20 rounded-lg">
                    <div className="flex items-center text-xs">
                      <Package className="w-4 h-4 mr-1" />
                      <span>Tracking: {message.trackingId}</span>
                    </div>
                    <button
                      onClick={() => window.open(`/track?id=${message.trackingId}`, '_blank')}
                      className="text-xs underline mt-1 hover:no-underline"
                    >
                      Track Order →
                    </button>
                  </div>
                )}
                
                <div className={`text-xs mt-1 ${
                  message.sender === 'customer' ? 'text-cyan-200' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                <div className="flex items-center space-x-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">Support is typing...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              disabled={!isConnected}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || !isConnected}
              className="bg-cyan-700 hover:bg-cyan-800 disabled:bg-gray-300 text-white p-2 rounded-full transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Powered by Haulix • Secure & Encrypted
          </p>
        </form>
      </div>
    </div>
  );
}