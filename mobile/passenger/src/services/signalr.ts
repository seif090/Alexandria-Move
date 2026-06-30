import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { config } from '../config'

let connection: HubConnection | null = null

export async function getSignalRConnection(): Promise<HubConnection> {
  if (connection && connection.state === 'Connected') return connection

  const token = await AsyncStorage.getItem('token')

  connection = new HubConnectionBuilder()
    .withUrl(`${config.signalrUrl}/tracking`, {
      accessTokenFactory: () => token || '',
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
    .configureLogging(LogLevel.Warning)
    .build()

  await connection.start()
  return connection
}

export async function disconnectSignalR() {
  if (connection) {
    await connection.stop()
    connection = null
  }
}

export function registerTripHandler(handler: (data: any) => void) {
  if (!connection) return
  connection.on('TripUpdate', handler)
}

export function registerNotificationHandler(handler: (data: any) => void) {
  if (!connection) return
  connection.on('Notification', handler)
}

export function registerLocationHandler(handler: (data: { tripId: string; driverId: string; latitude: number; longitude: number; speed: number; heading: number; timestamp: string }) => void) {
  if (!connection) return
  connection.on('DriverLocationUpdated', handler)
}

export function registerTripStatusHandler(handler: (data: { tripId: string; status: string; timestamp: string }) => void) {
  if (!connection) return
  connection.on('TripStatusUpdated', handler)
}

export function removeHandlers() {
  if (!connection) return
  connection.off('TripUpdate')
  connection.off('Notification')
  connection.off('DriverLocationUpdated')
  connection.off('TripStatusUpdated')
}
