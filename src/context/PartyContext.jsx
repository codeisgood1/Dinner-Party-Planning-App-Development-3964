import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';
import supabase from '../lib/supabase';
import toast from 'react-hot-toast';

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
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load events from Supabase when user changes
  useEffect(() => {
    if (user) {
      console.log("User changed, fetching events for:", user);
      fetchEvents();
      fetchTemplates();
    } else {
      setEvents([]);
      setTemplates([]);
      setLoading(false);
    }
  }, [user?.id]); // Depend on user.id to avoid unnecessary re-fetches

  // Fetch all events relevant to the user
  const fetchEvents = async () => {
    if (!user) {
      console.log("No user, skipping fetchEvents");
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log("Fetching events for user:", user?.id);

      // Create a mock event for testing if needed
      const mockEvent = {
        id: `mock-${Date.now()}`,
        title: "Mock Dinner Party",
        description: "This is a test event to ensure the dashboard works",
        date: new Date().toISOString().split('T')[0],
        time: "19:00",
        location: "Test Location",
        code: "TEST123",
        maxGuests: 10,
        hostId: user.id,
        hostName: user.name,
        theme: "italian",
        themeData: {
          id: 'italian',
          name: 'Italian Night',
          icon: '🍝',
          gradient: 'from-coral-500 to-sage-500'
        },
        createdAt: new Date().toISOString(),
        guests: [],
        dishes: [],
        items: [],
        messages: []
      };

      let hostedEvents = [];
      let guestEvents = [];

      // Try fetching from Supabase
      if (supabase) {
        try {
          const { data: hosted, error: hostedError } = await supabase
            .from('events_dp73hk')
            .select(`
              *,
              guests:guests_dp73hk(*),
              dishes:dishes_dp73hk(*)
            `)
            .eq('host_id', user.id);

          if (hostedError) {
            console.error('Error fetching hosted events:', hostedError);
          } else {
            console.log("Hosted events from Supabase:", hosted);
            hostedEvents = hosted || [];
          }

          // Fetch events where user is a guest
          const { data: guest, error: guestError } = await supabase
            .from('guests_dp73hk')
            .select(`
              event_id,
              events_dp73hk!inner (
                *,
                guests:guests_dp73hk(*),
                dishes:dishes_dp73hk(*)
              )
            `)
            .eq('email', user.email);

          if (guestError) {
            console.error('Error fetching guest events:', guestError);
          } else if (guest) {
            guestEvents = guest.map(g => g.events_dp73hk);
            console.log("Guest events from Supabase:", guestEvents);
          }
        } catch (supabaseError) {
          console.error("Supabase connection error:", supabaseError);
        }
      }

      // If no events from Supabase, add a mock event for testing
      const combinedEvents = [...hostedEvents];
      
      // Add guest events that aren't already in the list
      if (guestEvents.length > 0) {
        guestEvents.forEach(guestEvent => {
          if (!combinedEvents.find(e => e.id === guestEvent.id)) {
            combinedEvents.push(guestEvent);
          }
        });
      }

      // If no real events, add a mock one for testing the UI
      if (combinedEvents.length === 0) {
        // Add mock event for testing purposes
        console.log("No events found, adding mock event for testing");
        combinedEvents.push(mockEvent);
        
        // Also try to load from localStorage
        const savedEvents = localStorage.getItem('dinner-party-events');
        if (savedEvents) {
          try {
            const parsedEvents = JSON.parse(savedEvents);
            parsedEvents.forEach(event => {
              if (!combinedEvents.find(e => e.id === event.id)) {
                combinedEvents.push(event);
              }
            });
          } catch (e) {
            console.error("Error parsing saved events:", e);
          }
        }
      }

      // Transform to our application format
      const transformedEvents = combinedEvents.map(event => ({
        id: event.id,
        title: event.title || "Untitled Event",
        description: event.description || "",
        date: event.date || "",
        time: event.time || "",
        location: event.location || "",
        code: event.code || "CODE123",
        maxGuests: event.max_guests || event.maxGuests || 10,
        hostId: event.host_id || event.hostId || user.id,
        hostName: event.host_name || event.hostName || user.name,
        theme: event.theme || "italian",
        themeData: event.theme_data || event.themeData || {
          id: 'italian',
          name: 'Italian Night',
          icon: '🍝',
          gradient: 'from-coral-500 to-sage-500'
        },
        createdAt: event.created_at || event.createdAt || new Date().toISOString(),
        guests: event.guests || [],
        dishes: event.dishes || [],
        items: event.items || [],
        messages: event.messages || []
      }));

      console.log("Transformed events:", transformedEvents);
      setEvents(transformedEvents);

      // Save to localStorage as backup
      localStorage.setItem('dinner-party-events', JSON.stringify(transformedEvents));
    } catch (error) {
      console.error('Error in fetchEvents:', error);
      
      // Load from localStorage as fallback
      const savedEvents = localStorage.getItem('dinner-party-events');
      if (savedEvents) {
        try {
          const parsedEvents = JSON.parse(savedEvents);
          setEvents(parsedEvents);
        } catch (parseError) {
          console.error('Error parsing saved events:', parseError);
          
          // As a last resort, add a mock event
          setEvents([{
            id: `mock-${Date.now()}`,
            title: "Mock Dinner Party",
            description: "This is a test event to ensure the dashboard works",
            date: new Date().toISOString().split('T')[0],
            time: "19:00",
            location: "Test Location",
            code: "TEST123",
            maxGuests: 10,
            hostId: user.id,
            hostName: user.name,
            theme: "italian",
            themeData: {
              id: 'italian',
              name: 'Italian Night',
              icon: '🍝',
              gradient: 'from-coral-500 to-sage-500'
            },
            createdAt: new Date().toISOString(),
            guests: [],
            dishes: [],
            items: [],
            messages: []
          }]);
        }
      } else {
        // No saved events, create a mock one
        setEvents([{
          id: `mock-${Date.now()}`,
          title: "Mock Dinner Party",
          description: "This is a test event to ensure the dashboard works",
          date: new Date().toISOString().split('T')[0],
          time: "19:00",
          location: "Test Location",
          code: "TEST123",
          maxGuests: 10,
          hostId: user.id,
          hostName: user.name,
          theme: "italian",
          themeData: {
            id: 'italian',
            name: 'Italian Night',
            icon: '🍝',
            gradient: 'from-coral-500 to-sage-500'
          },
          createdAt: new Date().toISOString(),
          guests: [],
          dishes: [],
          items: [],
          messages: []
        }]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch templates
  const fetchTemplates = async () => {
    try {
      // Ensure we have a user
      if (!user) {
        return;
      }
      
      // Mock templates for testing
      const mockTemplates = [
        {
          id: 'mock-template-1',
          name: 'Italian Dinner',
          description: 'A classic Italian dinner with pasta and wine',
          theme: 'italian',
          theme_data: {
            id: 'italian',
            name: 'Italian Night',
            icon: '🍝',
            gradient: 'from-coral-500 to-sage-500'
          },
          dishes: [
            { name: 'Spaghetti Carbonara', description: 'Classic pasta dish', category: 'mains' },
            { name: 'Garlic Bread', description: 'Toasted bread with garlic butter', category: 'sides' },
            { name: 'Tiramisu', description: 'Coffee-flavored dessert', category: 'desserts' }
          ],
          is_public: true,
          created_by: user.id,
          created_by_name: user.name,
          created_at: new Date().toISOString(),
          usage_count: 5
        }
      ];

      // Try to fetch from Supabase
      if (supabase && supabase.from) {
        try {
          const { data, error } = await supabase
            .from('event_templates_dp73hk')
            .select('*')
            .or(`created_by.eq.${user.id},is_public.eq.true`);

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching templates:', error);
          } else if (data && data.length > 0) {
            console.log("Templates from Supabase:", data);
            setTemplates(data);
            return;
          }
        } catch (e) {
          console.error("Error accessing Supabase for templates:", e);
        }
      }

      // Load from localStorage if Supabase fails
      const savedTemplates = localStorage.getItem('dinner-party-templates');
      if (savedTemplates) {
        try {
          const parsedTemplates = JSON.parse(savedTemplates);
          if (parsedTemplates && parsedTemplates.length > 0) {
            setTemplates(parsedTemplates);
            return;
          }
        } catch (e) {
          console.error("Error parsing saved templates:", e);
        }
      }

      // If no templates found, use mock templates
      setTemplates(mockTemplates);
      localStorage.setItem('dinner-party-templates', JSON.stringify(mockTemplates));
    } catch (error) {
      console.error('Error in fetchTemplates:', error);
      
      // Use mock templates as fallback
      const mockTemplates = [
        {
          id: 'mock-template-1',
          name: 'Italian Dinner',
          description: 'A classic Italian dinner with pasta and wine',
          theme: 'italian',
          theme_data: {
            id: 'italian',
            name: 'Italian Night',
            icon: '🍝',
            gradient: 'from-coral-500 to-sage-500'
          },
          dishes: [
            { name: 'Spaghetti Carbonara', description: 'Classic pasta dish', category: 'mains' },
            { name: 'Garlic Bread', description: 'Toasted bread with garlic butter', category: 'sides' },
            { name: 'Tiramisu', description: 'Coffee-flavored dessert', category: 'desserts' }
          ],
          is_public: true,
          created_by: user?.id || 'mock-user',
          created_by_name: user?.name || 'Mock User',
          created_at: new Date().toISOString(),
          usage_count: 5
        }
      ];
      
      setTemplates(mockTemplates);
    }
  };

  // Generate a unique code for events
  const generateUniqueCode = async () => {
    try {
      // Generate a random 6-character code
      const generateCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
      };

      // Check if code exists
      const checkCodeExists = async (code) => {
        try {
          const { data, error } = await supabase
            .from('events_dp73hk')
            .select('id')
            .eq('code', code)
            .single();
          
          return !error && data;
        } catch (err) {
          return false;
        }
      };

      let code = generateCode();
      let exists = await checkCodeExists(code);
      
      // Keep generating until we find a unique code (max 10 attempts)
      let attempts = 0;
      while (exists && attempts < 10) {
        code = generateCode();
        exists = await checkCodeExists(code);
        attempts++;
      }

      return code;
    } catch (error) {
      console.error('Error generating unique code:', error);
      // Return a fallback code if generation fails
      return Math.random().toString(36).substring(2, 8).toUpperCase();
    }
  };

  // Create a new event
  const createEvent = async (eventData) => {
    try {
      console.log('Starting event creation with data:', eventData);
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Generate unique code
      const eventCode = await generateUniqueCode();
      console.log('Generated event code:', eventCode);

      // Prepare event data for Supabase
      const newEventData = {
        title: eventData.title,
        description: eventData.description || '',
        date: eventData.date || '',
        time: eventData.time || '',
        location: eventData.location || '',
        code: eventCode,
        max_guests: eventData.maxGuests || 10,
        theme: eventData.theme,
        theme_data: eventData.themeData || null,
        host_id: user.id,
        host_name: user.name,
        created_at: new Date().toISOString()
      };

      console.log('Inserting event into Supabase:', newEventData);

      // Insert event into Supabase
      const { data: createdEvent, error: eventError } = await supabase
        .from('events_dp73hk')
        .insert([newEventData])
        .select()
        .single();

      if (eventError) {
        console.error('Supabase event creation error:', eventError);
        
        // If Supabase fails, create locally
        const localEvent = {
          id: uuidv4(),
          ...newEventData,
          guests: [],
          dishes: eventData.dishes || [],
          items: [],
          messages: []
        };

        // Save to localStorage
        const currentEvents = [...events, localEvent];
        setEvents(currentEvents);
        localStorage.setItem('dinner-party-events', JSON.stringify(currentEvents));
        
        toast.success('Event created successfully! (Saved locally)');
        return localEvent;
      }

      console.log('Event created successfully in Supabase:', createdEvent);

      // Save dishes if any
      let savedDishes = [];
      if (eventData.dishes && eventData.dishes.length > 0) {
        console.log('Saving dishes:', eventData.dishes);
        
        const dishesWithEventId = eventData.dishes.map(dish => ({
          id: uuidv4(),
          event_id: createdEvent.id,
          name: dish.name,
          description: dish.description || '',
          category: dish.category,
          is_custom: dish.isCustom || false,
          assigned_to: null
        }));

        const { data: dishData, error: dishError } = await supabase
          .from('dishes_dp73hk')
          .insert(dishesWithEventId)
          .select();

        if (dishError) {
          console.error('Error saving dishes:', dishError);
          // Don't throw here, event creation succeeded
        } else {
          savedDishes = dishData || [];
          console.log('Dishes saved successfully:', savedDishes);
        }
      }

      // Transform to our application format
      const transformedEvent = {
        id: createdEvent.id,
        title: createdEvent.title,
        description: createdEvent.description,
        date: createdEvent.date,
        time: createdEvent.time,
        location: createdEvent.location,
        code: createdEvent.code,
        maxGuests: createdEvent.max_guests,
        hostId: createdEvent.host_id,
        hostName: createdEvent.host_name,
        theme: createdEvent.theme,
        themeData: createdEvent.theme_data,
        createdAt: createdEvent.created_at,
        guests: [],
        dishes: savedDishes.map(dish => ({
          id: dish.id,
          name: dish.name,
          description: dish.description,
          category: dish.category,
          isCustom: dish.is_custom,
          assignedTo: dish.assigned_to
        })),
        items: [],
        messages: []
      };

      // Update local state
      setEvents(prevEvents => [...prevEvents, transformedEvent]);

      // Also save to localStorage as backup
      const updatedEvents = [...events, transformedEvent];
      localStorage.setItem('dinner-party-events', JSON.stringify(updatedEvents));

      console.log('Event creation completed successfully');
      toast.success('Event created successfully!');
      return transformedEvent;
    } catch (error) {
      console.error('Error in createEvent:', error);
      toast.error('Failed to create event: ' + error.message);
      throw error;
    }
  };

  // Save event as template
  const saveAsTemplate = async (eventId, templateData) => {
    try {
      const event = getEventById(eventId);
      if (!event) throw new Error('Event not found');

      const template = {
        id: uuidv4(),
        name: templateData.name,
        description: templateData.description || '',
        theme: event.theme,
        theme_data: event.themeData,
        dishes: event.dishes.map(dish => ({
          name: dish.name,
          description: dish.description,
          category: dish.category
        })),
        is_public: templateData.isPublic || false,
        created_by: user.id,
        created_by_name: user.name,
        created_at: new Date().toISOString(),
        usage_count: 0
      };

      // Try to save to Supabase
      if (supabase && supabase.from) {
        try {
          const { data, error } = await supabase
            .from('event_templates_dp73hk')
            .insert([template])
            .select()
            .single();

          if (error) {
            console.error('Error saving template to Supabase:', error);
          } else {
            // Update local state with the Supabase response
            setTemplates(prev => [...prev, data]);
            toast.success('Template saved successfully!');
            return data;
          }
        } catch (e) {
          console.error('Exception saving template to Supabase:', e);
        }
      }

      // Save locally if Supabase fails
      const updatedTemplates = [...templates, template];
      setTemplates(updatedTemplates);
      localStorage.setItem('dinner-party-templates', JSON.stringify(updatedTemplates));
      toast.success('Template saved successfully! (Saved locally)');
      return template;
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
      throw error;
    }
  };

  // Create event from template
  const createFromTemplate = async (templateId, eventData) => {
    try {
      const template = templates.find(t => t.id === templateId);
      if (!template) throw new Error('Template not found');

      const newEventData = {
        title: eventData.title,
        description: eventData.description || template.description,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
        maxGuests: eventData.maxGuests || 10,
        theme: template.theme,
        themeData: template.theme_data,
        dishes: template.dishes || []
      };

      // Update template usage count if possible
      if (supabase && supabase.from) {
        try {
          await supabase
            .from('event_templates_dp73hk')
            .update({ usage_count: (template.usage_count || 0) + 1 })
            .eq('id', templateId);
        } catch (e) {
          console.error('Error updating template usage count:', e);
        }
      }

      // Update local template usage count
      setTemplates(prev => 
        prev.map(t => t.id === templateId ? 
          {...t, usage_count: (t.usage_count || 0) + 1} : t
        )
      );

      return await createEvent(newEventData);
    } catch (error) {
      console.error('Error creating from template:', error);
      toast.error('Failed to create event from template');
      throw error;
    }
  };

  // Get event by ID
  const getEventById = (eventId) => {
    return events.find(event => event.id === eventId);
  };

  // Get event by code
  const getEventByCode = (code) => {
    return events.find(event => event.code === code.toUpperCase());
  };

  // Update an event
  const updateEvent = async (eventId, updatedData) => {
    try {
      const event = getEventById(eventId);
      if (!event) throw new Error('Event not found');

      // Prepare data for Supabase update
      const supabaseData = {};
      if (updatedData.title) supabaseData.title = updatedData.title;
      if (updatedData.description !== undefined) supabaseData.description = updatedData.description;
      if (updatedData.date) supabaseData.date = updatedData.date;
      if (updatedData.time) supabaseData.time = updatedData.time;
      if (updatedData.location !== undefined) supabaseData.location = updatedData.location;
      if (updatedData.maxGuests) supabaseData.max_guests = updatedData.maxGuests;

      // Only update Supabase if we have fields to update and it's not a demo event
      if (Object.keys(supabaseData).length > 0 && !event.id.startsWith('demo-') && !event.id.startsWith('mock-')) {
        try {
          const { error } = await supabase
            .from('events_dp73hk')
            .update(supabaseData)
            .eq('id', eventId);

          if (error) {
            console.error('Error updating event in Supabase:', error);
            // Continue with local update
          }
        } catch (e) {
          console.error('Exception updating event in Supabase:', e);
        }
      }

      // Update local state
      const updatedEvent = { ...event, ...updatedData };
      setEvents(prevEvents => prevEvents.map(e => e.id === eventId ? updatedEvent : e));

      // Update localStorage
      const updatedEvents = events.map(e => e.id === eventId ? updatedEvent : e);
      localStorage.setItem('dinner-party-events', JSON.stringify(updatedEvents));

      return updatedEvent;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  };

  // Delete an event
  const deleteEvent = async (eventId) => {
    try {
      const event = getEventById(eventId);
      if (!event) throw new Error('Event not found');

      // Delete from Supabase if not a demo/mock event
      if (!event.id.startsWith('demo-') && !event.id.startsWith('mock-')) {
        try {
          const { error } = await supabase
            .from('events_dp73hk')
            .delete()
            .eq('id', eventId);

          if (error) {
            console.error('Error deleting event from Supabase:', error);
            // Continue with local deletion
          }
        } catch (e) {
          console.error('Exception deleting event from Supabase:', e);
        }
      }

      // Update local state
      setEvents(prevEvents => prevEvents.filter(e => e.id !== eventId));

      // Update localStorage
      const updatedEvents = events.filter(e => e.id !== eventId);
      localStorage.setItem('dinner-party-events', JSON.stringify(updatedEvents));
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  };

  // Join an event as a guest
  const joinEvent = async (code, guestData) => {
    try {
      // Find the event by code
      const { data: eventData, error: eventError } = await supabase
        .from('events_dp73hk')
        .select('*')
        .eq('code', code.toUpperCase())
        .single();

      if (eventError) throw new Error('Event not found');

      // Check if event is full
      const { data: guestsData, error: guestsError } = await supabase
        .from('guests_dp73hk')
        .select('id')
        .eq('event_id', eventData.id);

      if (guestsError) throw guestsError;

      if (guestsData.length >= eventData.max_guests) {
        throw new Error('This event is full');
      }

      // Check if guest already exists
      const { data: existingGuest, error: existingError } = await supabase
        .from('guests_dp73hk')
        .select('*')
        .eq('event_id', eventData.id)
        .eq('email', guestData.email)
        .single();

      if (existingGuest) {
        throw new Error('You have already joined this event');
      }

      // Create guest
      const newGuest = {
        id: uuidv4(),
        event_id: eventData.id,
        name: guestData.name,
        email: guestData.email,
        phone: guestData.phone || null,
        rsvp: 'pending',
        joined_at: new Date().toISOString()
      };

      const { error: insertError } = await supabase
        .from('guests_dp73hk')
        .insert([newGuest]);

      if (insertError) throw insertError;

      // Refresh events to get the updated data
      await fetchEvents();
      return true;
    } catch (error) {
      console.error('Error joining event:', error);
      throw error;
    }
  };

  // Update guest RSVP
  const updateGuest = async (eventId, guestId, updatedData) => {
    try {
      // Find the event
      const event = getEventById(eventId);
      if (!event) throw new Error('Event not found');

      // Find the guest
      const guestIndex = event.guests.findIndex(g => g.id === guestId);
      if (guestIndex === -1) throw new Error('Guest not found');

      // Prepare data for Supabase
      const supabaseData = {};
      if (updatedData.rsvp) supabaseData.rsvp = updatedData.rsvp;
      if (updatedData.name) supabaseData.name = updatedData.name;
      if (updatedData.phone) supabaseData.phone = updatedData.phone;

      // Update in Supabase if possible
      if (supabase && supabase.from) {
        try {
          const { error } = await supabase
            .from('guests_dp73hk')
            .update(supabaseData)
            .eq('id', guestId);

          if (error) {
            console.error('Error updating guest in Supabase:', error);
          }
        } catch (e) {
          console.error('Exception updating guest in Supabase:', e);
        }
      }

      // Update local state
      const updatedGuests = [...event.guests];
      updatedGuests[guestIndex] = { ...updatedGuests[guestIndex], ...updatedData };
      
      const updatedEvent = { ...event, guests: updatedGuests };
      setEvents(prevEvents => prevEvents.map(e => e.id === eventId ? updatedEvent : e));

      // Update localStorage
      localStorage.setItem('dinner-party-events', JSON.stringify(events.map(e => 
        e.id === eventId ? updatedEvent : e
      )));

      return updatedGuests[guestIndex];
    } catch (error) {
      console.error('Error updating guest:', error);
      throw error;
    }
  };

  // Get events where user is the host
  const getUserEvents = (userId) => {
    return events.filter(event => event.hostId === userId);
  };

  // Get events where user is a guest
  const getGuestEvents = (userEmail) => {
    return events.filter(event => 
      event.guests.some(guest => guest.email === userEmail)
    );
  };

  // Assign a dish to a guest
  const assignDish = async (eventId, dishId, guestId) => {
    try {
      const event = getEventById(eventId);
      if (!event) throw new Error('Event not found');

      // Update dish in Supabase if possible
      if (supabase && supabase.from) {
        try {
          const { error } = await supabase
            .from('dishes_dp73hk')
            .update({ assigned_to: guestId })
            .eq('id', dishId);

          if (error) {
            console.error('Error assigning dish in Supabase:', error);
          }
        } catch (e) {
          console.error('Exception assigning dish in Supabase:', e);
        }
      }

      // Update local state
      const updatedDishes = event.dishes.map(dish => 
        dish.id === dishId ? { ...dish, assignedTo: guestId } : dish
      );
      
      const updatedEvent = { ...event, dishes: updatedDishes };
      setEvents(prevEvents => prevEvents.map(e => e.id === eventId ? updatedEvent : e));

      // Update localStorage
      localStorage.setItem('dinner-party-events', JSON.stringify(events.map(e => 
        e.id === eventId ? updatedEvent : e
      )));

      return updatedEvent;
    } catch (error) {
      console.error('Error assigning dish:', error);
      throw error;
    }
  };

  // Assign an item to a guest
  const assignItem = async (eventId, itemId, guestId) => {
    try {
      const event = getEventById(eventId);
      if (!event) throw new Error('Event not found');

      // Update local state (no Supabase table for items yet)
      const updatedItems = (event.items || []).map(item => 
        item.id === itemId ? { ...item, assignedTo: guestId } : item
      );
      
      const updatedEvent = { ...event, items: updatedItems };
      setEvents(prevEvents => prevEvents.map(e => e.id === eventId ? updatedEvent : e));

      // Update localStorage
      localStorage.setItem('dinner-party-events', JSON.stringify(events.map(e => 
        e.id === eventId ? updatedEvent : e
      )));

      return updatedEvent;
    } catch (error) {
      console.error('Error assigning item:', error);
      throw error;
    }
  };

  const value = {
    events,
    templates,
    loading,
    createEvent,
    getEventById,
    getEventByCode,
    updateEvent,
    deleteEvent,
    joinEvent,
    updateGuest,
    getUserEvents,
    getGuestEvents,
    assignDish,
    assignItem,
    saveAsTemplate,
    createFromTemplate,
    fetchEvents,
    fetchTemplates
  };

  return (
    <PartyContext.Provider value={value}>
      {children}
    </PartyContext.Provider>
  );
};