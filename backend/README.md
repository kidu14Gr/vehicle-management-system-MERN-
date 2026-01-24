# Vehicle Management System - Backend

A robust Node.js/Express REST API for managing vehicles, drivers, missions, fuel consumption, and user authentication with role-based access control.

## 📋 Project Overview

The backend provides a secure, scalable API for the Vehicle Management System. It handles authentication, authorization, data persistence, file uploads, and real-time notifications across multiple user roles.

## 🛠 Technology Stack

- **Node.js** - Runtime environment
- **Express.js 4.19.2** - Web framework
- **MongoDB & Mongoose 8.3.3** - Database and ODM
- **JSON Web Token (JWT) 9.0.2** - Authentication
- **Bcrypt 5.1.1** - Password hashing
- **Multer 1.4.5** - File upload handling
- **Validator 13.11.0** - Input validation
- **CORS 2.8.5** - Cross-origin resource sharing
- **Dotenv 16.4.5** - Environment variables

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   # Create .env file in backend directory
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/vehicleManagement
   # Or for MongoDB Atlas:
   # MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/vehicleManagement
   JWT_SECRET=your-secret-key-here
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   ```

4. **Create upload directories:**
   ```bash
   mkdir -p uploads/pimages uploads/vimages
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:4000`

### Production Start

```bash
npm start
```

## 📁 Project Structure

```
backend/
├── controllers/          # Business logic handlers
│   ├── userController.js        # User CRUD operations
│   ├── pendingUserController.js # Pending user approvals
│   ├── vehicleController.js     # Vehicle management
│   ├── deployerController.js    # Mission deployment
│   ├── fuelController.js        # Fuel request handling
│   ├── reportController.js      # Report generation
│   └── notificationController.js # Notification system
├── models/              # MongoDB schemas
│   ├── userModel.js
│   ├── pendingUserModel.js
│   ├── vehicleModel.js
│   ├── deployerModel.js
│   ├── fuelModel.js
│   ├── reportModel.js
│   └── notificationModel.js
├── routes/              # API route definitions
│   ├── user.js
│   ├── pendingUser.js
│   ├── vehicle.js
│   ├── deployer.js
│   ├── fuel.js
│   ├── report.js
│   └── notification.js
├── uploads/            # File storage
│   ├── pimages/        # Profile images
│   └── vimages/        # Vehicle images
├── server.js           # Main server file
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication & Users

#### User Registration (Pending)
- **POST** `/api/pendinguser`
  - Creates a pending user request (requires admin approval)
  - Body: `{ firstName, lastName, email, password, role, pimage }`

#### User Login
- **POST** `/api/user/login`
  - Authenticates user and returns JWT token
  - Body: `{ email, password, role }`
  - Returns: `{ email, token, role, firstName, lastName, _id }`

#### Get User by Email
- **GET** `/api/user/:email`
  - Returns user details

#### Get User by ID
- **GET** `/api/user/id/:id`
  - Returns user details by MongoDB ID

#### Get All Users
- **GET** `/api/user`
  - Returns all users (admin only)

#### Get All Drivers
- **GET** `/api/user/drivers`
  - Returns all users with driver role

#### Update User
- **PATCH** `/api/user/:id`
  - Updates user information
  - Body: `{ firstName, lastName, email, role, pimage, vehicleNo, drivertype }`

#### Delete User
- **DELETE** `/api/user/:id`
  - Deletes a user

### Pending Users (Admin)

#### Get Pending Users
- **GET** `/api/pendinguser`
  - Returns all pending user requests

#### Approve Pending User
- **POST** `/api/pendinguser/approve/:id`
  - Creates user from pending request

#### Decline Pending User
- **DELETE** `/api/pendinguser/decline/:id`
  - Removes pending user request

### Vehicles

#### Create Vehicle
- **POST** `/api/vehicle`
  - Creates a new vehicle
  - Body: `{ vehicleName, vehicleNo, vehicleType, oiltype, vimage }`
  - File: `vimage` (multipart/form-data)

#### Get All Vehicles
- **GET** `/api/vehicle`
  - Returns all vehicles

#### Update Vehicle
- **PATCH** `/api/vehicle/:id`
  - Updates vehicle information

#### Delete Vehicle
- **DELETE** `/api/vehicle/:id`
  - Deletes a vehicle

### Missions (Deployer)

#### Create Mission
- **POST** `/api/deployer`
  - Assigns mission to driver
  - Body: `{ email, firstName, lastName, slat, slong, dlat, dlong, splace, dplace, km }`

#### Get Mission by Driver Email
- **GET** `/api/deployer/:email`
  - Returns active mission for driver

#### Get All Missions
- **GET** `/api/deployer/deploy`
  - Returns all missions

#### Acknowledge Mission
- **PATCH** `/api/deployer/acknowledge/:id`
  - Driver acknowledges mission
  - Body: `{ driverEmail }`

#### Delete Mission
- **DELETE** `/api/deployer/delete/:email`
  - Deletes mission by driver email

### Fuel Management

#### Create Fuel Request
- **POST** `/api/fuel`
  - Driver submits fuel request
  - Body: `{ dName, dlastName, vehicleNo, status, km, litre, splace, dplace }`

#### Get All Fuel Requests
- **GET** `/api/fuel`
  - Returns all fuel requests

#### Get Pending Fuel Requests
- **GET** `/api/fuel/status`
  - Returns fuel requests with 'reviewing' status

