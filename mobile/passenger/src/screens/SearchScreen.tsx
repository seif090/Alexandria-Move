import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native'
import api from '../services/api'
import { TransportationGroup, Community } from '../types'
import { colors, borderRadius, typography, spacing, shadows } from '../theme'

export default function SearchScreen({ navigation, route }: any) {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [communities, setCommunities] = useState<Community[]>([])
  const [selectedCommunity, setSelectedCommunity] = useState<string>('')
  const [groups, setGroups] = useState<TransportationGroup[]>([])
  const [loading, setLoading] = useState(false)
  const [bookingId, setBookingId] = useState<string | null>(null)

  useEffect(() => {
    loadCommunities()
    if (route?.params?.groupId) {
      loadGroups(route.params.groupId)
    } else {
      loadGroups()
    }
  }, [])

  const loadCommunities = async () => {
    try {
      const res = await api.get('/communities')
      const data = res.data.data?.items || res.data.data || []
      setCommunities(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load communities', err)
    }
  }

  const loadGroups = async (groupId?: string) => {
    setLoading(true)
    try {
      const params: any = {}
      if (searchQuery) params.search = searchQuery
      if (selectedCommunity) params.communityId = selectedCommunity
      if (groupId) params.groupId = groupId

      const res = await api.get('/groups', { params })
      const data = res.data.data?.items || res.data.data || []
      setGroups(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load groups', err)
    } finally {
      setLoading(false)
    }
  }

  const handleBook = async (group: TransportationGroup) => {
    if (group.availableSeats <= 0) {
      Alert.alert(t('common.error'), t('search.noResults'))
      return
    }
    try {
      const res = await api.post('/bookings', {
        groupId: group.id,
        seatCount: 1,
      })
      const booking = res.data.data
      setBookingId(booking.id)
      Alert.alert(t('notifications.bookingConfirmed'), `${t('notifications.bookingConfirmed')} - ${group.name}`, [
        { text: t('bookings.title'), onPress: () => navigation.navigate('Bookings') },
        { text: t('common.ok') },
      ])
    } catch (err: any) {
      Alert.alert(t('common.error'), err.response?.data?.data?.message || err.response?.data?.message || t('wallet.paymentFailed'))
    }
  }

  const renderGroup = ({ item }: { item: TransportationGroup }) => (
    <TouchableOpacity style={styles.groupCard}>
      <View style={styles.groupHeader}>
        <Text style={styles.groupName}>{item.name}</Text>
        <View style={styles.seatsBadge}>
          <Text style={styles.seatsText}>{item.availableSeats} {t('search.availableSeats')}</Text>
        </View>
      </View>
      <Text style={styles.groupRoute}>{t('bookings.route')}: {item.routeName}</Text>
      <Text style={styles.groupDriver}>{t('trip.driver')}: {item.driverName}</Text>
      <View style={styles.groupDetails}>
        <Text style={styles.groupDetail}>{t('search.departure')}: {item.departureTime}</Text>
        <Text style={styles.groupDetail}>{t('home.recentTrips')}: {item.returnTime}</Text>
      </View>
      <Text style={styles.groupDays}>{t('bookings.date')}: {item.workingDays}</Text>
      <View style={styles.groupFooter}>
        <Text style={styles.groupPrice}>${item.price?.toFixed(2)}</Text>
        <TouchableOpacity
          style={[styles.bookButton, item.availableSeats <= 0 && styles.disabledButton]}
          onPress={() => handleBook(item)}
        >
          <Text style={styles.bookButtonText}>
            {item.availableSeats <= 0 ? t('common.pending') : t('search.bookNow')}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('common.search')}
          placeholderTextColor="#9ca3af"
          returnKeyType="search"
          onSubmitEditing={() => loadGroups()}
        />
        <TouchableOpacity style={styles.searchButton} onPress={() => loadGroups()}>
          <Text style={styles.searchButtonText}>{t('common.search')}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={communities}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.communityList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.communityChip,
              selectedCommunity === item.id && styles.communityChipActive,
            ]}
            onPress={() => {
              setSelectedCommunity(selectedCommunity === item.id ? '' : item.id)
              loadGroups()
            }}
          >
            <Text
              style={[
                styles.communityChipText,
                selectedCommunity === item.id && styles.communityChipTextActive,
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : groups.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t('search.noResults')} {t('search.adjustSearch')}</Text>
        </View>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id}
          renderItem={renderGroup}
          contentContainerStyle={styles.groupList}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingTop: 60,
    paddingBottom: spacing.sm + 4,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    fontSize: typography.sizes.md,
  },
  searchButton: {
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg - 4,
    justifyContent: 'center',
  },
  searchButtonText: { color: colors.text.inverse, fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold },
  communityList: { paddingHorizontal: spacing.md, gap: spacing.sm, paddingBottom: spacing.sm + 4 },
  communityChip: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  communityChipActive: { backgroundColor: colors.primary[500], borderColor: colors.primary[500] },
  communityChipText: { fontSize: typography.sizes.sm, color: colors.text.primary },
  communityChipTextActive: { color: colors.text.inverse },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.xl },
  emptyText: { fontSize: typography.sizes.md, color: colors.text.muted, textAlign: 'center' },
  groupList: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
  groupCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm + 4,
    ...shadows.sm,
  },
  groupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  groupName: { fontSize: typography.sizes.lg, fontWeight: typography.weights.semibold, color: colors.text.primary, flex: 1 },
  seatsBadge: {
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.md,
    paddingHorizontal: 10,
    paddingVertical: spacing.xs,
  },
  seatsText: { fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold, color: colors.primary[500] },
  groupRoute: { fontSize: typography.sizes.sm, color: colors.text.secondary, marginTop: spacing.xs },
  groupDriver: { fontSize: typography.sizes.sm, color: colors.text.secondary, marginTop: spacing.xs },
  groupDetails: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  groupDetail: { fontSize: typography.sizes.xs, color: colors.text.muted },
  groupDays: { fontSize: typography.sizes.xs, color: colors.text.muted, marginTop: spacing.xs },
  groupFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm + 4,
    paddingTop: spacing.sm + 4,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  groupPrice: { fontSize: typography.sizes.xl, fontWeight: typography.weights.bold, color: colors.primary[500] },
  bookButton: {
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
  },
  disabledButton: { backgroundColor: colors.text.muted },
  bookButtonText: { color: colors.text.inverse, fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold },
})
