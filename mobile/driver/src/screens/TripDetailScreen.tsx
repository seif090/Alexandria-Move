import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import api from '../services/api'
import { Trip } from '../types'
import { colors, borderRadius, typography, spacing, shadows } from '../theme'

export default function TripDetailScreen({ route, navigation }: any) {
  const { t } = useTranslation()
  const { tripId } = route.params
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => { loadTrip() }, [tripId])

  const loadTrip = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/trips/${tripId}`)
      setTrip(res.data.data)
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  const handleAction = async (action: string) => {
    setActionLoading(action)
    try {
      await api.post(`/trips/${tripId}/${action}`)
      await loadTrip()
    } catch (err: any) {
      Alert.alert(t('common.error'), err.response?.data?.data?.message || err.response?.data?.message || t('common.error'))
    } finally { setActionLoading(null) }
  }

  const handlePassengerAction = async (passengerId: string, action: 'pickup' | 'dropoff') => {
    try {
      await api.post(`/trips/${tripId}/passengers/${passengerId}/${action}`)
      await loadTrip()
    } catch (err: any) {
      Alert.alert(t('common.error'), err.response?.data?.data?.message || err.response?.data?.message || t('common.error'))
    }
  }

  const handleCancelTrip = () => {
    Alert.alert(t('tripDetail.cancelTrip'), t('tripDetail.cancelConfirm'), [
      { text: t('common.no'), style: 'cancel' },
      { text: t('common.yes'), style: 'destructive', onPress: () => handleAction('cancel') },
    ])
  }

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      scheduled: colors.secondary[500], in_progress: colors.tertiary[500], completed: colors.primary[500], cancelled: colors.error,
    }
    return map[status] || colors.text.secondary
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    )
  }

  if (!trip) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{t('common.noData')}</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.statusBar, { backgroundColor: getStatusColor(trip.status) }]}>
        <Text style={styles.statusText}>{trip.status.replace('_', ' ').toUpperCase()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.groupName}>{trip.groupName}</Text>
        <Text style={styles.scheduledDate}>
          ?? {new Date(trip.scheduledDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </Text>
        {trip.startedAt && (
          <Text style={styles.timeText}>{t('tripDetail.departureTime')}: {new Date(trip.startedAt).toLocaleTimeString()}</Text>
        )}
        {trip.completedAt && (
          <Text style={styles.timeText}>{t('common.completed')}: {new Date(trip.completedAt).toLocaleTimeString()}</Text>
        )}
      </View>

      {trip.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('common.description')}</Text>
          <Text style={styles.notesText}>{trip.notes}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('tripDetail.passengers')} ({trip.passengers?.length || 0})</Text>
        {trip.passengers?.map((p) => (
          <View key={p.id} style={styles.passengerCard}>
            <View style={styles.passengerInfo}>
              <Text style={styles.passengerName}>{p.userName}</Text>
              <View style={styles.stopRow}>
                <Text style={styles.stopLabel}>{t('tripDetail.pickup')}:</Text>
                <Text style={styles.stopName}>{p.pickupStopName || t('common.noData')}</Text>
              </View>
              <View style={styles.stopRow}>
                <Text style={styles.stopLabel}>{t('tripDetail.dropoff')}:</Text>
                <Text style={styles.stopName}>{p.dropoffStopName || t('common.noData')}</Text>
              </View>
              <View style={styles.statusRow}>
                <Text style={[styles.statusChip, p.isPickedUp && styles.statusDone]}>
                  {p.isPickedUp ? '? ' + t('common.active') : '? ' + t('common.inactive')}
                </Text>
                <Text style={[styles.statusChip, p.isDroppedOff && styles.statusDone]}>
                  {p.isDroppedOff ? '? ' + t('common.completed') : '? ' + t('common.inactive')}
                </Text>
              </View>
            </View>
            {trip.status === 'in_progress' && (
              <View style={styles.passengerActions}>
                {!p.isPickedUp && (
                  <TouchableOpacity style={styles.pickupBtn} onPress={() => handlePassengerAction(p.id, 'pickup')}>
                    <Text style={styles.passengerActionText}>{t('tripDetail.pickup')}</Text>
                  </TouchableOpacity>
                )}
                {p.isPickedUp && !p.isDroppedOff && (
                  <TouchableOpacity style={styles.dropoffBtn} onPress={() => handlePassengerAction(p.id, 'dropoff')}>
                    <Text style={styles.passengerActionText}>{t('tripDetail.dropoff')}</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        ))}
      </View>

      <View style={styles.actionsSection}>
        {trip.status === 'scheduled' && (
          <TouchableOpacity
            style={styles.startBtn}
            onPress={() => handleAction('start')}
            disabled={actionLoading !== null}
          >
            {actionLoading === 'start' ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.startBtnText}>? {t('tripDetail.startTrip')}</Text>
            )}
          </TouchableOpacity>
        )}
        {trip.status === 'in_progress' && (
          <>
            <TouchableOpacity
              style={styles.navBtn}
              onPress={() => navigation.navigate('Navigation', { tripId: trip.id })}
            >
              <Text style={styles.navBtnText}>??? {t('tripDetail.navigate')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.completeBtn}
              onPress={() => handleAction('complete')}
              disabled={actionLoading !== null}
            >
              {actionLoading === 'complete' ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.completeBtnText}>? {t('tripDetail.completeTrip')}</Text>
              )}
            </TouchableOpacity>
          </>
        )}
        {(trip.status === 'scheduled' || trip.status === 'in_progress') && (
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelTrip} disabled={actionLoading !== null}>
            <Text style={styles.cancelBtnText}>? {t('tripDetail.cancelTrip')}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  errorText: { fontSize: typography.sizes.md, color: colors.text.secondary },
  statusBar: { paddingVertical: spacing.sm + 4, paddingHorizontal: spacing.lg, alignItems: 'center' },
  statusText: { color: colors.text.inverse, fontSize: typography.sizes.sm, fontWeight: '700', letterSpacing: 1 },
  section: { backgroundColor: colors.surface, marginHorizontal: spacing.md, marginTop: spacing.md, borderRadius: borderRadius.lg, padding: spacing.lg - 4, ...shadows.sm },
  groupName: { fontSize: 22, fontWeight: typography.weights.bold, color: colors.text.primary, marginBottom: spacing.sm },
  scheduledDate: { fontSize: typography.sizes.sm, color: colors.text.secondary, marginBottom: spacing.xs },
  timeText: { fontSize: typography.sizes.sm, color: colors.text.secondary, marginTop: spacing.xs },
  sectionTitle: { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text.primary, marginBottom: spacing.md },
  notesText: { fontSize: typography.sizes.sm, color: colors.text.secondary, lineHeight: 20 },
  passengerCard: { backgroundColor: colors.background, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm + 4 },
  passengerInfo: {},
  passengerName: { fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.text.primary, marginBottom: spacing.sm },
  stopRow: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.xs },
  stopLabel: { fontSize: 13, color: colors.text.secondary, fontWeight: typography.weights.medium },
  stopName: { fontSize: 13, color: colors.text.primary, flex: 1 },
  statusRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm, flexWrap: 'wrap' },
  statusChip: { fontSize: typography.sizes.xs, color: colors.text.secondary, backgroundColor: colors.border, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: spacing.sm },
  statusDone: { backgroundColor: colors.tertiary[50], color: colors.tertiary[500] },
  passengerActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm + 4 },
  pickupBtn: { flex: 1, backgroundColor: colors.tertiary[500], paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  dropoffBtn: { flex: 1, backgroundColor: colors.primary[500], paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  passengerActionText: { color: colors.text.inverse, fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold },
  actionsSection: { paddingHorizontal: spacing.md, marginTop: spacing.md, gap: spacing.sm + 4 },
  startBtn: { backgroundColor: colors.tertiary[500], paddingVertical: spacing.md, borderRadius: 14, alignItems: 'center' },
  startBtnText: { color: colors.text.inverse, fontSize: typography.sizes.lg, fontWeight: typography.weights.bold },
  navBtn: { backgroundColor: colors.primary[500], paddingVertical: spacing.md, borderRadius: 14, alignItems: 'center' },
  navBtnText: { color: colors.text.inverse, fontSize: typography.sizes.lg, fontWeight: typography.weights.bold },
  completeBtn: { backgroundColor: colors.text.primary, paddingVertical: spacing.md, borderRadius: 14, alignItems: 'center' },
  completeBtnText: { color: colors.text.inverse, fontSize: typography.sizes.lg, fontWeight: typography.weights.bold },
  cancelBtn: { paddingVertical: 14, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: colors.error + '66' },
  cancelBtnText: { color: colors.error, fontSize: typography.sizes.md, fontWeight: typography.weights.semibold },
})
