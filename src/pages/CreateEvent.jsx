import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useParty } from '../context/PartyContext';
import { themes, getRandomTheme, getDishCategories } from '../data/themes';
import ThemeCard from '../components/ThemeCard';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiCalendar, FiMapPin, FiUsers, FiShuffle, FiArrowRight, FiArrowLeft } = FiIcons;

const CreateEvent = () => {
  const [step, setStep] = useState(1);
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    maxGuests: 8,
    theme: null,
    dishes: []
  });
  const { user } = useAuth();
  const { createEvent } = useParty();
  const navigate = useNavigate();

  const handleRandomTheme = () => {
    const randomTheme = getRandomTheme();
    setEventData({ ...eventData, theme: randomTheme });
  };

  const handleThemeSelect = (theme) => {
    setEventData({ ...eventData, theme: theme });
  };

  const generateDishes = () => {
    if (!eventData.theme) return;
    
    const categories = getDishCategories();
    const dishes = [];
    
    categories.forEach(category => {
      const categoryDishes = eventData.theme.dishes.filter(dish => dish.category === category.id);
      const selectedDishes = categoryDishes.slice(0, Math.min(3, categoryDishes.length));
      
      selectedDishes.forEach((dish, index) => {
        dishes.push({
          id: `${category.id}-${index}`,
          name: dish.name,
          description: dish.description,
          category: category.id,
          assignedTo: null,
          dietary: dish.dietary || []
        });
      });
    });
    
    setEventData({ ...eventData, dishes });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to create an event');
      return;
    }

    try {
      const newEvent = createEvent({
        ...eventData,
        hostId: user.id,
        hostName: user.name
      });
      
      toast.success('Event created successfully!');
      navigate(`/event/${newEvent.id}`);
    } catch (error) {
      toast.error('Failed to create event');
    }
  };

  const nextStep = () => {
    if (step === 1 && (!eventData.title || !eventData.date || !eventData.time)) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (step === 2 && !eventData.theme) {
      toast.error('Please select a theme');
      return;
    }
    if (step === 3 && eventData.dishes.length === 0) {
      generateDishes();
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Create Your Event</h1>
          <div className="text-sm text-gray-600">Step {step} of 4</div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Details</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={eventData.title}
                  onChange={(e) => setEventData({...eventData, title: e.target.value})}
                  placeholder="e.g., Italian Night at Sarah's"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={eventData.date}
                      onChange={(e) => setEventData({...eventData, date: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <SafeIcon icon={FiCalendar} className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={eventData.time}
                    onChange={(e) => setEventData({...eventData, time: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={eventData.location}
                    onChange={(e) => setEventData({...eventData, location: e.target.value})}
                    placeholder="e.g., 123 Main St, City, State"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <SafeIcon icon={FiMapPin} className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Guests
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="2"
                    max="50"
                    value={eventData.maxGuests}
                    onChange={(e) => setEventData({...eventData, maxGuests: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <SafeIcon icon={FiUsers} className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={eventData.description}
                  onChange={(e) => setEventData({...eventData, description: e.target.value})}
                  placeholder="Tell your guests what to expect..."
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <span>Next</span>
                <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Theme Selection */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Choose Your Theme</h2>
              <button
                type="button"
                onClick={handleRandomTheme}
                className="flex items-center space-x-2 px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
              >
                <SafeIcon icon={FiShuffle} className="w-5 h-5" />
                <span>Random Theme</span>
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(themes).map((theme) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  selected={eventData.theme?.id === theme.id}
                  onSelect={handleThemeSelect}
                />
              ))}
            </div>
            
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <span>Next</span>
                <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Dish Selection */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Suggested Dishes for {eventData.theme?.name}
            </h2>
            
            {eventData.dishes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">{eventData.theme?.icon}</div>
                <p className="text-gray-600 mb-6">
                  We'll generate perfect dish suggestions based on your {eventData.theme?.name} theme.
                </p>
                <button
                  type="button"
                  onClick={generateDishes}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Generate Dishes
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {getDishCategories().map((category) => {
                  const categoryDishes = eventData.dishes.filter(dish => dish.category === category.id);
                  if (categoryDishes.length === 0) return null;
                  
                  return (
                    <div key={category.id}>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {categoryDishes.map((dish) => (
                          <div key={dish.id} className="p-4 border border-gray-200 rounded-lg">
                            <h4 className="font-medium text-gray-800">{dish.name}</h4>
                            <p className="text-sm text-gray-600">{dish.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <span>Review & Create</span>
                <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Review & Create */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Event</h2>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Event Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Title:</strong> {eventData.title}</p>
                    <p><strong>Date:</strong> {eventData.date}</p>
                    <p><strong>Time:</strong> {eventData.time}</p>
                    <p><strong>Location:</strong> {eventData.location || 'Not specified'}</p>
                    <p><strong>Max Guests:</strong> {eventData.maxGuests}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Theme</h3>
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{eventData.theme?.icon}</span>
                    <span className="text-lg font-medium">{eventData.theme?.name}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Dishes ({eventData.dishes.length})</h3>
                <div className="grid md:grid-cols-2 gap-2 text-sm">
                  {eventData.dishes.map((dish) => (
                    <div key={dish.id} className="flex items-center space-x-2">
                      <span>•</span>
                      <span>{dish.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
              >
                Create Event
              </button>
            </div>
          </motion.div>
        )}
      </form>
    </div>
  );
};

export default CreateEvent;