import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCalendar, FiUsers, FiShare2, FiMessageSquare, FiTemplate, FiShield, FiStar, FiCheck, FiArrowRight } = FiIcons;

const Features = () => {
  const features = [
    {
      icon: FiCalendar,
      title: 'Easy Event Planning',
      description: 'Create dinner parties in minutes with our intuitive step-by-step process.',
      details: [
        'Quick event setup with date, time, and location',
        'Theme selection with pre-built dish suggestions',
        'Custom event descriptions and details',
        'Flexible guest limits and RSVP management'
      ],
      color: 'coral'
    },
    {
      icon: FiUsers,
      title: 'Smart Guest Management',
      description: 'Keep track of who\'s coming and what they\'re bringing with ease.',
      details: [
        'Automatic RSVP tracking with status updates',
        'Guest contact information management',
        'Dish assignment and coordination',
        'Real-time guest list updates'
      ],
      color: 'sage'
    },
    {
      icon: FiShare2,
      title: 'Simple Sharing',
      description: 'Share your events effortlessly with unique invite codes.',
      details: [
        'Unique event codes for easy joining',
        'One-click invite sharing',
        'Social media integration',
        'Email and text sharing options'
      ],
      color: 'golden'
    },
    {
      icon: FiMessageSquare,
      title: 'Event Chat',
      description: 'Coordinate with your guests through built-in messaging.',
      details: [
        'Real-time group chat for all attendees',
        'Private messaging with the host',
        'Event updates and announcements',
        'Mobile-friendly chat interface'
      ],
      color: 'peach',
      premium: true
    },
    {
      icon: FiTemplate,
      title: 'Template System',
      description: 'Save and reuse your favorite event configurations.',
      details: [
        'Save events as reusable templates',
        'Share templates with the community',
        'Browse popular template library',
        'Quick event creation from templates'
      ],
      color: 'mint',
      premium: true
    },
    {
      icon: FiShield,
      title: 'Privacy & Security',
      description: 'Your events and data are secure and private.',
      details: [
        'End-to-end encrypted communications',
        'Private event options',
        'Secure data storage',
        'GDPR compliant privacy controls'
      ],
      color: 'charcoal'
    }
  ];

  const useCases = [
    {
      title: 'Family Gatherings',
      description: 'Organize holiday dinners, birthday celebrations, and family reunions with ease.',
      icon: '👨‍👩‍👧‍👦',
      example: 'Thanksgiving dinner with 15 family members, coordinating traditional dishes and dietary restrictions.'
    },
    {
      title: 'Friend Potlucks',
      description: 'Plan casual get-togethers where everyone contributes a dish.',
      icon: '🍕',
      example: 'Game night potluck with friends, organizing snacks, drinks, and main dishes.'
    },
    {
      title: 'Corporate Events',
      description: 'Coordinate office parties, team dinners, and company celebrations.',
      icon: '🏢',
      example: 'Office holiday party with catering coordination and dietary preference tracking.'
    },
    {
      title: 'Special Occasions',
      description: 'Make anniversaries, graduations, and milestones memorable.',
      icon: '🎉',
      example: 'Wedding anniversary dinner with close friends, themed menu planning.'
    }
  ];

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-coral-500 to-sage-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Everything You Need to Plan
              <span className="block text-golden-300">Perfect Dinner Parties</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              From initial planning to the final toast, DinnerDoodle provides all the tools 
              you need to create memorable dining experiences with friends and family.
            </p>
            <Link
              to="/create"
              className="inline-flex items-center px-8 py-4 bg-white text-coral-600 rounded-xl font-semibold hover:bg-cream-100 transition-all transform hover:-translate-y-1 shadow-lg"
            >
              Start Planning Free
              <SafeIcon icon={FiArrowRight} className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal-800 mb-4">
              Powerful Features for Perfect Events
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive suite of tools makes dinner party planning effortless and enjoyable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden"
              >
                {feature.premium && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-golden-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Premium
                    </span>
                  </div>
                )}
                
                <div className={`w-12 h-12 bg-${feature.color}-500 rounded-lg flex items-center justify-center mb-6`}>
                  <SafeIcon icon={feature.icon} className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-charcoal-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <SafeIcon icon={FiCheck} className="w-4 h-4 text-sage-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{detail}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal-800 mb-4">
              Perfect for Every Occasion
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether it's an intimate dinner or a large celebration, DinnerDoodle adapts to your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-cream-50 rounded-xl p-8"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="text-4xl">{useCase.icon}</div>
                  <h3 className="text-2xl font-bold text-charcoal-800">{useCase.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{useCase.description}</p>
                <div className="bg-white p-4 rounded-lg border-l-4 border-coral-500">
                  <p className="text-sm text-gray-600 italic">Example: {useCase.example}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal-800 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in just three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Create Your Event',
                description: 'Set up your dinner party with date, time, location, and theme selection.',
                icon: FiCalendar
              },
              {
                step: '2',
                title: 'Invite Your Guests',
                description: 'Share your unique event code with friends and family to join.',
                icon: FiShare2
              },
              {
                step: '3',
                title: 'Coordinate & Enjoy',
                description: 'Track RSVPs, assign dishes, and chat with guests before the big day.',
                icon: FiUsers
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
                  <div className="w-16 h-16 bg-coral-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SafeIcon icon={step.icon} className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-golden-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{step.step}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-charcoal-800 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-sage-500 to-mint-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Plan Your Next Dinner Party?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of hosts who trust DinnerDoodle for their events.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/create"
                className="px-8 py-4 bg-white text-sage-600 rounded-xl font-semibold hover:bg-cream-100 transition-all transform hover:-translate-y-1 shadow-lg"
              >
                Start Planning Free
              </Link>
              <Link
                to="/pricing"
                className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-sage-600 transition-all"
              >
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Features;