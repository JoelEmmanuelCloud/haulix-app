'use client';

import { useState } from 'react';
import { 
  Package, 
  Clock, 
  Truck, 
  MapPin, 
  CheckCircle, 
  XCircle,
  Calendar,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const statusConfig = {
  created: {
    icon: Package,
    label: 'Order Created',
    color: 'blue',
    description: 'Your order has been received and is being prepared'
  },
  processing: {
    icon: Clock,
    label: 'Processing',
    color: 'yellow',
    description: 'We are preparing your package for shipment'
  },
  in_transit: {
    icon: Truck,
    label: 'In Transit',
    color: 'purple',
    description: 'Your package is on its way to the destination'
  },
  out_for_delivery: {
    icon: MapPin,
    label: 'Out for Delivery',
    color: 'orange',
    description: 'Your package is out for delivery and will arrive soon'
  },
  delivered: {
    icon: CheckCircle,
    label: 'Delivered',
    color: 'green',
    description: 'Your package has been successfully delivered'
  },
  cancelled: {
    icon: XCircle,
    label: 'Cancelled',
    color: 'red',
    description: 'This order has been cancelled'
  }
};

const colorVariants = {
  blue: {
    active: 'bg-blue-500 text-white ring-blue-200',
    completed: 'bg-blue-500 text-white',
    pending: 'bg-gray-200 text-gray-500',
    line: 'border-blue-300'
  },
  yellow: {
    active: 'bg-yellow-500 text-white ring-yellow-200',
    completed: 'bg-green-500 text-white',
    pending: 'bg-gray-200 text-gray-500',
    line: 'border-yellow-300'
  },
  purple: {
    active: 'bg-purple-500 text-white ring-purple-200',
    completed: 'bg-green-500 text-white',
    pending: 'bg-gray-200 text-gray-500',
    line: 'border-purple-300'
  },
  orange: {
    active: 'bg-orange-500 text-white ring-orange-200',
    completed: 'bg-green-500 text-white',
    pending: 'bg-gray-200 text-gray-500',
    line: 'border-orange-300'
  },
  green: {
    active: 'bg-green-500 text-white ring-green-200',
    completed: 'bg-green-500 text-white',
    pending: 'bg-gray-200 text-gray-500',
    line: 'border-green-300'
  },
  red: {
    active: 'bg-red-500 text-white ring-red-200',
    completed: 'bg-red-500 text-white',
    pending: 'bg-gray-200 text-gray-500',
    line: 'border-red-300'
  }
};

export default function OrderTimeline({ order, showDetails = true, compact = false }) {
  const [expandedStatus, setExpandedStatus] = useState(null);
  const [showAllStatuses, setShowAllStatuses] = useState(false);

  if (!order) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <Package className="w-12 h-12 mx-auto text-gray-400 mb-3" />
        <p className="text-gray-600">No order information available</p>
      </div>
    );
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const getStatusIndex = (status) => {
    const statusOrder = ['created', 'processing', 'in_transit', 'out_for_delivery', 'delivered'];
    return statusOrder.indexOf(status);
  };

  const getStatusState = (status, currentStatus) => {
    if (status === 'cancelled') {
      return currentStatus === 'cancelled' ? 'active' : 'pending';
    }
    
    const statusIndex = getStatusIndex(status);
    const currentIndex = getStatusIndex(currentStatus);
    
    if (statusIndex < currentIndex) return 'completed';
    if (statusIndex === currentIndex) return 'active';
    return 'pending';
  };

  const getAllStatuses = () => {
    const allStatuses = ['created', 'processing', 'in_transit', 'out_for_delivery', 'delivered'];
    return allStatuses.map(status => {
      const historyEntry = order.statusHistory.find(h => h.status === status);
      return {
        status,
        ...statusConfig[status],
        timestamp: historyEntry?.timestamp,
        note: historyEntry?.note,
        state: getStatusState(status, order.currentStatus)
      };
    });
  };

  const displayStatuses = showAllStatuses ? getAllStatuses() : order.statusHistory.map(status => ({
    ...status,
    ...statusConfig[status.status],
    state: getStatusState(status.status, order.currentStatus)
  }));

  if (compact) {
    return (
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Order Status</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            order.currentStatus === 'delivered' ? 'bg-green-100 text-green-800' :
            order.currentStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {statusConfig[order.currentStatus]?.label}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {getAllStatuses().slice(0, 4).map((statusItem, index) => {
            const IconComponent = statusItem.icon;
            const colors = colorVariants[statusItem.color];
            
            return (
              <div key={statusItem.status} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colors[statusItem.state]}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                {index < 3 && (
                  <div className={`w-6 h-0.5 ${statusItem.state === 'completed' ? 'bg-green-300' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {showDetails && (
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Order Timeline</h2>
            <button
              onClick={() => setShowAllStatuses(!showAllStatuses)}
              className="text-sm text-cyan-600 hover:text-cyan-800 flex items-center"
            >
              {showAllStatuses ? 'Show History Only' : 'Show All Statuses'}
              {showAllStatuses ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Tracking ID:</span>
              <p className="font-mono font-semibold">{order.trackingId}</p>
            </div>
            <div>
              <span className="text-gray-600">Current Status:</span>
              <p className="font-semibold">{statusConfig[order.currentStatus]?.label}</p>
            </div>
            <div>
              <span className="text-gray-600">Last Updated:</span>
              <p className="font-semibold">
                {order.statusHistory.length > 0 && 
                  formatDateTime(order.statusHistory[order.statusHistory.length - 1].timestamp).time
                }
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="space-y-6">
          {displayStatuses.map((statusItem, index) => {
            const IconComponent = statusItem.icon;
            const colors = colorVariants[statusItem.color];
            const isExpanded = expandedStatus === index;
            const hasNote = statusItem.note && statusItem.note.trim();
            
            return (
              <div key={index} className="relative">
                {/* Connection Line */}
                {index < displayStatuses.length - 1 && (
                  <div 
                    className={`absolute left-5 top-12 w-0.5 h-6 ${
                      statusItem.state === 'completed' ? 'bg-green-300' : 'bg-gray-200'
                    }`}
                  />
                )}
                
                <div className="flex items-start space-x-4">
                  {/* Status Icon */}
                  <div className={`relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    colors[statusItem.state]
                  } ${statusItem.state === 'active' ? 'ring-4 ring-opacity-30' : ''}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  
                  {/* Status Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {statusItem.label}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {statusItem.description}
                        </p>
                      </div>
                      
                      {statusItem.timestamp && (
                        <div className="text-right text-sm text-gray-500 ml-4">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDateTime(statusItem.timestamp).date}
                          </div>
                          <div className="mt-1">
                            {formatDateTime(statusItem.timestamp).time}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Status Note */}
                    {hasNote && (
                      <div className="mt-3">
                        <button
                          onClick={() => setExpandedStatus(isExpanded ? null : index)}
                          className="flex items-center text-sm text-cyan-600 hover:text-cyan-800"
                        >
                          <Info className="w-4 h-4 mr-1" />
                          {isExpanded ? 'Hide details' : 'Show details'}
                        </button>
                        
                        {isExpanded && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">{statusItem.note}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Estimated Delivery (for delivered status) */}
                    {statusItem.status === 'delivered' && order.estimatedDelivery && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Delivered on schedule</span>
                        {order.estimatedDelivery && (
                          <span className="ml-2">
                            (Est: {formatDateTime(order.estimatedDelivery).date})
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Delivery Information */}
        {order.deliveryAddress && (
          <div className="mt-8 pt-6 border-t">
            <h4 className="font-semibold text-gray-900 mb-2">Delivery Information</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Delivery Address:</span>
                  <p className="mt-1">{order.deliveryAddress}</p>
                </div>
                {order.pickupAddress && (
                  <div>
                    <span className="text-gray-600">Pickup Address:</span>
                    <p className="mt-1">{order.pickupAddress}</p>
                  </div>
                )}
              </div>
              
              {order.estimatedDelivery && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <span className="text-gray-600 text-sm">Estimated Delivery:</span>
                  <p className="font-semibold">
                    {formatDateTime(order.estimatedDelivery).date} at {formatDateTime(order.estimatedDelivery).time}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-6 pt-6 border-t">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-blue-900">Need Help?</h5>
                <p className="text-sm text-blue-800 mt-1">
                  If you have questions about your shipment or need to make changes, 
                  our support team is available 24/7 through live chat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}