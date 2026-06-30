import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import { DataTable } from '../../components/ui/DataTable'
import toast from 'react-hot-toast'
import { MessageSquare, X } from 'lucide-react'

export default function SupportList() {
  const { t } = useTranslation()
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [replyText, setReplyText] = useState('')
  const [replying, setReplying] = useState(false)

  useEffect(() => { loadData() }, [page, search, statusFilter])

  const loadData = async () => {
    setLoading(true)
    try {
      let url = `/support-tickets?pageNumber=${page}&pageSize=10&searchTerm=${search}`
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

  const handleViewTicket = async (id: string) => {
    try {
      const response = await api.get(`/support-tickets/${id}`)
      setSelectedTicket(response.data)
    } catch {
      toast.error('Failed to load ticket')
    }
  }

  const handleReply = async () => {
    if (!replyText.trim()) return
    setReplying(true)
    try {
      await api.post(`/support-tickets/${selectedTicket.id}/messages`, { message: replyText, isStaff: true })
      toast.success('Reply sent')
      setReplyText('')
      handleViewTicket(selectedTicket.id)
      loadData()
    } catch {
      toast.error('Failed to send reply')
    } finally {
      setReplying(false)
    }
  }

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/support-tickets/${id}`, { status })
      toast.success(`Ticket ${status.toLowerCase()}`)
      loadData()
      if (selectedTicket?.id === id) setSelectedTicket({ ...selectedTicket, status })
    } catch {
      toast.error('Failed to update')
    }
  }

  const columns = [
    { key: 'subject', header: t('support.subject'), sortable: true, render: (item: any) => (
      <div>
        <p className="font-medium text-gray-900">{item.subject}</p>
        <p className="text-xs text-gray-500">{item.userName}</p>
      </div>
    )},
    { key: 'priority', header: t('support.priority'), render: (item: any) => (
      <span className={item.priority === 'High' ? 'badge-error' : item.priority === 'Medium' ? 'badge-warning' : 'badge-info'}>{item.priority}</span>
    )},
    { key: 'status', header: t('common.status'), render: (item: any) => (
      <span className={item.status === 'Open' ? 'badge-error' : item.status === 'InProgress' ? 'badge-warning' : item.status === 'Resolved' ? 'badge-success' : 'badge-info'}>
        {item.status}
      </span>
    )},
    { key: 'createdAt', header: t('common.date'), render: (item: any) => new Date(item.createdAt).toLocaleDateString() },
    { key: 'actions', header: t('common.actions'), render: (item: any) => (
      <div className="flex items-center gap-2">
        <button onClick={() => handleViewTicket(item.id)} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          <MessageSquare className="h-4 w-4 inline mr-1" />{t('common.view')}
        </button>
        {item.status === 'Open' && (
          <button onClick={() => handleUpdateStatus(item.id, 'InProgress')} className="text-blue-600 hover:text-blue-700 text-sm font-medium">Take</button>
        )}
        {item.status === 'InProgress' && (
          <button onClick={() => handleUpdateStatus(item.id, 'Resolved')} className="text-green-600 hover:text-green-700 text-sm font-medium">{t('support.resolved')}</button>
        )}
      </div>
    )},
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('support.title')}</h1>
        <p className="text-gray-500 mt-1">{t('support.list')}</p>
      </div>
      <div className="mb-4">
        <select className="input max-w-xs" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}>
          <option value="">{t('common.status')}</option>
          <option value="Open">{t('support.open')}</option>
          <option value="InProgress">{t('support.inProgress')}</option>
          <option value="Resolved">{t('support.resolved')}</option>
          <option value="Closed">{t('support.closed')}</option>
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
        onExport={() => window.open('/api/support-tickets/export', '_blank')}
      />

      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedTicket.subject}</h3>
                <p className="text-sm text-gray-500">by {selectedTicket.userName} · {new Date(selectedTicket.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600">{selectedTicket.description}</p>
                <div className="flex gap-2 mt-2">
                  <span className={selectedTicket.priority === 'High' ? 'badge-error' : selectedTicket.priority === 'Medium' ? 'badge-warning' : 'badge-info'}>
                    {selectedTicket.priority}
                  </span>
                  <span className={selectedTicket.status === 'Open' ? 'badge-error' : selectedTicket.status === 'InProgress' ? 'badge-warning' : selectedTicket.status === 'Resolved' ? 'badge-success' : 'badge-info'}>
                    {selectedTicket.status}
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-4">
                <h4 className="font-medium text-gray-900">{t('common.message')}</h4>
                {selectedTicket.messages?.map((msg: any) => (
                  <div key={msg.id} className={`p-4 rounded-lg ${msg.isStaff ? 'bg-primary-50 ml-8' : 'bg-gray-50 mr-8'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{msg.senderName}</span>
                      <span className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-600">{msg.message}</p>
                  </div>
                ))}
              </div>

              {selectedTicket.status !== 'Closed' && selectedTicket.status !== 'Resolved' && (
                <div className="space-y-3">
                  <textarea
                    className="input"
                    rows={3}
                    placeholder={t('support.replyPlaceholder')}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button onClick={handleReply} className="btn-primary" disabled={replying || !replyText.trim()}>
                      {replying ? 'Sending...' : t('support.sendReply')}
                    </button>
                    {selectedTicket.status === 'InProgress' && (
                      <button onClick={() => handleUpdateStatus(selectedTicket.id, 'Resolved')} className="btn-secondary">{t('support.resolved')}</button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

