import mongoose from 'mongoose';

const StatusUpdateSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    enum: ['created', 'processing', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String,
    default: ''
  }
});

const OrderSchema = new mongoose.Schema({
  trackingId: {
    type: String
    // Remove unique: true since we define it explicitly in the index below
    // This prevents duplicate index warnings
  },
  chatSessionId: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    default: 'Anonymous Customer'
  },
  description: {
    type: String,
    required: true
  },
  currentStatus: {
    type: String,
    default: 'created',
    enum: ['created', 'processing', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled']
  },
  statusHistory: [StatusUpdateSchema],
  pickupAddress: {
    type: String,
    default: ''
  },
  deliveryAddress: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  estimatedDelivery: {
    type: Date
  }
});

// Generate tracking ID before validation
OrderSchema.pre('validate', function(next) {
  if (!this.trackingId && this.isNew) {
    this.trackingId = 'HX' + Date.now().toString() + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  }
  next();
});

// Add initial status to history
OrderSchema.pre('save', function(next) {
  if (this.isNew && this.statusHistory.length === 0) {
    this.statusHistory.push({
      status: 'created',
      timestamp: new Date(),
      note: 'Order created'
    });
  }
  next();
});

// Define indexes explicitly to avoid duplicates
OrderSchema.index({ trackingId: 1 }, { unique: true, sparse: true });
OrderSchema.index({ chatSessionId: 1 });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);