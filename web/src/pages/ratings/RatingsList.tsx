import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import { DataTable } from '../../components/ui/DataTable'
import toast from 'react-hot-toast'

export default function RatingsList() {
  const { t } = useTranslation()
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [search, setSearch] = useState('')

  useEffect(() => { loadData() }, [page, search])

  const loadData = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/ratings?pageNumber=${page}&pageSize=10&searchTerm=${search}`)
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
    try { await api.delete(`/ratings/${id}`); toast.success('Deleted'); loadData() }
    catch { toast.error('Delete failed') }
  }

  const columns = [
    { key: 'raterName', header: t('common.name'), sortable: true },
    { key: 'ratedEntityType', header: 'Entity Type' },
    { key: 'score', header: t('ratings.rating'), render: (item: any) => (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`text-sm ${star <= item.score ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
        ))}
        <span className="text-xs text-gray-500 ml-1">({item.score})</span>
      </div>
    )},
    { key: 'reviewText', header: t('ratings.review'), render: (item: any) => (
      <span className="text-xs text-gray-600 max-w-xs truncate block">{item.reviewText || '-'}</span>
    )},
    { key: 'createdAt', header: t('common.date'), render: (item: any) => new Date(item.createdAt).toLocaleDateString() },
    { key: 'actions', header: t('common.actions'), render: (item: any) => (
      <div className="flex items-center gap-2">
        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-700 text-sm font-medium">{t('common.delete')}</button>
      </div>
    )},
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('ratings.title')}</h1>
        <p className="text-gray-500 mt-1">{t('ratings.list')}</p>
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
        onExport={() => window.open('/api/ratings/export', '_blank')}
      />
    </div>
  )
}

