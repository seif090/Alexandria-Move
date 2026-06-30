import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import { DataTable } from '../../components/ui/DataTable'
import toast from 'react-hot-toast'

export default function PaymentsList() {
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
      let url = `/payments?pageNumber=${page}&pageSize=10&searchTerm=${search}`
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

  const handleRefund = async (id: string) => {
    if (!confirm('Issue a refund for this payment?')) return
    try { await api.post(`/payments/${id}/refund`); toast.success('Refund processed'); loadData() }
    catch { toast.error('Refund failed') }
  }

  const columns = [
    { key: 'userName', header: t('common.name'), sortable: true },
    { key: 'amount', header: t('common.amount'), render: (item: any) => `$${item.amount?.toFixed(2)}` },
    { key: 'method', header: t('payments.method') },
    { key: 'transactionId', header: t('payments.id') },
    { key: 'invoiceNumber', header: 'Invoice' },
    { key: 'status', header: t('common.status'), render: (item: any) => (
      <span className={item.status === 'Completed' ? 'badge-success' : item.status === 'Pending' ? 'badge-warning' : item.status === 'Refunded' ? 'badge-info' : 'badge-error'}>
        {item.status}
      </span>
    )},
    { key: 'paidAt', header: t('common.date'), render: (item: any) => item.paidAt ? new Date(item.paidAt).toLocaleDateString() : '-' },
    { key: 'actions', header: t('common.actions'), render: (item: any) => (
      <div className="flex items-center gap-2">
        {item.status === 'Completed' && (
          <button onClick={() => handleRefund(item.id)} className="text-orange-600 hover:text-orange-700 text-sm font-medium">Refund</button>
        )}
      </div>
    )},
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('payments.title')}</h1>
        <p className="text-gray-500 mt-1">{t('payments.list')}</p>
      </div>
      <div className="mb-4">
        <select className="input max-w-xs" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}>
          <option value="">{t('common.status')}</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
          <option value="Refunded">Refunded</option>
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
        onExport={() => window.open('/api/payments/export', '_blank')}
      />
    </div>
  )
}

