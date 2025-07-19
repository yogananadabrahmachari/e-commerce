import React, { useState, useEffect, useCallback } from 'react';

// NOTE: The 'process' object from Node.js is not available in the browser.
// The error "process is not defined" suggests the execution environment is not
// correctly substituting this variable at build time as Create React App normally would.
//
// To fix this for local development, we are temporarily hardcoding the API URL.
// The Docker build process (defined in docker-compose.yaml and Dockerfile)
// is correctly configured to handle this variable, so it will work when containerized.
const API_URL = 'http://localhost:5000/api';
// Original line for reference (used by the Docker build process):
// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';


// --- SIMULATED BACKEND DATA ---
// To resolve the "Failed to fetch" error in this preview environment, we are
// using a local copy of the product data instead of making a real network request.
// In a real deployment, this data would come from the backend API.
const localProductData = [
  { id: 1, name: 'Aurora Smart Watch', category: 'Electronics', price: 20799, originalPrice: 24999, rating: 5, reviewCount: 132, images: ['https://images.pexels.com/photos/277406/pexels-photo-277406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/110471/pexels-photo-110471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'Stay connected and track your fitness with the sleek and powerful Aurora Smart Watch. Features a vibrant AMOLED display, heart rate monitoring, and a 14-day battery life.' },
  { id: 8, name: 'High-Performance Laptop', category: 'Electronics', price: 129999, rating: 5, reviewCount: 98, images: ['https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], isNew: true, description: 'Unleash your creativity and productivity with this powerhouse laptop. Featuring a 16-inch Retina display, M2 Pro chip, and all-day battery life.' },
  { id: 2, name: 'Zenith Wireless Headphones', category: 'Audio', price: 10749, rating: 4, reviewCount: 89, images: ['https://images.pexels.com/photos/3781529/pexels-photo-3781529.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'Immerse yourself in crystal-clear audio with Zenith. Active noise-cancelling technology, plush earcups, and a 30-hour battery life for uninterrupted listening.' },
  { id: 9, name: 'Classic Denim Jacket', category: 'Apparel', price: 4999, rating: 5, reviewCount: 250, images: ['https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/2693899/pexels-photo-2693899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], isNew: true, description: 'A timeless wardrobe staple. This classic denim jacket is made from 100% cotton for a comfortable fit and feel. Perfect for layering in any season.' },
  { id: 10, name: 'Urban Explorer Sneakers', category: 'Apparel', price: 7499, originalPrice: 9999, rating: 4, reviewCount: 180, images: ['https://images.pexels.com/photos/1032110/pexels-photo-1032110.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'Comfort meets style with the Urban Explorer Sneakers. Featuring a lightweight design, cushioned insole, and a durable outsole for all-day wear.' },
  { id: 11, name: 'Professional Chef\'s Knife', category: 'Home & Kitchen', price: 3999, rating: 5, reviewCount: 320, images: ['https://images.pexels.com/photos/360986/pexels-photo-360986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/5064613/pexels-photo-5064613.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'The perfect tool for any home chef. This 8-inch chef\'s knife is forged from high-carbon German steel for exceptional sharpness and durability.' },
  { id: 12, name: 'Minimalist Ceramic Dinnerware', category: 'Home & Kitchen', price: 6499, originalPrice: 7999, rating: 4, reviewCount: 150, images: ['https://images.pexels.com/photos/8134780/pexels-photo-8134780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/6634177/pexels-photo-6634177.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'Elevate your dining experience with this 16-piece minimalist dinnerware set. Service for four, including dinner plates, salad plates, bowls, and mugs.' },
  { id: 13, name: 'The Midnight Library', category: 'Books', price: 799, rating: 5, reviewCount: 500, images: ['https://images.pexels.com/photos/2228561/pexels-photo-2228561.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/2041540/pexels-photo-2041540.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], isNew: true, description: 'A novel by Matt Haig. Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.' },
  { id: 3, name: 'Ergo-Comfort Office Chair', category: 'Furniture', price: 29050, rating: 5, reviewCount: 210, images: ['https://images.pexels.com/photos/2762247/pexels-photo-2762247.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/116910/pexels-photo-116910.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'Designed for ultimate comfort and support during long work hours. Fully adjustable with lumbar support.' },
  { id: 4, name: 'Nomad Adventure Backpack', category: 'Travel Gear', price: 7149, originalPrice: 8999, rating: 4, reviewCount: 77, images: ['https://images.pexels.com/photos/1545998/pexels-photo-1545998.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/2433985/pexels-photo-2433985.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'Your perfect companion for any journey. Durable, water-resistant, and packed with smart compartments.' },
  { id: 5, name: 'Artisan Ceramic Mug Set', category: 'Home & Kitchen', price: 3750, rating: 5, reviewCount: 301, images: ['https://images.pexels.com/photos/1459281/pexels-photo-1459281.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/3734563/pexels-photo-3734563.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'Handcrafted ceramic mugs, perfect for your morning coffee or tea. Set of four unique designs.' },
  { id: 6, name: 'Pro-Grip Camera Lens', category: 'Photography', price: 37350, rating: 4, reviewCount: 45, images: ['https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/243757/pexels-photo-243757.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'Capture stunning, professional-grade photos with this versatile 50mm f/1.8 camera lens.' },
  { id: 14, name: "Men's Formal Shirt", category: 'Apparel', price: 2499, rating: 4, reviewCount: 120, images: ['https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/3765233/pexels-photo-3765233.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'A crisp, white formal shirt made from premium cotton. Perfect for business meetings or formal events.' },
  { id: 15, name: "Women's Summer Dress", category: 'Apparel', price: 3299, rating: 5, reviewCount: 95, images: ['https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/2069500/pexels-photo-2069500.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], isNew: true, description: 'A light and airy floral summer dress. Made from breathable fabric to keep you cool and stylish.' },
  { id: 16, name: 'Leather Belt', category: 'Apparel', price: 1499, originalPrice: 1999, rating: 4, reviewCount: 210, images: ['https://images.pexels.com/photos/984619/pexels-photo-984619.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'Genuine leather belt with a classic stainless steel buckle. A versatile accessory for any wardrobe.' },
  { id: 17, name: 'Gaming Mouse', category: 'Electronics', price: 3499, rating: 5, reviewCount: 155, images: ['https://images.pexels.com/photos/7889397/pexels-photo-7889397.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/4316/technology-computer-keyboard-mouse.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'High-precision gaming mouse with customizable RGB lighting and programmable buttons for a competitive edge.' },
  { id: 18, name: '4K Action Camera', category: 'Photography', price: 18999, originalPrice: 22999, rating: 4, reviewCount: 88, images: ['https://images.pexels.com/photos/390051/pexels-photo-390051.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'Capture your adventures in stunning 4K. Waterproof, durable, and packed with features like image stabilization.' },
  { id: 19, name: 'Portable Bluetooth Speaker', category: 'Audio', price: 4599, rating: 5, reviewCount: 310, images: ['https://images.pexels.com/photos/1279923/pexels-photo-1279923.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/6109772/pexels-photo-6109772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], isNew: true, description: 'Compact yet powerful Bluetooth speaker with deep bass and a 12-hour battery life. Take your music anywhere.' },
  { id: 20, name: 'Sapiens: A Brief History of Humankind', category: 'Books', price: 699, rating: 5, reviewCount: 1200, images: ['https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/626967/pexels-photo-626967.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'Yuval Noah Harari\'s critically acclaimed book exploring the history of the human species.' },
  { id: 21, name: 'Atomic Habits', category: 'Books', price: 599, rating: 5, reviewCount: 1500, images: ['https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/3747505/pexels-photo-3747505.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'An easy and proven way to build good habits and break bad ones by James Clear.' },
  { id: 22, name: 'Yoga Mat', category: 'Sports & Outdoors', price: 1999, rating: 4, reviewCount: 180, images: ['https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/868845/pexels-photo-868845.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'Eco-friendly, non-slip yoga mat for a comfortable and stable practice.' },
  { id: 23, name: '2-Person Camping Tent', category: 'Sports & Outdoors', price: 5999, originalPrice: 7499, rating: 5, reviewCount: 75, images: ['https://images.pexels.com/photos/2422258/pexels-photo-2422258.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'Lightweight and easy-to-assemble tent, perfect for weekend camping trips. Waterproof and wind-resistant.' },
  { id: 24, name: 'Adjustable Dumbbell Set', category: 'Sports & Outdoors', price: 8999, rating: 5, reviewCount: 110, images: ['https://images.pexels.com/photos/1552249/pexels-photo-1552249.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], isNew: true, description: 'A versatile set of adjustable dumbbells, perfect for a home gym. Easily change weights from 2.5kg to 24kg.' },
  { id: 25, name: 'Espresso Coffee Machine', category: 'Home & Kitchen', price: 14999, rating: 4, reviewCount: 92, images: ['https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/997725/pexels-photo-997725.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'Brew barista-quality espresso at home. Features a 15-bar pressure pump and a milk frother.' },
  { id: 26, name: 'Air Fryer', category: 'Home & Kitchen', price: 7999, originalPrice: 9999, rating: 5, reviewCount: 450, images: ['https://images.pexels.com/photos/5663435/pexels-photo-5663435.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/4038791/pexels-photo-4038791.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'Enjoy your favorite fried foods with up to 85% less fat. Large capacity and easy-to-use digital controls.' },
  { id: 27, name: 'Modern Bookshelf', category: 'Furniture', price: 12999, rating: 4, reviewCount: 65, images: ['https://images.pexels.com/photos/1125137/pexels-photo-1125137.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/37347/office-sitting-room-executive-sitting.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'A sleek and sturdy 5-tier bookshelf to display your favorite books and decor.' },
  { id: 28, name: 'Wooden Coffee Table', category: 'Furniture', price: 9999, rating: 5, reviewCount: 130, images: ['https://images.pexels.com/photos/2082092/pexels-photo-2082092.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], isNew: true, description: 'Solid wood coffee table with a rustic finish and a lower shelf for extra storage.' },
  { id: 29, name: 'Compact Tripod', category: 'Photography', price: 2999, rating: 4, reviewCount: 140, images: ['https://images.pexels.com/photos/243758/pexels-photo-243758.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/306763/pexels-photo-306763.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'Lightweight and portable tripod for cameras and smartphones. Perfect for travel photography.' },
  { id: 30, name: 'Soundbar with Subwoofer', category: 'Audio', price: 17999, originalPrice: 21999, rating: 5, reviewCount: 115, images: ['https://images.pexels.com/photos/803963/pexels-photo-803963.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/3756950/pexels-photo-3756950.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'Transform your TV audio with this 2.1 channel soundbar and wireless subwoofer for immersive, cinematic sound.' },
  { id: 31, name: 'Hardside Spinner Luggage', category: 'Travel Gear', price: 8999, rating: 4, reviewCount: 205, images: ['https://images.pexels.com/photos/1153189/pexels-photo-1153189.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/2029731/pexels-photo-2029731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'Durable and lightweight 28-inch hardside luggage with 360-degree spinner wheels for effortless travel.' },
  { id: 32, name: "Women's Trench Coat", category: 'Apparel', price: 8999, rating: 5, reviewCount: 85, images: ['https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/2736499/pexels-photo-2736499.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], isNew: true, description: 'A classic, double-breasted trench coat. The perfect outerwear for a sophisticated and stylish look.' },
  { id: 33, name: "Men's Leather Loafers", category: 'Apparel', price: 5499, rating: 4, reviewCount: 112, images: ['https://images.pexels.com/photos/267202/pexels-photo-267202.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/292999/pexels-photo-292999.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'Handcrafted leather loafers that offer both comfort and style. Ideal for smart-casual occasions.' },
  { id: 34, name: 'E-Reader Tablet', category: 'Electronics', price: 11999, rating: 5, reviewCount: 430, images: ['https://images.pexels.com/photos/63690/pexels-photo-63690.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/261949/pexels-photo-261949.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'Read for weeks on a single charge with this glare-free e-reader. Adjustable warm light for comfortable reading day or night.' },
  { id: 35, name: 'Wireless Charging Pad', category: 'Electronics', price: 2499, originalPrice: 3199, rating: 4, reviewCount: 280, images: ['https://images.pexels.com/photos/371917/pexels-photo-371917.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'Fast and convenient wireless charging for your Qi-compatible devices. Sleek, non-slip design.' },
  { id: 36, name: 'Robotic Vacuum Cleaner', category: 'Home & Kitchen', price: 22999, rating: 5, reviewCount: 190, images: ['https://images.pexels.com/photos/4009023/pexels-photo-4009023.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/4009021/pexels-photo-4009021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], isNew: true, description: 'Smart robotic vacuum with mapping technology. Cleans your floors automatically, so you don’t have to.' },
  { id: 37, name: 'Electric Kettle', category: 'Home & Kitchen', price: 1899, rating: 4, reviewCount: 550, images: ['https://images.pexels.com/photos/8142371/pexels-photo-8142371.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/5945737/pexels-photo-5945737.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: '1.7-liter stainless steel electric kettle with rapid boil technology and automatic shut-off.' },
  { id: 38, name: 'Insulated Water Bottle', category: 'Sports & Outdoors', price: 1299, rating: 5, reviewCount: 800, images: ['https://images.pexels.com/photos/3765296/pexels-photo-3765296.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/3765306/pexels-photo-3765306.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'Keep your drinks cold for 24 hours or hot for 12 hours. Durable, leak-proof, and BPA-free.' },
  { id: 39, name: 'Mountain Bike', category: 'Sports & Outdoors', price: 28999, originalPrice: 34999, rating: 4, reviewCount: 45, images: ['https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'A rugged mountain bike with front suspension and 21-speed gears, ready for any trail.' },
  { id: 40, name: 'Velvet Accent Chair', category: 'Furniture', price: 15999, rating: 5, reviewCount: 98, images: ['https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/2082087/pexels-photo-2082087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'A luxurious velvet accent chair with gold-finished legs. Adds a touch of elegance to any room.' },
  { id: 41, name: 'Ikigai', category: 'Books', price: 450, rating: 5, reviewCount: 950, images: ['https://images.pexels.com/photos/256450/pexels-photo-256450.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'The Japanese secret to a long and happy life. A must-read for finding your purpose.' },
  { id: 42, name: 'In-Ear True Wireless Earbuds', category: 'Audio', price: 6999, rating: 4, reviewCount: 620, images: ['https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], isNew: true, description: 'Compact true wireless earbuds with noise cancellation and a comfortable, secure fit.' },
  { id: 43, name: 'Camera Backpack', category: 'Photography', price: 6499, rating: 5, reviewCount: 135, images: ['https://images.pexels.com/photos/404159/pexels-photo-404159.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/1335058/pexels-photo-1335058.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'A durable and weather-resistant backpack with customizable compartments for all your camera gear.' },
  { id: 44, name: 'Neck Pillow', category: 'Travel Gear', price: 999, originalPrice: 1499, rating: 4, reviewCount: 400, images: ['https://images.pexels.com/photos/4114886/pexels-photo-4114886.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/4114887/pexels-photo-4114887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'Ergonomic memory foam neck pillow for comfortable travel on planes, trains, and cars.' },
  { id: 45, name: 'Silk Scarf', category: 'Apparel', price: 2199, rating: 5, reviewCount: 150, images: ['https://images.pexels.com/photos/2002719/pexels-photo-2002719.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/9708290/pexels-photo-9708290.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'A beautiful 100% silk scarf with a vibrant print. A versatile and elegant accessory.' },
  { id: 46, name: 'Smart Home Hub', category: 'Electronics', price: 8999, rating: 4, reviewCount: 210, images: ['https://images.pexels.com/photos/39284/macbook-apple-imac-computer-39284.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/326503/pexels-photo-326503.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'Control all your smart home devices from one central hub. Compatible with Alexa, Google Assistant, and Apple HomeKit.' },
  { id: 47, name: 'Cast Iron Skillet', category: 'Home & Kitchen', price: 2899, rating: 5, reviewCount: 380, images: ['https://images.pexels.com/photos/5663428/pexels-photo-5663428.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/6287493/pexels-photo-6287493.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'Pre-seasoned 12-inch cast iron skillet for superior heat retention and even cooking.' },
  { id: 48, name: 'Fitness Tracker Band', category: 'Sports & Outdoors', price: 3499, originalPrice: 4999, rating: 4, reviewCount: 750, images: ['https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/8839887/pexels-photo-8839887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'Track your steps, heart rate, sleep, and more. A slim and lightweight fitness tracker with a color display.' },
  { id: 49, name: 'Standing Desk', category: 'Furniture', price: 19999, rating: 5, reviewCount: 180, images: ['https://images.pexels.com/photos/8112148/pexels-photo-8112148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/7175588/pexels-photo-7175588.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], isNew: true, description: 'Electric height-adjustable standing desk to improve posture and productivity. Spacious and sturdy design.' },
  { id: 50, name: 'The Psychology of Money', category: 'Books', price: 550, rating: 5, reviewCount: 1100, images: ['https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], description: 'Timeless lessons on wealth, greed, and happiness by Morgan Housel.' },
];

// --- Helper & Icon Components ---
const StarIcon = ({ filled, className }) => ( <svg className={`w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-300'} ${className}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>);
const ShoppingCartIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>);
const FilterIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>);

// --- Main Components ---
const Header = ({ cartCount, onNavigate, onToggleFilters }) => (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="text-2xl font-bold text-gray-800 tracking-wider cursor-pointer" onClick={() => onNavigate('home')}>Shop<span className="text-indigo-600">Sphere</span></div>
            <div className="hidden md:flex items-center space-x-8 text-gray-600 font-medium">
                <a href="#home" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className="hover:text-indigo-600 transition-colors duration-300">Home</a>
                <a href="#deals" onClick={(e) => { e.preventDefault(); onNavigate('deals'); }} className="hover:text-indigo-600 transition-colors duration-300">Deals</a>
                <a href="#new" onClick={(e) => { e.preventDefault(); onNavigate('new'); }} className="hover:text-indigo-600 transition-colors duration-300">New Arrivals</a>
                <button onClick={(e) => { e.preventDefault(); onToggleFilters(); }} className="lg:hidden flex items-center hover:text-indigo-600 transition-colors duration-300"><FilterIcon /> Filters</button>
            </div>
            <div className="flex items-center space-x-4">
                <button className="relative text-gray-600 hover:text-indigo-600 transition-colors duration-300">
                    <ShoppingCartIcon />
                    {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">{cartCount}</span>}
                </button>
            </div>
        </nav>
    </header>
);

const ProductCard = ({ product, onProductSelect }) => {
  const handleImageError = (e) => { e.target.src = 'https://placehold.co/600x400/e2e8f0/94a3b8?text=Image+Not+Found'; };
  const formatPrice = (price) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div onClick={() => onProductSelect(product)} className="bg-white rounded-xl shadow-lg overflow-hidden group transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 ease-in-out cursor-pointer">
      <div className="relative"><img className="w-full h-56 object-cover" src={product.images[0]} alt={product.name} onError={handleImageError} />
        {discount > 0 && <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{discount}% OFF</div>}
        {product.isNew && <div className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">NEW</div>}
      </div>
      <div className="p-6">
        <p className="text-sm text-gray-500 mb-1">{product.category}</p>
        <h3 className="text-lg font-semibold text-gray-800 truncate group-hover:text-indigo-600 transition-colors">{product.name}</h3>
        <div className="flex items-center mt-2"><div className="flex items-center">{[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < product.rating} />)}</div><span className="text-gray-500 text-sm ml-2">{product.reviewCount} reviews</span></div>
        <div className="flex items-baseline mt-4"><p className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</p>{product.originalPrice && <p className="text-md text-gray-500 line-through ml-2">{formatPrice(product.originalPrice)}</p>}</div>
      </div>
    </div>
  );
};

const ProductDetailPage = ({ product, onAddToCart, onBack }) => {
    const [mainImage, setMainImage] = useState(product.images[0]);
    const formatPrice = (price) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);
    const handleImageError = (e) => { e.target.src = 'https://placehold.co/800x800/e2e8f0/94a3b8?text=Image+Not+Found'; };
    const handleThumbnailError = (e) => { e.target.src = 'https://placehold.co/100x100/e2e8f0/94a3b8?text=Error'; };

    return (
        <div className="container mx-auto px-6 py-12 animate-fade-in">
            <button onClick={onBack} className="mb-8 text-indigo-600 hover:text-indigo-800 font-semibold">&larr; Back to Shop</button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <img src={mainImage} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-lg" onError={handleImageError} />
                    <div className="flex space-x-2 mt-4">{product.images.map((img, index) => (<img key={index} src={img} alt={`${product.name} thumbnail ${index + 1}`} onClick={() => setMainImage(img)} className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${mainImage === img ? 'border-indigo-500' : 'border-transparent'} hover:border-indigo-300 transition-all`} onError={handleThumbnailError} />))}</div>
                </div>
                <div>
                    <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                    <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
                    <div className="flex items-center mt-4"><div className="flex items-center">{[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < product.rating} />)}</div><span className="text-gray-600 text-md ml-3">{product.rating} stars ({product.reviewCount} reviews)</span></div>
                    <p className="text-gray-700 mt-6 text-lg leading-relaxed">{product.description}</p>
                    <div className="flex items-baseline mt-8"><p className="text-4xl font-bold text-indigo-600">{formatPrice(product.price)}</p>{product.originalPrice && <p className="text-xl text-gray-500 line-through ml-4">{formatPrice(product.originalPrice)}</p>}</div>
                    <button onClick={() => onAddToCart(product)} className="mt-8 w-full bg-indigo-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-all duration-300 shadow-md flex items-center justify-center space-x-2"><ShoppingCartIcon /><span>Add to Cart</span></button>
                </div>
            </div>
        </div>
    );
};

const Filters = ({ categories, filters, setFilters, maxPrice }) => {
    const handlePriceChange = (e) => setFilters(prev => ({ ...prev, price: Number(e.target.value) }));
    const handleCategoryChange = (category) => setFilters(prev => ({ ...prev, category: category }));
    const handleRatingChange = (rating) => setFilters(prev => ({ ...prev, rating: rating }));

    return (
        <div className="w-full lg:w-72 bg-white p-6 rounded-lg shadow-md lg:sticky lg:top-24 h-max">
            <h3 className="font-bold text-lg mb-4">Filters</h3>
            <div className="mb-6"><h4 className="font-semibold mb-2">Category</h4>{categories.map(cat => (<button key={cat} onClick={() => handleCategoryChange(cat)} className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${filters.category === cat ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-gray-100'}`}>{cat}</button>))}</div>
            <div className="mb-6"><h4 className="font-semibold mb-2">Price Range</h4><input type="range" min="0" max={maxPrice} value={filters.price} onChange={handlePriceChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" /><div className="text-sm text-gray-600 mt-1">Up to {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(filters.price)}</div></div>
            <div><h4 className="font-semibold mb-2">Rating</h4>{[4, 3, 2, 1].map(star => (<button key={star} onClick={() => handleRatingChange(star)} className={`block w-full text-left px-3 py-2 rounded-md text-sm flex items-center transition-colors ${filters.rating === star ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}><div className="flex">{[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < star} />)}</div><span className="ml-2">& Up</span></button>))}<button onClick={() => handleRatingChange(0)} className={`block w-full text-left px-3 py-2 mt-1 rounded-md text-sm transition-colors ${filters.rating === 0 ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}>All Ratings</button></div>
        </div>
    );
};

const MainShopView = ({ products, onProductSelect, pageType, showFilters }) => {
    const maxPrice = Math.max(...products.map(p => p.price), 0);
    const [filters, setFilters] = useState({ category: 'All', price: maxPrice, rating: 0 });
    
    useEffect(() => { setFilters({ category: 'All', price: maxPrice, rating: 0 }); }, [pageType, maxPrice]);

    const getFilteredProducts = () => {
        let prods = products;
        if (pageType === 'deals') prods = products.filter(p => p.originalPrice);
        else if (pageType === 'new') prods = products.filter(p => p.isNew);
        return prods.filter(p => (filters.category === 'All' || p.category === filters.category) && (p.price <= filters.price) && (p.rating >= filters.rating));
    };

    const filteredProducts = getFilteredProducts();
    const categories = ['All', ...new Set(products.map(p => p.category))];
    const pageTitles = { home: "All Products", deals: "Today's Top Deals", new: "Fresh Off the Line" };

    return (
        <div className="container mx-auto px-6 py-12"><h2 className="text-3xl font-bold text-center text-gray-800 mb-12">{pageTitles[pageType]}</h2>
            <div className="flex flex-col lg:flex-row gap-8">
                <div className={`w-full lg:w-72 lg:block ${showFilters ? 'block animate-fade-in' : 'hidden'}`}><Filters categories={categories} filters={filters} setFilters={setFilters} maxPrice={maxPrice} /></div>
                <div className="flex-1">
                    {filteredProducts.length > 0 ? (<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">{filteredProducts.map(product => <ProductCard key={product.id} product={product} onProductSelect={onProductSelect} />)}</div>) : (<div className="text-center py-16 bg-gray-50 rounded-lg"><h3 className="text-2xl font-semibold text-gray-700">No products found</h3><p className="text-gray-500 mt-2">Try adjusting your filters to see more results.</p></div>)}
                </div>
            </div>
        </div>
    );
};

export default function App() {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [page, setPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // This is the real API call. It's commented out for the preview environment.
        // const response = await fetch(`${API_URL}/products`);
        // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        // const data = await response.json();
        // setAllProducts(data);
        
        // This is the simulated API call using local data.
        setAllProducts(localProductData);

      } catch (e) {
        setError(e.message);
        console.error("Failed to fetch products:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => setCart(prevCart => [...prevCart, product]);
  const handleNavigate = (newPage) => { setPage(newPage); setSelectedProduct(null); setShowFilters(false); };
  const handleProductSelect = (product) => setSelectedProduct(product);
  const handleBackToShop = () => setSelectedProduct(null);
  const toggleFilters = () => setShowFilters(prev => !prev);

  const renderContent = () => {
    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (error) return <div className="text-center py-20 text-red-500">Error fetching data: {error}</div>;
    if (selectedProduct) return <ProductDetailPage product={selectedProduct} onAddToCart={handleAddToCart} onBack={handleBackToShop} />;
    return <MainShopView products={allProducts} onProductSelect={handleProductSelect} pageType={page} showFilters={showFilters} />;
  };

  return (
    <div className="bg-gray-100 font-sans flex flex-col min-h-screen">
      <Header cartCount={cart.length} onNavigate={handleNavigate} onToggleFilters={toggleFilters} />
      <main className="flex-grow">{renderContent()}</main>
      <footer className="bg-gray-800 text-white mt-auto"><div className="container mx-auto px-6 py-12"><div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-500"><p>&copy; 2024 ShopSphere. All Rights Reserved.</p></div></div></footer>
    </div>
  );
}
