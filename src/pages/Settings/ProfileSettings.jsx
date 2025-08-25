import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiUser, FiMail, FiSave } = FiIcons;

const ProfileSettings = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    dietaryPreferences: user?.dietaryPreferences || '',
    favoriteFood: user?.favoriteFood || ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateUser(formData);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
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
        <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
        <p className="text-gray-600">Manage your personal information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-coral-100 rounded-full flex items-center justify-center">
            <span className="text-coral-600 font-bold text-2xl">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Profile Picture</h3>
            <p className="text-sm text-gray-500 mb-2">
              This will be displayed on your profile and in events
            </p>
            <button
              type="button"
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Change Picture
            </button>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:outline-none"
              placeholder="Your full name"
              required
            />
            <SafeIcon icon={FiUser} className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Email (read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              value={user?.email || ''}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
              placeholder="Your email address"
              disabled
            />
            <SafeIcon icon={FiMail} className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Email cannot be changed. Contact support for assistance.
          </p>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:outline-none"
            placeholder="Tell us a bit about yourself"
            rows="3"
          />
        </div>

        {/* Dietary Preferences */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dietary Preferences
          </label>
          <input
            type="text"
            name="dietaryPreferences"
            value={formData.dietaryPreferences}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:outline-none"
            placeholder="Vegetarian, vegan, gluten-free, etc."
          />
        </div>

        {/* Favorite Food */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Favorite Food
          </label>
          <input
            type="text"
            name="favoriteFood"
            value={formData.favoriteFood}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:outline-none"
            placeholder="What's your favorite dish?"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Saving...
              </>
            ) : (
              <>
                <SafeIcon icon={FiSave} className="mr-2 w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProfileSettings;