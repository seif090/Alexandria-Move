import React from 'react'
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native'
import { colors, borderRadius, typography, spacing } from '../../theme'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: ButtonVariant
  disabled?: boolean
  loading?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
  icon?: React.ReactNode
}

export function Button({ title, onPress, variant = 'primary', disabled, loading, style, textStyle, icon }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? colors.primary[500] : colors.white} size="small" />
      ) : (
        <>
          {icon}
          <Text style={[styles.text, styles[`${variant}Text` as keyof typeof styles] as TextStyle, icon ? { marginLeft: spacing.sm } : undefined, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    minHeight: 48,
  },
  primary: { backgroundColor: colors.primary[500] },
  secondary: { backgroundColor: colors.secondary[500] },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary[500] },
  ghost: { backgroundColor: 'transparent' },
  disabled: { opacity: 0.5 },
  text: { fontSize: typography.sizes.md, fontWeight: typography.weights.semibold },
  primaryText: { color: colors.white },
  secondaryText: { color: colors.white },
  outlineText: { color: colors.primary[500] },
  ghostText: { color: colors.primary[500] },
})
