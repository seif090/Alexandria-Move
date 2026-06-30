import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import toast from 'react-hot-toast'

export default function DriversCreate() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [users, setUsers] = useState<any[]>([])
  const [form, setForm] = useState({
    userId: '', licenseNumber: '', licenseExpiryDate: '', yearsOfExperience: 0
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/users?pageSize=1000').then(r => setUsers(r.data?.items || r.data || [])).catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.userId || !form.licenseNumber.trim()) {
      toast.error('User and license number are required')
      return
    }
    setLoading(true)
    try {
      await api.post('/drivers', form)
      toast.success('Driver created successfully')
      navigate('/drivers')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create driver')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('drivers.create')}</h1>
        <p className="text-gray-500 mt-1">{t('drivers.list')}</p>
      </div>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="label">User *</label>
                <select className="input" value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} required>
                  <option value="">Select user</option>
                  {users.map((u: any) => <option key={u.id} value={u.id}>{u.fullName} ({u.email})</option>)}
                </select>
              </div>
              <div>
                <label className="label">License Number *</label>
                <input type="text" className="input" value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} required />
              </div>
              <div>
                <label className="label">License Expiry Date</label>
                <input type="date" className="input" value={form.licenseExpiryDate} onChange={(e) => setForm({ ...form, licenseExpiryDate: e.target.value })} />
              </div>
              <div>
                <label className="label">Years of Experience</label>
                <input type="number" className="input" value={form.yearsOfExperience} onChange={(e) => setForm({ ...form, yearsOfExperience: parseInt(e.target.value) || 0 })} min={0} />
              </div>
            </div>
            <div className="flex items-center gap-4 pt-4 border-t">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creating...' : t('drivers.create')}
              </button>
              <button type="button" onClick={() => navigate('/drivers')} className="btn-secondary">{t('common.cancel')}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
