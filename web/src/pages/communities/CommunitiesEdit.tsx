import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import toast from 'react-hot-toast'

export default function CommunitiesEdit() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', type: 'Residential', description: '', city: '', area: '',
    address: '', phoneNumber: '', email: '', website: '', maxMembers: 100, isApproved: false
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => { loadData() }, [id])

  const loadData = async () => {
    try {
      const response = await api.get(`/communities/${id}`)
      const c = response.data
      setForm({
        name: c.name || '',
        type: c.type || 'Residential',
        description: c.description || '',
        city: c.city || '',
        area: c.area || '',
        address: c.address || '',
        phoneNumber: c.phoneNumber || '',
        email: c.email || '',
        website: c.website || '',
        maxMembers: c.maxMembers || 100,
        isApproved: c.isApproved ?? false,
      })
    } catch {
      toast.error('Failed to load community')
      navigate('/communities')
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.put(`/communities/${id}`, form)
      toast.success('Community updated successfully')
      navigate('/communities')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('communities.edit')}</h1>
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
                <label className="label">Type</label>
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
                <input type="number" className="input" value={form.maxMembers} onChange={(e) => setForm({ ...form, maxMembers: parseInt(e.target.value) || 0 })} />
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
              <div>
                <label className="label">Approved</label>
                <select className="input" value={form.isApproved ? 'true' : 'false'} onChange={(e) => setForm({ ...form, isApproved: e.target.value === 'true' })}>
                  <option value="true">Approved</option>
                  <option value="false">Pending</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="label">Description</label>
                <textarea className="input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center gap-4 pt-4 border-t">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? t('common.update') : t('communities.edit')}
              </button>
              <button type="button" onClick={() => navigate('/communities')} className="btn-secondary">{t('common.cancel')}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

