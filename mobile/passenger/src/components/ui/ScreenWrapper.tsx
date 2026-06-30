import React from 'react'
import { SafeAreaView, ScrollView, StyleSheet, ViewStyle, StatusBar, View } from 'react-native'
import { colors } from '../../theme'

interface ScreenWrapperProps {
  children: React.ReactNode
  scroll?: boolean
  style?: ViewStyle
  safeArea?: boolean
}

export function ScreenWrapper({ children, scroll, style, safeArea = true }: ScreenWrapperProps) {
  const Container = safeArea ? SafeAreaView : View

  if (scroll) {
    return (
      <Container style={[styles.container, style]}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      </Container>
    )
  }

  return (
    <Container style={[styles.container, style]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      {children}
    </Container>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1 },
})
