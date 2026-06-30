import { Platform } from 'react-native'
import * as Notifications from 'expo-notifications'
import AsyncStorage from '@react-native-async-storage/async-storage'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export async function registerForPushNotifications(): Promise<string | null> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync()

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()

    if (status !== 'granted') {
      console.log('Push notification permission not granted')
      return null
    }
  }

  const tokenData = await Notifications.getExpoPushTokenAsync()
  const token = tokenData.data

  await AsyncStorage.setItem('pushToken', token)

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#005bb7',
    })
  }

  return token
}

export function addNotificationResponseListener(handler: (response: Notifications.NotificationResponse) => void) {
  return Notifications.addNotificationResponseReceivedListener(handler)
}

export function addNotificationReceivedListener(handler: (notification: Notifications.Notification) => void) {
  return Notifications.addNotificationReceivedListener(handler)
}

export async function getLastNotificationResponse() {
  return Notifications.getLastNotificationResponseAsync()
}
