import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiPlus, FiArrowRight, FiCalendar, FiUsers, FiShare2, FiCheck, FiMail, FiLock, FiCode, FiX, FiUser } = FiIcons;

const Home = () => {
  const { user, register, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [joinCode, setJoinCode] = useState('');
  const [authMode, setAuthMode] = useState('register');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('auth')) {
      setAuthMode(params.get('auth'));
      setShowAuthModal(true);
    }
  }, [location]);

  const handleGetStarted = () => {
    if (user) {
      navigate('/create');
    } else {
      setAuthMode('register');
      setShowAuthModal(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (authMode === 'register') {
        await register(formData);
      } else {
        await login(formData);
      }
      setShowAuthModal(false);
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinEvent = (e) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      toast.error('Please enter an event code');
      return;
    }
    navigate(`/join/${joinCode.trim()}`);
  };

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative z-10"
            >
              <h1 className="font-poppins font-bold text-4xl md:text-5xl lg:text-6xl text-charcoal-800 mb-6 leading-tight">
                Make Dinner Plans <span className="text-coral-500">Together</span>
              </h1>
              <p className="font-inter text-xl text-gray-600 mb-8 max-w-lg">
                Coordinate dishes, manage guests, and create memorable dining experiences with ease.
                No more confusion about who's bringing what!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  onClick={handleGetStarted}
                  className="px-8 py-4 bg-coral-500 text-white rounded-xl font-poppins font-semibold hover:bg-coral-600 transition-all transform hover:-translate-y-1 shadow-lg flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {user ? (
                    <>
                      <SafeIcon icon={FiPlus} className="w-5 h-5 mr-2" />
                      Create Event
                    </>
                  ) : (
                    <>
                      Get Started Free
                      <SafeIcon icon={FiArrowRight} className="w-5 h-5 ml-2" />
                    </>
                  )}
                </motion.button>
                {!user && (
                  <motion.button
                    onClick={() => {
                      setAuthMode('login');
                      setShowAuthModal(true);
                    }}
                    className="px-8 py-4 bg-white border-2 border-coral-300 text-coral-600 rounded-xl font-poppins font-semibold hover:bg-coral-50 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign In
                  </motion.button>
                )}
              </div>
            </motion.div>

            {/* Right Column - Join Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative z-10"
            >
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-charcoal-800 mb-6">
                  Join an Event
                </h2>
                <form onSubmit={handleJoinEvent} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Have an invite code?
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        placeholder="Enter event code"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:outline-none"
                      />
                      <SafeIcon
                        icon={FiCode}
                        className="absolute left-3 top-3.5 text-gray-400 w-5 h-5"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors flex items-center justify-center"
                  >
                    <SafeIcon icon={FiArrowRight} className="w-5 h-5 mr-2" />
                    Join Event
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-charcoal-800 mb-4">
              Why Choose DinnerDoodle?
            </h2>
            <p className="text-xl text-gray-600">
              Make planning dinner parties a breeze
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FiCalendar,
                title: 'Easy Planning',
                description: 'Create and manage events with just a few clicks',
              },
              {
                icon: FiUsers,
                title: 'Guest Management',
                description: 'Keep track of RSVPs and dish assignments effortlessly',
              },
              {
                icon: FiShare2,
                title: 'Simple Sharing',
                description: 'Share event details using unique invite codes',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 bg-cream-50 rounded-xl text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-coral-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={feature.icon} className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-charcoal-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-charcoal-800">
                  {authMode === 'register' ? 'Create Account' : 'Welcome Back'}
                </h2>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <SafeIcon icon={FiX} className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {authMode === 'register' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:outline-none"
                        placeholder="Enter your full name"
                        required
                      />
                      <SafeIcon
                        icon={FiUser}
                        className="absolute left-3 top-2.5 text-gray-400 w-5 h-5"
                      />
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:outline-none"
                      placeholder="Enter your email"
                      required
                    />
                    <SafeIcon
                      icon={FiMail}
                      className="absolute left-3 top-2.5 text-gray-400 w-5 h-5"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:outline-none"
                      placeholder="Enter your password"
                      required
                    />
                    <SafeIcon
                      icon={FiLock}
                      className="absolute left-3 top-2.5 text-gray-400 w-5 h-5"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="animate-spin mr-2">⏳</span>
                  ) : (
                    <SafeIcon icon={FiCheck} className="w-5 h-5 mr-2" />
                  )}
                  {authMode === 'register'
                    ? isLoading
                      ? 'Creating Account...'
                      : 'Create Account'
                    : isLoading
                    ? 'Signing In...'
                    : 'Sign In'}
                </button>
              </form>
              <div className="mt-4 text-center">
                <button
                  onClick={() =>
                    setAuthMode(authMode === 'register' ? 'login' : 'register')
                  }
                  className="text-coral-600 hover:text-coral-700 text-sm"
                >
                  {authMode === 'register'
                    ? 'Already have an account? Sign in'
                    : "Don't have an account? Create one"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;