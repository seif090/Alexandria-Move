import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Search, Download, Upload } from 'lucide-react'

interface Column<T> {
  key: string
  header: string
  render?: (item: T) => React.ReactNode
  sortable?: boolean
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  pageNumber: number
  totalPages: number
  totalCount: number
  onPageChange: (page: number) => void
  onSearch?: (term: string) => void
  onExport?: () => void
  onImport?: () => void
  onCreate?: () => void
  createLabel?: string
}

export function DataTable<T>({
  columns, data, loading, pageNumber, totalPages, totalCount,
  onPageChange, onSearch, onExport, onImport, onCreate, createLabel
}: DataTableProps<T>) {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortKey, setSortKey] = useState<string>('')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    onSearch?.(value)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-sm relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            className="input pl-10"
            placeholder={t('common.search')}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          {onExport && (
            <button onClick={onExport} className="btn-secondary">
              <Download className="h-4 w-4 mr-2" />
              {t('common.export')}
            </button>
          )}
          {onImport && (
            <button onClick={onImport} className="btn-secondary">
              <Upload className="h-4 w-4 mr-2" />
              {t('common.import')}
            </button>
          )}
          {onCreate && (
            <button onClick={onCreate} className="btn-primary">
              + {createLabel}
            </button>
          )}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${col.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.header}
                      {col.sortable && sortKey === col.key && (
                        sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                    {t('dataTable.noResults')}
                  </td>
                </tr>
              ) : (
                data.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4 text-sm">
                        {col.render ? col.render(item) : String((item as any)[col.key] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {t('dataTable.page')} {pageNumber} {t('dataTable.of')} {totalPages} ({t('dataTable.totalRows')}: {totalCount})
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(pageNumber - 1)}
                disabled={pageNumber <= 1}
                className="btn-secondary px-3 py-1"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const start = Math.max(1, pageNumber - 2)
                const page = start + i
                if (page > totalPages) return null
                return (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1 text-sm rounded-lg ${page === pageNumber ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    {page}
                  </button>
                )
              })}
              <button
                onClick={() => onPageChange(pageNumber + 1)}
                disabled={pageNumber >= totalPages}
                className="btn-secondary px-3 py-1"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
