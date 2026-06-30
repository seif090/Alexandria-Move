import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, typography, spacing } from '../../theme'
import { Button } from './Button'

interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>⚠️</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && <Button title="Try Again" onPress={onRetry} variant="outline" style={styles.button} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  emoji: { fontSize: 48, marginBottom: spacing.md },
  message: { fontSize: typography.sizes.md, color: colors.text.secondary, textAlign: 'center' },
  button: { marginTop: spacing.lg },
})
