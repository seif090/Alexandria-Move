import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native'
import api from '../services/api'
import { Trip } from '../types'
import { colors, borderRadius, typography, spacing, shadows } from '../theme'

const STATUS_FILTERS = ['all', 'scheduled', 'in_progress', 'completed', 'cancelled']

export default function TripsScreen({ navigation }: any) {
  const { t } = useTranslation()
  const [trips, setTrips] = useState<Trip[]>([])
  const [filter, setFilter] = useState('all')
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadTrips() }, [filter])

  const loadTrips = async () => {
    setLoading(true)
    try {
      const params = filter !== 'all' ? { status: filter } : {}
      const response = await api.get('/trips/driver', { params })
      setTrips(response.data.data || [])
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  const onRefresh = async () => { setRefreshing(true); await loadTrips(); setRefreshing(false) }

  const getFilterLabel = (s: string) => {
    if (s === 'all') return 'All'
    if (s === 'in_progress') return t('common.active')
    if (s === 'scheduled') return t('common.pending')
    if (s === 'completed') return t('common.completed')
    if (s === 'cancelled') return t('common.cancelled')
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string; bg: string; label: string }> = {
      scheduled: { color: colors.secondary[500], bg: colors.secondary[50], label: t('common.pending') },
      in_progress: { color: colors.tertiary[500], bg: colors.tertiary[50], label: t('common.active') },
      completed: { color: colors.primary[500], bg: colors.primary[50], label: t('common.completed') },
      cancelled: { color: colors.error, bg: '#fee2e2', label: t('common.cancelled') },
    }
    const c = config[status] || { color: colors.text.secondary, bg: colors.gray[100], label: status }
    return (
      <View style={[styles.badge, { backgroundColor: c.bg }]}>
        <Text style={[styles.badgeText, { color: c.color }]}>{c.label}</Text>
      </View>
    )
  }

  const renderTrip = ({ item }: { item: Trip }) => (
    <TouchableOpacity style={styles.tripCard} onPress={() => navigation.navigate('TripDetail', { tripId: item.id })}>
      <View style={styles.tripHeader}>
        <Text style={styles.tripGroup}>{item.groupName}</Text>
        {getStatusBadge(item.status)}
      </View>
      <View style={styles.tripDetails}>
        <View style={styles.tripDetailItem}>
          <Text style={styles.detailIcon}>??</Text>
          <Text style={styles.detailText}>{new Date(item.scheduledDate).toLocaleDateString()}</Text>
        </View>
        <View style={styles.tripDetailItem}>
          <Text style={styles.detailIcon}>??</Text>
          <Text style={styles.detailText}>{item.passengers?.length || 0} {t('trips.passengers')}</Text>
        </View>
      </View>
      {item.notes && <Text style={styles.tripNotes} numberOfLines={1}>{item.notes}</Text>}
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('trips.title')}</Text>
        <Text style={styles.count}>{trips.length} {t('trips.title')}</Text>
      </View>

      <View style={styles.filterRow}>
        {STATUS_FILTERS.map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.filterChip, filter === s && styles.filterChipActive]}
            onPress={() => setFilter(s)}
          >
            <Text style={[styles.filterText, filter === s && styles.filterTextActive]}>
              {getFilterLabel(s)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          renderItem={renderTrip}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>??</Text>
              <Text style={styles.emptyText}>{t('trips.noActive')}</Text>
              <Text style={styles.emptySubtext}>{t('trips.noCompleted')}</Text>
            </View>
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.sm },
  title: { fontSize: typography.sizes.xxxl, fontWeight: typography.weights.bold, color: colors.text.primary },
  count: { fontSize: typography.sizes.sm, color: colors.text.secondary },
  filterRow: { flexDirection: 'row', paddingHorizontal: spacing.lg, gap: spacing.sm, marginBottom: spacing.md, flexWrap: 'wrap' },
  filterChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  filterChipActive: { backgroundColor: colors.primary[500], borderColor: colors.primary[500] },
  filterText: { fontSize: 13, fontWeight: typography.weights.medium, color: colors.text.secondary },
  filterTextActive: { color: colors.text.inverse },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  tripCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm + 4, ...shadows.sm },
  tripHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm + 4 },
  tripGroup: { fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.text.primary, flex: 1, marginRight: spacing.sm },
  badge: { paddingHorizontal: 10, paddingVertical: spacing.xs, borderRadius: borderRadius.md },
  badgeText: { fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold },
  tripDetails: { gap: spacing.xs + 2 },
  tripDetailItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs + 2 },
  detailIcon: { fontSize: typography.sizes.sm },
  detailText: { fontSize: typography.sizes.sm, color: colors.text.secondary },
  tripNotes: { fontSize: 13, color: colors.text.muted, marginTop: spacing.sm, fontStyle: 'italic' },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyText: { fontSize: typography.sizes.lg, fontWeight: typography.weights.semibold, color: colors.text.primary },
  emptySubtext: { fontSize: typography.sizes.sm, color: colors.text.muted, marginTop: spacing.xs },
})
