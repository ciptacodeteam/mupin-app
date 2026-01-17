import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface FavoriteProperty {
  id: string;
  title: string;
  price: number;
  address: string;
  specs: {
    beds: number;
    baths: number;
    area: number;
  };
  image: string;
  type: 'Rumah' | 'Apartemen' | 'Ruko' | 'Kost';
}

interface FavoritesState {
  favorites: FavoriteProperty[];
  addFavorite: (property: FavoriteProperty) => void;
  removeFavorite: (id: string) => void;
  removeFavorites: (ids: string[]) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
}

const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (property) =>
        set((state) => {
          if (state.favorites.some((f) => f.id === property.id)) {
            return state;
          }
          return { favorites: [...state.favorites, property] };
        }),
      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id),
        })),
      removeFavorites: (ids) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => !ids.includes(f.id)),
        })),
      isFavorite: (id) => get().favorites.some((f) => f.id === id),
      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useFavoritesStore;
