import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiEye, FiEyeOff, FiSave } = FiIcons;

const PrivacySettings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    showEmail: false,
    showProfileToGuests: true,
    shareEventHistory: false,
    allowDataCollection: true,
    allowMarketingEmails: true
  });

  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // This would save the privacy settings to the user's profile
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API request
      toast.success('Privacy settings updated');
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      toast.error('Failed to update privacy settings');
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
        <h2 className="text-2xl font-bold text-gray-900">Privacy Settings</h2>
        <p className="text-gray-600">Control what information is visible to others</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Privacy */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Privacy</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800">Show Email Address</h4>
                <p className="text-sm text-gray-600">Allow other users to see your email address</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('showEmail')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.showEmail ? 'bg-coral-500' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.showEmail ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800">Show Profile to Event Guests</h4>
                <p className="text-sm text-gray-600">Allow guests at your events to view your profile</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('showProfileToGuests')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.showProfileToGuests ? 'bg-coral-500' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.showProfileToGuests ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800">Share Event History</h4>
                <p className="text-sm text-gray-600">Allow others to see events you've hosted or attended</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('shareEventHistory')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.shareEventHistory ? 'bg-coral-500' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.shareEventHistory ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Data Usage */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Data & Communication</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800">Allow Data Collection</h4>
                <p className="text-sm text-gray-600">Allow us to collect usage data to improve our services</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('allowDataCollection')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.allowDataCollection ? 'bg-coral-500' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.allowDataCollection ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800">Marketing Emails</h4>
                <p className="text-sm text-gray-600">Receive marketing and promotional emails from us</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('allowMarketingEmails')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.allowMarketingEmails ? 'bg-coral-500' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.allowMarketingEmails ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Privacy Controls */}
        <div className="bg-cream-50 p-6 rounded-lg border border-cream-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-coral-100 rounded-full">
              {settings.showEmail || settings.shareEventHistory ? (
                <SafeIcon icon={FiEye} className="w-5 h-5 text-coral-600" />
              ) : (
                <SafeIcon icon={FiEyeOff} className="w-5 h-5 text-coral-600" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Your Privacy Level</h3>
              <p className="text-sm text-gray-600">
                {settings.showEmail && settings.shareEventHistory
                  ? 'Your profile is quite open to other users'
                  : !settings.showEmail && !settings.shareEventHistory
                  ? 'Your profile is very private'
                  : 'Your profile has balanced privacy settings'}
              </p>
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
                Save Privacy Settings
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default PrivacySettings;