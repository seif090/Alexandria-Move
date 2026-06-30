import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import { colors, borderRadius, typography, spacing } from '../theme'
import { Card } from './ui'

interface TicketQrCodeProps {
  token: string
  bookingId: string
  groupName?: string
  seatCount?: number
  date?: string
}

export function TicketQrCode({ token, bookingId, groupName, seatCount, date }: TicketQrCodeProps) {
  return (
    <Card variant="elevated" style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{groupName || 'Booking Ticket'}</Text>
        {seatCount && <Text style={styles.seats}>{seatCount} seat{seatCount > 1 ? 's' : ''}</Text>}
      </View>

      <View style={styles.qrContainer}>
        <QRCode
          value={token || bookingId}
          size={180}
          backgroundColor="white"
          color={colors.black}
          logoBackgroundColor="transparent"
        />
      </View>

      {date && <Text style={styles.date}>{date}</Text>}
      <Text style={styles.bookingId}>ID: {bookingId.slice(0, 8).toUpperCase()}</Text>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: { alignItems: 'center', padding: spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: spacing.md },
  title: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text.primary, flex: 1 },
  seats: { fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, color: colors.primary[500], backgroundColor: colors.primary[50], paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.pill },
  qrContainer: { padding: spacing.md, backgroundColor: colors.white, borderRadius: borderRadius.md, marginBottom: spacing.md },
  date: { fontSize: typography.sizes.sm, color: colors.text.secondary, marginBottom: spacing.xs },
  bookingId: { fontSize: typography.sizes.xs, color: colors.text.muted },
})
