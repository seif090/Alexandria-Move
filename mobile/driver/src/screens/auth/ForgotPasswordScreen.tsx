import React, { useState } from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import { useTranslation } from 'react-i18next'
import { colors, borderRadius, typography, spacing } from '../../theme'
import { Button, Input, ScreenWrapper } from '../../components/ui'
import api from '../../services/api'

interface ForgotPasswordScreenProps {
  navigation: any
}

export default function ForgotPasswordScreen({ navigation }: ForgotPasswordScreenProps) {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [step, setStep] = useState<'email' | 'code' | 'reset'>('email')

  const handleSendCode = async () => {
    if (!email) return
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      Alert.alert(t('common.success'), t('auth.resetCodeSent'))
      setStep('code')
    } catch (err: any) {
      Alert.alert(t('common.error'), err.response?.data?.message || t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!code) return
    setLoading(true)
    try {
      await api.post('/auth/verify-reset-code', { email, code })
      setStep('reset')
    } catch (err: any) {
      Alert.alert(t('common.error'), err.response?.data?.message || t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert(t('common.error'), t('auth.passwordMismatch'))
      return
    }
    if (newPassword.length < 6) {
      Alert.alert(t('common.error'), t('auth.passwordTooShort'))
      return
    }
    setLoading(true)
    try {
      await api.post('/auth/reset-password', { email, token: code, newPassword })
      Alert.alert(t('common.success'), t('auth.passwordResetSuccess'), [
        { text: t('common.ok'), onPress: () => navigation.navigate('Login') },
      ])
    } catch (err: any) {
      Alert.alert(t('common.error'), err.response?.data?.message || t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScreenWrapper scroll safeArea={false}>
      <View style={styles.container}>
        <Text style={styles.title}>
          {step === 'email' ? t('auth.forgotPasswordTitle') : step === 'code' ? t('auth.otpTitle') : t('auth.forgotPasswordTitle')}
        </Text>
        <Text style={styles.subtitle}>
          {step === 'email' ? t('auth.forgotPasswordSubtitle') : step === 'code' ? t('auth.otpSubtitle') : ''}
        </Text>

        {step === 'email' && (
          <>
            <Input
              label={t('auth.emailLabel')}
              value={email}
              onChangeText={setEmail}
              placeholder={t('auth.emailPlaceholder')}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Button title={t('auth.forgotPasswordButton')} onPress={handleSendCode} loading={loading} disabled={!email} />
          </>
        )}

        {step === 'code' && (
          <>
            <Input
              label={t('auth.otpPlaceholder')}
              value={code}
              onChangeText={setCode}
              placeholder={t('auth.otpPlaceholder')}
              keyboardType="number-pad"
            />
            <Button title={t('auth.otpButton')} onPress={handleVerifyCode} loading={loading} disabled={!code} />
          </>
        )}

        {step === 'reset' && (
          <>
            <Input
              label={t('auth.newPassword')}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder={t('auth.newPasswordPlaceholder')}
              secureTextEntry
            />
            <Input
              label={t('auth.confirmPassword')}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder={t('auth.confirmPassword')}
              secureTextEntry
            />
            <Button title={t('auth.resetPasswordButton')} onPress={handleResetPassword} loading={loading} />
          </>
        )}

        <Button title={t('common.back')} onPress={() => navigation.goBack()} variant="ghost" style={styles.backButton} />
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, justifyContent: 'center' },
  title: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.bold, color: colors.text.primary, textAlign: 'center', marginBottom: spacing.sm },
  subtitle: { fontSize: typography.sizes.md, color: colors.text.secondary, textAlign: 'center', marginBottom: spacing.lg },
  backButton: { marginTop: spacing.md },
})
