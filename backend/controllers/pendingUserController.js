const PendingUser = require('../models/pendingUserModel');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

// Get all pending users
const getPendingUsers = async (req, res) => {
    try {
        const pendingUsers = await PendingUser.find({ status: 'pending' }).sort({ createdAt: -1 });
        res.status(200).json(pendingUsers);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Create a pending user (from signup)
const createPendingUser = async (req, res) => {
    const { email, password, firstName, lastName, role } = req.body;
    const pimages = req.file ? req.file.filename : null;

    try {
        // Check if email already exists in Users or PendingUsers
        const existingUser = await User.findOne({ email });
        const existingPendingUser = await PendingUser.findOne({ email });

        if (existingUser || existingPendingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash password before storing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const pendingUser = await PendingUser.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role,
            pimages,
            status: 'pending'
        });

        res.status(201).json({ 
            message: 'Your registration request has been submitted. Please wait for admin approval.',
            pendingUser: {
                email: pendingUser.email,
                firstName: pendingUser.firstName,
                lastName: pendingUser.lastName
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Approve pending user (moves to User collection)
const approvePendingUser = async (req, res) => {
    const { id } = req.params;

    try {
        const pendingUser = await PendingUser.findById(id);

        if (!pendingUser) {
            return res.status(404).json({ error: 'Pending user not found' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: pendingUser.email });
        if (existingUser) {
            // Delete pending user if user already exists
            await PendingUser.findByIdAndDelete(id);
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Ensure pimages has a value (required field)
        const pimagesValue = pendingUser.pimages || 'default-profile.png';

        // Create user in main User collection using create (bypassing signup validation since password is already hashed)
        const newUser = await User.create({
            email: pendingUser.email,
            password: pendingUser.password, // Already hashed from signup
            firstName: pendingUser.firstName,
            lastName: pendingUser.lastName,
            role: pendingUser.role,
            pimages: pimagesValue,
            drivertype: '',
            vehicleNo: ''
        });

        // Delete from pending users
        await PendingUser.findByIdAndDelete(id);

        res.status(200).json({ 
            message: 'User approved successfully',
            user: {
                _id: newUser._id,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error('Error approving pending user:', error);
        // More detailed error logging
        if (error.code === 11000) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }
        res.status(400).json({ error: error.message || 'Failed to approve user' });
    }
};

// Decline pending user
const declinePendingUser = async (req, res) => {
    const { id } = req.params;

    try {
        const pendingUser = await PendingUser.findByIdAndDelete(id);

        if (!pendingUser) {
            return res.status(404).json({ error: 'Pending user not found' });
        }

        res.status(200).json({ 
            message: 'User registration declined',
            declinedUser: {
                email: pendingUser.email,
                firstName: pendingUser.firstName,
                lastName: pendingUser.lastName
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getPendingUsers,
    createPendingUser,
    approvePendingUser,
    declinePendingUser
};

