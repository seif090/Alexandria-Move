import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import toast from 'react-hot-toast'

export default function UsersEdit() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '', email: '', phoneNumber: '', dateOfBirth: '', gender: '', address: '', roles: ['Passenger'], status: 'Active'
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => { loadUser() }, [id])

  const loadUser = async () => {
    try {
      const response = await api.get(`/users/${id}`)
      const user = response.data
      setForm({
        fullName: user.fullName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        gender: user.gender || '',
        address: user.address || '',
        roles: user.roles || ['Passenger'],
        status: user.status || 'Active',
      })
    } catch {
      toast.error('Failed to load user')
      navigate('/users')
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.put(`/users/${id}`, form)
      toast.success('User updated successfully')
      navigate('/users')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update user')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('users.edit')}</h1>
        <p className="text-gray-500 mt-1">{t('users.list')}</p>
      </div>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name *</label>
                <input type="text" className="input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
              </div>
              <div>
                <label className="label">Email *</label>
                <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div>
                <label className="label">Phone Number</label>
                <input type="tel" className="input" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
              </div>
              <div>
                <label className="label">Date of Birth</label>
                <input type="date" className="input" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
              </div>
              <div>
                <label className="label">Gender</label>
                <select className="input" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="label">Status</label>
                <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                  <option value="PendingVerification">Pending Verification</option>
                </select>
              </div>
              <div>
                <label className="label">Roles</label>
                <select className="input" multiple value={form.roles} onChange={(e) => setForm({ ...form, roles: Array.from(e.target.selectedOptions, (o) => o.value) })}>
                  <option value="SuperAdmin">Super Admin</option>
                  <option value="CommunityAdmin">Community Admin</option>
                  <option value="Passenger">Passenger</option>
                  <option value="Driver">Driver</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="label">Address</label>
                <textarea className="input" rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center gap-4 pt-4 border-t">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? t('common.update') : t('users.edit')}
              </button>
              <button type="button" onClick={() => navigate('/users')} className="btn-secondary">{t('common.cancel')}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

