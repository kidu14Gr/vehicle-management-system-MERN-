import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar1 from '../components/NavBar1';
import Footer from '../components/Footer';
import axios from 'axios';
import { 
  HiOutlineUser, 
  HiOutlineEnvelope, 
  HiOutlineLockClosed, 
  HiOutlineBriefcase, 
  HiOutlineCamera,
  HiOutlineCheckCircle,
  HiOutlineArrowLeft
} from 'react-icons/hi2';

const UpdateProfile = () => {
  const params = useParams();
  const navigate = useNavigate();
  const id = params.id;
  const imgRef = useRef();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [role, setRole] = useState('');
  const [pimage, setPimage] = useState(null);
  const [urlpimage, setUrlPimage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch current user data
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/user/id/${id}`);
        const user = response.data;
        setEmail(user.email || '');
        setFirstname(user.firstName || '');
        setLastname(user.lastName || '');
        setRole(user.role || '');
        if (user.pimages && user.pimages !== 'default-profile.png') {
          setUrlPimage(`http://localhost:4000/uploads/pimages/${user.pimages}`);
        } else {
          setUrlPimage('https://via.placeholder.com/150');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    if (id) fetchUser();
  }, [id]);

  useEffect(() => {
    if (pimage) {
      const url = URL.createObjectURL(pimage);
      setUrlPimage(url);
    }
  }, [pimage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('email', email);
    if (password) formData.append('password', password);
    if (pimage) formData.append('pimage', pimage);
    formData.append('firstName', firstname);
    formData.append('lastName', lastname);
    formData.append('role', role);

    try {
      await axios.patch(`http://localhost:4000/api/user/update/${id}`, formData);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      <NavBar1 />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-secondary-600 hover:text-primary-600 transition-colors font-medium"
          >
            <HiOutlineArrowLeft />
            Back to Dashboard
          </button>

          <div className="bg-white rounded-3xl shadow-glass border border-white overflow-hidden">
            <div className="bg-primary-600 h-32 relative">
              <div className="absolute -bottom-16 left-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-2xl border-4 border-white overflow-hidden bg-white shadow-enterprise">
                    {urlpimage ? (
                      <img 
                        src={urlpimage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-secondary-100 flex items-center justify-center">
                        <HiOutlineUser className="text-4xl text-secondary-400" />
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => imgRef.current.click()}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl"
                  >
                    <HiOutlineCamera className="text-white text-3xl" />
                  </button>
                  <input 
                    ref={imgRef}
                    type="file" 
                    hidden 
                    onChange={(e) => setPimage(e.target.files[0])} 
                    accept="image/*"
                  />
                </div>
              </div>
            </div>

            <div className="px-8 pt-20 pb-12">
              <div className="mb-10">
                <h1 className="text-2xl font-bold text-secondary-900">Update Employee Profile</h1>
                <p className="text-secondary-500">Modify member details and system permissions</p>
              </div>

              {successMessage && (
                <div className="mb-8 p-4 bg-accent-100 text-accent-700 rounded-2xl flex items-center gap-3 animate-fade-in border border-accent-200">
                  <HiOutlineCheckCircle className="text-2xl" />
                  <span className="font-medium">{successMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-secondary-700 ml-1">First Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary-400">
                        <HiOutlineUser />
                      </div>
                      <input 
                        type="text"
                        className="w-full pl-11 pr-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-secondary-900"
                        placeholder="John"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
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
                        className="w-full pl-11 pr-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-secondary-900"
                        placeholder="Doe"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
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
                      className="w-full pl-11 pr-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-secondary-900"
                      placeholder="john.doe@vms.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-secondary-700 ml-1">Change Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary-400">
                        <HiOutlineLockClosed />
                      </div>
                      <input 
                        type="password"
                        className="w-full pl-11 pr-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-secondary-900"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <p className="text-[10px] text-secondary-400 ml-1">Leave blank to keep current password</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-secondary-700 ml-1">System Role</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary-400">
                        <HiOutlineBriefcase />
                      </div>
                      <select 
                        className="w-full pl-11 pr-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-secondary-900 appearance-none"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                      >
                        <option value="">Select Role</option>
                        <option value="driver">Driver</option>
                        <option value="administrator">Administrator</option>
                        <option value="vehicle deployer">Vehicle Deployer</option>
                        <option value="fuel manager">Fuel Manager</option>
                        <option value="dean">Dean</option>
                        <option value="vehicle manage">Vehicle Manager</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full mt-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-500/25 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : 'Update Employee Profile'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UpdateProfile;
