import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, typography, spacing } from '../../theme'
import { Button } from './Button'

interface EmptyStateProps {
  title: string
  message?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📭</Text>
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} variant="outline" style={styles.button} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  emoji: { fontSize: 48, marginBottom: spacing.md },
  title: { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text.primary, textAlign: 'center' },
  message: { fontSize: typography.sizes.md, color: colors.text.secondary, textAlign: 'center', marginTop: spacing.sm },
  button: { marginTop: spacing.lg },
})
