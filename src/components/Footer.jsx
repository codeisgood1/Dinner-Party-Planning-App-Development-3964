import React from 'react';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHeart, FiMail, FiGithub, FiTwitter, FiInstagram, FiArrowUp } = FiIcons;

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-br from-charcoal-800 to-charcoal-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-coral-500 to-peach-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">🍽️</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold font-poppins">
                  Dinner<span className="text-coral-400">Doodle</span>
                </h3>
                <p className="text-gray-300 text-sm">Sketching out dinner plans</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Making dinner party planning effortless. Coordinate dishes, manage guests, 
              and create memorable dining experiences with friends and family.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="Twitter"
              >
                <SafeIcon icon={FiTwitter} className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <SafeIcon icon={FiInstagram} className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="GitHub"
              >
                <SafeIcon icon={FiGithub} className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold font-poppins mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-coral-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/features" 
                  className="text-gray-300 hover:text-coral-400 transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link 
                  to="/pricing" 
                  className="text-gray-300 hover:text-coral-400 transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link 
                  to="/create" 
                  className="text-gray-300 hover:text-coral-400 transition-colors"
                >
                  Create Event
                </Link>
              </li>
              <li>
                <Link 
                  to="/dashboard" 
                  className="text-gray-300 hover:text-coral-400 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold font-poppins mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#help" 
                  className="text-gray-300 hover:text-coral-400 transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  className="text-gray-300 hover:text-coral-400 transition-colors flex items-center space-x-2"
                >
                  <SafeIcon icon={FiMail} className="w-4 h-4" />
                  <span>Contact Us</span>
                </a>
              </li>
              <li>
                <a 
                  href="#privacy" 
                  className="text-gray-300 hover:text-coral-400 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="#terms" 
                  className="text-gray-300 hover:text-coral-400 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 text-gray-300 mb-4 md:mb-0">
            <span>Made with</span>
            <SafeIcon icon={FiHeart} className="w-4 h-4 text-coral-400" />
            <span>for dinner party lovers</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-gray-400 text-sm">
              © 2024 DinnerDoodle. All rights reserved.
            </div>
            <button
              onClick={scrollToTop}
              className="p-2 bg-coral-500 rounded-lg hover:bg-coral-600 transition-colors"
              aria-label="Scroll to top"
            >
              <SafeIcon icon={FiArrowUp} className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Version Info */}
        <div className="text-center mt-4 pt-4 border-t border-gray-700">
          <div className="text-xs text-gray-500">
            Version 2.2.0 | Built with React & Supabase
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;