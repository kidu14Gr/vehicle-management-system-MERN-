import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import logo from '../assets/img/logo.png'
import { FiLogOut, FiUser, FiBell, FiSettings, FiGrid, FiHome, FiMenu, FiX } from 'react-icons/fi';

const NavBar1 = () => {
  const { user } = useAuthContext();
  const [suser, setSUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
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

  // Fetch notifications for all roles
  useEffect(() => {
    const fetchNotifications = async () => {
      if (user && user.role) {
        try {
          const response = await axios.get('http://localhost:4000/api/notification', {
            params: {
              role: user.role,
              email: user.email
            }
          });
          setNotifications(response.data.notifications || []);
          setUnreadCount(response.data.unreadCount || 0);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      }
    };

    fetchNotifications();
    
    // Listen for notification updates
    const handleNotificationUpdate = () => fetchNotifications();
    window.addEventListener('notificationUpdated', handleNotificationUpdate);
    
    // Refresh every 15 seconds
    const interval = setInterval(fetchNotifications, 15000);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('notificationUpdated', handleNotificationUpdate);
    };
  }, [user]);

  // Fetch pending users for admin (for backward compatibility)
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
    
    const handleUpdate = () => fetchPendingUsers();
    window.addEventListener('pendingUsersUpdated', handleUpdate);
    
    return () => {
      window.removeEventListener('pendingUsersUpdated', handleUpdate);
    };
  }, [user]);

  const markNotificationAsRead = async (notificationId) => {
    try {
      await axios.patch(`http://localhost:4000/api/notification/read/${notificationId}`);
      // Refresh notifications
      window.dispatchEvent(new CustomEvent('notificationUpdated'));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const formatNotificationDate = (dateString) => {
    const date = new Date(dateString);
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
    return { formattedDate, formattedTime };
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isNotificationOpen && !event.target.closest('.notification-dropdown')) {
        setIsNotificationOpen(false);
      }
      if (isDropdownOpen && !event.target.closest('.profile-dropdown')) {
        setIsDropdownOpen(false);
      }
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isNotificationOpen, isDropdownOpen, isMobileMenuOpen]);

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
      <div className="container mx-auto px-3 sm:px-4 md:px-6">
        <div className="h-14 sm:h-16 md:h-20 flex items-center justify-between gap-2">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }} 
            className="flex items-center gap-1.5 sm:gap-2 md:gap-3 cursor-pointer group flex-shrink-0 min-w-0"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform flex-shrink-0">
              <img src={logo} alt="VMS" className="w-full h-full object-cover" />
            </div>
            <div className="hidden sm:block min-w-0">
              <span className="text-base sm:text-lg md:text-xl font-bold text-secondary-900 tracking-tight block">VMS</span>
              <p className="text-[8px] sm:text-[9px] md:text-[10px] text-primary-600 font-bold uppercase tracking-wider leading-none mt-0.5">Fleet Core</p>
            </div>
          </div>

          {/* Desktop Dashboard Nav Links */}
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

          {/* Right Side Actions - Always Visible */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 flex-shrink-0">
          {/* Notification Bell - Show for all logged-in users */}
          {user && (
            <div className="relative notification-dropdown">
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-secondary-400 hover:bg-slate-100 hover:text-secondary-900 transition-all relative touch-manipulation flex-shrink-0"
                aria-label="Notifications"
              >
                <FiBell className="text-base sm:text-lg md:text-xl" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 md:top-2.5 md:right-2.5 w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 bg-red-500 text-white text-[9px] sm:text-[10px] md:text-xs font-bold rounded-full border-2 border-white flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <>
                  {/* Backdrop for mobile */}
                  <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 sm:hidden"
                    onClick={() => setIsNotificationOpen(false)}
                  />
                  <div className="fixed sm:absolute top-16 sm:top-full right-4 sm:right-0 mt-0 sm:mt-2 md:mt-4 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 py-3 sm:py-4 animate-slide-up z-50">
                  <div className="px-4 sm:px-6 py-3 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-secondary-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={async () => {
                          try {
                            await axios.patch('http://localhost:4000/api/notification/read-all', {
                              role: user.role,
                              email: user.email
                            });
                            window.dispatchEvent(new CustomEvent('notificationUpdated'));
                          } catch (error) {
                            console.error('Error marking all as read:', error);
                          }
                        }}
                        className="text-xs text-primary-600 hover:text-primary-700 font-medium touch-manipulation"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="px-4 sm:px-6 py-8 text-center">
                        <p className="text-sm text-secondary-400">No notifications</p>
                      </div>
                    ) : (
                      <div className="px-2 py-2">
                        {notifications.map((notification) => {
                          const { formattedDate, formattedTime } = formatNotificationDate(notification.createdAt);
                          
                          return (
                            <div 
                              key={notification._id}
                              className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl hover:bg-slate-50 transition-all cursor-pointer border-l-2 touch-manipulation ${
                                !notification.read ? 'border-l-primary-500 bg-primary-50/30' : 'border-l-transparent'
                              }`}
                              onClick={() => {
                                if (!notification.read) {
                                  markNotificationAsRead(notification._id);
                                }
                                setIsNotificationOpen(false);
                                
                                // Navigate based on notification type
                                if (notification.type === 'mission_assigned' && user.role === 'driver') {
                                  navigate('/driver');
                                } else if (notification.type === 'fuel_request' && user.role === 'fuel manager') {
                                  navigate('/fuel');
                                } else if (notification.type === 'mission_completed' || notification.type === 'mission_acknowledged') {
                                  if (user.role === 'vehicle deployer') {
                                    navigate('/vehicledeployer');
                                  } else if (user.role === 'dean') {
                                    navigate('/dean');
                                  }
                                } else if (notification.type === 'user_approved' || notification.type === 'user_declined') {
                                  if (user.role === 'administrator') {
                                    navigate('/administrator');
                                  }
                                }
                              }}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className={`text-xs sm:text-sm font-medium mb-1 ${!notification.read ? 'text-secondary-900' : 'text-secondary-600'}`}>
                                    {notification.title}
                                  </p>
                                  <p className="text-[10px] sm:text-xs text-secondary-500 mb-1 sm:mb-2 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <p className="text-[10px] sm:text-xs text-secondary-400">
                                    {formattedDate} at {formattedTime}
                                  </p>
                                </div>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-1"></div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="px-4 sm:px-6 py-3 border-t border-slate-50">
                      <button
                        onClick={() => {
                          setIsNotificationOpen(false);
                          // Navigate to appropriate dashboard
                          const roleRoutes = {
                            'administrator': '/administrator',
                            'driver': '/driver',
                            'vehicle deployer': '/vehicledeployer',
                            'fuel manager': '/fuel',
                            'dean': '/dean',
                            'vehicle manage': '/vehiclemanage'
                          };
                          navigate(roleRoutes[user.role] || '/');
                        }}
                        className="w-full text-xs sm:text-sm font-bold text-primary-600 hover:text-primary-700 text-center touch-manipulation py-2"
                      >
                        View Dashboard
                      </button>
                    </div>
                  )}
                  </div>
                </>
              )}
            </div>
          )}
          
          <div className="h-6 sm:h-8 w-px bg-slate-200 mx-0.5 sm:mx-1 md:mx-2 hidden sm:block" />

          {user ? (
            <div className="relative profile-dropdown">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 sm:gap-1.5 md:gap-3 pl-0.5 sm:pl-1 md:pl-1.5 pr-1 sm:pr-1.5 md:pr-3 py-0.5 sm:py-1 md:py-1.5 bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl md:rounded-2xl hover:border-primary-200 transition-all group touch-manipulation flex-shrink-0"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl overflow-hidden shadow-sm border border-white group-hover:scale-105 transition-transform flex-shrink-0">
                  {suser?.pimages ? (
                    <img
                      className="w-full h-full object-cover"
                      src={`http://localhost:4000/uploads/pimages/${suser.pimages}`}
                      alt="Profile"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary-100 flex items-center justify-center text-primary-600">
                      <FiUser className="text-xs sm:text-sm md:text-base" />
                    </div>
                  )}
                </div>
                <div className="hidden md:block text-left leading-tight mr-1">
                  <p className="text-xs font-bold text-secondary-900 truncate max-w-[120px]">{suser?.firstName || user.email}</p>
                  <p className="text-[10px] text-secondary-500 font-medium capitalize">{suser?.role || 'User'}</p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  {/* Backdrop for mobile */}
                  <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 sm:hidden"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="fixed sm:absolute top-16 sm:top-full right-4 sm:right-0 mt-0 sm:mt-2 md:mt-4 w-[calc(100vw-2rem)] sm:w-56 md:w-64 max-w-xs bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 py-3 sm:py-4 animate-slide-up z-50">
                  <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-50 mb-2">
                    <p className="text-sm font-bold text-secondary-900 truncate">{suser?.firstName} {suser?.lastName}</p>
                    <p className="text-xs text-secondary-500 truncate">{user.email}</p>
                  </div>
                  <div className="px-2 space-y-1">
                    <button 
                      onClick={() => { navigate(`/updateprofile/${suser?._id}`); setIsDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl sm:rounded-2xl text-sm font-medium text-secondary-600 hover:bg-slate-50 hover:text-primary-600 transition-all touch-manipulation"
                    >
                      <FiUser className="text-lg" /> My Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl sm:rounded-2xl text-sm font-medium text-secondary-600 hover:bg-slate-50 hover:text-primary-600 transition-all touch-manipulation">
                      <FiSettings className="text-lg" /> Settings
                    </button>
                    <div className="h-px bg-slate-50 mx-4 my-2" />
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl sm:rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all touch-manipulation"
                    >
                      <FiLogOut className="text-lg" /> Sign Out
                    </button>
                  </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link to="/login" className="px-2.5 sm:px-3 md:px-4 lg:px-6 py-1.5 sm:py-2 md:py-2.5 bg-primary-600 text-white rounded-lg sm:rounded-xl font-bold shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-all text-xs sm:text-sm md:text-base touch-manipulation whitespace-nowrap flex-shrink-0">
              <span className="hidden sm:inline">Sign In</span>
              <span className="sm:hidden">Login</span>
            </Link>
          )}

          {/* Mobile Menu Button - Only for Dashboard Navigation */}
          {user && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden w-9 h-9 flex items-center justify-center text-secondary-600 hover:bg-slate-100 rounded-lg sm:rounded-xl transition-all touch-manipulation ml-0.5 flex-shrink-0"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <FiX className="text-base sm:text-lg" /> : <FiMenu className="text-base sm:text-lg" />}
            </button>
          )}
          </div>
        </div>

        {/* Mobile Menu */}
        {user && isMobileMenuOpen && (
          <div className="sm:hidden mobile-menu border-t border-slate-200 py-4 animate-slide-down">
            <div className="space-y-2">
              <Link
                to={getDashboardLink()}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === getDashboardLink()
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-secondary-600 hover:bg-slate-50'
                }`}
              >
                <FiGrid className="text-lg" /> Dashboard
              </Link>
              <Link
                to={`/updateprofile/${suser?._id}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-secondary-600 hover:bg-slate-50 transition-all"
              >
                <FiUser className="text-lg" /> My Profile
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
              >
                <FiLogOut className="text-lg" /> Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar1;