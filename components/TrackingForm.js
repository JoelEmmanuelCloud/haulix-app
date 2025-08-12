'use client';

import { useState, useEffect } from 'react';
import { Search, Package, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import OrderTimeline from './OrderTimeline';

export default function TrackingForm({ initialTrackingId = '', autoSubmit = false }) {
  const [trackingId, setTrackingId] = useState(initialTrackingId);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Auto-submit if tracking ID is provided and autoSubmit is true
  useEffect(() => {
    if (initialTrackingId && autoSubmit) {
      handleSubmit();
    }
  }, [initialTrackingId, autoSubmit]);

  const validateTrackingId = (id) => {
    if (!id) return 'Please enter a tracking ID';
    if (id.length < 3) return 'Tracking ID is too short';
    if (!/^[A-Za-z0-9]+$/.test(id)) return 'Tracking ID can only contain letters and numbers';
    return null;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    const validation = validateTrackingId(trackingId.trim());
    if (validation) {
      setError(validation);
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/orders?trackingId=${trackingId.trim().toUpperCase()}`);
      const data = await response.json();

      if (response.ok && data.order) {
        setOrder(data.order);
        setError('');
      } else {
        setError(data.error || 'Order not found. Please verify your tracking ID and try again.');
        setOrder(null);
      }
    } catch (error) {
      console.error('Tracking error:', error);
      setError('Unable to fetch tracking information. Please check your connection and try again.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setTrackingId('');
    setOrder(null);
    setError('');
    setHasSearched(false);
  };

  const handleRefresh = () => {
    if (trackingId.trim()) {
      handleSubmit();
    }
  };

  const formatTrackingId = (value) => {
    // Auto-format tracking ID as user types
    return value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  };

  const getTrackingIdExample = () => {
    const examples = ['HX1234567890', 'HX9876543210', 'HX5555444433'];
    return examples[Math.floor(Math.random() * examples.length)];
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Form */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-cyan-100 p-3 rounded-full">
              <Package className="w-8 h-8 text-cyan-700" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Track Your Package</h2>
          <p className="text-gray-600">
            Enter your tracking ID to see real-time updates on your shipment
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="trackingId" className="block text-sm font-medium text-gray-700 mb-2">
              Tracking ID
            </label>
            <div className="relative">
              <input
                id="trackingId"
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(formatTrackingId(e.target.value))}
                placeholder={`e.g., ${getTrackingIdExample()}`}
                className="w-full px-4 py-3 pl-12 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-lg font-mono"
                disabled={loading}
                maxLength={20}
              />
              <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              
              {trackingId && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
            
            {/* Tracking ID Format Help */}
            <div className="mt-2 text-sm text-gray-500">
              <p>Haulix tracking IDs start with "HX" followed by numbers (e.g., HX1234567890)</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={loading || !trackingId.trim()}
              className="flex-1 bg-cyan-700 hover:bg-cyan-800 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Tracking...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Track Package
                </>
              )}
            </button>
            
            {hasSearched && (
              <button
                type="button"
                onClick={handleRefresh}
                disabled={loading || !trackingId.trim()}
                className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            )}
          </div>
        </form>

        {/* Quick Tips */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Tips:</h4>
          <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-600">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p>Check your email for the tracking ID after placing an order</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p>Tracking information updates automatically in real-time</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p>Contact support if you need help with your shipment</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p>Bookmark this page for easy tracking access</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-red-800 font-medium">Tracking Error</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
              
              {error.includes('not found') && (
                <div className="mt-3 text-sm text-red-700">
                  <p className="font-medium mb-1">Common issues:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Double-check the tracking ID for typos</li>
                    <li>Make sure you're using the complete tracking ID</li>
                    <li>New orders may take a few minutes to appear in tracking</li>
                    <li>Contact support if the problem persists</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* No Results Message */}
      {hasSearched && !loading && !error && !order && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
          <p className="text-gray-600 mb-4">
            We couldn't find any shipment with tracking ID: <span className="font-mono font-semibold">{trackingId}</span>
          </p>
          <button
            onClick={handleClear}
            className="text-cyan-600 hover:text-cyan-800 font-medium"
          >
            Try a different tracking ID
          </button>
        </div>
      )}

      {/* Order Results */}
      {order && (
        <div className="space-y-6">
          {/* Order Summary Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Shipment Found!</h3>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.currentStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.currentStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                  order.currentStatus === 'out_for_delivery' ? 'bg-orange-100 text-orange-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {order.currentStatus === 'delivered' ? '✓ Delivered' :
                   order.currentStatus === 'cancelled' ? '✗ Cancelled' :
                   order.currentStatus === 'out_for_delivery' ? '🚚 Out for Delivery' :
                   order.currentStatus === 'in_transit' ? '📦 In Transit' :
                   order.currentStatus === 'processing' ? '⏳ Processing' :
                   '📋 Created'
                  }
                </span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Tracking ID:</span>
                <p className="font-mono font-semibold text-lg">{order.trackingId}</p>
              </div>
              <div>
                <span className="text-gray-600">Customer:</span>
                <p className="font-semibold">{order.customerName}</p>
              </div>
              <div>
                <span className="text-gray-600">Package:</span>
                <p className="font-semibold">{order.description}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <OrderTimeline order={order} />

          {/* Actions */}
          <div className="bg-gradient-to-r from-cyan-700 to-blue-800 rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold text-white mb-3">Need Help?</h3>
            <p className="text-gray-200 mb-4">
              Have questions about your shipment? Our support team is here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a 
                href="/"
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
              >
                Chat with Support
              </a>
              <button
                onClick={() => {
                  const url = `/track?id=${order.trackingId}`;
                  navigator.clipboard.writeText(window.location.origin + url);
                  alert('Tracking link copied to clipboard!');
                }}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Share Tracking Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Updates Notice */}
      {order && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse mr-3"></div>
            <p className="text-blue-800 text-sm">
              This page updates automatically when your package status changes. 
              No need to refresh manually!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}