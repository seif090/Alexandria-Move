import { create } from 'zustand'
import { createContext, useContext, ReactNode } from 'react'
import api from '../lib/api'
import { User } from '../types'
import { startTrackingHub, startNotificationHub, stopAllHubs } from '../lib/signalr'

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (fullName: string, email: string, password: string, phoneNumber?: string) => Promise<void>
  logout: () => void
  loadUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: true,

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    const { token, refreshToken } = response.data
    localStorage.setItem('token', token)
    localStorage.setItem('refreshToken', refreshToken)
    set({ token, refreshToken, isAuthenticated: true })
    await useAuthStore.getState().loadUser()
    startTrackingHub().catch(() => {})
    startNotificationHub().catch(() => {})
  },

  register: async (fullName, email, password, phoneNumber) => {
    const response = await api.post('/auth/register', { fullName, email, password, phoneNumber })
    return response.data
  },

  logout: () => {
    stopAllHubs()
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    set({ user: null, token: null, refreshToken: null, isAuthenticated: false })
  },

  loadUser: async () => {
    try {
      set({ isLoading: true })
      const token = localStorage.getItem('token')
      if (!token) {
        set({ isLoading: false, isAuthenticated: false })
        return
      }
      const response = await api.get('/auth/me')
      set({ user: response.data, isLoading: false })
    } catch {
      set({ user: null, isLoading: false, isAuthenticated: false })
      localStorage.clear()
    }
  },
}))

const AuthCtx = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const store = useAuthStore()
  return <AuthCtx.Provider value={store}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
