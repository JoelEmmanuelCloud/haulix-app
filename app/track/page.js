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
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-start">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Image
                src="/images/logo.svg"
                alt="Haulix Logo"
                width={180}
                height={24}
                className="w-auto h-16 sm:h-24"
              />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Shipment</h1>
          <p className="text-xl text-gray-600">
            Enter your tracking ID to see real-time updates on your order
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <form onSubmit={handleTrackSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter tracking ID (e.g., HX123456789)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-lg"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-cyan-700 hover:bg-cyan-800 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Track Package
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Order Information */}
        {order && (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColors[order.currentStatus]}`}>
                  {statusLabels[order.currentStatus]}
                </span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Tracking Information</h3>
                  <p className="text-gray-600">Tracking ID: <span className="font-mono font-semibold">{order.trackingId}</span></p>
                  <p className="text-gray-600">Order Date: {formatDate(order.createdAt)}</p>
                  <p className="text-gray-600">Customer: {order.customerName}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Delivery Information</h3>
                  <p className="text-gray-600">Description: {order.description}</p>
                  <p className="text-gray-600">Delivery Address: {order.deliveryAddress}</p>
                  {order.estimatedDelivery && (
                    <p className="text-gray-600">Est. Delivery: {formatDate(order.estimatedDelivery)}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tracking Timeline</h2>
              
              <div className="space-y-4">
                {order.statusHistory.map((status, index) => {
                  const StatusIcon = statusIcons[status.status] || Package;
                  const isActive = status.status === order.currentStatus;
                  const isPast = getStatusIndex(status.status) < getStatusIndex(order.currentStatus);
                  
                  return (
                    <div key={index} className="flex items-start">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        isActive ? 'bg-cyan-700 text-white' :
                        isPast ? 'bg-green-500 text-white' :
                        'bg-gray-200 text-gray-500'
                      }`}>
                        <StatusIcon className="w-5 h-5" />
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-semibold ${
                            isActive ? 'text-cyan-700' : 
                            isPast ? 'text-green-600' : 
                            'text-gray-500'
                          }`}>
                            {statusLabels[status.status]}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {formatDate(status.timestamp)}
                          </span>
                        </div>
                        
                        {status.note && (
                          <p className="text-gray-600 text-sm mt-1">{status.note}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Updates Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse mr-3"></div>
                <p className="text-blue-800">
                  This page updates automatically when your package status changes
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-gradient-to-r from-cyan-700 to-blue-800 rounded-2xl p-6 mt-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Need Help?</h3>
          <p className="text-gray-200 mb-6">
            Have questions about your shipment? Our support team is here to help!
          </p>
          <Link 
            href="/"
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
          >
            Chat with Support
          </Link>
        </div>
      </main>
    </div>
  );
}

// Loading component for Suspense fallback
function TrackingPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-start">
            <div className="w-48 h-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-96 h-10 bg-gray-200 rounded mx-auto mb-4 animate-pulse"></div>
          <div className="w-80 h-6 bg-gray-200 rounded mx-auto animate-pulse"></div>
        </div>

        {/* Search Form Skeleton */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="w-40 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
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