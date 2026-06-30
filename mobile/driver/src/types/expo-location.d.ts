declare module 'expo-location' {
  export type PermissionStatus = 'granted' | 'denied' | 'undetermined'

  export interface LocationPermissionResponse {
    status: PermissionStatus
    granted: boolean
    canAskAgain: boolean
    expires: 'never'
  }

  export interface LocationObject {
    coords: {
      latitude: number
      longitude: number
      altitude: number | null
      accuracy: number | null
      altitudeAccuracy: number | null
      heading: number | null
      speed: number | null
    }
    timestamp: number
  }

  export enum Accuracy {
    Lowest = 1,
    Low = 2,
    Balanced = 3,
    High = 4,
    Highest = 5,
    BestForNavigation = 6,
  }

  export interface LocationOptions {
    accuracy?: Accuracy
    timeInterval?: number
    distanceInterval?: number
  }

  export interface LocationSubscription {
    remove: () => void
  }

  export function requestForegroundPermissionsAsync(): Promise<LocationPermissionResponse>
  export function requestBackgroundPermissionsAsync(): Promise<LocationPermissionResponse>
  export function getCurrentPositionAsync(options?: LocationOptions): Promise<LocationObject>
  export function watchPositionAsync(options: LocationOptions, callback: (location: LocationObject) => void): Promise<LocationSubscription>
}
