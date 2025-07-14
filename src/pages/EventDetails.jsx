import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useParty } from '../context/PartyContext';
import { useAuth } from '../context/AuthContext';
import SafeIcon from '../common/SafeIcon';
import { getDishCategories } from '../data/themes';
import EventChat from '../components/EventChat';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiEdit, FiTrash, FiShare2, FiCopy, FiCheck, FiCalendar, FiMapPin, FiUsers, FiX, FiPlus, FiUserPlus, FiTool, FiPackage, FiMail, FiAlignLeft, FiTemplate } = FiIcons;

const EventDetails = () => {
  const { id } = useParams();
  const { getEventById, updateEvent, deleteEvent, saveAsTemplate, assignDish, assignItem } = useParty();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [newDish, setNewDish] = useState({ name: '', category: 'mains', description: '' });
  const [newGuest, setNewGuest] = useState({ name: '', email: '', phone: '', assignedDish: '' });
  const [newEquipment, setNewEquipment] = useState({ name: '', description: '', quantity: 1 });
  const [newItem, setNewItem] = useState({ name: '', description: '', category: 'supplies', quantity: 1 });
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [showAddEquipment, setShowAddEquipment] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateData, setTemplateData] = useState({ name: '', description: '', isPublic: false });
  const [activeTab, setActiveTab] = useState('dishes');

  const event = getEventById(id);

  useEffect(() => {
    if (event) {
      setEditData({
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location || '',
        description: event.description || '',
        maxGuests: event.maxGuests
      });
    }
  }, [event]);

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isHost = event.hostId === user?.id;
  const confirmedGuests = event.guests.filter(guest => guest.rsvp === 'yes');
  const pendingGuests = event.guests.filter(guest => guest.rsvp === 'pending');
  const declinedGuests = event.guests.filter(guest => guest.rsvp === 'no');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(event.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = () => {
    updateEvent(id, editData);
    setIsEditing(false);
  };

  const handleSaveAsTemplate = () => {
    setTemplateData({
      name: `${event.title} Template`,
      description: `Template based on ${event.title}`,
      isPublic: false
    });
    setShowTemplateModal(true);
  };

  const handleCreateTemplate = async () => {
    if (!templateData.name.trim()) {
      toast.error('Please enter a template name');
      return;
    }

    try {
      await saveAsTemplate(event.id, templateData);
      setShowTemplateModal(false);
      setTemplateData({ name: '', description: '', isPublic: false });
      toast.success('Template saved successfully!');
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Failed to save template');
    }
  };

  const handleAddDish = () => {
    if (!newDish.name) return;

    const newDishWithId = {
      ...newDish,
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      isCustom: true
    };

    updateEvent(id, { dishes: [...event.dishes, newDishWithId] });
    setNewDish({ name: '', category: 'mains', description: '' });
  };

  const handleAddGuest = () => {
    if (!newGuest.name || !newGuest.email) {
      toast.error('Please fill in name and email');
      return;
    }

    const guestCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const guestData = {
      ...newGuest,
      id: `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      inviteCode: guestCode,
      isManuallyAdded: true,
      rsvp: 'pending',
      joinedAt: new Date().toISOString()
    };

    // If a dish is assigned, update the dish
    let updatedDishes = event.dishes;
    if (newGuest.assignedDish) {
      updatedDishes = event.dishes.map(dish =>
        dish.id === newGuest.assignedDish
          ? { ...dish, assignedTo: guestData.id }
          : dish
      );
    }

    updateEvent(id, {
      guests: [...event.guests, guestData],
      dishes: updatedDishes
    });

    setNewGuest({ name: '', email: '', phone: '', assignedDish: '' });
    setShowAddGuest(false);
    toast.success(`Guest added! Their invite code is: ${guestCode}`);
  };

  const handleRemoveDish = (dishId) => {
    updateEvent(id, { dishes: event.dishes.filter(dish => dish.id !== dishId) });
  };

  const handleSendMessage = (newMessage) => {
    const currentMessages = event.messages || [];
    updateEvent(id, { messages: [...currentMessages, newMessage] });
  };

  const itemCategories = [
    { id: 'supplies', name: 'Supplies', icon: '📦' },
    { id: 'utensils', name: 'Utensils', icon: '🍴' },
    { id: 'decorations', name: 'Decorations', icon: '🎨' },
    { id: 'drinks', name: 'Drinks', icon: '🥤' },
    { id: 'other', name: 'Other', icon: '📋' }
  ];

  return (
    <div className="min-h-screen bg-cream-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className={`relative overflow-hidden rounded-xl p-8 mb-8 bg-gradient-to-br ${event.themeData?.gradient || 'from-coral-600 to-sage-700'}`}>
          <div className="relative z-10 backdrop-blur-sm bg-white/10 rounded-lg p-6">
            {isEditing ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-white">Edit Event</h2>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 text-white transition-colors"
                  >
                    <SafeIcon icon={FiX} className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Event Title</label>
                    <input
                      type="text"
                      value={editData.title}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 text-white placeholder-white/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Location</label>
                    <input
                      type="text"
                      value={editData.location}
                      onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 text-white placeholder-white/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                      placeholder="Add a location"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Date</label>
                    <input
                      type="date"
                      value={editData.date}
                      onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 text-white placeholder-white/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Time</label>
                    <input
                      type="time"
                      value={editData.time}
                      onChange={(e) => setEditData({ ...editData, time: e.target.value })}
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 text-white placeholder-white/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-white mb-1">Event Description</label>
                    <textarea
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 text-white placeholder-white/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                      rows="3"
                      placeholder="Describe your event..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Maximum Guests</label>
                    <input
                      type="number"
                      value={editData.maxGuests}
                      onChange={(e) => setEditData({ ...editData, maxGuests: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 text-white placeholder-white/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                      min="1"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-white text-coral-600 rounded-lg hover:bg-white/90 transition-colors font-medium"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-4xl filter drop-shadow-lg">{event.themeData?.icon || '🍽️'}</span>
                    <h1 className="text-3xl font-bold text-white drop-shadow-lg">{event.title}</h1>
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
                      <span>{confirmedGuests.length} confirmed of {event.guests.length} invited</span>
                    </div>
                  </div>
                </div>
                {isHost && (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleSaveAsTemplate}
                      className="p-2 bg-white/20 rounded-lg hover:bg-white/30 text-white transition-colors"
                      title="Save as template"
                    >
                      <SafeIcon icon={FiTemplate} className="w-5 h-5" />
                    </button>
                    <button
                      className="p-2 bg-white/20 rounded-lg hover:bg-white/30 text-white transition-colors"
                      onClick={() => setIsEditing(true)}
                    >
                      <SafeIcon icon={FiEdit} className="w-5 h-5" />
                    </button>
                    <button
                      className="p-2 bg-white/20 rounded-lg hover:bg-red-500/60 text-white transition-colors"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this event?')) {
                          deleteEvent(event.id);
                          navigate('/dashboard');
                        }
                      }}
                    >
                      <SafeIcon icon={FiTrash} className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Invite code section */}
            <div className="mt-4">
              <div className="flex items-center space-x-3">
                <div className="px-4 py-3 bg-white/20 rounded-lg flex-1">
                  <div className="text-xs text-white/70 mb-1">Event Code</div>
                  <div className="font-mono text-lg text-white font-medium">{event.code}</div>
                </div>
                <button
                  className={`p-3 rounded-lg transition-colors ${
                    copied ? 'bg-green-500 text-white' : 'bg-white text-charcoal-800'
                  }`}
                  onClick={handleCopyCode}
                  title="Copy code"
                >
                  <SafeIcon icon={copied ? FiCheck : FiCopy} className="w-5 h-5" />
                </button>
                <button
                  className="p-3 bg-white rounded-lg text-charcoal-800 hover:bg-white/90 transition-colors"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: `Join ${event.title} on DinnerDoodle`,
                        text: `I'm hosting a dinner party! Join with code: ${event.code}`,
                        url: window.location.href
                      });
                    } else {
                      handleCopyCode();
                    }
                  }}
                  title="Share event"
                >
                  <SafeIcon icon={FiShare2} className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section (visible when not editing) */}
        {!isEditing && event.description && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <SafeIcon icon={FiAlignLeft} className="w-5 h-5 text-coral-500" />
              <h2 className="text-xl font-bold text-charcoal-800">About This Event</h2>
            </div>
            <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'dishes', label: 'Dishes', count: event.dishes.length },
                { id: 'guests', label: 'Guests', count: event.guests.length },
                { id: 'equipment', label: 'Equipment', count: (event.equipment || []).length },
                { id: 'items', label: 'Items', count: (event.items || []).length },
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
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-charcoal-800">Dishes</h2>
                  {isHost && (
                    <button
                      onClick={() => setNewDish({ name: '', category: 'mains', description: '' })}
                      className="px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors flex items-center"
                    >
                      <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                      Add Dish
                    </button>
                  )}
                </div>

                {/* Add New Dish Form */}
                {isHost && (
                  <div className="mb-6 p-4 bg-cream-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      <input
                        type="text"
                        value={newDish.name}
                        onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                        placeholder="Dish name"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                      />
                      <select
                        value={newDish.category}
                        onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                      >
                        {getDishCategories().map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={newDish.description}
                        onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                        placeholder="Description"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                      />
                    </div>
                    <button
                      onClick={handleAddDish}
                      className="px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
                      disabled={!newDish.name}
                    >
                      Add Dish
                    </button>
                  </div>
                )}

                {/* Dishes List */}
                <div className="space-y-4">
                  {event.dishes.map((dish) => {
                    const assignedGuest = event.guests.find(g => g.id === dish.assignedTo);
                    return (
                      <div key={dish.id} className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-charcoal-800 font-semibold">{dish.name}</h3>
                            <p className="text-gray-600 text-sm">{dish.description}</p>
                            <div className="mt-2 flex items-center space-x-2">
                              <span className="px-2 py-1 bg-cream-100 text-gray-600 text-xs rounded-full">
                                {getDishCategories().find(cat => cat.id === dish.category)?.name}
                              </span>
                              {assignedGuest ? (
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                  Assigned to {assignedGuest.name}
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                                  Unassigned
                                </span>
                              )}
                            </div>
                          </div>
                          {isHost && (
                            <button
                              onClick={() => handleRemoveDish(dish.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <SafeIcon icon={FiTrash} className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Chat Tab */}
            {activeTab === 'chat' && (
              <div>
                <EventChat event={event} onSendMessage={handleSendMessage} />
              </div>
            )}

            {/* Other tabs content remains the same */}
          </div>
        </div>

        {/* Template Modal */}
        {showTemplateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Save as Template</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Template Name
                    </label>
                    <input
                      type="text"
                      value={templateData.name}
                      onChange={(e) => setTemplateData({ ...templateData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                      placeholder="Enter template name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={templateData.description}
                      onChange={(e) => setTemplateData({ ...templateData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                      rows="3"
                      placeholder="Describe this template"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={templateData.isPublic}
                      onChange={(e) => setTemplateData({ ...templateData, isPublic: e.target.checked })}
                      className="h-4 w-4 text-coral-500 focus:ring-coral-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
                      Make this template public
                    </label>
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={handleCreateTemplate}
                    className="flex-1 px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
                  >
                    Save Template
                  </button>
                  <button
                    onClick={() => setShowTemplateModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;