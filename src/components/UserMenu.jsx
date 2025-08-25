import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiUser, FiSettings, FiLogOut, FiHelpCircle, FiShield, FiKey, FiLock, FiUserCheck, FiSliders, FiBell } = FiIcons;

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isSettingsOpen) setIsSettingsOpen(false);
  };

  const toggleSettingsMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  const handleGoToAdmin = () => {
    if (user?.email === 'theimperialopa@gmail.com') {
      navigate('/admin/dashboard');
      setIsOpen(false);
    } else {
      toast.error('Access denied');
    }
  };

  const handleSettingClick = (setting) => {
    setIsSettingsOpen(false);
    setIsOpen(false);
    navigate(`/settings/${setting}`);
    toast.success(`Navigating to ${setting} settings`);
  };

  return (
    <div className="relative">
      <button onClick={toggleMenu} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-cream-50 transition-colors">
        <div className="w-8 h-8 bg-coral-100 rounded-full flex items-center justify-center">
          <span className="text-coral-600 font-medium">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </span>
        </div>
        <span className="text-charcoal-800 font-medium hidden md:block">
          {user?.name || 'User'}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg z-20 py-2 border border-gray-100"
            >
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="font-medium text-charcoal-800">{user?.name}</p>
                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
              </div>
              <div className="py-1">
                <Link to="/dashboard" className="flex items-center px-4 py-2 text-gray-700 hover:bg-cream-50" onClick={() => setIsOpen(false)}>
                  <SafeIcon icon={FiUser} className="w-5 h-5 mr-3 text-gray-500" />
                  Dashboard
                </Link>
                <div className="relative">
                  <button 
                    onClick={toggleSettingsMenu} 
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-cream-50 w-full text-left justify-between"
                  >
                    <div className="flex items-center">
                      <SafeIcon icon={FiSettings} className="w-5 h-5 mr-3 text-gray-500" />
                      Settings
                    </div>
                    <span className="text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </span>
                  </button>
                  
                  <AnimatePresence>
                    {isSettingsOpen && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="absolute left-full top-0 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-30"
                      >
                        <div className="py-1">
                          <button 
                            onClick={() => handleSettingClick('profile')} 
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-cream-50 w-full text-left"
                          >
                            <SafeIcon icon={FiUserCheck} className="w-5 h-5 mr-3 text-gray-500" />
                            Profile
                          </button>
                          <button 
                            onClick={() => handleSettingClick('account')} 
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-cream-50 w-full text-left"
                          >
                            <SafeIcon icon={FiKey} className="w-5 h-5 mr-3 text-gray-500" />
                            Account
                          </button>
                          <button 
                            onClick={() => handleSettingClick('privacy')} 
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-cream-50 w-full text-left"
                          >
                            <SafeIcon icon={FiLock} className="w-5 h-5 mr-3 text-gray-500" />
                            Privacy
                          </button>
                          <button 
                            onClick={() => handleSettingClick('notifications')} 
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-cream-50 w-full text-left"
                          >
                            <SafeIcon icon={FiBell} className="w-5 h-5 mr-3 text-gray-500" />
                            Notifications
                          </button>
                          <button 
                            onClick={() => handleSettingClick('preferences')} 
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-cream-50 w-full text-left"
                          >
                            <SafeIcon icon={FiSliders} className="w-5 h-5 mr-3 text-gray-500" />
                            Preferences
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <Link to="/help" className="flex items-center px-4 py-2 text-gray-700 hover:bg-cream-50" onClick={() => setIsOpen(false)}>
                  <SafeIcon icon={FiHelpCircle} className="w-5 h-5 mr-3 text-gray-500" />
                  Help & Support
                </Link>
                {user?.email === 'theimperialopa@gmail.com' && (
                  <button onClick={handleGoToAdmin} className="flex items-center px-4 py-2 text-gray-700 hover:bg-cream-50 w-full text-left">
                    <SafeIcon icon={FiShield} className="w-5 h-5 mr-3 text-gray-500" />
                    Admin Panel
                  </button>
                )}
              </div>
              <div className="py-1 border-t border-gray-100">
                <button onClick={handleLogout} className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left">
                  <SafeIcon icon={FiLogOut} className="w-5 h-5 mr-3" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;