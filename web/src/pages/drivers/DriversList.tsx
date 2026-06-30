import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import { DataTable } from '../../components/ui/DataTable'
import toast from 'react-hot-toast'

export default function DriversList() {
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
      const response = await api.get(`/drivers?pageNumber=${page}&pageSize=10&searchTerm=${search}`)
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
    try { await api.delete(`/drivers/${id}`); toast.success('Deleted'); loadData() }
    catch { toast.error('Delete failed') }
  }

  const handleToggleVerify = async (id: string, verified: boolean) => {
    try { await api.put(`/drivers/${id}`, { isVerified: !verified }); toast.success('Updated'); loadData() }
    catch { toast.error('Failed') }
  }

  const columns = [
    { key: 'user', header: t('drivers.title'), sortable: true, render: (item: any) => (
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
          <span className="text-sm font-medium text-primary-700">{item.user?.fullName?.charAt(0)}</span>
        </div>
        <div>
          <p className="font-medium text-gray-900">{item.user?.fullName}</p>
          <p className="text-xs text-gray-500">License: {item.licenseNumber}</p>
        </div>
      </div>
    )},
    { key: 'yearsOfExperience', header: 'Experience', render: (item: any) => `${item.yearsOfExperience} yrs` },
    { key: 'rating', header: t('drivers.rating'), render: (item: any) => (
      <span className="badge-success">{item.rating?.toFixed(1)} / 5.0</span>
    )},
    { key: 'totalTrips', header: t('drivers.totalTrips') },
    { key: 'safetyScore', header: t('drivers.safetyScore'), render: (item: any) => (
      <div className="flex items-center gap-2">
        <div className="w-20 bg-gray-200 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${item.safetyScore || 0}%` }}></div>
        </div>
        <span className="text-xs">{item.safetyScore || 0}%</span>
      </div>
    )},
    { key: 'isVerified', header: 'Verified', render: (item: any) => item.isVerified ? <span className="badge-success">Verified</span> : <span className="badge-warning">Pending</span> },
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
        <h1 className="text-2xl font-bold text-gray-900">{t('drivers.title')}</h1>
        <p className="text-gray-500 mt-1">{t('drivers.list')}</p>
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
        onCreate={() => navigate('/drivers/create')}
        createLabel={t('drivers.create')}
        onExport={() => window.open('/api/drivers/export', '_blank')}
      />
    </div>
  )
}

