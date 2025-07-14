import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiUser, FiEdit, FiCreditCard, FiMapPin, FiMail, FiLock, FiLogOut, FiX, FiCheck, FiHelpCircle, FiShield } = FiIcons;

const UserMenu = () => {
  const { user, updateUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: user?.address || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [billingData, setBillingData] = useState({
    cardName: user?.billing?.cardName || '',
    cardNumber: user?.billing?.cardNumber || '',
    expiryDate: user?.billing?.expiryDate || '',
    cvv: '',
    billingAddress: user?.billing?.billingAddress || user?.address || ''
  });

  const [helpData, setHelpData] = useState({
    subject: '',
    description: '',
    email: user?.email || ''
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (profileData.newPassword) {
      if (profileData.newPassword !== profileData.confirmPassword) {
        toast.error('New passwords do not match');
        return;
      }
      if (!profileData.currentPassword) {
        toast.error('Current password is required to set a new password');
        return;
      }
    }

    try {
      await updateUser({
        ...user,
        name: profileData.name,
        email: profileData.email,
        address: profileData.address,
        ...(profileData.newPassword && { password: profileData.newPassword })
      });
      toast.success('Profile updated successfully');
      setShowProfileModal(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleBillingUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUser({
        ...user,
        billing: {
          cardName: billingData.cardName,
          cardNumber: billingData.cardNumber.replace(/\s/g, ''),
          expiryDate: billingData.expiryDate,
          billingAddress: billingData.billingAddress
        }
      });
      toast.success('Billing information updated successfully');
      setShowBillingModal(false);
    } catch (error) {
      toast.error('Failed to update billing information');
    }
  };

  const handleSubmitHelp = async (e) => {
    e.preventDefault();
    try {
      toast.success('Help ticket submitted successfully');
      setShowHelpModal(false);
      setHelpData({
        subject: '',
        description: '',
        email: user?.email || ''
      });
    } catch (error) {
      toast.error('Failed to submit help ticket');
    }
  };

  const handleGoToAdmin = () => {
    navigate('/admin/login');
    setIsOpen(false);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Profile Modal Component
  const ProfileModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
          <button
            onClick={() => setShowProfileModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiX} className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                required
              />
              <SafeIcon icon={FiUser} className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                required
              />
              <SafeIcon icon={FiMail} className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Address
            </label>
            <div className="relative">
              <input
                type="text"
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
              />
              <SafeIcon icon={FiMapPin} className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={profileData.currentPassword}
                    onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                  />
                  <SafeIcon icon={FiLock} className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={profileData.newPassword}
                    onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                  />
                  <SafeIcon icon={FiLock} className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={profileData.confirmPassword}
                    onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                  />
                  <SafeIcon icon={FiLock} className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-coral-500 text-white py-2 rounded-lg hover:bg-coral-600 transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setShowProfileModal(false)}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );

  // Billing Modal Component
  const BillingModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Billing Settings</h2>
          <button
            onClick={() => setShowBillingModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiX} className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleBillingUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name on Card
            </label>
            <input
              type="text"
              value={billingData.cardName}
              onChange={(e) => setBillingData({ ...billingData, cardName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Number
            </label>
            <input
              type="text"
              value={billingData.cardNumber}
              onChange={(e) => setBillingData({ ...billingData, cardNumber: formatCardNumber(e.target.value) })}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                value={billingData.expiryDate}
                onChange={(e) => setBillingData({ ...billingData, expiryDate: e.target.value })}
                placeholder="MM/YY"
                maxLength="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVV
              </label>
              <input
                type="text"
                value={billingData.cvv}
                onChange={(e) => setBillingData({ ...billingData, cvv: e.target.value })}
                placeholder="123"
                maxLength="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Billing Address
            </label>
            <textarea
              value={billingData.billingAddress}
              onChange={(e) => setBillingData({ ...billingData, billingAddress: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
              rows="3"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-coral-500 text-white py-2 rounded-lg hover:bg-coral-600 transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setShowBillingModal(false)}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );

  // Help Modal Component
  const HelpModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Help & Support</h2>
          <button
            onClick={() => setShowHelpModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiX} className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitHelp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              value={helpData.subject}
              onChange={(e) => setHelpData({ ...helpData, subject: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
              placeholder="What do you need help with?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={helpData.description}
              onChange={(e) => setHelpData({ ...helpData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
              rows="4"
              placeholder="Please describe your issue in detail..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              value={helpData.email}
              onChange={(e) => setHelpData({ ...helpData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-coral-500 text-white py-2 rounded-lg hover:bg-coral-600 transition-colors flex items-center justify-center"
            >
              <SafeIcon icon={FiCheck} className="w-5 h-5 mr-2" />
              Submit Ticket
            </button>
            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="w-8 h-8 bg-coral-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <span className="text-gray-700 font-medium">{user?.name}</span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
            >
              <div className="p-4 border-b border-gray-100">
                <div className="font-medium text-gray-900">{user?.name}</div>
                <div className="text-sm text-gray-500">{user?.email}</div>
              </div>

              <div className="p-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShowProfileModal(true);
                  }}
                  className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors text-left"
                >
                  <SafeIcon icon={FiUser} className="w-5 h-5 text-gray-500" />
                  <span>Edit Profile</span>
                </button>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShowBillingModal(true);
                  }}
                  className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors text-left"
                >
                  <SafeIcon icon={FiCreditCard} className="w-5 h-5 text-gray-500" />
                  <span>Billing Settings</span>
                </button>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShowHelpModal(true);
                  }}
                  className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors text-left"
                >
                  <SafeIcon icon={FiHelpCircle} className="w-5 h-5 text-gray-500" />
                  <span>Help & Support</span>
                </button>

                <button
                  onClick={handleGoToAdmin}
                  className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors text-left text-purple-600"
                >
                  <SafeIcon icon={FiShield} className="w-5 h-5" />
                  <span>Admin Panel</span>
                </button>

                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors text-left text-red-600"
                >
                  <SafeIcon icon={FiLogOut} className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Render modals using portals */}
      {showProfileModal && createPortal(<ProfileModal />, document.body)}
      {showBillingModal && createPortal(<BillingModal />, document.body)}
      {showHelpModal && createPortal(<HelpModal />, document.body)}
    </>
  );
};

export default UserMenu;