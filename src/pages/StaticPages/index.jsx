import React from 'react';
import { motion } from 'framer-motion';

// Common layout for static pages
const StaticPageLayout = ({ title, children }) => (
  <div className="max-w-4xl mx-auto px-4 py-12">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-8"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{title}</h1>
      <div className="prose prose-lg max-w-none">
        {children}
      </div>
    </motion.div>
  </div>
);

// Export all static pages as components
export const Privacy = () => (
  <StaticPageLayout title="Privacy Policy">
    {/* Privacy content */}
  </StaticPageLayout>
);

export const Terms = () => (
  <StaticPageLayout title="Terms of Service">
    {/* Terms content */}
  </StaticPageLayout>
);

export const Contact = () => (
  <StaticPageLayout title="Contact Us">
    {/* Contact content */}
  </StaticPageLayout>
);