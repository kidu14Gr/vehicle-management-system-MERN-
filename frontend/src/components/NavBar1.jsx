import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import logo from '../assets/img/hawassalogo.jpeg'
import { FiLogOut, FiUser, FiBell, FiSettings, FiGrid, FiHome } from 'react-icons/fi';

const NavBar1 = () => {
  const { user } = useAuthContext();
  const [suser, setSUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useLogout();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (user && user.email) {
          const response = await axios.get(`http://localhost:4000/api/user/${user.email}`);
          setSUser(response.data);
        } 
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!suser) return '/';
    const roleRoutes = {
      'administrator': '/administrator',
      'driver': '/driver',
      'vehicle deployer': '/vehicledeployer',
      'vehicle manage': '/vehiclemanage',
      'fuel manager': '/fuel',
      'dean': '/dean'
    };
    return roleRoutes[suser.role] || '/';
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo & Brand */}
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
            <img src={logo} alt="HUVMS" className="w-full h-full object-cover" />
          </div>
          <div className="hidden sm:block">
            <span className="text-xl font-bold text-secondary-900 tracking-tight">HUVMS</span>
            <p className="text-[10px] text-primary-600 font-bold uppercase tracking-wider leading-none mt-0.5">Fleet Core</p>
          </div>
        </div>

        {/* Dashboard Nav Links */}
        {user && (
          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <Link 
              to={getDashboardLink()}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                location.pathname === getDashboardLink() 
                ? 'bg-white text-primary-600 shadow-sm' 
                : 'text-secondary-500 hover:text-secondary-900'
              }`}
            >
              <FiGrid /> Dashboard
            </Link>
            <Link 
              to="/"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-secondary-500 hover:text-secondary-900 transition-all"
            >
              <FiHome /> Home
            </Link>
          </div>
        )}

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-xl flex items-center justify-center text-secondary-400 hover:bg-slate-100 hover:text-secondary-900 transition-all relative">
            <FiBell className="text-xl" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          
          <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block" />

          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 pl-1.5 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-2xl hover:border-primary-200 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-white group-hover:scale-105 transition-transform">
                  {suser?.pimages ? (
                    <img
                      className="w-full h-full object-cover"
                      src={`http://localhost:4000/uploads/pimages/${suser.pimages}`}
                      alt="Profile"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary-100 flex items-center justify-center text-primary-600">
                      <FiUser />
                    </div>
                  )}
                </div>
                <div className="hidden sm:block text-left leading-tight mr-1">
                  <p className="text-xs font-bold text-secondary-900 truncate max-w-[120px]">{suser?.firstName || user.email}</p>
                  <p className="text-[10px] text-secondary-500 font-medium capitalize">{suser?.role || 'User'}</p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-4 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 py-4 animate-slide-up">
                  <div className="px-6 py-4 border-b border-slate-50 mb-2">
                    <p className="text-sm font-bold text-secondary-900">{suser?.firstName} {suser?.lastName}</p>
                    <p className="text-xs text-secondary-500">{user.email}</p>
                  </div>
                  <div className="px-2 space-y-1">
                    <button 
                      onClick={() => { navigate(`/updateprofile/${suser?._id}`); setIsDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-secondary-600 hover:bg-slate-50 hover:text-primary-600 transition-all"
                    >
                      <FiUser className="text-lg" /> My Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-secondary-600 hover:bg-slate-50 hover:text-primary-600 transition-all">
                      <FiSettings className="text-lg" /> Settings
                    </button>
                    <div className="h-px bg-slate-50 mx-4 my-2" />
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
                    >
                      <FiLogOut className="text-lg" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-all">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar1;