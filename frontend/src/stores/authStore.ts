import { create } from "zustand"
import type { User } from "@/types"

interface AuthStore {
  user: User | null
  accessToken: string | null
  isLoading: boolean
  error: string | null

  setCredentials: (data: { user: User; accessToken: string }) => void
  setUser: (user: User) => void
  setAccessToken: (token: string) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  // Initial State
  user: null,
  accessToken: null,
  isLoading: false,
  error: null,

  // Actions
  setCredentials: (data) =>
    set({
      user: data.user,
      accessToken: data.accessToken,
      error: null,
    }),
  setUser: (user) => set({ user }),
  setAccessToken: (token) => set({ accessToken: token }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  logout: () =>
    set({
      user: null,
      accessToken: null,
      error: null,
    }),
}))
