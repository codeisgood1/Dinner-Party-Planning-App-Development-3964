import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useParty } from '../context/PartyContext';
import { getDishCategories } from '../data/themes';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiCalendar, FiMapPin, FiUsers, FiCheck, FiX, FiClock, FiMail } = FiIcons;

const GuestView = () => {
  const { eventId } = useParams();
  const { getEventById, updateGuest, assignDish } = useParty();
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [rsvpStatus, setRsvpStatus] = useState('pending');
  const navigate = useNavigate();

  const event = getEventById(eventId);

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist.</p>
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

  // For demo purposes, we'll simulate being a guest
  const currentGuest = event.guests[0] || { 
    id: 'demo-guest', 
    name: 'Demo Guest', 
    email: 'demo@example.com',
    rsvp: 'pending' 
  };

  const handleRSVP = (status) => {
    setRsvpStatus(status);
    updateGuest(event.id, currentGuest.id, { rsvp: status });
    toast.success(`RSVP updated to ${status}`);
  };

  const handleClaimDish = (dishId) => {
    assignDish(event.id, dishId, currentGuest.id);
    toast.success('Dish claimed successfully!');
  };

  const handleUnclaimDish = (dishId) => {
    assignDish(event.id, dishId, null);
    toast.success('Dish unclaimed');
  };

  const myDishes = event.dishes.filter(dish => dish.assignedTo === currentGuest.id);
  const availableDishes = event.dishes.filter(dish => !dish.assignedTo);
  const confirmedGuests = event.guests.filter(guest => guest.rsvp === 'yes');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Event Header */}
      <div className={`relative overflow-hidden rounded-xl p-8 mb-8 bg-gradient-to-br ${event.theme?.gradient || 'from-primary-500 to-secondary-500'}`}>
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-5xl">{event.theme?.icon || '🍽️'}</span>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{event.title}</h1>
              <p className="text-white/90 text-lg">Hosted by {event.hostName}</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 text-white/90">
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
              <span>{confirmedGuests.length} confirmed guests</span>
            </div>
          </div>
        </div>
      </div>

      {/* RSVP Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your RSVP</h2>
        
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {currentGuest.name?.charAt(0)?.toUpperCase() || 'G'}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{currentGuest.name}</p>
              <p className="text-sm text-gray-600">{currentGuest.email}</p>
            </div>
          </div>
          
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
            rsvpStatus === 'yes' ? 'bg-green-100 text-green-700' :
            rsvpStatus === 'no' ? 'bg-red-100 text-red-700' :
            'bg-yellow-100 text-yellow-700'
          }`}>
            <SafeIcon icon={
              rsvpStatus === 'yes' ? FiCheck :
              rsvpStatus === 'no' ? FiX : FiClock
            } className="w-4 h-4" />
            <span className="text-sm capitalize">{rsvpStatus}</span>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => handleRSVP('yes')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              rsvpStatus === 'yes' 
                ? 'bg-green-600 text-white' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            I'll be there!
          </button>
          <button
            onClick={() => handleRSVP('no')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              rsvpStatus === 'no' 
                ? 'bg-red-600 text-white' 
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            Can't make it
          </button>
          <button
            onClick={() => handleRSVP('pending')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              rsvpStatus === 'pending' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
            }`}
          >
            Maybe
          </button>
        </div>
      </div>

      {/* My Dishes */}
      {myDishes.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">My Dishes ({myDishes.length})</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {myDishes.map((dish) => (
              <motion.div
                key={dish.id}
                className="p-4 border-2 border-green-200 bg-green-50 rounded-lg"
                whileHover={{ y: -2 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{dish.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{dish.description}</p>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      {getDishCategories().find(cat => cat.id === dish.category)?.name}
                    </span>
                  </div>
                  <button
                    onClick={() => handleUnclaimDish(dish.id)}
                    className="ml-4 px-3 py-1 text-red-600 hover:text-red-700 text-sm"
                  >
                    Unclaim
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Available Dishes */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Available Dishes ({availableDishes.length})
        </h2>
        
        {availableDishes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">All dishes are claimed!</h3>
            <p className="text-gray-600">
              Looks like everyone has their assignments. Ready for a great party!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {getDishCategories().map((category) => {
              const categoryDishes = availableDishes.filter(dish => dish.category === category.id);
              if (categoryDishes.length === 0) return null;
              
              return (
                <div key={category.id}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                    <span className="text-sm text-gray-500">({categoryDishes.length} available)</span>
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {categoryDishes.map((dish) => (
                      <motion.div
                        key={dish.id}
                        className="p-4 border border-gray-200 rounded-lg hover:border-primary-200 transition-colors"
                        whileHover={{ y: -2 }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{dish.name}</h4>
                            <p className="text-sm text-gray-600 mb-3">{dish.description}</p>
                            {dish.dietary && dish.dietary.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {dish.dietary.map((diet, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                                  >
                                    {diet}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleClaimDish(dish.id)}
                            className="ml-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                          >
                            Claim
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Other Guests */}
      {confirmedGuests.length > 1 && (
        <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Other Guests ({confirmedGuests.length - 1})
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {confirmedGuests
              .filter(guest => guest.id !== currentGuest.id)
              .map((guest) => {
                const guestDishes = event.dishes.filter(dish => dish.assignedTo === guest.id);
                return (
                  <div key={guest.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-secondary-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {guest.name?.charAt(0)?.toUpperCase() || 'G'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{guest.name}</p>
                        <p className="text-xs text-gray-500">{guestDishes.length} dishes</p>
                      </div>
                    </div>
                    {guestDishes.length > 0 && (
                      <div className="text-sm text-gray-600">
                        {guestDishes.map((dish, index) => (
                          <div key={index}>• {dish.name}</div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestView;