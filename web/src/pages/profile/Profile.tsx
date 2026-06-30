import { useState, useEffect } from 'react'
import { useAuth } from '../../store/auth'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import toast from 'react-hot-toast'

export default function Profile() {
  const { t } = useTranslation()
  const { user, loadUser } = useAuth()
  const [form, setForm] = useState({
    fullName: '', email: '', phoneNumber: '', dateOfBirth: '', gender: '', address: ''
  })
  const [loading, setLoading] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [passwordLoading, setPasswordLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        gender: user.gender || '',
        address: user.address || '',
      })
    }
  }, [user])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/update-profile', form)
      toast.success('Profile updated successfully')
      loadUser()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setPasswordLoading(true)
    try {
      await api.post('/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      toast.success('Password changed successfully')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('profile.title')}</h1>
        <p className="text-gray-500 mt-1">Manage your account information</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">{t('profile.personalInfo')}</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="flex items-center gap-6 mb-6">
              <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-2xl font-medium text-primary-700">{form.fullName?.charAt(0)?.toUpperCase()}</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{form.fullName}</p>
                <p className="text-sm text-gray-500">{form.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">{t('profile.fullName')}</label>
                <input type="text" className="input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
              </div>
              <div>
                <label className="label">{t('profile.email')}</label>
                <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div>
                <label className="label">{t('profile.phone')}</label>
                <input type="tel" className="input" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
              </div>
              <div>
                <label className="label">{t('common.date')}</label>
                <input type="date" className="input" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
              </div>
              <div>
                <label className="label">Gender</label>
                <select className="input" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="label">Address</label>
                <textarea className="input" rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
            </div>
            <div className="flex pt-4 border-t">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? t('common.save') : t('profile.saveChanges')}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">{t('profile.changePassword')}</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">{t('profile.currentPassword')}</label>
                <input type="password" className="input" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} required />
              </div>
              <div></div>
              <div>
                <label className="label">{t('profile.newPassword')}</label>
                <input type="password" className="input" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required />
              </div>
              <div>
                <label className="label">{t('profile.confirmNewPassword')}</label>
                <input type="password" className="input" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} required />
              </div>
            </div>
            <div className="flex pt-4 border-t">
              <button type="submit" className="btn-primary" disabled={passwordLoading}>
                {passwordLoading ? t('common.save') : t('profile.changePassword')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
