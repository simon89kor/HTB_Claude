import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Share2, ChevronDown, ChevronUp } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, categories } from '@/src/theme/tokens';
import { Header, Avatar, Badge, Button, Divider } from '@/src/components/common';
import { useRoutineStore, categoryColors } from '@/src/stores/routineStore';
import { usePurchaseStore } from '@/src/stores/purchaseStore';
import { formatCurrency, periodLabel, truncate } from '@/src/utils/format';
import { PeriodKey, RoutineItem } from '@/src/types';

const periodOptions: { key: PeriodKey; label: string; recommended?: boolean }[] = [
  { key: '1week', label: '1주 체험' },
  { key: '4week', label: '4주 코스', recommended: true },
  { key: '100days', label: '100일 완주' },
];

export default function RoutineDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getRoutineById, getRoutineItems } = useRoutineStore();
  const { setPeriod, setRoutine } = usePurchaseStore();

  const routine = getRoutineById(id ?? '');
  const routineItems = getRoutineItems(id ?? '');

  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>('4week');
  const [showAllDays, setShowAllDays] = useState(false);

  // Group items by day
  const groupedItems = useMemo(() => {
    const groups: Record<number, RoutineItem[]> = {};
    for (const item of routineItems) {
      if (!groups[item.dayNumber]) {
        groups[item.dayNumber] = [];
      }
      groups[item.dayNumber].push(item);
    }
    return groups;
  }, [routineItems]);

  const dayNumbers = useMemo(() => {
    return Object.keys(groupedItems)
      .map(Number)
      .sort((a, b) => a - b);
  }, [groupedItems]);

  const displayDays = showAllDays ? dayNumbers : dayNumbers.slice(0, 3);

  if (!routine) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="루틴 상세" onBack={() => router.back()} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>루틴을 찾을 수 없습니다</Text>
        </View>
      </SafeAreaView>
    );
  }

  const providerName = routine.provider?.nickname ?? '전문가';
  const categoryInfo = categories.find((c) => c.key === routine.category);
  const bgColor = categoryColors[routine.category] ?? '#F5F5F5';

  const priceMap: Record<PeriodKey, number> = {
    '1week': routine.price1week,
    '4week': routine.price4week,
    '100days': routine.price100days,
  };

  const currentPrice = priceMap[selectedPeriod];

  const handleShare = () => {
    Alert.alert('공유', '공유 기능은 준비 중입니다.');
  };

  const handlePurchase = () => {
    setRoutine(routine);
    setPeriod(selectedPeriod);
    router.push(`/purchase/${routine.id}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title={truncate(routine.title, 15)}
        onBack={() => router.back()}
        rightAction={
          <TouchableOpacity onPress={handleShare} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Share2 size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={[styles.heroImage, { backgroundColor: bgColor }]}>
          <Text style={styles.heroEmoji}>
            {categoryInfo?.emoji ?? '📋'}
          </Text>
          <View style={styles.heroCategoryBadge}>
            <Badge label={categoryInfo?.label ?? routine.category} />
          </View>
        </View>

        {/* Provider Info */}
        <View style={styles.providerRow}>
          <View style={styles.providerInfo}>
            <Avatar
              size="sm"
              fallback={providerName}
            />
            <Text style={styles.providerName}>{providerName}</Text>
          </View>
          <Button
            title="팔로우"
            variant="secondary"
            size="sm"
            onPress={() => Alert.alert('팔로우', '팔로우 기능은 준비 중입니다.')}
          />
        </View>

        <Divider spacing={spacing.md} />

        {/* Info Section */}
        <View style={styles.section}>
          <Text style={styles.routineTitle}>{routine.title}</Text>
          <View style={styles.statsRow}>
            <Text style={styles.statItem}>
              {'⭐'} {routine.ratingAvg.toFixed(1)}
            </Text>
            <Text style={styles.statDivider}>{'·'}</Text>
            <Text style={styles.statItem}>
              {'📦'} {routine.purchaseCount}회 구매
            </Text>
          </View>
          <Text style={styles.description}>{routine.description}</Text>
        </View>

        <Divider spacing={spacing.md} />

        {/* Price Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>구매 옵션</Text>
          <View style={styles.priceOptions}>
            {periodOptions.map((option) => {
              const isSelected = selectedPeriod === option.key;
              return (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.priceOption,
                    isSelected && styles.priceOptionSelected,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => setSelectedPeriod(option.key)}
                >
                  <View style={styles.priceOptionLeft}>
                    <View
                      style={[
                        styles.radioOuter,
                        isSelected && styles.radioOuterSelected,
                      ]}
                    >
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                    <Text
                      style={[
                        styles.priceOptionLabel,
                        isSelected && styles.priceOptionLabelSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {option.recommended && (
                      <View style={styles.recommendBadge}>
                        <Text style={styles.recommendText}>추천</Text>
                      </View>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.priceOptionPrice,
                      isSelected && styles.priceOptionPriceSelected,
                    ]}
                  >
                    {formatCurrency(priceMap[option.key])}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <Divider spacing={spacing.md} />

        {/* Day Preview Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>루틴 미리보기</Text>
          {displayDays.map((dayNum) => (
            <View key={dayNum} style={styles.dayBlock}>
              <View style={styles.dayHeader}>
                <View style={styles.dayBadge}>
                  <Text style={styles.dayBadgeText}>Day {dayNum}</Text>
                </View>
              </View>
              {groupedItems[dayNum].map((item) => (
                <View key={item.id} style={styles.dayItem}>
                  <View style={styles.bulletDot} />
                  <View style={styles.dayItemContent}>
                    <Text style={styles.dayItemTitle}>{item.title}</Text>
                    <Text style={styles.dayItemDesc}>{item.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
          {dayNumbers.length > 3 && (
            <TouchableOpacity
              style={styles.showMoreButton}
              onPress={() => setShowAllDays(!showAllDays)}
              activeOpacity={0.7}
            >
              <Text style={styles.showMoreText}>
                {showAllDays ? '접기' : '더보기'}
              </Text>
              {showAllDays ? (
                <ChevronUp size={16} color={colors.primary} />
              ) : (
                <ChevronDown size={16} color={colors.primary} />
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Bottom spacing for fixed bar */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom Fixed Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPriceSection}>
          <Text style={styles.bottomPriceLabel}>
            {periodLabel(selectedPeriod)}
          </Text>
          <Text style={styles.bottomPrice}>
            {formatCurrency(currentPrice)}
          </Text>
        </View>
        <Button
          title="구매하기"
          onPress={handlePurchase}
          size="lg"
          style={styles.purchaseButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.body1.fontSize,
    fontWeight: typography.body1.fontWeight,
    color: colors.textSecondary,
  },

  // Hero
  heroImage: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: {
    fontSize: 64,
  },
  heroCategoryBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
  },

  // Provider
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  providerName: {
    fontSize: typography.body1.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.textPrimary,
  },

  // Info
  section: {
    paddingHorizontal: spacing.md,
  },
  routineTitle: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statItem: {
    fontSize: typography.body2.fontSize,
    fontWeight: typography.body2.fontWeight,
    color: colors.textSecondary,
  },
  statDivider: {
    fontSize: typography.body2.fontSize,
    color: colors.textTertiary,
    marginHorizontal: spacing.sm,
  },
  description: {
    fontSize: typography.body1.fontSize,
    fontWeight: typography.body1.fontWeight,
    color: colors.textSecondary,
    lineHeight: 22,
  },

  // Price Options
  sectionTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  priceOptions: {
    gap: spacing.sm,
  },
  priceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
  },
  priceOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  priceOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  priceOptionLabel: {
    fontSize: typography.body1.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.textPrimary,
  },
  priceOptionLabelSelected: {
    color: colors.primaryDark,
  },
  recommendBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  recommendText: {
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
    color: colors.textWhite,
  },
  priceOptionPrice: {
    fontSize: typography.body1.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.textPrimary,
  },
  priceOptionPriceSelected: {
    color: colors.primaryDark,
  },

  // Day Preview
  dayBlock: {
    marginBottom: spacing.md,
  },
  dayHeader: {
    marginBottom: spacing.sm,
  },
  dayBadge: {
    backgroundColor: colors.bgSecondary,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  dayBadgeText: {
    fontSize: typography.body2.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.textPrimary,
  },
  dayItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: spacing.sm,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 6,
  },
  dayItemContent: {
    flex: 1,
  },
  dayItemTitle: {
    fontSize: typography.body1.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  dayItemDesc: {
    fontSize: typography.body2.fontSize,
    fontWeight: typography.body2.fontWeight,
    color: colors.textSecondary,
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  showMoreText: {
    fontSize: typography.body2.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.primary,
  },

  // Bottom spacing
  bottomSpacer: {
    height: 100,
  },

  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bgPrimary,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingBottom: spacing.lg,
  },
  bottomPriceSection: {
    flex: 1,
  },
  bottomPriceLabel: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  bottomPrice: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
    color: colors.textPrimary,
  },
  purchaseButton: {
    minWidth: 140,
  },
});
