import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserData {
  uuid: string;
  nombres: string;
  rol: string;
}

interface UserState {
  user: UserData | null;
  isAuth: boolean;
  setLogin: (userData: UserData) => void;
  logout: () => void;
}

export const useAuthStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuth: false,

      setLogin: (userData) => set({
        user: userData,
        isAuth: true
      }),

      logout: () => set({
        user: null,
        isAuth: false
      }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
