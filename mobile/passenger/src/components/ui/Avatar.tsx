import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { colors, typography } from '../../theme'

interface AvatarProps {
  name: string
  imageUrl?: string | null
  size?: number
}

export function Avatar({ name, imageUrl, size = 48 }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  if (imageUrl) {
    return <Image source={{ uri: imageUrl }} style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]} />
  }

  return (
    <View style={[styles.fallback, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.initials, { fontSize: size * 0.4 }]}>{initials}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  image: { backgroundColor: colors.gray[200] },
  fallback: { backgroundColor: colors.primary[500], justifyContent: 'center', alignItems: 'center' },
  initials: { color: colors.white, fontWeight: typography.weights.bold },
})
