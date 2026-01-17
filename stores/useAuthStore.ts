import { User } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isHydrated: boolean;
  setUser: (user: User, token: string) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setIsHydrated: (state: boolean) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      isHydrated: false,
      login: (user, token) => set({ isAuthenticated: true, user, token }),
      setUser: (user, token) => set({ isAuthenticated: true, user, token }),
      logout: () => set({ isAuthenticated: false, user: null, token: null }),
      setIsHydrated: (state) => set({ isHydrated: state }),
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setIsHydrated(true);
      },
    },
  ),
);

export default useAuthStore;
