import React from 'react';
import { Pressable, Text, StyleSheet, Platform } from 'react-native';
import { colors, typography, spacing, borderRadius } from '@/src/theme/tokens';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  emoji?: string;
}

export default function Chip({
  label,
  selected = false,
  onPress,
  emoji,
}: ChipProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        selected ? styles.selected : styles.unselected,
        pressed && { opacity: 0.7 },
        Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined,
      ]}
      onPress={onPress}
    >
      {emoji && <Text style={styles.emoji}>{emoji}</Text>}
      <Text
        style={[
          styles.label,
          selected ? styles.selectedLabel : styles.unselectedLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  selected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  unselected: {
    backgroundColor: colors.bgSecondary,
    borderColor: 'transparent',
  },
  emoji: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  label: {
    fontSize: typography.body2.fontSize,
    fontWeight: typography.body2.fontWeight,
  },
  selectedLabel: {
    color: colors.primary,
  },
  unselectedLabel: {
    color: colors.textSecondary,
  },
});
