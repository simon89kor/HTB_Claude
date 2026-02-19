import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Star, Users } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, categories } from '@/src/theme/tokens';
import { Routine } from '@/src/types';

interface RoutineCardProps {
  routine: Routine;
  onPress: () => void;
}

export default function RoutineCard({ routine, onPress }: RoutineCardProps) {
  const providerName = routine.provider?.nickname ?? '전문가';
  const category = categories.find((c) => c.key === routine.category);
  const categoryEmoji = category?.emoji ?? '📋';
  const categoryLabel = category?.label ?? routine.category;
  const lowestPrice = Math.min(routine.price1week, routine.price4week, routine.price100days);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && { opacity: 0.7 },
        Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined,
      ]}
      onPress={onPress}
    >
      <View style={styles.imageBox}>
        <Text style={styles.emoji}>{categoryEmoji}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.provider} numberOfLines={1}>
          {providerName}
        </Text>
        <Text style={styles.title} numberOfLines={2}>
          {routine.title}
        </Text>
        <View style={styles.categoryRow}>
          <View style={styles.categoryChip}>
            <Text style={styles.categoryText}>{categoryLabel}</Text>
          </View>
        </View>
        <Text style={styles.price}>
          {lowestPrice.toLocaleString()}원~
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Users size={12} color={colors.textTertiary} />
            <Text style={styles.statText}>{routine.purchaseCount}</Text>
          </View>
          <View style={styles.stat}>
            <Star size={12} color={colors.textTertiary} />
            <Text style={styles.statText}>{routine.ratingAvg.toFixed(1)}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.bgPrimary,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  imageBox: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 32,
  },
  content: {
    flex: 1,
    marginLeft: spacing.sm,
    justifyContent: 'center',
  },
  provider: {
    fontSize: typography.body2.fontSize,
    fontWeight: typography.body2.fontWeight,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  title: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  categoryRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  categoryChip: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  categoryText: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    color: colors.primary,
  },
  price: {
    fontSize: typography.body2.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  statText: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    color: colors.textTertiary,
  },
});
