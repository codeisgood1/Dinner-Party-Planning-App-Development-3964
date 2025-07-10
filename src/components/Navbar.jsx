import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMenu, FiX, FiUser, FiPlus, FiHome, FiCalendar, FiLogOut } = FiIcons;

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

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
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-coral-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-poppins font-medium">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-charcoal-500 font-poppins font-medium">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-coral-600 transition-colors"
                  title="Logout"
                >
                  <SafeIcon icon={FiLogOut} className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/"
                className="bg-coral-500 text-white px-4 py-2 rounded-lg hover:bg-coral-600 transition-colors font-poppins font-medium"
              >
                Get Started
              </Link>
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
        <div className="px-4 py-2 space-y-2">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors font-inter ${
              isActive('/') ? 'bg-coral-50 text-coral-700' : 'text-charcoal-500 hover:bg-cream-100'
            }`}
          >
            <SafeIcon icon={FiHome} className="w-5 h-5" />
            <span>Home</span>
          </Link>
          {user && (
            <>
              <Link
                to="/create"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors font-inter ${
                  isActive('/create') ? 'bg-coral-50 text-coral-700' : 'text-charcoal-500 hover:bg-cream-100'
                }`}
              >
                <SafeIcon icon={FiPlus} className="w-5 h-5" />
                <span>Create Event</span>
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors font-inter ${
                  isActive('/dashboard') ? 'bg-coral-50 text-coral-700' : 'text-charcoal-500 hover:bg-cream-100'
                }`}
              >
                <SafeIcon icon={FiCalendar} className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
            </>
          )}
          {user ? (
            <div className="border-t pt-2">
              <div className="flex items-center space-x-3 px-3 py-3">
                <div className="w-8 h-8 bg-coral-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-poppins font-medium">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="text-charcoal-500 font-poppins font-medium">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-3 text-coral-600 hover:bg-coral-50 rounded-lg transition-colors font-inter"
              >
                <SafeIcon icon={FiLogOut} className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full bg-coral-500 text-white text-center px-4 py-3 rounded-lg hover:bg-coral-600 transition-colors font-poppins font-medium"
            >
              Get Started
            </Link>
          )}
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;