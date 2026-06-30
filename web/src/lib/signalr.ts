import * as signalR from '@microsoft/signalr'

let trackingConnection: signalR.HubConnection | null = null
let notificationConnection: signalR.HubConnection | null = null

export function getTrackingHub(): signalR.HubConnection {
  if (!trackingConnection) {
    const token = localStorage.getItem('token')
    trackingConnection = new signalR.HubConnectionBuilder()
      .withUrl('/hubs/tracking', {
        accessTokenFactory: () => token || '',
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .build()

    trackingConnection.onreconnecting(() => {
      console.log('Tracking hub reconnecting...')
    })

    trackingConnection.onreconnected(() => {
      console.log('Tracking hub reconnected')
    })

    trackingConnection.onclose(() => {
      console.log('Tracking hub closed')
    })
  }
  return trackingConnection
}

export function getNotificationHub(): signalR.HubConnection {
  if (!notificationConnection) {
    const token = localStorage.getItem('token')
    notificationConnection = new signalR.HubConnectionBuilder()
      .withUrl('/hubs/notifications', {
        accessTokenFactory: () => token || '',
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .build()

    notificationConnection.onreconnecting(() => {
      console.log('Notification hub reconnecting...')
    })

    notificationConnection.onreconnected(() => {
      console.log('Notification hub reconnected')
    })

    notificationConnection.onclose(() => {
      console.log('Notification hub closed')
    })
  }
  return notificationConnection
}

export async function startTrackingHub(): Promise<void> {
  try {
    const hub = getTrackingHub()
    if (hub.state === signalR.HubConnectionState.Disconnected) {
      await hub.start()
      console.log('Tracking hub connected')
    }
  } catch (err) {
    console.error('Failed to connect tracking hub:', err)
  }
}

export async function startNotificationHub(): Promise<void> {
  try {
    const hub = getNotificationHub()
    if (hub.state === signalR.HubConnectionState.Disconnected) {
      await hub.start()
      console.log('Notification hub connected')
    }
  } catch (err) {
    console.error('Failed to connect notification hub:', err)
  }
}

export async function stopAllHubs(): Promise<void> {
  if (trackingConnection) {
    await trackingConnection.stop()
    trackingConnection = null
  }
  if (notificationConnection) {
    await notificationConnection.stop()
    notificationConnection = null
  }
}

export async function joinTripGroup(tripId: string): Promise<void> {
  const hub = getTrackingHub()
  if (hub.state === signalR.HubConnectionState.Connected) {
    await hub.invoke('JoinTripGroup', tripId)
  }
}

export async function leaveTripGroup(tripId: string): Promise<void> {
  const hub = getTrackingHub()
  if (hub.state === signalR.HubConnectionState.Connected) {
    await hub.invoke('LeaveTripGroup', tripId)
  }
}

export function onDriverLocationUpdate(
  callback: (data: { tripId: string; latitude: number; longitude: number; timestamp: string }) => void
): void {
  getTrackingHub().on('DriverLocationUpdated', callback)
}

export function onTripStatusUpdate(
  callback: (data: { tripId: string; status: string; timestamp: string }) => void
): void {
  getTrackingHub().on('TripStatusUpdated', callback)
}

export function onNotificationReceived(
  callback: (data: { id: string; title: string; body: string; type: string }) => void
): void {
  getNotificationHub().on('ReceiveNotification', callback)
}
