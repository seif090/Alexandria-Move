export interface User {
  id: string; fullName: string; email: string; phoneNumber?: string; profileImageUrl?: string; status: string; isVerified: boolean
}

export interface Driver {
  id: string; userId: string; licenseNumber: string; licenseExpiryDate: string; yearsOfExperience: number; rating: number; totalTrips: number; cancellationRate: number; safetyScore: number; isVerified: boolean; isAvailable: boolean; status: string; user: User
}

export interface Trip {
  id: string; groupId: string; groupName: string; driverId: string; vehicleId: string; status: string; scheduledDate: string; startedAt?: string; completedAt?: string; routeJson?: string; notes?: string; passengers: TripPassenger[]
}

export interface TripPassenger {
  id: string; tripId: string; bookingId: string; userId: string; userName: string; isPickedUp: boolean; isDroppedOff: boolean; pickupStopName?: string; dropoffStopName?: string
}

export interface Booking {
  id: string; userId: string; userName: string; groupId: string; status: string; bookingDate: string; seatCount: number; pickupStopName?: string; dropoffStopName?: string
}

export interface DriverStats {
  totalTrips: number; completedTrips: number; cancelledTrips: number; totalEarnings: number; averageRating: number; safetyScore: number; thisWeekTrips: number; thisWeekEarnings: number
}

export interface DriverDocument {
  id: string; documentType: string; documentUrl: string; expiryDate?: string; isVerified: boolean; uploadedAt: string
}

export interface Notification {
  id: string; title: string; body: string; type: string; isRead: boolean; sentAt: string
}
