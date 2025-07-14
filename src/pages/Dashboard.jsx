import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useParty } from '../context/PartyContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiPlus, FiCalendar, FiUsers, FiMapPin, FiShare2, FiEdit, FiTrash2, FiCopy, FiSave, FiRefreshCw, FiTemplate, FiStar, FiAlertCircle } = FiIcons;

const Dashboard = () => {
  const { user } = useAuth();
  const { events, getUserEvents, getGuestEvents, deleteEvent, saveAsTemplate, templates, fetchEvents, loading } = useParty();
  const [activeTab, setActiveTab] = useState('hosting');
  const [joinCode, setJoinCode] = useState('');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedEventForTemplate, setSelectedEventForTemplate] = useState(null);
  const [templateData, setTemplateData] = useState({
    name: '',
    description: '',
    isPublic: false
  });
  const navigate = useNavigate();

  // Refresh events when component mounts
  useEffect(() => {
    if (user) {
      console.log("Dashboard mounted, fetching events for user:", user);
      fetchEvents();
    }
  }, [user?.id]);

  // Debug log to track events
  useEffect(() => {
    console.log("Events in dashboard:", events);
  }, [events]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to view your dashboard.</p>
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

  const hostedEvents = getUserEvents(user.id) || [];
  const guestEvents = getGuestEvents(user.email) || [];

  // Debug to make sure we have events
  console.log("Hosted events:", hostedEvents);
  console.log("Guest events:", guestEvents);

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(eventId);
      toast.success('Event deleted successfully');
    }
  };

  const handleJoinEvent = (e) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      toast.error('Please enter an event code');
      return;
    }

    const formattedCode = joinCode.trim().toUpperCase();
    navigate(`/join/${formattedCode}`);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Event code copied to clipboard!');
  };

  const handleSaveAsTemplate = (event) => {
    setSelectedEventForTemplate(event);
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
      await saveAsTemplate(selectedEventForTemplate.id, templateData);
      setShowTemplateModal(false);
      setTemplateData({ name: '', description: '', isPublic: false });
      setSelectedEventForTemplate(null);
      toast.success('Template saved successfully!');
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Failed to save template');
    }
  };

  const handleRefresh = async () => {
    toast.promise(
      fetchEvents(),
      {
        loading: 'Refreshing events...',
        success: 'Events refreshed!',
        error: 'Failed to refresh events'
      }
    );
  };

  const EventCard = ({ event, isHost = false }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className={`h-2 bg-gradient-to-r ${event.themeData?.gradient || 'from-coral-500 to-sage-500'}`} />
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{event.themeData?.icon || '🍽️'}</span>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{event.title || 'Unnamed Event'}</h3>
              <p className="text-sm text-gray-600">{event.themeData?.name || event.theme || 'Custom Theme'}</p>
            </div>
          </div>
          {isHost && (
            <div className="flex space-x-2">
              <button
                onClick={() => handleSaveAsTemplate(event)}
                className="p-2 text-gray-600 hover:text-golden-600 transition-colors"
                title="Save as template"
              >
                <SafeIcon icon={FiTemplate} className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate(`/event/${event.id}`)}
                className="p-2 text-gray-600 hover:text-coral-600 transition-colors"
                title="Edit event"
              >
                <SafeIcon icon={FiEdit} className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDeleteEvent(event.id)}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                title="Delete event"
              >
                <SafeIcon icon={FiTrash2} className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
        
        <div className="space-y-3 mb-4">
          {event.date && (
            <div className="flex items-center space-x-2 text-gray-600">
              <SafeIcon icon={FiCalendar} className="w-4 h-4" />
              <span>{event.date} {event.time && `at ${event.time}`}</span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center space-x-2 text-gray-600">
              <SafeIcon icon={FiMapPin} className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
          )}
          <div className="flex items-center space-x-2 text-gray-600">
            <SafeIcon icon={FiUsers} className="w-4 h-4" />
            <span>{event.guests?.length || 0} / {event.maxGuests || 10} guests</span>
          </div>
          
          {isHost && event.code && (
            <div className="flex items-center justify-between mt-2 p-2 bg-cream-50 rounded-lg">
              <div className="text-xs text-gray-600">
                <span className="font-medium">Code:</span> {event.code}
              </div>
              <button
                onClick={() => handleCopyCode(event.code)}
                className="p-1 hover:bg-gray-100 rounded-full"
                title="Copy event code"
              >
                <SafeIcon icon={FiCopy} className="w-4 h-4 text-coral-500" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex space-x-4 text-sm">
            <span className="text-green-600">
              {(event.guests || []).filter(g => g.rsvp === 'yes').length} confirmed
            </span>
            <span className="text-yellow-600">
              {(event.guests || []).filter(g => g.rsvp === 'pending').length} pending
            </span>
            <span className="text-blue-600">
              {(event.dishes || []).filter(d => d.assignedTo).length} dishes assigned
            </span>
          </div>
          <Link
            to={isHost ? `/event/${event.id}` : `/guest/${event.id}`}
            className="px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors text-sm"
          >
            View Event
          </Link>
        </div>
      </div>
    </motion.div>
  );

  const TemplateCard = ({ template }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className={`h-2 bg-gradient-to-r ${template.theme_data?.gradient || 'from-purple-500 to-pink-500'}`} />
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{template.theme_data?.icon || '🎨'}</span>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{template.name || 'Unnamed Template'}</h3>
              <p className="text-sm text-gray-600">by {template.created_by_name || 'Unknown'}</p>
            </div>
          </div>
          {template.is_public && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              Public
            </span>
          )}
        </div>

        {template.description && (
          <p className="text-gray-600 text-sm mb-4">{template.description}</p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <span>{template.dishes?.length || 0} dishes</span>
          <span>{template.usage_count || 0} uses</span>
        </div>

        <button
          onClick={() => navigate('/create', { state: { templateId: template.id } })}
          className="w-full px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors text-sm"
        >
          Use Template
        </button>
      </div>
    </motion.div>
  );

  // Error message component for debugging
  const ErrorDisplay = ({ message }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <SafeIcon icon={FiAlertCircle} className="w-5 h-5 text-red-500 mt-0.5 mr-2" />
        <div>
          <h3 className="text-red-800 font-medium">Error Loading Events</h3>
          <p className="text-red-600 text-sm">{message}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user.name || 'User'}!</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
            disabled={loading}
          >
            <SafeIcon icon={FiRefreshCw} className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <Link
            to="/create"
            className="px-6 py-3 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} className="w-5 h-5" />
            <span>Create Event</span>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-coral-100 rounded-lg">
              <SafeIcon icon={FiCalendar} className="w-6 h-6 text-coral-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{hostedEvents.length}</div>
              <div className="text-sm text-gray-600">Events Hosted</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <SafeIcon icon={FiUsers} className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {hostedEvents.reduce((sum, event) => sum + (event.guests?.length || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Guests</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <SafeIcon icon={FiShare2} className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{guestEvents.length}</div>
              <div className="text-sm text-gray-600">Events Joined</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <SafeIcon icon={FiTemplate} className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{templates?.length || 0}</div>
              <div className="text-sm text-gray-600">Templates</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'hosting', label: 'Hosting', count: hostedEvents.length },
              { id: 'attending', label: 'Attending', count: guestEvents.length },
              { id: 'templates', label: 'Templates', count: templates?.length || 0 }
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
          {activeTab === 'hosting' && (
            <div>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-coral-500 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading events...</p>
                </div>
              ) : hostedEvents.length === 0 ? (
                <div className="text-center py-12">
                  <SafeIcon icon={FiCalendar} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
                  <p className="text-gray-600 mb-6">Create your first dinner party to get started!</p>
                  <Link
                    to="/create"
                    className="px-6 py-3 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors inline-flex items-center space-x-2"
                  >
                    <SafeIcon icon={FiPlus} className="w-5 h-5" />
                    <span>Create Event</span>
                  </Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {hostedEvents.map((event) => (
                    <EventCard key={event.id} event={event} isHost={true} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'attending' && (
            <div>
              {guestEvents.length === 0 ? (
                <div className="text-center py-12">
                  <SafeIcon icon={FiUsers} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No events joined</h3>
                  <p className="text-gray-600 mb-6">Join events using invite codes from your friends!</p>
                  <div className="max-w-md mx-auto">
                    <form className="flex" onSubmit={handleJoinEvent}>
                      <input
                        type="text"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        placeholder="Enter event code"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
                      />
                      <button
                        type="submit"
                        className="px-6 py-3 bg-coral-500 text-white rounded-r-lg hover:bg-coral-600 transition-colors"
                      >
                        Join
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {guestEvents.map((event) => (
                    <EventCard key={event.id} event={event} isHost={false} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'templates' && (
            <div>
              {!templates || templates.length === 0 ? (
                <div className="text-center py-12">
                  <SafeIcon icon={FiTemplate} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No templates yet</h3>
                  <p className="text-gray-600 mb-6">Save events as templates to reuse them later!</p>
                  <Link
                    to="/create"
                    className="px-6 py-3 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors inline-flex items-center space-x-2"
                  >
                    <SafeIcon icon={FiPlus} className="w-5 h-5" />
                    <span>Create Event</span>
                  </Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates.map((template) => (
                    <TemplateCard key={template.id} template={template} />
                  ))}
                </div>
              )}
            </div>
          )}
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
  );
};

export default Dashboard;