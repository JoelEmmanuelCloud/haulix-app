import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
    enum: ['customer', 'admin']
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ChatSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true
    // Remove any unique: true or index: true to avoid duplicate index warnings
  },
  customerName: {
    type: String,
    default: 'Anonymous Customer'
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'closed']
  },
  messages: [MessageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update lastActivity when messages are added
ChatSchema.pre('save', function(next) {
  if (this.isModified('messages')) {
    this.lastActivity = new Date();
  }
  next();
});

// Define all indexes explicitly to avoid duplicates
ChatSchema.index({ sessionId: 1 }, { unique: true });
ChatSchema.index({ lastActivity: -1 });
ChatSchema.index({ status: 1, lastActivity: -1 }); // Compound index for efficient queries

export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema);