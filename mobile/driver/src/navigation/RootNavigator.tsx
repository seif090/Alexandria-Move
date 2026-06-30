import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useAuthStore } from '../store/auth'
import { ActivityIndicator, View, Text } from 'react-native'
import { colors } from '../theme'
import { getSignalRConnection, disconnectSignalR } from '../services/signalr'
import { registerForPushNotifications } from '../services/notifications'
import AsyncStorage from '@react-native-async-storage/async-storage'

import SplashScreen from '../screens/SplashScreen'
import OnboardingScreen from '../screens/OnboardingScreen'
import LoginScreen from '../screens/auth/LoginScreen'
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen'
import DashboardScreen from '../screens/DashboardScreen'
import TripsScreen from '../screens/TripsScreen'
import TripDetailScreen from '../screens/TripDetailScreen'
import NavigationScreen from '../screens/NavigationScreen'
import EarningsScreen from '../screens/EarningsScreen'
import ProfileScreen from '../screens/ProfileScreen'
import DocumentsScreen from '../screens/DocumentsScreen'
import SupportScreen from '../screens/SupportScreen'
import NotificationsScreen from '../screens/NotificationsScreen'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function MainTabs() {
  const { t } = useTranslation()
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: colors.gray[400],
        tabBarStyle: { backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, paddingBottom: 8, paddingTop: 8, height: 60 },
        tabBarLabelStyle: { fontSize: 12 },
        headerShown: false,
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarLabel: t('navigation.dashboard'), tabBarIcon: () => <Text style={{ fontSize: 20 }}>??</Text> }} />
      <Tab.Screen name="Trips" component={TripsScreen} options={{ tabBarLabel: t('navigation.trips'), tabBarIcon: () => <Text style={{ fontSize: 20 }}>??</Text> }} />
      <Tab.Screen name="Earnings" component={EarningsScreen} options={{ tabBarLabel: t('navigation.earnings'), tabBarIcon: () => <Text style={{ fontSize: 20 }}>??</Text> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: t('navigation.profile'), tabBarIcon: () => <Text style={{ fontSize: 20 }}>??</Text> }} />
    </Tab.Navigator>
  )
}

export function RootNavigator() {
  const { t } = useTranslation()
  const { isAuthenticated, isLoading } = useAuthStore()
  const [appState, setAppState] = useState<'splash' | 'onboarding' | 'auth' | 'main'>('splash')

  const handleSplashFinish = async () => {
    const onboardingDone = await AsyncStorage.getItem('onboardingDone')
    if (onboardingDone) {
      setAppState(isAuthenticated ? 'main' : 'auth')
    } else {
      setAppState('onboarding')
    }
  }

  useEffect(() => {
    if (appState === 'splash') return
    if (!isAuthenticated && appState === 'main') {
      setAppState('auth')
    }
  }, [isAuthenticated, appState])

  useEffect(() => {
    if (isAuthenticated) {
      getSignalRConnection().catch(() => {})
      registerForPushNotifications()
    } else {
      disconnectSignalR()
    }
  }, [isAuthenticated])

  if (appState === 'splash') {
    return <SplashScreen onFinish={handleSplashFinish} />
  }

  if (appState === 'onboarding') {
    return (
      <OnboardingScreen
        onComplete={async () => {
          await AsyncStorage.setItem('onboardingDone', 'true')
          setAppState(isAuthenticated ? 'main' : 'auth')
        }}
        onSkip={async () => {
          await AsyncStorage.setItem('onboardingDone', 'true')
          setAppState(isAuthenticated ? 'main' : 'auth')
        }}
      />
    )
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    )
  }
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="TripDetail" component={TripDetailScreen} options={{ headerShown: true, title: t('navigation.tripDetail'), headerTintColor: colors.primary[500] }} />
          <Stack.Screen name="Navigation" component={NavigationScreen} options={{ headerShown: true, title: t('navigation.navigation'), headerTintColor: colors.primary[500] }} />
          <Stack.Screen name="Documents" component={DocumentsScreen} options={{ headerShown: true, title: t('navigation.documents'), headerTintColor: colors.primary[500] }} />
          <Stack.Screen name="Support" component={SupportScreen} options={{ headerShown: true, title: t('navigation.support'), headerTintColor: colors.primary[500] }} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: true, title: t('navigation.notifications'), headerTintColor: colors.primary[500] }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </>
      )}
    </Stack.Navigator>
  )
}
