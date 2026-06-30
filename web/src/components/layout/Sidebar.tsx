import { NavLink } from 'react-router-dom'
import { useAuth } from '../../store/auth'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard, Users, Shield, Building2, Users2, MapPin, MapPinOff,
  Bus, UserCog, Car, CalendarCheck, Navigation, CreditCard,
  Bell, Star, HeadphonesIcon, FileSearch, UserCircle, Settings
} from 'lucide-react'

export function Sidebar() {
  const { t } = useTranslation()
  const { user } = useAuth()

  const navigation = [
    { name: t('sidebar.dashboard'), href: '/', icon: LayoutDashboard, roles: ['SuperAdmin', 'CommunityAdmin', 'CompanyAdmin', 'SchoolAdmin', 'Passenger', 'Driver'] },
    { name: t('sidebar.users'), href: '/users', icon: Users, roles: ['SuperAdmin'] },
    { name: t('sidebar.roles'), href: '/roles', icon: Shield, roles: ['SuperAdmin'] },
    { name: t('sidebar.communities'), href: '/communities', icon: Building2, roles: ['SuperAdmin', 'CommunityAdmin'] },
    { name: t('sidebar.members'), href: '/members', icon: Users2, roles: ['SuperAdmin', 'CommunityAdmin'] },
    { name: t('sidebar.routes'), href: '/routes', icon: MapPin, roles: ['SuperAdmin', 'CommunityAdmin'] },
    { name: t('sidebar.stops'), href: '/stops', icon: MapPinOff, roles: ['SuperAdmin', 'CommunityAdmin'] },
    { name: t('sidebar.groups'), href: '/groups', icon: Bus, roles: ['SuperAdmin', 'CommunityAdmin'] },
    { name: t('sidebar.drivers'), href: '/drivers', icon: UserCog, roles: ['SuperAdmin', 'CommunityAdmin'] },
    { name: t('sidebar.vehicles'), href: '/vehicles', icon: Car, roles: ['SuperAdmin', 'CommunityAdmin'] },
    { name: t('sidebar.bookings'), href: '/bookings', icon: CalendarCheck, roles: ['SuperAdmin', 'CommunityAdmin'] },
    { name: t('sidebar.trips'), href: '/trips', icon: Navigation, roles: ['SuperAdmin', 'CommunityAdmin', 'Driver'] },
    { name: t('sidebar.payments'), href: '/payments', icon: CreditCard, roles: ['SuperAdmin'] },
    { name: t('sidebar.notifications'), href: '/notifications', icon: Bell, roles: ['SuperAdmin', 'CommunityAdmin', 'Passenger', 'Driver'] },
    { name: t('sidebar.ratings'), href: '/ratings', icon: Star, roles: ['SuperAdmin'] },
    { name: t('sidebar.support'), href: '/support', icon: HeadphonesIcon, roles: ['SuperAdmin'] },
    { name: t('sidebar.auditLogs'), href: '/audit', icon: FileSearch, roles: ['SuperAdmin'] },
    { name: t('sidebar.profile'), href: '/profile', icon: UserCircle, roles: ['SuperAdmin', 'CommunityAdmin', 'Passenger', 'Driver'] },
    { name: t('sidebar.settings'), href: '/settings', icon: Settings, roles: ['SuperAdmin'] },
  ]

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary-700">Alexandria</h1>
        <p className="text-xs text-gray-500 mt-1">Mobility Platform</p>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navigation
          .filter(item => user && item.roles.some(r => user.roles.includes(r)))
          .map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-sm font-medium text-primary-700">
              {user?.fullName?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.fullName}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
