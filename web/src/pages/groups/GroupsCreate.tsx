import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import toast from 'react-hot-toast'

export default function GroupsCreate() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [communities, setCommunities] = useState<any[]>([])
  const [routes, setRoutes] = useState<any[]>([])
  const [drivers, setDrivers] = useState<any[]>([])
  const [vehicles, setVehicles] = useState<any[]>([])
  const [form, setForm] = useState({
    communityId: '', routeId: '', driverId: '', vehicleId: '', name: '',
    capacity: 10, departureTime: '07:00', returnTime: '16:00',
    workingDays: 'Mon-Fri', price: 0, status: 'Active'
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    Promise.all([
      api.get('/communities?pageSize=1000'),
      api.get('/routes?pageSize=1000'),
      api.get('/drivers?pageSize=1000'),
      api.get('/vehicles?pageSize=1000'),
    ]).then(([c, r, d, v]) => {
      setCommunities(c.data?.items || c.data || [])
      setRoutes(r.data?.items || r.data || [])
      setDrivers(d.data?.items || d.data || [])
      setVehicles(v.data?.items || v.data || [])
    }).catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.communityId) {
      toast.error('Name and community are required')
      return
    }
    setLoading(true)
    try {
      await api.post('/groups', form)
      toast.success('Group created successfully')
      navigate('/groups')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create group')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Group</h1>
        <p className="text-gray-500 mt-1">{t('groups.list')}</p>
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
                <label className="label">Group Name *</label>
                <input type="text" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="label">Route</label>
                <select className="input" value={form.routeId} onChange={(e) => setForm({ ...form, routeId: e.target.value })}>
                  <option value="">Select route</option>
                  {routes.filter(r => !form.communityId || r.communityId === form.communityId).map((r: any) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Driver</label>
                <select className="input" value={form.driverId} onChange={(e) => setForm({ ...form, driverId: e.target.value })}>
                  <option value="">Select driver</option>
                  {drivers.map((d: any) => <option key={d.id} value={d.id}>{d.user?.fullName || d.id}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Vehicle</label>
                <select className="input" value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}>
                  <option value="">Select vehicle</option>
                  {vehicles.map((v: any) => <option key={v.id} value={v.id}>{v.plateNumber} - {v.model}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Capacity</label>
                <input type="number" className="input" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) || 0 })} min={1} />
              </div>
              <div>
                <label className="label">Departure Time</label>
                <input type="time" className="input" value={form.departureTime} onChange={(e) => setForm({ ...form, departureTime: e.target.value })} />
              </div>
              <div>
                <label className="label">Return Time</label>
                <input type="time" className="input" value={form.returnTime} onChange={(e) => setForm({ ...form, returnTime: e.target.value })} />
              </div>
              <div>
                <label className="label">Working Days</label>
                <input type="text" className="input" value={form.workingDays} onChange={(e) => setForm({ ...form, workingDays: e.target.value })} placeholder="Mon-Fri" />
              </div>
              <div>
                <label className="label">Price ($)</label>
                <input type="number" className="input" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} step="0.01" min={0} />
              </div>
              <div>
                <label className="label">Status</label>
                <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="Active">Active</option>
                  <option value="Full">Full</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-4 border-t">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creating...' : t('groups.title')}
              </button>
              <button type="button" onClick={() => navigate('/groups')} className="btn-secondary">{t('common.cancel')}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
