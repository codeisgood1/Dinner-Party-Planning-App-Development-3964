import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCalendar, FiUsers, FiShare2, FiMessageSquare, FiClipboard, FiCheckCircle, FiAlertCircle, FiArrowRight } = FiIcons;

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-coral-500 to-sage-500">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How DinnerDoodle Works
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              A simple guide to planning and coordinating your next dinner party with ease
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Step by Step Guide */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Getting Started</h2>
            
            <div className="space-y-16">
              {/* Step 1 */}
              <motion.div 
                className="grid md:grid-cols-2 gap-8 items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="order-2 md:order-1">
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="inline-block bg-coral-100 text-coral-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                      Step 1
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Create Your Event</h3>
                    <p className="text-gray-600 mb-4">
                      Start by creating a new event. Enter basic details like the event name, date, time, location, and maximum number of guests. This information helps your guests know what to expect.
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start space-x-2">
                        <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-sage-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">Choose from various dinner party themes</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-sage-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">Get dish suggestions based on your theme</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-sage-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">Create a custom theme with your own icon</span>
                      </li>
                    </ul>
                    <Link 
                      to="/create" 
                      className="inline-flex items-center text-coral-600 hover:text-coral-700 font-medium"
                    >
                      Create your first event
                      <SafeIcon icon={FiArrowRight} className="ml-1 w-4 h-4" />
                    </Link>
                  </div>
                </div>
                <div className="order-1 md:order-2 bg-white rounded-xl p-6 shadow-sm">
                  <img 
                    src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" 
                    alt="Friends planning a dinner party" 
                    className="w-full h-64 object-cover rounded-lg" 
                  />
                </div>
              </motion.div>
              
              {/* Step 2 */}
              <motion.div 
                className="grid md:grid-cols-2 gap-8 items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div>
                  <img 
                    src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1769&q=80" 
                    alt="People sharing invitation" 
                    className="w-full h-64 object-cover rounded-lg" 
                  />
                </div>
                <div>
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="inline-block bg-sage-100 text-sage-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                      Step 2
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Invite Your Guests</h3>
                    <p className="text-gray-600 mb-4">
                      Share your unique event code with friends and family. They can join your event by entering the code on DinnerDoodle. Alternatively, you can manually add guests with their email addresses.
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start space-x-2">
                        <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-sage-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">Each event has a unique 6-character code</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-sage-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">One-click sharing via email or messaging apps</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-sage-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">Track RSVPs automatically</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
              
              {/* Step 3 */}
              <motion.div 
                className="grid md:grid-cols-2 gap-8 items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="order-2 md:order-1">
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="inline-block bg-golden-100 text-golden-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                      Step 3
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Coordinate Dishes</h3>
                    <p className="text-gray-600 mb-4">
                      No more confusion about who's bringing what! DinnerDoodle makes it easy to coordinate dishes and avoid duplicates. Guests can volunteer to bring specific dishes from your list or add their own.
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start space-x-2">
                        <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-sage-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">Organize dishes by category (appetizers, mains, desserts)</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-sage-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">Guests can claim dishes they want to bring</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-sage-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">Add custom dishes and dietary information</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <img 
                    src="https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" 
                    alt="Food dishes organized on table" 
                    className="w-full h-64 object-cover rounded-lg" 
                  />
                </div>
              </motion.div>
              
              {/* Step 4 */}
              <motion.div 
                className="grid md:grid-cols-2 gap-8 items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div>
                  <img 
                    src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1769&q=80" 
                    alt="People chatting at dinner party" 
                    className="w-full h-64 object-cover rounded-lg" 
                  />
                </div>
                <div>
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="inline-block bg-peach-100 text-peach-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                      Step 4
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Chat & Communicate</h3>
                    <p className="text-gray-600 mb-4">
                      Keep all your party communication in one place with our integrated chat feature. Discuss details, share updates, and keep everyone informed without creating separate group chats.
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start space-x-2">
                        <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-sage-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">Group chat for all attendees</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-sage-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">Private messages to the host</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-sage-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">Real-time updates and notifications</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Key Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Key Features</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: FiCalendar,
                  title: "Event Templates",
                  description: "Save your favorite event configurations as templates to quickly create similar events in the future."
                },
                {
                  icon: FiUsers,
                  title: "Guest Management",
                  description: "Track RSVPs, manage guest information, and organize who's bringing what to your dinner party."
                },
                {
                  icon: FiClipboard,
                  title: "Dish Coordination",
                  description: "Create and assign dishes by category, ensuring a well-balanced menu without duplicates."
                },
                {
                  icon: FiMessageSquare,
                  title: "Event Chat",
                  description: "Keep all communication in one place with our integrated chat system for hosts and guests."
                },
                {
                  icon: FiShare2,
                  title: "Easy Sharing",
                  description: "Share your event with a unique code that guests can use to join your dinner party."
                },
                {
                  icon: FiAlertCircle,
                  title: "Dietary Preferences",
                  description: "Track allergies and dietary preferences to ensure all guests can enjoy the meal."
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <div className="w-12 h-12 bg-coral-100 rounded-lg flex items-center justify-center mb-4">
                    <SafeIcon icon={feature.icon} className="w-6 h-6 text-coral-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {[
                {
                  question: "Is DinnerDoodle free to use?",
                  answer: "Yes! DinnerDoodle offers a free plan with all the core features you need to plan dinner parties. Premium features like event templates and advanced chat are available with our subscription plans."
                },
                {
                  question: "How many guests can I invite?",
                  answer: "There is no hard limit on the number of guests you can invite, but we recommend keeping your dinner parties to a manageable size based on your venue capacity. You can set a maximum guest count when creating your event."
                },
                {
                  question: "Can guests see who else is invited?",
                  answer: "Yes, guests can see who else has joined the event and their RSVP status. This helps with coordination and creates a sense of community before the event."
                },
                {
                  question: "How do I share my event with guests?",
                  answer: "Each event has a unique 6-character code that you can share with your guests. They can enter this code on the DinnerDoodle website to join your event. You can also send direct invitations via email."
                },
                {
                  question: "Can I edit an event after creating it?",
                  answer: "Yes, as the host you can edit all aspects of your event at any time. Guests will be notified of significant changes like date, time, or location updates."
                }
              ].map((faq, index) => (
                <motion.div 
                  key={index}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * index }}
                >
                  <details className="group">
                    <summary className="flex justify-between items-center font-medium cursor-pointer p-6">
                      <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                      <span className="transition group-open:rotate-180">
                        <svg fill="none" height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-6 pt-0 text-gray-600">
                      <p>{faq.answer}</p>
                    </div>
                  </details>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* CTA Section */}
          <motion.div 
            className="bg-gradient-to-br from-coral-500 to-sage-500 rounded-xl p-8 text-center text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Plan Your First Dinner Party?</h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Create your first event in minutes and discover how DinnerDoodle makes dinner party planning effortless and enjoyable.
            </p>
            <Link 
              to="/create" 
              className="inline-block px-8 py-4 bg-white text-coral-600 rounded-xl font-semibold hover:bg-cream-100 transition-all transform hover:-translate-y-1 shadow-lg"
            >
              Create Your First Event
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;