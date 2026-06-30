import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import toast from 'react-hot-toast'

export default function RoutesCreate() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [communities, setCommunities] = useState<any[]>([])
  const [form, setForm] = useState({
    communityId: '', name: '', startLocation: '', endLocation: '',
    distance: 0, estimatedTime: 0, status: 'Active',
    startLatitude: 0, startLongitude: 0, endLatitude: 0, endLongitude: 0
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/communities?pageSize=1000').then(r => setCommunities(r.data?.items || r.data || [])).catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.communityId) {
      toast.error('Name and community are required')
      return
    }
    setLoading(true)
    try {
      await api.post('/routes', form)
      toast.success('Route created successfully')
      navigate('/routes')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create route')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Route</h1>
        <p className="text-gray-500 mt-1">{t('routes.list')}</p>
      </div>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="label">Community *</label>
                <select className="input" value={form.communityId} onChange={(e) => setForm({ ...form, communityId: e.target.value })} required>
                  <option value="">Select community</option>
                  {communities.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="label">Route Name *</label>
                <input type="text" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., Downtown Express" required />
              </div>
              <div>
                <label className="label">Start Location *</label>
                <input type="text" className="input" value={form.startLocation} onChange={(e) => setForm({ ...form, startLocation: e.target.value })} required />
              </div>
              <div>
                <label className="label">End Location *</label>
                <input type="text" className="input" value={form.endLocation} onChange={(e) => setForm({ ...form, endLocation: e.target.value })} required />
              </div>
              <div>
                <label className="label">Distance (km)</label>
                <input type="number" className="input" value={form.distance} onChange={(e) => setForm({ ...form, distance: parseFloat(e.target.value) || 0 })} step="0.1" />
              </div>
              <div>
                <label className="label">Estimated Time (min)</label>
                <input type="number" className="input" value={form.estimatedTime} onChange={(e) => setForm({ ...form, estimatedTime: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <label className="label">Start Latitude</label>
                <input type="number" className="input" value={form.startLatitude} onChange={(e) => setForm({ ...form, startLatitude: parseFloat(e.target.value) || 0 })} step="0.0001" />
              </div>
              <div>
                <label className="label">Start Longitude</label>
                <input type="number" className="input" value={form.startLongitude} onChange={(e) => setForm({ ...form, startLongitude: parseFloat(e.target.value) || 0 })} step="0.0001" />
              </div>
              <div>
                <label className="label">End Latitude</label>
                <input type="number" className="input" value={form.endLatitude} onChange={(e) => setForm({ ...form, endLatitude: parseFloat(e.target.value) || 0 })} step="0.0001" />
              </div>
              <div>
                <label className="label">End Longitude</label>
                <input type="number" className="input" value={form.endLongitude} onChange={(e) => setForm({ ...form, endLongitude: parseFloat(e.target.value) || 0 })} step="0.0001" />
              </div>
              <div>
                <label className="label">Status</label>
                <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-4 border-t">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creating...' : t('routes.title')}
              </button>
              <button type="button" onClick={() => navigate('/routes')} className="btn-secondary">{t('common.cancel')}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
