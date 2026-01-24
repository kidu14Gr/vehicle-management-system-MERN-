import React, { useEffect, useState } from 'react';
import NavBar1 from '../components/NavBar1';
import Footer from '../components/Footer';
import axios from 'axios';
import { 
  HiOutlineUsers, 
  HiOutlineUserPlus, 
  HiOutlineTrash, 
  HiOutlinePencilSquare,
  HiOutlineShieldCheck,
  HiOutlineEnvelope,
  HiOutlineTag,
  HiOutlineChartPie
} from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

const Administrator = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
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

    fetchUsers();
  }, []);

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
          <button 
            onClick={() => navigate('/signup')}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/25 transition-all active:scale-95"
          >
            <HiOutlineUserPlus className="text-xl" />
            Add New Employee
          </button>
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
      </main>
      <Footer />
    </div>
  );
};

export default Administrator;
