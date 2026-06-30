import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../lib/api'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'

export default function ForgotPassword() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      setSent(true)
      toast.success('Password reset link sent to your email')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send reset link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-700">Alexandria</h1>
          <p className="text-gray-500 mt-2">Reset your password</p>
        </div>
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('auth.forgotPasswordTitle')}</h2>
          {sent ? (
            <div className="text-center">
              <p className="text-gray-600 mb-4">{t('auth.checkEmail')}</p>
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">{t('auth.login')}</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-gray-500 mb-4">{t('auth.forgotPasswordSubtitle')}</p>
              <div>
                <label className="label">{t('auth.emailLabel')}</label>
                <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('auth.emailPlaceholder')} required />
              </div>
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? t('auth.sending') : t('auth.resetButton')}
              </button>
              <p className="text-center text-sm text-gray-500 mt-4">
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">{t('auth.login')}</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
