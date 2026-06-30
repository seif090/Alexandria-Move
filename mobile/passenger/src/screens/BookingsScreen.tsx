import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native'
import api from '../services/api'
import { Booking } from '../types'
import { colors, borderRadius, typography, spacing, shadows } from '../theme'
import { TicketQrCode } from '../components/TicketQrCode'

const STATUS_FILTERS = ['All', 'Pending', 'Approved', 'Rejected', 'Completed', 'Cancelled']

export default function BookingsScreen({ navigation }: any) {
  const { t } = useTranslation()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [activeFilter, setActiveFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => loadBookings())
    return unsubscribe
  }, [])

  const loadBookings = async () => {
    setLoading(true)
    try {
      const res = await api.get('/bookings')
      const data = res.data.data?.items || res.data.data || []
      setBookings(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load bookings', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredBookings(bookings)
    } else {
      setFilteredBookings(bookings.filter((b) => b.status === activeFilter))
    }
  }, [activeFilter, bookings])

  const handleCancel = (booking: Booking) => {
    Alert.alert(
      t('bookings.cancelBooking'),
      `${t('bookings.cancelConfirm')} ${booking.groupName}?`,
      [
        { text: t('common.no'), style: 'cancel' },
        {
          text: t('common.yes'),
          style: 'destructive',
          onPress: async () => {
            try {
              await api.put(`/bookings/${booking.id}/cancel`)
              Alert.alert(t('common.cancelled'), t('bookings.bookingCancelled'))
              loadBookings()
            } catch (err: any) {
              Alert.alert(t('common.error'), err.response?.data?.data?.message || err.response?.data?.message || t('bookings.cancelBooking'))
            }
          },
        },
      ]
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return colors.secondary[500]
      case 'Approved':
        return colors.primary[500]
      case 'Completed':
        return colors.tertiary[500]
      case 'Rejected':
      case 'Cancelled':
        return colors.error
      default:
        return colors.text.secondary
    }
  }

  const renderBooking = ({ item }: { item: Booking }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.groupName}>{item.groupName}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('common.date')}</Text>
          <Text style={styles.detailValue}>
            {new Date(item.bookingDate).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('bookings.passengers')}</Text>
          <Text style={styles.detailValue}>{item.seatCount}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('bookings.totalAmount')}</Text>
          <Text style={styles.detailValue}>${item.totalPrice?.toFixed(2)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('wallet.paymentMethod')}</Text>
          <Text style={styles.detailValue}>
            {item.paymentMethod} ({item.paymentStatus})
          </Text>
        </View>
      </View>

      {item.qrCodeToken && (
        <TicketQrCode
          token={item.qrCodeToken}
          bookingId={item.id}
          groupName={item.groupName}
          seatCount={item.seatCount}
          date={new Date(item.bookingDate).toLocaleDateString()}
        />
      )}

      <View style={styles.cardFooter}>
        {item.status === 'Approved' || item.status === 'Pending' ? (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => handleCancel(item)}
          >
            <Text style={styles.cancelButtonText}>{t('bookings.cancelBooking')}</Text>
          </TouchableOpacity>
        ) : null}
        {item.status === 'Completed' && (
          <TouchableOpacity
            style={styles.rateButton}
            onPress={() => navigation.navigate('Ratings', { bookingId: item.id })}
          >
            <Text style={styles.rateButtonText}>{t('bookings.rateTrip')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )

  const displayFilterLabel = (filter: string) => {
    switch (filter) {
      case 'Pending': return t('common.pending')
      case 'Completed': return t('common.completed')
      case 'Cancelled': return t('common.cancelled')
      default: return filter
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        <FlatList
          horizontal
          data={STATUS_FILTERS}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterChip, activeFilter === item && styles.filterChipActive]}
              onPress={() => setActiveFilter(item)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  activeFilter === item && styles.filterChipTextActive,
                ]}
              >
                {displayFilterLabel(item)}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : filteredBookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t('bookings.noUpcoming')}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredBookings}
          keyExtractor={(item) => item.id}
          renderItem={renderBooking}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  filterRow: { paddingTop: spacing.sm + 4, paddingBottom: spacing.sm },
  filterList: { paddingHorizontal: spacing.md, gap: spacing.sm },
  filterChip: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: { backgroundColor: colors.primary[500], borderColor: colors.primary[500] },
  filterChipText: { fontSize: typography.sizes.sm, color: colors.text.primary },
  filterChipTextActive: { color: colors.text.inverse },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: typography.sizes.md, color: colors.text.muted },
  list: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm + 4,
    ...shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm + 4,
  },
  groupName: { fontSize: typography.sizes.lg, fontWeight: typography.weights.semibold, color: colors.text.primary, flex: 1 },
  statusBadge: { borderRadius: borderRadius.md, paddingHorizontal: 10, paddingVertical: spacing.xs },
  statusText: { fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold },
  cardBody: { gap: spacing.sm, marginBottom: spacing.sm + 4 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailLabel: { fontSize: typography.sizes.sm, color: colors.text.secondary },
  detailValue: { fontSize: typography.sizes.sm, color: colors.text.primary, fontWeight: typography.weights.medium },
  qrContainer: {
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.md,
    padding: spacing.sm + 4,
    marginBottom: spacing.sm + 4,
  },
  qrLabel: { fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, color: colors.text.primary },
  qrToken: { fontSize: typography.sizes.xs, color: colors.text.secondary, marginTop: spacing.xs },
  cardFooter: { flexDirection: 'row', gap: spacing.sm + 4 },
  cancelButton: {
    flex: 1,
    backgroundColor: '#fef2f2',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm + 4,
    alignItems: 'center',
  },
  cancelButtonText: { color: colors.error, fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold },
  rateButton: {
    flex: 1,
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm + 4,
    alignItems: 'center',
  },
  rateButtonText: { color: colors.primary[500], fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold },
})
