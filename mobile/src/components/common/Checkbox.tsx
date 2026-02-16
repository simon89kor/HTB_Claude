import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '@/src/theme/tokens';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  label?: string;
}

export default function Checkbox({
  checked,
  onToggle,
  label,
}: CheckboxProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={[styles.box, checked ? styles.checked : styles.unchecked]}>
        {checked && <Check size={14} color={colors.textWhite} strokeWidth={3} />}
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
}

const BOX_SIZE = 22;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderRadius: borderRadius.sm / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: colors.primary,
  },
  unchecked: {
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: typography.body1.fontSize,
    fontWeight: typography.body1.fontWeight,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
    flexShrink: 1,
  },
});
