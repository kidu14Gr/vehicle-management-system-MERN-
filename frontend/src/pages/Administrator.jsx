import React, { useEffect, useState, useRef } from 'react';
import NavBar1 from '../components/NavBar1';
import Footer from '../components/Footer';
import PasswordInput from '../components/PasswordInput';
import { useAuthContext } from '../hooks/useAuthContext';
import axios from 'axios';
import { 
  HiOutlineUsers, 
  HiOutlineUserPlus, 
  HiOutlineTrash, 
  HiOutlinePencilSquare,
  HiOutlineShieldCheck,
  HiOutlineEnvelope,
  HiOutlineTag,
  HiOutlineChartPie,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineCamera,
  HiOutlineUser,
  HiOutlineBriefcase
} from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

const Administrator = () => {
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showPendingUsers, setShowPendingUsers] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  
  // Add Employee Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('driver');
  const [pimage, setPimage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [addEmployeeError, setAddEmployeeError] = useState('');
  const [addEmployeeSuccess, setAddEmployeeSuccess] = useState('');
  const fileInputRef = useRef();
  
  const navigate = useNavigate();
  const { user } = useAuthContext();

  // Prevent unauthorized access and back navigation
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    if (user.role !== 'administrator') {
      navigate('/', { replace: true });
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchUsers();
    fetchPendingUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/user');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPendingUsers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/pendinguser');
      setPendingUsers(response.data);
    } catch (error) {
      console.error('Error fetching pending users:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPimage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setAddEmployeeError('');
    setAddEmployeeSuccess('');

    // Validate password confirmation
    if (password !== confirmPassword) {
      setAddEmployeeError('Passwords do not match');
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('role', role);
    if (pimage) formData.append('pimage', pimage);

    try {
      await axios.post('http://localhost:4000/api/user/signup', formData);
      setAddEmployeeSuccess('Employee added successfully!');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFirstName('');
      setLastName('');
      setRole('driver');
      setPimage(null);
      setPreview(null);
      fetchUsers();
      setTimeout(() => {
        setShowAddEmployeeModal(false);
        setAddEmployeeSuccess('');
      }, 2000);
    } catch (error) {
      setAddEmployeeError(error.response?.data?.error || 'Failed to add employee');
    }
  };

  const approvePendingUser = async (id) => {
    setActionLoading(id);
    try {
      await axios.post(`http://localhost:4000/api/pendinguser/approve/${id}`);
      fetchPendingUsers();
      fetchUsers();
      // Trigger notification refresh in NavBar
      window.dispatchEvent(new CustomEvent('pendingUsersUpdated'));
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Failed to approve user');
    } finally {
      setActionLoading(null);
    }
  };

  const declinePendingUser = async (id) => {
    if (window.confirm('Are you sure you want to decline this user registration?')) {
      setActionLoading(id);
      try {
        await axios.delete(`http://localhost:4000/api/pendinguser/decline/${id}`);
        fetchPendingUsers();
        // Trigger notification refresh in NavBar
        window.dispatchEvent(new CustomEvent('pendingUsersUpdated'));
      } catch (error) {
        console.error('Error declining user:', error);
        alert('Failed to decline user');
      } finally {
        setActionLoading(null);
      }
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to remove this employee?')) {
      try {
        await axios.delete(`http://localhost:4000/api/user/delete/${id}`);
        setUsers(users.filter(user => user._id !== id));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      <NavBar1 />
      
      <main className="flex-grow container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">System Administration</h1>
            <p className="text-secondary-600">Manage institutional users, permissions, and system oversight.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowPendingUsers(!showPendingUsers)}
              className="flex items-center gap-2 px-6 py-3 bg-accent-600 hover:bg-accent-700 text-white font-bold rounded-2xl shadow-lg shadow-accent-500/25 transition-all active:scale-95 relative"
            >
              <HiOutlineClock className="text-xl" />
              Pending Users
              {pendingUsers.length > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {pendingUsers.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setShowAddEmployeeModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/25 transition-all active:scale-95"
            >
              <HiOutlineUserPlus className="text-xl" />
              Add New Employee
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Personnel', value: users.length, icon: HiOutlineUsers, color: 'bg-primary-50 text-primary-600' },
            { label: 'Admin Access', value: users.filter(u => u.role === 'administrator').length, icon: HiOutlineShieldCheck, color: 'bg-accent-50 text-accent-600' },
            { label: 'Active Drivers', value: users.filter(u => u.role === 'driver').length, icon: HiOutlineTag, color: 'bg-orange-50 text-orange-600' },
            { label: 'Pending Audits', value: '3', icon: HiOutlineChartPie, color: 'bg-purple-50 text-purple-600' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl shadow-enterprise border border-secondary-100 flex items-center gap-5">
              <div className={`p-4 rounded-2xl ${stat.color}`}>
                <stat.icon className="text-2xl" />
              </div>
              <div>
                <p className="text-xs font-bold text-secondary-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* User Management Table */}
        <div className="bg-white rounded-3xl shadow-glass border border-white overflow-hidden">
          <div className="px-8 py-6 border-b border-secondary-50 flex items-center justify-between">
            <h2 className="text-xl font-bold text-secondary-900">Personnel Directory</h2>
            <div className="text-sm text-secondary-500 font-medium">Showing {users.length} active members</div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-secondary-50/50">
                  <th className="px-8 py-4 text-[10px] font-bold text-secondary-400 uppercase tracking-widest">Employee</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-secondary-400 uppercase tracking-widest">System Role</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-secondary-400 uppercase tracking-widest">Contact Info</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-secondary-400 uppercase tracking-widest">Vehicle No</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-secondary-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-50">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-secondary-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <img 
                          className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-sm" 
                          src={`http://localhost:4000/uploads/pimages/${user.pimages}`} 
                          alt="" 
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/40' }}
                        />
                        <div>
                          <p className="text-sm font-bold text-secondary-900 leading-none mb-1">{user.firstName} {user.lastName}</p>
                          <p className="text-[10px] text-secondary-400 font-medium">ID: {user._id.slice(-6).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-secondary-100 text-secondary-700 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-secondary-600 text-xs font-medium">
                        <HiOutlineEnvelope className="text-secondary-400" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-mono font-bold text-secondary-900">{user.vehicleNo || 'N/A'}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/updateprofile/${user._id}`)}
                          className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                        >
                          <HiOutlinePencilSquare size={18} />
                        </button>
                        <button 
                          onClick={() => deleteUser(user._id)}
                          className="p-2 text-secondary-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <HiOutlineTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {users.length === 0 && !isLoading && (
            <div className="py-20 text-center">
              <HiOutlineUsers className="text-5xl text-secondary-100 mx-auto mb-4" />
              <p className="text-secondary-400 font-medium">No users found in the system.</p>
            </div>
          )}
        </div>

        {/* Pending Users Section */}
        {showPendingUsers && (
          <div data-pending-users className="mt-12 bg-white rounded-3xl shadow-glass border border-white overflow-hidden animate-fade-in">
            <div className="px-8 py-6 border-b border-secondary-50 flex items-center justify-between bg-accent-50">
              <h2 className="text-xl font-bold text-secondary-900 flex items-center gap-3">
                <HiOutlineClock className="text-accent-600" />
                Pending User Registrations
              </h2>
              <button 
                onClick={() => setShowPendingUsers(false)}
                className="text-secondary-400 hover:text-secondary-600"
              >
                <HiOutlineXCircle className="text-2xl" />
              </button>
            </div>
            
            <div className="p-8">
              {pendingUsers.length === 0 ? (
                <div className="py-20 text-center">
                  <HiOutlineCheckCircle className="text-5xl text-secondary-100 mx-auto mb-4" />
                  <p className="text-secondary-400 font-medium">No pending user registrations.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingUsers.map((user) => (
                    <div key={user._id} className="bg-secondary-50 rounded-2xl p-6 border-2 border-secondary-100 hover:border-accent-200 transition-all">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-sm bg-white">
                          {user.pimages ? (
                            <img 
                              className="w-full h-full object-cover" 
                              src={`http://localhost:4000/uploads/pimages/${user.pimages}`} 
                              alt="" 
                              onError={(e) => { e.target.src = 'https://via.placeholder.com/64' }}
                            />
                          ) : (
                            <div className="w-full h-full bg-secondary-100 flex items-center justify-center text-secondary-400">
                              <HiOutlineUser className="text-2xl" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-secondary-900 text-lg">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-secondary-500">{user.email}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-lg uppercase tracking-wider">
                          {user.role}
                        </span>
                      </div>

                      <p className="text-xs text-secondary-400 mb-4">
                        Submitted: {new Date(user.submittedAt).toLocaleDateString()}
                      </p>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => approvePendingUser(user._id)}
                          disabled={actionLoading === user._id}
                          className="flex-1 py-2 bg-accent-600 hover:bg-accent-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {actionLoading === user._id ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          ) : (
                            <><HiOutlineCheckCircle /> Approve</>
                          )}
                        </button>
                        <button 
                          onClick={() => declinePendingUser(user._id)}
                          disabled={actionLoading === user._id}
                          className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <HiOutlineXCircle /> Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Add Employee Modal */}
      {showAddEmployeeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-primary-600 p-6 text-white flex items-center justify-between rounded-t-3xl">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <HiOutlineUserPlus />
                Add New Employee
              </h2>
              <button 
                onClick={() => setShowAddEmployeeModal(false)}
                className="text-white hover:bg-white/20 p-2 rounded-xl transition-all"
              >
                <HiOutlineXCircle className="text-2xl" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="p-8 space-y-6">
              <div className="flex flex-col items-center mb-6">
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="relative group cursor-pointer"
                >
                  <div className="w-24 h-24 rounded-2xl bg-secondary-50 border-2 border-dashed border-secondary-200 flex items-center justify-center overflow-hidden group-hover:border-primary-400 transition-all">
                    {preview ? (
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <HiOutlineCamera className="text-3xl text-secondary-300 group-hover:text-primary-500" />
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                    <HiOutlineCamera size={16} />
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  hidden 
                  accept="image/*" 
                />
                <p className="text-xs font-bold text-secondary-400 uppercase tracking-widest mt-3">Profile Image</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-secondary-700 ml-1">First Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary-400">
                      <HiOutlineUser />
                    </div>
                    <input 
                      type="text"
                      autoComplete="off"
                      className="w-full pl-11 pr-4 py-3 bg-secondary-50 border border-secondary-100 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-secondary-900"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-secondary-700 ml-1">Last Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary-400">
                      <HiOutlineUser />
                    </div>
                    <input 
                      type="text"
                      autoComplete="off"
                      className="w-full pl-11 pr-4 py-3 bg-secondary-50 border border-secondary-100 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-secondary-900"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-secondary-700 ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary-400">
                    <HiOutlineEnvelope />
                  </div>
                  <input 
                    type="email"
                    autoComplete="off"
                    className="w-full pl-11 pr-4 py-3 bg-secondary-50 border border-secondary-100 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-secondary-900"
                    placeholder="john.doe@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                confirmPassword={confirmPassword}
                onConfirmChange={(e) => setConfirmPassword(e.target.value)}
                showStrength={true}
                label="Password"
                placeholder="••••••••"
              />

              <div className="space-y-2">
                <label className="text-sm font-semibold text-secondary-700 ml-1">Role</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary-400">
                    <HiOutlineBriefcase />
                  </div>
                  <select 
                    className="w-full pl-11 pr-4 py-3 bg-secondary-50 border border-secondary-100 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-secondary-900 appearance-none"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="driver">Driver</option>
                    <option value="administrator">Administrator</option>
                    <option value="vehicle deployer">Vehicle Deployer</option>
                    <option value="fuel manager">Fuel Manager</option>
                    <option value="dean">Dean</option>
                    <option value="vehicle manage">Vehicle Manager</option>
                  </select>
                </div>
              </div>

              {addEmployeeError && (
                <div className="p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
                  {addEmployeeError}
                </div>
              )}

              {addEmployeeSuccess && (
                <div className="p-4 bg-accent-50 text-accent-600 text-sm font-medium rounded-xl border border-accent-100">
                  {addEmployeeSuccess}
                </div>
              )}

              <button 
                type="submit"
                disabled={password !== confirmPassword || !password}
                className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-600/25 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Employee
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Administrator;
