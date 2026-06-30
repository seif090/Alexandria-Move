import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import { DataTable } from '../../components/ui/DataTable'
import toast from 'react-hot-toast'

export default function BookingsList() {
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
      let url = `/bookings?pageNumber=${page}&pageSize=10&searchTerm=${search}`
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

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this booking?')) return
    try { await api.put(`/bookings/${id}/cancel`); toast.success('Booking cancelled'); loadData() }
    catch { toast.error('Failed to cancel') }
  }

  const columns = [
    { key: 'userName', header: t('common.name'), sortable: true },
    { key: 'groupName', header: t('groups.title') },
    { key: 'seatCount', header: 'Seats' },
    { key: 'totalPrice', header: t('common.amount'), render: (item: any) => `$${item.totalPrice?.toFixed(2)}` },
    { key: 'status', header: t('common.status'), render: (item: any) => (
      <span className={item.status === 'Confirmed' ? 'badge-success' : item.status === 'Pending' ? 'badge-warning' : item.status === 'Cancelled' ? 'badge-error' : 'badge-info'}>
        {item.status}
      </span>
    )},
    { key: 'paymentStatus', header: t('payments.title'), render: (item: any) => (
      <span className={item.paymentStatus === 'Paid' ? 'badge-success' : item.paymentStatus === 'Pending' ? 'badge-warning' : 'badge-error'}>
        {item.paymentStatus}
      </span>
    )},
    { key: 'bookingDate', header: t('common.date'), render: (item: any) => new Date(item.bookingDate).toLocaleDateString() },
    { key: 'actions', header: t('common.actions'), render: (item: any) => (
      <div className="flex items-center gap-2">
        {item.status !== 'Cancelled' && (
          <button onClick={() => handleCancel(item.id)} className="text-red-600 hover:text-red-700 text-sm font-medium">{t('common.cancel')}</button>
        )}
      </div>
    )},
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('bookings.title')}</h1>
        <p className="text-gray-500 mt-1">{t('bookings.list')}</p>
      </div>
      <div className="mb-4 flex gap-4">
        <select className="input max-w-xs" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}>
          <option value="">{t('common.status')}</option>
          <option value="Confirmed">{t('common.confirmed')}</option>
          <option value="Pending">{t('common.pending')}</option>
          <option value="Cancelled">{t('common.cancelled')}</option>
          <option value="Completed">{t('common.completed')}</option>
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
        onExport={() => window.open('/api/bookings/export', '_blank')}
      />
    </div>
  )
}

