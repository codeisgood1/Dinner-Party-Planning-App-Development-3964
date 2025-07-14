import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useParty } from '../context/PartyContext';
import { themes, getDishCategories } from '../data/themes';
import SafeIcon from '../common/SafeIcon';
import ThemeCard from '../components/ThemeCard';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiCalendar, FiMapPin, FiUsers, FiArrowRight, FiArrowLeft, FiPlus, FiX, FiCheck, FiAlignLeft, FiTemplate, FiFolder } = FiIcons;

const CreateEvent = () => {
  const [step, setStep] = useState(1);
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    theme: null,
    customTheme: {
      id: 'custom',
      name: 'Custom Theme',
      icon: '🎨',
      gradient: 'from-purple-500 to-pink-500',
      dishes: []
    },
    maxGuests: 10,
    dishes: [],
    customDishes: []
  });
  const [customDish, setCustomDish] = useState({
    name: '',
    category: 'mains',
    description: ''
  });
  const [customThemeName, setCustomThemeName] = useState('Custom Theme');
  const [customThemeIcon, setCustomThemeIcon] = useState('🎨');
  const [showTemplates, setShowTemplates] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const { createEvent, templates, createFromTemplate } = useParty();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate('/');
      toast.error('Please log in to create an event');
    }
  }, [user, navigate]);

  // Load template if one was selected from dashboard
  useEffect(() => {
    if (location.state?.templateId) {
      const template = templates.find(t => t.id === location.state.templateId);
      if (template) {
        loadTemplate(template);
      }
    }
  }, [location.state, templates]);

  const loadTemplate = (template) => {
    setEventData({
      ...eventData,
      theme: template.theme,
      dishes: template.dishes.map(dish => ({
        ...dish,
        id: `${template.theme}-${dish.category}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }))
    });
    toast.success(`Template "${template.name}" loaded!`);
  };

  const handleSelectTheme = (theme) => {
    setEventData({
      ...eventData,
      theme: theme.id,
      dishes: theme.dishes.map(dish => ({
        ...dish,
        id: `${theme.id}-${dish.category}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }))
    });
  };

  const handleCreateCustomTheme = () => {
    const customTheme = {
      id: 'custom',
      name: customThemeName || 'Custom Theme',
      icon: customThemeIcon || '🎨',
      gradient: 'from-purple-500 to-pink-500',
      dishes: []
    };

    setEventData({
      ...eventData,
      theme: 'custom',
      customTheme,
      dishes: []
    });
  };

  const handleAddCustomDish = () => {
    if (!customDish.name) return;

    const newDish = {
      ...customDish,
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      isCustom: true
    };

    setEventData({
      ...eventData,
      dishes: [...eventData.dishes, newDish]
    });

    setCustomDish({
      name: '',
      category: 'mains',
      description: ''
    });
  };

  const handleRemoveDish = (dishId) => {
    setEventData({
      ...eventData,
      dishes: eventData.dishes.filter(dish => dish.id !== dishId)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!eventData.title.trim()) {
      toast.error('Please enter an event title');
      return;
    }

    if (!eventData.theme) {
      toast.error('Please select a theme');
      return;
    }

    setLoading(true);

    try {
      console.log('Submitting event data:', eventData);

      // Prepare theme data
      const finalThemeData = eventData.theme === 'custom' 
        ? eventData.customTheme 
        : themes[eventData.theme];

      // Create the event
      const newEvent = await createEvent({
        title: eventData.title.trim(),
        description: eventData.description.trim(),
        date: eventData.date,
        time: eventData.time,
        location: eventData.location.trim(),
        theme: eventData.theme,
        themeData: finalThemeData,
        maxGuests: eventData.maxGuests,
        dishes: eventData.dishes,
        hostId: user.id,
        hostName: user.name
      });

      console.log('Event created successfully:', newEvent);

      // Show success message and navigate
      toast.success('Event created successfully!');
      navigate(`/event/${newEvent.id}`);
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error(error.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Details</h2>
        <p className="text-gray-600">Let's start with the basic information about your dinner party.</p>
      </div>

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
            placeholder="e.g., Italian Dinner Night"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={eventData.date}
                onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
              />
              <SafeIcon icon={FiCalendar} className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time
            </label>
            <input
              type="time"
              value={eventData.time}
              onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
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
              onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
              placeholder="e.g., My place, 123 Main St"
            />
            <SafeIcon icon={FiMapPin} className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Description
          </label>
          <div className="relative">
            <SafeIcon icon={FiAlignLeft} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <textarea
              value={eventData.description}
              onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
              placeholder="Tell your guests what this event is about..."
              rows="3"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Guests
          </label>
          <div className="relative">
            <input
              type="number"
              value={eventData.maxGuests}
              onChange={(e) => setEventData({ ...eventData, maxGuests: parseInt(e.target.value) })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
              min="1"
              max="50"
            />
            <SafeIcon icon={FiUsers} className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="text-right">
        <button
          onClick={() => setStep(2)}
          className="px-6 py-3 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors flex items-center ml-auto"
        >
          Next: Choose Theme
          <SafeIcon icon={FiArrowRight} className="ml-2 w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose a Theme</h2>
        <p className="text-gray-600">
          Select a theme for your dinner party. This will help suggest dishes and set the mood.
        </p>
      </div>

      {/* Template and Custom Theme Actions */}
      <div className="bg-cream-50 p-4 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Load Template Button */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Load from Template</h3>
            <button
              onClick={() => setShowTemplates(true)}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
            >
              <SafeIcon icon={FiFolder} className="mr-2 w-4 h-4" />
              Browse Templates ({templates?.length || 0})
            </button>
          </div>

          {/* Custom Theme Creator */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Create Custom Theme</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                value={customThemeName}
                onChange={(e) => setCustomThemeName(e.target.value)}
                placeholder="Theme name"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
              />
              <input
                type="text"
                value={customThemeIcon}
                onChange={(e) => setCustomThemeIcon(e.target.value)}
                placeholder="🎨"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
              />
            </div>
            <button
              onClick={handleCreateCustomTheme}
              className="w-full px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors flex items-center justify-center"
            >
              <SafeIcon icon={FiPlus} className="mr-2 w-4 h-4" />
              Create Custom Theme
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Custom Theme Card */}
        {eventData.theme === 'custom' && (
          <ThemeCard
            key="custom"
            theme={eventData.customTheme}
            selected={eventData.theme === 'custom'}
            onSelect={() => handleSelectTheme(eventData.customTheme)}
          />
        )}

        {/* Predefined Theme Cards */}
        {Object.values(themes).map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            selected={eventData.theme === theme.id}
            onSelect={handleSelectTheme}
          />
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStep(1)}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
        >
          <SafeIcon icon={FiArrowLeft} className="mr-2 w-5 h-5" />
          Back
        </button>
        <button
          onClick={() => setStep(3)}
          className="px-6 py-3 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors flex items-center"
          disabled={!eventData.theme}
        >
          Next: Review Dishes
          <SafeIcon icon={FiArrowRight} className="ml-2 w-5 h-5" />
        </button>
      </div>

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Choose a Template</h2>
                <button
                  onClick={() => setShowTemplates(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <SafeIcon icon={FiX} className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              {templates && templates.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200 cursor-pointer"
                      onClick={() => {
                        loadTemplate(template);
                        setShowTemplates(false);
                      }}
                    >
                      <div className={`h-2 bg-gradient-to-r ${template.theme_data?.gradient || 'from-purple-500 to-pink-500'}`} />
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{template.theme_data?.icon || '🎨'}</span>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">{template.name}</h3>
                              <p className="text-sm text-gray-600">by {template.created_by_name}</p>
                            </div>
                          </div>
                        </div>
                        {template.description && (
                          <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                        )}
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{template.dishes?.length || 0} dishes</span>
                          <span>{template.usage_count || 0} uses</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <SafeIcon icon={FiTemplate} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No templates yet</h3>
                  <p className="text-gray-600">Create some events and save them as templates!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Review Dishes</h2>
        <p className="text-gray-600">
          These dishes are suggested based on your theme. You can add, remove, or modify dishes.
        </p>
      </div>

      {/* Add Custom Dish Form */}
      <div className="bg-cream-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Add a Custom Dish</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <input
            type="text"
            value={customDish.name}
            onChange={(e) => setCustomDish({ ...customDish, name: e.target.value })}
            placeholder="Dish name"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
          />
          <select
            value={customDish.category}
            onChange={(e) => setCustomDish({ ...customDish, category: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
          >
            {getDishCategories().map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <input
            type="text"
            value={customDish.description}
            onChange={(e) => setCustomDish({ ...customDish, description: e.target.value })}
            placeholder="Description"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
          />
        </div>
        <button
          onClick={handleAddCustomDish}
          className="px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors flex items-center"
          disabled={!customDish.name}
        >
          <SafeIcon icon={FiPlus} className="mr-2 w-4 h-4" />
          Add Dish
        </button>
      </div>

      {/* Dish List by Category */}
      <div className="space-y-6">
        {getDishCategories().map(category => {
          const categoryDishes = eventData.dishes.filter(dish => dish.category === category.id);
          if (categoryDishes.length === 0) return null;

          return (
            <div key={category.id}>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </h3>
              <div className="space-y-3">
                {categoryDishes.map(dish => (
                  <div
                    key={dish.id}
                    className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200"
                  >
                    <div>
                      <h4 className="font-medium text-gray-800">{dish.name}</h4>
                      {dish.description && (
                        <p className="text-sm text-gray-600">{dish.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveDish(dish.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <SafeIcon icon={FiX} className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStep(2)}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
        >
          <SafeIcon icon={FiArrowLeft} className="mr-2 w-5 h-5" />
          Back
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors flex items-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Creating...
            </>
          ) : (
            <>
              Create Event
              <SafeIcon icon={FiCheck} className="ml-2 w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a Dinner Party</h1>
          <div className="flex items-center space-x-2">
            <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-coral-500' : 'bg-gray-200'}`}></div>
            <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-coral-500' : 'bg-gray-200'}`}></div>
            <div className={`h-1 flex-1 rounded-full ${step >= 3 ? 'bg-coral-500' : 'bg-gray-200'}`}></div>
          </div>
        </div>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default CreateEvent;