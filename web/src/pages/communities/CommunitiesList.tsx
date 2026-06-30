import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import { DataTable } from '../../components/ui/DataTable'
import toast from 'react-hot-toast'

export default function CommunitiesList() {
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
      const response = await api.get(`/communities?pageNumber=${page}&pageSize=10&searchTerm=${search}`)
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
    if (!confirm('Are you sure you want to delete this community?')) return
    try {
      await api.delete(`/communities/${id}`)
      toast.success('Deleted successfully')
      loadData()
    } catch {
      toast.error('Delete failed')
    }
  }

  const handleToggleApproval = async (id: string, approved: boolean) => {
    try {
      await api.put(`/communities/${id}`, { isApproved: !approved })
      toast.success(`Community ${!approved ? 'approved' : 'unapproved'}`)
      loadData()
    } catch {
      toast.error('Failed to update')
    }
  }

  const columns = [
    { key: 'name', header: t('communities.name'), sortable: true, render: (item: any) => (
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-primary-100 flex items-center justify-center">
          <span className="text-sm font-medium text-primary-700">{item.name?.charAt(0)}</span>
        </div>
        <div>
          <p className="font-medium text-gray-900">{item.name}</p>
          <p className="text-xs text-gray-500">{item.city}, {item.area}</p>
        </div>
      </div>
    )},
    { key: 'type', header: t('common.status') },
    { key: 'memberCount', header: t('communities.members'), render: (item: any) => `${item.memberCount ?? 0}/${item.maxMembers ?? 0}` },
    { key: 'isApproved', header: t('common.status'), render: (item: any) => item.isApproved ? <span className="badge-success">Approved</span> : <span className="badge-warning">Pending</span> },
    { key: 'actions', header: t('common.actions'), render: (item: any) => (
      <div className="flex items-center gap-2">
        <Link to={`/communities/${item.id}/edit`} className="text-primary-600 hover:text-primary-700 text-sm font-medium">{t('common.edit')}</Link>
        <button onClick={() => handleToggleApproval(item.id, item.isApproved)} className="text-sm font-medium text-yellow-600 hover:text-yellow-700">
          {item.isApproved ? 'Unapprove' : t('drivers.approve')}
        </button>
        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-700 text-sm font-medium">{t('common.delete')}</button>
      </div>
    )},
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('communities.title')}</h1>
        <p className="text-gray-500 mt-1">{t('communities.list')}</p>
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
        onCreate={() => navigate('/communities/create')}
        createLabel={t('communities.create')}
        onExport={() => window.open('/api/communities/export', '_blank')}
      />
    </div>
  )
}

