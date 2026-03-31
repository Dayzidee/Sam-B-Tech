import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category?: string;
}

interface CartState {
  items: CartItem[];
  cartCount: number;
  addToCart: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [
    {
      id: '1',
      name: "MacBook Pro M3 Max",
      category: "16-inch, Space Black, 64GB RAM",
      price: 4250000,
      quantity: 1,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgtXhc4CrkuFd6Bn5Vm858u10XpN0APJNaMg_XYTOtoLPfT8VDyW98FOye2w1IzeaIVFb2TyW8mZ__1xAfB-8wClV6T2TTUzlyAlc7CIzRcppMlO2__3sWaHyfCuNGMkrwp1-HlVjRcB2xXSWnV0AC7FMkIoieoonrOnU1dgNwz9fIGbGym_o46Wn-uFsu_Pp3XsZo0VZV5FNDCp6Mvrw25rfWsNCdKZLmRAq_R8GpbYtemBWGjkDB9dvmv1ieXBR63jJ02316voc"
    },
    {
      id: '2',
      name: "iPhone 15 Pro Max",
      category: "Natural Titanium, 512GB",
      price: 1850000,
      quantity: 1,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxhEqwY85Co8jPOCxBeMjhYFdOFTa51KzBvfywmMnEtQrzciUs1rgJvUUnr39nbcbjT2a6Z9h8_-rXqBkfWL35zM5p2CotZ-qNvx7p0roSpPn7RtJeKMTTEfnBgvk_gVnf0SIi0HXW2eR1iJ2GI1z9F1y89ZVzTTeyHdwoT9x6c3AhE3acTBSjkcJy-_x8N9ORG4Udee354zIYjJNN4_ATcb2Rfrvd0w9sQfyQB0gOmjghSUORfACvywgJo7x_m0CzTqBCuv9BUl8"
    }
  ],
  get cartCount() {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
  addToCart: (item) => set((state) => {
    const existingItem = state.items.find(i => i.id === item.id);
    if (existingItem) {
      return {
        items: state.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      };
    }
    return { items: [...state.items, { ...item, quantity: 1 }] };
  }),
  removeItem: (id) => set((state) => ({
    items: state.items.filter(i => i.id !== id)
  })),
  updateQuantity: (id, quantity) => set((state) => ({
    items: state.items.map(i => i.id === id ? { ...i, quantity } : i)
  })),
  getTotal: () => {
    return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}));
