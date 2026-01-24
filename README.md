# Vehicle Management System (VMS)

A comprehensive, production-ready MERN stack application for managing vehicle fleets, drivers, missions, and fuel consumption with role-based access control, real-time tracking, and advanced analytics.

## 🎯 Project Overview

The Vehicle Management System is a full-stack web application designed to streamline vehicle operations for organizations. It provides distinct dashboards for different user roles, enabling efficient management of vehicles, drivers, missions, fuel consumption, and comprehensive reporting.

### Key Highlights
- ✅ **Production-Ready**: Fully optimized with security, error handling, and performance enhancements
- ✅ **Role-Based Access**: Six distinct user roles with tailored interfaces
- ✅ **Real-Time Features**: Live notifications, mission tracking, and interactive maps
- ✅ **Modern UI/UX**: Smooth animations, responsive design, and intuitive interfaces
- ✅ **Comprehensive Analytics**: Charts, reports, and data visualization
- ✅ **Secure Authentication**: JWT-based auth with password hashing and role-based authorization

## 🏗️ Architecture

```
Vehicle Management System
├── Frontend (React)
│   ├── Role-based dashboards
│   ├── Real-time notifications
│   ├── Interactive maps (Leaflet)
│   ├── Data visualization (Chart.js)
│   └── Responsive UI (Tailwind CSS)
│
└── Backend (Node.js/Express)
    ├── RESTful API
    ├── MongoDB database
    ├── JWT authentication
    ├── File upload handling
    └── Notification system
```

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** - UI library
- **React Router DOM 6.23.0** - Client-side routing
- **Tailwind CSS 3.4.3** - Utility-first styling
- **Axios 1.6.8** - HTTP client
- **React Icons 5.2.1** - Icon library
- **Leaflet & React-Leaflet** - Interactive maps
- **Chart.js & React-Chartjs-2** - Data visualization
- **Date-fns 3.6.0** - Date utilities

### Backend
- **Node.js** - Runtime environment
- **Express.js 4.19.2** - Web framework
- **MongoDB & Mongoose 8.3.3** - Database and ODM
- **JSON Web Token 9.0.2** - Authentication
- **Bcrypt 5.1.1** - Password hashing
- **Multer 1.4.5** - File upload handling
- **Validator 13.11.0** - Input validation
- **CORS 2.8.5** - Cross-origin resource sharing

## 👥 User Roles

### 1. Administrator
- Manage all users (approve/decline signup requests)
- Add employees directly
- View and manage vehicle inventory
- System-wide oversight

### 2. Driver
- View assigned missions
- Request fuel for missions
- Complete missions and submit reports
- Track mission progress on interactive maps
- Receive notifications for assignments and fuel status

### 3. Vehicle Deployer
- Assign missions to drivers
- Track mission status
- View driver acknowledgments
- Receive completion notifications

### 4. Fuel Manager
- Review and approve/decline fuel requests
- Calculate optimal fuel amounts
- Track fuel consumption analytics
- View driver fuel history

### 5. Dean
- View comprehensive system reports
- Monitor mission completions
- Track fuel approvals/declines
- System-wide analytics dashboard

### 6. Vehicle Manager
- Register new vehicles
- Assign drivers to vehicles
- Manage vehicle inventory
- Update vehicle specifications

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd vehicleManagementSystem
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/vehicleManagement
   JWT_SECRET=your-secret-key-here
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   
   # Create upload directories
   mkdir -p uploads/pimages uploads/vimages
   
   # Start backend
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   
   # Optional: Create .env file
   REACT_APP_API_URL=http://localhost:4000
   
   # Start frontend
   npm start
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - Health Check: http://localhost:4000/health

## 📂 Project Structure

```
vehicleManagementSystem/
├── backend/                 # Node.js/Express API
│   ├── controllers/        # Business logic
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── uploads/           # File storage
│   ├── server.js          # Main server file
│   └── package.json
│
├── frontend/              # React application
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # State management
│   │   ├── hooks/        # Custom hooks
│   │   └── assets/       # Images and media
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md             # This file
```

## 🔄 Application Flow

### Authentication Flow
1. **Signup**: User submits registration → Admin receives pending request
2. **Approval**: Admin approves/declines → User can login if approved
3. **Login**: User authenticates → JWT token issued → Role-based redirect
4. **Session**: Token stored in localStorage → Protected routes accessible
5. **Logout**: Token cleared → Redirect to home

### Mission Flow
1. **Assignment**: Vehicle Deployer assigns mission to driver
2. **Notification**: Driver receives notification
3. **Acknowledgment**: Driver clicks "Got it" → Deployer notified
4. **Fuel Request**: Driver requests fuel → Fuel Manager notified
5. **Approval**: Fuel Manager approves → Driver notified
6. **Completion**: Driver completes mission → All roles notified
7. **Reporting**: Report generated → Analytics updated

### Notification System
- **Real-time Updates**: Notifications refresh every 15 seconds
- **Role-Based**: Each role receives relevant notifications
- **Badge Count**: Unread count displayed in header
- **Click Actions**: Navigate to relevant pages on click
- **Mark as Read**: Individual or bulk read status updates

