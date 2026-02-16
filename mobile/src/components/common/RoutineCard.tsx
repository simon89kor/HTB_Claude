import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Star, Users } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '@/src/theme/tokens';
import { Routine } from '@/src/types';

interface RoutineCardProps {
  routine: Routine;
  onPress: () => void;
}

const categoryLabels: Record<string, string> = {
  exercise: '운동루틴',
  diet: '식단관리',
  selfdev: '자기계발',
  cert: '자격증',
  study: '학업',
};

export default function RoutineCard({ routine, onPress }: RoutineCardProps) {
  const providerName = routine.provider?.nickname ?? '전문가';
  const categoryLabel = categoryLabels[routine.category] ?? routine.category;
  const lowestPrice = Math.min(
    routine.price1week,
    routine.price4week,
    routine.price100days,
  );

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={
          routine.imageUrl
            ? { uri: routine.imageUrl }
            : undefined
        }
        style={styles.image}
      />
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
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.bgPrimary,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.bgSecondary,
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
