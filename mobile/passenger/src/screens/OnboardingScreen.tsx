import React, { useRef, useState } from 'react'
import { View, Text, StyleSheet, Dimensions, FlatList, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { useTranslation } from 'react-i18next'
import { colors, borderRadius, typography, spacing } from '../theme'
import { Button } from '../components/ui'

const { width } = Dimensions.get('window')

interface OnboardingScreenProps {
  onComplete: () => void
  onSkip: () => void
}

interface Slide {
  id: string
  emoji: string
  title: string
  subtitle: string
}

export default function OnboardingScreen({ onComplete, onSkip }: OnboardingScreenProps) {
  const { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)

  const slides: Slide[] = [
    { id: '1', emoji: '🚌', title: t('auth.onboardingTitle1'), subtitle: t('auth.onboardingSubtitle1') },
    { id: '2', emoji: '📍', title: t('auth.onboardingTitle2'), subtitle: t('auth.onboardingSubtitle2') },
    { id: '3', emoji: '📅', title: t('auth.onboardingTitle3'), subtitle: t('auth.onboardingSubtitle3') },
  ]

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width)
    setCurrentIndex(index)
  }

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 })
    } else {
      onComplete()
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.skipContainer}>
        <Button title={t('auth.onboardingSkip')} onPress={onSkip} variant="ghost" />
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, index) => (
            <View key={index} style={[styles.dot, currentIndex === index && styles.activeDot]} />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          {currentIndex === slides.length - 1 ? (
            <Button title={t('auth.onboardingGetStarted')} onPress={onComplete} style={styles.button} />
          ) : (
            <Button title={t('common.next')} onPress={handleNext} style={styles.button} />
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  skipContainer: { alignItems: 'flex-end', paddingHorizontal: spacing.md, paddingTop: spacing.xl },
  slide: { width, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.xl },
  emoji: { fontSize: 80, marginBottom: spacing.lg },
  title: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.bold, color: colors.text.primary, textAlign: 'center', marginBottom: spacing.sm },
  subtitle: { fontSize: typography.sizes.md, color: colors.text.secondary, textAlign: 'center', lineHeight: 24 },
  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: spacing.lg },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.gray[300], marginHorizontal: 4 },
  activeDot: { width: 24, backgroundColor: colors.primary[500], borderRadius: 4 },
  buttonContainer: { alignItems: 'center' },
  button: { minWidth: 200 },
})
