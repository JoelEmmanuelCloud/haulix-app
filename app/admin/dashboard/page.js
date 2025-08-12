'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import { 
  MessageCircle, 
  Package, 
  Users, 
  Send, 
  Plus, 
  LogOut,
  Bell,
  Clock,
  CheckCircle,
  Home,
  ArrowLeft,
  Menu,
  X,
  ChevronDown,
  Search,
  Filter
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [socket, setSocket] = useState(null);
  const [activeTab, setActiveTab] = useState('chats');
  const [chats, setChats] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [orderForm, setOrderForm] = useState({
    description: '',
    deliveryAddress: '',
    pickupAddress: '',
    estimatedDelivery: ''
  });

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/admin/login');
    }
  }, [session, status, router]);

  // Initialize socket connection
  useEffect(() => {
    if (!session) return;

    const newSocket = io(process.env.NODE_ENV === 'production' ? 'https://haulix.delivery' : 'http://localhost:3000');
    
    newSocket.on('connect', () => {
      newSocket.emit('admin_join');
    });

    // Listen for new customer messages
    newSocket.on('new_customer_message', (data) => {
      setChats(prev => {
        const updatedChats = [...prev];
        const chatIndex = updatedChats.findIndex(chat => chat.sessionId === data.sessionId);
        
        if (chatIndex >= 0) {
          updatedChats[chatIndex].messages.push({
            sender: data.sender,
            message: data.message,
            timestamp: new Date(data.timestamp)
          });
          updatedChats[chatIndex].lastActivity = new Date(data.timestamp);
          
          // Move to top
          const [updatedChat] = updatedChats.splice(chatIndex, 1);
          updatedChats.unshift(updatedChat);
        } else {
          // New chat
          updatedChats.unshift({
            sessionId: data.sessionId,
            customerName: data.customerName,
            messages: [{
              sender: data.sender,
              message: data.message,
              timestamp: new Date(data.timestamp)
            }],
            lastActivity: new Date(data.timestamp),
            status: 'active'
          });
        }
        
        return updatedChats;
      });

      // Update selected chat if it's the same session
      if (selectedChat && selectedChat.sessionId === data.sessionId) {
        setSelectedChat(prev => ({
          ...prev,
          messages: [...prev.messages, {
            sender: data.sender,
            message: data.message,
            timestamp: new Date(data.timestamp)
          }]
        }));
      }

      toast.success(`New message from ${data.customerName}`);
    });

    // Listen for chat activity
    newSocket.on('chat_activity', (data) => {
      if (data.type === 'customer_online') {
        toast(`Customer online in chat ${data.sessionId}`, { icon: '🟢' });
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [session, selectedChat]);

  // Load initial data
  useEffect(() => {
    if (session) {
      loadChats();
      loadOrders();
    }
  }, [session]);

  const loadChats = async () => {
    try {
      const response = await fetch('/api/chat', { method: 'PUT' });
      if (response.ok) {
        const data = await response.json();
        setChats(data.chats || []);
      }
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  };

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedChat || !socket) return;

    const messageData = {
      sessionId: selectedChat.sessionId,
      message: newMessage.trim(),
      sender: 'admin'
    };

    // Send via socket
    socket.emit('admin_message', messageData);

    // Add to local state
    setSelectedChat(prev => ({
      ...prev,
      messages: [...prev.messages, {
        sender: 'admin',
        message: newMessage.trim(),
        timestamp: new Date()
      }]
    }));

    // Save to database
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }

    setNewMessage('');
  };

  const createOrder = async (e) => {
    e.preventDefault();
    
    if (!selectedChat) return;

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatSessionId: selectedChat.sessionId,
          customerName: selectedChat.customerName,
          ...orderForm
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Notify via socket
        socket?.emit('order_created', {
          sessionId: selectedChat.sessionId,
          trackingId: data.trackingId,
          orderDetails: data.order
        });

        // Send message to customer
        const orderMessage = {
          sessionId: selectedChat.sessionId,
          message: `Great! I've created your shipment order. Your tracking ID is: ${data.trackingId}. You can track your package at any time using this ID.`,
          sender: 'admin'
        };

        socket?.emit('admin_message', orderMessage);

        // Save order message
        await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderMessage)
        });

        // Update local state
        setSelectedChat(prev => ({
          ...prev,
          messages: [...prev.messages, {
            sender: 'admin',
            message: orderMessage.message,
            timestamp: new Date()
          }]
        }));

        // Reset form
        setOrderForm({
          description: '',
          deliveryAddress: '',
          pickupAddress: '',
          estimatedDelivery: ''
        });
        setShowOrderForm(false);
        
        // Reload orders
        loadOrders();
        
        toast.success(`Order created! Tracking ID: ${data.trackingId}`);
      } else {
        toast.error('Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Error creating order');
    }
  };

  const updateOrderStatus = async (trackingId, status, note = '') => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingId, status, note })
      });

      if (response.ok) {
        // Notify via socket
        socket?.emit('order_status_update', { trackingId, status, note });
        
        // Reload orders
        loadOrders();
        
        toast.success(`Order ${trackingId} updated to ${status}`);
      } else {
        toast.error('Failed to update order');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Error updating order');
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatTimeRelative = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return time.toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'created': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'in_transit': return 'bg-purple-100 text-purple-800';
      case 'out_for_delivery': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-cyan-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      
      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Mobile back button for chat view */}
            {isMobile && selectedChat ? (
              <button
                onClick={() => setSelectedChat(null)}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5 mr-1" />
                <span className="text-sm">Back</span>
              </button>
            ) : (
              <div className="flex items-center">
                <Link href="/" className="hover:opacity-80 transition-opacity">
                  <Image
                    src="/images/logo.svg"
                    alt="Haulix Logo"
                    width={120}
                    height={16}
                    className="w-auto h-16 mr-2"
                  />
                </Link>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-gray-900">Admin</h1>
                  <p className="text-xs text-gray-600">Dashboard</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              {/* Mobile menu button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              {/* Desktop logout */}
              <button
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="hidden lg:flex items-center text-gray-600 hover:text-gray-900 text-sm"
              >
                <LogOut className="w-4 h-4 mr-1" />
                <span>Logout</span>
              </button>
            </div>
          </div>
          
          {/* Mobile chat header */}
          {isMobile && selectedChat && (
            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">{selectedChat.customerName}</h2>
                  <p className="text-xs text-gray-500">Session: {selectedChat.sessionId.slice(-8)}</p>
                </div>
                <button
                  onClick={() => setShowOrderForm(!showOrderForm)}
                  className="bg-cyan-700 hover:bg-cyan-800 text-white px-3 py-1.5 rounded-lg text-sm flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Order
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-xl">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold">Menu</h3>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="text-sm text-gray-600">Welcome, Admin</div>
                <button
                  onClick={() => signOut({ callbackUrl: '/admin/login' })}
                  className="flex items-center w-full text-gray-700 hover:text-gray-900"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="px-4 py-4 max-w-7xl mx-auto">
        {/* Stats Cards - Hide when viewing chat on mobile */}
        {!(isMobile && selectedChat) && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <div className="bg-white rounded-lg shadow p-3 sm:p-4">
              <div className="flex items-center">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0" />
                <div className="ml-2 sm:ml-3 min-w-0">
                  <p className="text-xs font-medium text-gray-600 truncate">Active Chats</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">{chats.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-3 sm:p-4">
              <div className="flex items-center">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0" />
                <div className="ml-2 sm:ml-3 min-w-0">
                  <p className="text-xs font-medium text-gray-600 truncate">Total Orders</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">{orders.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-3 sm:p-4">
              <div className="flex items-center">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 flex-shrink-0" />
                <div className="ml-2 sm:ml-3 min-w-0">
                  <p className="text-xs font-medium text-gray-600 truncate">In Transit</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">
                    {orders.filter(o => o.currentStatus === 'in_transit').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-3 sm:p-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-500 flex-shrink-0" />
                <div className="ml-2 sm:ml-3 min-w-0">
                  <p className="text-xs font-medium text-gray-600 truncate">Delivered</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">
                    {orders.filter(o => o.currentStatus === 'delivered').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Tabs - Hide when viewing chat */}
        {!(isMobile && selectedChat) && (
          <div className="bg-white rounded-lg shadow mb-4 lg:mb-6">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('chats')}
                className={`flex-1 py-3 px-4 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'chats'
                    ? 'border-cyan-500 text-cyan-600 bg-cyan-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <MessageCircle className="w-4 h-4 inline mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Chats </span>
                ({chats.length})
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 py-3 px-4 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-cyan-500 text-cyan-600 bg-cyan-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Package className="w-4 h-4 inline mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Orders </span>
                ({orders.length})
              </button>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow">
          {/* Chat Interface - Mobile Full Screen */}
          {isMobile && selectedChat ? (
            <div className="h-[calc(100vh-200px)] flex flex-col">
              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {selectedChat.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] px-3 py-2 rounded-lg ${
                        message.sender === 'admin'
                          ? 'bg-cyan-700 text-white rounded-br-sm'
                          : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.message}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'admin' ? 'text-cyan-200' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t bg-gray-50">
                <form onSubmit={sendMessage} className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="bg-cyan-700 hover:bg-cyan-800 disabled:bg-gray-300 text-white px-4 py-2 rounded-full flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="p-4 lg:p-6">
              {activeTab === 'chats' && (
                <div className={`${isMobile ? '' : 'grid lg:grid-cols-3 gap-6'}`}>
                  {/* Chat List */}
                  <div className={`${isMobile ? '' : 'lg:col-span-1'}`}>
                    <h3 className="text-lg font-semibold mb-4">Active Conversations</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {chats.map((chat) => (
                        <div
                          key={chat.sessionId}
                          onClick={() => setSelectedChat(chat)}
                          className={`p-4 border rounded-lg cursor-pointer transition-all active:scale-95 ${
                            selectedChat?.sessionId === chat.sessionId && !isMobile
                              ? 'border-cyan-500 bg-cyan-50 shadow-md'
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900 truncate flex-1 mr-2">
                              {chat.customerName}
                            </span>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              {formatTimeRelative(chat.lastActivity)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate mb-2">
                            {chat.messages[chat.messages.length - 1]?.message || 'No messages'}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                              <span className="text-xs text-gray-500">{chat.messages.length} msg</span>
                            </div>
                            {isMobile && (
                              <div className="text-cyan-600">
                                <MessageCircle className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {chats.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                          <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                          <p>No active chats</p>
                          <p className="text-sm mt-1">New conversations will appear here</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Desktop Chat Interface */}
                  {!isMobile && (
                    <div className="lg:col-span-2">
                      {selectedChat ? (
                        <div className="border rounded-lg h-96 flex flex-col">
                          {/* Chat Header */}
                          <div className="p-4 border-b bg-gray-50 rounded-t-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold">{selectedChat.customerName}</h4>
                                <p className="text-sm text-gray-600">Session: {selectedChat.sessionId}</p>
                              </div>
                              <button
                                onClick={() => setShowOrderForm(!showOrderForm)}
                                className="bg-cyan-700 hover:bg-cyan-800 text-white px-4 py-2 rounded-lg text-sm flex items-center"
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Create Order
                              </button>
                            </div>
                          </div>

                          {/* Messages */}
                          <div className="flex-1 p-4 overflow-y-auto space-y-3">
                            {selectedChat.messages.map((message, index) => (
                              <div
                                key={index}
                                className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-xs px-3 py-2 rounded-lg ${
                                    message.sender === 'admin'
                                      ? 'bg-cyan-700 text-white'
                                      : 'bg-gray-100 text-gray-900'
                                  }`}
                                >
                                  <p className="text-sm">{message.message}</p>
                                  <p className={`text-xs mt-1 ${
                                    message.sender === 'admin' ? 'text-cyan-200' : 'text-gray-500'
                                  }`}>
                                    {formatTime(message.timestamp)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Message Input */}
                          <form onSubmit={sendMessage} className="p-4 border-t">
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                              />
                              <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="bg-cyan-700 hover:bg-cyan-800 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg"
                              >
                                <Send className="w-5 h-5" />
                              </button>
                            </div>
                          </form>
                        </div>
                      ) : (
                        <div className="border rounded-lg h-96 flex items-center justify-center text-gray-500">
                          <div className="text-center">
                            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p>Select a chat to start messaging</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Order Management</h3>
                  
                  {/* Mobile Order Cards */}
                  {isMobile ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order._id} className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-mono text-sm font-semibold text-gray-900">
                              {order.trackingId}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.currentStatus)}`}>
                              {order.currentStatus.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-gray-600">Customer:</span>
                              <span className="ml-2 font-medium">{order.customerName}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Description:</span>
                              <span className="ml-2">{order.description}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Created:</span>
                              <span className="ml-2">{new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4 pt-3 border-t">
                            <select
                              value={order.currentStatus}
                              onChange={(e) => updateOrderStatus(order.trackingId, e.target.value)}
                              className="text-xs border rounded px-2 py-1 bg-white"
                            >
                              <option value="created">Created</option>
                              <option value="processing">Processing</option>
                              <option value="in_transit">In Transit</option>
                              <option value="out_for_delivery">Out for Delivery</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <button
                              onClick={() => window.open(`/track?id=${order.trackingId}`, '_blank')}
                              className="text-cyan-600 hover:text-cyan-800 text-sm font-medium"
                            >
                              View Details →
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {orders.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                          <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                          <p>No orders yet</p>
                          <p className="text-sm mt-1">Orders will appear here when created</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Desktop Table
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">Tracking ID</th>
                            <th className="text-left py-3 px-4">Customer</th>
                            <th className="text-left py-3 px-4">Description</th>
                            <th className="text-left py-3 px-4">Status</th>
                            <th className="text-left py-3 px-4">Created</th>
                            <th className="text-left py-3 px-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <tr key={order._id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4 font-mono text-sm">{order.trackingId}</td>
                              <td className="py-3 px-4">{order.customerName}</td>
                              <td className="py-3 px-4">{order.description}</td>
                              <td className="py-3 px-4">
                                <select
                                  value={order.currentStatus}
                                  onChange={(e) => updateOrderStatus(order.trackingId, e.target.value)}
                                  className="text-sm border rounded px-2 py-1"
                                >
                                  <option value="created">Created</option>
                                  <option value="processing">Processing</option>
                                  <option value="in_transit">In Transit</option>
                                  <option value="out_for_delivery">Out for Delivery</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4">
                                <button
                                  onClick={() => window.open(`/track?id=${order.trackingId}`, '_blank')}
                                  className="text-cyan-600 hover:text-cyan-800 text-sm"
                                >
                                  View →
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      
                      {orders.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>No orders yet</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Order Creation Modal */}
      {showOrderForm && selectedChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Create New Order</h3>
                <button
                  onClick={() => setShowOrderForm(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={createOrder} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer
                  </label>
                  <input
                    type="text"
                    value={selectedChat.customerName}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <input
                    type="text"
                    value={orderForm.description}
                    onChange={(e) => setOrderForm({...orderForm, description: e.target.value})}
                    placeholder="Package description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address *
                  </label>
                  <textarea
                    value={orderForm.deliveryAddress}
                    onChange={(e) => setOrderForm({...orderForm, deliveryAddress: e.target.value})}
                    placeholder="Full delivery address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 text-sm"
                    rows="3"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pickup Address
                  </label>
                  <input
                    type="text"
                    value={orderForm.pickupAddress}
                    onChange={(e) => setOrderForm({...orderForm, pickupAddress: e.target.value})}
                    placeholder="Pickup location (optional)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Delivery
                  </label>
                  <input
                    type="datetime-local"
                    value={orderForm.estimatedDelivery}
                    onChange={(e) => setOrderForm({...orderForm, estimatedDelivery: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 text-sm"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowOrderForm(false)}
                    className="w-full sm:w-auto px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-cyan-700 hover:bg-cyan-800 text-white px-4 py-2 rounded-lg"
                  >
                    Create Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}