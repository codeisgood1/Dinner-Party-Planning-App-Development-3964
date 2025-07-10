import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const PartyContext = createContext();

export const useParty = () => {
  const context = useContext(PartyContext);
  if (!context) {
    throw new Error('useParty must be used within a PartyProvider');
  }
  return context;
};

export const PartyProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load events from localStorage
    const savedEvents = localStorage.getItem('dinner-party-events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
    setLoading(false);
  }, []);

  const saveEventsToStorage = (updatedEvents) => {
    localStorage.setItem('dinner-party-events', JSON.stringify(updatedEvents));
  };

  const createEvent = (eventData) => {
    const newEvent = {
      id: uuidv4(),
      code: Math.random().toString(36).substring(2, 8).toUpperCase(),
      ...eventData,
      createdAt: new Date().toISOString(),
      guests: [],
      dishes: eventData.dishes || [],
      amenities: eventData.amenities || [],
      equipment: eventData.equipment || [],
      items: eventData.items || []
    };

    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    saveEventsToStorage(updatedEvents);
    return newEvent;
  };

  const updateEvent = (eventId, updates) => {
    const updatedEvents = events.map(event =>
      event.id === eventId ? { ...event, ...updates } : event
    );
    setEvents(updatedEvents);
    saveEventsToStorage(updatedEvents);
  };

  const deleteEvent = (eventId) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    saveEventsToStorage(updatedEvents);
  };

  const joinEvent = (eventCode, guestData) => {
    const event = events.find(e => e.code === eventCode);
    if (!event) {
      throw new Error('Event not found');
    }

    const newGuest = {
      id: uuidv4(),
      ...guestData,
      joinedAt: new Date().toISOString(),
      rsvp: 'pending'
    };

    const updatedEvents = events.map(e =>
      e.id === event.id
        ? { ...e, guests: [...e.guests, newGuest] }
        : e
    );

    setEvents(updatedEvents);
    saveEventsToStorage(updatedEvents);

    return {
      event: { ...event, guests: [...event.guests, newGuest] },
      guest: newGuest
    };
  };

  const addManualGuest = (eventId, guestData) => {
    const event = events.find(e => e.id === eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    const newGuest = {
      id: uuidv4(),
      ...guestData,
      joinedAt: new Date().toISOString(),
      rsvp: 'pending',
      isManuallyAdded: true,
      inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase()
    };

    const updatedEvents = events.map(e =>
      e.id === eventId
        ? { ...e, guests: [...e.guests, newGuest] }
        : e
    );

    setEvents(updatedEvents);
    saveEventsToStorage(updatedEvents);

    return newGuest;
  };

  const updateGuest = (eventId, guestId, updates) => {
    const updatedEvents = events.map(event =>
      event.id === eventId
        ? {
            ...event,
            guests: event.guests.map(guest =>
              guest.id === guestId ? { ...guest, ...updates } : guest
            )
          }
        : event
    );
    setEvents(updatedEvents);
    saveEventsToStorage(updatedEvents);
  };

  const assignDish = (eventId, dishId, guestId) => {
    const updatedEvents = events.map(event =>
      event.id === eventId
        ? {
            ...event,
            dishes: event.dishes.map(dish =>
              dish.id === dishId ? { ...dish, assignedTo: guestId } : dish
            )
          }
        : event
    );
    setEvents(updatedEvents);
    saveEventsToStorage(updatedEvents);
  };

  const assignItem = (eventId, itemId, guestId) => {
    const updatedEvents = events.map(event =>
      event.id === eventId
        ? {
            ...event,
            items: (event.items || []).map(item =>
              item.id === itemId ? { ...item, assignedTo: guestId } : item
            )
          }
        : event
    );
    setEvents(updatedEvents);
    saveEventsToStorage(updatedEvents);
  };

  const getEventByCode = (code) => {
    return events.find(event => event.code === code);
  };

  const getEventById = (id) => {
    return events.find(event => event.id === id);
  };

  const getUserEvents = (userId) => {
    return events.filter(event => event.hostId === userId);
  };

  const getGuestEvents = (guestEmail) => {
    return events.filter(event =>
      event.guests.some(guest => guest.email === guestEmail)
    );
  };

  const value = {
    events,
    loading,
    createEvent,
    updateEvent,
    deleteEvent,
    joinEvent,
    addManualGuest,
    updateGuest,
    assignDish,
    assignItem,
    getEventByCode,
    getEventById,
    getUserEvents,
    getGuestEvents
  };

  return (
    <PartyContext.Provider value={value}>
      {children}
    </PartyContext.Provider>
  );
};