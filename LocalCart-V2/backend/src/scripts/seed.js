import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Models
import Product from '../models/Product.js';
import Store from '../models/Store.js';
import User from '../models/User.js';
import Order from '../models/Order.js';

// Mock Data
import { products, stores } from '../data/mockData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedDB = async () => {
  try {
    console.log('Connecting to MongoDB for seeding...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    // 1. Clear existing data
    console.log('Clearing existing data...');
    await Product.deleteMany({});
    await Store.deleteMany({});
    // We might not want to delete users/orders if they are already being used by the dev, 
    // but for true "transformation" we can keep them or clear them. 
    // Let's just clear products and stores for now.

    // 2. Insert Products
    console.log('Inserting products...');
    const productMap = {}; // oldId -> newMongoObject
    
    for (const p of products) {
      const newProduct = await Product.create({
        name: p.name,
        price: p.price,
        description: p.description,
        image: p.image,
        category: p.category,
        stock: Math.floor(Math.random() * 100) + 10, // Randomized stock for demo
        rating: (Math.random() * 2 + 3).toFixed(1), // Randomized rating between 3-5
        numReviews: Math.floor(Math.random() * 50) + 5
      });
      productMap[p.id] = newProduct;
    }
    console.log(`Inserted ${Object.keys(productMap).length} products.`);

    // 3. Insert Stores
    console.log('Inserting stores...');
    for (const s of stores) {
      const mongoInventory = new Map();
      
      // Map old inventory numeric IDs to new Mongo ObjectIds
      for (const [oldProdId, invData] of Object.entries(s.inventory)) {
        const prod = productMap[oldProdId];
        if (prod) {
          // Fix status mapping for enum compatibility
          const status = invData.status.replace('_', '-');
          mongoInventory.set(prod._id.toString(), {
            status: status === 'in-stock' || status === 'low-stock' || status === 'out-of-stock' 
                    ? status 
                    : 'out-of-stock',
            quantity: invData.quantity
          });
        }
      }

      await Store.create({
        name: s.name,
        address: s.address,
        image: s.image,
        banner: s.banner || s.image,
        rating: (Math.random() * 1.5 + 3.5).toFixed(1), // Randomized rating between 3.5-5
        distance: s.distance + ' km',
        phone: s.phone,
        hours: s.hours,
        description: s.description,
        inventory: mongoInventory
      });
    }
    console.log(`Inserted ${stores.length} stores.`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
