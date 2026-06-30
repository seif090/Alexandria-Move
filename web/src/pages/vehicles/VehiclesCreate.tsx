import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import toast from 'react-hot-toast'

export default function VehiclesCreate() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    plateNumber: '', model: '', brand: '', year: new Date().getFullYear(),
    capacity: 4, color: '', insuranceNumber: '', insuranceExpiryDate: '', status: 'Active'
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.plateNumber.trim() || !form.model.trim() || !form.brand.trim()) {
      toast.error('Plate number, model, and brand are required')
      return
    }
    setLoading(true)
    try {
      await api.post('/vehicles', form)
      toast.success('Vehicle created successfully')
      navigate('/vehicles')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create vehicle')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Vehicle</h1>
        <p className="text-gray-500 mt-1">{t('vehicles.list')}</p>
      </div>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Plate Number *</label>
                <input type="text" className="input" value={form.plateNumber} onChange={(e) => setForm({ ...form, plateNumber: e.target.value })} required />
              </div>
              <div>
                <label className="label">Brand *</label>
                <input type="text" className="input" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
              </div>
              <div>
                <label className="label">Model *</label>
                <input type="text" className="input" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} required />
              </div>
              <div>
                <label className="label">Year</label>
                <input type="number" className="input" value={form.year} onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) || new Date().getFullYear() })} />
              </div>
              <div>
                <label className="label">Capacity</label>
                <input type="number" className="input" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) || 4 })} min={1} />
              </div>
              <div>
                <label className="label">Color</label>
                <input type="text" className="input" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} placeholder="e.g., White" />
              </div>
              <div>
                <label className="label">Insurance Number</label>
                <input type="text" className="input" value={form.insuranceNumber} onChange={(e) => setForm({ ...form, insuranceNumber: e.target.value })} />
              </div>
              <div>
                <label className="label">Insurance Expiry</label>
                <input type="date" className="input" value={form.insuranceExpiryDate} onChange={(e) => setForm({ ...form, insuranceExpiryDate: e.target.value })} />
              </div>
              <div>
                <label className="label">Status</label>
                <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-4 border-t">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creating...' : t('vehicles.title')}
              </button>
              <button type="button" onClick={() => navigate('/vehicles')} className="btn-secondary">{t('common.cancel')}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
