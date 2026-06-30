import React, { useState } from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import { useTranslation } from 'react-i18next'
import { colors, borderRadius, typography, spacing } from '../theme'
import { Button, Input, ScreenWrapper } from '../components/ui'
import api from '../services/api'

export default function ChangePasswordScreen({ navigation }: any) {
  const { t } = useTranslation()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert(t('common.error'), t('auth.requiredField'))
      return
    }
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
      await api.post('/auth/change-password', { currentPassword, newPassword })
      Alert.alert(t('common.success'), t('profile.passwordChanged'), [
        { text: t('common.ok'), onPress: () => navigation.goBack() },
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
        <Text style={styles.title}>{t('profile.changePassword')}</Text>

        <Input
          label={t('profile.currentPassword')}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder={t('profile.currentPassword')}
          secureTextEntry
        />
        <Input
          label={t('profile.newPassword')}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder={t('profile.newPassword')}
          secureTextEntry
        />
        <Input
          label={t('profile.confirmNewPassword')}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder={t('profile.confirmNewPassword')}
          secureTextEntry
        />

        <Button title={t('profile.changePassword')} onPress={handleChangePassword} loading={loading} />
        <Button title={t('common.back')} onPress={() => navigation.goBack()} variant="ghost" style={styles.backButton} />
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, justifyContent: 'center' },
  title: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.bold, color: colors.text.primary, textAlign: 'center', marginBottom: spacing.lg },
  backButton: { marginTop: spacing.md },
})
