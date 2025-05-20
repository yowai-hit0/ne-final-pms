/* eslint-disable @typescript-eslint/no-unused-vars */

import { create } from 'zustand';
import { User } from '../types';
import { getCurrentUser, isAuthenticated as checkAuth, isAdmin as checkAdmin } from '../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setUser: (user: User | null) => void;
  initialize: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  
  setUser: (user) => set({
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
  }),
  
  initialize: () => {
    try {
      const user = getCurrentUser();
      set({
        user,
        isAuthenticated: checkAuth(),
        isAdmin: checkAdmin(),
      });
    } catch (error) {
      // If there's any error during initialization, reset the state
      set({
        user: null,
        isAuthenticated: false,
        isAdmin: false,
      });
    }
  },
  
  logout: () => set({
    user: null,
    isAuthenticated: false,
    isAdmin: false,
  }),
}));