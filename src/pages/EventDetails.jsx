import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../context/AuthContext';
import { useParty } from '../context/PartyContext';
import { getDishCategories } from '../data/themes';
import DishCard from '../components/DishCard';
import GuestCard from '../components/GuestCard';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiShare2, FiCopy, FiUsers, FiCalendar, FiMapPin, FiEdit, FiTrash2 } = FiIcons;

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { getEventById, updateEvent, deleteEvent, assignDish, updateGuest } = useParty();
  const [activeTab, setActiveTab] = useState('dishes');
  const [showShareModal, setShowShareModal] = useState(false);
  const navigate = useNavigate();

  const event = getEventById(id);

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isHost = user && event.hostId === user.id;
  const shareUrl = `${window.location.origin}/#/join/${event.code}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(event.code);
    toast.success('Event code copied!');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Share link copied!');
  };

  const handleAssignDish = (dishId) => {
    // For demo purposes, assign to first available guest
    const availableGuest = event.guests.find(guest => guest.rsvp === 'yes');
    if (availableGuest) {
      assignDish(event.id, dishId, availableGuest.id);
      toast.success('Dish assigned successfully!');
    } else {
      toast.error('No available guests to assign dish to');
    }
  };

  const handleUnassignDish = (dishId) => {
    assignDish(event.id, dishId, null);
    toast.success('Dish unassigned');
  };

  const handleUpdateRSVP = (guestId, rsvp) => {
    updateGuest(event.id, guestId, { rsvp });
    toast.success(`RSVP updated to ${rsvp}`);
  };

  const handleDeleteEvent = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(event.id);
      toast.success('Event deleted');
      navigate('/dashboard');
    }
  };

  const getAssignedGuest = (dishId) => {
    const dish = event.dishes.find(d => d.id === dishId);
    return dish?.assignedTo ? event.guests.find(g => g.id === dish.assignedTo) : null;
  };

  const confirmedGuests = event.guests.filter(guest => guest.rsvp === 'yes');
  const pendingGuests = event.guests.filter(guest => guest.rsvp === 'pending');
  const assignedDishes = event.dishes.filter(dish => dish.assignedTo);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className={`relative overflow-hidden rounded-xl p-8 mb-8 bg-gradient-to-br ${event.theme?.gradient || 'from-primary-500 to-secondary-500'}`}>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-4xl">{event.theme?.icon || '🍽️'}</span>
                <h1 className="text-3xl font-bold text-white">{event.title}</h1>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCalendar} className="w-5 h-5" />
                  <span>{event.date} at {event.time}</span>
                </div>
                {event.location && (
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiMapPin} className="w-5 h-5" />
                    <span>{event.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiUsers} className="w-5 h-5" />
                  <span>{event.guests.length} / {event.maxGuests} guests</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowShareModal(true)}
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors flex items-center space-x-2"
              >
                <SafeIcon icon={FiShare2} className="w-5 h-5" />
                <span>Share</span>
              </button>
              
              {isHost && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/create`)}
                    className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <SafeIcon icon={FiEdit} className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleDeleteEvent}
                    className="px-4 py-2 bg-red-500/20 text-white rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="px-4 py-2 bg-white/20 rounded-lg">
              <span className="text-white font-mono text-lg">{event.code}</span>
            </div>
            <button
              onClick={handleCopyCode}
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              <SafeIcon icon={FiCopy} className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-primary-600">{confirmedGuests.length}</div>
          <div className="text-sm text-gray-600">Confirmed Guests</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-yellow-600">{pendingGuests.length}</div>
          <div className="text-sm text-gray-600">Pending RSVPs</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-green-600">{assignedDishes.length}</div>
          <div className="text-sm text-gray-600">Assigned Dishes</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-blue-600">{event.dishes.length - assignedDishes.length}</div>
          <div className="text-sm text-gray-600">Available Dishes</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'dishes', label: 'Dishes', count: event.dishes.length },
              { id: 'guests', label: 'Guests', count: event.guests.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'dishes' && (
            <div className="space-y-8">
              {getDishCategories().map((category) => {
                const categoryDishes = event.dishes.filter(dish => dish.category === category.id);
                if (categoryDishes.length === 0) return null;
                
                return (
                  <div key={category.id}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {categoryDishes.map((dish) => (
                        <DishCard
                          key={dish.id}
                          dish={dish}
                          assigned={!!dish.assignedTo}
                          guest={getAssignedGuest(dish.id)}
                          onAssign={handleAssignDish}
                          onUnassign={handleUnassignDish}
                          canEdit={isHost}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'guests' && (
            <div className="space-y-6">
              {event.guests.length === 0 ? (
                <div className="text-center py-12">
                  <SafeIcon icon={FiUsers} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No guests yet</h3>
                  <p className="text-gray-600 mb-6">Share your event code to invite guests!</p>
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Share Event
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {event.guests.map((guest) => (
                    <GuestCard
                      key={guest.id}
                      guest={guest}
                      dishes={event.dishes}
                      onUpdateRSVP={isHost ? handleUpdateRSVP : undefined}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-8 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Share Your Event</h2>
            
            <div className="space-y-6">
              <div className="text-center">
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <QRCodeSVG value={shareUrl} size={200} className="mx-auto" />
                </div>
                <p className="text-sm text-gray-600">Scan QR code to join</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Code
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={event.code}
                    readOnly
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg bg-gray-50"
                  />
                  <button
                    onClick={handleCopyCode}
                    className="px-4 py-3 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700 transition-colors"
                  >
                    <SafeIcon icon={FiCopy} className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share Link
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg bg-gray-50 text-sm"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-3 bg-secondary-600 text-white rounded-r-lg hover:bg-secondary-700 transition-colors"
                  >
                    <SafeIcon icon={FiCopy} className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;