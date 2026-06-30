import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native'
import api from '../services/api'
import { Payment, Wallet } from '../types'
import { colors, borderRadius, typography, spacing, shadows } from '../theme'
import { Modal } from '../components/ui'

export default function WalletScreen() {
  const { t } = useTranslation()
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [transactions, setTransactions] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddFunds, setShowAddFunds] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')
  const [depositing, setDepositing] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [walletRes, txnRes] = await Promise.all([
        api.get('/wallet'),
        api.get('/wallet/transactions'),
      ])
      setWallet(walletRes.data.data)
      const tData = txnRes.data.data?.items || txnRes.data.data || []
      setTransactions(Array.isArray(tData) ? tData : [])
    } catch (err) {
      console.error('Wallet load failed', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddFunds = async () => {
    const amount = parseFloat(depositAmount)
    if (!depositAmount || isNaN(amount) || amount <= 0) {
      Alert.alert(t('common.error'), t('wallet.amount'))
      return
    }
    setDepositing(true)
    try {
      const res = await api.post('/wallet/deposit', { amount })
      setShowAddFunds(false)
      setDepositAmount('')
      Alert.alert(t('common.success'), t('wallet.paymentSuccess') + ` $${amount}. ${t('wallet.transactionId')}: ${res.data.data?.transactionId}`)
      loadData()
    } catch (err: any) {
      Alert.alert(t('common.error'), err.response?.data?.data?.message || err.response?.data?.message || t('wallet.paymentFailed'))
    } finally {
      setDepositing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'Succeeded':
        return colors.tertiary[500]
      case 'Pending':
        return colors.secondary[500]
      case 'Failed':
        return colors.error
      default:
        return colors.text.secondary
    }
  }

  const renderTransaction = ({ item }: { item: Payment }) => (
    <View style={styles.txnCard}>
      <View style={styles.txnHeader}>
        <Text style={styles.txnMethod}>{item.method}</Text>
        <View style={[styles.txnStatus, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.txnStatusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>
      <Text style={styles.txnAmount}>${item.amount?.toFixed(2)}</Text>
      <Text style={styles.txnId}>{t('wallet.transactionId')}: {item.transactionId}</Text>
      <Text style={styles.txnDate}>{new Date(item.paidAt).toLocaleString()}</Text>
    </View>
  )

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>{t('wallet.balance')}</Text>
        <Text style={styles.balanceAmount}>${wallet?.balance?.toFixed(2) || '0.00'}</Text>
        <Text style={styles.pointsLabel}>{wallet?.points || 0} {t('wallet.title')}</Text>

        {wallet?.subscriptionActive && (
          <View style={styles.subscriptionBadge}>
            <Text style={styles.subscriptionText}>
              {wallet.subscriptionPlan} -{' '}
              {wallet.subscriptionEndDate
                ? new Date(wallet.subscriptionEndDate).toLocaleDateString()
                : 'N/A'}
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.addFundsButton} onPress={handleAddFunds}>
          <Text style={styles.addFundsText}>{t('wallet.addFunds')}</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showAddFunds} onClose={() => { setShowAddFunds(false); setDepositAmount('') }} title={t('wallet.addFunds')}>
        <Text style={styles.modalLabel}>{t('wallet.enterAmount')}</Text>
        <TextInput
          style={styles.modalInput}
          value={depositAmount}
          onChangeText={setDepositAmount}
          keyboardType="numeric"
          placeholder="$0.00"
          autoFocus
        />
        <TouchableOpacity style={[styles.modalButton, depositing && styles.disabledButton]} onPress={handleAddFunds} disabled={depositing}>
          {depositing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.modalButtonText}>{t('wallet.addFunds')}</Text>
          )}
        </TouchableOpacity>
      </Modal>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('wallet.transactions')}</Text>
        {transactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t('wallet.noTransactions')}</Text>
          </View>
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            renderItem={renderTransaction}
            contentContainerStyle={styles.txnList}
          />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  balanceCard: {
    backgroundColor: colors.primary[500],
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
  },
  balanceLabel: { fontSize: typography.sizes.sm, color: colors.primary[100] },
  balanceAmount: { fontSize: 40, fontWeight: typography.weights.bold, color: colors.text.inverse, marginTop: spacing.sm },
  pointsLabel: { fontSize: typography.sizes.sm, color: colors.primary[100], marginTop: spacing.xs },
  subscriptionBadge: {
    backgroundColor: colors.primary[700],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
    marginTop: spacing.sm + 4,
  },
  subscriptionText: { fontSize: typography.sizes.xs, color: colors.primary[100] },
  addFundsButton: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm + 4,
    marginTop: spacing.lg - 4,
  },
  addFundsText: { color: colors.primary[500], fontSize: typography.sizes.md, fontWeight: typography.weights.semibold },
  section: { flex: 1, paddingHorizontal: spacing.md, paddingTop: spacing.lg },
  sectionTitle: { fontSize: typography.sizes.xl, fontWeight: typography.weights.bold, color: colors.text.primary, marginBottom: spacing.md },
  emptyContainer: { alignItems: 'center', paddingTop: 40 },
  emptyText: { fontSize: typography.sizes.md, color: colors.text.muted },
  txnList: { paddingBottom: spacing.xl },
  txnCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  txnHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  txnMethod: { fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, color: colors.text.primary },
  txnStatus: { borderRadius: spacing.sm, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  txnStatusText: { fontSize: 11, fontWeight: typography.weights.semibold },
  txnAmount: { fontSize: 22, fontWeight: typography.weights.bold, color: colors.text.primary, marginTop: spacing.sm },
  txnId: { fontSize: typography.sizes.xs, color: colors.text.muted, marginTop: spacing.xs },
  txnDate: { fontSize: typography.sizes.xs, color: colors.text.muted, marginTop: spacing.xs },
  modalLabel: { fontSize: typography.sizes.md, color: colors.text.primary, marginBottom: spacing.sm },
  modalInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: typography.sizes.lg,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  modalButton: {
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  disabledButton: { backgroundColor: colors.primary[200] },
  modalButtonText: { color: colors.text.inverse, fontSize: typography.sizes.md, fontWeight: typography.weights.semibold },
})
