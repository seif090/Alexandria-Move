import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import { DataTable } from '../../components/ui/DataTable'
import toast from 'react-hot-toast'

export default function RolesList() {
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
      const response = await api.get(`/roles?pageNumber=${page}&pageSize=10&searchTerm=${search}`)
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
    if (!confirm('Are you sure you want to delete this role?')) return
    try {
      await api.delete(`/roles/${id}`)
      toast.success('Deleted successfully')
      loadData()
    } catch {
      toast.error('Delete failed')
    }
  }

  const columns = [
    { key: 'name', header: t('common.name'), sortable: true, render: (item: any) => (
      <span className="font-medium text-gray-900">{item.name}</span>
    )},
    { key: 'description', header: t('common.description') },
    { key: 'isSystemRole', header: 'System Role' },
    { key: 'permissions', header: t('roles.permissions'), render: (item: any) => <span>{item.permissions?.length || 0} permissions</span> },
    { key: 'actions', header: t('common.actions'), render: (item: any) => (
      item.isSystemRole ? <span className="text-gray-400 text-sm">System</span> : (
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(`/roles/create?id=${item.id}`)} className="text-primary-600 hover:text-primary-700 text-sm font-medium">{t('common.edit')}</button>
          <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-700 text-sm font-medium">{t('common.delete')}</button>
        </div>
      )
    )},
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('roles.title')}</h1>
        <p className="text-gray-500 mt-1">{t('roles.list')}</p>
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
        onCreate={() => navigate('/roles/create')}
        createLabel={t('roles.title')}
        onExport={() => window.open('/api/roles/export', '_blank')}
      />
    </div>
  )
}

