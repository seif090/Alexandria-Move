import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import { DataTable } from '../../components/ui/DataTable'
import toast from 'react-hot-toast'

export default function MembersList() {
  const { t } = useTranslation()
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [search, setSearch] = useState('')
  const [communities, setCommunities] = useState<any[]>([])
  const [communityFilter, setCommunityFilter] = useState('')

  useEffect(() => { loadCommunities(); loadData() }, [page, search, communityFilter])

  const loadCommunities = async () => {
    try {
      const res = await api.get('/communities?pageSize=1000')
      setCommunities(res.data?.items || res.data || [])
    } catch {}
  }

  const loadData = async () => {
    setLoading(true)
    try {
      let url = `/members?pageNumber=${page}&pageSize=10&searchTerm=${search}`
      if (communityFilter) url += `&communityId=${communityFilter}`
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    try {
      await api.delete(`/community-members/${id}`)
      toast.success('Deleted successfully')
      loadData()
    } catch {
      toast.error('Delete failed')
    }
  }

  const columns = [
    { key: 'user', header: t('members.title'), render: (item: any) => (
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
          <span className="text-sm font-medium text-primary-700">{item.user?.fullName?.charAt(0)}</span>
        </div>
        <div>
          <p className="font-medium text-gray-900">{item.user?.fullName}</p>
          <p className="text-xs text-gray-500">{item.user?.email}</p>
        </div>
      </div>
    )},
    { key: 'communityName', header: t('communities.title'), render: (item: any) => item.communityName || '-' },
    { key: 'role', header: t('members.role'), render: (item: any) => <span className="badge-info">{item.role}</span> },
    { key: 'status', header: t('common.status'), render: (item: any) => (
      <span className={item.status === 'Active' ? 'badge-success' : 'badge-warning'}>{item.status}</span>
    )},
    { key: 'joinedAt', header: t('members.joined'), render: (item: any) => new Date(item.joinedAt).toLocaleDateString() },
    { key: 'actions', header: t('common.actions'), render: (item: any) => (
      <div className="flex items-center gap-2">
        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-700 text-sm font-medium">{t('common.remove')}</button>
      </div>
    )},
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('members.title')}</h1>
        <p className="text-gray-500 mt-1">{t('members.list')}</p>
      </div>
      <div className="mb-4">
        <select className="input max-w-xs" value={communityFilter} onChange={(e) => { setCommunityFilter(e.target.value); setPage(1) }}>
          <option value="">{t('communities.title')}</option>
          {communities.map((c: any) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
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
        onExport={() => window.open('/api/community-members/export', '_blank')}
      />
    </div>
  )
}

