import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import { DataTable } from '../../components/ui/DataTable'
import toast from 'react-hot-toast'

export default function NotificationsList() {
  const { t } = useTranslation()
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  useEffect(() => { loadData() }, [page, search, typeFilter])

  const loadData = async () => {
    setLoading(true)
    try {
      let url = `/notifications?pageNumber=${page}&pageSize=10&searchTerm=${search}`
      if (typeFilter) url += `&type=${typeFilter}`
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

  const handleMarkRead = async (id: string) => {
    try { await api.put(`/notifications/${id}/read`); toast.success('Marked as read'); loadData() }
    catch { toast.error('Failed') }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    try { await api.delete(`/notifications/${id}`); toast.success('Deleted'); loadData() }
    catch { toast.error('Delete failed') }
  }

  const columns = [
    { key: 'title', header: t('notifications.titleLabel'), sortable: true, render: (item: any) => (
      <div className={item.isRead ? '' : 'font-semibold'}>
        <p>{item.title}</p>
        <p className="text-xs text-gray-500">{item.body?.substring(0, 60)}...</p>
      </div>
    )},
    { key: 'type', header: t('notifications.type'), render: (item: any) => <span className="badge-info">{item.type}</span> },
    { key: 'event', header: 'Event' },
    { key: 'isRead', header: t('common.status'), render: (item: any) => item.isRead ? <span className="badge-success">Read</span> : <span className="badge-warning">Unread</span> },
    { key: 'sentAt', header: t('common.date'), render: (item: any) => new Date(item.sentAt).toLocaleString() },
    { key: 'actions', header: t('common.actions'), render: (item: any) => (
      <div className="flex items-center gap-2">
        {!item.isRead && <button onClick={() => handleMarkRead(item.id)} className="text-primary-600 hover:text-primary-700 text-sm font-medium">{t('common.update')}</button>}
        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-700 text-sm font-medium">{t('common.delete')}</button>
      </div>
    )},
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('notifications.title')}</h1>
        <p className="text-gray-500 mt-1">{t('notifications.list')}</p>
      </div>
      <div className="mb-4">
        <select className="input max-w-xs" value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1) }}>
          <option value="">{t('notifications.type')}</option>
          <option value="System">System</option>
          <option value="Booking">Booking</option>
          <option value="Trip">Trip</option>
          <option value="Payment">Payment</option>
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
        onExport={() => window.open('/api/notifications/export', '_blank')}
      />
    </div>
  )
}

