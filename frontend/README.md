# Vehicle Management System - Frontend

A modern, responsive React application for managing vehicle fleets with role-based dashboards, real-time tracking, and comprehensive analytics.

## 📋 Project Overview

The frontend is built with React 18 and provides an intuitive, interactive interface for managing vehicles, drivers, missions, and fuel consumption. It features smooth animations, responsive design, and real-time notifications across all user roles.

## 🛠 Technology Stack

- **React 18.3.1** - UI library
- **React Router DOM 6.23.0** - Client-side routing
- **Tailwind CSS 3.4.3** - Utility-first CSS framework
- **Axios 1.6.8** - HTTP client for API requests
- **React Icons 5.2.1** - Icon library (Hi2, Fi)
- **Leaflet & React-Leaflet 4.2.1** - Interactive maps
- **Chart.js & React-Chartjs-2** - Data visualization
- **Date-fns 3.6.0** - Date formatting utilities

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Backend server running (see backend README)

### Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file (optional):**
   ```bash
   # Create .env file in frontend directory
   REACT_APP_API_URL=http://localhost:4000
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

   The application will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── assets/            # Images and media files
│   │   └── img/
│   ├── components/        # Reusable React components
│   │   ├── NavBar1.jsx   # Navigation bar with notifications
│   │   ├── Footer.jsx    # Footer component
│   │   └── PasswordInput.jsx  # Password input with strength indicator
│   ├── context/          # React Context providers
│   │   └── AuthContext.jsx  # Authentication state management
│   ├── hooks/            # Custom React hooks
│   │   ├── useAuthContext.jsx
│   │   ├── useLogin.jsx
│   │   ├── useLogout.jsx
│   │   └── useSignup.jsx
│   ├── pages/            # Page components
│   │   ├── Home.jsx      # Landing page
│   │   ├── Login.jsx     # Login page
│   │   ├── SignUp.jsx    # Registration page
│   │   ├── Administrator.jsx  # Admin dashboard
│   │   ├── Driver.jsx    # Driver dashboard
│   │   ├── VehicleDeployer.jsx  # Deployer dashboard
│   │   ├── VehicleManage.jsx    # Vehicle manager dashboard
│   │   ├── Fuel.jsx      # Fuel manager dashboard
│   │   ├── Dean.jsx      # Dean dashboard
│   │   └── UpdateProfile.jsx   # Profile update page
│   ├── App.js            # Main app component with routing
│   ├── index.js          # Entry point
│   └── index.css         # Global styles and Tailwind imports
├── package.json
├── tailwind.config.js    # Tailwind configuration
└── README.md
```

## 🎨 Features

### User Interface
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Smooth Animations**: Fade-in, slide-up, and hover effects throughout
- **Interactive Components**: Buttons, modals, forms with real-time validation
- **Modern UI**: Clean, professional design with Tailwind CSS

### Role-Based Dashboards
- **Administrator**: User management, pending approvals, vehicle inventory
- **Driver**: Mission tracking, fuel requests, map visualization
- **Vehicle Deployer**: Mission assignment, driver management
- **Fuel Manager**: Fuel request approvals, consumption analytics
- **Dean**: System-wide reports and analytics
- **Vehicle Manager**: Vehicle registration and driver assignment

### Key Functionalities
- **Authentication**: Secure login/signup with JWT tokens
- **Real-time Notifications**: Bell icon with badge count for all roles
- **Interactive Maps**: Leaflet maps for mission tracking
- **Data Visualization**: Charts for fuel consumption and analytics
- **File Uploads**: Profile pictures and vehicle images
- **Password Security**: Strength indicator and visibility toggle

## 🔐 Authentication Flow

1. User signs up → Request sent to admin for approval
2. Admin approves → User can login
3. Login → JWT token stored in localStorage
4. Protected routes → Redirect based on user role
5. Logout → Token cleared, redirect to home

## 🎯 API Integration

The frontend communicates with the backend API at `http://localhost:4000/api/`:

- **User Management**: `/api/user/*`
- **Pending Users**: `/api/pendinguser/*`
- **Vehicles**: `/api/vehicle/*`
- **Deployments**: `/api/deployer/*`
- **Fuel**: `/api/fuel/*`
- **Reports**: `/api/report/*`
- **Notifications**: `/api/notification/*`

## 🎨 Styling & Animations

### Tailwind CSS Configuration
Custom color palette defined in `tailwind.config.js`:
- Primary colors (blue)
- Accent colors (green)
- Secondary colors (gray scale)

### Animation Classes
- `animate-fade-in`: Fade in effect
- `animate-slide-up`: Slide up from bottom
- `animate-pulse`: Pulsing effect
- `hover:scale-105`: Scale on hover
- `transition-all duration-300`: Smooth transitions

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🐛 Troubleshooting

### Common Issues

1. **Port 3000 already in use:**
   ```bash
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   ```

2. **API connection errors:**
   - Ensure backend server is running
   - Check CORS configuration in backend
   - Verify API URL in axios requests

3. **Build errors:**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📦 Dependencies

### Production Dependencies
- `react` & `react-dom`: Core React library
- `react-router-dom`: Routing
- `axios`: HTTP client
- `react-icons`: Icons
- `leaflet` & `react-leaflet`: Maps
- `chart.js` & `react-chartjs-2`: Charts
- `date-fns`: Date utilities

### Development Dependencies
- `tailwindcss`: CSS framework
- `react-scripts`: Build tooling

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Static Hosting
The `build/` folder can be deployed to:
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages

### Environment Variables
Set production API URL:
```bash
REACT_APP_API_URL=https://your-api-domain.com
```

## 📝 Notes

- All API calls use axios with error handling
- Authentication state managed via React Context
- Notifications refresh every 15 seconds
- File uploads handled via FormData
- Password strength validation on signup
- Role-based route protection in App.js

## 🤝 Contributing

When adding new features:
1. Follow existing component structure
2. Use Tailwind CSS for styling
3. Add proper error handling
4. Update this README if needed

## 📄 License

ISC
