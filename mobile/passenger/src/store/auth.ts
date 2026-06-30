import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../services/api'
import { User } from '../types'
import { signInWithGoogle, signOutFromGoogle } from '../services/googleSignIn'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (fullName: string, email: string, password: string, phoneNumber?: string) => Promise<void>
  googleLogin: () => Promise<void>
  logout: () => Promise<void>
  loadUser: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    const { token, refreshToken } = response.data.data
    await AsyncStorage.setItem('token', token)
    await AsyncStorage.setItem('refreshToken', refreshToken)
    set({ isAuthenticated: true })
    const userResponse = await api.get('/auth/me')
    set({ user: userResponse.data.data })
  },
  register: async (fullName, email, password, phoneNumber) => {
    await api.post('/auth/register', { fullName, email, password, phoneNumber })
  },
  googleLogin: async () => {
    const { idToken } = await signInWithGoogle()
    if (!idToken) return
    set({ isLoading: true })
    try {
      const res = await api.post('/auth/google-login', { idToken })
      const { token, refreshToken } = res.data.data || res.data
      await AsyncStorage.setItem('token', token)
      await AsyncStorage.setItem('refreshToken', refreshToken)
      set({ isAuthenticated: true })
      const userRes = await api.get('/auth/me')
      set({ user: userRes.data.data || userRes.data, isLoading: false })
    } catch (err: any) {
      await signOutFromGoogle()
      set({ isLoading: false })
      throw new Error(err.response?.data?.data?.message || err.response?.data?.message || 'Google login failed')
    }
  },
  logout: async () => {
    await AsyncStorage.clear()
    await signOutFromGoogle()
    set({ user: null, isAuthenticated: false })
  },
  loadUser: async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      if (!token) {
        set({ isLoading: false })
        return
      }
      const response = await api.get('/auth/me')
      set({ user: response.data.data, isAuthenticated: true, isLoading: false })
    } catch {
      await AsyncStorage.clear()
      set({ isLoading: false })
    }
  },
  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data)
    set({ user: response.data.data })
  },
}))
