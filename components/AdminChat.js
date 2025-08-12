'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, User, Package, Plus, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminChat({ 
  selectedChat, 
  socket, 
  onSendMessage, 
  onCreateOrder 
}) {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderForm, setOrderForm] = useState({
    description: '',
    deliveryAddress: '',
    pickupAddress: '',
    estimatedDelivery: ''
  });
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [selectedChat?.messages]);

  // Handle typing indicators (optional enhancement)
  useEffect(() => {
    if (!socket || !selectedChat) return;

    const typingTimer = setTimeout(() => {
      setIsTyping(false);
    }, 3000);

    return () => clearTimeout(typingTimer);
  }, [socket, selectedChat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedChat) return;

    try {
      await onSendMessage(selectedChat.sessionId, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    
    if (!selectedChat || !orderForm.description || !orderForm.deliveryAddress) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      await onCreateOrder(selectedChat.sessionId, {
        customerName: selectedChat.customerName,
        ...orderForm
      });
      
      // Reset form
      setOrderForm({
        description: '',
        deliveryAddress: '',
        pickupAddress: '',
        estimatedDelivery: ''
      });
      setShowOrderForm(false);
      
      toast.success('Order created successfully!');
    } catch (error) {
      toast.error('Failed to create order');
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const quickReplies = [
    "Hello! How can I help you with your shipping needs today?",
    "Let me create a shipping order for you right away.",
    "Your package is being processed and will be shipped soon.",
    "I'll update you with tracking information shortly.",
    "Is there anything else I can help you with?"
  ];

  if (!selectedChat) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg">
        <div className="text-center">
          <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Chat Selected</h3>
          <p className="text-sm">Select a customer chat to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm border">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-cyan-50 to-blue-50 rounded-t-lg">
        <div className="flex items-center">
          <div className="bg-cyan-100 p-2 rounded-full mr-3">
            <User className="w-5 h-5 text-cyan-700" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{selectedChat.customerName}</h3>
            <p className="text-sm text-gray-600">
              Session: {selectedChat.sessionId.slice(-8)}
            </p>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
              Active • {selectedChat.messages?.length || 0} messages
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowOrderForm(true)}
            className="bg-cyan-700 hover:bg-cyan-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
            title="Create Order"
          >
            <Plus className="w-4 h-4 mr-1" />
            Create Order
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {selectedChat.messages && selectedChat.messages.length > 0 ? (
          selectedChat.messages.map((message, index) => {
            const showDate = index === 0 || 
              formatDate(message.timestamp) !== formatDate(selectedChat.messages[index - 1].timestamp);
            
            return (
              <div key={index}>
                {/* Date Separator */}
                {showDate && (
                  <div className="flex items-center justify-center my-4">
                    <div className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-600">
                      {formatDate(message.timestamp)}
                    </div>
                  </div>
                )}
                
                {/* Message */}
                <div className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.sender === 'admin'
                        ? 'bg-cyan-700 text-white'
                        : message.sender === 'system'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.sender === 'customer' && (
                      <div className="flex items-center mb-1">
                        <User className="w-3 h-3 mr-1 opacity-60" />
                        <span className="text-xs font-medium opacity-80">
                          {selectedChat.customerName}
                        </span>
                      </div>
                    )}
                    
                    <p className="text-sm leading-relaxed">{message.message}</p>
                    
                    {/* Message metadata */}
                    <div className={`flex items-center justify-between mt-2 text-xs ${
                      message.sender === 'admin' ? 'text-cyan-200' : 'text-gray-500'
                    }`}>
                      <span>{formatTime(message.timestamp)}</span>
                      {message.sender === 'admin' && (
                        <div className="flex items-center ml-2">
                          <div className="w-1 h-1 bg-current rounded-full mr-1"></div>
                          <span>Sent</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No messages yet</p>
              <p className="text-sm mt-1">Start the conversation!</p>
            </div>
          </div>
        )}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2 rounded-2xl">
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-gray-500 ml-2">Customer is typing...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="px-4 py-2 border-t bg-gray-50">
        <div className="flex flex-wrap gap-1">
          {quickReplies.slice(0, 3).map((reply, index) => (
            <button
              key={index}
              onClick={() => setNewMessage(reply)}
              className="text-xs bg-white hover:bg-gray-100 text-gray-600 px-2 py-1 rounded-full border transition-colors"
            >
              {reply.length > 30 ? reply.substring(0, 30) + '...' : reply}
            </button>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-cyan-700 hover:bg-cyan-800 disabled:bg-gray-300 text-white p-2 rounded-full transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Press Enter to send • Click quick replies above for common responses
        </p>
      </form>

      {/* Order Creation Modal */}
      {showOrderForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Create New Order</h3>
                <button
                  onClick={() => setShowOrderForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleCreateOrder} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer
                  </label>
                  <input
                    type="text"
                    value={selectedChat.customerName}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Package Description *
                  </label>
                  <input
                    type="text"
                    value={orderForm.description}
                    onChange={(e) => setOrderForm({...orderForm, description: e.target.value})}
                    placeholder="e.g., Electronics package, Documents, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
                    placeholder="Full delivery address including city, state, and postal code"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Delivery Date
                  </label>
                  <input
                    type="datetime-local"
                    value={orderForm.estimatedDelivery}
                    onChange={(e) => setOrderForm({...orderForm, estimatedDelivery: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowOrderForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-cyan-700 hover:bg-cyan-800 text-white px-6 py-2 rounded-lg font-medium transition-colors"
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