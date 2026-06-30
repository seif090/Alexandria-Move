import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import { DashboardData } from '../../types'
import { Users, Building2, Navigation, DollarSign } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const { t } = useTranslation()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const response = await api.get('/analytics/super-admin')
      setData(response.data)
    } catch {
      console.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>

  const stats = [
    { label: t('dashboard.totalUsers'), value: data?.totalUsers ?? 0, icon: Users, color: 'bg-blue-500', change: `+${data?.newUsersThisMonth ?? 0} this month` },
    { label: 'Active Communities', value: data?.activeCommunities ?? 0, icon: Building2, color: 'bg-green-500', change: 'Active' },
    { label: t('dashboard.totalTrips'), value: data?.totalTrips ?? 0, icon: Navigation, color: 'bg-purple-500', change: `+${data?.tripsThisMonth ?? 0} this month` },
    { label: t('dashboard.revenue'), value: `$${data?.totalRevenue?.toLocaleString() ?? 0}`, icon: DollarSign, color: 'bg-orange-500', change: `+$${data?.revenueThisMonth?.toLocaleString() ?? 0} this month` },
  ]

  const revenueData = [
    { month: 'Jan', revenue: 12000 },
    { month: 'Feb', revenue: 15000 },
    { month: 'Mar', revenue: 18000 },
    { month: 'Apr', revenue: 22000 },
    { month: 'May', revenue: 25000 },
    { month: 'Jun', revenue: 30000 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.title')}</h1>
        <p className="text-gray-500 mt-1">{t('dashboard.quickStats')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="card">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.revenue')}</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">{t('routes.title')}</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data?.popularRoutes ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="routeName" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookingCount" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">{t('users.title')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">{t('common.name')}</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">{t('common.email')}</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">{t('common.date')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data?.recentUsers?.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.fullName}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(user.registrationDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
