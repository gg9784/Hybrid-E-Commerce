import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Product from '../models/Product.js';
import Store from '../models/Store.js';

dotenv.config();

const products = [
  {
    name: 'Premium Smartphone',
    price: 899.99,
    description: 'Latest model with high-resolution camera, fast processor and 5G connectivity',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2027&q=80',
    category: 'Electronics'
  },
  {
    name: 'Ultra-Thin Laptop',
    price: 1499.99,
    description: 'Powerful laptop with SSD storage, high-performance graphics and all-day battery life',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    category: 'Electronics'
  },
  {
    name: 'Wireless Headphones',
    price: 249.99,
    description: 'Noise-cancelling wireless headphones with premium sound quality and comfort',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    category: 'Electronics'
  },
  {
    name: 'Athletic Running Shoes',
    price: 129.99,
    description: 'Comfortable running shoes with cushioned soles and breathable material',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    category: 'Clothing'
  },
  {
    name: 'Smart Coffee Maker',
    price: 119.99,
    description: 'Programmable coffee maker with smartphone control and thermal carafe',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    category: 'Home'
  },
  {
    name: 'Travel Backpack',
    price: 89.99,
    description: 'Durable backpack with multiple compartments, USB charging port and anti-theft design',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    category: 'Accessories'
  },
  {
    name: 'Smart Watch',
    price: 299.99,
    description: 'Advanced smartwatch with health monitoring, GPS, and long battery life',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80',
    category: 'Electronics'
  },
  {
    name: 'Designer Sunglasses',
    price: 159.99,
    description: 'Stylish sunglasses with UV protection and polarized lenses',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80',
    category: 'Accessories'
  }
];

const stores = [
  {
    name: 'LOCAL_CART Downtown',
    address: '123 Main Street, Downtown, City',
    image: 'https://images.unsplash.com/photo-1604719312566-8912e9c8a213?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
    distance: '0.8 miles',
    phone: '(555) 123-4567',
    hours: '9:00 AM - 9:00 PM',
    location: { lat: 40.7128, lng: -74.0060 },
    inventoryData: {
      0: { status: 'in-stock', quantity: 15 },
      1: { status: 'in-stock', quantity: 8 },
      2: { status: 'low-stock', quantity: 3 },
      3: { status: 'in-stock', quantity: 12 },
      4: { status: 'out-of-stock', quantity: 0 },
      5: { status: 'in-stock', quantity: 6 },
      6: { status: 'in-stock', quantity: 4 },
      7: { status: 'low-stock', quantity: 2 }
    }
  },
  {
    name: 'LOCAL_CART Mumbai',
    address: 'Phoenix Market City, Mumbai',
    image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    distance: 'International',
    phone: '+91 22 6180 1000',
    hours: '10:00 AM - 10:00 PM',
    location: { lat: 19.0760, lng: 72.8777 },
    country: 'India',
    region: 'Asia',
    inventoryData: {
      0: { status: 'in-stock', quantity: 25 },
      1: { status: 'in-stock', quantity: 18 },
      2: { status: 'in-stock', quantity: 10 },
      3: { status: 'in-stock', quantity: 22 },
      4: { status: 'low-stock', quantity: 3 },
      5: { status: 'in-stock', quantity: 12 },
      6: { status: 'in-stock', quantity: 8 },
      7: { status: 'in-stock', quantity: 5 }
    }
  }
];

const importData = async () => {
  try {
    await connectDB();

    await Product.deleteMany();
    await Store.deleteMany();

    const createdProducts = await Product.insertMany(products);

    // Map store inventory to new product ObjectIds
    const updatedStores = stores.map(store => {
      const inventory = new Map();
      Object.keys(store.inventoryData).forEach(index => {
        inventory.set(createdProducts[index]._id.toString(), store.inventoryData[index]);
      });

      return {
        ...store,
        inventory
      };
    });

    await Store.insertMany(updatedStores);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
