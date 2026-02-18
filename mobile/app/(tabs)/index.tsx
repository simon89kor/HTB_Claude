import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, Bell } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, categories } from '@/src/theme/tokens';
import { Chip, RoutineCard } from '@/src/components/common';
import { useRoutineStore, categoryColors, categoryAccentColors } from '@/src/stores/routineStore';
import { formatCurrency } from '@/src/utils/format';
import { Routine } from '@/src/types';

const BANNER_WIDTH = 280;
const BANNER_HEIGHT = 140;
const TOP_CARD_WIDTH = 160;

// Banner data
const banners = [
  {
    id: 'banner-1',
    title: '이번 주 인기 루틴 \uD83D\uDD25',
    subtitle: '전문가가 추천하는 TOP 10',
    bgColor: colors.primary,
  },
  {
    id: 'banner-2',
    title: '새벽 기상 챌린지 \u23F0',
    subtitle: '21일 습관 만들기',
    bgColor: '#4A90D9',
  },
  {
    id: 'banner-3',
    title: '신규 루틴 할인 \uD83C\uDF89',
    subtitle: '첫 구매 30% 할인',
    bgColor: '#FF6B6B',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { selectedCategory, setCategory, featuredRoutines, getFilteredRoutines } = useRoutineStore();
  const filteredRoutines = getFilteredRoutines();
  const [activeBanner, setActiveBanner] = useState(0);

  const handleBannerScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const contentOffsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(contentOffsetX / (BANNER_WIDTH + spacing.sm));
      setActiveBanner(index);
    },
    []
  );

  const handleRoutinePress = useCallback(
    (routineId: string) => {
      router.push(`/routine/${routineId}`);
    },
    [router]
  );

  const getCategoryLabel = useCallback(() => {
    if (selectedCategory === 'all') return '전체 루틴';
    const cat = categories.find((c) => c.key === selectedCategory);
    return cat ? `${cat.label} 루틴` : '루틴';
  }, [selectedCategory]);

  const renderBanner = useCallback(
    ({ item }: { item: (typeof banners)[number] }) => (
      <TouchableOpacity
        style={[styles.bannerCard, { backgroundColor: item.bgColor }]}
        activeOpacity={0.9}
      >
        <Text style={styles.bannerTitle}>{item.title}</Text>
        <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
      </TouchableOpacity>
    ),
    []
  );

  const renderTopRoutine = useCallback(
    ({ item, index }: { item: Routine; index: number }) => {
      const bgColor = categoryColors[item.category] ?? '#F5F5F5';
      const accentColor = categoryAccentColors[item.category] ?? colors.textSecondary;
      const providerName = item.provider?.nickname ?? '전문가';

      return (
        <TouchableOpacity
          style={styles.topCard}
          activeOpacity={0.7}
          onPress={() => handleRoutinePress(item.id)}
        >
          <View style={[styles.topCardImage, { backgroundColor: bgColor }]}>
            <Text style={[styles.topCardEmoji, { color: accentColor }]}>
              {categories.find((c) => c.key === item.category)?.emoji ?? '📋'}
            </Text>
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>{index + 1}</Text>
            </View>
          </View>
          <View style={styles.topCardContent}>
            <Text style={styles.topCardProvider} numberOfLines={1}>
              {providerName}
            </Text>
            <Text style={styles.topCardTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.topCardPrice}>
              {formatCurrency(item.price1week)}/주
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [handleRoutinePress]
  );

  const renderRoutineItem = useCallback(
    ({ item }: { item: Routine }) => (
      <View style={styles.routineCardWrapper}>
        <RoutineCard
          routine={item}
          onPress={() => handleRoutinePress(item.id)}
        />
      </View>
    ),
    [handleRoutinePress]
  );

  const ListHeader = useCallback(() => (
    <View>
      {/* Search Bar */}
      <View style={styles.searchRow}>
        <TouchableOpacity style={styles.searchBar} activeOpacity={0.7}>
          <Search size={18} color={colors.textTertiary} />
          <Text style={styles.searchPlaceholder}>루틴을 검색해보세요</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bellButton} activeOpacity={0.7}>
          <Bell size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Featured Banners */}
      <View style={styles.bannerSection}>
        <FlatList
          data={banners}
          renderItem={renderBanner}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bannerList}
          snapToInterval={BANNER_WIDTH + spacing.sm}
          decelerationRate="fast"
          onScroll={handleBannerScroll}
          scrollEventThrottle={16}
        />
        {/* Page indicator dots */}
        <View style={styles.dotsRow}>
          {banners.map((b, i) => (
            <View
              key={b.id}
              style={[
                styles.dot,
                i === activeBanner ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
        style={styles.categorySection}
      >
        {categories.map((cat) => (
          <Chip
            key={cat.key}
            label={cat.label}
            emoji={cat.emoji}
            selected={selectedCategory === cat.key}
            onPress={() => setCategory(cat.key)}
          />
        ))}
      </ScrollView>

      {/* TOP 10 Section (only when 'all' selected) */}
      {selectedCategory === 'all' && (
        <View style={styles.topSection}>
          <Text style={styles.sectionTitle}>TOP 10 인기 루틴 \uD83C\uDFC6</Text>
          <FlatList
            data={featuredRoutines}
            renderItem={renderTopRoutine}
            keyExtractor={(item) => `top-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.topList}
          />
        </View>
      )}

      {/* Section Title for routine list */}
      <View style={styles.listHeaderRow}>
        <Text style={styles.sectionTitle}>{getCategoryLabel()}</Text>
        <Text style={styles.countText}>{filteredRoutines.length}개</Text>
      </View>
    </View>
  ), [
    selectedCategory,
    setCategory,
    activeBanner,
    handleBannerScroll,
    renderBanner,
    renderTopRoutine,
    featuredRoutines,
    getCategoryLabel,
    filteredRoutines.length,
  ]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={filteredRoutines}
        renderItem={renderRoutineItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={<View style={styles.bottomPadding} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  mainList: {
    paddingBottom: spacing.md,
  },

  // Search Bar
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgSecondary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    gap: spacing.sm,
  },
  searchPlaceholder: {
    fontSize: typography.body1.fontSize,
    fontWeight: typography.body1.fontWeight,
    color: colors.textTertiary,
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Banners
  bannerSection: {
    marginTop: spacing.sm,
  },
  bannerList: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  bannerCard: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    color: colors.textWhite,
    marginBottom: spacing.xs,
  },
  bannerSubtitle: {
    fontSize: typography.body2.fontSize,
    fontWeight: typography.body2.fontWeight,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 18,
    borderRadius: 3,
  },
  dotInactive: {
    backgroundColor: colors.border,
  },

  // Categories
  categorySection: {
    marginTop: spacing.md,
  },
  categoryList: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },

  // TOP 10
  topSection: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  topList: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  topCard: {
    width: TOP_CARD_WIDTH,
    backgroundColor: colors.bgPrimary,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  topCardImage: {
    width: '100%',
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topCardEmoji: {
    fontSize: 36,
  },
  rankBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
    color: colors.textWhite,
  },
  topCardContent: {
    padding: spacing.sm,
  },
  topCardProvider: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  topCardTitle: {
    fontSize: typography.body2.fontSize,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    lineHeight: 18,
  },
  topCardPrice: {
    fontSize: typography.body2.fontSize,
    fontWeight: typography.body2.fontWeight,
    color: colors.primary,
  },

  // Routine List
  listHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  countText: {
    fontSize: typography.body2.fontSize,
    fontWeight: typography.body2.fontWeight,
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
  },
  routineCardWrapper: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  bottomPadding: {
    height: 80,
  },
});
