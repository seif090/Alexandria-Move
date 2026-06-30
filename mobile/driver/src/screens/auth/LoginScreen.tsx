import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native'
import { useAuthStore } from '../../store/auth'
import { colors, borderRadius, typography, spacing, shadows } from '../../theme'

export default function LoginScreen({ navigation }: any) {
  const { t } = useTranslation()
  const { login, googleLogin } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(t('common.error'), t('auth.loginError'))
      return
    }
    setLoading(true)
    try {
      await login(email.trim(), password)
    } catch (err: any) {
      Alert.alert(t('common.error'), err.response?.data?.data?.message || err.response?.data?.message || err.message || t('auth.loginError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.topSection}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoIcon}>🚐</Text>
        </View>
        <Text style={styles.appName}>Alexandria</Text>
        <Text style={styles.subtitle}>{t('auth.loginTitle')}</Text>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.welcomeText}>{t('auth.login')}</Text>
        <Text style={styles.instructionText}>{t('auth.loginSubtitle')}</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{t('auth.emailLabel')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('auth.emailPlaceholder')}
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{t('auth.passwordLabel')}</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder={t('auth.passwordPlaceholder')}
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
              <Text>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.forgotBtn} onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotText}>{t('auth.forgotPassword')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.loginBtn, loading && styles.loginBtnDisabled]} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginBtnText}>{t('auth.signInButton')}</Text>
          )}
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={async () => {
            try {
              setLoading(true)
              await googleLogin()
            } catch (err: any) {
              Alert.alert('Google Sign-In Failed', err.message || 'Unable to sign in with Google')
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
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary[500] },
  topSection: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  logoContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md },
  logoIcon: { fontSize: 48 },
  appName: { fontSize: 36, fontWeight: typography.weights.bold, color: colors.text.inverse },
  subtitle: { fontSize: typography.sizes.lg, color: colors.primary[200], marginTop: spacing.xs },
  formSection: { backgroundColor: colors.surface, borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  welcomeText: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.bold, color: colors.text.primary },
  instructionText: { fontSize: typography.sizes.sm, color: colors.text.secondary, marginTop: spacing.xs, marginBottom: spacing.lg },
  inputGroup: { marginBottom: spacing.md },
  inputLabel: { fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, color: colors.text.primary, marginBottom: spacing.xs + 2 },
  input: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, paddingVertical: 14, fontSize: typography.sizes.md, color: colors.text.primary },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md },
  passwordInput: { flex: 1, paddingHorizontal: spacing.md, paddingVertical: 14, fontSize: typography.sizes.md, color: colors.text.primary },
  eyeBtn: { paddingHorizontal: spacing.md, paddingVertical: 14 },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: spacing.lg },
  forgotText: { fontSize: typography.sizes.sm, color: colors.primary[500], fontWeight: typography.weights.medium },
  loginBtn: { backgroundColor: colors.primary[500], borderRadius: borderRadius.md, paddingVertical: spacing.md, alignItems: 'center', shadowColor: colors.primary[500], shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  loginBtnDisabled: { opacity: 0.7 },
  loginBtnText: { color: colors.text.inverse, fontSize: typography.sizes.lg, fontWeight: typography.weights.bold },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { marginHorizontal: spacing.md, fontSize: typography.sizes.sm, color: colors.text.secondary },
  googleButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md, paddingVertical: spacing.md, gap: spacing.sm },
  googleIconContainer: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary[500], justifyContent: 'center', alignItems: 'center' },
  googleIcon: { color: colors.text.inverse, fontSize: typography.sizes.sm, fontWeight: typography.weights.bold },
  googleButtonText: { fontSize: typography.sizes.md, fontWeight: typography.weights.medium, color: colors.text.primary },
})
