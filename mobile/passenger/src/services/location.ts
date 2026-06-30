import * as Location from 'expo-location'
import { Alert, Linking, Platform } from 'react-native'

type LocationCallback = (location: Location.LocationObject) => void

export async function requestForegroundPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync()
  if (status !== 'granted') {
    Alert.alert(
      'Location Permission Needed',
      'Please enable location services in your device settings to find nearby rides.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => Linking.openSettings() },
      ]
    )
    return false
  }
  return true
}

export async function requestBackgroundPermission(): Promise<boolean> {
  const { status } = await Location.requestBackgroundPermissionsAsync()
  return status === 'granted'
}

export async function getCurrentPosition(): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const hasPermission = await requestForegroundPermission()
    if (!hasPermission) return null
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    })
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    }
  } catch {
    return null
  }
}

export function watchPosition(callback: LocationCallback, intervalMs = 5000) {
  return Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: intervalMs,
      distanceInterval: 10,
    },
    callback
  )
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<string> {
  try {
    const addresses = await Location.reverseGeocodeAsync({ latitude, longitude })
    if (addresses.length > 0) {
      const addr = addresses[0]
      return [addr.name, addr.street, addr.city, addr.country].filter(Boolean).join(', ')
    }
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
  } catch {
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
  }
}

export function calculateDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
