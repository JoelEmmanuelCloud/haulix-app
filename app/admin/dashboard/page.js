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
  Truck,
  Bell,
  Clock,
  CheckCircle
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

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
  const [orderForm, setOrderForm] = useState({
    description: '',
    deliveryAddress: '',
    pickupAddress: '',
    estimatedDelivery: ''
  });

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

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Truck className="w-8 h-8 text-cyan-700 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Haulix Admin</h1>
                <p className="text-sm text-gray-600">Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, Admin</span>
              <button
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-5 h-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <MessageCircle className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Chats</p>
                <p className="text-2xl font-bold text-gray-900">{chats.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.currentStatus === 'in_transit').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-cyan-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.currentStatus === 'delivered').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('chats')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'chats'
                    ? 'border-cyan-500 text-cyan-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <MessageCircle className="w-5 h-5 inline mr-2" />
                Chats ({chats.length})
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-cyan-500 text-cyan-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Package className="w-5 h-5 inline mr-2" />
                Orders ({orders.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'chats' && (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Chat List */}
                <div className="lg:col-span-1">
                  <h3 className="text-lg font-semibold mb-4">Active Conversations</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {chats.map((chat) => (
                      <div
                        key={chat.sessionId}
                        onClick={() => setSelectedChat(chat)}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedChat?.sessionId === chat.sessionId
                            ? 'border-cyan-500 bg-cyan-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{chat.customerName}</span>
                          <span className="text-xs text-gray-500">
                            {formatTime(chat.lastActivity)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {chat.messages[chat.messages.length - 1]?.message || 'No messages'}
                        </p>
                        <div className="flex items-center mt-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                          <span className="text-xs text-gray-500">{chat.messages.length} messages</span>
                        </div>
                      </div>
                    ))}
                    
                    {chats.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No active chats</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Chat Interface */}
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
                        <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Select a chat to start messaging</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Order Management</h3>
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
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Creation Modal */}
      {showOrderForm && selectedChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Create New Order</h3>
              <form onSubmit={createOrder} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer
                  </label>
                  <input
                    type="text"
                    value={selectedChat.customerName}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowOrderForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-cyan-700 hover:bg-cyan-800 text-white px-4 py-2 rounded-lg"
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