import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/img/logo.png'
import { FiTwitter, FiFacebook, FiLinkedin, FiGithub } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-secondary-100 pt-12 sm:pt-16 md:pt-20 pb-6 sm:pb-8 md:pb-10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-10 sm:mb-12 md:mb-16">
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                <img src={logo} alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-secondary-900">
                VMS<span className="text-primary-600">.</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-secondary-500 leading-relaxed mb-6 sm:mb-8 max-w-xs">
              Next-generation vehicle management system for modern institutions. Precision, efficiency, and intelligence.
            </p>
            <div className="flex gap-3 sm:gap-4">
              {[FiTwitter, FiFacebook, FiLinkedin, FiGithub].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-secondary-50 rounded-xl flex items-center justify-center text-secondary-400 hover:bg-primary-600 hover:text-white transition-all touch-manipulation" aria-label={`Social media ${i}`}>
                  <Icon className="text-base sm:text-lg" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm sm:text-base text-secondary-900 font-bold mb-4 sm:mb-6">Platform</h4>
            <ul className="space-y-2 sm:space-y-3 md:space-y-4">
              {['Fleet Tracking', 'Fuel Monitoring', 'Driver Management', 'Analytics'].map((item) => (
                <li key={item}><a href="#" className="text-xs sm:text-sm text-secondary-500 hover:text-primary-600 transition-colors touch-manipulation">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm sm:text-base text-secondary-900 font-bold mb-4 sm:mb-6">Resources</h4>
            <ul className="space-y-2 sm:space-y-3 md:space-y-4">
              {['Documentation', 'API Reference', 'Community', 'Case Studies'].map((item) => (
                <li key={item}><a href="#" className="text-xs sm:text-sm text-secondary-500 hover:text-primary-600 transition-colors touch-manipulation">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm sm:text-base text-secondary-900 font-bold mb-4 sm:mb-6">Support</h4>
            <ul className="space-y-2 sm:space-y-3 md:space-y-4">
              {['Help Center', 'System Status', 'Contact Us', 'Privacy Policy'].map((item) => (
                <li key={item}><a href="#" className="text-xs sm:text-sm text-secondary-500 hover:text-primary-600 transition-colors touch-manipulation">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 sm:pt-8 border-t border-secondary-50 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-xs sm:text-sm text-secondary-400 text-center sm:text-left">
            © {new Date().getFullYear()} VMS Inc. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6 md:gap-8">
            <a href="#" className="text-xs sm:text-sm text-secondary-400 hover:text-secondary-600 touch-manipulation">Terms of Service</a>
            <a href="#" className="text-xs sm:text-sm text-secondary-400 hover:text-secondary-600 touch-manipulation">Privacy</a>
            <a href="#" className="text-xs sm:text-sm text-secondary-400 hover:text-secondary-600 touch-manipulation">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
