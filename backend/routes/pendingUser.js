const express = require('express');
const router = express.Router();
const {
    getPendingUsers,
    createPendingUser,
    approvePendingUser,
    declinePendingUser
} = require('../controllers/pendingUserController');

// Get all pending users
router.get('/', getPendingUsers);

// Create pending user (signup submission)
router.post('/', createPendingUser);

// Approve pending user
router.post('/approve/:id', approvePendingUser);

// Decline pending user
router.delete('/decline/:id', declinePendingUser);

module.exports = router;

