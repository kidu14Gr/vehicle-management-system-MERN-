const Notification = require('../models/notificationModel');

// Get notifications for a user based on role and optionally email
const getNotifications = async (req, res) => {
  try {
    const { role, email } = req.query;
    
    if (!role) {
      return res.status(400).json({ error: 'Role is required' });
    }

    // Build query: role must match, and either:
    // 1. recipientEmail is null/undefined (role-wide notification), OR
    // 2. recipientEmail matches the user's email (user-specific notification)
    const emailConditions = [
      { recipientEmail: null },
      { recipientEmail: { $exists: false } }
    ];
    
    // If email is provided, also include user-specific notifications
    if (email) {
      emailConditions.push({ recipientEmail: email });
    }

    const query = { 
      recipientRole: role,
      $or: emailConditions
    };

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(50); // Limit to most recent 50

    const unreadCountQuery = { 
      recipientRole: role,
      read: false,
      $or: emailConditions
    };

    const unreadCount = await Notification.countDocuments(unreadCountQuery);

    console.log(`Fetched ${notifications.length} notifications for role: ${role}, email: ${email || 'none'}, unread: ${unreadCount}`);
    if (notifications.length > 0) {
      console.log('Sample notification:', {
        id: notifications[0]._id,
        type: notifications[0].type,
        recipientRole: notifications[0].recipientRole,
        recipientEmail: notifications[0].recipientEmail,
        read: notifications[0].read
      });
    }

    res.status(200).json({
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.status(200).json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mark all notifications as read for a user
const markAllAsRead = async (req, res) => {
  try {
    const { role, email } = req.body;
    
    if (!role) {
      return res.status(400).json({ error: 'Role is required' });
    }

    const query = { recipientRole: role, read: false };
    if (email) {
      query.recipientEmail = email;
    }

    await Notification.updateMany(query, {
      read: true,
      readAt: new Date()
    });

    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a notification (internal use - called by other controllers)
const createNotification = async (recipientRole, recipientEmail, type, title, message, relatedData = {}) => {
  try {
    const notification = await Notification.create({
      recipientRole,
      recipientEmail: recipientEmail || null, // Ensure null instead of undefined
      type,
      title,
      message,
      relatedData
    });
    console.log(`Notification created: ${type} for ${recipientRole}`, notification._id);
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    console.error('Notification data:', { recipientRole, recipientEmail, type, title, message });
    return null;
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
  deleteNotification
};

