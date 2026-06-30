import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import { DataTable } from '../../components/ui/DataTable'
import toast from 'react-hot-toast'

export default function StopsList() {
  const { t } = useTranslation()
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [search, setSearch] = useState('')
  const [routes, setRoutes] = useState<any[]>([])
  const [routeFilter, setRouteFilter] = useState('')

  useEffect(() => { loadRoutes(); loadData() }, [page, search, routeFilter])

  const loadRoutes = async () => {
    try { const r = await api.get('/routes?pageSize=1000'); setRoutes(r.data?.items || r.data || []) } catch {}
  }

  const loadData = async () => {
    setLoading(true)
    try {
      let url = `/stops?pageNumber=${page}&pageSize=10&searchTerm=${search}`
      if (routeFilter) url += `&routeId=${routeFilter}`
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

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      await api.put(`/stops/${id}`, { isActive: !active })
      toast.success('Updated')
      loadData()
    } catch { toast.error('Failed') }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    try { await api.delete(`/stops/${id}`); toast.success('Deleted'); loadData() }
    catch { toast.error('Delete failed') }
  }

  const columns = [
    { key: 'name', header: t('stops.name'), sortable: true },
    { key: 'orderIndex', header: t('stops.order') },
    { key: 'latitude', header: t('stops.latitude'), render: (item: any) => item.latitude?.toFixed(4) },
    { key: 'longitude', header: t('stops.longitude'), render: (item: any) => item.longitude?.toFixed(4) },
    { key: 'estimatedArrivalTime', header: t('common.time') },
    { key: 'isActive', header: t('common.active'), render: (item: any) => item.isActive ? <span className="badge-success">{t('common.active')}</span> : <span className="badge-error">{t('common.inactive')}</span> },
    { key: 'actions', header: t('common.actions'), render: (item: any) => (
      <div className="flex items-center gap-2">
        <button onClick={() => handleToggleActive(item.id, item.isActive)} className="text-sm font-medium text-yellow-600 hover:text-yellow-700">
          {item.isActive ? t('users.deactivate') : t('users.activate')}
        </button>
        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-700 text-sm font-medium">{t('common.delete')}</button>
      </div>
    )},
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('stops.title')}</h1>
        <p className="text-gray-500 mt-1">{t('stops.list')}</p>
      </div>
      <div className="mb-4">
        <select className="input max-w-xs" value={routeFilter} onChange={(e) => { setRouteFilter(e.target.value); setPage(1) }}>
          <option value="">{t('routes.title')}</option>
          {routes.map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
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
        onExport={() => window.open('/api/stops/export', '_blank')}
      />
    </div>
  )
}

