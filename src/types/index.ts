export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: 'Drop 01' | 'Air Series' | 'Organic Wave' | 'Custom Tech';
  price: number;
  formattedPrice: string;
  image: string;
  description: string;
  details: string[];
  colors: string[];
  sizes: number[];
  rating: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  heroText?: string;
}

export interface CartItem {
  product: Product;
  selectedSize: number;
  quantity: number;
}
