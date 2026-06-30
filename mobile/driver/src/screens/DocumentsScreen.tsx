import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import api from '../services/api'
import { DriverDocument } from '../types'
import { colors, borderRadius, typography, spacing, shadows } from '../theme'

export default function DocumentsScreen() {
  const { t } = useTranslation()
  const [documents, setDocuments] = useState<DriverDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState<string | null>(null)

  useEffect(() => { loadDocuments() }, [])

  const loadDocuments = async () => {
    setLoading(true)
    try {
      const res = await api.get('/drivers/documents')
      setDocuments(res.data.data || [])
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  const pickDocument = async (documentType: string) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert(t('documents.title'), t('documents.error'))
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: false,
    })
    if (!result.canceled && result.assets[0]) {
      uploadDocument(result.assets[0].uri, documentType)
    }
  }

  const uploadDocument = async (uri: string, documentType: string) => {
    setUploading(documentType)
    try {
      const formData = new FormData()
      formData.append('file', {
        uri,
        type: 'image/jpeg',
        name: `${documentType}.jpg`,
      } as any)
      formData.append('documentType', documentType)
      await api.post('/drivers/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      await loadDocuments()
    } catch (err: any) {
      Alert.alert(t('common.error'), err.response?.data?.data?.message || err.response?.data?.message || t('documents.error'))
    } finally { setUploading(null) }
  }

  const getDocumentIcon = (type: string) => {
    const icons: Record<string, string> = {
      license: '??',
      insurance: '??',
      registration: '??',
      medical: '??',
      background_check: '??',
      other: '??',
    }
    return icons[type] || '??'
  }

  const getDocumentLabel = (type: string) => {
    const labels: Record<string, string> = {
      license: t('documents.drivingLicense'),
      insurance: t('documents.insurance'),
      registration: t('documents.vehicleRegistration'),
      medical: t('documents.other'),
      background_check: t('documents.backgroundCheck'),
      other: t('documents.other'),
    }
    return labels[type] || type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  }

  const renderDocument = ({ item }: { item: DriverDocument }) => (
    <View style={styles.docCard}>
      <View style={styles.docIconContainer}>
        <Text style={styles.docIcon}>{getDocumentIcon(item.documentType)}</Text>
      </View>
      <View style={styles.docInfo}>
        <Text style={styles.docType}>{getDocumentLabel(item.documentType)}</Text>
        <Text style={styles.docDate}>{t('documents.uploadDate')}: {new Date(item.uploadedAt).toLocaleDateString()}</Text>
        {item.expiryDate && (
          <Text style={styles.docExpiry}>{t('documents.expiryDate')}: {new Date(item.expiryDate).toLocaleDateString()}</Text>
        )}
      </View>
      <View style={[styles.verificationBadge, { backgroundColor: item.isVerified ? colors.tertiary[50] : '#fee2e2' }]}>
        <Text style={[styles.verificationText, { color: item.isVerified ? colors.tertiary[500] : colors.error }]}>
          {item.isVerified ? t('documents.approved') : t('documents.underReview')}
        </Text>
      </View>
    </View>
  )

  const documentTypes = ['license', 'insurance', 'registration', 'medical', 'background_check']

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('documents.title')}</Text>
        <Text style={styles.headerSub}>
          {documents.filter((d) => d.isVerified).length}/{documents.length} {t('common.status')}
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      ) : (
        <FlatList
          data={documents}
          keyExtractor={(item) => item.id}
          renderItem={renderDocument}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>??</Text>
              <Text style={styles.emptyText}>{t('documents.noDocuments')}</Text>
              <Text style={styles.emptySubtext}>{t('documents.uploadDocument')}</Text>
            </View>
          }
        />
      )}

      <View style={styles.uploadSection}>
        <Text style={styles.uploadTitle}>{t('documents.uploadDocument')}</Text>
        <View style={styles.uploadGrid}>
          {documentTypes.map((type) => {
            const existing = documents.find((d) => d.documentType === type)
            return (
              <TouchableOpacity
                key={type}
                style={[styles.uploadBtn, existing && styles.uploadBtnDone]}
                onPress={() => pickDocument(type)}
                disabled={uploading === type}
              >
                {uploading === type ? (
                  <ActivityIndicator color={colors.primary[500]} size="small" />
                ) : (
                  <>
                    <Text style={styles.uploadBtnIcon}>{getDocumentIcon(type)}</Text>
                    <Text style={[styles.uploadBtnText, existing && styles.uploadBtnTextDone]}>
                      {existing ? '?' : '+'} {getDocumentLabel(type)}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.md },
  headerTitle: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.bold, color: colors.text.primary },
  headerSub: { fontSize: typography.sizes.sm, color: colors.text.secondary, marginTop: spacing.xs },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  docCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm + 4, ...shadows.sm },
  docIconContainer: { width: 48, height: 48, borderRadius: borderRadius.md, backgroundColor: colors.tertiary[50], justifyContent: 'center', alignItems: 'center', marginRight: spacing.sm + 4 },
  docIcon: { fontSize: 24 },
  docInfo: { flex: 1 },
  docType: { fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.text.primary },
  docDate: { fontSize: typography.sizes.xs, color: colors.text.secondary, marginTop: spacing.xs },
  docExpiry: { fontSize: typography.sizes.xs, color: colors.secondary[500], marginTop: spacing.xs },
  verificationBadge: { paddingHorizontal: 10, paddingVertical: spacing.xs, borderRadius: borderRadius.md, marginLeft: spacing.sm },
  verificationText: { fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyText: { fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.text.primary },
  emptySubtext: { fontSize: typography.sizes.sm, color: colors.text.muted, marginTop: spacing.xs },
  uploadSection: { backgroundColor: colors.surface, padding: spacing.lg, borderTopLeftRadius: 24, borderTopRightRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  uploadTitle: { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text.primary, marginBottom: spacing.md },
  uploadGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm + 4 },
  uploadBtn: { width: '30%', paddingVertical: spacing.md, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed', alignItems: 'center', backgroundColor: colors.background },
  uploadBtnDone: { borderColor: colors.tertiary[500], backgroundColor: colors.tertiary[50], borderStyle: 'solid' },
  uploadBtnIcon: { fontSize: 24, marginBottom: spacing.xs },
  uploadBtnText: { fontSize: 11, color: colors.text.secondary, textAlign: 'center', marginTop: spacing.xs },
  uploadBtnTextDone: { color: colors.tertiary[500] },
})
