import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useParty } from '../context/PartyContext';
import { useAuth } from '../context/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';
import supabase from '../lib/supabase';

const { FiUser, FiMail, FiPhone, FiArrowRight } = FiIcons;

const JoinEvent = () => {
  const { code } = useParams();
  const { getEventByCode, joinEvent } = useParty();
  const { user } = useAuth();
  const [guestData, setGuestData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch event directly from Supabase to ensure we're getting the latest data
    const fetchEventByCode = async () => {
      setLoadingEvent(true);
      try {
        const formattedCode = code.trim().toUpperCase();
        console.log('Fetching event with code:', formattedCode);
        
        const { data, error } = await supabase
          .from('events_dp73hk')
          .select(`
            *,
            guests:guests_dp73hk(*),
            dishes:dishes_dp73hk(*),
            items:items_dp73hk(*),
            messages:messages_dp73hk(*)
          `)
          .eq('code', formattedCode)
          .single();
          
        if (error) {
          console.error('Error fetching event by code:', error);
          // Try from local context as fallback
          const localEvent = getEventByCode(code);
          setEvent(localEvent);
        } else {
          console.log('Found event in Supabase:', data);
          // Transform to our format
          const transformedEvent = {
            ...data,
            hostId: data.host_id,
            hostName: data.host_name,
            maxGuests: data.max_guests,
            themeData: data.theme_data,
            createdAt: data.created_at
          };
          setEvent(transformedEvent);
        }
      } catch (error) {
        console.error('Error in fetchEventByCode:', error);
        // Try from local context as fallback
        const localEvent = getEventByCode(code);
        setEvent(localEvent);
      } finally {
        setLoadingEvent(false);
      }
    };
    
    fetchEventByCode();
  }, [code, getEventByCode]);

  // Update guest data if user info changes
  useEffect(() => {
    if (user) {
      setGuestData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  if (loadingEvent) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-xl p-8 shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-coral-500 border-t-transparent mx-auto"></div>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Loading Event...</h1>
          <p className="text-gray-600 mt-2">Please wait while we fetch the event details.</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-xl p-8 shadow-lg text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <p className="text-gray-600 mb-6">
            The event code "{code}" doesn't exist or has expired.
          </p>
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if guest already exists
    const existingGuest = event.guests?.find(guest => guest.email === guestData.email);
    if (existingGuest) {
      toast.error('You have already joined this event');
      navigate(`/guest/${event.id}`);
      return;
    }

    // Check if event is full
    if (event.guests?.length >= event.maxGuests) {
      toast.error('This event is full');
      setLoading(false);
      return;
    }

    try {
      // Join the event
      const result = await joinEvent(code, guestData);
      if (result) {
        toast.success('Successfully joined the event!');
        navigate(`/guest/${event.id}`);
      } else {
        toast.error('Failed to join event');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error joining event:', error);
      toast.error('Failed to join event: ' + error.message);
      setLoading(false);
    }
  };

  const confirmedGuests = event.guests?.filter(guest => guest.rsvp === 'yes').length || 0;
  const spotsLeft = event.maxGuests - (event.guests?.length || 0);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        {/* Event Header */}
        <div className={`p-8 bg-gradient-to-br ${event.theme?.gradient || 'from-coral-500 to-sage-500'}`}>
          <div className="text-center">
            <div className="text-6xl mb-4">{event.theme?.icon || '🍽️'}</div>
            <h1 className="text-3xl font-bold text-white mb-2">{event.title}</h1>
            <p className="text-white/90 text-lg">
              Hosted by {event.hostName}
            </p>
          </div>
        </div>

        {/* Event Details */}
        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Event Details</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Date:</strong> {event.date}</p>
                <p><strong>Time:</strong> {event.time}</p>
                {event.location && (
                  <p><strong>Location:</strong> {event.location}</p>
                )}
                <p><strong>Theme:</strong> {event.theme?.name}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Attendance</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Confirmed:</strong> {confirmedGuests} guests</p>
                <p><strong>Spots Left:</strong> {spotsLeft}</p>
                <p><strong>Total Dishes:</strong> {event.dishes?.length || 0}</p>
              </div>
            </div>
          </div>

          {event.description && (
            <div className="mb-8">
              <h3 className="font-semibold text-gray-800 mb-2">About This Event</h3>
              <p className="text-gray-600">{event.description}</p>
            </div>
          )}

          {/* Join Form */}
          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Join the Party!</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={guestData.name}
                    onChange={(e) => setGuestData({ ...guestData, name: e.target.value })}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
                    placeholder="Enter your full name"
                  />
                  <SafeIcon icon={FiUser} className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={guestData.email}
                    onChange={(e) => setGuestData({ ...guestData, email: e.target.value })}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
                    placeholder="Enter your email"
                  />
                  <SafeIcon icon={FiMail} className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={guestData.phone}
                    onChange={(e) => setGuestData({ ...guestData, phone: e.target.value })}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
                    placeholder="Enter your phone number"
                  />
                  <SafeIcon icon={FiPhone} className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={spotsLeft === 0 || loading}
                className="w-full px-6 py-4 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span>Joining...</span>
                ) : (
                  <>
                    <span>{spotsLeft === 0 ? 'Event Full' : 'Join Event'}</span>
                    {spotsLeft > 0 && <SafeIcon icon={FiArrowRight} className="w-5 h-5" />}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default JoinEvent;