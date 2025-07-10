import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiMail, FiPhone, FiCheck, FiX, FiClock } = FiIcons;

const GuestCard = ({ guest, dishes = [], onUpdateRSVP }) => {
  const assignedDishes = dishes.filter(dish => dish.assignedTo === guest.id);

  const getRSVPIcon = (status) => {
    switch (status) {
      case 'yes': return FiCheck;
      case 'no': return FiX;
      default: return FiClock;
    }
  };

  const getRSVPColor = (status) => {
    switch (status) {
      case 'yes': return 'text-sage-600 bg-mint-100';
      case 'no': return 'text-coral-600 bg-coral-100';
      default: return 'text-golden-600 bg-golden-100';
    }
  };

  return (
    <motion.div
      className="p-4 bg-white rounded-lg border border-lightgray-200 hover:shadow-md transition-shadow"
      whileHover={{ y: -2 }}
      layout
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-coral-500 rounded-full flex items-center justify-center">
            <span className="text-white font-poppins font-medium">
              {guest.name?.charAt(0)?.toUpperCase() || 'G'}
            </span>
          </div>
          <div>
            <h4 className="font-poppins font-semibold text-charcoal-800">{guest.name}</h4>
            <div className="flex items-center space-x-2 text-sm font-inter text-gray-600">
              <SafeIcon icon={FiMail} className="w-4 h-4" />
              <span>{guest.email}</span>
            </div>
            {guest.phone && (
              <div className="flex items-center space-x-2 text-sm font-inter text-gray-600">
                <SafeIcon icon={FiPhone} className="w-4 h-4" />
                <span>{guest.phone}</span>
              </div>
            )}
          </div>
        </div>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getRSVPColor(guest.rsvp)}`}>
          <SafeIcon icon={getRSVPIcon(guest.rsvp)} className="w-4 h-4" />
          <span className="text-sm font-inter capitalize">{guest.rsvp || 'pending'}</span>
        </div>
      </div>

      {assignedDishes.length > 0 && (
        <div className="mt-3 p-3 bg-cream-50 rounded-lg">
          <h5 className="font-poppins font-medium text-charcoal-700 mb-2">Assigned Dishes:</h5>
          <div className="space-y-1">
            {assignedDishes.map((dish, index) => (
              <div key={index} className="text-sm font-inter text-gray-600">
                • {dish.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {guest.rsvp === 'pending' && onUpdateRSVP && (
        <div className="mt-3 flex space-x-2">
          <button
            onClick={() => onUpdateRSVP(guest.id, 'yes')}
            className="flex-1 px-3 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-colors text-sm font-poppins"
          >
            Accept
          </button>
          <button
            onClick={() => onUpdateRSVP(guest.id, 'no')}
            className="flex-1 px-3 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors text-sm font-poppins"
          >
            Decline
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default GuestCard;