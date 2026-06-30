import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../store/auth'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'

export default function Login() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Login successful!')
      navigate('/')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-700">Alexandria</h1>
          <p className="text-gray-500 mt-2">Community Mobility Platform</p>
        </div>
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('auth.login')}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">{t('auth.emailLabel')}</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder')}
                required
              />
            </div>
            <div>
              <label className="label">{t('auth.passwordLabel')}</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
                {t('auth.forgotPassword')}
              </Link>
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? t('auth.signingIn') : t('auth.signInButton')}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              {t('auth.registerLink')}
            </Link>
          </p>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          Default: admin@alexandria.com / Admin@123
        </p>
      </div>
    </div>
  )
}
