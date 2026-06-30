import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import api from '../services/api'
import { colors, borderRadius, typography, spacing, shadows } from '../theme'

export default function EarningsScreen() {
  const { t } = useTranslation()
  const [earnings, setEarnings] = useState<any[]>([])
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [period, setPeriod] = useState('week')

  useEffect(() => { loadEarnings() }, [period])

  const loadEarnings = async () => {
    try {
      const response = await api.get(`/payments/driver?period=${period}`)
      setEarnings(response.data.data?.items || response.data.data || [])
      setTotalEarnings(response.data.data?.total || 0)
    } catch (err) { console.error(err) }
  }

  const getPeriodLabel = (p: string) => {
    if (p === 'week') return t('earnings.thisWeek')
    if (p === 'month') return t('earnings.thisMonth')
    if (p === 'year') return t('earnings.total')
    return p.charAt(0).toUpperCase() + p.slice(1)
  }

  return (
    <View style={styles.container}>
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>{t('earnings.total')}</Text>
        <Text style={styles.totalAmount}>${totalEarnings.toFixed(2)}</Text>
        <View style={styles.periodSelector}>
          {['week', 'month', 'year'].map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.periodBtn, period === p && styles.periodActive]}
              onPress={() => setPeriod(p)}
            >
              <Text style={[styles.periodText, period === p && styles.periodTextActive]}>
                {getPeriodLabel(p)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={earnings}
        keyExtractor={(_, idx) => idx.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.transactionCard}>
            <View>
              <Text style={styles.transactionDesc}>{item.description || t('earnings.tripEarnings')}</Text>
              <Text style={styles.transactionDate}>{new Date(item.paidAt || item.createdAt).toLocaleDateString()}</Text>
            </View>
            <Text style={styles.transactionAmount}>+${item.amount?.toFixed(2) || '0.00'}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>💰</Text>
            <Text style={styles.emptyText}>{t('earnings.noEarnings')}</Text>
            <Text style={styles.emptySubtext}>{t('earnings.history')}</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  totalCard: { backgroundColor: colors.primary[500], paddingTop: 60, paddingBottom: spacing.xl, paddingHorizontal: spacing.lg, alignItems: 'center' },
  totalLabel: { fontSize: typography.sizes.sm, color: colors.primary[100], fontWeight: typography.weights.medium },
  totalAmount: { fontSize: 48, fontWeight: typography.weights.bold, color: colors.text.inverse, marginTop: spacing.sm },
  periodSelector: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg - 4 },
  periodBtn: { paddingHorizontal: spacing.lg - 4, paddingVertical: spacing.sm, borderRadius: borderRadius.pill, backgroundColor: 'rgba(255,255,255,0.2)' },
  periodActive: { backgroundColor: colors.surface },
  periodText: { color: colors.text.inverse, fontSize: typography.sizes.sm, fontWeight: typography.weights.medium },
  periodTextActive: { color: colors.primary[500] },
  list: { padding: spacing.md },
  transactionCard: { backgroundColor: colors.surface, padding: spacing.md, borderRadius: borderRadius.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm + 4, ...shadows.sm },
  transactionDesc: { fontSize: typography.sizes.md, fontWeight: typography.weights.medium, color: colors.text.primary },
  transactionDate: { fontSize: typography.sizes.xs, color: colors.text.muted, marginTop: spacing.xs },
  transactionAmount: { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.tertiary[500] },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyText: { fontSize: typography.sizes.md, color: colors.text.primary, fontWeight: typography.weights.semibold },
  emptySubtext: { fontSize: typography.sizes.sm, color: colors.text.muted, marginTop: spacing.xs },
})
