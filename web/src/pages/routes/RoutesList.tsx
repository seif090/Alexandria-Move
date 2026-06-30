import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import { DataTable } from '../../components/ui/DataTable'
import toast from 'react-hot-toast'

export default function RoutesList() {
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
      const response = await api.get(`/routes?pageNumber=${page}&pageSize=10&searchTerm=${search}`)
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
    try {
      await api.delete(`/routes/${id}`)
      toast.success('Deleted successfully')
      loadData()
    } catch {
      toast.error('Delete failed')
    }
  }

  const columns = [
    { key: 'name', header: t('routes.name'), sortable: true, render: (item: any) => (
      <div>
        <p className="font-medium text-gray-900">{item.name}</p>
        <p className="text-xs text-gray-500">{item.communityName}</p>
      </div>
    )},
    { key: 'startLocation', header: t('routes.from'), render: (item: any) => <span className="text-sm">{item.startLocation}</span> },
    { key: 'endLocation', header: t('routes.to'), render: (item: any) => <span className="text-sm">{item.endLocation}</span> },
    { key: 'distance', header: t('routes.distance'), render: (item: any) => `${item.distance} km` },
    { key: 'estimatedTime', header: t('routes.duration'), render: (item: any) => `${item.estimatedTime} min` },
    { key: 'status', header: t('common.status'), render: (item: any) => (
      <span className={item.status === 'Active' ? 'badge-success' : 'badge-warning'}>{item.status}</span>
    )},
    { key: 'actions', header: t('common.actions'), render: (item: any) => (
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(`/routes/create?id=${item.id}`)} className="text-primary-600 hover:text-primary-700 text-sm font-medium">{t('common.edit')}</button>
        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-700 text-sm font-medium">{t('common.delete')}</button>
      </div>
    )},
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('routes.title')}</h1>
        <p className="text-gray-500 mt-1">{t('routes.list')}</p>
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
        onCreate={() => navigate('/routes/create')}
        createLabel={t('routes.title')}
        onExport={() => window.open('/api/routes/export', '_blank')}
      />
    </div>
  )
}

