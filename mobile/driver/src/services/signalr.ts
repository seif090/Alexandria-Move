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

export function registerTripRequestHandler(handler: (data: any) => void) {
  if (!connection) return
  connection.on('TripRequest', handler)
}

export function registerTripUpdateHandler(handler: (data: any) => void) {
  if (!connection) return
  connection.on('TripUpdate', handler)
}

export function registerNotificationHandler(handler: (data: any) => void) {
  if (!connection) return
  connection.on('Notification', handler)
}

export function removeHandlers() {
  if (!connection) return
  connection.off('TripRequest')
  connection.off('TripUpdate')
  connection.off('Notification')
}
