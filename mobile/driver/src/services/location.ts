import * as Location from 'expo-location'
import { Alert, Linking } from 'react-native'

type LocationCallback = (location: Location.LocationObject) => void

export async function requestForegroundPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync()
  if (status !== 'granted') {
    Alert.alert(
      'Location Permission Needed',
      'Please enable location services in your device settings to start trips.',
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
  if (status !== 'granted') {
    Alert.alert(
      'Background Location Needed',
      'Please allow background location to keep passengers updated on your arrival.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => Linking.openSettings() },
      ]
    )
    return false
  }
  return true
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

let locationSubscription: Location.LocationSubscription | null = null

export function startLocationTracking(
  callback: (loc: { latitude: number; longitude: number; speed: number; heading: number }) => void,
  intervalMs = 3000
) {
  stopLocationTracking()
  Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.Highest,
      timeInterval: intervalMs,
      distanceInterval: 5,
    },
    (location) => {
      callback({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        speed: location.coords.speed ?? 0,
        heading: location.coords.heading ?? 0,
      })
    }
  ).then((sub) => { locationSubscription = sub })
}

export function stopLocationTracking() {
  if (locationSubscription) {
    locationSubscription.remove()
    locationSubscription = null
  }
}
