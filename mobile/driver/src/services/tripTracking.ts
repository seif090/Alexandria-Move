import { getSignalRConnection } from './signalr'
import { startLocationTracking, stopLocationTracking } from './location'
import api from './api'

let activeTripId: string | null = null
let isTracking = false

export async function startTripTracking(tripId: string) {
  activeTripId = tripId
  isTracking = true

  try {
    const connection = await getSignalRConnection()
    await connection.invoke('JoinTripGroup', tripId)
  } catch (err) {
    console.error('Failed to join SignalR group:', err)
  }

  startLocationTracking(async (location) => {
    if (!activeTripId || !isTracking) return
    try {
      const connection = await getSignalRConnection()
      await connection.invoke('UpdateLocation', activeTripId, location.latitude, location.longitude, location.speed, location.heading)
    } catch (err) {
      console.error('Failed to send location update:', err)
    }

    try {
      await api.post(`/trips/${activeTripId}/locations`, {
        latitude: location.latitude,
        longitude: location.longitude,
        speed: location.speed,
        heading: location.heading,
      })
    } catch (err) {
      // Silently fail - SignalR is real-time, API is for persistence
    }
  }, 3000)
}

export function stopTripTracking() {
  isTracking = false
  activeTripId = null
  stopLocationTracking()
}
