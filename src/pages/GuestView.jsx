import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useParty } from '../context/PartyContext';
import { getDishCategories } from '../data/themes';
import SafeIcon from '../common/SafeIcon';
import EventChat from '../components/EventChat';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiCalendar, FiMapPin, FiUsers, FiCheck, FiX, FiClock, FiMail, FiTool, FiPackage, FiAlignLeft, FiMessageSquare } = FiIcons;

const GuestView = () => {
  const { eventId } = useParams();
  const { getEventById, updateGuest, assignDish, assignItem, updateEvent } = useParty();
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [rsvpStatus, setRsvpStatus] = useState('pending');
  const [activeTab, setActiveTab] = useState('dishes');
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
            className="px-6 py-3 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // For demo purposes, we'll simulate being a guest
  const currentGuest = event.guests[0] || { id: 'demo-guest', name: 'Demo Guest', email: 'demo@example.com', rsvp: 'pending' };

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

  const handleClaimItem = (itemId) => {
    assignItem(event.id, itemId, currentGuest.id);
    toast.success('Item claimed successfully!');
  };

  const handleUnclaimItem = (itemId) => {
    assignItem(event.id, itemId, null);
    toast.success('Item unclaimed');
  };
  
  const handleSendMessage = (newMessage) => {
    const currentMessages = event.messages || [];
    updateEvent(eventId, { 
      messages: [...currentMessages, newMessage] 
    });
  };

  const myDishes = event.dishes.filter(dish => dish.assignedTo === currentGuest.id);
  const myItems = (event.items || []).filter(item => item.assignedTo === currentGuest.id);
  const availableDishes = event.dishes.filter(dish => !dish.assignedTo);
  const availableItems = (event.items || []).filter(item => !item.assignedTo);
  const confirmedGuests = event.guests.filter(guest => guest.rsvp === 'yes');

  const itemCategories = [
    { id: 'supplies', name: 'Supplies', icon: '📦' },
    { id: 'utensils', name: 'Utensils', icon: '🍴' },
    { id: 'decorations', name: 'Decorations', icon: '🎨' },
    { id: 'drinks', name: 'Drinks', icon: '🥤' },
    { id: 'other', name: 'Other', icon: '📋' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Event Header */}
      <div className={`relative overflow-hidden rounded-xl p-8 mb-8 bg-gradient-to-br ${event.theme?.gradient || 'from-coral-600 to-sage-700'}`}>
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

      {/* Event Description */}
      {event.description && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <SafeIcon icon={FiAlignLeft} className="w-5 h-5 text-coral-500" />
            <h2 className="text-xl font-bold text-gray-900">About This Event</h2>
          </div>
          <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
        </div>
      )}

      {/* RSVP Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your RSVP</h2>
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-coral-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {currentGuest.name?.charAt(0)?.toUpperCase() || 'G'}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{currentGuest.name}</p>
              <p className="text-sm text-gray-600">{currentGuest.email}</p>
            </div>
          </div>
          <div
            className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
              rsvpStatus === 'yes'
                ? 'bg-green-100 text-green-700'
                : rsvpStatus === 'no'
                ? 'bg-red-100 text-red-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            <SafeIcon
              icon={rsvpStatus === 'yes' ? FiCheck : rsvpStatus === 'no' ? FiX : FiClock}
              className="w-4 h-4"
            />
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

      {/* My Assignments */}
      {(myDishes.length > 0 || myItems.length > 0) && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">My Assignments</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {myDishes.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Dishes ({myDishes.length})</h3>
                <div className="space-y-3">
                  {myDishes.map((dish) => (
                    <div key={dish.id} className="p-3 border-2 border-green-200 bg-green-50 rounded-lg">
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
                    </div>
                  ))}
                </div>
              </div>
            )}

            {myItems.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Items ({myItems.length})</h3>
                <div className="space-y-3">
                  {myItems.map((item) => (
                    <div key={item.id} className="p-3 border-2 border-blue-200 bg-blue-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{item.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            Qty: {item.quantity}
                          </span>
                        </div>
                        <button
                          onClick={() => handleUnclaimItem(item.id)}
                          className="ml-4 px-3 py-1 text-red-600 hover:text-red-700 text-sm"
                        >
                          Unclaim
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'dishes', label: 'Dishes', count: event.dishes.length },
              { id: 'items', label: 'Items', count: (event.items || []).length },
              { id: 'equipment', label: 'Equipment', count: (event.equipment || []).length },
              { id: 'guests', label: 'Guests', count: event.guests.length },
              { id: 'chat', label: 'Chat', count: (event.messages || []).length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-coral-500 text-coral-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Dishes Tab */}
          {activeTab === 'dishes' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">All Dishes</h2>
              <div className="space-y-8">
                {getDishCategories().map((category) => {
                  const categoryDishes = event.dishes.filter(dish => dish.category === category.id);
                  if (categoryDishes.length === 0) return null;
                  return (
                    <div key={category.id}>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                        <span className="text-sm text-gray-500">({categoryDishes.length} dishes)</span>
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {categoryDishes.map((dish) => {
                          const assignedGuest = event.guests.find(g => g.id === dish.assignedTo);
                          const isMyDish = dish.assignedTo === currentGuest.id;
                          const isAvailable = !dish.assignedTo;
                          return (
                            <div
                              key={dish.id}
                              className={`p-4 rounded-lg border-2 transition-colors ${
                                isMyDish
                                  ? 'border-green-300 bg-green-50'
                                  : isAvailable
                                  ? 'border-gray-200 bg-white hover:border-coral-200'
                                  : 'border-gray-200 bg-gray-50'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-800">{dish.name}</h4>
                                  <p className="text-sm text-gray-600 mb-3">{dish.description}</p>
                                  {assignedGuest && (
                                    <div className="flex items-center space-x-2 mb-2">
                                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                        {isMyDish ? 'You' : assignedGuest.name}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  {isAvailable && (
                                    <button
                                      onClick={() => handleClaimDish(dish.id)}
                                      className="px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors text-sm"
                                    >
                                      Claim
                                    </button>
                                  )}
                                  {isMyDish && (
                                    <button
                                      onClick={() => handleUnclaimDish(dish.id)}
                                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                                    >
                                      Unclaim
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Items Tab */}
          {activeTab === 'items' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Items Needed</h2>
              <div className="space-y-8">
                {itemCategories.map((category) => {
                  const categoryItems = (event.items || []).filter(item => item.category === category.id);
                  if (categoryItems.length === 0) return null;
                  return (
                    <div key={category.id}>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                        <span className="text-sm text-gray-500">({categoryItems.length} items)</span>
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {categoryItems.map((item) => {
                          const assignedGuest = event.guests.find(g => g.id === item.assignedTo);
                          const isMyItem = item.assignedTo === currentGuest.id;
                          const isAvailable = !item.assignedTo;
                          return (
                            <div
                              key={item.id}
                              className={`p-4 rounded-lg border-2 transition-colors ${
                                isMyItem
                                  ? 'border-blue-300 bg-blue-50'
                                  : isAvailable
                                  ? 'border-gray-200 bg-white hover:border-coral-200'
                                  : 'border-gray-200 bg-gray-50'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-800">{item.name}</h4>
                                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                                  <div className="flex items-center space-x-2 mb-2">
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                      Qty: {item.quantity}
                                    </span>
                                    {assignedGuest && (
                                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                        {isMyItem ? 'You' : assignedGuest.name}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="ml-4">
                                  {isAvailable && (
                                    <button
                                      onClick={() => handleClaimItem(item.id)}
                                      className="px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors text-sm"
                                    >
                                      I'll bring this
                                    </button>
                                  )}
                                  {isMyItem && (
                                    <button
                                      onClick={() => handleUnclaimItem(item.id)}
                                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                                    >
                                      Cancel
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                {(event.items || []).length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No items needed</h3>
                    <p className="text-gray-600">
                      The host hasn't added any items that need to be brought.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Equipment Tab */}
          {activeTab === 'equipment' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Available Equipment</h2>
              <div className="space-y-4">
                {(event.equipment || []).map((equipment) => (
                  <div key={equipment.id} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={FiTool} className="w-6 h-6 text-blue-500" />
                      <div>
                        <h3 className="font-semibold text-gray-800">{equipment.name}</h3>
                        {equipment.description && (
                          <p className="text-gray-600 text-sm">{equipment.description}</p>
                        )}
                        <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          Quantity: {equipment.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {(event.equipment || []).length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔧</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No equipment listed</h3>
                    <p className="text-gray-600">
                      The host hasn't listed any available equipment yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Guests Tab */}
          {activeTab === 'guests' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">All Guests</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {event.guests.map((guest) => {
                  const guestDishes = event.dishes.filter(dish => dish.assignedTo === guest.id);
                  const guestItems = (event.items || []).filter(item => item.assignedTo === guest.id);
                  return (
                    <div key={guest.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-sage-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {guest.name?.charAt(0)?.toUpperCase() || 'G'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{guest.name}</p>
                          <p className="text-xs text-gray-500">
                            {guestDishes.length} dishes, {guestItems.length} items
                          </p>
                        </div>
                      </div>
                      <div
                        className={`flex items-center space-x-2 px-2 py-1 rounded-full text-xs ${
                          guest.rsvp === 'yes'
                            ? 'bg-green-100 text-green-700'
                            : guest.rsvp === 'no'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        <SafeIcon
                          icon={guest.rsvp === 'yes' ? FiCheck : guest.rsvp === 'no' ? FiX : FiClock}
                          className="w-3 h-3"
                        />
                        <span className="capitalize">{guest.rsvp || 'pending'}</span>
                      </div>
                      {(guestDishes.length > 0 || guestItems.length > 0) && (
                        <div className="mt-3 text-sm text-gray-600">
                          {guestDishes.map((dish, index) => (
                            <div key={index}>🍽️ {dish.name}</div>
                          ))}
                          {guestItems.map((item, index) => (
                            <div key={index}>📦 {item.name}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div>
              <EventChat 
                event={event}
                onSendMessage={handleSendMessage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestView;