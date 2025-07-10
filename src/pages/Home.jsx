import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useParty } from '../context/PartyContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiPlus, FiUsers, FiCalendar, FiArrowRight, FiStar, FiHeart, FiTrendingUp } = FiIcons;

const Home = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [joinCode, setJoinCode] = useState('');
  const { user, login, register } = useAuth();
  const { getEventByCode } = useParty();
  const navigate = useNavigate();

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    try {
      if (authMode === 'login') {
        // Simple login simulation
        login(formData);
        toast.success('Welcome back!');
      } else {
        // Register new user
        register(formData);
        toast.success('Account created successfully!');
      }
      setShowAuthModal(false);
      setFormData({ name: '', email: '', password: '' });
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleJoinEvent = (e) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      toast.error('Please enter an event code');
      return;
    }
    
    const event = getEventByCode(joinCode.toUpperCase());
    if (event) {
      navigate(`/join/${joinCode.toUpperCase()}`);
    } else {
      toast.error('Event not found. Please check the code.');
    }
  };

  const features = [
    {
      icon: FiUsers,
      title: 'Guest Coordination',
      description: 'Invite friends with unique codes and track RSVPs in real-time'
    },
    {
      icon: FiCalendar,
      title: 'Theme Inspiration',
      description: 'Choose from Italian, Mexican, BBQ and more with curated dish suggestions'
    },
    {
      icon: FiHeart,
      title: 'Dish Organization',
      description: 'Easily assign dishes and prevent duplicates with our smart system'
    },
    {
      icon: FiTrendingUp,
      title: 'Live Updates',
      description: 'Keep everyone in sync with real-time updates on the dinner plan'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Dinners Planned' },
    { number: '50K+', label: 'Happy Diners' },
    { number: '95%', label: 'Success Rate' },
    { number: '4.9★', label: 'User Rating' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cream-50 to-cream-200 py-20">
        <div className="absolute inset-0 sketch-bg opacity-50" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="font-poppins text-4xl md:text-6xl font-bold text-charcoal-500 mb-6">
                Sketching Out
                <span className="doodle-underline ml-3 text-coral-500">Dinner Plans</span>
              </h1>
              <p className="font-inter text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Coordinate dishes, manage guests, and create memorable dining experiences 
                with our playful dinner planning platform.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              {user ? (
                <button
                  onClick={() => navigate('/create')}
                  className="inline-flex items-center px-8 py-4 bg-coral-500 text-white rounded-xl font-poppins font-semibold hover:bg-coral-600 transition-all transform hover:scale-105 shadow-lg"
                >
                  <SafeIcon icon={FiPlus} className="w-5 h-5 mr-2" />
                  Create Your Event
                </button>
              ) : (
                <button
                  onClick={() => {
                    setAuthMode('register');
                    setShowAuthModal(true);
                  }}
                  className="inline-flex items-center px-8 py-4 bg-coral-500 text-white rounded-xl font-poppins font-semibold hover:bg-coral-600 transition-all transform hover:scale-105 shadow-lg"
                >
                  Get Started Free
                  <SafeIcon icon={FiArrowRight} className="w-5 h-5 ml-2" />
                </button>
              )}
              
              <form onSubmit={handleJoinEvent} className="flex">
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="Enter event code"
                  className="font-inter px-4 py-4 border border-gray-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-6 py-4 bg-sage-500 text-white rounded-r-xl hover:bg-sage-600 transition-colors font-poppins font-medium"
                >
                  Join Event
                </button>
              </form>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-poppins font-bold text-coral-500">{stat.number}</div>
                  <div className="text-sm font-inter text-gray-600">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-poppins text-3xl md:text-4xl font-bold text-charcoal-500 mb-4">
              Why Choose <span className="text-coral-500">DinnerDoodle</span>?
            </h2>
            <p className="font-inter text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to coordinate perfect dinner parties, all in one delightful place.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 rounded-xl bg-cream-50 hover:bg-coral-50 transition-colors card-hover doodle-border"
              >
                <div className="w-16 h-16 bg-coral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={feature.icon} className="w-8 h-8 text-coral-500" />
                </div>
                <h3 className="font-poppins text-xl font-semibold text-charcoal-500 mb-2">{feature.title}</h3>
                <p className="font-inter text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-poppins text-3xl md:text-4xl font-bold text-charcoal-500 mb-4">
              How It Works
            </h2>
            <p className="font-inter text-xl text-gray-600">
              Three simple steps to your perfect dinner party
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Create Your Event',
                description: 'Choose a theme, set the date, and get curated dish suggestions for your dinner.',
                icon: FiPlus
              },
              {
                step: '2',
                title: 'Invite Friends',
                description: 'Share your unique event code and watch as guests join and claim their dishes.',
                icon: FiUsers
              },
              {
                step: '3',
                title: 'Enjoy Your Party',
                description: 'Everything is coordinated perfectly. Just focus on having a great time!',
                icon: FiStar
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-coral-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SafeIcon icon={step.icon} className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-golden-500 rounded-full flex items-center justify-center text-charcoal-500 font-poppins font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="font-poppins text-xl font-semibold text-charcoal-500 mb-2">{step.title}</h3>
                <p className="font-inter text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-coral-500 to-peach-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-poppins text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Host Your Next Dinner Party?
            </h2>
            <p className="font-inter text-xl text-white/90 mb-8">
              Join thousands of hosts who've simplified their dinner planning with DinnerDoodle.
            </p>
            {!user && (
              <button
                onClick={() => {
                  setAuthMode('register');
                  setShowAuthModal(true);
                }}
                className="inline-flex items-center px-8 py-4 bg-white text-coral-600 rounded-xl font-poppins font-semibold hover:bg-cream-100 transition-all transform hover:scale-105 shadow-lg"
              >
                Start Planning Today
                <SafeIcon icon={FiArrowRight} className="w-5 h-5 ml-2" />
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-8 max-w-md w-full"
          >
            <h2 className="font-poppins text-2xl font-bold text-charcoal-500 mb-6">
              {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block font-inter text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-lightgray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
                  />
                </div>
              )}
              
              <div>
                <label className="block font-inter text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-lightgray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
                />
              </div>
              
              <div>
                <label className="block font-inter text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-3 border border-lightgray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-coral-500 text-white py-3 rounded-lg hover:bg-coral-600 transition-colors font-poppins font-medium"
                >
                  {authMode === 'login' ? 'Sign In' : 'Create Account'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="flex-1 border border-lightgray-500 text-gray-700 py-3 rounded-lg hover:bg-cream-50 transition-colors font-poppins"
                >
                  Cancel
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-coral-600 hover:text-coral-700 text-sm font-inter"
              >
                {authMode === 'login' 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Home;