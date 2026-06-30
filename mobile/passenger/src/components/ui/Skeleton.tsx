import React, { useEffect, useRef } from 'react'
import { View, Animated, StyleSheet, ViewStyle } from 'react-native'
import { colors, borderRadius } from '../../theme'

interface SkeletonProps {
  width?: number | string
  height?: number
  borderRadius_?: number
  style?: ViewStyle
}

export function Skeleton({ width = '100%', height = 20, borderRadius_ = borderRadius.sm, style }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3))

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity.current, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity.current, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    )
    animation.start()
    return () => animation.stop()
  }, [])

  return (
    <Animated.View
      style={[{ width: width as any, height, borderRadius: borderRadius_, backgroundColor: colors.gray[200], opacity: opacity.current }, style]}
    />
  )
}

export function CardSkeleton() {
  return (
    <View style={cardStyles.container}>
      <Skeleton height={16} width="60%" />
      <Skeleton height={14} width="40%" style={{ marginTop: 8 }} />
      <Skeleton height={14} width="80%" style={{ marginTop: 8 }} />
    </View>
  )
}

const cardStyles = StyleSheet.create({
  container: { padding: 16, backgroundColor: colors.surface, borderRadius: borderRadius.lg, marginBottom: 12 },
})
