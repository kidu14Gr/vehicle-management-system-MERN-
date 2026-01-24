import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSignup } from '../hooks/useSignup';
import NavBar1 from '../components/NavBar1';
import PasswordInput from '../components/PasswordInput';
import { HiOutlineUser, HiOutlineEnvelope, HiOutlineArrowRight, HiOutlineBriefcase, HiOutlineCamera } from 'react-icons/hi2';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('driver');
  const [pimage, setPimage] = useState(null);
  const [preview, setPreview] = useState(null);
  const { signup, error, isLoading, success } = useSignup();
  const fileInputRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPimage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password confirmation
    if (password !== confirmPassword) {
      return;
    }
    
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('role', role);
    if (pimage) formData.append('pimage', pimage);
    
    await signup(formData);
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      <NavBar1 />
      <div className="flex-grow flex items-center justify-center p-4 sm:p-6 py-8 sm:py-12">
        <div className="bg-white w-full max-w-[1100px] rounded-2xl sm:rounded-3xl shadow-glass border border-white overflow-hidden flex flex-col lg:flex-row">
          {/* Visual Side */}
          <div className="hidden lg:block lg:w-2/5 bg-primary-600 p-12 lg:p-16 relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-accent-400/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 h-full flex flex-col justify-between text-white">
              <div>
                <h3 className="text-3xl lg:text-4xl font-bold mb-6">Join the Future <br/> of Fleet.</h3>
                <p className="text-primary-100 text-base lg:text-lg leading-relaxed">
                  Create an account to start managing missions, tracking fuel, and optimizing your vehicle logistics.
                </p>
              </div>
              
              <div className="space-y-6 lg:space-y-8">
                {[
                  { title: 'Centralized Control', desc: 'Manage all assets from a single dashboard.' },
                  { title: 'Real-time Insights', desc: 'Get data-driven reports on performance.' },
                  { title: 'Secure Access', desc: 'Enterprise-grade role-based security.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs flex-shrink-0">{i+1}</div>
                    <div>
                      <p className="font-bold mb-0.5 text-sm lg:text-base">{item.title}</p>
                      <p className="text-primary-100 text-xs lg:text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="w-full lg:w-3/5 p-6 sm:p-8 md:p-12 lg:p-16">
            <div className="mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-secondary-900 mb-2">Create Account</h2>
              <p className="text-sm sm:text-base text-secondary-500">Enter your details to register as a fleet member.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="flex flex-col items-center mb-6 sm:mb-8">
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="relative group cursor-pointer touch-manipulation"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl bg-secondary-50 border-2 border-dashed border-secondary-200 flex items-center justify-center overflow-hidden group-hover:border-primary-400 transition-all">
                    {preview ? (
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <HiOutlineCamera className="text-2xl sm:text-3xl text-secondary-300 group-hover:text-primary-500" />
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                    <HiOutlineCamera size={14} className="sm:w-4 sm:h-4" />
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  hidden 
                  accept="image/*" 
                />
                <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest mt-2 sm:mt-3">Upload Profile Image</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-secondary-700 ml-1">First Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary-400">
                      <HiOutlineUser />
                    </div>
                    <input 
                      type="text"
                      autoComplete="off"
                      className="w-full pl-11 pr-4 py-3 sm:py-3.5 bg-secondary-50 border border-secondary-100 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-secondary-900 text-sm sm:text-base touch-manipulation"
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
                      className="w-full pl-11 pr-4 py-3 sm:py-3.5 bg-secondary-50 border border-secondary-100 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-secondary-900 text-sm sm:text-base touch-manipulation"
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
                    className="w-full pl-11 pr-4 py-3 sm:py-3.5 bg-secondary-50 border border-secondary-100 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-secondary-900 text-sm sm:text-base touch-manipulation"
                    placeholder="name@company.com"
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
                <label className="text-sm font-semibold text-secondary-700 ml-1">Account Role</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary-400">
                    <HiOutlineBriefcase />
                  </div>
                  <select 
                    className="w-full pl-11 pr-4 py-3 sm:py-3.5 bg-secondary-50 border border-secondary-100 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-secondary-900 appearance-none text-sm sm:text-base touch-manipulation"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="driver">Driver</option>
                    <option value="vehicle deployer">Vehicle Deployer</option>
                    <option value="fuel manager">Fuel Manager</option>
                    <option value="dean">Dean</option>
                    <option value="vehicle manage">Vehicle Manager</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100 animate-shake">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-4 bg-accent-50 text-accent-600 text-sm font-medium rounded-xl border border-accent-100 animate-fade-in">
                  {success}
                </div>
              )}

              <button 
                type="submit"
                disabled={isLoading || password !== confirmPassword || !password}
                className="w-full py-3 sm:py-4 bg-secondary-900 hover:bg-black text-white font-bold rounded-xl sm:rounded-2xl shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base touch-manipulation"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Submit Request <HiOutlineArrowRight /></>
                )}
              </button>

              <p className="text-center text-secondary-500 text-xs sm:text-sm mt-6 sm:mt-8">
                Already have an account? <Link to="/login" className="text-primary-600 font-bold hover:underline">Sign In</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
