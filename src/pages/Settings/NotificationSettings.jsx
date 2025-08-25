import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiBell, FiMail, FiPhone, FiSave } = FiIcons;

const NotificationSettings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    eventInvites: true,
    eventReminders: true,
    rsvpUpdates: true,
    dishAssignments: true,
    chatMessages: false,
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false
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
      // This would save the notification settings to the user's profile
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API request
      toast.success('Notification settings updated');
    } catch (error) {
      console.error('Error updating notification settings:', error);
      toast.error('Failed to update notification settings');
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
        <h2 className="text-2xl font-bold text-gray-900">Notification Settings</h2>
        <p className="text-gray-600">Customize how and when you receive notifications</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Event Notifications */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <SafeIcon icon={FiBell} className="mr-2 w-5 h-5 text-coral-500" />
            Event Notifications
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800">Event Invites</h4>
                <p className="text-sm text-gray-600">Receive notifications when you're invited to an event</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('eventInvites')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.eventInvites ? 'bg-coral-500' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.eventInvites ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800">Event Reminders</h4>
                <p className="text-sm text-gray-600">Receive reminders before events you're attending</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('eventReminders')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.eventReminders ? 'bg-coral-500' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.eventReminders ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800">RSVP Updates</h4>
                <p className="text-sm text-gray-600">Be notified when guests RSVP to your events</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('rsvpUpdates')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.rsvpUpdates ? 'bg-coral-500' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.rsvpUpdates ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800">Dish Assignments</h4>
                <p className="text-sm text-gray-600">Be notified when dishes are assigned or claimed</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('dishAssignments')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.dishAssignments ? 'bg-coral-500' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.dishAssignments ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800">Chat Messages</h4>
                <p className="text-sm text-gray-600">Receive notifications for new chat messages</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('chatMessages')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.chatMessages ? 'bg-coral-500' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.chatMessages ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Notification Channels */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification Channels</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiMail} className="w-5 h-5 text-gray-500" />
                <div>
                  <h4 className="font-medium text-gray-800">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('emailNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.emailNotifications ? 'bg-coral-500' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiBell} className="w-5 h-5 text-gray-500" />
                <div>
                  <h4 className="font-medium text-gray-800">Push Notifications</h4>
                  <p className="text-sm text-gray-600">Receive push notifications in your browser</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('pushNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.pushNotifications ? 'bg-coral-500' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiPhone} className="w-5 h-5 text-gray-500" />
                <div>
                  <h4 className="font-medium text-gray-800">SMS Notifications</h4>
                  <p className="text-sm text-gray-600">Receive text message notifications</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('smsNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.smsNotifications ? 'bg-coral-500' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Notification Frequency */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification Frequency</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Reminder Timing
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:outline-none"
              >
                <option value="1day">1 day before</option>
                <option value="2days">2 days before</option>
                <option value="1week">1 week before</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Digest Frequency
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:outline-none"
              >
                <option value="immediately">Immediately</option>
                <option value="daily">Daily Digest</option>
                <option value="weekly">Weekly Digest</option>
                <option value="never">Never</option>
              </select>
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
                Save Notification Settings
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default NotificationSettings;