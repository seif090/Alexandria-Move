import React from 'react'
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native'
import { colors, typography } from '../../theme'

interface LoadingScreenProps {
  message?: string
  fullScreen?: boolean
}

export function LoadingScreen({ message, fullScreen = true }: LoadingScreenProps) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size="large" color={colors.primary[500]} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center', padding: 32 },
  fullScreen: { flex: 1, backgroundColor: colors.background },
  message: { marginTop: 16, fontSize: typography.sizes.md, color: colors.text.secondary },
})
