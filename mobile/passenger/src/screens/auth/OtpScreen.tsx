import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native'
import { useTranslation } from 'react-i18next'
import { colors, borderRadius, typography, spacing } from '../../theme'
import { Button, ScreenWrapper } from '../../components/ui'
import api from '../../services/api'

interface OtpScreenProps {
  navigation: any
  route: any
}

export default function OtpScreen({ navigation, route }: OtpScreenProps) {
  const { t } = useTranslation()
  const { email, isRegistration } = route.params || {}
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(30)
  const inputRefs = useRef<TextInput[]>([])

  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => setResendTimer((t) => t - 1), 1000)
      return () => clearInterval(interval)
    }
  }, [resendTimer])

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code]
    newCode[index] = text
    setCode(newCode)

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleVerify = async () => {
    const fullCode = code.join('')
    if (fullCode.length !== 6) return

    setLoading(true)
    try {
      if (isRegistration) {
        const res = await api.post('/auth/verify-registration', { email, code: fullCode })
        if (res.data.token) {
          Alert.alert(t('common.success'), t('auth.loginTitle'), [
            { text: t('common.ok'), onPress: () => navigation.navigate('Login') },
          ])
        }
      } else {
        await api.post('/auth/verify-reset-code', { email, code: fullCode })
        navigation.navigate('ForgotPassword', { email, code: fullCode })
      }
    } catch (err: any) {
      Alert.alert(t('common.error'), err.response?.data?.message || t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendTimer > 0) return
    setResendTimer(30)
    try {
      await api.post('/auth/resend-code', { email })
    } catch (err: any) {
      Alert.alert(t('common.error'), err.response?.data?.message || t('common.error'))
    }
  }

  return (
    <ScreenWrapper scroll>
      <View style={styles.container}>
        <Text style={styles.title}>{t('auth.otpTitle')}</Text>
        <Text style={styles.subtitle}>{t('auth.otpSubtitle')}</Text>
        <Text style={styles.email}>{email}</Text>

        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { if (ref) inputRefs.current[index] = ref }}
              style={[styles.codeInput, digit && styles.codeInputFilled]}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        <Button title={t('auth.otpButton')} onPress={handleVerify} loading={loading} disabled={code.join('').length !== 6} />

        <View style={styles.resendContainer}>
          {resendTimer > 0 ? (
            <Text style={styles.resendTimer}>{t('auth.otpResendTimer', { seconds: resendTimer })}</Text>
          ) : (
            <Button title={t('auth.otpResend')} onPress={handleResend} variant="ghost" />
          )}
        </View>
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.bold, color: colors.text.primary, textAlign: 'center' },
  subtitle: { fontSize: typography.sizes.md, color: colors.text.secondary, textAlign: 'center', marginTop: spacing.sm },
  email: { fontSize: typography.sizes.md, color: colors.primary[500], fontWeight: typography.weights.semibold, marginTop: spacing.xs, marginBottom: spacing.xl },
  codeContainer: { flexDirection: 'row', gap: 8, marginBottom: spacing.lg },
  codeInput: {
    width: 48,
    height: 56,
    borderWidth: 1.5,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[50],
    textAlign: 'center',
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  codeInputFilled: { borderColor: colors.primary[500], backgroundColor: colors.primary[50] },
  resendContainer: { marginTop: spacing.md, alignItems: 'center' },
  resendTimer: { fontSize: typography.sizes.sm, color: colors.text.muted },
})
