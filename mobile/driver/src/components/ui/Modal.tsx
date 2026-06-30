import React from 'react'
import { Modal as RNModal, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { colors, borderRadius, typography, spacing } from '../../theme'

interface ModalProps {
  visible: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Modal({ visible, onClose, title, children }: ModalProps) {
  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          {title && (
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeText}>X</Text>
              </TouchableOpacity>
            </View>
          )}
          {children}
        </View>
      </View>
    </RNModal>
  )
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  content: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.lg, width: '100%', maxWidth: 400 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  title: { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text.primary },
  closeButton: { padding: spacing.xs },
  closeText: { fontSize: typography.sizes.lg, color: colors.text.secondary },
})
