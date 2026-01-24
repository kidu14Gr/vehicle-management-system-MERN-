require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRouters = require('./routes/user');
const pendingUserRouters = require('./routes/pendingUser');
const deployRouters = require('./routes/deployer');
const vehicleRouters = require('./routes/vehicle');
const fuelRouters = require('./routes/fuel');
const reportRouters = require('./routes/report');
const notificationRouters = require('./routes/notification');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();

// Security middleware (optional - install helmet and express-rate-limit for production)
try {
  const helmet = require('helmet');
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));
} catch (e) {
  console.log('Helmet not installed - skipping security headers');
}

try {
  const rateLimit = require('express-rate-limit');
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
  });
  app.use('/api/', limiter);
} catch (e) {
  console.log('express-rate-limit not installed - skipping rate limiting');
}

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set up multer storage and file filtering
const storage = multer.diskStorage({
    destination: (req,file,cb) => {
       
        if (file.fieldname === 'pimage'){
            cb(null, 'uploads/pimages');
          }
          else if (file.fieldname === 'vimage'){
            cb(null, 'uploads/vimages');
          }
        else {
            cb(new Error('Invalid fieldname'));
        }
    },

    filename: (req, file, cb) => {
        // Set the filename for images and videos
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extension = file.mimetype.split('/')[1];
        cb(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
      },
    
})

// Create a multer instance with the configured storage
const upload = multer({ storage });

//routes
app.use('/api/user',upload.single('pimage'), userRouters);
app.use('/api/pendinguser',upload.single('pimage'), pendingUserRouters);
app.use('/api/vehicle',upload.single('vimage'), vehicleRouters);
app.use('/api/deployer', deployRouters);
app.use('/api/fuel', fuelRouters);
app.use('/api/report', reportRouters);
app.use('/api/notification', notificationRouters);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
  
  res.status(statusCode).json({ 
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Connect to database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
    console.log('✓ Connected to MongoDB');
    // Listen for requests
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`✓ Server running on port ${PORT}`);
        console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    });
})
.catch((error) => {
    console.error('✗ MongoDB connection error:', error);
    process.exit(1);
});