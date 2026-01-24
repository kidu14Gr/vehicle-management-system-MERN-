import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/img/hawassalogo.jpeg'
import { FiTwitter, FiFacebook, FiLinkedin, FiGithub } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-secondary-100 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                <img src={logo} alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-bold tracking-tight text-secondary-900">
                HUVMS<span className="text-primary-600">.</span>
              </span>
            </Link>
            <p className="text-secondary-500 leading-relaxed mb-8 max-w-xs">
              Next-generation vehicle management system for modern institutions. Precision, efficiency, and intelligence.
            </p>
            <div className="flex gap-4">
              {[FiTwitter, FiFacebook, FiLinkedin, FiGithub].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 bg-secondary-50 rounded-xl flex items-center justify-center text-secondary-400 hover:bg-primary-600 hover:text-white transition-all">
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-secondary-900 font-bold mb-6">Platform</h4>
            <ul className="space-y-4">
              {['Fleet Tracking', 'Fuel Monitoring', 'Driver Management', 'Analytics'].map((item) => (
                <li key={item}><a href="#" className="text-secondary-500 hover:text-primary-600 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-secondary-900 font-bold mb-6">Resources</h4>
            <ul className="space-y-4">
              {['Documentation', 'API Reference', 'Community', 'Case Studies'].map((item) => (
                <li key={item}><a href="#" className="text-secondary-500 hover:text-primary-600 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-secondary-900 font-bold mb-6">Support</h4>
            <ul className="space-y-4">
              {['Help Center', 'System Status', 'Contact Us', 'Privacy Policy'].map((item) => (
                <li key={item}><a href="#" className="text-secondary-500 hover:text-primary-600 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-secondary-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-secondary-400 text-sm">
            © {new Date().getFullYear()} HUVMS Inc. All rights reserved.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-secondary-400 hover:text-secondary-600 text-sm">Terms of Service</a>
            <a href="#" className="text-secondary-400 hover:text-secondary-600 text-sm">Privacy</a>
            <a href="#" className="text-secondary-400 hover:text-secondary-600 text-sm">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
