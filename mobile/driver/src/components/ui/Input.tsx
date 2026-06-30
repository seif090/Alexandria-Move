import React, { useState } from 'react'
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native'
import { colors, borderRadius, typography, spacing } from '../../theme'

interface InputProps {
  label?: string
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  error?: string
  secureTextEntry?: boolean
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric' | 'number-pad'
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  multiline?: boolean
  style?: ViewStyle
  editable?: boolean
}

export function Input({ label, value, onChangeText, placeholder, error, secureTextEntry, keyboardType, autoCapitalize, multiline, style, editable }: InputProps) {
  const [focused, setFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, focused ? styles.inputFocused : undefined, error ? styles.inputError : undefined]}>
        <TextInput
          style={[styles.input, multiline && styles.multiline]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.gray[400]}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          editable={editable}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
            <Text style={styles.eyeText}>{showPassword ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  label: { fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, color: colors.text.primary, marginBottom: spacing.xs },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderWidth: 1.5,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
  },
  inputFocused: { borderColor: colors.primary[500], backgroundColor: colors.white },
  inputError: { borderColor: colors.error },
  input: { flex: 1, paddingVertical: 14, fontSize: typography.sizes.md, color: colors.text.primary, minHeight: 48 },
  multiline: { minHeight: 100, textAlignVertical: 'top' },
  eyeButton: { paddingLeft: spacing.sm },
  eyeText: { fontSize: typography.sizes.sm, color: colors.primary[500], fontWeight: typography.weights.semibold },
  error: { fontSize: typography.sizes.xs, color: colors.error, marginTop: spacing.xs },
})
