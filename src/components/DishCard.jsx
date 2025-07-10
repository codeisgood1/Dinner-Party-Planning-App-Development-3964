import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiEdit, FiTrash, FiCheck, FiUser } = FiIcons;

const categoryIcons = {
  appetizers: '🥗',
  mains: '🍽️',
  sides: '🥘',
  desserts: '🍰',
  drinks: '🥤'
};

const DishCard = ({ 
  dish, 
  assigned, 
  guest, 
  onAssign, 
  onUnassign, 
  canEdit = false,
  onEditDish,
  onDeleteDish 
}) => {
  return (
    <motion.div
      className={`p-4 rounded-lg border-2 transition-all duration-300 ${
        assigned 
          ? 'border-mint-300 bg-mint-50' 
          : 'border-lightgray-200 bg-white hover:border-coral-200'
      }`}
      whileHover={{ y: -2 }}
      layout
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{categoryIcons[dish.category] || '🍽️'}</span>
          <div>
            <h4 className="font-poppins font-semibold text-charcoal-800">{dish.name}</h4>
            <p className="text-sm font-inter text-gray-600">{dish.description}</p>
          </div>
        </div>
        {canEdit && (
          <div className="flex space-x-2">
            <button
              onClick={() => onEditDish(dish)}
              className="p-1 text-gray-500 hover:text-coral-600 transition-colors"
            >
              <SafeIcon icon={FiEdit} className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteDish(dish.id)}
              className="p-1 text-gray-500 hover:text-red-600 transition-colors"
            >
              <SafeIcon icon={FiTrash} className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {assigned && guest && (
        <div className="flex items-center space-x-2 text-sm font-inter text-sage-700 bg-sage-100 px-3 py-2 rounded-lg">
          <SafeIcon icon={FiUser} className="w-4 h-4" />
          <span>Assigned to {guest.name}</span>
        </div>
      )}

      {!assigned && (
        <button
          onClick={() => onAssign(dish.id)}
          className="w-full mt-3 px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors font-poppins font-medium"
        >
          Assign Dish
        </button>
      )}

      {assigned && (
        <div className="flex items-center space-x-2 mt-3">
          <SafeIcon icon={FiCheck} className="w-5 h-5 text-sage-500" />
          {canEdit && (
            <button
              onClick={() => onUnassign(dish.id)}
              className="text-coral-500 hover:text-coral-700 transition-colors text-sm"
            >
              Unassign
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default DishCard;