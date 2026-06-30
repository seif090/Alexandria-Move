import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import api from '../services/api'
import { Notification } from '../types'
import { colors, borderRadius, typography, spacing, shadows } from '../theme'

export default function NotificationsScreen() {
  const { t } = useTranslation()
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      const response = await api.get('/notifications')
      const data = response.data.data?.items || response.data.data || []
      setNotifications(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load notifications', err)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      )
    } catch (err) {
      console.error('Failed to mark as read', err)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'Booking':
        return '🎫'
      case 'Trip':
        return '🚗'
      case 'Payment':
        return '💳'
      case 'System':
        return '🔔'
      default:
        return '📬'
    }
  }

  return (
    <FlatList
      style={styles.container}
      data={notifications}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.card, !item.isRead && styles.unread]}
          onPress={() => !item.isRead && markAsRead(item.id)}
        >
          <View style={styles.cardRow}>
            <Text style={styles.icon}>{getNotificationIcon(item.type)}</Text>
            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={styles.title}>{item.title}</Text>
                {!item.isRead && <View style={styles.dot} />}
              </View>
              <Text style={styles.body}>{item.body}</Text>
              <Text style={styles.time}>
                {new Date(item.sentAt).toLocaleString()}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📬</Text>
          <Text style={styles.emptyText}>{t('notifications.noNotifications')}</Text>
        </View>
      }
    />
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm + 4,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  unread: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary[500],
  },
  cardRow: { flexDirection: 'row', gap: spacing.sm + 4 },
  icon: { fontSize: 24 },
  content: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.text.primary, flex: 1 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary[500],
    marginLeft: spacing.sm,
  },
  body: { fontSize: typography.sizes.sm, color: colors.text.secondary, marginTop: spacing.xs },
  time: { fontSize: typography.sizes.xs, color: colors.text.muted, marginTop: spacing.sm },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyIcon: { fontSize: 48, marginBottom: spacing.sm + 4 },
  emptyText: { fontSize: typography.sizes.md, color: colors.text.muted },
})
