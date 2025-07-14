import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import supabase from '../../lib/supabase';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiSearch, FiCalendar, FiUsers, FiEye, FiTrash2, FiAlertCircle, FiRefreshCw, FiFilter, FiX, FiMapPin, FiMessageSquare } = FiIcons;

const EventManagement = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchQuery]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      if (!supabase.from) {
        // Generate mock data if Supabase is not available
        const mockEvents = generateMockEvents(20);
        setEvents(mockEvents);
        setFilteredEvents(mockEvents);
        setLoading(false);
        return;
      }

      // Fetch events from the database
      const { data: eventData, error: eventError } = await supabase
        .from('events_dp73hk')
        .select(`
          *,
          host:hostId (
            name,
            email
          ),
          guests:guests_dp73hk (*)
        `);

      if (eventError) {
        throw eventError;
      }

      setEvents(eventData || []);
      setFilteredEvents(eventData || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
      
      // Generate mock data in case of error
      const mockEvents = generateMockEvents(20);
      setEvents(mockEvents);
      setFilteredEvents(mockEvents);
    } finally {
      setLoading(false);
    }
  };

  const generateMockEvents = (count) => {
    const mockEvents = [];
    const themes = ['Italian Night', 'Mexican Fiesta', 'BBQ Cookout', 'Holiday Feast', 'Asian Fusion', 'Mediterranean'];
    const locations = ['123 Main St', 'Home Sweet Home', 'Community Center', '456 Park Ave', 'City Park'];
    
    for (let i = 1; i <= count; i++) {
      // Generate a date in the past or future
      const now = new Date();
      const dayOffset = Math.floor(Math.random() * 60) - 30; // -30 to +30 days
      const eventDate = new Date(now.getTime() + dayOffset * 24 * 60 * 60 * 1000);
      
      // Create random guests
      const guestCount = Math.floor(Math.random() * 10) + 2;
      const guests = [];
      for (let j = 1; j <= guestCount; j++) {
        guests.push({
          id: `guest-${i}-${j}`,
          name: `Guest ${j}`,
          email: `guest${j}@example.com`,
          rsvp: ['yes', 'no', 'pending'][Math.floor(Math.random() * 3)]
        });
      }
      
      mockEvents.push({
        id: `event-${i}`,
        title: `${themes[Math.floor(Math.random() * themes.length)]} #${i}`,
        date: eventDate.toISOString().split('T')[0],
        time: `${Math.floor(Math.random() * 12) + 1}:${Math.random() > 0.5 ? '00' : '30'} ${Math.random() > 0.5 ? 'PM' : 'AM'}`,
        location: locations[Math.floor(Math.random() * locations.length)],
        maxGuests: Math.floor(Math.random() * 15) + 5,
        createdAt: new Date(now.getTime() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
        hostId: `host-${i}`,
        hostName: `Host ${i}`,
        host: {
          name: `Host ${i}`,
          email: `host${i}@example.com`
        },
        code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        guests: guests,
        dishes: new Array(Math.floor(Math.random() * 8) + 3).fill(0).map((_, idx) => ({
          id: `dish-${i}-${idx}`,
          name: `Dish ${idx + 1}`,
          category: ['appetizers', 'mains', 'sides', 'desserts', 'drinks'][Math.floor(Math.random() * 5)]
        }))
      });
    }
    
    return mockEvents;
  };

  const filterEvents = () => {
    if (!searchQuery.trim()) {
      setFilteredEvents(events);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = events.filter(event => 
      (event.title?.toLowerCase().includes(query)) || 
      (event.hostName?.toLowerCase().includes(query)) ||
      (event.host?.name?.toLowerCase().includes(query)) ||
      (event.code?.toLowerCase().includes(query))
    );
    
    setFilteredEvents(filtered);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }
    
    try {
      if (!supabase.from) {
        // Remove mock event
        setEvents(events.filter(e => e.id !== eventId));
        setFilteredEvents(filteredEvents.filter(e => e.id !== eventId));
        toast.success('Event deleted successfully');
        return;
      }

      // Delete event from Supabase
      const { error } = await supabase
        .from('events_dp73hk')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      // Update local state
      setEvents(events.filter(e => e.id !== eventId));
      setFilteredEvents(filteredEvents.filter(e => e.id !== eventId));
      
      toast.success('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const formatGuestCount = (event) => {
    const confirmed = event.guests?.filter(g => g.rsvp === 'yes').length || 0;
    const total = event.guests?.length || 0;
    return `${confirmed}/${total} (${event.maxGuests} max)`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-coral-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
          <p className="text-gray-600">Monitor and manage all dinner events on the platform</p>
        </div>
        <button
          onClick={fetchEvents}
          className="flex items-center px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
        >
          <SafeIcon icon={FiRefreshCw} className="w-5 h-5 mr-2" />
          Refresh Events
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
        <div className="flex items-center">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search events by title, host name, or code..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent"
            />
            <SafeIcon icon={FiSearch} className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Events Table */}
      <motion.div
        className="bg-white rounded-xl shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {filteredEvents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left bg-gray-50">
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Host</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">{event.title}</div>
                      <div className="text-xs text-gray-500">Created {new Date(event.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">{event.host?.name || event.hostName}</div>
                      <div className="text-xs text-gray-500">{event.host?.email}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-1" />
                        <span>{event.date} at {event.time}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        {event.location ? (
                          <>
                            <SafeIcon icon={FiMapPin} className="w-4 h-4 mr-1" />
                            <span>{event.location}</span>
                          </>
                        ) : (
                          <span className="text-gray-400">Not specified</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <SafeIcon icon={FiUsers} className="w-4 h-4 mr-1" />
                        <span>{formatGuestCount(event)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {event.code}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleViewEvent(event)}
                          className="p-1 text-blue-600 hover:text-blue-800 rounded-full"
                          title="View Details"
                        >
                          <SafeIcon icon={FiEye} className="w-5 h-5" />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-1 text-red-600 hover:text-red-800 rounded-full"
                          title="Delete Event"
                        >
                          <SafeIcon icon={FiTrash2} className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <SafeIcon icon={FiAlertCircle} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">
              {searchQuery ? 'Try adjusting your search' : 'There are no events in the system yet'}
            </p>
          </div>
        )}
      </motion.div>

      {/* Event Details Modal */}
      {showEventDetails && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Event Details
                </h2>
                <button
                  onClick={() => setShowEventDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <SafeIcon icon={FiX} className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Event Info */}
                <div className="bg-cream-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">{selectedEvent.title}</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                      <span>{selectedEvent.date} at {selectedEvent.time}</span>
                    </div>
                    
                    {selectedEvent.location && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <SafeIcon icon={FiMapPin} className="w-4 h-4" />
                        <span>{selectedEvent.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2 text-gray-600">
                      <SafeIcon icon={FiUsers} className="w-4 h-4" />
                      <span>{formatGuestCount(selectedEvent)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-600">
                      <SafeIcon icon={FiMessageSquare} className="w-4 h-4" />
                      <span>Invite Code: <span className="font-mono font-medium">{selectedEvent.code}</span></span>
                    </div>
                  </div>
                </div>
                
                {/* Host Info */}
                <div>
                  <h3 className="text-md font-semibold text-gray-800 mb-2">Host Information</h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-coral-100 rounded-full flex items-center justify-center">
                        <span className="text-coral-600 font-medium">
                          {(selectedEvent.host?.name?.[0] || 'H').toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{selectedEvent.host?.name || selectedEvent.hostName}</div>
                        <div className="text-xs text-gray-500">{selectedEvent.host?.email}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Guest List */}
                <div>
                  <h3 className="text-md font-semibold text-gray-800 mb-2">Guest List ({selectedEvent.guests?.length || 0})</h3>
                  {selectedEvent.guests && selectedEvent.guests.length > 0 ? (
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Name</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Email</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">RSVP</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedEvent.guests.map((guest) => (
                            <tr key={guest.id}>
                              <td className="px-3 py-2 text-sm text-gray-900">{guest.name}</td>
                              <td className="px-3 py-2 text-sm text-gray-500">{guest.email}</td>
                              <td className="px-3 py-2">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  guest.rsvp === 'yes' ? 'bg-green-100 text-green-800' :
                                  guest.rsvp === 'no' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {guest.rsvp || 'pending'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-600">No guests have joined this event yet</p>
                    </div>
                  )}
                </div>
                
                {/* Dishes */}
                {selectedEvent.dishes && selectedEvent.dishes.length > 0 && (
                  <div>
                    <h3 className="text-md font-semibold text-gray-800 mb-2">Dishes ({selectedEvent.dishes.length})</h3>
                    <div className="grid md:grid-cols-2 gap-2">
                      {selectedEvent.dishes.map((dish, index) => (
                        <div key={dish.id || index} className="bg-white border border-gray-200 rounded-lg p-2">
                          <div className="text-sm font-medium text-gray-800">{dish.name}</div>
                          <div className="text-xs text-gray-500 capitalize">{dish.category}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagement;