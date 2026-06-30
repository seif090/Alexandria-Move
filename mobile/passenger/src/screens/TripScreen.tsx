import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native'
import api from '../services/api'
import { Trip } from '../types'
import { colors, borderRadius, typography, spacing, shadows } from '../theme'
import PassengerMapView from '../components/maps/PassengerMapView'
import { getSignalRConnection, registerLocationHandler, removeHandlers } from '../services/signalr'
import { getCurrentPosition } from '../services/location'

export default function TripScreen({ navigation }: any) {
  const { t } = useTranslation()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const [confirmingPickup, setConfirmingPickup] = useState(false)
  const [confirmingDropoff, setConfirmingDropoff] = useState(false)
  const [driverLocation, setDriverLocation] = useState<{
    latitude: number
    longitude: number
    heading: number
  } | null>(null)

  useEffect(() => {
    loadActiveTrip()
  }, [])

  useEffect(() => {
    if (!trip || !trip.driverId) return

    let disposed = false

    const setupSignalR = async () => {
      try {
        const connection = await getSignalRConnection()
        await connection.invoke('SubscribeToTrip', trip.id)

        const handler = (data: { latitude: number; longitude: number; heading: number; speed: number; timestamp: string }) => {
          if (!disposed) {
            setDriverLocation({
              latitude: data.latitude,
              longitude: data.longitude,
              heading: data.heading,
            })
          }
        }

        registerLocationHandler(handler)
      } catch (err) {
        console.error('SignalR connection failed', err)
      }
    }

    setupSignalR()

    return () => {
      disposed = true
    }
  }, [trip?.id, trip?.driverId])

  const loadActiveTrip = async () => {
    try {
      const res = await api.get('/trips/active')
      setTrip(res.data.data)
    } catch (err) {
      console.error('Failed to load trip', err)
    } finally {
      setLoading(false)
    }
  }

  const confirmPickup = async () => {
    setConfirmingPickup(true)
    try {
      await api.put(`/trips/${trip?.id}/confirm-pickup`)
      Alert.alert(t('trip.pickup'), t('trip.pickup') + ' ' + t('common.confirmed'))
      loadActiveTrip()
    } catch (err: any) {
      Alert.alert(t('common.error'), err.response?.data?.data?.message || err.response?.data?.message || t('trip.pickup'))
    } finally {
      setConfirmingPickup(false)
    }
  }

  const confirmDropoff = async () => {
    setConfirmingDropoff(true)
    try {
      await api.put(`/trips/${trip?.id}/confirm-dropoff`)
      Alert.alert(t('trip.tripCompleted'), t('trip.howWasTrip'), [
        {
          text: t('trip.leaveRating'),
          onPress: () => navigation.navigate('Ratings', { tripId: trip?.id }),
        },
        { text: t('trip.skip') },
      ])
      loadActiveTrip()
    } catch (err: any) {
      Alert.alert(t('common.error'), err.response?.data?.data?.message || err.response?.data?.message || t('trip.dropoff'))
    } finally {
      setConfirmingDropoff(false)
    }
  }

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'Pending':
        return { label: t('trip.driverArriving'), color: colors.secondary[500] }
      case 'Started':
        return { label: t('trip.enRoute'), color: colors.primary[500] }
      case 'InProgress':
        return { label: t('trip.enRoute'), color: colors.tertiary[500] }
      case 'Completed':
        return { label: t('common.completed'), color: colors.text.secondary }
      default:
        return { label: status, color: colors.text.secondary }
    }
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    )
  }

  if (!trip) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.noTripText}>{t('trip.active')}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{t('common.back')}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const statusInfo = getStatusDisplay(trip.status)

  return (
    <View style={styles.container}>
      <PassengerMapView
        style={styles.mapContainer}
        driverLocation={driverLocation}
        pickupLocation={trip.pickupLatitude && trip.pickupLongitude ? { latitude: trip.pickupLatitude, longitude: trip.pickupLongitude } : null}
        dropoffLocation={trip.dropoffLatitude && trip.dropoffLongitude ? { latitude: trip.dropoffLatitude, longitude: trip.dropoffLongitude } : null}
        showsUserLocation={true}
      />

      <View style={styles.infoCard}>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: statusInfo.color }]} />
          <Text style={[styles.statusLabel, { color: statusInfo.color }]}>{statusInfo.label}</Text>
        </View>

        <View style={styles.driverSection}>
          <View style={styles.driverAvatar}>
            <Text style={styles.driverAvatarText}>{trip.driverName?.charAt(0) || 'D'}</Text>
          </View>
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{trip.driverName}</Text>
            <Text style={styles.vehiclePlate}>{trip.vehiclePlate}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('bookings.date')}</Text>
          <Text style={styles.detailValue}>
            {new Date(trip.scheduledDate).toLocaleDateString()}
          </Text>
        </View>

        {trip.startedAt && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('common.time')}</Text>
            <Text style={styles.detailValue}>
              {new Date(trip.startedAt).toLocaleTimeString()}
            </Text>
          </View>
        )}

        {trip.status === 'Started' && (
          <TouchableOpacity style={styles.actionButton} onPress={confirmPickup} disabled={confirmingPickup}>
            {confirmingPickup ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.actionButtonText}>{t('trip.pickup')}</Text>
            )}
          </TouchableOpacity>
        )}

        {(trip.status === 'Started' || trip.status === 'InProgress') && (
          <TouchableOpacity style={[styles.actionButton, styles.dropoffButton]} onPress={confirmDropoff} disabled={confirmingDropoff}>
            {confirmingDropoff ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.actionButtonText}>{t('trip.dropoff')}</Text>
            )}
          </TouchableOpacity>
        )}

        {trip.status === 'Completed' && (
          <TouchableOpacity style={[styles.actionButton, styles.rateButton]} onPress={() => navigation.navigate('Ratings', { tripId: trip.id })}>
            <Text style={styles.actionButtonText}>{t('trip.leaveRating')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
  },
  noTripText: { fontSize: typography.sizes.lg, color: colors.text.secondary, marginBottom: spacing.md },
  backButton: { backgroundColor: colors.primary[500], borderRadius: borderRadius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm + 4 },
  backButtonText: { color: colors.text.inverse, fontSize: typography.sizes.md, fontWeight: typography.weights.semibold },
  mapContainer: { height: 280, marginHorizontal: spacing.md, marginTop: spacing.md, borderRadius: borderRadius.lg, overflow: 'hidden' },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg - 4,
    margin: spacing.md,
    ...shadows.md,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  statusDot: { width: 12, height: 12, borderRadius: 6, marginRight: spacing.sm },
  statusLabel: { fontSize: typography.sizes.md, fontWeight: typography.weights.semibold },
  driverSection: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm + 4,
  },
  driverAvatarText: { fontSize: typography.sizes.xl, fontWeight: typography.weights.bold, color: colors.text.inverse },
  driverInfo: { flex: 1 },
  driverName: { fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.text.primary },
  vehiclePlate: { fontSize: typography.sizes.sm, color: colors.text.secondary, marginTop: spacing.xs },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  detailLabel: { fontSize: typography.sizes.sm, color: colors.text.secondary },
  detailValue: { fontSize: typography.sizes.sm, color: colors.text.primary, fontWeight: typography.weights.medium },
  actionButton: {
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.sm + 4,
  },
  dropoffButton: { backgroundColor: colors.tertiary[500] },
  rateButton: { backgroundColor: colors.primary[500] },
  actionButtonText: { color: colors.text.inverse, fontSize: typography.sizes.md, fontWeight: typography.weights.semibold },
})
