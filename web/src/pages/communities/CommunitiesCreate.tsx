import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import toast from 'react-hot-toast'

export default function CommunitiesCreate() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', type: 'Residential', description: '', city: '', area: '',
    address: '', phoneNumber: '', email: '', website: '', maxMembers: 100
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.city.trim() || !form.area.trim()) {
      toast.error('Name, city, and area are required')
      return
    }
    setLoading(true)
    try {
      await api.post('/communities', form)
      toast.success('Community created successfully')
      navigate('/communities')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create community')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('communities.create')}</h1>
        <p className="text-gray-500 mt-1">{t('communities.list')}</p>
      </div>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="label">Community Name *</label>
                <input type="text" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="label">Type *</label>
                <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="Residential">Residential</option>
                  <option value="Company">Company</option>
                  <option value="School">School</option>
                  <option value="University">University</option>
                  <option value="Organization">Organization</option>
                </select>
              </div>
              <div>
                <label className="label">Max Members</label>
                <input type="number" className="input" value={form.maxMembers} onChange={(e) => setForm({ ...form, maxMembers: parseInt(e.target.value) || 0 })} min={1} />
              </div>
              <div>
                <label className="label">City *</label>
                <input type="text" className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
              </div>
              <div>
                <label className="label">Area *</label>
                <input type="text" className="input" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} required />
              </div>
              <div>
                <label className="label">Address</label>
                <input type="text" className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
              <div>
                <label className="label">Phone Number</label>
                <input type="tel" className="input" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="label">Website</label>
                <input type="url" className="input" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className="label">Description</label>
                <textarea className="input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center gap-4 pt-4 border-t">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creating...' : t('communities.create')}
              </button>
              <button type="button" onClick={() => navigate('/communities')} className="btn-secondary">{t('common.cancel')}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
