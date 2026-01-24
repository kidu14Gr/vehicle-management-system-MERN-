import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import NavBar1 from '../components/NavBar1';
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineArrowRight, HiOutlineBriefcase } from 'react-icons/hi2';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('driver');
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password, role);
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      <NavBar1 />
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-[1000px] rounded-[2.5rem] shadow-glass border border-white overflow-hidden flex flex-col lg:flex-row">
          {/* Form Side */}
          <div className="w-full lg:w-1/2 p-12 lg:p-20">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-secondary-900 mb-2">Welcome Back</h2>
              <p className="text-secondary-500">Sign in to your HUVMS account to continue.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-secondary-700 ml-1">Email Address</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary-400">
                    <HiOutlineEnvelope />
                  </div>
                  <input 
                    type="email"
                    className="w-full pl-11 pr-4 py-4 bg-secondary-50 border border-secondary-100 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-secondary-900 placeholder-secondary-400"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-semibold text-secondary-700">Password</label>
                  <Link to="/forgot-password" size="sm" className="text-xs text-primary-600 hover:text-primary-700 font-medium">Forgot password?</Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary-400">
                    <HiOutlineLockClosed />
                  </div>
                  <input 
                    type="password"
                    className="w-full pl-11 pr-4 py-4 bg-secondary-50 border border-secondary-100 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-secondary-900 placeholder-secondary-400"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-secondary-700 ml-1">Account Role</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary-400">
                    <HiOutlineBriefcase />
                  </div>
                  <select 
                    className="w-full pl-11 pr-4 py-4 bg-secondary-50 border border-secondary-100 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-secondary-900 appearance-none"
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

              {error && (
                <div className="p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100 animate-shake">
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Sign In <HiOutlineArrowRight /></>
                )}
              </button>

              <p className="text-center text-secondary-500 text-sm mt-8">
                Don't have an account? <Link to="/signup" className="text-primary-600 font-bold hover:underline">Create an account</Link>
              </p>
            </form>
          </div>

          {/* Visual Side */}
          <div className="hidden lg:block lg:w-1/2 bg-secondary-900 p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-20 opacity-10">
              <HiOutlineLockClosed size={400} className="text-white" />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-center">
              <h3 className="text-4xl font-bold text-white mb-6 leading-tight">Secure Access to <br/> Fleet Intelligence.</h3>
              <p className="text-secondary-400 text-lg leading-relaxed mb-12">
                "Our fleet management system has transformed how we handle logistical operations, providing us with real-time data that drives efficiency."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-600"></div>
                <div>
                  <p className="text-white font-bold leading-none mb-1">Fleet Operations Team</p>
                  <p className="text-secondary-500 text-sm uppercase tracking-widest font-bold">University Logistics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
