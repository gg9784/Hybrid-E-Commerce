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
  },
  {
    id: 9,
    name: 'First Aid Kit',
    price: 35.50,
    description: 'Complete first aid kit for emergencies with 100 essential items',
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    category: 'Healthcare'
  },
  {
    id: 10,
    name: 'Digital Thermometer',
    price: 15.99,
    description: 'Highly accurate digital thermometer with fast readings',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    category: 'Healthcare'
  },
  {
    id: 11,
    name: 'Multivitamin Pack',
    price: 24.00,
    description: 'Daily multivitamins for overall health and immunity support',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    category: 'Healthcare'
  },
  {
    id: 12,
    name: 'Premium Basmati Rice',
    price: 18.25,
    description: 'Long-grain premium basmati rice for delicious meals',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    category: 'Kirana'
  },
  {
    id: 13,
    name: 'Organic Wild Honey',
    price: 12.50,
    description: '100% pure and organic wild forest honey',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    category: 'Kirana'
  },
  {
    id: 14,
    name: 'Cold Pressed Coconut Oil',
    price: 9.99,
    description: 'Pure cold pressed coconut oil for cooking and skincare',
    image: 'https://images.unsplash.com/photo-1590779033100-9f60705a6382?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    category: 'Kirana'
  }
];

const stores = [
  {
    id: 1,
    name: "LOCAL_CART Tech Hub",
    address: "123 Main St, Downtown",
    phone: "555-0101",
    hours: "9:00 AM - 9:00 PM",
    distance: 1.2,
    image: "/images/banners/electronics.png",
    banner: "/images/banners/electronics.png",
    description: "Your premier destination for high-end electronics. Experience the latest smartphones, ultrabooks, and smart home appliances in our futuristic showroom.",
    inventory: {
      "1": { status: "in_stock", quantity: 15 },
      "2": { status: "in_stock", quantity: 8 },
      "7": { status: "in_stock", quantity: 20 },
      "8": { status: "in_stock", quantity: 12 }
    }
  },
  {
    id: 2,
    name: "Suburban Fresh Mart",
    address: "456 Oak Ave, Suburbs",
    phone: "555-0102",
    hours: "8:00 AM - 10:00 PM",
    distance: 3.5,
    image: "/images/banners/kirana.png",
    banner: "/images/banners/kirana.png",
    description: "The neighborhood's favorite premium Kirana store. We source the finest organic pulses, long-grain basmati rice, and everyday essentials for your modern kitchen.",
    inventory: {
      "12": { status: "in_stock", quantity: 50 },
      "13": { status: "in_stock", quantity: 30 },
      "14": { status: "in_stock", quantity: 40 },
      "9": { status: "low_stock", quantity: 5 }
    }
  },
  {
    id: 3,
    name: "City Fashion Boutique",
    address: "789 Pine St, City Center",
    phone: "555-0103",
    hours: "10:00 AM - 8:00 PM",
    distance: 2.1,
    image: "/images/banners/clothing.png",
    banner: "/images/banners/clothing.png",
    description: "Elegant apparel for the modern lifestyle. Our carefully curated collection features high-end designer pieces and exclusive seasonal trends.",
    inventory: {
      "4": { status: "in_stock", quantity: 25 },
      "6": { status: "in_stock", quantity: 25 },
      "11": { status: "in_stock", quantity: 15 },
      "12": { status: "out_of_stock", quantity: 0 }
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

