import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useParty } from '../context/PartyContext';
import { useAuth } from '../context/AuthContext';
import SafeIcon from '../common/SafeIcon';
import { getDishCategories } from '../data/themes';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiEdit, FiTrash, FiShare2, FiCopy, FiCheck, FiCalendar, FiMapPin, FiUsers, FiX, FiPlus, FiUserPlus, FiTool, FiPackage, FiMail } = FiIcons;

const EventDetails = () => {
  const { id } = useParams();
  const { getEventById, updateEvent, deleteEvent, addManualGuest, assignDish, assignItem } = useParty();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [newDish, setNewDish] = useState({
    name: '',
    category: 'mains',
    description: ''
  });
  const [newGuest, setNewGuest] = useState({
    name: '',
    email: '',
    phone: '',
    assignedDish: ''
  });
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    description: '',
    quantity: 1
  });
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    category: 'supplies',
    quantity: 1
  });
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [showAddEquipment, setShowAddEquipment] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [activeTab, setActiveTab] = useState('dishes');

  const event = getEventById(id);

  useEffect(() => {
    if (event) {
      setEditData({
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location || '',
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

  const handleCopyGuestCode = (guestCode) => {
    navigator.clipboard.writeText(guestCode);
    toast.success('Guest invite code copied!');
  };

  const handleSaveEdit = () => {
    updateEvent(id, editData);
    setIsEditing(false);
  };

  const handleAddDish = () => {
    if (!newDish.name) return;
    
    const newDishWithId = {
      ...newDish,
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      isCustom: true
    };
    
    updateEvent(id, {
      dishes: [...event.dishes, newDishWithId]
    });
    
    setNewDish({
      name: '',
      category: 'mains',
      description: ''
    });
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

    setNewGuest({
      name: '',
      email: '',
      phone: '',
      assignedDish: ''
    });
    setShowAddGuest(false);
    toast.success(`Guest added! Their invite code is: ${guestCode}`);
  };

  const handleAddEquipment = () => {
    if (!newEquipment.name) return;
    
    const equipmentData = {
      ...newEquipment,
      id: `equipment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    updateEvent(id, {
      equipment: [...(event.equipment || []), equipmentData]
    });
    
    setNewEquipment({
      name: '',
      description: '',
      quantity: 1
    });
    setShowAddEquipment(false);
    toast.success('Equipment added!');
  };

  const handleAddItem = () => {
    if (!newItem.name) return;
    
    const itemData = {
      ...newItem,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    updateEvent(id, {
      items: [...(event.items || []), itemData]
    });
    
    setNewItem({
      name: '',
      description: '',
      category: 'supplies',
      quantity: 1
    });
    setShowAddItem(false);
    toast.success('Item added!');
  };

  const handleRemoveDish = (dishId) => {
    updateEvent(id, {
      dishes: event.dishes.filter(dish => dish.id !== dishId)
    });
  };

  const handleRemoveEquipment = (equipmentId) => {
    updateEvent(id, {
      equipment: (event.equipment || []).filter(eq => eq.id !== equipmentId)
    });
  };

  const handleRemoveItem = (itemId) => {
    updateEvent(id, {
      items: (event.items || []).filter(item => item.id !== itemId)
    });
  };

  const handleAssignItem = (itemId, guestId) => {
    const updatedItems = (event.items || []).map(item => 
      item.id === itemId 
        ? { ...item, assignedTo: guestId }
        : item
    );
    
    updateEvent(id, { items: updatedItems });
    toast.success('Item assigned!');
  };

  const handleUnassignItem = (itemId) => {
    const updatedItems = (event.items || []).map(item => 
      item.id === itemId 
        ? { ...item, assignedTo: null }
        : item
    );
    
    updateEvent(id, { items: updatedItems });
    toast.success('Item unassigned!');
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
        <div className={`relative overflow-hidden rounded-xl p-8 mb-8 bg-gradient-to-br ${event.theme?.gradient || 'from-coral-600 to-sage-700'}`}>
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
                      onChange={(e) => setEditData({...editData, title: e.target.value})}
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 text-white placeholder-white/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Location</label>
                    <input 
                      type="text" 
                      value={editData.location} 
                      onChange={(e) => setEditData({...editData, location: e.target.value})}
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 text-white placeholder-white/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                      placeholder="Add a location"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Date</label>
                    <input 
                      type="date" 
                      value={editData.date} 
                      onChange={(e) => setEditData({...editData, date: e.target.value})}
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 text-white placeholder-white/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Time</label>
                    <input 
                      type="time" 
                      value={editData.time} 
                      onChange={(e) => setEditData({...editData, time: e.target.value})}
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 text-white placeholder-white/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Maximum Guests</label>
                    <input 
                      type="number" 
                      value={editData.maxGuests} 
                      onChange={(e) => setEditData({...editData, maxGuests: parseInt(e.target.value)})}
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
                    <span className="text-4xl filter drop-shadow-lg">{event.theme?.icon || '🍽️'}</span>
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
                  className={`p-3 rounded-lg transition-colors ${copied ? 'bg-green-500 text-white' : 'bg-white text-charcoal-800'}`}
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

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'dishes', label: 'Dishes', count: event.dishes.length },
                { id: 'guests', label: 'Guests', count: event.guests.length },
                { id: 'equipment', label: 'Equipment', count: (event.equipment || []).length },
                { id: 'items', label: 'Items', count: (event.items || []).length }
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
                        onChange={(e) => setNewDish({...newDish, name: e.target.value})}
                        placeholder="Dish name"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                      />
                      <select
                        value={newDish.category}
                        onChange={(e) => setNewDish({...newDish, category: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                      >
                        {getDishCategories().map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={newDish.description}
                        onChange={(e) => setNewDish({...newDish, description: e.target.value})}
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

            {/* Guests Tab */}
            {activeTab === 'guests' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-charcoal-800">Guests</h2>
                  {isHost && (
                    <button
                      onClick={() => setShowAddGuest(true)}
                      className="px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors flex items-center"
                    >
                      <SafeIcon icon={FiUserPlus} className="w-4 h-4 mr-2" />
                      Add Guest
                    </button>
                  )}
                </div>

                {/* Add Guest Modal */}
                {showAddGuest && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full">
                      <h3 className="text-lg font-bold mb-4">Add Guest Manually</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                          <input
                            type="text"
                            value={newGuest.name}
                            onChange={(e) => setNewGuest({...newGuest, name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                            placeholder="Guest name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                          <input
                            type="email"
                            value={newGuest.email}
                            onChange={(e) => setNewGuest({...newGuest, email: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                            placeholder="Guest email"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                          <input
                            type="tel"
                            value={newGuest.phone}
                            onChange={(e) => setNewGuest({...newGuest, phone: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                            placeholder="Guest phone"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Assign Dish</label>
                          <select
                            value={newGuest.assignedDish}
                            onChange={(e) => setNewGuest({...newGuest, assignedDish: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                          >
                            <option value="">No dish assigned</option>
                            {event.dishes.filter(dish => !dish.assignedTo).map(dish => (
                              <option key={dish.id} value={dish.id}>{dish.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={handleAddGuest}
                            className="flex-1 px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
                          >
                            Add Guest
                          </button>
                          <button
                            onClick={() => setShowAddGuest(false)}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Guest Status Summary */}
                <div className="flex items-center justify-between mb-6 p-3 bg-cream-50 rounded-lg">
                  <div className="text-center px-3">
                    <div className="text-xl font-bold text-green-600">{confirmedGuests.length}</div>
                    <div className="text-xs text-gray-600">Confirmed</div>
                  </div>
                  <div className="text-center px-3">
                    <div className="text-xl font-bold text-yellow-600">{pendingGuests.length}</div>
                    <div className="text-xs text-gray-600">Pending</div>
                  </div>
                  <div className="text-center px-3">
                    <div className="text-xl font-bold text-red-600">{declinedGuests.length}</div>
                    <div className="text-xs text-gray-600">Declined</div>
                  </div>
                  <div className="text-center px-3">
                    <div className="text-xl font-bold text-gray-600">{event.maxGuests - event.guests.length}</div>
                    <div className="text-xs text-gray-600">Spots Left</div>
                  </div>
                </div>

                {/* Guests List */}
                <div className="space-y-4">
                  {event.guests.map((guest) => {
                    const assignedDishes = event.dishes.filter(dish => dish.assignedTo === guest.id);
                    const assignedItems = (event.items || []).filter(item => item.assignedTo === guest.id);
                    
                    return (
                      <div key={guest.id} className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-sage-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium">
                                {guest.name?.charAt(0)?.toUpperCase() || 'G'}
                              </span>
                            </div>
                            <div>
                              <h3 className="text-charcoal-800 font-semibold">{guest.name}</h3>
                              <p className="text-gray-500 text-sm">{guest.email}</p>
                              {guest.phone && <p className="text-gray-500 text-xs">{guest.phone}</p>}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium
                              ${guest.rsvp === 'yes' ? 'bg-green-100 text-green-700' : 
                                guest.rsvp === 'no' ? 'bg-red-100 text-red-700' : 
                                'bg-yellow-100 text-yellow-700'}`}
                            >
                              {guest.rsvp || 'Pending'}
                            </span>
                            {guest.isManuallyAdded && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                Manual
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Guest's unique invite code (only visible to host and guest) */}
                        {isHost && guest.inviteCode && (
                          <div className="mb-3 p-2 bg-blue-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-xs text-blue-600 font-medium">Private Invite Code</div>
                                <div className="font-mono text-sm text-blue-800">{guest.inviteCode}</div>
                              </div>
                              <button
                                onClick={() => handleCopyGuestCode(guest.inviteCode)}
                                className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                <SafeIcon icon={FiCopy} className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Assigned items */}
                        {(assignedDishes.length > 0 || assignedItems.length > 0) && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            {assignedDishes.length > 0 && (
                              <div className="mb-2">
                                <h4 className="text-xs font-medium text-gray-500 mb-1">Dishes:</h4>
                                <div className="space-y-1">
                                  {assignedDishes.map((dish, i) => (
                                    <div key={i} className="text-sm text-gray-600">• {dish.name}</div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {assignedItems.length > 0 && (
                              <div>
                                <h4 className="text-xs font-medium text-gray-500 mb-1">Items:</h4>
                                <div className="space-y-1">
                                  {assignedItems.map((item, i) => (
                                    <div key={i} className="text-sm text-gray-600">• {item.name}</div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Equipment Tab */}
            {activeTab === 'equipment' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-charcoal-800">Available Equipment</h2>
                  {isHost && (
                    <button
                      onClick={() => setShowAddEquipment(true)}
                      className="px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors flex items-center"
                    >
                      <SafeIcon icon={FiTool} className="w-4 h-4 mr-2" />
                      Add Equipment
                    </button>
                  )}
                </div>

                {/* Add Equipment Modal */}
                {showAddEquipment && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full">
                      <h3 className="text-lg font-bold mb-4">Add Equipment</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Name *</label>
                          <input
                            type="text"
                            value={newEquipment.name}
                            onChange={(e) => setNewEquipment({...newEquipment, name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                            placeholder="e.g., Stove, Microwave, Grill"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <input
                            type="text"
                            value={newEquipment.description}
                            onChange={(e) => setNewEquipment({...newEquipment, description: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                            placeholder="Additional details"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                          <input
                            type="number"
                            min="1"
                            value={newEquipment.quantity}
                            onChange={(e) => setNewEquipment({...newEquipment, quantity: parseInt(e.target.value)})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                          />
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={handleAddEquipment}
                            className="flex-1 px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
                          >
                            Add Equipment
                          </button>
                          <button
                            onClick={() => setShowAddEquipment(false)}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Equipment List */}
                <div className="space-y-4">
                  {(event.equipment || []).map((equipment) => (
                    <div key={equipment.id} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-charcoal-800 font-semibold">{equipment.name}</h3>
                          {equipment.description && (
                            <p className="text-gray-600 text-sm">{equipment.description}</p>
                          )}
                          <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            Quantity: {equipment.quantity}
                          </span>
                        </div>
                        {isHost && (
                          <button
                            onClick={() => handleRemoveEquipment(equipment.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <SafeIcon icon={FiTrash} className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {(event.equipment || []).length === 0 && (
                    <div className="text-center py-8 bg-cream-50 rounded-lg">
                      <div className="text-4xl mb-2">🔧</div>
                      <p className="text-gray-600">No equipment listed yet.</p>
                      {isHost && (
                        <p className="text-sm text-gray-500 mt-1">Add equipment that guests can use for cooking.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Items Tab */}
            {activeTab === 'items' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-charcoal-800">Items Needed</h2>
                  {isHost && (
                    <button
                      onClick={() => setShowAddItem(true)}
                      className="px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors flex items-center"
                    >
                      <SafeIcon icon={FiPackage} className="w-4 h-4 mr-2" />
                      Add Item
                    </button>
                  )}
                </div>

                {/* Add Item Modal */}
                {showAddItem && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full">
                      <h3 className="text-lg font-bold mb-4">Add Item Needed</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                          <input
                            type="text"
                            value={newItem.name}
                            onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                            placeholder="e.g., Paper plates, Cups, Napkins"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                          <select
                            value={newItem.category}
                            onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                          >
                            {itemCategories.map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <input
                            type="text"
                            value={newItem.description}
                            onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                            placeholder="Additional details"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                          <input
                            type="number"
                            min="1"
                            value={newItem.quantity}
                            onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value)})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500"
                          />
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={handleAddItem}
                            className="flex-1 px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
                          >
                            Add Item
                          </button>
                          <button
                            onClick={() => setShowAddItem(false)}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Items List */}
                <div className="space-y-6">
                  {itemCategories.map((category) => {
                    const categoryItems = (event.items || []).filter(item => item.category === category.id);
                    if (categoryItems.length === 0) return null;

                    return (
                      <div key={category.id}>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                          <span className="mr-2">{category.icon}</span>
                          {category.name}
                        </h3>
                        <div className="space-y-3">
                          {categoryItems.map((item) => {
                            const assignedGuest = event.guests.find(g => g.id === item.assignedTo);
                            return (
                              <div key={item.id} className="bg-white rounded-lg p-4 border border-gray-200">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <h4 className="text-charcoal-800 font-semibold">{item.name}</h4>
                                    {item.description && (
                                      <p className="text-gray-600 text-sm">{item.description}</p>
                                    )}
                                    <div className="mt-2 flex items-center space-x-2">
                                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                        Qty: {item.quantity}
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
                                  <div className="flex items-center space-x-2">
                                    {!assignedGuest && !isHost && (
                                      <button
                                        onClick={() => handleAssignItem(item.id, user?.id)}
                                        className="px-3 py-1 bg-coral-500 text-white rounded text-sm hover:bg-coral-600 transition-colors"
                                      >
                                        I'll bring this
                                      </button>
                                    )}
                                    {assignedGuest && assignedGuest.id === user?.id && (
                                      <button
                                        onClick={() => handleUnassignItem(item.id)}
                                        className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
                                      >
                                        Cancel
                                      </button>
                                    )}
                                    {isHost && (
                                      <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                      >
                                        <SafeIcon icon={FiTrash} className="w-4 h-4" />
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
                    <div className="text-center py-8 bg-cream-50 rounded-lg">
                      <div className="text-4xl mb-2">📦</div>
                      <p className="text-gray-600">No items needed yet.</p>
                      {isHost && (
                        <p className="text-sm text-gray-500 mt-1">Add items that guests can bring to help with the event.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;