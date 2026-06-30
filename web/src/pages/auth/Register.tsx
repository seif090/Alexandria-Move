import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../store/auth'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'

export default function Register() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '', phoneNumber: '' })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await register(form.fullName, form.email, form.password, form.phoneNumber)
      toast.success('Registration successful! Please check your email.')
      navigate('/login')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-700">Alexandria</h1>
          <p className="text-gray-500 mt-2">Create your account</p>
        </div>
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('auth.registerTitle')}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">{t('auth.fullName')}</label>
              <input type="text" className="input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder={t('auth.fullNamePlaceholder')} required />
            </div>
            <div>
              <label className="label">{t('auth.emailLabel')}</label>
              <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t('auth.emailPlaceholder')} required />
            </div>
            <div>
              <label className="label">{t('common.phone')}</label>
              <input type="tel" className="input" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} placeholder="+1 234 567 890" />
            </div>
            <div>
              <label className="label">{t('auth.passwordLabel')}</label>
              <input type="password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min. 8 characters" required />
            </div>
            <div>
              <label className="label">{t('auth.confirmPassword')}</label>
              <input type="password" className="input" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder={t('auth.confirmPassword')} required />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Creating account...' : t('auth.signUpButton')}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">{t('auth.login')}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
