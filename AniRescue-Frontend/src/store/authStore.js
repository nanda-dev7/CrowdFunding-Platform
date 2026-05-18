import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: ({ user, token }) => set({ user, token, isAuthenticated: Boolean(user || token) }),
      setUser: (user) => set({ user, isAuthenticated: Boolean(user) }),
      setToken: (token) => set({ token, isAuthenticated: Boolean(token) }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: "aniRescue-auth",
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    },
  ),
);
