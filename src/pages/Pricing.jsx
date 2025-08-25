import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheck, FiX, FiStar, FiArrowRight, FiZap, FiHeart } = FiIcons;

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for getting started with basic dinner planning',
      price: 0,
      period: 'forever',
      color: 'sage',
      popular: false,
      features: [
        'Create unlimited events',
        'Basic guest management',
        'Simple RSVP tracking',
        'Basic dish coordination',
        'Event sharing with codes',
        'Mobile-friendly interface',
        'Email support'
      ],
      limitations: [
        'No event chat',
        'No template system',
        'No private messaging',
        'Basic themes only',
        'No analytics'
      ],
      cta: 'Get Started Free',
      link: '/create'
    },
    {
      name: 'Premium',
      description: 'Everything you need for professional event planning',
      price: isAnnual ? 39.99 : 3.99,
      period: isAnnual ? 'year' : 'month',
      color: 'coral',
      popular: true,
      features: [
        'Everything in Free',
        'Real-time event chat',
        'Private messaging with host',
        'Template system',
        'Save & share templates',
        'Premium themes',
        'Custom themes',
        'Advanced analytics',
        'Priority support',
        'Export guest lists',
        'Dietary restriction tracking',
        'Recipe suggestions'
      ],
      limitations: [],
      cta: 'Start Premium Trial',
      link: '/create',
      savings: isAnnual ? 'Save $8/year' : null
    }
  ];

  const faqs = [
    {
      question: 'Is DinnerDoodle really free?',
      answer: 'Yes! Our free plan includes all the basic features you need to plan dinner parties. You can create unlimited events, manage guests, and coordinate dishes without paying anything.'
    },
    {
      question: 'What happens after the beta period?',
      answer: 'Currently, all features are free during our beta testing phase. After beta, basic features will remain free forever, while premium features like chat and templates will require a subscription.'
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Absolutely! You can cancel your premium subscription at any time. Your premium features will remain active until the end of your billing period.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied with Premium, contact us within 30 days for a full refund.'
    },
    {
      question: 'How many guests can I invite?',
      answer: 'Both Free and Premium plans support unlimited guests. You can set custom limits for each event based on your venue capacity.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes! We take security seriously. All data is encrypted in transit and at rest. We\'re GDPR compliant and never sell your personal information.'
    }
  ];

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-coral-500 to-peach-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Start free and upgrade when you need more powerful features
            </p>
            
            {/* Beta Notice */}
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <SafeIcon icon={FiStar} className="w-5 h-5 text-golden-300" />
                <span className="text-white font-semibold">Beta Special</span>
                <SafeIcon icon={FiStar} className="w-5 h-5 text-golden-300" />
              </div>
              <p className="text-white/90">
                All features are currently <strong>free</strong> during our beta testing period!
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Billing Toggle */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-4">
            <span className={`font-medium ${!isAnnual ? 'text-charcoal-800' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual ? 'bg-coral-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`font-medium ${isAnnual ? 'text-charcoal-800' : 'text-gray-500'}`}>
              Annual
            </span>
            {isAnnual && (
              <span className="bg-golden-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Save 17%
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
                  plan.popular ? 'ring-2 ring-coral-500 transform scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-coral-500 text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <div className={`p-8 ${plan.popular ? 'pt-12' : ''}`}>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-charcoal-800 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-charcoal-800">
                        ${plan.price}
                      </span>
                      <span className="text-gray-600">/{plan.period}</span>
                      {plan.savings && (
                        <div className="text-green-600 text-sm font-medium mt-1">
                          {plan.savings}
                        </div>
                      )}
                    </div>
                    
                    <Link
                      to={plan.link}
                      className={`w-full px-6 py-3 rounded-xl font-semibold transition-all inline-flex items-center justify-center ${
                        plan.popular
                          ? 'bg-coral-500 text-white hover:bg-coral-600'
                          : 'bg-sage-500 text-white hover:bg-sage-600'
                      }`}
                    >
                      {plan.cta}
                      <SafeIcon icon={FiArrowRight} className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-charcoal-800 flex items-center">
                      <SafeIcon icon={FiCheck} className="w-5 h-5 text-sage-500 mr-2" />
                      What's included:
                    </h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <SafeIcon icon={FiCheck} className="w-4 h-4 text-sage-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {plan.limitations.length > 0 && (
                      <>
                        <h4 className="font-semibold text-charcoal-800 flex items-center mt-6">
                          <SafeIcon icon={FiX} className="w-5 h-5 text-gray-400 mr-2" />
                          Not included:
                        </h4>
                        <ul className="space-y-3">
                          {plan.limitations.map((limitation, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <SafeIcon icon={FiX} className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-500 text-sm">{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal-800 mb-4">
              Compare Plans
            </h2>
            <p className="text-xl text-gray-600">
              See exactly what's included in each plan
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-6">Features</th>
                  <th className="text-center py-4 px-6">Free</th>
                  <th className="text-center py-4 px-6">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  ['Event Creation', true, true],
                  ['Guest Management', true, true],
                  ['RSVP Tracking', true, true],
                  ['Basic Themes', true, true],
                  ['Event Chat', false, true],
                  ['Template System', false, true],
                  ['Custom Themes', false, true],
                  ['Analytics', false, true],
                  ['Priority Support', false, true]
                ].map(([feature, free, premium], index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium text-charcoal-800">{feature}</td>
                    <td className="py-4 px-6 text-center">
                      {free ? (
                        <SafeIcon icon={FiCheck} className="w-5 h-5 text-sage-500 mx-auto" />
                      ) : (
                        <SafeIcon icon={FiX} className="w-5 h-5 text-gray-400 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {premium ? (
                        <SafeIcon icon={FiCheck} className="w-5 h-5 text-sage-500 mx-auto" />
                      ) : (
                        <SafeIcon icon={FiX} className="w-5 h-5 text-gray-400 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal-800 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-charcoal-800 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
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
              Ready to Start Planning?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of hosts who trust DinnerDoodle for their events.
            </p>
            <Link
              to="/create"
              className="inline-flex items-center px-8 py-4 bg-white text-sage-600 rounded-xl font-semibold hover:bg-cream-100 transition-all transform hover:-translate-y-1 shadow-lg"
            >
              <SafeIcon icon={FiHeart} className="mr-2 w-5 h-5" />
              Start Planning Free
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;