import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useParty } from '../context/PartyContext';
import { useAuth } from '../context/AuthContext';
import { themes, getRandomTheme, getThemeById } from '../data/themes';
import SafeIcon from '../common/SafeIcon';
import ThemeCard from '../components/ThemeCard';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiCalendar, FiMapPin, FiUsers, FiClock, FiPlus, FiX, FiChevronRight, FiChevronDown } = FiIcons;

const CreateEvent = () => {
  const { user } = useAuth();
  const { createEvent, templates, createFromTemplate } = useParty();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [step, setStep] = useState(1);
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    maxGuests: 10,
    theme: '',
    themeData: null,
    dishes: []
  });
  
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [customThemeName, setCustomThemeName] = useState('');
  const [customThemeIcon, setCustomThemeIcon] = useState('🍽️');
  const [showIconSelector, setShowIconSelector] = useState(false);

  // Food icons for custom theme
  const foodIcons = [
    {emoji: '🍽️', label: 'Dining Set'},
    {emoji: '🍳', label: 'Cooking'},
    {emoji: '🥘', label: 'Pan of Food'},
    {emoji: '🍖', label: 'Meat'},
    {emoji: '🥗', label: 'Salad'},
    {emoji: '🍜', label: 'Noodles'},
    {emoji: '🍕', label: 'Pizza'},
    {emoji: '🌮', label: 'Taco'},
    {emoji: '🍣', label: 'Sushi'},
    {emoji: '🥪', label: 'Sandwich'},
    {emoji: '🥩', label: 'Steak'},
    {emoji: '🍗', label: 'Chicken'},
    {emoji: '🥑', label: 'Avocado'},
    {emoji: '🥦', label: 'Vegetables'},
    {emoji: '🍝', label: 'Pasta'},
    {emoji: '🍰', label: 'Dessert'},
    {emoji: '🍷', label: 'Wine'},
    {emoji: '🍺', label: 'Beer'},
    {emoji: '🍴', label: 'Utensils'},
    {emoji: '👨‍🍳', label: 'Chef'}
  ];

  // Check if coming from a template
  useEffect(() => {
    if (location.state?.templateId) {
      const template = templates.find(t => t.id === location.state.templateId);
      if (template) {
        setSelectedTheme({
          id: template.theme,
          name: template.theme_data?.name || 'Custom Theme',
          icon: template.theme_data?.icon || '🍽️',
          gradient: template.theme_data?.gradient || 'from-coral-500 to-sage-500',
          dishes: template.dishes || []
        });
        setEventData(prev => ({
          ...prev,
          theme: template.theme,
          themeData: template.theme_data,
          dishes: template.dishes || []
        }));
      }
    }
  }, [location.state, templates]);

  if (!user) {
    navigate('/?auth=login');
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectTheme = (theme) => {
    setSelectedTheme(theme);
    setEventData(prev => ({
      ...prev,
      theme: theme.id,
      themeData: {
        id: theme.id,
        name: theme.name,
        icon: theme.icon,
        gradient: theme.gradient
      },
      dishes: theme.dishes.map(dish => ({
        ...dish,
        id: `dish-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }))
    }));
  };

  const handleCreateCustomTheme = () => {
    if (!customThemeName.trim()) {
      toast.error('Please enter a theme name');
      return;
    }
    
    const customTheme = {
      id: `custom-${Date.now()}`,
      name: customThemeName,
      icon: customThemeIcon,
      gradient: 'from-golden-500 to-peach-500',
      dishes: []
    };
    
    handleSelectTheme(customTheme);
    setCustomThemeName('');
    setCustomThemeIcon('🍽️');
    toast.success('Custom theme created!');
  };

  const handleNext = () => {
    if (step === 1) {
      if (!eventData.title || !eventData.date) {
        toast.error('Please fill in all required fields');
        return;
      }
    } else if (step === 2) {
      if (!selectedTheme) {
        toast.error('Please select a theme');
        return;
      }
    }
    
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleCreateEvent = async () => {
    try {
      if (location.state?.templateId) {
        const event = await createFromTemplate(location.state.templateId, eventData);
        toast.success('Event created successfully!');
        navigate(`/event/${event.id}`);
        return;
      }
      
      const event = await createEvent(eventData);
      toast.success('Event created successfully!');
      navigate(`/event/${event.id}`);
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Event</h1>
          <p className="text-gray-600">Let's plan a memorable dinner party</p>
        </div>
        
        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className="flex flex-col items-center"
              onClick={() => i < step && setStep(i)}
            >
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  i === step 
                    ? 'bg-coral-500 text-white' 
                    : i < step 
                      ? 'bg-sage-500 text-white cursor-pointer' 
                      : 'bg-gray-200 text-gray-500'
                }`}
              >
                {i}
              </div>
              <span className={`text-sm ${i === step ? 'text-coral-500 font-medium' : 'text-gray-500'}`}>
                {i === 1 ? 'Basic Info' : i === 2 ? 'Theme' : 'Review'}
              </span>
            </div>
          ))}
        </div>
        
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input 
                type="text"
                name="title"
                value={eventData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                placeholder="e.g., Summer BBQ, Italian Dinner Night"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="date"
                    name="date"
                    value={eventData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                    required
                  />
                  <SafeIcon 
                    icon={FiCalendar} 
                    className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <div className="relative">
                  <input 
                    type="time"
                    name="time"
                    value={eventData.time}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                  />
                  <SafeIcon 
                    icon={FiClock} 
                    className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" 
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <input 
                  type="text"
                  name="location"
                  value={eventData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                  placeholder="e.g., My Home, 123 Main Street"
                />
                <SafeIcon 
                  icon={FiMapPin} 
                  className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea 
                name="description"
                value={eventData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                placeholder="Add details about your event..."
                rows="3"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Guests
              </label>
              <div className="relative">
                <input 
                  type="number"
                  name="maxGuests"
                  value={eventData.maxGuests}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                  min="1"
                  max="100"
                />
                <SafeIcon 
                  icon={FiUsers} 
                  className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" 
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors flex items-center"
              >
                Next Step
                <SafeIcon icon={FiChevronRight} className="ml-2 w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
        
        {/* Step 2: Theme Selection */}
        {step === 2 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.values(themes).map((theme) => (
                <ThemeCard 
                  key={theme.id}
                  theme={theme}
                  selected={selectedTheme?.id === theme.id}
                  onSelect={handleSelectTheme}
                />
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Create Custom Theme</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme Name
                  </label>
                  <input 
                    type="text"
                    value={customThemeName}
                    onChange={(e) => setCustomThemeName(e.target.value)}
                    placeholder="Enter your theme name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme Icon
                  </label>
                  <button 
                    type="button"
                    onClick={() => setShowIconSelector(true)}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-between"
                  >
                    <span>{customThemeIcon} Select Icon</span>
                    <SafeIcon icon={FiChevronDown} className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
              
              <button 
                onClick={handleCreateCustomTheme}
                className="mt-4 px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors flex items-center"
              >
                <SafeIcon icon={FiPlus} className="mr-2 w-4 h-4" />
                Create Custom Theme
              </button>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors flex items-center"
                disabled={!selectedTheme}
              >
                Next Step
                <SafeIcon icon={FiChevronRight} className="ml-2 w-5 h-5" />
              </button>
            </div>
            
            {/* Icon Selector Modal */}
            {showIconSelector && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Choose an Icon</h3>
                    <button 
                      onClick={() => setShowIconSelector(false)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <SafeIcon icon={FiX} className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {foodIcons.map((icon) => (
                      <button
                        key={icon.emoji}
                        onClick={() => {
                          setCustomThemeIcon(icon.emoji);
                          setShowIconSelector(false);
                        }}
                        className="p-4 hover:bg-gray-100 rounded-lg text-center transition-colors"
                      >
                        <div className="text-2xl mb-1">{icon.emoji}</div>
                        <div className="text-xs text-gray-600">{icon.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
        
        {/* Step 3: Review & Create */}
        {step === 3 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="bg-cream-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Event Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Basic Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <span className="font-medium text-gray-600 w-24">Title:</span>
                      <span className="text-gray-800">{eventData.title}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium text-gray-600 w-24">Date:</span>
                      <span className="text-gray-800">{eventData.date}</span>
                    </div>
                    {eventData.time && (
                      <div className="flex items-start">
                        <span className="font-medium text-gray-600 w-24">Time:</span>
                        <span className="text-gray-800">{eventData.time}</span>
                      </div>
                    )}
                    {eventData.location && (
                      <div className="flex items-start">
                        <span className="font-medium text-gray-600 w-24">Location:</span>
                        <span className="text-gray-800">{eventData.location}</span>
                      </div>
                    )}
                    <div className="flex items-start">
                      <span className="font-medium text-gray-600 w-24">Max Guests:</span>
                      <span className="text-gray-800">{eventData.maxGuests}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Theme</h4>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-3xl">{selectedTheme?.icon}</span>
                    <span className="text-gray-800 font-medium">{selectedTheme?.name}</span>
                  </div>
                  
                  <h4 className="font-medium text-gray-700 mt-4 mb-2">Suggested Dishes</h4>
                  {eventData.dishes.length > 0 ? (
                    <div className="text-sm text-gray-600">
                      <p>{eventData.dishes.length} dishes included</p>
                      <div className="mt-1">
                        {eventData.dishes.slice(0, 3).map((dish, index) => (
                          <span key={index} className="inline-block bg-cream-100 rounded-full px-2 py-1 text-xs mr-2 mb-2">
                            {dish.name}
                          </span>
                        ))}
                        {eventData.dishes.length > 3 && (
                          <span className="inline-block bg-cream-100 rounded-full px-2 py-1 text-xs">
                            +{eventData.dishes.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">No dishes added yet. You can add them after creating the event.</p>
                  )}
                </div>
              </div>
              
              {eventData.description && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Description</h4>
                  <p className="text-gray-800 whitespace-pre-line">{eventData.description}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleCreateEvent}
                className="px-6 py-3 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
              >
                Create Event
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default CreateEvent;