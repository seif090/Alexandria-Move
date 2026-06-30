import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { useAuthStore } from './src/store/auth'
import { RootNavigator } from './src/navigation/RootNavigator'
import Toast from 'react-native-toast-message'
import { initI18n } from './src/i18n/i18n'
import { ActivityIndicator, View } from 'react-native'

export default function App() {
  const { loadUser } = useAuthStore()
  const [i18nReady, setI18nReady] = useState(false)

  useEffect(() => {
    initI18n().then(() => setI18nReady(true))
    loadUser()
  }, [])

  if (!i18nReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#005bb7" />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <RootNavigator />
      <StatusBar style="auto" />
      <Toast />
    </NavigationContainer>
  )
}
