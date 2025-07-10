import React from 'react';
import { motion } from 'framer-motion';

const ThemeCard = ({ theme, selected, onSelect, className = '' }) => {
  return (
    <motion.div
      className={`relative p-6 rounded-xl cursor-pointer transition-all duration-300 
      ${selected 
        ? 'ring-2 ring-coral-500 bg-white shadow-lg scale-105' 
        : 'bg-white hover:shadow-md hover:scale-102'
      } ${className}`}
      onClick={() => onSelect(theme)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div 
        className={`absolute inset-0 rounded-xl bg-gradient-to-br ${theme.gradient} opacity-10`} 
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-4xl animate-doodle">{theme.icon}</span>
          {selected && (
            <div className="w-6 h-6 bg-coral-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">✓</span>
            </div>
          )}
        </div>
        <h3 className="text-xl font-poppins font-bold text-charcoal-800 mb-2">{theme.name}</h3>
        <p className="text-gray-600 font-inter text-sm mb-4">
          {theme.dishes.length} suggested dishes
        </p>
        <div className="flex flex-wrap gap-2">
          {theme.dishes.slice(0, 3).map((dish, index) => (
            <span key={index} className="px-2 py-1 bg-cream-100 text-gray-600 text-xs rounded-full font-inter">
              {dish.name}
            </span>
          ))}
          {theme.dishes.length > 3 && (
            <span className="px-2 py-1 bg-cream-100 text-gray-600 text-xs rounded-full font-inter">
              +{theme.dishes.length - 3} more
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ThemeCard;