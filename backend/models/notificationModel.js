const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  recipientRole: {
    type: String,
    required: true,
    enum: ['administrator', 'driver', 'vehicle deployer', 'fuel manager', 'dean', 'vehicle manage']
  },
  recipientEmail: {
    type: String,
    required: false // Optional - for user-specific notifications
  },
  type: {
    type: String,
    required: true,
    enum: ['mission_assigned', 'mission_acknowledged', 'mission_completed', 'fuel_request', 'fuel_approved', 'fuel_declined', 'user_approved', 'user_declined']
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedData: {
    type: Schema.Types.Mixed, // Store related IDs, names, etc.
    default: {}
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  }
}, { timestamps: true });

// Index for efficient queries
notificationSchema.index({ recipientRole: 1, recipientEmail: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);

