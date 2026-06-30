import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import { useAuthStore } from '../../store/auth'
import { colors, borderRadius, typography, spacing } from '../../theme'

export default function RegisterScreen({ navigation }: any) {
  const { t } = useTranslation()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuthStore()

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert(t('common.error'), t('auth.requiredField'))
      return
    }
    if (password !== confirmPassword) {
      Alert.alert(t('common.error'), t('auth.passwordMismatch'))
      return
    }
    if (password.length < 6) {
      Alert.alert(t('common.error'), t('auth.passwordTooShort'))
      return
    }
    setLoading(true)
    try {
      await register(fullName, email, password, phoneNumber || undefined)
      Alert.alert(t('common.success'), t('auth.registerTitle') + '! ' + t('auth.loginLink'), [
        { text: t('common.ok'), onPress: () => navigation.navigate('Login') },
      ])
    } catch (err: any) {
      Alert.alert(t('auth.registerError'), err.response?.data?.data?.message || err.response?.data?.message || t('auth.registerError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <Text style={styles.title}>{t('auth.registerTitle')}</Text>
          <Text style={styles.subtitle}>{t('auth.registerSubtitle')}</Text>

          <View style={styles.form}>
            <Text style={styles.label}>{t('auth.fullName')} *</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder={t('auth.fullNamePlaceholder')}
              autoCapitalize="words"
            />

            <Text style={styles.label}>{t('common.email')} *</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder={t('auth.emailPlaceholder')}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.label}>{t('auth.phoneNumber')}</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder={t('auth.phonePlaceholder')}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>{t('common.password')} *</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder={t('auth.passwordPlaceholder')}
              secureTextEntry
            />

            <Text style={styles.label}>{t('auth.confirmPassword')} *</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder={t('auth.confirmPassword')}
              secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>{t('auth.signUpButton')}</Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.footer} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerText}>{t('auth.haveAccount')} {t('auth.loginLink')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.lg, paddingVertical: 40 },
  title: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.bold, color: colors.text.primary, textAlign: 'center' },
  subtitle: { fontSize: typography.sizes.sm, color: colors.text.secondary, textAlign: 'center', marginBottom: spacing.xl },
  form: { gap: 14 },
  label: { fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, color: colors.text.primary },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: typography.sizes.md,
  },
  button: {
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonText: { color: colors.text.inverse, fontSize: typography.sizes.md, fontWeight: typography.weights.semibold },
  footer: { alignItems: 'center', marginTop: spacing.lg },
  footerText: { color: colors.text.secondary, fontSize: typography.sizes.sm },
})
