import React from 'react'
import { useTranslation } from 'react-i18next'
import i18n, { changeLanguage } from '../i18n/i18n'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native'
import { useAuthStore } from '../store/auth'
import { colors, borderRadius, typography, spacing, shadows } from '../theme'

export default function ProfileScreen({ navigation }: any) {
  const { t } = useTranslation()
  const { user, driver, updateAvailability, logout } = useAuthStore()

  const handleLogout = () => {
    Alert.alert(t('profile.logout'), t('profile.logoutConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('profile.logout'), style: 'destructive', onPress: async () => { await logout() } },
    ])
  }

  const getInitials = (name: string) => {
    return name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || t('profile.title')
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(user?.fullName || '')}</Text>
        </View>
        <Text style={styles.name}>{user?.fullName || t('common.name')}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingIcon}>?</Text>
          <Text style={styles.ratingText}>{driver?.rating?.toFixed(1) || '0.0'}</Text>
        </View>
        <Text style={styles.email}>{user?.email}</Text>
        {user?.phoneNumber && <Text style={styles.phone}>{user?.phoneNumber}</Text>}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{driver?.totalTrips || 0}</Text>
          <Text style={styles.statLabel}>{t('dashboard.totalTrips')}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{driver?.safetyScore || 0}</Text>
          <Text style={styles.statLabel}>{t('profile.safetyScore')}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{driver?.cancellationRate || 0}%</Text>
          <Text style={styles.statLabel}>{t('common.cancelled')}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('profile.driverInfo')}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t('common.name')}</Text>
          <Text style={styles.infoValue}>{driver?.licenseNumber || t('common.noData')}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t('documents.expiryDate')}</Text>
          <Text style={styles.infoValue}>
            {driver?.licenseExpiryDate ? new Date(driver.licenseExpiryDate).toLocaleDateString() : t('common.noData')}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t('common.description')}</Text>
          <Text style={styles.infoValue}>{driver?.yearsOfExperience || 0} {t('common.time')}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t('common.status')}</Text>
          <View style={[styles.statusBadge, { backgroundColor: driver?.isVerified ? colors.tertiary[50] : '#fee2e2' }]}>
            <Text style={[styles.statusText, { color: driver?.isVerified ? colors.tertiary[500] : colors.error }]}>
              {driver?.isVerified ? t('common.active') : t('common.inactive')}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.availabilityRow}>
          <View>
            <Text style={styles.availabilityLabel}>{t('dashboard.status')}</Text>
            <Text style={styles.availabilityDesc}>{driver?.isAvailable ? t('dashboard.online') : t('dashboard.offline')}</Text>
          </View>
          <Switch
            value={driver?.isAvailable ?? false}
            onValueChange={(val) => updateAvailability(val)}
            trackColor={{ false: colors.border, true: colors.primary[100] }}
            thumbColor={driver?.isAvailable ? colors.primary[500] : colors.text.muted}
          />
        </View>
      </View>

      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Documents')}>
          <Text style={styles.menuIcon}>📄</Text>
          <Text style={styles.menuText}>{t('documents.title')}</Text>
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

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutBtnText}>{t('profile.logout')}</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  profileHeader: { alignItems: 'center', paddingTop: 60, paddingBottom: spacing.lg, backgroundColor: colors.primary[500] },
  avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm + 4 },
  avatarText: { fontSize: 32, fontWeight: typography.weights.bold, color: colors.text.inverse },
  name: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.bold, color: colors.text.inverse },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs, gap: spacing.xs },
  ratingIcon: { fontSize: typography.sizes.md },
  ratingText: { fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.secondary[100] },
  email: { fontSize: typography.sizes.sm, color: colors.primary[100], marginTop: spacing.xs },
  phone: { fontSize: typography.sizes.sm, color: colors.primary[100], marginTop: spacing.xs },
  statsRow: { flexDirection: 'row', backgroundColor: colors.surface, marginHorizontal: spacing.md, marginTop: -16, borderRadius: borderRadius.lg, padding: spacing.lg - 4, alignItems: 'center', ...shadows.md },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: typography.sizes.xl, fontWeight: typography.weights.bold, color: colors.primary[500] },
  statLabel: { fontSize: typography.sizes.xs, color: colors.text.secondary, marginTop: spacing.xs },
  statDivider: { width: 1, height: 40, backgroundColor: colors.border },
  section: { backgroundColor: colors.surface, marginHorizontal: spacing.md, marginTop: spacing.md, borderRadius: borderRadius.lg, padding: spacing.lg - 4, ...shadows.sm },
  sectionTitle: { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text.primary, marginBottom: spacing.md },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm + 4, borderBottomWidth: 1, borderBottomColor: colors.gray[100] },
  infoLabel: { fontSize: typography.sizes.sm, color: colors.text.secondary },
  infoValue: { fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, color: colors.text.primary },
  statusBadge: { paddingHorizontal: 10, paddingVertical: spacing.xs, borderRadius: borderRadius.md },
  statusText: { fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold },
  availabilityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  availabilityLabel: { fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.text.primary },
  availabilityDesc: { fontSize: 13, color: colors.text.secondary, marginTop: spacing.xs, maxWidth: 220 },
  menuSection: { backgroundColor: colors.surface, marginHorizontal: spacing.md, marginTop: spacing.md, borderRadius: borderRadius.lg, ...shadows.sm },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.lg - 4, borderBottomWidth: 1, borderBottomColor: colors.gray[100] },
  menuIcon: { fontSize: typography.sizes.xl, marginRight: spacing.sm + 4 },
  menuText: { fontSize: typography.sizes.md, color: colors.text.primary, flex: 1 },
  menuArrow: { fontSize: typography.sizes.xxl, color: colors.text.muted },
  logoutBtn: { marginHorizontal: spacing.md, marginTop: spacing.lg, paddingVertical: spacing.md, borderRadius: 14, borderWidth: 1, borderColor: colors.error + '66', alignItems: 'center' },
  logoutBtnText: { color: colors.error, fontSize: typography.sizes.md, fontWeight: typography.weights.semibold },
  languageSection: { paddingHorizontal: spacing.md, marginTop: spacing.md },
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
