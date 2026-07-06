import { Product } from '../types';

export const HERO_SLIDES: Product[] = [
  {
    id: 'hero-1',
    name: 'BIG AIR Cloud Pure',
    subtitle: 'Walk Like A Boss',
    category: 'Air Series',
    price: 120000,
    formattedPrice: 'Rs. 1,20,000',
    image: '/shoes/hero_white.png',
    description: 'Sculpted organic liquid cloud sole engineered for maximum buoyancy and extreme street presence.',
    details: ['Organic liquid cloud sole architecture', 'Breathable zero-seam knit upper', 'Impact response air pod cushioning', 'Engineered asymmetry outsole'],
    colors: ['#FFFFFF', '#7FC8E8', '#0B1E2D'],
    sizes: [7, 8, 9, 10, 11, 12],
    rating: 4.9,
    isFeatured: true,
    heroText: 'ODD SHOE'
  },
  {
    id: 'hero-2',
    name: 'Green m123 Hybrid',
    subtitle: 'Vibrant Multi-Layer Wave',
    category: 'Drop 01',
    price: 120000,
    formattedPrice: 'Rs. 1,20,000',
    image: '/shoes/green_m123.png',
    description: 'Multi-layer organic tube outsole with coral, cyan and neon accents for bold modern style.',
    details: ['Layered liquid tube midsole', 'Precision 3D lattice upper', 'High-grip tread pattern'],
    colors: ['#E76F51', '#2A9D8F', '#E9C46A'],
    sizes: [7, 8, 9, 10, 11],
    rating: 4.8,
    isTrending: true,
    heroText: 'BIG AIR'
  },
  {
    id: 'hero-3',
    name: 'Green Wood Terra',
    subtitle: 'Sculpted Earth & Bronze',
    category: 'Organic Wave',
    price: 120000,
    formattedPrice: 'Rs. 1,20,000',
    image: '/shoes/green_wood.png',
    description: 'Earth-toned organic wave silhouette with fluid organic tread geometry.',
    details: ['Fluid organic tread geometry', 'Bronze matte finish upper', 'Ergonomic footbed support'],
    colors: ['#8D5B4C', '#D4A373', '#FAF0CA'],
    sizes: [8, 9, 10, 11, 12],
    rating: 4.9,
    heroText: 'RAW DROP'
  }
];

export const PRODUCTS_CATALOG: Product[] = [
  {
    id: 'prod-1',
    name: 'Green m123',
    subtitle: 'Multi-layer organic wave',
    category: 'Drop 01',
    price: 120000,
    formattedPrice: 'Rs. 1,20,000',
    image: '/shoes/green_m123.png',
    description: 'Futuristic multi-layered sole with vivid coral and cyan highlights.',
    details: ['Organic liquid wave midsole', 'Lightweight mesh upper', 'Reinforced heel counter'],
    colors: ['#E76F51', '#2A9D8F', '#F4A261'],
    sizes: [7, 8, 9, 10, 11, 12],
    rating: 4.9,
    isTrending: true
  },
  {
    id: 'prod-2',
    name: 'Green wood',
    subtitle: 'Sculpted bronze wave sole',
    category: 'Organic Wave',
    price: 120000,
    formattedPrice: 'Rs. 1,20,000',
    image: '/shoes/green_wood.png',
    description: 'Bold bronze earth tones with fluid organic sole structure.',
    details: ['3D sculpted melted sole', 'Premium tactile upper', 'High impact absorption'],
    colors: ['#A0522D', '#CD853F', '#DEB887'],
    sizes: [7.5, 8.5, 9.5, 10.5, 11.5],
    rating: 4.8
  },
  {
    id: 'prod-3',
    name: 'yp8 AIR',
    subtitle: 'Magenta neon bubble drop',
    category: 'Air Series',
    price: 120000,
    formattedPrice: 'Rs. 1,20,000',
    image: '/shoes/yp8_air.png',
    description: 'Vibrant neon pink & yellow liquid bubble sole sneaker engineered for high visibility.',
    details: ['Glossy liquid bubble pod', 'High-contrast neon knit', 'Reflective rear pull-tab'],
    colors: ['#E63946', '#FFB703', '#1D3557'],
    sizes: [7, 8, 9, 10, 11],
    rating: 5.0,
    isFeatured: true
  },
  {
    id: 'prod-4',
    name: 'ai AIR',
    subtitle: 'Electric green tech runner',
    category: 'Custom Tech',
    price: 120000,
    formattedPrice: 'Rs. 1,20,000',
    image: '/shoes/ai_air.png',
    description: 'Electric green and deep matte black runner with aggressive organic tread geometry.',
    details: ['Aggressive claw tread geometry', 'Zero-weight synthetic upper', 'Anti-slip rubber compounds'],
    colors: ['#38B000', '#000000', '#70E000'],
    sizes: [8, 9, 10, 11, 12],
    rating: 4.9
  },
  {
    id: 'prod-5',
    name: 'BIG AIR Pure Cloud',
    subtitle: 'White organic cloud runner',
    category: 'Air Series',
    price: 145000,
    formattedPrice: 'Rs. 1,45,000',
    image: '/shoes/hero_white.png',
    description: 'The flagship ODDSHOE silhouette featuring white organic cloud sole pods.',
    details: ['Flagship liquid pod architecture', 'Ultralight breathability', 'Zero gravity rebound'],
    colors: ['#FFFFFF', '#EAF6FC', '#0B1E2D'],
    sizes: [7, 8, 9, 10, 11, 12],
    rating: 5.0,
    isFeatured: true
  },
  {
    id: 'prod-6',
    name: 'Emerald Quality Hero',
    subtitle: 'Gold accent luxury render',
    category: 'Custom Tech',
    price: 160000,
    formattedPrice: 'Rs. 1,60,000',
    image: '/shoes/quality_green.png',
    description: 'Premium emerald green edition with metallic gold accent sole inserts.',
    details: ['Limited edition emerald upper', 'Anodized gold tread accents', 'Custom collector box included'],
    colors: ['#1B4332', '#FFD700', '#2D6A4F'],
    sizes: [8, 9, 10, 11],
    rating: 4.95
  }
];

export const TRUST_ITEMS = [
  {
    id: 'shipping',
    title: 'Free Shipping World Wide',
    subtitle: 'Tell As About Your Service',
    iconName: 'Package'
  },
  {
    id: 'guarantee',
    title: 'Money Back Guarantee',
    subtitle: 'Within 30 Day For On Exchange',
    iconName: 'RotateCcw'
  },
  {
    id: 'support',
    title: 'Online Support',
    subtitle: '24 Hours A 7 Day',
    iconName: 'Headphones'
  }
];
