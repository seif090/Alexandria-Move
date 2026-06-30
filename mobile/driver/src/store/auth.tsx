import React, { createContext, useContext, ReactNode } from 'react'
import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../services/api'
import { User } from '../types'
import { signInWithGoogle, signOutFromGoogle } from '../services/googleSignIn'

interface AuthState {
  user: User | null; driver: any | null; isAuthenticated: boolean; isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  googleLogin: () => Promise<void>
  logout: () => Promise<void>
  loadUser: () => Promise<void>
  updateAvailability: (available: boolean) => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null, driver: null, isAuthenticated: false, isLoading: true,
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    const { token, refreshToken } = response.data.data
    await AsyncStorage.setItem('token', token)
    await AsyncStorage.setItem('refreshToken', refreshToken)
    set({ isAuthenticated: true })
    const userRes = await api.get('/auth/me')
    const driverRes = await api.get('/drivers/me')
    set({ user: userRes.data.data, driver: driverRes.data.data })
  },
  googleLogin: async () => {
    const { idToken } = await signInWithGoogle()
    if (!idToken) return
    set((s) => ({ ...s, isLoading: true }))
    try {
      const res = await api.post('/auth/google-login', { idToken })
      const { token, refreshToken } = res.data.data || res.data
      await AsyncStorage.setItem('token', token)
      await AsyncStorage.setItem('refreshToken', refreshToken)
      set((s) => ({ ...s, isAuthenticated: true }))
      const userRes = await api.get('/auth/me')
      const driverRes = await api.get('/drivers/me')
      set((s) => ({ ...s, user: userRes.data.data, driver: driverRes.data.data, isLoading: false }))
    } catch (err: any) {
      await signOutFromGoogle()
      set((s) => ({ ...s, isLoading: false }))
      throw new Error(err.response?.data?.data?.message || err.response?.data?.message || 'Google login failed')
    }
  },
  logout: async () => { await AsyncStorage.clear(); await signOutFromGoogle(); set({ user: null, driver: null, isAuthenticated: false }) },
  loadUser: async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      if (!token) { set({ isLoading: false }); return }
      const userRes = await api.get('/auth/me')
      const driverRes = await api.get('/drivers/me')
      set({ user: userRes.data.data, driver: driverRes.data.data, isAuthenticated: true, isLoading: false })
    } catch { await AsyncStorage.clear(); set({ isLoading: false }) }
  },
  updateAvailability: async (available) => {
    await api.put('/drivers/availability', { isAvailable: available })
    set((state) => ({ driver: state.driver ? { ...state.driver, isAvailable: available } : null }))
  },
}))

interface AuthContextType {
  user: User | null; driver: any | null; isAuthenticated: boolean; isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  googleLogin: () => Promise<void>
  logout: () => Promise<void>
  updateAvailability: (available: boolean) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const store = useAuthStore()
  const { user, driver, isAuthenticated, isLoading, login, googleLogin, logout, updateAvailability } = store
  return (
    <AuthContext.Provider value={{ user, driver, isAuthenticated, isLoading, login, googleLogin, logout, updateAvailability }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
