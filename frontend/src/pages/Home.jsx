import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBar1 from '../components/NavBar1';
import Footer from '../components/Footer';
import { HiOutlineTruck, HiOutlineShieldCheck, HiOutlineChartBar, HiOutlineMap, HiOutlineArrowRight, HiOutlineCheckCircle } from 'react-icons/hi2';
import backgroundFleet from '../assets/img/backgroundfleet.jpg';


const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavBar1 />
      
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-24 md:pb-32 overflow-hidden bg-gradient-to-br from-white via-primary-50/30 to-accent-50/20">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-wrap items-center -mx-4">
            <div className={`w-full lg:w-1/2 px-4 mb-8 sm:mb-12 lg:mb-0 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <span className="inline-block py-1.5 px-3 sm:px-4 mb-3 sm:mb-4 text-[10px] sm:text-xs font-semibold text-primary-600 bg-primary-50 rounded-full uppercase tracking-widest animate-fade-in shadow-sm">
                The Future of Fleet Management
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-secondary-900 mb-4 sm:mb-6 leading-tight animate-slide-up">
                Manage your <span className="text-primary-600 relative inline-block">
                  Vehicles
                  <span className="absolute bottom-1 sm:bottom-2 left-0 right-0 h-2 sm:h-3 bg-primary-200/40 -z-10 transform -skew-x-12"></span>
                </span> with Precision.
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-secondary-600 mb-6 sm:mb-10 max-w-lg leading-relaxed animate-slide-up delay-200">
                Experience the next generation of vehicle management. Streamlined deployment, real-time tracking, and comprehensive fuel management.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 animate-slide-up delay-300">
                <Link 
                  to="/signup" 
                  className="group px-6 sm:px-8 py-3 sm:py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl sm:rounded-2xl shadow-lg shadow-primary-500/25 transition-all duration-300 active:scale-95 hover:shadow-xl hover:shadow-primary-500/40 flex items-center justify-center gap-2 hover:gap-3 text-sm sm:text-base touch-manipulation"
                >
                  Get Started for Free
                  <HiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/login" 
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-secondary-200 text-secondary-900 font-bold rounded-xl sm:rounded-2xl hover:bg-secondary-50 hover:border-primary-300 transition-all duration-300 active:scale-95 shadow-sm hover:shadow-md text-sm sm:text-base touch-manipulation text-center"
                >
                  Sign In
                </Link>
              </div>
            </div>
            <div className={`w-full lg:w-1/2 px-4 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="relative mx-auto lg:mr-0 max-w-max group">
                <div className="absolute top-0 left-0 -mt-5 -ml-5 sm:-mt-10 sm:-ml-10 w-20 h-20 sm:w-40 sm:h-40 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse group-hover:opacity-90 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 right-0 -mb-5 -mr-5 sm:-mb-10 sm:-mr-10 w-20 h-20 sm:w-40 sm:h-40 bg-accent-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse delay-700 group-hover:opacity-90 transition-opacity duration-500"></div>
                <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-primary-200/20 to-accent-200/20 rounded-2xl sm:rounded-[3rem] blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                <img 
                  className="relative rounded-2xl sm:rounded-[3rem] shadow-2xl border border-white/20 transform group-hover:scale-105 transition-transform duration-500 w-full max-w-lg mx-auto" 
                  src={backgroundFleet}
                  alt="Fleet Management Dashboard" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-secondary-50 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[
              { label: 'Vehicles Managed', value: '500+', icon: HiOutlineTruck },
              { label: 'Active Missions', value: '1.2k', icon: HiOutlineMap },
              { label: 'Fuel Saved', value: '25%', icon: HiOutlineChartBar },
              { label: 'Drivers Onboarded', value: '200+', icon: HiOutlineShieldCheck }
            ].map((stat, i) => (
              <div 
                key={i} 
                className="group text-center p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg border border-secondary-100 hover:border-primary-200 transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-primary-600 group-hover:scale-110 transition-all duration-300">
                  <stat.icon className="text-primary-600 group-hover:text-white text-lg sm:text-xl transition-colors" />
                </div>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary-900 mb-1 sm:mb-2 group-hover:text-primary-600 transition-colors">{stat.value}</p>
                <p className="text-xs sm:text-sm text-secondary-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 md:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 md:mb-20 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-900 mb-3 sm:mb-4">Everything you need to run your fleet</h2>
            <p className="text-sm sm:text-base md:text-lg text-secondary-600">Powering modern vehicle logistics with advanced technology and user-centric design.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { icon: HiOutlineMap, title: 'Smart Tracking', desc: 'Real-time GPS tracking and mission deployment for every vehicle.', bgClass: 'bg-primary-50', textClass: 'text-primary-600', hoverBg: 'group-hover:bg-primary-600' },
              { icon: HiOutlineTruck, title: 'Asset Management', desc: 'Comprehensive inventory management with detailed specifications.', bgClass: 'bg-accent-50', textClass: 'text-accent-600', hoverBg: 'group-hover:bg-accent-600' },
              { icon: HiOutlineShieldCheck, title: 'Role-based Access', desc: 'Secure permissions for administrators, deans, and deployers.', bgClass: 'bg-primary-50', textClass: 'text-primary-600', hoverBg: 'group-hover:bg-primary-600' },
              { icon: HiOutlineChartBar, title: 'Advanced Analytics', desc: 'Deep insights into fuel consumption and operational efficiency.', bgClass: 'bg-accent-50', textClass: 'text-accent-600', hoverBg: 'group-hover:bg-accent-600' }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="group p-6 bg-white rounded-2xl border border-secondary-100 hover:border-primary-300 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`w-16 h-16 ${feature.bgClass} rounded-2xl flex items-center justify-center ${feature.textClass} mb-6 ${feature.hoverBg} group-hover:text-white group-hover:scale-110 transition-all duration-300`}>
                  <feature.icon className="text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors">{feature.title}</h3>
                <p className="text-secondary-600 leading-relaxed">{feature.desc}</p>
                <div className="mt-4 flex items-center text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-semibold">Learn more</span>
                  <HiOutlineArrowRight className="ml-2 text-sm group-hover:translate-x-1 transition-transform" />
                </div>
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
