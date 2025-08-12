'use client';

import { useState } from 'react';
import ChatWidget from '@/components/ChatWidget';
import { Truck, MessageCircle, Search, Clock, Shield, Zap } from 'lucide-react';

export default function HomePage() {
  const [showChat, setShowChat] = useState(false);
  const [trackingId, setTrackingId] = useState('');

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (trackingId.trim()) {
      window.location.href = `/track?id=${trackingId.trim()}`;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600"></div>
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center bg-no-repeat opacity-20"
        ></div>
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-4xl px-4">
          <div className="flex items-center justify-center mb-6">
            <Truck className="w-16 h-16 text-amber-400 mr-4" />
            <h1 className="text-6xl font-bold text-white">Haulix</h1>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Fast, Reliable Shipping Support
          </h2>
          <p className="mb-8 text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
            Chat with us in real-time to arrange your delivery or track your shipment instantly. Professional logistics support at your fingertips.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12">
            <button 
              onClick={() => setShowChat(true)}
              className="bg-cyan-700 hover:bg-cyan-800 text-white px-8 py-4 rounded-lg shadow-lg transition-all duration-300 flex items-center text-lg font-semibold transform hover:scale-105"
            >
              <MessageCircle className="w-6 h-6 mr-2" />
              Chat with Support
            </button>
            <a 
              href="/track" 
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg shadow-lg transition-all duration-300 flex items-center text-lg font-semibold transform hover:scale-105"
            >
              <Search className="w-6 h-6 mr-2" />
              Track Shipment
            </a>
          </div>

          {/* Quick Track Form */}
          <div className="max-w-md mx-auto">
            <form onSubmit={handleTrackSubmit} className="flex">
              <input
                type="text"
                placeholder="Enter tracking ID (e.g., HX123456789)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="flex-1 px-4 py-3 rounded-l-lg border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-amber-400 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 px-6 py-3 rounded-r-lg text-white font-semibold transition-colors"
              >
                Track
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Haulix?</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide professional shipping and delivery solutions with real-time support and transparent tracking.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-cyan-700" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Instant Support</h4>
              <p className="text-gray-600 text-lg">
                Get immediate help through our real-time chat system. Our support team responds instantly to your shipping questions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Real-time Tracking</h4>
              <p className="text-gray-600 text-lg">
                Monitor your shipments with live updates. Get notified instantly when your package status changes.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Secure & Reliable</h4>
              <p className="text-gray-600 text-lg">
                Your packages are handled with care and security. Professional logistics with complete transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-700 to-blue-800">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-4xl font-bold text-white mb-6">Ready to Ship?</h3>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Start a conversation with our support team to arrange your shipment or get answers to your questions.
          </p>
          <button 
            onClick={() => setShowChat(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg shadow-lg transition-all duration-300 text-lg font-semibold transform hover:scale-105"
          >
            Start Chatting Now
          </button>
        </div>
      </section>

      {/* Chat Widget */}
      {showChat && <ChatWidget onClose={() => setShowChat(false)} />}

      {/* Admin Access Link - Subtle Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Truck className="w-6 h-6 text-cyan-400 mr-2" />
              <span className="text-white font-semibold">Haulix</span>
              <span className="ml-2 text-sm">© 2025 Professional Shipping Solutions</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <span className="text-sm">Need support? Chat with us above!</span>
              <div className="border-l border-gray-700 pl-6">
                <a 
                  href="/admin/login"
                  className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                >
                  Staff Login
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}