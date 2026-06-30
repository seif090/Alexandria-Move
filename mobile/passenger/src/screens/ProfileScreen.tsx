import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import i18n, { changeLanguage } from '../i18n/i18n'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { useAuthStore } from '../store/auth'
import api from '../services/api'
import { Wallet, Rating } from '../types'
import { colors, borderRadius, typography, spacing, shadows } from '../theme'

export default function ProfileScreen({ navigation }: any) {
  const { t } = useTranslation()
  const { user, logout, updateProfile } = useAuthStore()
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '')
  const [saving, setSaving] = useState(false)
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [ratings, setRatings] = useState<Rating[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoadingData(true)
    try {
      const [walletRes, ratingsRes] = await Promise.all([
        api.get('/wallet'),
        api.get('/ratings/my'),
      ])
      setWallet(walletRes.data.data)
      const rData = ratingsRes.data.data?.items || ratingsRes.data.data || []
      setRatings(Array.isArray(rData) ? rData : [])
    } catch (err) {
      console.error('Profile load failed', err)
    } finally {
      setLoadingData(false)
    }
  }

  const handleSave = async () => {
    if (!fullName) {
      Alert.alert(t('common.error'), t('auth.requiredField'))
      return
    }
    setSaving(true)
    try {
      await updateProfile({ fullName, phoneNumber: phoneNumber || undefined })
      Alert.alert(t('common.success'), t('profile.profileUpdated'))
      setEditing(false)
    } catch (err: any) {
      Alert.alert(t('common.error'), err.response?.data?.data?.message || err.response?.data?.message || t('profile.editProfile'))
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    Alert.alert(t('common.logout'), t('profile.logoutConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.logout'), style: 'destructive', onPress: () => logout() },
    ])
  }

  const averageRating =
    ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length).toFixed(1)
      : 'N/A'

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.fullName?.charAt(0)?.toUpperCase() || 'U'}</Text>
        </View>
        <Text style={styles.name}>{user?.fullName}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.verifiedBadge}>
          <Text style={styles.verifiedText}>{user?.isVerified ? t('common.active') : t('common.inactive')}</Text>
        </View>
      </View>

      {editing ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.editProfile')}</Text>
          <Text style={styles.label}>{t('profile.fullName')}</Text>
          <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />
          <Text style={styles.label}>{t('profile.phone')}</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <View style={styles.editActions}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
              {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>{t('common.save')}</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setEditing(false)}>
              <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
          <Text style={styles.editButtonText}>{t('profile.editProfile')}</Text>
        </TouchableOpacity>
      )}

      <View style={styles.statsRow}>
        <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate('Wallet')}>
          <Text style={styles.statValue}>${wallet?.balance?.toFixed(2) || '0.00'}</Text>
          <Text style={styles.statLabel}>{t('wallet.title')}</Text>
        </TouchableOpacity>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{averageRating}</Text>
          <Text style={styles.statLabel}>{t('ratings.title')}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{ratings.length}</Text>
          <Text style={styles.statLabel}>{t('trip.passengers')}</Text>
        </View>
      </View>

      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Wallet')}>
          <Text style={styles.menuIcon}>💳</Text>
          <Text style={styles.menuText}>{t('wallet.title')}</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Bookings')}>
          <Text style={styles.menuIcon}>🎫</Text>
          <Text style={styles.menuText}>{t('bookings.title')}</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Notifications')}>
          <Text style={styles.menuIcon}>🔔</Text>
          <Text style={styles.menuText}>{t('common.notifications')}</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Support')}>
          <Text style={styles.menuIcon}>❓</Text>
          <Text style={styles.menuText}>{t('common.support')}</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('CommunityList')}>
          <Text style={styles.menuIcon}>👥</Text>
          <Text style={styles.menuText}>{t('navigation.communities')}</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ChangePassword')}>
          <Text style={styles.menuIcon}>🔑</Text>
          <Text style={styles.menuText}>{t('profile.changePassword')}</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.languageSection}>
        <Text style={styles.languageSectionTitle}>{t('profile.language')}</Text>
        <View style={styles.languageRow}>
          <TouchableOpacity
            style={[styles.languageOption, i18n.language?.startsWith('en') && styles.languageOptionActive]}
            onPress={() => changeLanguage('en')}
          >
            <Text style={[styles.languageOptionText, i18n.language?.startsWith('en') && styles.languageOptionTextActive]}>
              {t('profile.english')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.languageOption, i18n.language?.startsWith('ar') && styles.languageOptionActive]}
            onPress={() => changeLanguage('ar')}
          >
            <Text style={[styles.languageOptionText, i18n.language?.startsWith('ar') && styles.languageOptionTextActive]}>
              {t('profile.arabic')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>{t('common.logout')}</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: spacing.lg, paddingHorizontal: spacing.lg },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm + 4,
  },
  avatarText: { fontSize: 32, fontWeight: typography.weights.bold, color: colors.text.inverse },
  name: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.bold, color: colors.text.primary },
  email: { fontSize: typography.sizes.sm, color: colors.text.secondary, marginTop: spacing.xs },
  verifiedBadge: {
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs,
    marginTop: spacing.sm,
  },
  verifiedText: { fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold, color: colors.primary[500] },
  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  sectionTitle: { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text.primary, marginBottom: spacing.sm + 4 },
  label: { fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, color: colors.text.primary, marginBottom: spacing.xs, marginTop: spacing.sm },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    fontSize: typography.sizes.md,
  },
  editActions: { flexDirection: 'row', gap: spacing.sm + 4, marginTop: spacing.md },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm + 4,
    alignItems: 'center',
  },
  saveButtonText: { color: colors.text.inverse, fontSize: typography.sizes.md, fontWeight: typography.weights.semibold },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm + 4,
    alignItems: 'center',
  },
  cancelButtonText: { color: colors.text.primary, fontSize: typography.sizes.md, fontWeight: typography.weights.semibold },
  editButton: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm + 4,
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  editButtonText: { color: colors.primary[500], fontSize: typography.sizes.md, fontWeight: typography.weights.semibold },
  statsRow: { flexDirection: 'row', paddingHorizontal: spacing.lg, gap: spacing.sm + 4, marginBottom: spacing.lg },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  statValue: { fontSize: typography.sizes.xl, fontWeight: typography.weights.bold, color: colors.primary[500] },
  statLabel: { fontSize: typography.sizes.xs, color: colors.text.secondary, marginTop: spacing.xs },
  menuSection: { paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  menuIcon: { fontSize: 20, marginRight: spacing.sm + 4 },
  menuText: { flex: 1, fontSize: typography.sizes.md, color: colors.text.primary },
  menuArrow: { fontSize: 24, color: colors.text.muted },
  logoutButton: {
    marginHorizontal: spacing.lg,
    backgroundColor: '#fef2f2',
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutButtonText: { color: colors.error, fontSize: typography.sizes.md, fontWeight: typography.weights.semibold },
  languageSection: { paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  languageSectionTitle: { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text.primary, marginBottom: spacing.sm + 4 },
  languageRow: { flexDirection: 'row', gap: spacing.sm + 4 },
  languageOption: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm + 4,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    ...shadows.sm,
  },
  languageOptionActive: { borderColor: colors.primary[500], backgroundColor: colors.primary[50] },
  languageOptionText: { fontSize: typography.sizes.md, fontWeight: typography.weights.medium, color: colors.text.primary },
  languageOptionTextActive: { color: colors.primary[500], fontWeight: typography.weights.bold },
})
