import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import supabase from '../lib/supabase';
import toast from 'react-hot-toast';

const { FiSend, FiLock, FiGlobe, FiMessageSquare, FiX, FiAlertTriangle } = FiIcons;

const EventChat = ({ event, onSendMessage }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // For mock events, use local storage
    if (event.id.startsWith('mock-')) {
      loadLocalMessages();
    } else {
      fetchMessages();
      const chatSubscription = subscribeToMessages();
      return () => {
        if (chatSubscription) {
          supabase.removeChannel(chatSubscription);
        }
      };
    }
  }, [event.id]);

  const loadLocalMessages = () => {
    try {
      const savedMessages = localStorage.getItem(`chat-${event.id}`);
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);
      }
    } catch (err) {
      console.error('Error loading local messages:', err);
    }
  };

  const saveLocalMessages = (newMessages) => {
    try {
      localStorage.setItem(`chat-${event.id}`, JSON.stringify(newMessages));
    } catch (err) {
      console.error('Error saving local messages:', err);
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      console.log('Fetching messages for event:', event.id);

      const { data, error } = await supabase
        .from('messages_dp73hk')
        .select('*')
        .eq('event_id', event.id)
        .order('timestamp', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        setError(error.message);
        return;
      }

      console.log('Fetched messages:', data);
      setMessages(data || []);
    } catch (err) {
      console.error('Exception in fetchMessages:', err);
      setError(err.message);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    try {
      console.log('Setting up real-time subscription for messages');
      const channel = supabase
        .channel('public:messages_dp73hk')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages_dp73hk',
          filter: `event_id=eq.${event.id}`
        }, (payload) => {
          console.log('Received new message:', payload);
          setMessages(current => [...current, payload.new]);
        })
        .subscribe((status) => {
          console.log('Subscription status:', status);
        });

      return channel;
    } catch (err) {
      console.error('Error setting up subscription:', err);
      return null;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const newMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        event_id: event.id,
        sender_id: user.id,
        sender_name: user.name,
        text: message,
        is_private: isPrivate,
        timestamp: new Date().toISOString()
      };

      console.log('Sending message:', newMessage);

      // For mock events, save to local storage
      if (event.id.startsWith('mock-')) {
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        saveLocalMessages(updatedMessages);
        setMessage('');
        toast.success(isPrivate ? 'Private message sent to host' : 'Message sent to everyone');
        
        // Also call the parent callback if provided
        if (onSendMessage) {
          onSendMessage(newMessage);
        }
        return;
      }

      // For real events, save to Supabase
      const { data, error } = await supabase
        .from('messages_dp73hk')
        .insert([{
          event_id: event.id,
          sender_id: user.id,
          sender_name: user.name,
          text: message,
          is_private: isPrivate,
          timestamp: new Date().toISOString()
        }]);

      if (error) {
        console.error('Error sending message:', error);
        toast.error('Failed to send message');
        return;
      }

      setMessage('');
      toast.success(isPrivate ? 'Private message sent to host' : 'Message sent to everyone');
    } catch (err) {
      console.error('Exception in handleSendMessage:', err);
      toast.error('Failed to send message');
    }
  };

  // Filter messages based on visibility
  const visibleMessages = messages.filter(msg => {
    // Host sees all messages
    if (event.hostId === user?.id) return true;
    // Current user sees their own private messages
    if (msg.is_private && msg.sender_id === user?.id) return true;
    // Everyone sees public messages
    if (!msg.is_private) return true;
    // Otherwise, hide the message
    return false;
  });

  if (error && !event.id.startsWith('mock-')) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 bg-red-50 text-red-600 flex items-center">
          <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 mr-2" />
          <p>Error loading chat: {error}</p>
        </div>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={fetchMessages}
            className="px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div className="bg-white rounded-xl shadow-sm overflow-hidden" layout>
      <div className="p-4 h-80 overflow-y-auto bg-cream-50">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="w-8 h-8 border-4 border-coral-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p>Loading messages...</p>
          </div>
        ) : visibleMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <SafeIcon icon={FiMessageSquare} className="w-10 h-10 mb-2 text-gray-300" />
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleMessages.map((msg) => {
              const isCurrentUser = msg.sender_id === user?.id;
              const formattedTime = new Date(msg.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={msg.id}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      isCurrentUser
                        ? 'bg-coral-500 text-white rounded-tr-none'
                        : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
                    } ${msg.is_private ? 'border-l-4 border-l-golden-500' : ''}`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm">
                        {isCurrentUser ? 'You' : msg.sender_name}
                      </span>
                      {msg.is_private && (
                        <div className="flex items-center text-xs font-medium">
                          <SafeIcon icon={FiLock} className="w-3 h-3 mr-1" />
                          <span>Private</span>
                        </div>
                      )}
                    </div>
                    <p className="mb-1">{msg.text}</p>
                    <div
                      className={`text-xs ${
                        isCurrentUser ? 'text-white/70' : 'text-gray-500'
                      } text-right`}
                    >
                      {formattedTime}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
        <div className="flex items-center mb-2">
          <button
            type="button"
            onClick={() => setIsPrivate(!isPrivate)}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
              isPrivate
                ? 'bg-golden-100 text-golden-600'
                : 'bg-sage-100 text-sage-600'
            }`}
          >
            <SafeIcon icon={isPrivate ? FiLock : FiGlobe} className="w-3 h-3" />
            <span>{isPrivate ? 'Private to host' : 'Everyone'}</span>
          </button>
          <div className="ml-2 text-xs text-gray-500">
            {isPrivate
              ? 'Only the host will see this message'
              : 'All attendees will see this message'}
          </div>
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
          >
            <SafeIcon icon={FiSend} className="w-5 h-5" />
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default EventChat;