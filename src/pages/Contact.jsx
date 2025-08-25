import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiMail, FiMessageSquare, FiSend, FiPhone, FiMapPin, FiTwitter, FiFacebook, FiInstagram, FiUser } = FiIcons;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Here you would typically send the form data to your backend
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      toast.success('Message sent successfully!');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl font-bold text-charcoal-800 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Get in Touch
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Have questions about DinnerDoodle? We'd love to hear from you!
          </motion.p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:outline-none"
                    placeholder="Enter your name"
                    required
                  />
                  <SafeIcon icon={FiUser} className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:outline-none"
                    placeholder="Enter your email"
                    required
                  />
                  <SafeIcon icon={FiMail} className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input 
                  type="text" 
                  value={formData.subject} 
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:outline-none"
                  placeholder="What's this about?"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea 
                  value={formData.message} 
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows="5" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:outline-none"
                  placeholder="Tell us what's on your mind..."
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full px-6 py-3 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors flex items-center justify-center disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <SafeIcon icon={FiSend} className="w-5 h-5 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>
          
          {/* Contact Information */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-600">
                Our team is here to help answer any questions you might have about DinnerDoodle. Feel free to reach out through any of the methods below.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-coral-100 rounded-lg">
                  <SafeIcon icon={FiMail} className="w-6 h-6 text-coral-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600">support@dinnerdoodle.com</p>
                  <p className="text-sm text-gray-500 mt-1">We aim to respond within 24 hours</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-sage-100 rounded-lg">
                  <SafeIcon icon={FiMessageSquare} className="w-6 h-6 text-sage-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Live Chat</h3>
                  <p className="text-gray-600">Available Monday to Friday</p>
                  <p className="text-sm text-gray-500 mt-1">9:00 AM - 6:00 PM ET</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-golden-100 rounded-lg">
                  <SafeIcon icon={FiPhone} className="w-6 h-6 text-golden-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Phone</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                  <p className="text-sm text-gray-500 mt-1">Monday to Friday, 9:00 AM - 6:00 PM ET</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-peach-100 rounded-lg">
                  <SafeIcon icon={FiMapPin} className="w-6 h-6 text-peach-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Office</h3>
                  <p className="text-gray-600">123 Party Street</p>
                  <p className="text-gray-600">Suite 100</p>
                  <p className="text-gray-600">San Francisco, CA 94107</p>
                </div>
              </div>
            </div>
            
            <div className="bg-cream-100 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Connect With Us</h3>
              <p className="text-gray-600">
                Follow us on social media for the latest updates, tips, and inspiration for your next dinner party.
              </p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="p-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <SafeIcon icon={FiTwitter} className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors">
                  <span className="sr-only">Facebook</span>
                  <SafeIcon icon={FiFacebook} className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors">
                  <span className="sr-only">Instagram</span>
                  <SafeIcon icon={FiInstagram} className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Frequently Asked Questions</h3>
              <p className="text-gray-600 mb-4">
                Can't find what you're looking for? Check our <a href="/how-it-works" className="text-coral-500 hover:text-coral-600">How It Works</a> page or <a href="/help" className="text-coral-500 hover:text-coral-600">Help Center</a>.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;