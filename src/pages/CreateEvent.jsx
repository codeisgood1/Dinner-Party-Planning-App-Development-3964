import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useParty } from '../context/PartyContext';
import SafeIcon from '../common/SafeIcon';
import ThemeCard from '../components/ThemeCard';
import { themes, getDishCategories } from '../data/themes';
import * as FiIcons from 'react-icons/fi';

const { FiArrowRight, FiArrowLeft, FiCalendar, FiMapPin, FiUsers, FiPlus, FiTrash2, FiEdit } = FiIcons;

const CreateEvent = () => {
  const { user } = useAuth();
  const { createEvent } = useParty();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    theme: null,
    maxGuests: 10,
    dishes: [],
    customDishes: []
  });

  const [customDish, setCustomDish] = useState({
    name: '',
    category: '',
    description: ''
  });

  const handleNext = () => {
    if (step === 1 && (!eventData.title || !eventData.date || !eventData.time)) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (step === 2 && !eventData.theme) {
      toast.error('Please select a theme');
      return;
    }

    if (step === 4) {
      handleCreateEvent();
      return;
    }

    setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleThemeSelect = (theme) => {
    // If custom theme, just set the theme ID without adding dishes
    if (theme.id === 'custom') {
      setEventData({
        ...eventData,
        theme: theme.id,
        dishes: []
      });
    } else {
      setEventData({
        ...eventData,
        theme: theme.id,
        dishes: theme.dishes.map(dish => ({
          ...dish,
          id: `${theme.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          isThemeDish: true
        }))
      });
    }
  };

  const handleAddCustomDish = () => {
    if (!customDish.name || !customDish.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newDish = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...customDish,
      isCustom: true
    };

    setEventData({
      ...eventData,
      dishes: [...eventData.dishes, newDish]
    });

    setCustomDish({
      name: '',
      category: '',
      description: ''
    });

    toast.success('Custom dish added successfully!');
  };

  const handleRemoveDish = (dishId) => {
    setEventData({
      ...eventData,
      dishes: eventData.dishes.filter(dish => dish.id !== dishId)
    });
    toast.success('Dish removed');
  };

  const handleCreateEvent = async () => {
    try {
      if (!user) {
        toast.error('Please log in to create an event');
        return;
      }

      const newEvent = {
        ...eventData,
        hostId: user.id,
        hostName: user.name,
        createdAt: new Date().toISOString(),
        code: Math.random().toString(36).substring(2, 8).toUpperCase()
      };

      const createdEvent = createEvent(newEvent);
      toast.success('Event created successfully!');
      navigate(`/event/${createdEvent.id}`);
    } catch (error) {
      toast.error('Failed to create event');
      console.error('Error creating event:', error);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((num) => (
        <div key={num} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center 
            ${step >= num ? 'bg-coral-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
            {num}
          </div>
          {num < 4 && (
            <div className={`w-12 h-1 ${step > num ? 'bg-coral-500' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Event Details</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Title *
          </label>
          <input
            type="text"
            value={eventData.title}
            onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
            placeholder="Enter event title"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <SafeIcon icon={FiCalendar} className="mr-2 w-4 h-4" />
              Date *
            </label>
            <input
              type="date"
              value={eventData.date}
              onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time *
            </label>
            <input
              type="time"
              value={eventData.time}
              onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <SafeIcon icon={FiMapPin} className="mr-2 w-4 h-4" />
            Location
          </label>
          <input
            type="text"
            value={eventData.location}
            onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
            placeholder="Enter event location"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <SafeIcon icon={FiUsers} className="mr-2 w-4 h-4" />
            Maximum Guests
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={eventData.maxGuests}
            onChange={(e) => setEventData({ ...eventData, maxGuests: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
          />
        </div>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Theme</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(themes).map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            selected={eventData.theme === theme.id}
            onSelect={handleThemeSelect}
          />
        ))}
        
        {/* Custom Theme Card */}
        <motion.div 
          className={`relative p-6 rounded-xl cursor-pointer transition-all duration-300 
            ${eventData.theme === 'custom' ? 'ring-2 ring-coral-500 bg-white shadow-lg scale-105' : 'bg-white hover:shadow-md hover:scale-102'}`}
          onClick={() => handleThemeSelect({id: 'custom', name: 'Custom Theme'})}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 opacity-10" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl animate-doodle">✏️</span>
              {eventData.theme === 'custom' && (
                <div className="w-6 h-6 bg-coral-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
              )}
            </div>
            <h3 className="text-xl font-poppins font-bold text-charcoal-800 mb-2">Create Your Own</h3>
            <p className="text-gray-600 font-inter text-sm mb-4">
              Build a custom menu from scratch
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-cream-100 text-gray-600 text-xs rounded-full font-inter">
                Custom Dishes
              </span>
              <span className="px-2 py-1 bg-cream-100 text-gray-600 text-xs rounded-full font-inter">
                Your Favorites
              </span>
              <span className="px-2 py-1 bg-cream-100 text-gray-600 text-xs rounded-full font-inter">
                Full Control
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Customize Dishes</h2>
      
      {/* Theme Dishes */}
      {eventData.dishes.filter(dish => dish.isThemeDish).length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Theme Dishes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eventData.dishes.filter(dish => dish.isThemeDish).map((dish) => (
              <div key={dish.id} className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800">{dish.name}</h4>
                    <p className="text-sm text-gray-600">{dish.description}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {getDishCategories().find(cat => cat.id === dish.category)?.name}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveDish(dish.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <SafeIcon icon={FiTrash2} className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Custom Dish */}
      <div className="bg-cream-50 p-6 rounded-lg border border-cream-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          {eventData.theme === 'custom' ? 'Add Your Dishes' : 'Add Custom Dish'}
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dish Name *
              </label>
              <input
                type="text"
                value={customDish.name}
                onChange={(e) => setCustomDish({ ...customDish, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                placeholder="Enter dish name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={customDish.category}
                onChange={(e) => setCustomDish({ ...customDish, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
              >
                <option value="">Select category</option>
                {getDishCategories().map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={customDish.description}
              onChange={(e) => setCustomDish({ ...customDish, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
              placeholder="Enter dish description"
            />
          </div>
          <button
            type="button"
            onClick={handleAddCustomDish}
            className="px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} className="w-5 h-5" />
            <span>Add Dish</span>
          </button>
        </div>
      </div>

      {/* Custom Dishes List */}
      {eventData.dishes.filter(dish => dish.isCustom).length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            {eventData.theme === 'custom' ? 'Your Dishes' : 'Custom Dishes'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eventData.dishes.filter(dish => dish.isCustom).map((dish) => (
              <div key={dish.id} className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800">{dish.name}</h4>
                    <p className="text-sm text-gray-600">{dish.description}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-coral-100 text-coral-600 text-xs rounded-full">
                      {getDishCategories().find(cat => cat.id === dish.category)?.name}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveDish(dish.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <SafeIcon icon={FiTrash2} className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {eventData.dishes.length === 0 && (
        <div className="text-center p-8 bg-cream-50 rounded-lg">
          <div className="text-4xl mb-3">🍽️</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Dishes Added Yet</h3>
          <p className="text-gray-600 mb-4">
            Start adding dishes to your event using the form above.
          </p>
        </div>
      )}
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Review & Create</h2>
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Event Details</h3>
            <div className="mt-2 space-y-2">
              <p><strong>Title:</strong> {eventData.title}</p>
              <p><strong>Date:</strong> {eventData.date}</p>
              <p><strong>Time:</strong> {eventData.time}</p>
              {eventData.location && <p><strong>Location:</strong> {eventData.location}</p>}
              <p><strong>Max Guests:</strong> {eventData.maxGuests}</p>
              <p><strong>Theme:</strong> {eventData.theme === 'custom' ? 'Custom Theme' : themes[eventData.theme]?.name}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Dishes ({eventData.dishes.length})</h3>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              {eventData.dishes.map((dish) => (
                <div key={dish.id} className="p-3 bg-cream-50 rounded-lg">
                  <h4 className="font-medium text-gray-800">{dish.name}</h4>
                  <p className="text-sm text-gray-600">{dish.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-cream-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {renderStepIndicator()}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}

          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={handlePrev}
              className={`px-6 py-3 rounded-lg flex items-center space-x-2 
                ${step === 1 ? 'opacity-50 cursor-not-allowed bg-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
              disabled={step === 1}
            >
              <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
              <span>Previous</span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className={`px-6 py-3 rounded-lg flex items-center space-x-2 
                ${step === 4 ? 'bg-green-500 hover:bg-green-600' : 'bg-coral-500 hover:bg-coral-600'} text-white`}
            >
              <span>{step === 4 ? 'Create Event' : 'Next'}</span>
              <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;