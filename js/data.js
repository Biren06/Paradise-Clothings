/**
 * Paradise Clothing - Data Layer
 * Shared product catalog for the entire website.
 *
 * Product Schema:
 * {
 *   id: number,
 *   name: string,
 *   gender: 'men' | 'women' | 'kids',
 *   type: 'tops' | 'bottoms',
 *   price: number,
 *   originalPrice: number | null,
 *   badge: string | null,
 *   featured: boolean,
 *   image: string
 * }
 */

const PRODUCTS = [
  // --- MEN: TOPS ---
  {
    id: 1,
    name: 'Linen Breeze Shirt',
    gender: 'men',
    type: 'tops',
    price: 54.00,
    originalPrice: 68.00,
    badge: 'Best Seller',
    featured: true,
    image: 'assets/products/men-top-1.jpg'
  },
  {
    id: 2,
    name: 'Sunset Organic Cotton Tee',
    gender: 'men',
    type: 'tops',
    price: 38.00,
    originalPrice: null,
    badge: 'New',
    featured: true,
    image: 'assets/products/men-top-2.jpg'
  },
  {
    id: 3,
    name: 'Coastal Seersucker Camp Shirt',
    gender: 'men',
    type: 'tops',
    price: 58.00,
    originalPrice: null,
    badge: null,
    featured: false,
    image: 'assets/products/men-top-3.jpg'
  },

  // --- MEN: BOTTOMS ---
  {
    id: 4,
    name: 'Shoreline Chino Shorts',
    gender: 'men',
    type: 'bottoms',
    price: 46.00,
    originalPrice: null,
    badge: null,
    featured: true,
    image: 'assets/products/men-bottom-1.jpg'
  },
  {
    id: 5,
    name: 'Boardwalk Relaxed Linen Pants',
    gender: 'men',
    type: 'bottoms',
    price: 64.00,
    originalPrice: 78.00,
    badge: 'Sale',
    featured: false,
    image: 'assets/products/men-bottom-2.jpg'
  },

  // --- WOMEN: TOPS ---
  {
    id: 6,
    name: 'Coastal Linen Blouse',
    gender: 'women',
    type: 'tops',
    price: 52.00,
    originalPrice: 64.00,
    badge: 'Best Seller',
    featured: true,
    image: 'assets/products/women-top-1.jpg'
  },
  {
    id: 7,
    name: 'Seaside Smocked Cami',
    gender: 'women',
    type: 'tops',
    price: 42.00,
    originalPrice: null,
    badge: 'New',
    featured: false,
    image: 'assets/products/women-top-2.jpg'
  },
  {
    id: 8,
    name: 'Ocean Breeze Resort Shirt',
    gender: 'women',
    type: 'tops',
    price: 49.00,
    originalPrice: null,
    badge: null,
    featured: false,
    image: 'assets/products/women-top-3.jpg'
  },

  // --- WOMEN: BOTTOMS ---
  {
    id: 9,
    name: 'Seaside Wide-Leg Linen Trouser',
    gender: 'women',
    type: 'bottoms',
    price: 62.00,
    originalPrice: null,
    badge: 'Popular',
    featured: true,
    image: 'assets/products/women-bottom-1.jpg'
  },
  {
    id: 10,
    name: 'Dune High-Waist Linen Shorts',
    gender: 'women',
    type: 'bottoms',
    price: 44.00,
    originalPrice: 55.00,
    badge: 'Sale',
    featured: false,
    image: 'assets/products/women-bottom-2.jpg'
  },

  // --- KIDS: TOPS ---
  {
    id: 11,
    name: 'Sun-Stripe Cotton Pocket Tee',
    gender: 'kids',
    type: 'tops',
    price: 28.00,
    originalPrice: null,
    badge: 'New',
    featured: false,
    image: 'assets/products/kids-top-1.jpg'
  },
  {
    id: 12,
    name: 'Coastal Crewneck Pullover',
    gender: 'kids',
    type: 'tops',
    price: 40.00,
    originalPrice: null,
    badge: null,
    featured: false,
    image: 'assets/products/kids-top-2.jpg'
  },

  // --- KIDS: BOTTOMS ---
  {
    id: 13,
    name: 'Wave-Rider Boardshorts',
    gender: 'kids',
    type: 'bottoms',
    price: 32.00,
    originalPrice: 42.00,
    badge: 'Sale',
    featured: true,
    image: 'assets/products/kids-bottom-1.jpg'
  },
  {
    id: 14,
    name: 'Sandy Beach Drawstring Shorts',
    gender: 'kids',
    type: 'bottoms',
    price: 26.00,
    originalPrice: null,
    badge: null,
    featured: false,
    image: 'assets/products/kids-bottom-2.jpg'
  }
];

// App configuration and metadata
const APP_CONFIG = {
  brandName: 'Paradise Clothing',
  currency: '$',
  version: '1.0.0'
};

console.log(`[Paradise] data.js loaded successfully with ${PRODUCTS.length} clothing items`);
