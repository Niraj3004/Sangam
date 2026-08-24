import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { api } from '@/lib/api';

export interface User {
  id: string;
  _id?: string;
  email: string;
  handle?: string;
  role: 'student' | 'verified_student' | 'admin' | 'org';
  isVerified: boolean;
  isEmailVerified?: boolean;
  verifyTier?: 'unverified' | 'manual_pending' | 'verified_email' | 'verified_manual' | 'college' | 'manual';
  profilePic?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  
  // Actions
  setAuth: (user: User, accessToken: string, refreshToken: string, orgType?: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      orgType: null as string | null,

      setAuth: (user, accessToken, refreshToken, orgType) => set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        ...(orgType && { orgType })
      }),

      updateUser: (data) => set((state) => ({
        user: state.user ? { ...state.user, ...data } : null
      })),

      logout: async () => {
        const state = useAuthStore.getState();
        if (state.refreshToken) {
          try {
            await api.post('/auth/logout', { refreshToken: state.refreshToken });
          } catch (e) {
            console.error('Logout error:', e);
          }
        }
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'sangam-auth-storage',
      // We store tokens in localStorage for now (since it's an MVP client), 
      // but in production we'd want HttpOnly cookies handled by Next.js SSR.
      storage: createJSONStorage(() => localStorage),
    }
  )
);
