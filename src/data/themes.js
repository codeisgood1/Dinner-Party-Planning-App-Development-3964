export const themes = {
  italian: {
    id: 'italian',
    name: 'Italian Night',
    icon: '🍝',
    colors: {
      primary: '#FF6B6B',
      secondary: '#4ECDC4',
      accent: '#FFE66D'
    },
    gradient: 'from-coral-500 to-sage-500',
    dishes: [
      { category: 'appetizers', name: 'Antipasto Platter', description: 'Cured meats, cheeses, olives' },
      { category: 'appetizers', name: 'Bruschetta', description: 'Toasted bread with toppings' },
      { category: 'appetizers', name: 'Caprese Salad', description: 'Fresh mozzarella, tomatoes, basil' },
      { category: 'mains', name: 'Pasta Primavera', description: 'Seasonal vegetables with pasta' },
      { category: 'mains', name: 'Chicken Parmigiana', description: 'Breaded chicken with marinara' },
      { category: 'mains', name: 'Lasagna', description: 'Layered pasta with meat sauce' },
      { category: 'sides', name: 'Garlic Bread', description: 'Crusty bread with garlic butter' },
      { category: 'sides', name: 'Caesar Salad', description: 'Romaine with parmesan and croutons' },
      { category: 'desserts', name: 'Tiramisu', description: 'Coffee-flavored dessert' },
      { category: 'desserts', name: 'Gelato', description: 'Italian ice cream' },
      { category: 'drinks', name: 'Chianti Wine', description: 'Italian red wine' },
      { category: 'drinks', name: 'Limoncello', description: 'Lemon liqueur' }
    ]
  },
  mexican: {
    id: 'mexican',
    name: 'Mexican Fiesta',
    icon: '🌮',
    colors: {
      primary: '#FF8E53',
      secondary: '#4ECDC4',
      accent: '#FFE66D'
    },
    gradient: 'from-peach-500 to-coral-500',
    dishes: [
      { category: 'appetizers', name: 'Guacamole & Chips', description: 'Fresh avocado dip with tortilla chips' },
      { category: 'appetizers', name: 'Salsa Trio', description: 'Mild, medium, and hot salsas' },
      { category: 'appetizers', name: 'Queso Dip', description: 'Melted cheese dip' },
      { category: 'mains', name: 'Taco Bar', description: 'Soft and hard tacos with fixings' },
      { category: 'mains', name: 'Enchiladas', description: 'Rolled tortillas with sauce' },
      { category: 'mains', name: 'Fajitas', description: 'Sizzling meat and vegetables' },
      { category: 'sides', name: 'Mexican Rice', description: 'Seasoned rice with tomatoes' },
      { category: 'sides', name: 'Refried Beans', description: 'Creamy seasoned beans' },
      { category: 'desserts', name: 'Churros', description: 'Fried dough with cinnamon sugar' },
      { category: 'desserts', name: 'Tres Leches Cake', description: 'Three milk cake' },
      { category: 'drinks', name: 'Margaritas', description: 'Tequila-based cocktails' },
      { category: 'drinks', name: 'Horchata', description: 'Sweet rice drink' }
    ]
  },
  bbq: {
    id: 'bbq',
    name: 'BBQ Cookout',
    icon: '🔥',
    colors: {
      primary: '#FF8E53',
      secondary: '#FF6B6B',
      accent: '#FFE66D'
    },
    gradient: 'from-golden-500 to-peach-600',
    dishes: [
      { category: 'appetizers', name: 'Buffalo Wings', description: 'Spicy chicken wings' },
      { category: 'appetizers', name: 'Deviled Eggs', description: 'Classic appetizer' },
      { category: 'appetizers', name: 'Bacon-Wrapped Jalapeños', description: 'Spicy stuffed peppers' },
      { category: 'mains', name: 'BBQ Ribs', description: 'Slow-cooked pork ribs' },
      { category: 'mains', name: 'Pulled Pork', description: 'Shredded BBQ pork' },
      { category: 'mains', name: 'Grilled Burgers', description: 'Classic hamburgers' },
      { category: 'sides', name: 'Coleslaw', description: 'Creamy cabbage salad' },
      { category: 'sides', name: 'Baked Beans', description: 'Sweet and savory beans' },
      { category: 'sides', name: 'Corn on the Cob', description: 'Grilled corn with butter' },
      { category: 'desserts', name: 'Peach Cobbler', description: 'Warm fruit dessert' },
      { category: 'desserts', name: 'S\'mores', description: 'Campfire classic' },
      { category: 'drinks', name: 'Craft Beer', description: 'Local brewery selections' },
      { category: 'drinks', name: 'Sweet Tea', description: 'Southern-style iced tea' }
    ]
  },
  holiday: {
    id: 'holiday',
    name: 'Holiday Feast',
    icon: '🎄',
    colors: {
      primary: '#FF6B6B',
      secondary: '#4ECDC4',
      accent: '#FFE66D'
    },
    gradient: 'from-coral-600 to-sage-600',
    dishes: [
      { category: 'appetizers', name: 'Shrimp Cocktail', description: 'Chilled shrimp with cocktail sauce' },
      { category: 'appetizers', name: 'Cheese Board', description: 'Assorted cheeses and crackers' },
      { category: 'appetizers', name: 'Stuffed Mushrooms', description: 'Savory stuffed caps' },
      { category: 'mains', name: 'Roasted Turkey', description: 'Traditional holiday centerpiece' },
      { category: 'mains', name: 'Honey Ham', description: 'Glazed spiral-cut ham' },
      { category: 'mains', name: 'Prime Rib', description: 'Slow-roasted beef' },
      { category: 'sides', name: 'Mashed Potatoes', description: 'Creamy whipped potatoes' },
      { category: 'sides', name: 'Green Bean Casserole', description: 'Classic holiday side' },
      { category: 'sides', name: 'Cranberry Sauce', description: 'Tart-sweet condiment' },
      { category: 'desserts', name: 'Pumpkin Pie', description: 'Spiced custard pie' },
      { category: 'desserts', name: 'Apple Crisp', description: 'Warm spiced apples' },
      { category: 'drinks', name: 'Mulled Wine', description: 'Spiced warm wine' },
      { category: 'drinks', name: 'Eggnog', description: 'Creamy holiday drink' }
    ]
  },
  asian: {
    id: 'asian',
    name: 'Asian Fusion',
    icon: '🥢',
    colors: {
      primary: '#FF6B6B',
      secondary: '#FFE66D',
      accent: '#4ECDC4'
    },
    gradient: 'from-coral-500 to-golden-500',
    dishes: [
      { category: 'appetizers', name: 'Spring Rolls', description: 'Fresh or fried vegetable rolls' },
      { category: 'appetizers', name: 'Pot Stickers', description: 'Pan-fried dumplings' },
      { category: 'appetizers', name: 'Edamame', description: 'Steamed soybeans' },
      { category: 'mains', name: 'Pad Thai', description: 'Stir-fried rice noodles' },
      { category: 'mains', name: 'General Tso\'s Chicken', description: 'Sweet and spicy chicken' },
      { category: 'mains', name: 'Beef Teriyaki', description: 'Glazed grilled beef' },
      { category: 'sides', name: 'Fried Rice', description: 'Wok-fried rice with vegetables' },
      { category: 'sides', name: 'Lo Mein', description: 'Soft noodles with sauce' },
      { category: 'desserts', name: 'Mochi Ice Cream', description: 'Sweet rice cake dessert' },
      { category: 'desserts', name: 'Fortune Cookies', description: 'Crispy cookies with messages' },
      { category: 'drinks', name: 'Sake', description: 'Japanese rice wine' },
      { category: 'drinks', name: 'Green Tea', description: 'Traditional hot tea' }
    ]
  },
  mediterranean: {
    id: 'mediterranean',
    name: 'Mediterranean',
    icon: '🫒',
    colors: {
      primary: '#4ECDC4',
      secondary: '#4ECDC4',
      accent: '#FFE66D'
    },
    gradient: 'from-sage-500 to-mint-500',
    dishes: [
      { category: 'appetizers', name: 'Hummus & Pita', description: 'Chickpea dip with bread' },
      { category: 'appetizers', name: 'Olives & Feta', description: 'Marinated olives with cheese' },
      { category: 'appetizers', name: 'Dolmas', description: 'Stuffed grape leaves' },
      { category: 'mains', name: 'Grilled Lamb', description: 'Herb-crusted lamb chops' },
      { category: 'mains', name: 'Chicken Souvlaki', description: 'Grilled chicken skewers' },
      { category: 'mains', name: 'Seafood Paella', description: 'Spanish rice dish' },
      { category: 'sides', name: 'Greek Salad', description: 'Fresh vegetables with feta' },
      { category: 'sides', name: 'Roasted Vegetables', description: 'Seasonal Mediterranean vegetables' },
      { category: 'desserts', name: 'Baklava', description: 'Layered phyllo with nuts' },
      { category: 'desserts', name: 'Tiramisu', description: 'Coffee-flavored dessert' },
      { category: 'drinks', name: 'Sangria', description: 'Spanish wine punch' },
      { category: 'drinks', name: 'Ouzo', description: 'Greek anise-flavored spirit' }
    ]
  }
};

export const getRandomTheme = () => {
  const themeKeys = Object.keys(themes);
  const randomKey = themeKeys[Math.floor(Math.random() * themeKeys.length)];
  return themes[randomKey];
};

export const getThemeById = (id) => {
  return themes[id] || themes.italian;
};

export const getDishCategories = () => {
  return [
    { id: 'appetizers', name: 'Appetizers', icon: '🥗' },
    { id: 'mains', name: 'Main Dishes', icon: '🍽️' },
    { id: 'sides', name: 'Side Dishes', icon: '🥘' },
    { id: 'desserts', name: 'Desserts', icon: '🍰' },
    { id: 'drinks', name: 'Drinks', icon: '🥤' }
  ];
};