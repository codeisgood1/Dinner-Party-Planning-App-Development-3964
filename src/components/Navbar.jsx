import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import SafeIcon from '../common/SafeIcon';
import UserMenu from './UserMenu';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiMenu, FiX, FiUser, FiPlus, FiHome, FiCalendar } = FiIcons;

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleGetStarted = () => {
    if (user) {
      navigate('/create');
    } else {
      // Redirect to home page with auth modal trigger
      navigate('/?auth=register');
      // Close the mobile menu if it's open
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    }
  };

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-coral-500 to-peach-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">🍽️</span>
            </div>
            <span className="font-poppins font-bold text-xl text-charcoal-500 hidden sm:block">
              Dinner<span className="text-coral-500">Doodle</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors font-inter ${
                isActive('/') ? 'bg-coral-50 text-coral-700' : 'text-charcoal-500 hover:text-coral-600'
              }`}
            >
              <SafeIcon icon={FiHome} className="w-5 h-5" />
              <span>Home</span>
            </Link>

            {user && (
              <>
                <Link
                  to="/create"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors font-inter ${
                    isActive('/create') ? 'bg-coral-50 text-coral-700' : 'text-charcoal-500 hover:text-coral-600'
                  }`}
                >
                  <SafeIcon icon={FiPlus} className="w-5 h-5" />
                  <span>Create Event</span>
                </Link>

                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors font-inter ${
                    isActive('/dashboard') ? 'bg-coral-50 text-coral-700' : 'text-charcoal-500 hover:text-coral-600'
                  }`}
                >
                  <SafeIcon icon={FiCalendar} className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <UserMenu />
            ) : (
              <button
                onClick={handleGetStarted}
                className="bg-coral-500 text-white px-6 py-2 rounded-lg hover:bg-coral-600 transition-colors font-poppins font-medium flex items-center space-x-2"
              >
                <SafeIcon icon={FiUser} className="w-5 h-5" />
                <span>Get Started</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-charcoal-500 hover:text-charcoal-700 hover:bg-cream-100"
          >
            <SafeIcon icon={isMenuOpen ? FiX : FiMenu} className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className={`md:hidden bg-white shadow-lg ${isMenuOpen ? 'block' : 'hidden'}`}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isMenuOpen ? 1 : 0, height: isMenuOpen ? 'auto' : 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="px-4 py-2 space-y-1">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-lg transition-colors ${
              isActive('/') ? 'bg-coral-50 text-coral-700' : 'text-charcoal-500 hover:bg-cream-100'
            }`}
          >
            Home
          </Link>

          {user ? (
            <>
              <Link
                to="/create"
                className={`block px-3 py-2 rounded-lg transition-colors ${
                  isActive('/create') ? 'bg-coral-50 text-coral-700' : 'text-charcoal-500 hover:bg-cream-100'
                }`}
              >
                Create Event
              </Link>
              <Link
                to="/dashboard"
                className={`block px-3 py-2 rounded-lg transition-colors ${
                  isActive('/dashboard') ? 'bg-coral-50 text-coral-700' : 'text-charcoal-500 hover:bg-cream-100'
                }`}
              >
                Dashboard
              </Link>
              <div className="border-t border-gray-200 my-2 py-2">
                <UserMenu />
              </div>
            </>
          ) : (
            <button
              onClick={handleGetStarted}
              className="block w-full px-3 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors text-center"
            >
              Get Started
            </button>
          )}
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;