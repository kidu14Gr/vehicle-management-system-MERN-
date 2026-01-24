import React from 'react';
import { Link } from 'react-router-dom';
import NavBar1 from '../components/NavBar1';
import Footer from '../components/Footer';
import { HiOutlineTruck, HiOutlineShieldCheck, HiOutlineChartBar, HiOutlineMap } from 'react-icons/hi2';

const Home = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavBar1 />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full lg:w-1/2 px-4 mb-12 lg:mb-0">
              <span className="inline-block py-1 px-3 mb-4 text-xs font-semibold text-primary-600 bg-primary-50 rounded-full uppercase tracking-widest">
                The Future of Fleet Management
              </span>
              <h1 className="text-5xl lg:text-7xl font-bold text-secondary-900 mb-6 leading-tight">
                Manage your <span className="text-primary-600">Vehicles</span> with Precision.
              </h1>
              <p className="text-xl text-secondary-600 mb-10 max-w-lg leading-relaxed">
                Experience the next generation of vehicle management. Streamlined deployment, real-time tracking, and comprehensive fuel management.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/signup" className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/25 transition-all active:scale-95">
                  Get Started for Free
                </Link>
                <Link to="/login" className="px-8 py-4 bg-white border border-secondary-200 text-secondary-900 font-bold rounded-2xl hover:bg-secondary-50 transition-all active:scale-95">
                  Sign In
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-1/2 px-4">
              <div className="relative mx-auto lg:mr-0 max-w-max">
                <div className="absolute top-0 left-0 -mt-10 -ml-10 w-40 h-40 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
                <div className="absolute bottom-0 right-0 -mb-10 -mr-10 w-40 h-40 bg-accent-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse delay-700"></div>
                <img 
                  className="relative rounded-[3rem] shadow-2xl border border-white/20" 
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000" 
                  alt="Fleet Management Dashboard" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-secondary-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Vehicles Managed', value: '500+' },
              { label: 'Active Missions', value: '1.2k' },
              { label: 'Fuel Saved', value: '25%' },
              { label: 'Drivers Onboarded', value: '200+' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl font-bold text-secondary-900 mb-2">{stat.value}</p>
                <p className="text-secondary-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">Everything you need to run your fleet</h2>
            <p className="text-lg text-secondary-600">Powering modern vehicle logistics with advanced technology and user-centric design.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: HiOutlineMap, title: 'Smart Tracking', desc: 'Real-time GPS tracking and mission deployment for every vehicle.' },
              { icon: HiOutlineTruck, title: 'Asset Management', desc: 'Comprehensive inventory management with detailed specifications.' },
              { icon: HiOutlineShieldCheck, title: 'Role-based Access', desc: 'Secure permissions for administrators, deans, and deployers.' },
              { icon: HiOutlineChartBar, title: 'Advanced Analytics', desc: 'Deep insights into fuel consumption and operational efficiency.' }
            ].map((feature, i) => (
              <div key={i} className="group">
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-6 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                  <feature.icon className="text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-3">{feature.title}</h3>
                <p className="text-secondary-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
