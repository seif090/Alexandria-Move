import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next'
import api from '../../services/api'
import { Community, TransportationGroup } from '../../types'
import { colors, borderRadius, typography, spacing, shadows } from '../../theme'
import { ScreenWrapper, Card, Badge, EmptyState, Button } from '../../components/ui'

export default function CommunityDetailScreen({ route, navigation }: any) {
  const { t } = useTranslation()
  const { communityId } = route.params
  const [community, setCommunity] = useState<Community | null>(null)
  const [groups, setGroups] = useState<TransportationGroup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [commRes, groupsRes] = await Promise.all([
        api.get(`/communities/${communityId}`),
        api.get(`/groups?communityId=${communityId}`),
      ])
      setCommunity(commRes.data.data)
      const gData = groupsRes.data.data?.items || groupsRes.data.data || []
      setGroups(Array.isArray(gData) ? gData : [])
    } catch (err) {
      console.error('Failed to load community', err)
    } finally {
      setLoading(false)
    }
  }

  const handleBookGroup = (group: TransportationGroup) => {
    navigation.navigate('Home', { screen: 'Search', params: { groupId: group.id } })
  }

  const renderGroup = ({ item }: { item: TransportationGroup }) => (
    <Card variant="outlined" style={styles.groupCard}>
      <View style={styles.groupHeader}>
        <Text style={styles.groupName}>{item.name}</Text>
        <Badge variant="primary" label={item.status || t('common.active')} />
      </View>
      <Text style={styles.groupRoute}>{item.routeName || `${item.fromLocation || ''} → ${item.toLocation || ''}`}</Text>
      <View style={styles.groupDetails}>
        <Text style={styles.groupDetail}>{item.departureTime || t('common.pending')}</Text>
        <Text style={styles.groupDetail}>{item.availableSeats ?? 0} seats</Text>
        <Text style={styles.groupDetail}>${item.price?.toFixed(2) || '0.00'}</Text>
      </View>
      <Button title={t('bookings.book')} onPress={() => handleBookGroup(item)} variant="outline" style={styles.bookBtn} />
    </Card>
  )

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.center}><ActivityIndicator size="large" color={colors.primary[500]} /></View>
      </ScreenWrapper>
    )
  }

  if (!community) {
    return (
      <ScreenWrapper>
        <EmptyState title={t('community.notFound')} message={t('community.notFoundDesc')} />
      </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={renderGroup}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Card variant="elevated" style={styles.commCard}>
            <Text style={styles.commName}>{community.name}</Text>
            <Text style={styles.commType}>{community.type}</Text>
            {community.description && <Text style={styles.commDesc}>{community.description}</Text>}
            <View style={styles.commStats}>
              <View style={styles.commStat}>
                <Text style={styles.commStatValue}>{community.memberCount || 0}</Text>
                <Text style={styles.commStatLabel}>Members</Text>
              </View>
              <View style={styles.commStat}>
                <Text style={styles.commStatValue}>{community.groupCount || 0}</Text>
                <Text style={styles.commStatLabel}>Groups</Text>
              </View>
            </View>
          </Card>
        }
        ListEmptyComponent={<EmptyState title={t('community.noGroups')} message={t('community.noGroupsDesc')} />}
      />
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: spacing.md },
  commCard: { marginBottom: spacing.lg, padding: spacing.lg },
  commName: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.bold, color: colors.text.primary },
  commType: { fontSize: typography.sizes.xs, color: colors.primary[500], fontWeight: typography.weights.semibold, marginTop: spacing.xs, textTransform: 'uppercase' },
  commDesc: { fontSize: typography.sizes.sm, color: colors.text.secondary, marginTop: spacing.sm },
  commStats: { flexDirection: 'row', justifyContent: 'space-around', marginTop: spacing.lg },
  commStat: { alignItems: 'center' },
  commStatValue: { fontSize: typography.sizes.xl, fontWeight: typography.weights.bold, color: colors.primary[500] },
  commStatLabel: { fontSize: typography.sizes.xs, color: colors.text.muted, marginTop: spacing.xs },
  groupCard: { marginBottom: spacing.md },
  groupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  groupName: { fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.text.primary, flex: 1 },
  groupRoute: { fontSize: typography.sizes.sm, color: colors.text.secondary, marginTop: spacing.xs },
  groupDetails: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  groupDetail: { fontSize: typography.sizes.xs, color: colors.text.muted },
  bookBtn: { marginTop: spacing.sm },
})
