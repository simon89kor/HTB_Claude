import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, typography, spacing, borderRadius } from '@/src/theme/tokens';

type BadgeVariant = 'primary' | 'info' | 'warning' | 'error';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, { container: ViewStyle; text: TextStyle }> = {
  primary: {
    container: { backgroundColor: colors.primaryLight },
    text: { color: colors.primary },
  },
  info: {
    container: { backgroundColor: colors.bgSecondary },
    text: { color: colors.textSecondary },
  },
  warning: {
    container: { backgroundColor: 'rgba(255, 217, 61, 0.15)' },
    text: { color: '#CC9900' },
  },
  error: {
    container: { backgroundColor: 'rgba(255, 68, 68, 0.15)' },
    text: { color: colors.error },
  },
};

export default function Badge({
  label,
  variant = 'primary',
}: BadgeProps) {
  const style = variantStyles[variant];

  return (
    <View style={[styles.container, style.container]}>
      <Text style={[styles.text, style.text]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xs / 2,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: typography.body2.fontSize,
    fontWeight: typography.body2.fontWeight,
  },
});
