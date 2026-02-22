import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, typography, spacing, borderRadius } from '@/src/theme/tokens';
import { useUserStore, MyRoutine } from '@/src/stores/userStore';
import Header from '@/src/components/common/Header';
import Badge from '@/src/components/common/Badge';
import { categories, routinePricing } from '@/src/theme/tokens';

function PurchaseCard({ routine }: { routine: MyRoutine }) {
  const categoryInfo = categories.find((c) => c.key === routine.category);
  const pricingInfo = routinePricing[routine.period];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && { opacity: 0.7 },
        Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined,
      ]}
    >
      <View style={styles.cardHeader}>
        <Badge
          label={routine.status === 'active' ? '진행 중' : '완료'}
          variant={routine.status === 'active' ? 'primary' : 'info'}
        />
        <Text style={styles.cardDate}>{routine.startedAt.split('T')[0]}</Text>
      </View>
      <Text style={styles.cardTitle}>{routine.title}</Text>
      <Text style={styles.cardProvider}>{routine.providerName}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.cardCategory}>
          {categoryInfo?.emoji} {categoryInfo?.label}
        </Text>
        <Text style={styles.cardPrice}>
          {pricingInfo.label} / {pricingInfo.price.toLocaleString()}원
        </Text>
      </View>
    </Pressable>
  );
}

export default function PurchaseHistoryScreen() {
  const router = useRouter();
  const { myRoutines } = useUserStore();

  return (
    <SafeAreaView style={styles.container}>
      <Header title="구매 내역" onBack={() => router.back()} />

      <FlatList
        data={myRoutines}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PurchaseCard routine={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>구매 내역이 없습니다</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  card: {
    backgroundColor: colors.bgPrimary,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  cardDate: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  cardProvider: {
    ...typography.body2,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cardCategory: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  cardPrice: {
    ...typography.body2,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxl * 2,
  },
  emptyText: {
    ...typography.body1,
    color: colors.textTertiary,
  },
});
