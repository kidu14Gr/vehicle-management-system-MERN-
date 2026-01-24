import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Administrator from './pages/Administrator';
import Driver from './pages/Driver';
import VehicleDeployer from './pages/VehicleDeployer';
import VehicleManage from './pages/VehicleManage';
import Fuel from './pages/Fuel';
import Dean from './pages/Dean';
import UpdateProfile from './pages/UpdateProfile';

function App() {
  const { user } = useAuthContext();

  // Get dashboard route based on user role
  const getDashboardRoute = () => {
    if (!user) return '/';
    const roleRoutes = {
      'administrator': '/administrator',
      'driver': '/driver',
      'vehicle deployer': '/vehicledeployer',
      'vehicle manage': '/vehiclemanage',
      'fuel manager': '/fuel',
      'dean': '/dean'
    };
    return roleRoutes[user.role] || '/';
  };

  // Protected Route Component with role checking
  const ProtectedRoute = ({ children, requiredRole = null }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    
    // If a specific role is required, check it
    if (requiredRole && user.role !== requiredRole) {
      return <Navigate to={getDashboardRoute()} replace />;
    }
    
    return children;
  };

  return (
    <div className="App">
      <Routes>
        <Route 
          path="/" 
          element={!user ? <Home /> : <Navigate to={getDashboardRoute()} replace />} 
        />
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to={getDashboardRoute()} replace />} 
        />
        <Route 
          path="/signup" 
          element={!user ? <SignUp /> : <Navigate to={getDashboardRoute()} replace />} 
        />
        
        {/* Protected Routes with Role-Based Access */}
        <Route 
          path="/administrator" 
          element={
            <ProtectedRoute requiredRole="administrator">
              <Administrator />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/driver" 
          element={
            <ProtectedRoute requiredRole="driver">
              <Driver />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/vehicledeployer" 
          element={
            <ProtectedRoute requiredRole="vehicle deployer">
              <VehicleDeployer />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/vehiclemanage" 
          element={
            <ProtectedRoute requiredRole="vehicle manage">
              <VehicleManage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/fuel" 
          element={
            <ProtectedRoute requiredRole="fuel manager">
              <Fuel />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dean" 
          element={
            <ProtectedRoute requiredRole="dean">
              <Dean />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/updateprofile/:id" 
          element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          } 
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
