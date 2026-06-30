import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, borderRadius, typography, spacing } from '../../theme'

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'neutral'

interface BadgeProps {
  label: string
  variant?: BadgeVariant
}

const badgeColors = {
  primary: { bg: colors.primary[50], text: colors.primary[700] },
  success: { bg: colors.tertiary[50], text: colors.tertiary[700] },
  warning: { bg: colors.secondary[50], text: colors.secondary[700] },
  error: { bg: '#fef2f2', text: colors.error },
  neutral: { bg: colors.gray[100], text: colors.gray[700] },
}

export function Badge({ label, variant = 'neutral' }: BadgeProps) {
  const colors_ = badgeColors[variant]
  return (
    <View style={[styles.badge, { backgroundColor: colors_.bg }]}>
      <Text style={[styles.text, { color: colors_.text }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.pill, alignSelf: 'flex-start' },
  text: { fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold },
})
