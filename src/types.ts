export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  condition: 'Brand New' | 'UK Used';
  isSale?: boolean;
  category: string;
}

export type Category = 'Smartphones' | 'Laptops & MacBooks' | 'Tablets & iPads' | 'Accessories';
