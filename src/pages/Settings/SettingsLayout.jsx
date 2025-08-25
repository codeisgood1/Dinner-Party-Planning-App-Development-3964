import React from 'react';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUserCheck, FiKey, FiLock, FiBell, FiSliders } = FiIcons;

const SettingsLayout = () => {
  const { user } = useAuth();
  const { section = 'profile' } = useParams();
  const navigate = useNavigate();

  if (!user) {
    navigate('/');
    return null;
  }

  const settingsSections = [
    { id: 'profile', name: 'Profile', icon: FiUserCheck },
    { id: 'account', name: 'Account', icon: FiKey },
    { id: 'privacy', name: 'Privacy', icon: FiLock },
    { id: 'notifications', name: 'Notifications', icon: FiBell },
    { id: 'preferences', name: 'Preferences', icon: FiSliders },
  ];

  const handleSectionChange = (sectionId) => {
    navigate(`/settings/${sectionId}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="md:flex">
          {/* Sidebar Navigation */}
          <div className="md:w-64 bg-gray-50 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Settings</h2>
            <nav className="space-y-1">
              {settingsSections.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSectionChange(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition ${
                    section === item.id
                      ? 'bg-coral-100 text-coral-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <SafeIcon icon={item.icon} className="w-5 h-5 mr-3" />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex-1 p-6 md:p-8">
            <Outlet context={{ section }} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsLayout;