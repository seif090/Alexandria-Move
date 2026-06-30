import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native'
import api from '../services/api'
import { colors, borderRadius, typography, spacing, shadows } from '../theme'

export default function RatingsScreen({ route, navigation }: any) {
  const { t } = useTranslation()
  const [score, setScore] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const tripId = route?.params?.tripId
  const bookingId = route?.params?.bookingId

  const handleSubmit = async () => {
    if (score === 0) {
      Alert.alert(t('common.error'), t('ratings.error'))
      return
    }
    setSubmitting(true)
    try {
      await api.post('/ratings', {
        tripId,
        bookingId,
        score,
        reviewText: reviewText || undefined,
      })
      Alert.alert(t('ratings.success'), t('ratings.success'), [
        { text: t('common.ok'), onPress: () => navigation.goBack() },
      ])
    } catch (err: any) {
      Alert.alert(t('common.error'), err.response?.data?.data?.message || err.response?.data?.message || t('ratings.error'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{t('ratings.title')}</Text>
        <Text style={styles.subtitle}>{t('ratings.subtitle')}</Text>

        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setScore(star)}>
              <Text style={[styles.star, star <= score && styles.starActive]}>
                {star <= score ? '★' : '☆'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.scoreLabels}>
          <Text style={styles.scoreLabel}>Poor</Text>
          <Text style={styles.scoreLabel}>Excellent</Text>
        </View>

        <Text style={styles.label}>{t('ratings.reviewLabel')} ({t('common.optional')})</Text>
        <TextInput
          style={styles.textArea}
          value={reviewText}
          onChangeText={setReviewText}
          placeholder={t('ratings.reviewPlaceholder')}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity
          style={[styles.submitButton, score === 0 && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={submitting || score === 0}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>{t('ratings.submitButton')}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', paddingHorizontal: spacing.lg },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.lg,
  },
  title: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.bold, color: colors.text.primary, textAlign: 'center' },
  subtitle: { fontSize: typography.sizes.sm, color: colors.text.secondary, textAlign: 'center', marginTop: spacing.xs, marginBottom: spacing.lg },
  starsContainer: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm },
  star: { fontSize: 40, color: colors.border },
  starActive: { color: colors.secondary[500] },
  scoreLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  scoreLabel: { fontSize: typography.sizes.xs, color: colors.text.muted },
  label: { fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, color: colors.text.primary, marginBottom: spacing.sm },
  textArea: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    fontSize: typography.sizes.sm,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.lg - 4,
  },
  disabledButton: { backgroundColor: colors.primary[200] },
  submitButtonText: { color: colors.text.inverse, fontSize: typography.sizes.md, fontWeight: typography.weights.semibold },
})
