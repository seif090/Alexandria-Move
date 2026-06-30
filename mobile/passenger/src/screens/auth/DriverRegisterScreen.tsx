import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native'
import { useTranslation } from 'react-i18next'
import { colors, borderRadius, typography, spacing } from '../../theme'
import { Button, Input, ScreenWrapper } from '../../components/ui'
import api from '../../services/api'

interface DriverRegisterScreenProps {
  navigation: any
}

export default function DriverRegisterScreen({ navigation }: DriverRegisterScreenProps) {
  const { t } = useTranslation()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    licenseNumber: '',
    yearsOfExperience: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleYear: '',
    vehiclePlate: '',
    vehicleColor: '',
    vehicleCapacity: '',
  })

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleRegister = async () => {
    setLoading(true)
    try {
      const res = await api.post('/auth/driver-register', {
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phone,
        password: form.password,
        licenseNumber: form.licenseNumber,
        yearsOfExperience: parseInt(form.yearsOfExperience) || 0,
        vehicle: {
          brand: form.vehicleBrand,
          model: form.vehicleModel,
          year: parseInt(form.vehicleYear) || new Date().getFullYear(),
          plateNumber: form.vehiclePlate,
          color: form.vehicleColor,
          capacity: parseInt(form.vehicleCapacity) || 4,
        },
      })
      if (res.data.succeeded) {
        Alert.alert(t('common.success'), t('auth.driverRegisterButton'), [
          { text: t('common.ok'), onPress: () => navigation.navigate('Login') },
        ])
      }
    } catch (err: any) {
      Alert.alert(t('common.error'), err.response?.data?.message || t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScreenWrapper scroll>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{t('auth.driverRegisterTitle')}</Text>
        <Text style={styles.subtitle}>{t('auth.driverRegisterSubtitle')}</Text>

        {step === 1 && (
          <>
            <Input label={t('auth.fullName')} value={form.fullName} onChangeText={(v) => updateField('fullName', v)} placeholder={t('auth.fullNamePlaceholder')} />
            <Input label={t('auth.emailLabel')} value={form.email} onChangeText={(v) => updateField('email', v)} placeholder={t('auth.emailPlaceholder')} keyboardType="email-address" autoCapitalize="none" />
            <Input label={t('auth.phoneNumber')} value={form.phone} onChangeText={(v) => updateField('phone', v)} placeholder={t('auth.phonePlaceholder')} keyboardType="phone-pad" />
            <Input label={t('auth.passwordLabel')} value={form.password} onChangeText={(v) => updateField('password', v)} placeholder={t('auth.passwordPlaceholder')} secureTextEntry />
            <Input label={t('auth.licenseNumber')} value={form.licenseNumber} onChangeText={(v) => updateField('licenseNumber', v)} placeholder={t('auth.licenseNumberPlaceholder')} />
            <Input label={t('auth.yearsExperience')} value={form.yearsOfExperience} onChangeText={(v) => updateField('yearsOfExperience', v)} placeholder="0" keyboardType="numeric" />
            <Button title={t('common.next')} onPress={() => setStep(2)} disabled={!form.fullName || !form.email || !form.password} />
          </>
        )}

        {step === 2 && (
          <>
            <Input label={t('auth.vehicleBrand')} value={form.vehicleBrand} onChangeText={(v) => updateField('vehicleBrand', v)} placeholder="Toyota" />
            <Input label={t('auth.vehicleModel')} value={form.vehicleModel} onChangeText={(v) => updateField('vehicleModel', v)} placeholder="Corolla" />
            <Input label={t('auth.vehicleYear')} value={form.vehicleYear} onChangeText={(v) => updateField('vehicleYear', v)} placeholder="2024" keyboardType="numeric" />
            <Input label={t('auth.vehiclePlate')} value={form.vehiclePlate} onChangeText={(v) => updateField('vehiclePlate', v)} placeholder="ABC 123" />
            <Input label={t('auth.vehicleColor')} value={form.vehicleColor} onChangeText={(v) => updateField('vehicleColor', v)} placeholder="White" />
            <Input label={t('auth.vehicleCapacity')} value={form.vehicleCapacity} onChangeText={(v) => updateField('vehicleCapacity', v)} placeholder="4" keyboardType="numeric" />
            <Button title={t('auth.driverRegisterButton')} onPress={handleRegister} loading={loading} />
            <Button title={t('common.back')} onPress={() => setStep(1)} variant="ghost" />
          </>
        )}
      </ScrollView>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg },
  title: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.bold, color: colors.text.primary, textAlign: 'center', marginBottom: spacing.xs },
  subtitle: { fontSize: typography.sizes.md, color: colors.text.secondary, textAlign: 'center', marginBottom: spacing.lg },
})
