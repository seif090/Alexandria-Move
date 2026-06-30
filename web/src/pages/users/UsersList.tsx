import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import { DataTable } from '../../components/ui/DataTable'
import toast from 'react-hot-toast'

export default function UsersList() {
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
      const response = await api.get(`/users?pageNumber=${page}&pageSize=10&searchTerm=${search}`)
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
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      await api.delete(`/users/${id}`)
      toast.success('Deleted successfully')
      loadData()
    } catch {
      toast.error('Delete failed')
    }
  }

  const columns = [
    { key: 'fullName', header: t('common.name'), sortable: true, render: (item: any) => (
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
          <span className="text-sm font-medium text-primary-700">{item.fullName?.charAt(0)}</span>
        </div>
        <div>
          <p className="font-medium text-gray-900">{item.fullName}</p>
          <p className="text-xs text-gray-500">{item.email}</p>
        </div>
      </div>
    )},
    { key: 'phoneNumber', header: t('common.phone') },
    { key: 'status', header: t('common.status'), render: (item: any) => (
      <span className={item.status === 'Active' ? 'badge-success' : item.status === 'Inactive' ? 'badge-warning' : item.status === 'Suspended' ? 'badge-error' : 'badge-info'}>
        {item.status}
      </span>
    )},
    { key: 'isVerified', header: 'Verified', render: (item: any) => item.isVerified ? <span className="badge-success">Verified</span> : <span className="badge-warning">Unverified</span> },
    { key: 'registrationDate', header: t('common.date'), render: (item: any) => new Date(item.registrationDate).toLocaleDateString() },
    { key: 'roles', header: t('users.role'), render: (item: any) => item.roles?.map((r: string) => <span key={r} className="badge-info mr-1">{r}</span>) },
    { key: 'actions', header: t('common.actions'), render: (item: any) => (
      <div className="flex items-center gap-2">
        <Link to={`/users/${item.id}/edit`} className="text-primary-600 hover:text-primary-700 text-sm font-medium">{t('common.edit')}</Link>
        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-700 text-sm font-medium">{t('common.delete')}</button>
      </div>
    )},
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('users.title')}</h1>
        <p className="text-gray-500 mt-1">{t('users.list')}</p>
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
        onCreate={() => navigate('/users/create')}
        createLabel={t('users.create')}
        onExport={() => window.open('/api/users/export', '_blank')}
      />
    </div>
  )
}
