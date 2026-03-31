import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface FavoritesState {
  items: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      addFavorite: (item) => {
        set((state) => {
          if (!state.items.find((i) => i.id === item.id)) {
            return { items: [...state.items, item] };
          }
          return state;
        });
      },
      removeFavorite: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      isFavorite: (id) => {
        return get().items.some((item) => item.id === id);
      },
    }),
    {
      name: 'favorites-storage',
    }
  )
);
