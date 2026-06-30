import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

function extractData(response: any) {
  if (response?.data?.data !== undefined) {
    return response.data.data
  }
  if (response?.data !== undefined) {
    return response.data
  }
  return response
}

api.interceptors.response.use(
  (response) => {
    response.data = extractData({ data: response.data })
    return response
  },
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem('refreshToken')
      const currentToken = localStorage.getItem('token')
      if (refreshToken && currentToken) {
        try {
          const response = await axios.post('/api/auth/refresh', {
            token: currentToken,
            refreshToken,
          })
          const payload = response.data.data || response.data
          const { token, refreshToken: newRefreshToken } = payload
          localStorage.setItem('token', token)
          localStorage.setItem('refreshToken', newRefreshToken)
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        } catch {
          localStorage.clear()
          window.location.href = '/login'
        }
      } else {
        localStorage.clear()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
