import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next'
import api from '../../services/api'
import { Community } from '../../types'
import { colors, borderRadius, typography, spacing, shadows } from '../../theme'
import { ScreenWrapper, EmptyState, Card } from '../../components/ui'

export default function CommunityListScreen({ navigation }: any) {
  const { t } = useTranslation()
  const [communities, setCommunities] = useState<Community[]>([])
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState<string | null>(null)

  useEffect(() => { loadCommunities() }, [])

  const loadCommunities = async () => {
    setLoading(true)
    try {
      const res = await api.get('/communities')
      const data = res.data.data?.items || res.data.data || []
      setCommunities(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load communities', err)
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async (communityId: string) => {
    setJoining(communityId)
    try {
      await api.post(`/communities/${communityId}/members`)
      Alert.alert(t('common.success'), t('community.joined'))
      loadCommunities()
    } catch (err: any) {
      Alert.alert(t('common.error'), err.response?.data?.message || t('common.error'))
    } finally {
      setJoining(null)
    }
  }

  const handleLeave = async (communityId: string) => {
    Alert.alert(t('community.leaveTitle'), t('community.leaveConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.confirm'),
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/communities/${communityId}/members/me`)
            Alert.alert(t('common.success'), t('community.left'))
            loadCommunities()
          } catch (err: any) {
            Alert.alert(t('common.error'), err.response?.data?.message || t('common.error'))
          }
        },
      },
    ])
  }

  const renderCommunity = ({ item }: { item: Community }) => (
    <TouchableOpacity onPress={() => navigation.navigate('CommunityDetail', { communityId: item.id })}>
      <Card variant="elevated" style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardType}>{item.type}</Text>
          </View>
          {item.isMember ? (
            <TouchableOpacity style={styles.leaveBtn} onPress={() => handleLeave(item.id)}>
              <Text style={styles.leaveBtnText}>{t('community.leave')}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.joinBtn}
              onPress={() => handleJoin(item.id)}
              disabled={joining === item.id}
            >
              {joining === item.id ? (
                <ActivityIndicator size="small" color={colors.surface} />
              ) : (
                <Text style={styles.joinBtnText}>{t('community.join')}</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
        {item.description && <Text style={styles.cardDescription}>{item.description}</Text>}
        <View style={styles.cardStats}>
          <Text style={styles.stat}>{item.memberCount || 0} members</Text>
          <Text style={styles.statDot}>·</Text>
          <Text style={styles.stat}>{item.groupCount || 0} groups</Text>
        </View>
      </Card>
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.center}><ActivityIndicator size="large" color={colors.primary[500]} /></View>
      </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper>
      <FlatList
        data={communities}
        keyExtractor={(item) => item.id}
        renderItem={renderCommunity}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState title={t('community.noCommunities')} message={t('community.noCommunitiesDesc')} />}
      />
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: spacing.md },
  card: { marginBottom: spacing.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardHeaderLeft: { flex: 1 },
  cardName: { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text.primary },
  cardType: { fontSize: typography.sizes.xs, color: colors.primary[500], fontWeight: typography.weights.semibold, marginTop: spacing.xs, textTransform: 'uppercase' },
  cardDescription: { fontSize: typography.sizes.sm, color: colors.text.secondary, marginTop: spacing.sm },
  cardStats: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  stat: { fontSize: typography.sizes.xs, color: colors.text.muted },
  statDot: { fontSize: typography.sizes.xs, color: colors.text.muted, marginHorizontal: spacing.xs },
  joinBtn: { backgroundColor: colors.primary[500], borderRadius: borderRadius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  joinBtnText: { color: colors.text.inverse, fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold },
  leaveBtn: { borderWidth: 1, borderColor: colors.error, borderRadius: borderRadius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  leaveBtnText: { color: colors.error, fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold },
})
