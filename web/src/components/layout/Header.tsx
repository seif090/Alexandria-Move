import { useAuth } from '../../store/auth'
import { useTranslation } from 'react-i18next'
import { Bell, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function Header() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Welcome, {user?.fullName}
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        <button
          onClick={() => { logout(); navigate('/login') }}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" />
          {t('header.logout')}
        </button>
      </div>
    </header>
  )
}
