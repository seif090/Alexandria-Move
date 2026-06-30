import React, { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native'
import { useAuthStore } from '../store/auth'
import api from '../services/api'
import { TransportationGroup, Trip } from '../types'
import { colors, borderRadius, typography, spacing, shadows } from '../theme'

export default function HomeScreen({ navigation }: any) {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [recommendedGroups, setRecommendedGroups] = useState<TransportationGroup[]>([])
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => loadData())
    return unsubscribe
  }, [])

  const loadData = async () => {
    try {
      const [groupsRes, tripRes] = await Promise.all([
        api.get('/groups/recommendations?pageSize=5'),
        api.get('/trips/active'),
      ])
      const groups = groupsRes.data.data?.items || groupsRes.data.data || []
      setRecommendedGroups(Array.isArray(groups) ? groups : [])
      setActiveTrip(tripRes.data.data || null)
    } catch (err) {
      console.error('Home load failed:', err)
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }, [])

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{t('home.greeting')}, {user?.fullName?.split(' ')[0] || t('home.welcome')}</Text>
          <Text style={styles.date}>{formatDate()}</Text>
        </View>
        <TouchableOpacity
          style={styles.notifButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Text style={styles.notifIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      {activeTrip && (
        <TouchableOpacity
          style={styles.activeTripCard}
          onPress={() => navigation.navigate('Trip')}
        >
          <Text style={styles.activeTripTitle}>{t('trip.active')}</Text>
          <Text style={styles.activeTripText}>{t('home.trackTrip')}</Text>
          <View style={styles.activeTripStatus}>
            <View style={styles.statusDot} />
            <Text style={styles.activeTripStatusText}>{activeTrip.status}</Text>
          </View>
        </TouchableOpacity>
      )}

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Search')}
        >
          <Text style={styles.actionIcon}>🔍</Text>
          <Text style={styles.actionText}>{t('home.bookRide')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Bookings')}
        >
          <Text style={styles.actionIcon}>📋</Text>
          <Text style={styles.actionText}>{t('bookings.title')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Wallet')}
        >
          <Text style={styles.actionIcon}>💰</Text>
          <Text style={styles.actionText}>{t('wallet.title')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Support')}
        >
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>{t('common.support')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('home.availableRoutes')}</Text>
        {recommendedGroups.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>{t('home.noActiveGroups')}</Text>
          </View>
        ) : (
          recommendedGroups.map((group, idx) => (
            <TouchableOpacity
              key={group.id || idx}
              style={styles.groupCard}
              onPress={() => navigation.navigate('Search', { groupId: group.id })}
            >
              <View style={styles.groupInfo}>
                <Text style={styles.groupName}>{group.name}</Text>
                <Text style={styles.groupRoute}>{group.routeName}</Text>
                <Text style={styles.groupDetail}>
                  {t('search.departure')}: {group.departureTime} | {t('search.price')}: ${group.price?.toFixed(2)}
                </Text>
              </View>
              <View style={styles.seatsBadge}>
                <Text style={styles.seatsText}>{group.availableSeats} {t('search.availableSeats')}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.lg,
  },
  greeting: { fontSize: typography.sizes.xxxl, fontWeight: typography.weights.bold, color: colors.text.primary },
  date: { fontSize: typography.sizes.sm, color: colors.text.secondary, marginTop: spacing.xs },
  notifButton: {
    padding: spacing.sm + 4,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  notifIcon: { fontSize: 22 },
  activeTripCard: {
    marginHorizontal: spacing.lg,
    padding: spacing.lg - 4,
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  activeTripTitle: { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text.inverse },
  activeTripText: { fontSize: typography.sizes.sm, color: colors.primary[100], marginTop: spacing.xs },
  activeTripStatus: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm + 4 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.tertiary[400], marginRight: spacing.sm },
  activeTripStatusText: { fontSize: typography.sizes.sm, color: colors.primary[100] },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm + 4,
    marginBottom: spacing.lg,
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  actionIcon: { fontSize: 24, marginBottom: spacing.sm },
  actionText: { fontSize: typography.sizes.xs, fontWeight: typography.weights.medium, color: colors.text.primary },
  section: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  sectionTitle: { fontSize: typography.sizes.xl, fontWeight: typography.weights.bold, color: colors.text.primary, marginBottom: spacing.md },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  emptyText: { fontSize: typography.sizes.sm, color: colors.text.muted },
  groupCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm + 4,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.sm,
  },
  groupInfo: { flex: 1 },
  groupName: { fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.text.primary },
  groupRoute: { fontSize: typography.sizes.sm, color: colors.text.secondary, marginTop: spacing.xs },
  groupDetail: { fontSize: typography.sizes.xs, color: colors.text.muted, marginTop: spacing.xs },
  seatsBadge: {
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
  },
  seatsText: { fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, color: colors.primary[500] },
})
