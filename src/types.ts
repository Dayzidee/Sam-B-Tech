export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  condition: 'Brand New' | 'UK Used' | 'Refurbished' | 'Pre-owned';
  isSale?: boolean;
  category: string;
}

export type Category = 'ALL' | 'Phones' | 'Laptops' | 'Tablets' | 'Accessories' | 'Watches';
