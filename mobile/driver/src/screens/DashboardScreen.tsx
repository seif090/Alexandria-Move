import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Switch } from 'react-native'
import { useAuthStore } from '../store/auth'
import api from '../services/api'
import { DriverStats, Trip } from '../types'
import { colors, borderRadius, typography, spacing, shadows } from '../theme'

export default function DashboardScreen({ navigation }: any) {
  const { t } = useTranslation()
  const { driver, updateAvailability } = useAuthStore()
  const [stats, setStats] = useState<DriverStats | null>(null)
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const [statsRes, tripRes] = await Promise.all([
        api.get('/drivers/performance'),
        api.get('/trips/active'),
      ])
      setStats(statsRes.data.data)
      setActiveTrip(tripRes.data.data)
    } catch (err) { console.error(err) }
  }

  const onRefresh = async () => { setRefreshing(true); await loadData(); setRefreshing(false) }

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{t('dashboard.title')}, {driver?.user?.fullName?.split(' ')[0] || t('common.name')}</Text>
          <Text style={styles.headerSub}>{t('dashboard.waitingForRequests')}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.notifBtn}>
          <Text style={{ fontSize: 24 }}>🔔</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.availabilityCard}>
        <View>
          <Text style={styles.availabilityLabel}>{t('dashboard.status')}</Text>
          <Text style={styles.availabilityStatus}>{driver?.isAvailable ? t('dashboard.online') : t('dashboard.offline')}</Text>
        </View>
        <Switch
          value={driver?.isAvailable ?? false}
          onValueChange={(val) => updateAvailability(val)}
          trackColor={{ false: colors.border, true: colors.primary[100] }}
          thumbColor={driver?.isAvailable ? colors.primary[500] : colors.text.muted}
        />
      </View>

      {activeTrip && (
        <TouchableOpacity style={styles.activeTripCard} onPress={() => navigation.navigate('TripDetail', { tripId: activeTrip.id })}>
          <Text style={styles.activeTripLabel}>{t('common.active')}</Text>
          <Text style={styles.activeTripGroup}>{activeTrip.groupName}</Text>
          <Text style={styles.activeTripInfo}>{activeTrip.passengers?.length || 0} {t('trips.passengers')}</Text>
          <Text style={styles.activeTripAction}>{t('trips.viewDetails')} →</Text>
        </TouchableOpacity>
      )}

      {stats && (
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.completedTrips}</Text>
            <Text style={styles.statLabel}>{t('dashboard.totalTrips')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.averageRating.toFixed(1)}</Text>
            <Text style={styles.statLabel}>{t('dashboard.rating')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>${stats.totalEarnings}</Text>
            <Text style={styles.statLabel}>{t('dashboard.earningsToday')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.safetyScore}</Text>
            <Text style={styles.statLabel}>{t('dashboard.safetyScore')}</Text>
          </View>
        </View>
      )}

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Trips')}>
          <Text style={styles.actionBtnIcon}>🚗</Text>
          <Text style={styles.actionBtnText}>{t('trips.title')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Earnings')}>
          <Text style={styles.actionBtnIcon}>💰</Text>
          <Text style={styles.actionBtnText}>{t('earnings.title')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Documents')}>
          <Text style={styles.actionBtnIcon}>📄</Text>
          <Text style={styles.actionBtnText}>{t('documents.title')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Support')}>
          <Text style={styles.actionBtnIcon}>💬</Text>
          <Text style={styles.actionBtnText}>{t('support.title')}</Text>
        </TouchableOpacity>
      </View>

      {stats && (
        <View style={styles.performanceSection}>
          <Text style={styles.sectionTitle}>{t('dashboard.quickStats')}</Text>
          <View style={styles.perfRow}>
            <Text style={styles.perfLabel}>{t('dashboard.totalTrips')}</Text>
            <Text style={styles.perfValue}>{stats.thisWeekTrips}</Text>
          </View>
          <View style={styles.perfRow}>
            <Text style={styles.perfLabel}>{t('dashboard.earningsToday')}</Text>
            <Text style={styles.perfValue}>${stats.thisWeekEarnings}</Text>
          </View>
          <View style={styles.perfRow}>
            <Text style={styles.perfLabel}>{t('common.cancelled')}</Text>
            <Text style={[styles.perfValue, stats.cancelledTrips > 5 && { color: '#dc2626' }]}>{stats.cancelledTrips}%</Text>
          </View>
          <View style={styles.perfRow}>
            <Text style={styles.perfLabel}>{t('dashboard.safetyScore')}</Text>
            <Text style={[styles.perfValue, { color: stats.safetyScore >= 80 ? '#059669' : '#dc2626' }]}>{stats.safetyScore}/100</Text>
          </View>
        </View>
      )}

      <View style={{ height: 32 }} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.lg },
  greeting: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.bold, color: colors.text.primary },
  headerSub: { fontSize: typography.sizes.sm, color: colors.text.secondary, marginTop: spacing.xs },
  notifBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center', ...shadows.sm },
  availabilityCard: { marginHorizontal: spacing.lg, padding: spacing.lg - 4, backgroundColor: colors.surface, borderRadius: borderRadius.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg, ...shadows.md },
  availabilityLabel: { fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.text.primary },
  availabilityStatus: { fontSize: typography.sizes.sm, color: colors.text.secondary, marginTop: spacing.xs },
  activeTripCard: { marginHorizontal: spacing.lg, padding: spacing.lg - 4, backgroundColor: colors.primary[500], borderRadius: borderRadius.lg, marginBottom: spacing.lg },
  activeTripLabel: { fontSize: typography.sizes.xs, color: colors.primary[100], fontWeight: typography.weights.semibold, letterSpacing: 1 },
  activeTripGroup: { fontSize: typography.sizes.xl, fontWeight: typography.weights.bold, color: colors.text.inverse, marginTop: spacing.xs },
  activeTripInfo: { fontSize: typography.sizes.sm, color: colors.primary[100], marginTop: spacing.xs },
  activeTripAction: { fontSize: typography.sizes.sm, color: colors.text.inverse, marginTop: spacing.sm, fontWeight: typography.weights.medium },
  statsGrid: { flexDirection: 'row', paddingHorizontal: spacing.lg, gap: spacing.sm + 4, marginBottom: spacing.lg },
  statCard: { flex: 1, backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, alignItems: 'center', ...shadows.sm },
  statNumber: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.bold, color: colors.primary[500] },
  statLabel: { fontSize: typography.sizes.xs, color: colors.text.secondary, marginTop: spacing.xs },
  quickActions: { flexDirection: 'row', paddingHorizontal: spacing.lg, gap: spacing.sm + 4, marginBottom: spacing.lg, flexWrap: 'wrap' },
  actionBtn: { width: '47%', paddingVertical: spacing.md, backgroundColor: colors.surface, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center' as const, justifyContent: 'center' as const },
  actionBtnIcon: { fontSize: 24, marginBottom: spacing.xs },
  actionBtnText: { fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, color: colors.text.primary },
  performanceSection: { marginHorizontal: spacing.lg, backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg - 4, marginBottom: spacing.lg, ...shadows.sm },
  sectionTitle: { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text.primary, marginBottom: spacing.md },
  perfRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm + 4, borderBottomWidth: 1, borderBottomColor: colors.gray[100] },
  perfLabel: { fontSize: typography.sizes.sm, color: colors.text.secondary },
  perfValue: { fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, color: colors.text.primary },
})
