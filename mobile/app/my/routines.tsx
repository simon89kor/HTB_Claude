import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '@/src/theme/tokens';
import { useUserStore, MyRoutine } from '@/src/stores/userStore';
import { categoryAccentColors } from '@/src/stores/routineStore';
import Header from '@/src/components/common/Header';
import Chip from '@/src/components/common/Chip';

type TabKey = 'active' | 'completed';

function RoutineCard({ routine }: { routine: MyRoutine }) {
  const accentColor = categoryAccentColors[routine.category] ?? colors.primary;

  if (routine.status === 'completed') {
    return (
      <View style={styles.card}>
        <View style={[styles.categoryBar, { backgroundColor: accentColor }]} />
        <View style={styles.cardContent}>
          <View style={styles.completedRow}>
            <View style={styles.checkCircle}>
              <Check size={14} color={colors.bgPrimary} />
            </View>
            <Text style={styles.cardTitle}>{routine.title}</Text>
          </View>
          <Text style={styles.cardProvider}>{routine.providerName}</Text>
          <Text style={styles.cardDate}>
            {routine.startedAt.split('T')[0]} ~ {routine.endsAt.split('T')[0]}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={[styles.categoryBar, { backgroundColor: accentColor }]} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{routine.title}</Text>
        <Text style={styles.cardProvider}>{routine.providerName}</Text>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${routine.progress}%`,
                  backgroundColor: accentColor,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{routine.progress}%</Text>
        </View>

        {/* D-day */}
        <Text style={styles.ddayText}>D-{routine.dday}</Text>
      </View>
    </View>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

export default function RoutinesScreen() {
  const router = useRouter();
  const { myRoutines } = useUserStore();
  const [activeTab, setActiveTab] = useState<TabKey>('active');

  const filteredRoutines = myRoutines.filter((r) =>
    activeTab === 'active' ? r.status === 'active' : r.status === 'completed'
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="내 루틴" onBack={() => router.back()} />

      {/* Tabs */}
      <View style={styles.tabRow}>
        <Chip
          label="진행 중"
          selected={activeTab === 'active'}
          onPress={() => setActiveTab('active')}
        />
        <Chip
          label="완료"
          selected={activeTab === 'completed'}
          onPress={() => setActiveTab('completed')}
        />
      </View>

      {/* Routine List */}
      <FlatList
        data={filteredRoutines}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RoutineCard routine={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            message={
              activeTab === 'active'
                ? '진행 중인 루틴이 없습니다'
                : '완료된 루틴이 없습니다'
            }
          />
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
  tabRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.bgPrimary,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  categoryBar: {
    width: 4,
  },
  cardContent: {
    flex: 1,
    padding: spacing.md,
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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: colors.bgSecondary,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  progressText: {
    ...typography.body2,
    color: colors.textSecondary,
    minWidth: 36,
    textAlign: 'right',
  },
  ddayText: {
    ...typography.body2,
    color: colors.primary,
    marginTop: spacing.xs,
    fontWeight: '600',
  },
  completedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardDate: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxl * 2,
  },
  emptyText: {
    ...typography.body1,
    color: colors.textTertiary,
  },
});