#### Update Fuel Status
- **PATCH** `/api/fuel/:id`
  - Approve/decline fuel request
  - Body: `{ status: 'successed' | 'declined', litre }`

#### Get Fuel by Vehicle
- **GET** `/api/fuel/:vehicleNo`
  - Returns fuel requests for specific vehicle

#### Delete Fuel Request
- **DELETE** `/api/fuel/:id`
  - Deletes fuel request

### Reports

#### Create Report
- **POST** `/api/report`
  - Driver completes mission and creates report
  - Body: `{ firstName, lastName, vehicleNo, km, litre, destStatus, splace, dplace }`

#### Get All Reports
- **GET** `/api/report`
  - Returns all reports

#### Get Reports by Vehicle
- **GET** `/api/report/:vehicleNo`
  - Returns reports for specific vehicle

#### Update Report Status
- **PATCH** `/api/report/:reportId`
  - Updates report destination status
  - Body: `{ destStatus }`

### Notifications

#### Get Notifications
- **GET** `/api/notification?role=driver&email=user@example.com`
  - Returns notifications for user role
  - Query params: `role` (required), `email` (optional)

#### Mark Notification as Read
- **PATCH** `/api/notification/read/:id`
  - Marks single notification as read

#### Mark All as Read
- **PATCH** `/api/notification/read-all`
  - Marks all notifications as read for user
  - Body: `{ role, email }`

#### Delete Notification
- **DELETE** `/api/notification/:id`
  - Deletes a notification

## 🔐 Security Features

### Authentication
- JWT-based authentication
- Password hashing with bcrypt (10 rounds)
- Token expiration handling

### Authorization
- Role-based access control (RBAC)
- Protected routes middleware
- User-specific data filtering

### Security Headers (Optional)
- Helmet.js for security headers
- Rate limiting (express-rate-limit)
- CORS configuration
- Input validation with validator

### File Upload Security
- File type validation
- Unique filename generation
- Size limits (10MB default)
- Secure file storage

## 📊 Database Models

### User Model
- `firstName`, `lastName`, `email`, `password` (hashed)
- `role`: administrator | driver | vehicle deployer | fuel manager | dean | vehicle manage
- `pimages`: profile image filename
- `vehicleNo`: assigned vehicle
- `drivertype`: driver experience level

### Vehicle Model
- `vehicleName`, `vehicleNo`, `vehicleType`
- `oiltype`: fuel type
- `vimages`: vehicle image filename
- `driverId`: assigned driver

### Deployer Model (Missions)
- `email`, `firstName`, `lastName`
- `slat`, `slong`, `dlat`, `dlong`: coordinates
- `splace`, `dplace`: location names
- `km`: distance
- `acknowledged`: boolean

### Fuel Model
- `dName`, `dlastName`, `vehicleNo`
- `status`: reviewing | successed | declined
- `km`, `litre`: consumption data
- `splace`, `dplace`: route

### Report Model
- `firstName`, `lastName`, `vehicleNo`
- `km`, `litre`: mission data
- `destStatus`: completion status
- `splace`, `dplace`: route

### Notification Model
- `recipientRole`: target role
- `recipientEmail`: specific user (optional)
- `type`: notification type
- `title`, `message`: content
- `read`: boolean status
- `relatedData`: additional context

## 🔔 Notification System

Notifications are automatically created for:
- **Mission Assignment**: Driver receives notification
- **Mission Acknowledgment**: Vehicle Deployer receives notification
- **Fuel Request**: Fuel Manager receives notification
- **Fuel Approval/Decline**: Driver and Dean receive notifications
- **Mission Completion**: Vehicle Deployer, Fuel Manager, and Dean receive notifications

## 🛡️ Error Handling

- Global error handler middleware
- Consistent error response format
- Detailed error logging
- Production-safe error messages

## 📝 Environment Variables

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/vehicleManagement
JWT_SECRET=your-secret-key-change-in-production
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

## 🧪 Testing

### Health Check
```bash
GET http://localhost:4000/health
```

Returns server status and uptime.

## 🚀 Production Deployment

### Recommended Setup
1. Use MongoDB Atlas for database
2. Set `NODE_ENV=production`
3. Use strong `JWT_SECRET`
4. Enable rate limiting
5. Use helmet for security headers
6. Configure CORS for production domain
7. Set up file storage (AWS S3 recommended)
8. Use process manager (PM2)

### PM2 Setup
```bash
npm install -g pm2
pm2 start server.js --name vehicle-api
pm2 save
pm2 startup
```

## 📦 Dependencies

### Production
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `jsonwebtoken`: JWT authentication
- `bcrypt`: Password hashing
- `multer`: File uploads
- `validator`: Input validation
- `cors`: CORS middleware
- `dotenv`: Environment variables

### Development
- `nodemon`: Auto-restart on file changes

### Optional (Production)
- `helmet`: Security headers
- `express-rate-limit`: Rate limiting

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Check MongoDB is running
   - Verify MONGO_URI in .env
   - Check network/firewall settings

2. **Port Already in Use:**
   ```bash
   lsof -ti:4000 | xargs kill -9
   ```

3. **File Upload Errors:**
   - Ensure upload directories exist
   - Check file permissions
   - Verify multer configuration

4. **JWT Errors:**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure token is sent in headers

## 📄 License

ISC

