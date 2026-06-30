export interface User {
  id: string
  fullName: string
  email: string
  phoneNumber?: string
  profileImageUrl?: string
  status: string
  isVerified: boolean
}

export interface Community {
  id: string
  name: string
  type: string
  description?: string
  logoUrl?: string
  city: string
  area: string
  isApproved: boolean
  isMember?: boolean
  memberCount: number
  groupCount?: number
}

export interface TransportationGroup {
  id: string
  name: string
  communityId: string
  communityName: string
  routeId: string
  routeName?: string
  fromLocation?: string
  toLocation?: string
  driverName: string
  capacity: number
  availableSeats: number
  departureTime?: string
  returnTime?: string
  workingDays: string
  price: number
  status: string
}

export interface Booking {
  id: string
  groupId: string
  groupName: string
  status: string
  bookingDate: string
  seatCount: number
  totalPrice: number
  paymentMethod: string
  paymentStatus: string
  qrCodeToken?: string
}

export interface Trip {
  id: string
  groupId: string
  driverId?: string
  driverName: string
  vehiclePlate: string
  status: string
  scheduledDate: string
  startedAt?: string
  driverLatitude?: number
  driverLongitude?: number
  pickupLatitude?: number
  pickupLongitude?: number
  dropoffLatitude?: number
  dropoffLongitude?: number
}

export interface Notification {
  id: string
  title: string
  body: string
  type: string
  isRead: boolean
  sentAt: string
}

export interface Payment {
  id: string
  amount: number
  method: string
  status: string
  transactionId: string
  paidAt: string
}

export interface Rating {
  id: string
  tripId?: string
  driverId?: string
  score: number
  reviewText?: string
  createdAt: string
}

export interface SupportTicket {
  id: string
  subject: string
  description: string
  status: string
  createdAt: string
  messages: SupportMessage[]
}

export interface SupportMessage {
  id: string
  ticketId: string
  senderId: string
  senderName: string
  message: string
  sentAt: string
}

export interface Wallet {
  balance: number
  points: number
  subscriptionActive: boolean
  subscriptionPlan?: string
  subscriptionEndDate?: string
}