## 🎨 Features & Functionality

### Frontend Features
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth animations and transitions
- ✅ Interactive maps with Leaflet
- ✅ Real-time data visualization
- ✅ Password strength indicator
- ✅ File upload with preview
- ✅ Form validation
- ✅ Error handling and user feedback
- ✅ Loading states and spinners
- ✅ Toast notifications

### Backend Features
- ✅ RESTful API design
- ✅ JWT authentication
- ✅ Role-based authorization
- ✅ File upload handling
- ✅ Input validation
- ✅ Error handling middleware
- ✅ CORS configuration
- ✅ Rate limiting (optional)
- ✅ Security headers (optional)
- ✅ Health check endpoint

### Security Features
- ✅ Password hashing (bcrypt)
- ✅ JWT token authentication
- ✅ Role-based access control
- ✅ Input validation
- ✅ File upload security
- ✅ CORS protection
- ✅ Rate limiting
- ✅ Security headers

## 📡 API Communication

The frontend communicates with the backend via RESTful API:

```
Frontend (React)  ←→  Backend (Express)  ←→  MongoDB
     Axios              REST API           Mongoose
```

### API Base URL
- Development: `http://localhost:4000/api`
- Production: Set via `REACT_APP_API_URL`

### Authentication
- JWT token sent in request headers
- Token stored in localStorage
- Automatic token refresh on API calls

## 🚀 Deployment

### Frontend Deployment

1. **Build for production:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to:**
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - GitHub Pages

3. **Environment variables:**
   ```env
   REACT_APP_API_URL=https://your-api-domain.com
   ```

### Backend Deployment

1. **Recommended platforms:**
   - Heroku
   - AWS EC2
   - DigitalOcean
   - Railway
   - Render

2. **Environment variables:**
   ```env
   PORT=4000
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=strong-secret-key
   FRONTEND_URL=https://your-frontend-domain.com
   NODE_ENV=production
   ```

3. **Process management:**
   ```bash
   npm install -g pm2
   pm2 start server.js --name vehicle-api
   pm2 save
   ```

### Database
- Use MongoDB Atlas for production
- Configure connection string in `.env`
- Enable IP whitelist
- Use strong authentication

## 📊 Database Schema

### Collections
- **users**: User accounts and profiles
- **pendingusers**: Pending registration requests
- **vehicles**: Vehicle inventory
- **deployers**: Mission assignments
- **fuels**: Fuel requests and consumption
- **reports**: Mission completion reports
- **notifications**: System notifications

## 🎯 Key Improvements & Animations

### UI/UX Enhancements
- **Smooth Animations**: Fade-in, slide-up, scale effects
- **Hover Interactions**: Button hover states, card elevations
- **Loading States**: Spinners and skeleton loaders
- **Error Feedback**: Toast notifications and inline errors
- **Responsive Design**: Mobile-first approach
- **Accessibility**: Keyboard navigation, ARIA labels

### Performance Optimizations
- **Code Splitting**: Lazy loading of routes
- **Image Optimization**: Compressed assets
- **API Caching**: Efficient data fetching
- **Bundle Optimization**: Production builds

### Security Enhancements
- **Input Validation**: Client and server-side
- **XSS Protection**: Sanitized inputs
- **CSRF Protection**: Token-based requests
- **Rate Limiting**: API abuse prevention

## 📝 Documentation

- **Frontend README**: `/frontend/README.md`
- **Backend README**: `/backend/README.md`
- **API Documentation**: See backend README for endpoint details

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and approval flow
- [ ] Login and authentication
- [ ] Role-based dashboard access
- [ ] Mission assignment and tracking
- [ ] Fuel request and approval
- [ ] Notification system
- [ ] File uploads
- [ ] Responsive design
- [ ] Error handling

## 🐛 Troubleshooting

### Common Issues

1. **Backend won't start:**
   - Check MongoDB connection
   - Verify .env file exists
   - Ensure port 4000 is available

2. **Frontend API errors:**
   - Verify backend is running
   - Check CORS configuration
   - Verify API URL

3. **File upload fails:**
   - Check upload directory permissions
   - Verify multer configuration
   - Check file size limits

4. **Authentication issues:**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Clear localStorage and re-login

## 📄 License

ISC

## 👨‍💻 Development Notes

### Code Style
- ES6+ JavaScript
- Functional React components
- Async/await for promises
- Consistent naming conventions

### Best Practices
- Error handling on all API calls
- Loading states for async operations
- Input validation
- Security-first approach
- Responsive design principles

## 🔮 Future Enhancements

Potential improvements:
- Real-time WebSocket connections
- Advanced analytics dashboard
- Mobile app (React Native)
- Email notifications
- SMS alerts
- GPS tracking integration
- Maintenance scheduling
- Cost analysis reports

## 🤝 Contributing

When contributing:
1. Follow existing code structure
2. Add proper error handling
3. Update documentation
4. Test thoroughly
5. Follow security best practices

---

**Built with ❤️ using the MERN stack**
