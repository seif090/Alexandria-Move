import React, { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Dimensions } from 'react-native'
import api from '../services/api'
import { Trip } from '../types'
import { colors, borderRadius, typography, spacing, shadows } from '../theme'
import DriverMapView from '../components/maps/DriverMapView'
import { startTripTracking, stopTripTracking } from '../services/tripTracking'
import { requestForegroundPermission, requestBackgroundPermission } from '../services/location'

const { width, height } = Dimensions.get('window')

export default function NavigationScreen({ route, navigation }: any) {
  const { t } = useTranslation()
  const { tripId } = route.params
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const [eta, setEta] = useState('--')
  const [currentInstruction, setCurrentInstruction] = useState(t('common.loading'))
  const [pickupLocation, setPickupLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [dropoffLocation, setDropoffLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [routeCoords, setRouteCoords] = useState<Array<{ latitude: number; longitude: number }>>([])

  useEffect(() => {
    loadTrip()
  }, [tripId])

  useEffect(() => {
    const init = async () => {
      await requestForegroundPermission()
      await requestBackgroundPermission()
      if (tripId) {
        await startTripTracking(tripId)
        try {
          const res = await api.get(`/trips/${tripId}`)
          const trip = res.data.data || res.data
          if (trip.pickupLatitude && trip.pickupLongitude) {
            setPickupLocation({ latitude: trip.pickupLatitude, longitude: trip.pickupLongitude })
          }
          if (trip.dropoffLatitude && trip.dropoffLongitude) {
            setDropoffLocation({ latitude: trip.dropoffLatitude, longitude: trip.dropoffLongitude })
          }
          if (trip.routePolyline) {
            try {
              const coords = JSON.parse(trip.routePolyline)
              setRouteCoords(coords)
            } catch {}
          }
        } catch {}
      }
    }
    init()
    return () => {
      stopTripTracking()
    }
  }, [tripId])

  const loadTrip = async () => {
    try {
      const res = await api.get(`/trips/${tripId}`)
      setTrip(res.data.data)
      setEta('~15 min')
      setCurrentInstruction(t('navigation.followRoute'))
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  const endTrip = () => {
    Alert.alert(t('navigation.completeTrip'), t('navigation.title'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.completed'), style: 'destructive', onPress: () => navigation.goBack() },
    ])
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <DriverMapView
          region={pickupLocation ? {
            latitude: pickupLocation.latitude,
            longitude: pickupLocation.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          } : undefined}
          pickupLocation={pickupLocation}
          dropoffLocation={dropoffLocation}
          routeCoordinates={routeCoords}
          showsUserLocation={true}
        />
        <View style={styles.etaOverlay}>
          <Text style={styles.etaValue}>{eta}</Text>
          <Text style={styles.etaLabel}>{t('navigation.eta')}</Text>
        </View>
      </View>

      <View style={styles.infoPanel}>
        <View style={styles.etaContainer}>
          <Text style={styles.etaLabel}>{t('navigation.eta')}</Text>
          <Text style={styles.etaValue}>{eta}</Text>
        </View>
        <View style={styles.tripInfo}>
          <Text style={styles.tripGroup}>{trip?.groupName || t('trips.title')}</Text>
          <Text style={styles.passengerCount}>{trip?.passengers?.length || 0} {t('trips.passengers')}</Text>
        </View>
      </View>

      <View style={styles.instructionCard}>
        <Text style={styles.instructionIcon}>?</Text>
        <View style={styles.instructionContent}>
          <Text style={styles.instructionLabel}>{t('navigation.nextStop')}</Text>
          <Text style={styles.instructionText}>{currentInstruction}</Text>
        </View>
      </View>

      <View style={styles.stopsList}>
        <Text style={styles.stopsTitle}>{t('navigation.followRoute')}</Text>
        {trip?.passengers?.map((p, idx) => (
          <View key={p.id} style={styles.stopItem}>
            <View style={styles.stopDot}>
              <Text style={styles.stopNumber}>{idx + 1}</Text>
            </View>
            <View style={styles.stopInfo}>
              <Text style={styles.stopName}>{p.userName}</Text>
              {p.pickupStopName && <Text style={styles.stopAddress}>{t('tripDetail.pickup')}: {p.pickupStopName}</Text>}
              {p.dropoffStopName && <Text style={styles.stopAddress}>{t('tripDetail.dropoff')}: {p.dropoffStopName}</Text>}
            </View>
            <View style={[styles.stopStatus, p.isDroppedOff && styles.stopDone]}>
              <Text>{p.isDroppedOff ? '?' : p.isPickedUp ? '?' : '?'}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.endNavBtn} onPress={endTrip}>
          <Text style={styles.endNavBtnText}>? {t('common.cancel')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  mapContainer: { flex: 1, position: 'relative' },
  mapPlaceholder: { height: height * 0.25, backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  mapOverlay: { alignItems: 'center' },
  mapIcon: { fontSize: 48, marginBottom: spacing.sm },
  mapText: { fontSize: typography.sizes.lg, fontWeight: typography.weights.semibold, color: colors.text.primary },
  mapSubtext: { fontSize: typography.sizes.sm, color: colors.text.secondary, marginTop: spacing.xs },
  etaOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.lg,
  },
  infoPanel: { flexDirection: 'row', backgroundColor: colors.surface, paddingVertical: spacing.md, paddingHorizontal: spacing.lg - 4, marginHorizontal: spacing.md, marginTop: -24, borderRadius: borderRadius.lg, ...shadows.lg },
  etaContainer: { alignItems: 'center', marginRight: spacing.lg },
  etaLabel: { fontSize: typography.sizes.xs, color: colors.text.secondary, fontWeight: typography.weights.medium },
  etaValue: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.bold, color: colors.primary[500], marginTop: spacing.xs },
  tripInfo: { justifyContent: 'center', flex: 1 },
  tripGroup: { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text.primary },
  passengerCount: { fontSize: typography.sizes.sm, color: colors.text.secondary, marginTop: spacing.xs },
  instructionCard: { flexDirection: 'row', backgroundColor: colors.surface, marginHorizontal: spacing.md, marginTop: spacing.md, padding: spacing.md, borderRadius: borderRadius.lg, alignItems: 'center', ...shadows.sm },
  instructionIcon: { fontSize: 32, marginRight: spacing.sm + 4 },
  instructionContent: { flex: 1 },
  instructionLabel: { fontSize: typography.sizes.xs, color: colors.primary[500], fontWeight: typography.weights.semibold, marginBottom: spacing.xs },
  instructionText: { fontSize: typography.sizes.md, color: colors.text.primary, fontWeight: typography.weights.medium },
  stopsList: { backgroundColor: colors.surface, marginHorizontal: spacing.md, marginTop: spacing.md, borderRadius: borderRadius.lg, padding: spacing.lg - 4, ...shadows.sm },
  stopsTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text.primary, marginBottom: spacing.md },
  stopItem: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm + 4 },
  stopDot: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary[500], justifyContent: 'center', alignItems: 'center', marginRight: spacing.sm + 4 },
  stopNumber: { color: colors.text.inverse, fontSize: typography.sizes.sm, fontWeight: typography.weights.bold },
  stopInfo: { flex: 1 },
  stopName: { fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, color: colors.text.primary },
  stopAddress: { fontSize: typography.sizes.xs, color: colors.text.secondary, marginTop: spacing.xs },
  stopStatus: { marginLeft: spacing.sm },
  stopDone: { opacity: 0.5 },
  bottomActions: { paddingHorizontal: spacing.md, paddingVertical: spacing.lg - 4 },
  endNavBtn: { backgroundColor: colors.error, paddingVertical: spacing.md, borderRadius: 14, alignItems: 'center' },
  endNavBtnText: { color: colors.text.inverse, fontSize: typography.sizes.md, fontWeight: typography.weights.bold },
})
