import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiSave, FiGlobe, FiClock, FiSliders } = FiIcons;

const PreferenceSettings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    language: 'en',
    timezone: 'America/New_York',
    theme: 'light',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12hour'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // This would save the preference settings to the user's profile
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API request
      toast.success('Preference settings updated');
    } catch (error) {
      console.error('Error updating preference settings:', error);
      toast.error('Failed to update preference settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Preference Settings</h2>
        <p className="text-gray-600">Customize your app experience</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Regional Settings */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <SafeIcon icon={FiGlobe} className="mr-2 w-5 h-5 text-coral-500" />
            Regional Settings
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                name="language"
                value={settings.language}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:outline-none"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="pt">Portuguese</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timezone
              </label>
              <select
                name="timezone"
                value={settings.timezone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:outline-none"
              >
                <option value="America/New_York">Eastern Time (US & Canada)</option>
                <option value="America/Chicago">Central Time (US & Canada)</option>
                <option value="America/Denver">Mountain Time (US & Canada)</option>
                <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Paris</option>
                <option value="Asia/Tokyo">Tokyo</option>
                <option value="Australia/Sydney">Sydney</option>
              </select>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <SafeIcon icon={FiSliders} className="mr-2 w-5 h-5 text-coral-500" />
            Display Settings
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Theme
              </label>
              <select
                name="theme"
                value={settings.theme}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:outline-none"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
              </select>
            </div>
            
            <div className="pt-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="highContrast"
                  className="h-4 w-4 text-coral-500 focus:ring-coral-500 border-gray-300 rounded"
                />
                <label htmlFor="highContrast" className="ml-2 block text-sm text-gray-900">
                  High Contrast Mode
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                Increases contrast for better readability
              </p>
            </div>
            
            <div className="pt-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="animations"
                  className="h-4 w-4 text-coral-500 focus:ring-coral-500 border-gray-300 rounded"
                  checked
                />
                <label htmlFor="animations" className="ml-2 block text-sm text-gray-900">
                  Enable Animations
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                Controls UI animations throughout the app
              </p>
            </div>
          </div>
        </div>

        {/* Date & Time Settings */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <SafeIcon icon={FiClock} className="mr-2 w-5 h-5 text-coral-500" />
            Date & Time Format
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Format
              </label>
              <select
                name="dateFormat"
                value={settings.dateFormat}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:outline-none"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                <option value="DD.MM.YYYY">DD.MM.YYYY</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Format
              </label>
              <select
                name="timeFormat"
                value={settings.timeFormat}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:outline-none"
              >
                <option value="12hour">12-hour (1:30 PM)</option>
                <option value="24hour">24-hour (13:30)</option>
              </select>
            </div>
            
            <div className="pt-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showSeconds"
                  className="h-4 w-4 text-coral-500 focus:ring-coral-500 border-gray-300 rounded"
                />
                <label htmlFor="showSeconds" className="ml-2 block text-sm text-gray-900">
                  Show Seconds
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors disabled:opacity-50 flex items-center"
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Saving...
              </>
            ) : (
              <>
                <SafeIcon icon={FiSave} className="mr-2 w-5 h-5" />
                Save Preferences
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default PreferenceSettings;