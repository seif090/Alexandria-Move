import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import { DataTable } from '../../components/ui/DataTable'
import toast from 'react-hot-toast'

export default function TripsList() {
  const { t } = useTranslation()
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => { loadData() }, [page, search, statusFilter])

  const loadData = async () => {
    setLoading(true)
    try {
      let url = `/trips?pageNumber=${page}&pageSize=10&searchTerm=${search}`
      if (statusFilter) url += `&status=${statusFilter}`
      const response = await api.get(url)
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

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/trips/${id}`, { status })
      toast.success(`Trip ${status.toLowerCase()}`)
      loadData()
    } catch {
      toast.error('Failed to update')
    }
  }

  const columns = [
    { key: 'groupName', header: t('groups.title'), sortable: true },
    { key: 'driverName', header: t('drivers.title') },
    { key: 'scheduledDate', header: t('common.date'), render: (item: any) => new Date(item.scheduledDate).toLocaleDateString() },
    { key: 'startedAt', header: 'Started', render: (item: any) => item.startedAt ? new Date(item.startedAt).toLocaleString() : '-' },
    { key: 'completedAt', header: t('common.completed'), render: (item: any) => item.completedAt ? new Date(item.completedAt).toLocaleString() : '-' },
    { key: 'status', header: t('common.status'), render: (item: any) => (
      <span className={item.status === 'Completed' ? 'badge-success' : item.status === 'InProgress' ? 'badge-info' : item.status === 'Scheduled' ? 'badge-warning' : 'badge-error'}>
        {item.status}
      </span>
    )},
    { key: 'actions', header: t('common.actions'), render: (item: any) => (
      <div className="flex items-center gap-2">
        {item.status === 'Scheduled' && (
          <button onClick={() => handleUpdateStatus(item.id, 'InProgress')} className="text-blue-600 hover:text-blue-700 text-sm font-medium">Start</button>
        )}
        {item.status === 'InProgress' && (
          <button onClick={() => handleUpdateStatus(item.id, 'Completed')} className="text-green-600 hover:text-green-700 text-sm font-medium">{t('common.completed')}</button>
        )}
        {item.status !== 'Completed' && item.status !== 'Cancelled' && (
          <button onClick={() => handleUpdateStatus(item.id, 'Cancelled')} className="text-red-600 hover:text-red-700 text-sm font-medium">{t('common.cancel')}</button>
        )}
      </div>
    )},
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('trips.title')}</h1>
        <p className="text-gray-500 mt-1">{t('trips.list')}</p>
      </div>
      <div className="mb-4">
        <select className="input max-w-xs" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}>
          <option value="">{t('common.status')}</option>
          <option value="Scheduled">Scheduled</option>
          <option value="InProgress">In Progress</option>
          <option value="Completed">{t('common.completed')}</option>
          <option value="Cancelled">{t('common.cancelled')}</option>
        </select>
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
        onExport={() => window.open('/api/trips/export', '_blank')}
      />
    </div>
  )
}

