import { create } from 'zustand';

interface CartState {
  cartCount: number;
  addToCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cartCount: 3, // Initial count from design
  addToCart: () => set((state) => ({ cartCount: state.cartCount + 1 })),
}));
