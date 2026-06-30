export interface User {
  id: string
  fullName: string
  email: string
  phoneNumber?: string
  profileImageUrl?: string
  dateOfBirth?: string
  gender?: string
  address?: string
  status: 'Active' | 'Inactive' | 'Suspended' | 'PendingVerification'
  registrationDate: string
  lastLogin?: string
  isVerified: boolean
  twoFactorEnabled: boolean
  roles: string[]
}

export interface Role {
  id: string
  name: string
  description: string
  isSystemRole: boolean
  permissions: RolePermission[]
}

export interface RolePermission {
  id: string
  permissionGroup: string
  permissionName: string
  isGranted: boolean
}

export interface Community {
  id: string
  name: string
  type: string
  description?: string
  logoUrl?: string
  coverImageUrl?: string
  city: string
  area: string
  address?: string
  phoneNumber?: string
  email?: string
  website?: string
  isApproved: boolean
  maxMembers: number
  memberCount: number
}

export interface CommunityMember {
  id: string
  communityId: string
  userId: string
  user: User
  status: string
  joinedAt: string
  role: string
  notes?: string
}

export interface Route {
  id: string
  communityId: string
  communityName: string
  name: string
  startLocation: string
  endLocation: string
  distance: number
  estimatedTime: number
  status: string
  startLatitude: number
  startLongitude: number
  endLatitude: number
  endLongitude: number
}

export interface Stop {
  id: string
  routeId: string
  name: string
  latitude: number
  longitude: number
  orderIndex: number
  isActive: boolean
  estimatedArrivalTime?: string
}

export interface TransportationGroup {
  id: string
  communityId: string
  routeId: string
  driverId: string
  vehicleId: string
  name: string
  capacity: number
  availableSeats: number
  departureTime: string
  returnTime: string
  workingDays: string
  price: number
  status: string
  communityName: string
  routeName: string
  driverName: string
}

export interface Driver {
  id: string
  userId: string
  user: User
  licenseNumber: string
  licenseExpiryDate: string
  yearsOfExperience: number
  rating: number
  totalTrips: number
  cancellationRate: number
  safetyScore: number
  isVerified: boolean
  isAvailable: boolean
  status: string
}

export interface Vehicle {
  id: string
  plateNumber: string
  model: string
  brand: string
  year: number
  capacity: number
  color: string
  insuranceNumber: string
  insuranceExpiryDate: string
  isVerified: boolean
  status: string
}

export interface Booking {
  id: string
  userId: string
  groupId: string
  status: string
  bookingDate: string
  seatCount: number
  totalPrice: number
  paymentMethod: string
  paymentStatus: string
  userName: string
  groupName: string
}

export interface Trip {
  id: string
  groupId: string
  driverId: string
  vehicleId: string
  status: string
  scheduledDate: string
  startedAt?: string
  completedAt?: string
  groupName: string
  driverName: string
}

export interface Payment {
  id: string
  userId: string
  bookingId: string
  amount: number
  method: string
  status: string
  transactionId: string
  invoiceNumber: string
  paidAt: string
  userName: string
}

export interface Notification {
  id: string
  type: string
  event: string
  title: string
  body: string
  isRead: boolean
  sentAt: string
}

export interface Rating {
  id: string
  raterId: string
  ratedEntityId: string
  ratedEntityType: string
  score: number
  reviewText?: string
  createdAt: string
  raterName: string
}

export interface SupportTicket {
  id: string
  userId: string
  subject: string
  description: string
  status: string
  priority: string
  assignedToId?: string
  createdAt: string
  userName: string
  messages: SupportMessage[]
}

export interface SupportMessage {
  id: string
  ticketId: string
  message: string
  isStaff: boolean
  createdAt: string
  senderName: string
}

export interface AuditLog {
  id: string
  userId?: string
  action: string
  entityType: string
  entityId: string
  ipAddress: string
  oldValues?: string
  newValues?: string
  timestamp: string
  userName?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  pageNumber: number
  totalPages: number
  totalCount: number
  pageSize: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface DashboardData {
  totalUsers: number
  activeCommunities: number
  totalTrips: number
  totalRevenue: number
  newUsersThisMonth: number
  tripsThisMonth: number
  revenueThisMonth: number
  popularRoutes: { routeName: string; bookingCount: number }[]
  recentUsers: { id: string; fullName: string; email: string; registrationDate: string }[]
}
