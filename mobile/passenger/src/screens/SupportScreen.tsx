import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import api from '../services/api'
import { SupportTicket, SupportMessage } from '../types'
import { colors, borderRadius, typography, spacing, shadows } from '../theme'

export default function SupportScreen() {
  const { t } = useTranslation()
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewTicket, setShowNewTicket] = useState(false)
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)

  useEffect(() => {
    loadTickets()
  }, [])

  const loadTickets = async () => {
    setLoading(true)
    try {
      const res = await api.get('/support/tickets')
      const data = res.data.data?.items || res.data.data || []
      setTickets(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load tickets', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTicket = async () => {
    if (!subject || !description) {
      Alert.alert(t('common.error'), t('auth.requiredField'))
      return
    }
    setSubmitting(true)
    try {
      const res = await api.post('/support/tickets', { subject, description })
      Alert.alert(t('common.success'), t('support.success'))
      setShowNewTicket(false)
      setSubject('')
      setDescription('')
      const newTicket = res.data.data
      setTickets((prev) => [newTicket, ...prev])
    } catch (err: any) {
      Alert.alert(t('common.error'), err.response?.data?.data?.message || err.response?.data?.message || t('support.error'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage || !selectedTicket) return
    setSendingMessage(true)
    try {
      const res = await api.post(`/support/tickets/${selectedTicket.id}/messages`, {
        message: newMessage,
      })
      const msg = res.data.data
      setSelectedTicket((prev) =>
        prev ? { ...prev, messages: [...prev.messages, msg] } : prev
      )
      setNewMessage('')
    } catch (err: any) {
      Alert.alert(t('common.error'), err.response?.data?.data?.message || err.response?.data?.message || t('support.error'))
    } finally {
      setSendingMessage(false)
    }
  }

  const handleSelectTicket = async (ticket: SupportTicket) => {
    try {
      const res = await api.get(`/support/tickets/${ticket.id}`)
      setSelectedTicket(res.data.data)
    } catch (err) {
      Alert.alert(t('common.error'), t('support.error'))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return colors.primary[500]
      case 'InProgress':
        return colors.secondary[500]
      case 'Resolved':
      case 'Closed':
        return colors.tertiary[500]
      default:
        return colors.text.secondary
    }
  }

  if (selectedTicket) {
    return (
      <View style={styles.container}>
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setSelectedTicket(null)}>
            <Text style={styles.backText}>{t('common.back')}</Text>
          </TouchableOpacity>
          <Text style={styles.chatTitle}>{selectedTicket.subject}</Text>
          <View
            style={[
              styles.ticketStatusBadge,
              { backgroundColor: getStatusColor(selectedTicket.status) + '20' },
            ]}
          >
            <Text
              style={[styles.ticketStatusText, { color: getStatusColor(selectedTicket.status) }]}
            >
              {selectedTicket.status}
            </Text>
          </View>
        </View>

        <FlatList
          style={styles.messageList}
          data={selectedTicket.messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.messageBubble}>
              <View style={styles.messageHeader}>
                <Text style={styles.messageSender}>{item.senderName}</Text>
                <Text style={styles.messageTime}>
                  {new Date(item.sentAt).toLocaleTimeString()}
                </Text>
              </View>
              <Text style={styles.messageText}>{item.message}</Text>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyChat}>
              <Text style={styles.emptyChatText}>{t('support.messagePlaceholder')}</Text>
            </View>
          }
        />

        <View style={styles.inputRow}>
          <TextInput
            style={styles.messageInput}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder={t('support.messagePlaceholder')}
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
            disabled={sendingMessage || !newMessage}
          >
            {sendingMessage ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.sendButtonText}>{t('common.send')}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {!showNewTicket ? (
        <>
          <TouchableOpacity
            style={styles.newTicketButton}
            onPress={() => setShowNewTicket(true)}
          >
            <Text style={styles.newTicketButtonText}>{t('support.reportIssue')}</Text>
          </TouchableOpacity>

          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#2563eb" />
            </View>
          ) : tickets.length === 0 ? (
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>{t('common.noData')}</Text>
            </View>
          ) : (
            <FlatList
              data={tickets}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.ticketList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.ticketCard}
                  onPress={() => handleSelectTicket(item)}
                >
                  <View style={styles.ticketHeader}>
                    <Text style={styles.ticketSubject} numberOfLines={1}>
                      {item.subject}
                    </Text>
                    <View
                      style={[
                        styles.ticketStatusBadge,
                        { backgroundColor: getStatusColor(item.status) + '20' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.ticketStatusText,
                          { color: getStatusColor(item.status) },
                        ]}
                      >
                        {item.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.ticketDate}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
        </>
      ) : (
        <KeyboardAvoidingView
          style={styles.newTicketForm}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity onPress={() => setShowNewTicket(false)}>
            <Text style={styles.backText}>{t('common.back')}</Text>
          </TouchableOpacity>
          <Text style={styles.formTitle}>{t('support.reportIssue')}</Text>

          <Text style={styles.label}>{t('support.subject')}</Text>
          <TextInput
            style={styles.input}
            value={subject}
            onChangeText={setSubject}
            placeholder={t('support.subjectPlaceholder')}
          />

          <Text style={styles.label}>{t('common.description')}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder={t('support.messagePlaceholder')}
            multiline
            numberOfLines={5}
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleCreateTicket}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>{t('common.submit')}</Text>
            )}
          </TouchableOpacity>
        </KeyboardAvoidingView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: typography.sizes.md, color: colors.text.muted },
  newTicketButton: {
    backgroundColor: colors.primary[500],
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  newTicketButtonText: { color: colors.text.inverse, fontSize: typography.sizes.md, fontWeight: typography.weights.semibold },
  ticketList: { padding: spacing.md },
  ticketCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ticketSubject: { fontSize: typography.sizes.md, fontWeight: typography.weights.medium, color: colors.text.primary, flex: 1, marginRight: spacing.sm },
  ticketStatusBadge: { borderRadius: spacing.sm, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  ticketStatusText: { fontSize: 11, fontWeight: typography.weights.semibold },
  ticketDate: { fontSize: typography.sizes.xs, color: colors.text.muted, marginTop: spacing.sm },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: 60,
    paddingBottom: spacing.sm + 4,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm + 4,
  },
  backText: { fontSize: typography.sizes.md, color: colors.primary[500], fontWeight: typography.weights.medium },
  chatTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.text.primary, flex: 1 },
  messageList: { flex: 1, padding: spacing.md },
  messageBubble: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm + 4,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  messageHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  messageSender: { fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold, color: colors.primary[500] },
  messageTime: { fontSize: 11, color: colors.text.muted },
  messageText: { fontSize: typography.sizes.sm, color: colors.text.primary },
  emptyChat: { alignItems: 'center', paddingTop: 40 },
  emptyChatText: { fontSize: typography.sizes.sm, color: colors.text.muted },
  inputRow: {
    flexDirection: 'row',
    padding: spacing.sm + 4,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  messageInput: {
    flex: 1,
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: typography.sizes.sm,
    maxHeight: 80,
  },
  sendButton: {
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg - 4,
    justifyContent: 'center',
  },
  sendButtonText: { color: colors.text.inverse, fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold },
  newTicketForm: { flex: 1, padding: spacing.md },
  formTitle: { fontSize: typography.sizes.xl, fontWeight: typography.weights.bold, color: colors.text.primary, marginTop: spacing.md, marginBottom: spacing.lg - 4 },
  label: { fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, color: colors.text.primary, marginBottom: spacing.xs, marginTop: spacing.sm + 4 },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    fontSize: typography.sizes.md,
  },
  textArea: { minHeight: 120, textAlignVertical: 'top' },
  submitButton: {
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  submitButtonText: { color: colors.text.inverse, fontSize: typography.sizes.md, fontWeight: typography.weights.semibold },
})
