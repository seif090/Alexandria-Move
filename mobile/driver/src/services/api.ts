import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { config } from '../config'

const api = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(async (configReq) => {
  const token = await AsyncStorage.getItem('token')
  if (token) configReq.headers.Authorization = `Bearer ${token}`
  return configReq
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = await AsyncStorage.getItem('refreshToken')
      if (refreshToken) {
        try {
          const res = await axios.post(`${config.apiBaseUrl}/auth/refresh`, {
            token: await AsyncStorage.getItem('token'), refreshToken,
          })
          const { token, refreshToken: newRT } = res.data.data
          await AsyncStorage.setItem('token', token)
          await AsyncStorage.setItem('refreshToken', newRT)
          error.config.headers.Authorization = `Bearer ${token}`
          return api(error.config)
        } catch { await AsyncStorage.clear() }
      }
    }
    return Promise.reject(error)
  }
)

export default api
