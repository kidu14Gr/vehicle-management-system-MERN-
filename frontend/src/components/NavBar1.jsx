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
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [pendingUsers, setPendingUsers] = useState([]);
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

  // Fetch pending users for notifications (only for administrators)
  useEffect(() => {
    const fetchPendingUsers = async () => {
      if (user && user.role === 'administrator') {
        try {
          const response = await axios.get('http://localhost:4000/api/pendinguser');
          setPendingUsers(response.data || []);
        } catch (error) {
          console.error('Error fetching pending users:', error);
        }
      }
    };

    fetchPendingUsers();
    
    // Listen for updates from other components
    const handleUpdate = () => fetchPendingUsers();
    window.addEventListener('pendingUsersUpdated', handleUpdate);
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchPendingUsers, 30000);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('pendingUsersUpdated', handleUpdate);
    };
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isNotificationOpen && !event.target.closest('.relative')) {
        setIsNotificationOpen(false);
      }
      if (isDropdownOpen && !event.target.closest('.relative')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotificationOpen, isDropdownOpen]);

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
          </div>
        )}

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {user && user.role === 'administrator' && (
            <div className="relative">
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-secondary-400 hover:bg-slate-100 hover:text-secondary-900 transition-all relative"
              >
                <FiBell className="text-xl" />
                {pendingUsers.length > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full border-2 border-white flex items-center justify-center">
                    {pendingUsers.length}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <div className="absolute top-full right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 py-4 animate-slide-up z-50">
                  <div className="px-6 py-3 border-b border-slate-50">
                    <h3 className="text-sm font-bold text-secondary-900">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {pendingUsers.length === 0 ? (
                      <div className="px-6 py-8 text-center">
                        <p className="text-sm text-secondary-400">No pending requests</p>
                      </div>
                    ) : (
                      <div className="px-2 py-2">
                        {pendingUsers.map((pendingUser) => {
                          const date = new Date(pendingUser.submittedAt || pendingUser.createdAt);
                          const formattedDate = date.toLocaleDateString('en-US', { 
                            month: '2-digit', 
                            day: '2-digit', 
                            year: 'numeric' 
                          });
                          const formattedTime = date.toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: true
                          });
                          
                          return (
                            <div 
                              key={pendingUser._id}
                              className="px-4 py-3 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer"
                              onClick={() => {
                                setIsNotificationOpen(false);
                                navigate('/administrator');
                                // Scroll to pending users section
                                setTimeout(() => {
                                  const pendingSection = document.querySelector('[data-pending-users]');
                                  if (pendingSection) {
                                    pendingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                  }
                                }, 100);
                              }}
                            >
                              <p className="text-sm text-secondary-900 font-medium mb-1">
                                New registration request
                              </p>
                              <p className="text-xs text-secondary-500 mb-2">
                                {pendingUser.firstName} {pendingUser.lastName} ({pendingUser.email})
                              </p>
                              <p className="text-xs text-secondary-400">
                                Submitted on {formattedDate} at {formattedTime}
                              </p>
                              <p className="text-xs text-primary-600 font-medium mt-1">
                                Waiting for your approval
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  {pendingUsers.length > 0 && (
                    <div className="px-6 py-3 border-t border-slate-50">
                      <button
                        onClick={() => {
                          setIsNotificationOpen(false);
                          navigate('/administrator');
                        }}
                        className="w-full text-sm font-bold text-primary-600 hover:text-primary-700 text-center"
                      >
                        View All Pending Requests
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
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