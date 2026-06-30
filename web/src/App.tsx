import { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './store/auth'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import Dashboard from './pages/analytics/Dashboard'
import UsersList from './pages/users/UsersList'
import UsersCreate from './pages/users/UsersCreate'
import UsersEdit from './pages/users/UsersEdit'
import RolesList from './pages/roles/RolesList'
import RolesCreate from './pages/roles/RolesCreate'
import CommunitiesList from './pages/communities/CommunitiesList'
import CommunitiesCreate from './pages/communities/CommunitiesCreate'
import CommunitiesEdit from './pages/communities/CommunitiesEdit'
import MembersList from './pages/members/MembersList'
import RoutesList from './pages/routes/RoutesList'
import RoutesCreate from './pages/routes/RoutesCreate'
import StopsList from './pages/stops/StopsList'
import GroupsList from './pages/groups/GroupsList'
import GroupsCreate from './pages/groups/GroupsCreate'
import DriversList from './pages/drivers/DriversList'
import DriversCreate from './pages/drivers/DriversCreate'
import VehiclesList from './pages/vehicles/VehiclesList'
import VehiclesCreate from './pages/vehicles/VehiclesCreate'
import BookingsList from './pages/bookings/BookingsList'
import TripsList from './pages/trips/TripsList'
import PaymentsList from './pages/payments/PaymentsList'
import NotificationsList from './pages/notifications/NotificationsList'
import RatingsList from './pages/ratings/RatingsList'
import SupportList from './pages/support/SupportList'
import AuditLogs from './pages/audit/AuditLogs'
import Profile from './pages/profile/Profile'
import Settings from './pages/settings/Settings'
import './i18n/i18n'

function PrivateRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { user, isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>
  if (!isAuthenticated) return <Navigate to="/login" />
  if (roles && user && !roles.some(r => user.roles.includes(r))) return <Navigate to="/" />
  return <>{children}</>
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={<PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>} />
          <Route path="/users" element={<PrivateRoute roles={['SuperAdmin']}><AppLayout><UsersList /></AppLayout></PrivateRoute>} />
          <Route path="/users/create" element={<PrivateRoute roles={['SuperAdmin']}><AppLayout><UsersCreate /></AppLayout></PrivateRoute>} />
          <Route path="/users/:id/edit" element={<PrivateRoute roles={['SuperAdmin']}><AppLayout><UsersEdit /></AppLayout></PrivateRoute>} />
          <Route path="/roles" element={<PrivateRoute roles={['SuperAdmin']}><AppLayout><RolesList /></AppLayout></PrivateRoute>} />
          <Route path="/roles/create" element={<PrivateRoute roles={['SuperAdmin']}><AppLayout><RolesCreate /></AppLayout></PrivateRoute>} />
          <Route path="/communities" element={<PrivateRoute><AppLayout><CommunitiesList /></AppLayout></PrivateRoute>} />
          <Route path="/communities/create" element={<PrivateRoute><AppLayout><CommunitiesCreate /></AppLayout></PrivateRoute>} />
          <Route path="/communities/:id/edit" element={<PrivateRoute><AppLayout><CommunitiesEdit /></AppLayout></PrivateRoute>} />
          <Route path="/members" element={<PrivateRoute><AppLayout><MembersList /></AppLayout></PrivateRoute>} />
          <Route path="/routes" element={<PrivateRoute><AppLayout><RoutesList /></AppLayout></PrivateRoute>} />
          <Route path="/routes/create" element={<PrivateRoute><AppLayout><RoutesCreate /></AppLayout></PrivateRoute>} />
          <Route path="/stops" element={<PrivateRoute><AppLayout><StopsList /></AppLayout></PrivateRoute>} />
          <Route path="/groups" element={<PrivateRoute><AppLayout><GroupsList /></AppLayout></PrivateRoute>} />
          <Route path="/groups/create" element={<PrivateRoute><AppLayout><GroupsCreate /></AppLayout></PrivateRoute>} />
          <Route path="/drivers" element={<PrivateRoute><AppLayout><DriversList /></AppLayout></PrivateRoute>} />
          <Route path="/drivers/create" element={<PrivateRoute><AppLayout><DriversCreate /></AppLayout></PrivateRoute>} />
          <Route path="/vehicles" element={<PrivateRoute><AppLayout><VehiclesList /></AppLayout></PrivateRoute>} />
          <Route path="/vehicles/create" element={<PrivateRoute><AppLayout><VehiclesCreate /></AppLayout></PrivateRoute>} />
          <Route path="/bookings" element={<PrivateRoute><AppLayout><BookingsList /></AppLayout></PrivateRoute>} />
          <Route path="/trips" element={<PrivateRoute><AppLayout><TripsList /></AppLayout></PrivateRoute>} />
          <Route path="/payments" element={<PrivateRoute><AppLayout><PaymentsList /></AppLayout></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><AppLayout><NotificationsList /></AppLayout></PrivateRoute>} />
          <Route path="/ratings" element={<PrivateRoute><AppLayout><RatingsList /></AppLayout></PrivateRoute>} />
          <Route path="/support" element={<PrivateRoute><AppLayout><SupportList /></AppLayout></PrivateRoute>} />
          <Route path="/audit" element={<PrivateRoute roles={['SuperAdmin']}><AppLayout><AuditLogs /></AppLayout></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><AppLayout><Profile /></AppLayout></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute roles={['SuperAdmin']}><AppLayout><Settings /></AppLayout></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </Suspense>
  )
}
