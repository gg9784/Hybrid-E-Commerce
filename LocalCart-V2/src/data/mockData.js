const products = [
  {
    id: 1,
    name: 'Premium Smartphone',
    price: 899.99,
    description: 'Latest model with high-resolution camera, fast processor and 5G connectivity',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2027&q=80',
    category: 'Electronics'
  },
  {
    id: 2,
    name: 'Ultra-Thin Laptop',
    price: 1499.99,
    description: 'Powerful laptop with SSD storage, high-performance graphics and all-day battery life',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    category: 'Electronics'
  },
  {
    id: 3,
    name: 'Wireless Headphones',
    price: 249.99,
    description: 'Noise-cancelling wireless headphones with premium sound quality and comfort',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    category: 'Electronics'
  },
  {
    id: 4,
    name: 'Athletic Running Shoes',
    price: 129.99,
    description: 'Comfortable running shoes with cushioned soles and breathable material',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    category: 'Clothing'
  },
  {
    id: 5,
    name: 'Smart Coffee Maker',
    price: 119.99,
    description: 'Programmable coffee maker with smartphone control and thermal carafe',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    category: 'Home'
  },
  {
    id: 6,
    name: 'Travel Backpack',
    price: 89.99,
    description: 'Durable backpack with multiple compartments, USB charging port and anti-theft design',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    category: 'Accessories'
  },
  {
    id: 7,
    name: 'Smart Watch',
    price: 299.99,
    description: 'Advanced smartwatch with health monitoring, GPS, and long battery life',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80',
    category: 'Electronics'
  },
  {
    id: 8,
    name: 'Designer Sunglasses',
    price: 159.99,
    description: 'Stylish sunglasses with UV protection and polarized lenses',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80',
    category: 'Accessories'
  }
];

const stores = [
  {
    id: 1,
    name: 'LOCAL_CART Downtown',
    address: '123 Main Street, Downtown, City',
    image: 'https://images.unsplash.com/photo-1604719312566-8912e9c8a213?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
    distance: '0.8 miles',
    phone: '(555) 123-4567',
    hours: '9:00 AM - 9:00 PM',
    location: { lat: 40.7128, lng: -74.0060 },
    inventory: {
      1: { status: 'in-stock', quantity: 15 },
      2: { status: 'in-stock', quantity: 8 },
      3: { status: 'low-stock', quantity: 3 },
      4: { status: 'in-stock', quantity: 12 },
      5: { status: 'out-of-stock', quantity: 0 },
      6: { status: 'in-stock', quantity: 6 },
      7: { status: 'in-stock', quantity: 4 },
      8: { status: 'low-stock', quantity: 2 }
    }
  },
  {
    id: 2,
    name: 'LOCAL_CART Westside',
    address: '456 West Avenue, Westside, City',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    distance: '1.5 miles',
    phone: '(555) 234-5678',
    hours: '10:00 AM - 8:00 PM',
    location: {
      lat: 40.7138,
      lng: -74.0090
    },
    inventory: {
      1: { status: 'in-stock', quantity: 10 },
      2: { status: 'low-stock', quantity: 2 },
      3: { status: 'in-stock', quantity: 7 },
      4: { status: 'out-of-stock', quantity: 0 },
      5: { status: 'in-stock', quantity: 9 },
      6: { status: 'in-stock', quantity: 5 },
      7: { status: 'low-stock', quantity: 3 },
      8: { status: 'in-stock', quantity: 8 }
    }
  },
  {
    id: 3,
    name: 'LOCAL_CART Eastside',
    address: '789 East Boulevard, Eastside, City',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    distance: '2.3 miles',
    phone: '(555) 345-6789',
    hours: '9:00 AM - 10:00 PM',
    location: {
      lat: 40.7118,
      lng: -74.0030
    },
    inventory: {
      1: { status: 'low-stock', quantity: 3 },
      2: { status: 'in-stock', quantity: 6 },
      3: { status: 'in-stock', quantity: 9 },
      4: { status: 'in-stock', quantity: 7 },
      5: { status: 'low-stock', quantity: 2 },
      6: { status: 'out-of-stock', quantity: 0 },
      7: { status: 'in-stock', quantity: 5 },
      8: { status: 'in-stock', quantity: 4 }
    }
  },
  {
    id: 4,
    name: 'LOCAL_CART Mumbai Central',
    address: '42 Shopping Plaza, Mumbai Central, Mumbai, India',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    distance: '12.5 km',
    phone: '+91 22 2345 6789',
    hours: '10:00 AM - 9:00 PM',
    location: {
      lat: 18.9750,
      lng: 72.8258
    },
    inventory: {
      1: { status: 'in-stock', quantity: 20 },
      2: { status: 'in-stock', quantity: 15 },
      3: { status: 'in-stock', quantity: 10 },
      4: { status: 'low-stock', quantity: 3 },
      5: { status: 'in-stock', quantity: 12 },
      6: { status: 'in-stock', quantity: 8 },
      7: { status: 'out-of-stock', quantity: 0 },
      8: { status: 'in-stock', quantity: 5 }
    }
  },
  {
    id: 5,
    name: 'LOCAL_CART Delhi',
    address: '78 Connaught Place, New Delhi, India',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    distance: '8.2 km',
    phone: '+91 11 2345 6789',
    hours: '9:30 AM - 8:30 PM',
    location: {
      lat: 28.6304,
      lng: 77.2177
    },
    inventory: {
      1: { status: 'in-stock', quantity: 18 },
      2: { status: 'low-stock', quantity: 4 },
      3: { status: 'in-stock', quantity: 12 },
      4: { status: 'in-stock', quantity: 9 },
      5: { status: 'out-of-stock', quantity: 0 },
      6: { status: 'in-stock', quantity: 7 },
      7: { status: 'in-stock', quantity: 11 },
      8: { status: 'low-stock', quantity: 2 }
    }
  },
  {
    id: 6,
    name: 'LOCAL_CART Bangalore',
    address: '123 MG Road, Bangalore, India',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    distance: '5.7 km',
    phone: '+91 80 2345 6789',
    hours: '10:00 AM - 9:30 PM',
    location: {
      lat: 12.9716,
      lng: 77.5946
    },
    inventory: {
      1: { status: 'in-stock', quantity: 25 },
      2: { status: 'in-stock', quantity: 14 },
      3: { status: 'in-stock', quantity: 8 },
      4: { status: 'in-stock', quantity: 11 },
      5: { status: 'low-stock', quantity: 3 },
      6: { status: 'in-stock', quantity: 9 },
      7: { status: 'in-stock', quantity: 6 },
      8: { status: 'out-of-stock', quantity: 0 }
    }
  }
];

let videoSessions = [];
let users = [];

export {
  products,
  stores,
  videoSessions,
  users
};
