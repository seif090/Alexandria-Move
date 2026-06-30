import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useAuthStore } from '../store/auth'
import { ActivityIndicator, View, Text } from 'react-native'
import { colors, spacing } from '../theme'
import { getSignalRConnection, disconnectSignalR, registerTripHandler, registerNotificationHandler, registerLocationHandler } from '../services/signalr'
import { registerForPushNotifications } from '../services/notifications'
import AsyncStorage from '@react-native-async-storage/async-storage'

import SplashScreen from '../screens/SplashScreen'
import OnboardingScreen from '../screens/OnboardingScreen'
import LoginScreen from '../screens/auth/LoginScreen'
import RegisterScreen from '../screens/auth/RegisterScreen'
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen'
import OtpScreen from '../screens/auth/OtpScreen'
import DriverRegisterScreen from '../screens/auth/DriverRegisterScreen'
import HomeScreen from '../screens/HomeScreen'
import SearchScreen from '../screens/SearchScreen'
import BookingsScreen from '../screens/BookingsScreen'
import TripScreen from '../screens/TripScreen'
import RatingsScreen from '../screens/RatingsScreen'
import WalletScreen from '../screens/WalletScreen'
import NotificationsScreen from '../screens/NotificationsScreen'
import ProfileScreen from '../screens/ProfileScreen'
import SupportScreen from '../screens/SupportScreen'
import ChangePasswordScreen from '../screens/ChangePasswordScreen'
import CommunityListScreen from '../screens/community/CommunityListScreen'
import CommunityDetailScreen from '../screens/community/CommunityDetailScreen'

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
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: t('navigation.home'), tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text> }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ tabBarLabel: t('navigation.search'), tabBarIcon: () => <Text style={{ fontSize: 20 }}>🔍</Text> }} />
      <Tab.Screen name="Bookings" component={BookingsScreen} options={{ tabBarLabel: t('navigation.bookings'), tabBarIcon: () => <Text style={{ fontSize: 20 }}>🎫</Text> }} />
      <Tab.Screen name="Wallet" component={WalletScreen} options={{ tabBarLabel: t('navigation.wallet'), tabBarIcon: () => <Text style={{ fontSize: 20 }}>💳</Text> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: t('navigation.profile'), tabBarIcon: () => <Text style={{ fontSize: 20 }}>👤</Text> }} />
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
      getSignalRConnection().then(() => {
        registerTripHandler((data) => { })
        registerNotificationHandler((data) => { })
        registerLocationHandler((data) => { })
      })
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
          <Stack.Screen name="Trip" component={TripScreen} options={{ headerShown: true, title: t('navigation.trip'), headerTintColor: colors.primary[500] }} />
          <Stack.Screen name="Ratings" component={RatingsScreen} options={{ headerShown: true, title: t('navigation.ratings'), headerTintColor: colors.primary[500] }} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: true, title: t('navigation.notifications'), headerTintColor: colors.primary[500] }} />
          <Stack.Screen name="Support" component={SupportScreen} options={{ headerShown: true, title: t('navigation.support'), headerTintColor: colors.primary[500] }} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: true, title: t('profile.changePassword'), headerTintColor: colors.primary[500] }} />
          <Stack.Screen name="CommunityList" component={CommunityListScreen} options={{ headerShown: true, title: t('navigation.communities'), headerTintColor: colors.primary[500] }} />
          <Stack.Screen name="CommunityDetail" component={CommunityDetailScreen} options={{ headerShown: true, title: t('navigation.communityDetail'), headerTintColor: colors.primary[500] }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="Otp" component={OtpScreen} />
          <Stack.Screen name="DriverRegister" component={DriverRegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  )
}
