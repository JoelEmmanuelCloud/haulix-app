'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { io } from 'socket.io-client';
import { Package, Search, CheckCircle, Clock, Truck, MapPin, Home } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const statusIcons = {
  created: Package,
  processing: Clock,
  in_transit: Truck,
  out_for_delivery: MapPin,
  delivered: CheckCircle,
  cancelled: Package
};

const statusColors = {
  created: 'bg-blue-100 text-blue-800',
  processing: 'bg-yellow-100 text-yellow-800',
  in_transit: 'bg-purple-100 text-purple-800',
  out_for_delivery: 'bg-orange-100 text-orange-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const statusLabels = {
  created: 'Order Created',
  processing: 'Processing',
  in_transit: 'In Transit',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};

// Separate component that uses useSearchParams
function TrackContent() {
  const searchParams = useSearchParams();
  const [trackingId, setTrackingId] = useState(searchParams?.get('id') || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize socket for real-time updates
    const newSocket = io(process.env.NODE_ENV === 'production' ? 'https://haulix.delivery' : 'http://localhost:3000');
    
    newSocket.on('tracking_update', (data) => {
      if (order && data.trackingId === order.trackingId) {
        // Update order status in real-time
        setOrder(prev => ({
          ...prev,
          currentStatus: data.status,
          statusHistory: [
            ...prev.statusHistory,
            {
              status: data.status,
              timestamp: new Date(data.timestamp),
              note: data.note || ''
            }
          ]
        }));
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [order]);

  useEffect(() => {
    if (trackingId) {
      handleTrackSubmit();
    }
  }, []);

  const handleTrackSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!trackingId.trim()) {
      setError('Please enter a tracking ID');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const response = await fetch(`/api/orders?trackingId=${trackingId.trim()}`);
      const data = await response.json();

      if (response.ok && data.order) {
        setOrder(data.order);
      } else {
        setError(data.error || 'Order not found. Please check your tracking ID.');
      }
    } catch (error) {
      setError('Unable to fetch tracking information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIndex = (status) => {
    const statuses = ['created', 'processing', 'in_transit', 'out_for_delivery', 'delivered'];
    return statuses.indexOf(status);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-Optimized Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-center sm:justify-start">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Image
                src="/images/logo.svg"
                alt="Haulix Logo"
                width={120}
                height={16}
                className="w-auto h-8 sm:h-12 md:h-16"
              />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile-Optimized Main Content */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            Track Your Shipment
          </h1>
          <p className="text-sm sm:text-lg md:text-xl text-gray-600 px-2">
            Enter your tracking ID to see real-time updates on your order
          </p>
        </div>

        {/* Mobile-Optimized Search Form */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <form onSubmit={handleTrackSubmit} className="space-y-4 sm:space-y-0 sm:flex sm:gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter tracking ID (e.g., HX123456789)"
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-base sm:text-lg"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-cyan-700 hover:bg-cyan-800 disabled:bg-gray-400 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  <span className="hidden sm:inline">Track Package</span>
                  <span className="sm:hidden">Track</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-6 sm:mb-8">
            <p className="text-red-800 text-sm sm:text-base">{error}</p>
          </div>
        )}

        {/* Order Information */}
        {order && (
          <div className="space-y-4 sm:space-y-6">
            {/* Mobile-Optimized Order Summary */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Order Details</h2>
                <span className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold ${statusColors[order.currentStatus]} text-center`}>
                  {statusLabels[order.currentStatus]}
                </span>
              </div>
              
              <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Tracking Information</h3>
                  <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                    <p>Tracking ID: <span className="font-mono font-semibold break-all">{order.trackingId}</span></p>
                    <p>Order Date: {formatDate(order.createdAt)}</p>
                    <p>Customer: {order.customerName}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Delivery Information</h3>
                  <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                    <p>Description: {order.description}</p>
                    <p>Delivery Address: <span className="break-words">{order.deliveryAddress}</span></p>
                    {order.estimatedDelivery && (
                      <p>Est. Delivery: {formatDate(order.estimatedDelivery)}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile-Optimized Status Timeline */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Tracking Timeline</h2>
              
              <div className="space-y-3 sm:space-y-4">
                {order.statusHistory.map((status, index) => {
                  const StatusIcon = statusIcons[status.status] || Package;
                  const isActive = status.status === order.currentStatus;
                  const isPast = getStatusIndex(status.status) < getStatusIndex(order.currentStatus);
                  
                  return (
                    <div key={index} className="flex items-start">
                      <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                        isActive ? 'bg-cyan-700 text-white' :
                        isPast ? 'bg-green-500 text-white' :
                        'bg-gray-200 text-gray-500'
                      }`}>
                        <StatusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      
                      <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <h3 className={`font-semibold text-sm sm:text-base ${
                            isActive ? 'text-cyan-700' : 
                            isPast ? 'text-green-600' : 
                            'text-gray-500'
                          }`}>
                            {statusLabels[status.status]}
                          </h3>
                          <span className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-0">
                            {formatDate(status.timestamp)}
                          </span>
                        </div>
                        
                        {status.note && (
                          <p className="text-gray-600 text-xs sm:text-sm mt-1">{status.note}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Updates Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full animate-pulse mr-2 sm:mr-3 flex-shrink-0"></div>
                <p className="text-blue-800 text-xs sm:text-sm">
                  This page updates automatically when your package status changes
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mobile-Optimized Help Section */}
        <div className="bg-gradient-to-r from-cyan-700 to-blue-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 mt-6 sm:mt-8 text-center">
          <h3 className="text-lg sm:text-2xl font-bold text-white mb-2 sm:mb-4">Need Help?</h3>
          <p className="text-gray-200 mb-4 sm:mb-6 text-sm sm:text-base px-2">
            Have questions about your shipment? Our support team is here to help!
          </p>
          <Link 
            href="/"
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors inline-block text-sm sm:text-base"
          >
            Chat with Support
          </Link>
        </div>
      </main>
    </div>
  );
}

// Mobile-Optimized Loading component
function TrackingPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-center sm:justify-start">
            <div className="w-32 sm:w-48 h-8 sm:h-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-64 sm:w-96 h-8 sm:h-10 bg-gray-200 rounded mx-auto mb-2 sm:mb-4 animate-pulse"></div>
          <div className="w-48 sm:w-80 h-4 sm:h-6 bg-gray-200 rounded mx-auto animate-pulse"></div>
        </div>

        {/* Search Form Skeleton */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="space-y-4 sm:space-y-0 sm:flex sm:gap-4">
            <div className="flex-1">
              <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="w-full sm:w-32 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Main export with Suspense boundary
export default function TrackPage() {
  return (
    <Suspense fallback={<TrackingPageSkeleton />}>
      <TrackContent />
    </Suspense>
  );
}