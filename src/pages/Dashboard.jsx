import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useParty } from '../context/PartyContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { format } from 'date-fns';

const { FiPlus, FiCalendar, FiUsers, FiMapPin, FiShare2, FiEdit, FiTrash2 } = FiIcons;

const Dashboard = () => {
  const { user } = useAuth();
  const { getUserEvents, getGuestEvents, deleteEvent } = useParty();
  const [activeTab, setActiveTab] = useState('hosting');
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to view your dashboard.</p>
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

  const hostedEvents = getUserEvents(user.id);
  const guestEvents = getGuestEvents(user.email);

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(eventId);
    }
  };

  const EventCard = ({ event, isHost = false }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className={`h-2 bg-gradient-to-r ${event.theme?.gradient || 'from-primary-500 to-secondary-500'}`} />
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{event.theme?.icon || '🍽️'}</span>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
              <p className="text-sm text-gray-600">{event.theme?.name}</p>
            </div>
          </div>
          
          {isHost && (
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/event/${event.id}`)}
                className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <SafeIcon icon={FiEdit} className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDeleteEvent(event.id)}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <SafeIcon icon={FiTrash2} className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <SafeIcon icon={FiCalendar} className="w-4 h-4" />
            <span>{event.date} at {event.time}</span>
          </div>
          
          {event.location && (
            <div className="flex items-center space-x-2 text-gray-600">
              <SafeIcon icon={FiMapPin} className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2 text-gray-600">
            <SafeIcon icon={FiUsers} className="w-4 h-4" />
            <span>{event.guests.length} / {event.maxGuests} guests</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-4 text-sm">
            <span className="text-green-600">
              {event.guests.filter(g => g.rsvp === 'yes').length} confirmed
            </span>
            <span className="text-yellow-600">
              {event.guests.filter(g => g.rsvp === 'pending').length} pending
            </span>
            <span className="text-blue-600">
              {event.dishes.filter(d => d.assignedTo).length} dishes assigned
            </span>
          </div>
          
          <Link
            to={`/event/${event.id}`}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
          >
            View Event
          </Link>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user.name}!</p>
        </div>
        
        <Link
          to="/create"
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="w-5 h-5" />
          <span>Create Event</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-primary-100 rounded-lg">
              <SafeIcon icon={FiCalendar} className="w-6 h-6 text-primary-600" />
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
                {hostedEvents.reduce((sum, event) => sum + event.guests.length, 0)}
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
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'hosting', label: 'Hosting', count: hostedEvents.length },
              { id: 'attending', label: 'Attending', count: guestEvents.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
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
              {hostedEvents.length === 0 ? (
                <div className="text-center py-12">
                  <SafeIcon icon={FiCalendar} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
                  <p className="text-gray-600 mb-6">Create your first dinner party to get started!</p>
                  <Link
                    to="/create"
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center space-x-2"
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
                    <form className="flex">
                      <input
                        type="text"
                        placeholder="Enter event code"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <button
                        type="submit"
                        className="px-6 py-3 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700 transition-colors"
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;