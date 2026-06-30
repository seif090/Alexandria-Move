import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert, KeyboardAvoidingView, Platform } from 'react-native'
import api from '../services/api'
import { colors, borderRadius, typography, spacing, shadows } from '../theme'

const FAQ_ITEMS = [
  { q: 'How do I start a trip?', a: 'Navigate to your assigned trip and tap "Start Trip" when you arrive at the pickup location.' },
  { q: 'How do I mark a passenger as picked up?', a: 'In the trip details, tap "Pick Up" next to the passenger\'s name after they board.' },
  { q: 'What if a passenger is not at the pickup?', a: 'Wait 5 minutes, then mark them as no-show in the trip details.' },
  { q: 'How do I report an issue?', a: 'Create a support ticket below or contact dispatch directly.' },
  { q: 'When do I get paid?', a: 'Earnings are processed weekly and deposited to your account every Friday.' },
]

export default function SupportScreen() {
  const { t } = useTranslation()
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [sending, setSending] = useState(false)

  const submitTicket = async () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert(t('common.error'), t('support.error'))
      return
    }
    setSending(true)
    try {
      await api.post('/support/tickets', { subject: subject.trim(), message: message.trim() })
      Alert.alert(t('common.success'), t('support.success'))
      setSubject('')
      setMessage('')
    } catch (err: any) {
      Alert.alert(t('common.error'), err.response?.data?.data?.message || err.response?.data?.message || t('support.error'))
    } finally { setSending(false) }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList
        data={FAQ_ITEMS}
        keyExtractor={(_, idx) => idx.toString()}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.title}>{t('support.title')}</Text>
              <Text style={styles.subtitle}>{t('support.responseTime')}</Text>
            </View>

            <Text style={styles.sectionTitle}>{t('support.faq')}</Text>
          </>
        }
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.faqItem}
            onPress={() => setExpandedFaq(expandedFaq === index ? null : index)}
          >
            <View style={styles.faqHeader}>
              <Text style={styles.faqQuestion}>{item.q}</Text>
              <Text style={styles.faqArrow}>{expandedFaq === index ? '?' : '?'}</Text>
            </View>
            {expandedFaq === index && (
              <Text style={styles.faqAnswer}>{item.a}</Text>
            )}
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <>
            <Text style={styles.sectionTitle}>{t('support.reportIssue')}</Text>
            <View style={styles.formCard}>
              <Text style={styles.formLabel}>{t('support.subject')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('support.subjectPlaceholder')}
                placeholderTextColor="#9ca3af"
                value={subject}
                onChangeText={setSubject}
              />
              <Text style={styles.formLabel}>{t('support.messageLabel')}</Text>
              <TextInput
                style={styles.textArea}
                placeholder={t('support.messagePlaceholder')}
                placeholderTextColor="#9ca3af"
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <TouchableOpacity
                style={[styles.submitBtn, sending && styles.submitBtnDisabled]}
                onPress={submitTicket}
                disabled={sending}
              >
                <Text style={styles.submitBtnText}>
                  {sending ? t('support.sending') : t('support.sendButton')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.contactCard}>
              <Text style={styles.contactTitle}>{t('support.contactUs')}</Text>
              <View style={styles.contactRow}>
                <Text style={styles.contactIcon}>??</Text>
                <Text style={styles.contactText}>{t('support.phoneNumber')}</Text>
              </View>
              <View style={styles.contactRow}>
                <Text style={styles.contactIcon}>??</Text>
                <Text style={styles.contactText}>{t('support.emergency')}</Text>
              </View>
            </View>

            <View style={{ height: 40 }} />
          </>
        }
      />
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.lg },
  header: { marginBottom: spacing.lg },
  title: { fontSize: typography.sizes.xxxl, fontWeight: typography.weights.bold, color: colors.text.primary },
  subtitle: { fontSize: typography.sizes.sm, color: colors.text.secondary, marginTop: spacing.xs },
  sectionTitle: { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text.primary, marginBottom: spacing.md, marginTop: spacing.sm },
  faqItem: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm, ...shadows.sm },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { fontSize: 15, fontWeight: typography.weights.medium, color: colors.text.primary, flex: 1, marginRight: spacing.sm },
  faqArrow: { fontSize: 12, color: colors.text.muted },
  faqAnswer: { fontSize: typography.sizes.sm, color: colors.text.secondary, marginTop: spacing.sm + 4, lineHeight: 20 },
  formCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg - 4, marginBottom: spacing.md, ...shadows.sm },
  formLabel: { fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, color: colors.text.primary, marginBottom: spacing.xs + 2, marginTop: spacing.xs },
  input: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 4, fontSize: 15, color: colors.text.primary, marginBottom: spacing.sm + 4 },
  textArea: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 4, fontSize: 15, color: colors.text.primary, minHeight: 100, marginBottom: spacing.md },
  submitBtn: { backgroundColor: colors.primary[500], paddingVertical: 14, borderRadius: borderRadius.md, alignItems: 'center' },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: colors.text.inverse, fontSize: typography.sizes.md, fontWeight: typography.weights.bold },
  contactCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg - 4, marginBottom: spacing.md, ...shadows.sm },
  contactTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.text.primary, marginBottom: spacing.sm + 4 },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  contactIcon: { fontSize: typography.sizes.md },
  contactText: { fontSize: typography.sizes.sm, color: colors.text.primary },
})
