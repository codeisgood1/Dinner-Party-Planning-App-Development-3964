import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useParty } from '../context/PartyContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiUser, FiMail, FiPhone, FiArrowRight } = FiIcons;

const JoinEvent = () => {
  const { code } = useParams();
  const { getEventByCode, joinEvent } = useParty();
  const [guestData, setGuestData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const navigate = useNavigate();

  const event = getEventByCode(code);

  if (!event) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-xl p-8 shadow-lg text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <p className="text-gray-600 mb-6">
            The event code "{code}" doesn't exist or has expired.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if guest already exists
    const existingGuest = event.guests.find(guest => guest.email === guestData.email);
    if (existingGuest) {
      toast.error('You have already joined this event');
      navigate(`/guest/${event.id}`);
      return;
    }

    // Check if event is full
    if (event.guests.length >= event.maxGuests) {
      toast.error('This event is full');
      return;
    }

    try {
      const result = joinEvent(code, guestData);
      toast.success('Successfully joined the event!');
      navigate(`/guest/${event.id}`);
    } catch (error) {
      toast.error('Failed to join event');
    }
  };

  const confirmedGuests = event.guests.filter(guest => guest.rsvp === 'yes').length;
  const spotsLeft = event.maxGuests - event.guests.length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        {/* Event Header */}
        <div className={`p-8 bg-gradient-to-br ${event.theme?.gradient || 'from-primary-500 to-secondary-500'}`}>
          <div className="text-center">
            <div className="text-6xl mb-4">{event.theme?.icon || '🍽️'}</div>
            <h1 className="text-3xl font-bold text-white mb-2">{event.title}</h1>
            <p className="text-white/90 text-lg">
              Hosted by {event.hostName}
            </p>
          </div>
        </div>

        {/* Event Details */}
        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Event Details</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Date:</strong> {event.date}</p>
                <p><strong>Time:</strong> {event.time}</p>
                {event.location && (
                  <p><strong>Location:</strong> {event.location}</p>
                )}
                <p><strong>Theme:</strong> {event.theme?.name}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Attendance</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Confirmed:</strong> {confirmedGuests} guests</p>
                <p><strong>Spots Left:</strong> {spotsLeft}</p>
                <p><strong>Total Dishes:</strong> {event.dishes.length}</p>
              </div>
            </div>
          </div>

          {event.description && (
            <div className="mb-8">
              <h3 className="font-semibold text-gray-800 mb-2">About This Event</h3>
              <p className="text-gray-600">{event.description}</p>
            </div>
          )}

          {/* Join Form */}
          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Join the Party!</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={guestData.name}
                    onChange={(e) => setGuestData({...guestData, name: e.target.value})}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter your full name"
                  />
                  <SafeIcon icon={FiUser} className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={guestData.email}
                    onChange={(e) => setGuestData({...guestData, email: e.target.value})}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter your email"
                  />
                  <SafeIcon icon={FiMail} className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={guestData.phone}
                    onChange={(e) => setGuestData({...guestData, phone: e.target.value})}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter your phone number"
                  />
                  <SafeIcon icon={FiPhone} className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={spotsLeft === 0}
                className="w-full px-6 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{spotsLeft === 0 ? 'Event Full' : 'Join Event'}</span>
                {spotsLeft > 0 && <SafeIcon icon={FiArrowRight} className="w-5 h-5" />}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default JoinEvent;