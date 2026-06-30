import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuthStore } from './store/auth'
import App from './App'
import './index.css'

function AppInit({ children }: { children: React.ReactNode }) {
  const loadUser = useAuthStore((s) => s.loadUser)
  useEffect(() => {
    loadUser()
  }, [])
  return <>{children}</>
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppInit>
          <App />
          <Toaster position="top-right" toastOptions={{
            style: { borderRadius: '10px', background: '#333', color: '#fff' },
          }} />
        </AppInit>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
