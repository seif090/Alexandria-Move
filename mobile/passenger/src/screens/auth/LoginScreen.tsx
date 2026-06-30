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
} from 'react-native'
import { useAuthStore } from '../../store/auth'
import { colors, borderRadius, typography, spacing, shadows } from '../../theme'

export default function LoginScreen({ navigation }: any) {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, googleLogin } = useAuthStore()

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('common.error'), t('auth.requiredField'))
      return
    }
    setLoading(true)
    try {
      await login(email, password)
    } catch (err: any) {
      Alert.alert(t('auth.loginError'), err.response?.data?.data?.message || err.response?.data?.message || t('auth.loginError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('auth.loginTitle')}</Text>
        <Text style={styles.subtitle}>{t('auth.loginSubtitle')}</Text>

        <View style={styles.form}>
          <Text style={styles.label}>{t('common.email')}</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder={t('auth.emailPlaceholder')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>{t('common.password')}</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder={t('auth.passwordPlaceholder')}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{t('auth.signInButton')}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.linkText}>{t('auth.forgotPassword')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={async () => {
            setLoading(true)
            try {
              await googleLogin()
            } catch (err: any) {
              Alert.alert('Google Sign-In Failed', err.message)
            } finally {
              setLoading(false)
            }
          }}
          disabled={loading}
        >
          <View style={styles.googleIconContainer}>
            <Text style={styles.googleIcon}>G</Text>
          </View>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footer} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.footerText}>{t('auth.noAccount')} {t('auth.registerLink')}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.lg },
  title: { fontSize: typography.sizes.display, fontWeight: typography.weights.bold, color: colors.primary[500], textAlign: 'center' },
  subtitle: { fontSize: typography.sizes.md, color: colors.text.secondary, textAlign: 'center', marginBottom: spacing.xxl },
  form: { gap: spacing.md },
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
  linkButton: { alignItems: 'center', marginTop: spacing.md },
  linkText: { color: colors.primary[500], fontSize: typography.sizes.sm },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.lg },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { marginHorizontal: spacing.md, color: colors.text.muted, fontSize: typography.sizes.sm },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm + 6,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm + 4,
  },
  googleIcon: { color: '#fff', fontSize: 14, fontWeight: '700' },
  googleButtonText: { fontSize: typography.sizes.md, fontWeight: typography.weights.medium, color: colors.text.primary },
  footer: { alignItems: 'center', marginTop: spacing.xl },
  footerText: { color: colors.text.secondary, fontSize: typography.sizes.sm },
})
