import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import { DataTable } from '../../components/ui/DataTable'
import toast from 'react-hot-toast'

export default function AuditLogs() {
  const { t } = useTranslation()
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('')

  useEffect(() => { loadData() }, [page, search, actionFilter])

  const loadData = async () => {
    setLoading(true)
    try {
      let url = `/audit-logs?pageNumber=${page}&pageSize=10&searchTerm=${search}`
      if (actionFilter) url += `&action=${actionFilter}`
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

  const columns = [
    { key: 'timestamp', header: t('audit.timestamp'), sortable: true, render: (item: any) => new Date(item.timestamp).toLocaleString() },
    { key: 'userName', header: t('audit.user'), render: (item: any) => item.userName || 'System' },
    { key: 'action', header: t('audit.action'), render: (item: any) => <span className="badge-info">{item.action}</span> },
    { key: 'entityType', header: t('audit.resource'), render: (item: any) => <span className="text-xs font-mono">{item.entityType}</span> },
    { key: 'entityId', header: t('audit.resource') },
    { key: 'ipAddress', header: t('audit.ipAddress'), render: (item: any) => <span className="text-xs">{item.ipAddress}</span> },
    { key: 'changes', header: t('audit.details'), render: (item: any) => (
      <div className="text-xs max-w-xs">
        {item.oldValues && <div className="text-red-600 truncate">Old: {item.oldValues}</div>}
        {item.newValues && <div className="text-green-600 truncate">New: {item.newValues}</div>}
      </div>
    )},
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('audit.title')}</h1>
        <p className="text-gray-500 mt-1">{t('audit.list')}</p>
      </div>
      <div className="mb-4">
        <select className="input max-w-xs" value={actionFilter} onChange={(e) => { setActionFilter(e.target.value); setPage(1) }}>
          <option value="">{t('audit.action')}</option>
          <option value="Create">Create</option>
          <option value="Update">Update</option>
          <option value="Delete">Delete</option>
          <option value="Login">Login</option>
          <option value="Logout">Logout</option>
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
        onExport={() => window.open('/api/audit-logs/export', '_blank')}
      />
    </div>
  )
}

