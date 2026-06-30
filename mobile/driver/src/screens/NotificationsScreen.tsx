import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native'
import api from '../services/api'
import { Notification } from '../types'
import { colors, borderRadius, typography, spacing, shadows } from '../theme'

export default function NotificationsScreen() {
  const { t } = useTranslation()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadNotifications() }, [])

  const loadNotifications = async () => {
    try {
      const res = await api.get('/notifications')
      setNotifications(res.data.data || [])
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  const onRefresh = async () => { setRefreshing(true); await loadNotifications(); setRefreshing(false) }

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      )
    } catch (err) { console.error(err) }
  }

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all')
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    } catch (err) { console.error(err) }
  }

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      trip_assigned: '📋',
      trip_started: '🚗',
      trip_completed: '✅',
      trip_cancelled: '❌',
      payment_received: '💰',
      document_verified: '✅',
      document_rejected: '❌',
      reminder: '⏰',
      alert: '⚠️',
      system: '🔔',
    }
    return icons[type] || '📬'
  }

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return t('notifications.newMessage')
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{t('notifications.title')}</Text>
          {unreadCount > 0 && (
            <Text style={styles.unreadCount}>{unreadCount} {t('common.notifications')}</Text>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllBtn} onPress={markAllRead}>
            <Text style={styles.markAllText}>{t('notifications.markAllRead')}</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.notifCard, !item.isRead && styles.notifUnread]}
            onPress={() => !item.isRead && markAsRead(item.id)}
          >
            <View style={[styles.iconContainer, !item.isRead && styles.iconUnread]}>
              <Text style={styles.notifIcon}>{getNotificationIcon(item.type)}</Text>
            </View>
            <View style={styles.notifContent}>
              <Text style={styles.notifTitle}>{item.title}</Text>
              <Text style={styles.notifBody} numberOfLines={2}>{item.body}</Text>
              <Text style={styles.notifTime}>{getTimeAgo(item.sentAt)}</Text>
            </View>
            {!item.isRead && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>??</Text>
            <Text style={styles.emptyText}>{t('notifications.noNotifications')}</Text>
            <Text style={styles.emptySubtext}>{t('notifications.emptyState')}</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.md },
  title: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.bold, color: colors.text.primary },
  unreadCount: { fontSize: typography.sizes.sm, color: colors.primary[500], marginTop: spacing.xs, fontWeight: typography.weights.medium },
  markAllBtn: { paddingHorizontal: spacing.sm + 4, paddingVertical: spacing.xs + 2, borderRadius: spacing.sm, backgroundColor: colors.primary[50] },
  markAllText: { fontSize: 13, color: colors.primary[500], fontWeight: typography.weights.semibold },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  notifCard: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, alignItems: 'center', ...shadows.sm },
  notifUnread: { backgroundColor: colors.primary[50], borderWidth: 1, borderColor: colors.primary[100] },
  iconContainer: { width: 44, height: 44, borderRadius: borderRadius.md, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', marginRight: spacing.sm + 4 },
  iconUnread: { backgroundColor: colors.primary[100] },
  notifIcon: { fontSize: typography.sizes.xl },
  notifContent: { flex: 1 },
  notifTitle: { fontSize: 15, fontWeight: typography.weights.semibold, color: colors.text.primary },
  notifBody: { fontSize: 13, color: colors.text.secondary, marginTop: spacing.xs, lineHeight: 18 },
  notifTime: { fontSize: 11, color: colors.text.muted, marginTop: spacing.xs },
  unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary[500], marginLeft: spacing.sm },
  empty: { alignItems: 'center', paddingTop: 100 },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyText: { fontSize: typography.sizes.lg, fontWeight: typography.weights.semibold, color: colors.text.primary },
  emptySubtext: { fontSize: typography.sizes.sm, color: colors.text.muted, marginTop: spacing.xs },
})
