import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import { useTranslation } from 'react-i18next'
import { colors, typography } from '../theme'

interface SplashScreenProps {
  onFinish: () => void
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const { t } = useTranslation()
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.8)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 8, useNativeDriver: true }),
    ]).start()

    const timer = setTimeout(onFinish, 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>AM</Text>
        </View>
        <Text style={styles.title}>{t('auth.splashTitle')}</Text>
        <Text style={styles.subtitle}>{t('auth.splashSubtitle')}</Text>
      </Animated.View>
      <Animated.Text style={[styles.tagline, { opacity: fadeAnim }]}>
        {t('auth.splashTagline')}
      </Animated.Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary[500], justifyContent: 'center', alignItems: 'center' },
  logoContainer: { alignItems: 'center' },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoText: { fontSize: 36, fontWeight: typography.weights.extrabold, color: colors.primary[500] },
  title: { fontSize: typography.sizes.xxxl, fontWeight: typography.weights.bold, color: colors.white },
  subtitle: { fontSize: typography.sizes.lg, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  tagline: { fontSize: typography.sizes.sm, color: 'rgba(255,255,255,0.6)', position: 'absolute', bottom: 48 },
})
