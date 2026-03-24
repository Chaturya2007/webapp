require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cafetranquil';

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Category.deleteMany({});
    await MenuItem.deleteMany({});
    console.log('Cleared existing data');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await User.create({
      name: 'Admin',
      email: 'admin@cafetranquil.com',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('Admin user created');

    const categoriesData = [
      { name: 'Coffee', icon: '☕', description: 'Freshly brewed coffees', order: 1 },
      { name: 'Tea', icon: '🍵', description: 'Soothing teas', order: 2 },
      { name: 'Snacks', icon: '🥪', description: 'Light bites', order: 3 },
      { name: 'Desserts', icon: '🍰', description: 'Sweet treats', order: 4 },
      { name: 'Combos', icon: '🍱', description: 'Value combos', order: 5 }
    ];

    const categories = await Category.insertMany(categoriesData);
    console.log('Categories created');

    const catMap = {};
    categories.forEach(c => { catMap[c.name] = c._id; });

    const menuItems = [
      // Coffee
      { name: 'Espresso', price: 120, description: 'Strong Italian-style espresso', category: catMap['Coffee'], isVeg: true, tags: ['hot', 'strong'] },
      { name: 'Cappuccino', price: 150, description: 'Classic Italian espresso with steamed milk foam', category: catMap['Coffee'], isVeg: true, tags: ['hot', 'creamy'] },
      { name: 'Cold Brew', price: 180, description: '12-hour cold-steeped coffee served over ice', category: catMap['Coffee'], isVeg: true, tags: ['cold', 'refreshing'] },
      { name: 'Café Latte', price: 160, description: 'Espresso with velvety steamed milk', category: catMap['Coffee'], isVeg: true, tags: ['hot', 'mild'] },
      { name: 'Mocha', price: 170, description: 'Chocolate-infused espresso with milk', category: catMap['Coffee'], isVeg: true, tags: ['hot', 'sweet'] },
      { name: 'Caramel Macchiato', price: 190, description: 'Vanilla-flavored latte with caramel drizzle', category: catMap['Coffee'], isVeg: true, tags: ['hot', 'sweet'] },
      { name: 'Affogato', price: 200, description: 'Vanilla ice cream drowned in hot espresso', category: catMap['Coffee'], isVeg: true, tags: ['cold', 'dessert'] },

      // Tea
      { name: 'Masala Chai', price: 80, description: 'Spiced Indian milk tea with ginger and cardamom', category: catMap['Tea'], isVeg: true, tags: ['hot', 'spicy'] },
      { name: 'Green Tea', price: 90, description: 'Fresh Japanese-style green tea', category: catMap['Tea'], isVeg: true, tags: ['hot', 'healthy'] },
      { name: 'Iced Lemon Tea', price: 100, description: 'Chilled black tea with fresh lemon', category: catMap['Tea'], isVeg: true, tags: ['cold', 'refreshing'] },
      { name: 'Chamomile Tea', price: 110, description: 'Calming herbal chamomile infusion', category: catMap['Tea'], isVeg: true, tags: ['hot', 'herbal', 'calming'] },
      { name: 'Earl Grey', price: 120, description: 'Classic black tea with bergamot', category: catMap['Tea'], isVeg: true, tags: ['hot', 'classic'] },
      { name: 'Matcha Latte', price: 160, description: 'Japanese matcha powder with steamed milk', category: catMap['Tea'], isVeg: true, tags: ['hot', 'healthy', 'creamy'] },

      // Snacks
      { name: 'Veg Sandwich', price: 120, description: 'Grilled sandwich with veggies and cheese', category: catMap['Snacks'], isVeg: true, tags: ['grilled', 'filling'] },
      { name: 'Chicken Club Sandwich', price: 180, description: 'Triple-layered sandwich with grilled chicken', category: catMap['Snacks'], isVeg: false, tags: ['grilled', 'filling'] },
      { name: 'Bruschetta', price: 130, description: 'Toasted bread with tomato, basil, and olive oil', category: catMap['Snacks'], isVeg: true, tags: ['light', 'italian'] },
      { name: 'Paneer Tikka Wrap', price: 160, description: 'Grilled paneer wrap with mint chutney', category: catMap['Snacks'], isVeg: true, tags: ['spicy', 'filling'] },
      { name: 'Chicken Wrap', price: 190, description: 'Grilled chicken with lettuce and sauce', category: catMap['Snacks'], isVeg: false, tags: ['filling', 'protein'] },
      { name: 'Nachos with Salsa', price: 140, description: 'Crispy nachos with homemade salsa and cheese', category: catMap['Snacks'], isVeg: true, tags: ['crunchy', 'shareable'] },
      { name: 'French Fries', price: 100, description: 'Crispy golden fries with dipping sauce', category: catMap['Snacks'], isVeg: true, tags: ['crispy', 'comfort'] },

      // Desserts
      { name: 'Chocolate Lava Cake', price: 180, description: 'Warm chocolate cake with molten center', category: catMap['Desserts'], isVeg: true, tags: ['warm', 'chocolate', 'indulgent'] },
      { name: 'Cheesecake', price: 200, description: 'New York-style baked cheesecake with berry coulis', category: catMap['Desserts'], isVeg: true, tags: ['cold', 'creamy', 'classic'] },
      { name: 'Tiramisu', price: 220, description: 'Classic Italian coffee-flavored dessert', category: catMap['Desserts'], isVeg: true, tags: ['cold', 'coffee', 'italian'] },
      { name: 'Belgian Waffle', price: 160, description: 'Crispy waffle with whipped cream and maple syrup', category: catMap['Desserts'], isVeg: true, tags: ['sweet', 'crispy'] },
      { name: 'Brownie Sundae', price: 190, description: 'Warm brownie with vanilla ice cream and chocolate sauce', category: catMap['Desserts'], isVeg: true, tags: ['warm', 'chocolate', 'indulgent'] },
      { name: 'Fruit Parfait', price: 150, description: 'Layered yogurt with seasonal fruits and granola', category: catMap['Desserts'], isVeg: true, tags: ['healthy', 'fresh', 'cold'] },

      // Combos
      { name: 'Morning Bliss Combo', price: 250, description: 'Cappuccino + Veg Sandwich + Fruit', category: catMap['Combos'], isVeg: true, tags: ['breakfast', 'value'] },
      { name: 'Afternoon Delight', price: 300, description: 'Cold Brew + Chicken Wrap + Brownie', category: catMap['Combos'], isVeg: false, tags: ['lunch', 'value'] },
      { name: 'Tea Time Special', price: 200, description: 'Masala Chai + Bruschetta + Cookie', category: catMap['Combos'], isVeg: true, tags: ['evening', 'value'] },
      { name: 'Dessert Duo', price: 350, description: 'Any 2 desserts + 2 coffees', category: catMap['Combos'], isVeg: true, tags: ['dessert', 'sharing', 'value'] },
      { name: 'Work From Café Pack', price: 400, description: '2 Lattes + Sandwich + Brownie Sundae', category: catMap['Combos'], isVeg: true, tags: ['value', 'work', 'filling'] }
    ];

    await MenuItem.insertMany(menuItems);
    console.log(`${menuItems.length} menu items created`);

    console.log('Seed data inserted successfully!');
    console.log('Admin credentials: admin@cafetranquil.com / admin123');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seed();
