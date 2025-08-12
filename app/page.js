'use client';

import { useState } from 'react';
import Image from 'next/image';
import ChatWidget from '../components/ChatWidget';
import { Truck, MessageCircle, Search, Clock, Shield, Zap, Award, Users, Globe } from 'lucide-react';

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
      <section className="relative min-h-screen flex items-center justify-center text-center text-white overflow-hidden px-4 py-8">
        {/* Background Image */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600"></div>
        <div 
          className="absolute inset-0 bg-[url('https://images.pexels.com/photos/753331/pexels-photo-753331.jpeg?auto=compress&cs=tinysrgb&w=2070&h=1380&dpr=1')] bg-cover bg-center bg-no-repeat opacity-60"
        ></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-4xl w-full">
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <Image
              src="/images/logo.png"
              alt="Haulix Logo"
              width={460}
              height={280}
              className="h-60 w-auto object-contain"
            />
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 leading-tight px-2 text-white">
                Fast, Reliable Shipping Support
          </h2>
          <p className="mb-6 sm:mb-8 text-base sm:text-lg md:text-xl lg:text-2x text-white max-w-2xl mx-auto px-2">
            Chat with us in real-time to arrange your delivery or track your shipment instantly. Professional logistics support at your fingertips.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-2">
            <button 
              onClick={() => setShowChat(true)}
              className="w-full sm:w-auto bg-cyan-700 hover:bg-cyan-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center text-base sm:text-lg font-semibold transform hover:scale-105"
            >
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              Chat with Support
            </button>
            <a 
              href="/track" 
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center text-base sm:text-lg font-semibold transform hover:scale-105"
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              Track Shipment
            </a>
          </div>

          {/* Quick Track Form */}
          <div className="max-w-sm sm:max-w-md mx-auto px-2">
            <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <input
                type="text"
                placeholder="Enter tracking ID (e.g., HX123456789)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-l-lg sm:rounded-r-none border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-amber-400 focus:outline-none text-sm sm:text-base"
              />
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-r-lg sm:rounded-l-none text-white font-semibold transition-colors text-sm sm:text-base"
              >
                Track
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">Why Choose Haulix?</h3>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              We provide professional shipping and delivery solutions with real-time support and transparent tracking.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-cyan-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-700" />
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Instant Support</h4>
              <p className="text-gray-600 text-base sm:text-lg">
                Get immediate help through our real-time chat system. Our support team responds instantly to your shipping questions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-amber-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Real-time Tracking</h4>
              <p className="text-gray-600 text-base sm:text-lg">
                Monitor your shipments with live updates. Get notified instantly when your package status changes.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
              <div className="bg-green-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Secure & Reliable</h4>
              <p className="text-gray-600 text-base sm:text-lg">
                Your packages are handled with care and security. Professional logistics with complete transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Info Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-center lg:text-left">Trusted by Global Leaders</h3>
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed text-center lg:text-left">
                Since 2008, Haulix has been the preferred shipping partner for multinational corporations, e-commerce businesses, and manufacturing companies. Our extensive network spans six continents, ensuring your cargo reaches any destination efficiently and securely.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="flex items-center justify-center lg:justify-start">
                  <Award className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-sm sm:text-base">Industry Awards</div>
                    <div className="text-gray-400 text-xs sm:text-sm">Excellence in Logistics 2024</div>
                  </div>
                </div>
                <div className="flex items-center justify-center lg:justify-start">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-sm sm:text-base">Expert Team</div>
                    <div className="text-gray-400 text-xs sm:text-sm">500+ Logistics Professionals</div>
                  </div>
                </div>
                <div className="flex items-center justify-center lg:justify-start">
                  <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-sm sm:text-base">Global Network</div>
                    <div className="text-gray-400 text-xs sm:text-sm">250+ Partner Facilities</div>
                  </div>
                </div>
                <div className="flex items-center justify-center lg:justify-start">
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-sm sm:text-base">Compliance</div>
                    <div className="text-gray-400 text-xs sm:text-sm">C-TPAT & AEO Certified</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative order-1 lg:order-2">
              <img 
                src="https://images.unsplash.com/photo-1494412651409-8963ce7935a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Professional shipping operations center" 
                className="rounded-2xl shadow-2xl w-full h-64 sm:h-80 lg:h-96 object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl"></div>
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white">
                <h4 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Operations Center</h4>
                <p className="text-gray-200 text-sm sm:text-base">24/7 monitoring and coordination hub</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="text-center lg:text-left order-2 lg:order-1">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">Ready to Ship?</h3>
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8">
                Start a conversation with our support team to arrange your shipment or get answers to your questions.
              </p>
              <button 
                onClick={() => setShowChat(true)}
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg shadow-lg transition-all duration-300 text-base sm:text-lg font-semibold transform hover:scale-105"
              >
                Start Chatting Now
              </button>
            </div>
            <div className="relative order-1 lg:order-2">
              <img 
                src="https://images.pexels.com/photos/6682873/pexels-photo-6682873.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1" 
                alt="Professional delivery service - woman receiving flowers from deliveryman" 
                className="rounded-2xl shadow-2xl w-full h-64 sm:h-72 lg:h-80 object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Widget */}
      {showChat && <ChatWidget onClose={() => setShowChat(false)} />}

      {/* Admin Access Link - Subtle Footer */}
      <footer className="bg-gray-900 text-gray-400 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0">
              <Image
                src="/images/logo.png"
                alt="Haulix Logo"
                width={180}
                height={60}
                className="h-24 w-auto object-contain"
              />
              <span className="text-xs sm:text-sm sm:ml-2">© 2025 Professional Shipping Solutions</span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <span className="text-xs sm:text-sm text-center">Need support? Chat with us above!</span>
              <div className="border-t sm:border-t-0 sm:border-l border-gray-700 pt-4 sm:pt-0 sm:pl-6">
                <a 
                  href="/admin/login"
                  className="text-gray-500 hover:text-gray-300 text-xs sm:text-sm transition-colors"
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