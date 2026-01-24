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

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/" />} 
        />
        <Route 
          path="/signup" 
          element={!user ? <SignUp /> : <Navigate to="/" />} 
        />
        
        {/* Protected Routes */}
        <Route 
          path="/administrator" 
          element={user ? <Administrator /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/driver" 
          element={user ? <Driver /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/vehicledeployer" 
          element={user ? <VehicleDeployer /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/vehiclemanage" 
          element={user ? <VehicleManage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/fuel" 
          element={user ? <Fuel /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/dean" 
          element={user ? <Dean /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/updateprofile/:id" 
          element={user ? <UpdateProfile /> : <Navigate to="/login" />} 
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
