import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import { DataTable } from '../../components/ui/DataTable'
import toast from 'react-hot-toast'

export default function VehiclesList() {
  const { t } = useTranslation()
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => { loadData() }, [page, search])

  const loadData = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/vehicles?pageNumber=${page}&pageSize=10&searchTerm=${search}`)
      const result = response.data
      setData(result.items)
      setTotalPages(result.totalPages)
      setTotalCount(result.totalCount)
    } catch {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    try { await api.delete(`/vehicles/${id}`); toast.success('Deleted'); loadData() }
    catch { toast.error('Delete failed') }
  }

  const handleToggleVerify = async (id: string, verified: boolean) => {
    try { await api.put(`/vehicles/${id}`, { isVerified: !verified }); toast.success('Updated'); loadData() }
    catch { toast.error('Failed') }
  }

  const columns = [
    { key: 'plateNumber', header: t('vehicles.plate'), sortable: true, render: (item: any) => (
      <div>
        <p className="font-medium text-gray-900">{item.plateNumber}</p>
        <p className="text-xs text-gray-500">{item.brand} {item.model} ({item.year})</p>
      </div>
    )},
    { key: 'capacity', header: t('vehicles.capacity'), render: (item: any) => `${item.capacity} seats` },
    { key: 'color', header: 'Color', render: (item: any) => (
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: item.color?.toLowerCase() }}></div>
        <span>{item.color}</span>
      </div>
    )},
    { key: 'insuranceExpiryDate', header: 'Insurance Expiry', render: (item: any) => {
      const exp = new Date(item.insuranceExpiryDate)
      const isExpired = exp < new Date()
      return <span className={isExpired ? 'badge-error' : 'badge-success'}>{exp.toLocaleDateString()}</span>
    }},
    { key: 'isVerified', header: 'Verified', render: (item: any) => item.isVerified ? <span className="badge-success">Verified</span> : <span className="badge-warning">Pending</span> },
    { key: 'status', header: t('common.status'), render: (item: any) => (
      <span className={item.status === 'Active' ? 'badge-success' : item.status === 'Maintenance' ? 'badge-warning' : 'badge-error'}>{item.status}</span>
    )},
    { key: 'actions', header: t('common.actions'), render: (item: any) => (
      <div className="flex items-center gap-2">
        <button onClick={() => handleToggleVerify(item.id, item.isVerified)} className={`text-sm font-medium ${item.isVerified ? 'text-yellow-600' : 'text-green-600'}`}>
          {item.isVerified ? 'Unverify' : 'Verify'}
        </button>
        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-700 text-sm font-medium">{t('common.delete')}</button>
      </div>
    )},
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('vehicles.title')}</h1>
        <p className="text-gray-500 mt-1">{t('vehicles.list')}</p>
      </div>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        pageNumber={page}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={setPage}
        onSearch={setSearch}
        onCreate={() => navigate('/vehicles/create')}
        createLabel={t('vehicles.title')}
        onExport={() => window.open('/api/vehicles/export', '_blank')}
      />
    </div>
  )
}

