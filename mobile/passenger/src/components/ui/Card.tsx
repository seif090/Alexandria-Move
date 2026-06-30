import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { colors, borderRadius, spacing, shadows } from '../../theme'

interface CardProps {
  children: React.ReactNode
  style?: ViewStyle
  variant?: 'default' | 'elevated' | 'outlined'
}

export function Card({ children, style, variant = 'default' }: CardProps) {
  return (
    <View style={[styles.base, styles[variant], style]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  base: { borderRadius: borderRadius.lg, padding: spacing.md },
  default: { backgroundColor: colors.surface, ...shadows.sm },
  elevated: { backgroundColor: colors.surface, ...shadows.lg },
  outlined: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
})
