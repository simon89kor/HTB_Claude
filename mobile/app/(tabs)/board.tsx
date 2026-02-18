import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus, ChevronDown, ChevronUp, Calendar } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, categories } from '@/src/theme/tokens';
import { Checkbox, EmptyState } from '@/src/components/common';
import { useUserStore, MyRoutine } from '@/src/stores/userStore';
import { CategoryKey } from '@/src/types';

// ─── Types ──────────────────────────────────────────────

interface TodoItem {
  id: string;
  routineId: string;
  title: string;
  completed: boolean;
}

interface DayInfo {
  dayLabel: string;
  dateNum: number;
  date: Date;
  isToday: boolean;
}

// ─── Mock Todo Data ─────────────────────────────────────

const MOCK_TODOS: Record<string, TodoItem[]> = {
  'routine-1': [
    { id: 't1-1', routineId: 'routine-1', title: '06:30 기상 후 커튼 열기', completed: false },
    { id: 't1-2', routineId: 'routine-1', title: '5분 스트레칭', completed: true },
    { id: 't1-3', routineId: 'routine-1', title: '감사일기 3줄 작성', completed: false },
  ],
  'routine-2': [
    { id: 't2-1', routineId: 'routine-2', title: '스쿼트 3세트 x 15회', completed: false },
    { id: 't2-2', routineId: 'routine-2', title: '플랭크 1분 x 3세트', completed: false },
    { id: 't2-3', routineId: 'routine-2', title: '러닝 20분', completed: false },
  ],
  'routine-3': [
    { id: 't3-1', routineId: 'routine-3', title: '영어 뉴스 기사 1개 읽기', completed: true },
    { id: 't3-2', routineId: 'routine-3', title: '모르는 단어 10개 정리', completed: false },
  ],
  'routine-4': [
    { id: 't4-1', routineId: 'routine-4', title: '아침: 그릭요거트 + 과일', completed: true },
    { id: 't4-2', routineId: 'routine-4', title: '점심: 닭가슴살 샐러드', completed: false },
    { id: 't4-3', routineId: 'routine-4', title: '저녁: 현미밥 + 된장찌개', completed: false },
  ],
};

// ─── Helpers ────────────────────────────────────────────

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getWeekDays(): DayInfo[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - dayOfWeek);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return {
      dayLabel: DAY_LABELS[i],
      dateNum: d.getDate(),
      date: d,
      isToday:
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate(),
    };
  });
}

const CATEGORY_COLORS: Record<CategoryKey, string> = {
  exercise: '#FF6B6B',
  diet: '#4ECDC4',
  selfdev: '#FFD93D',
  cert: '#6C5CE7',
  study: '#74B9FF',
};

function getCategoryLabel(key: CategoryKey): string {
  const cat = categories.find((c) => c.key === key);
  return cat ? cat.emoji : '';
}

// ─── Component ──────────────────────────────────────────

export default function BoardScreen() {
  const router = useRouter();
  const { myRoutines, isLoading, loadProfile } = useUserStore();

  const [todos, setTodos] = useState<Record<string, TodoItem[]>>(MOCK_TODOS);
  const [expandedRoutines, setExpandedRoutines] = useState<Record<string, boolean>>({});
  const [selectedDay, setSelectedDay] = useState<number>(-1); // -1 means today

  const weekDays = getWeekDays();

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Auto-expand all active routines on first load
  useEffect(() => {
    const activeRoutines = myRoutines.filter((r) => r.status === 'active');
    if (activeRoutines.length > 0 && Object.keys(expandedRoutines).length === 0) {
      const expanded: Record<string, boolean> = {};
      activeRoutines.forEach((r) => {
        expanded[r.id] = true;
      });
      setExpandedRoutines(expanded);
    }
  }, [myRoutines, expandedRoutines]);

  const activeRoutines = myRoutines.filter((r) => r.status === 'active');

  const toggleExpand = useCallback((routineId: string) => {
    setExpandedRoutines((prev) => ({ ...prev, [routineId]: !prev[routineId] }));
  }, []);

  const toggleTodo = useCallback((routineId: string, todoId: string) => {
    setTodos((prev) => {
      const items = prev[routineId];
      if (!items) return prev;
      return {
        ...prev,
        [routineId]: items.map((item) =>
          item.id === todoId ? { ...item, completed: !item.completed } : item
        ),
      };
    });
  }, []);

  const getRoutineTodos = (routineId: string): TodoItem[] => {
    return todos[routineId] ?? [];
  };

  const getCompletedCount = (routineId: string): number => {
    const items = getRoutineTodos(routineId);
    return items.filter((t) => t.completed).length;
  };

  const navigateToHome = () => {
    router.push('/(tabs)');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BOARD</Text>
        <Calendar size={22} color={colors.textSecondary} />
      </View>

      {/* Day Navigation */}
      <View style={styles.dayNavContainer}>
        {weekDays.map((day, index) => {
          const isSelected = selectedDay === -1 ? day.isToday : selectedDay === index;
          return (
            <TouchableOpacity
              key={day.dayLabel}
              style={[styles.dayItem, isSelected && styles.dayItemSelected]}
              onPress={() => setSelectedDay(day.isToday ? -1 : index)}
              activeOpacity={0.7}
            >
              <Text style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}>
                {day.dayLabel}
              </Text>
              <Text style={[styles.dayNum, isSelected && styles.dayNumSelected]}>
                {day.dateNum}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Content */}
      {activeRoutines.length === 0 ? (
        <EmptyState
          icon={<CheckSquareIcon />}
          title="아직 진행 중인 루틴이 없어요"
          description="전문가가 만든 루틴을 구매하고 매일 투두를 완료해보세요!"
          actionLabel="루틴 둘러보기"
          onAction={navigateToHome}
        />
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeRoutines.map((routine) => (
            <RoutineSection
              key={routine.id}
              routine={routine}
              isExpanded={expandedRoutines[routine.id] ?? false}
              onToggleExpand={() => toggleExpand(routine.id)}
              todos={getRoutineTodos(routine.id)}
              completedCount={getCompletedCount(routine.id)}
              onToggleTodo={(todoId) => toggleTodo(routine.id, todoId)}
            />
          ))}

          {/* Bottom spacer for FAB */}
          <View style={{ height: 80 }} />
        </ScrollView>
      )}

      {/* FAB */}
      {activeRoutines.length > 0 && (
        <TouchableOpacity style={styles.fab} onPress={navigateToHome} activeOpacity={0.8}>
          <Plus size={24} color={colors.textWhite} />
          <Text style={styles.fabText}>HOW TO BE 추가하기</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

// ─── Empty State Icon ───────────────────────────────────

function CheckSquareIcon() {
  const { CheckSquare } = require('lucide-react-native');
  return <CheckSquare size={48} color={colors.textTertiary} />;
}

// ─── Routine Section ────────────────────────────────────

interface RoutineSectionProps {
  routine: MyRoutine;
  isExpanded: boolean;
  onToggleExpand: () => void;
  todos: TodoItem[];
  completedCount: number;
  onToggleTodo: (todoId: string) => void;
}

function RoutineSection({
  routine,
  isExpanded,
  onToggleExpand,
  todos,
  completedCount,
  onToggleTodo,
}: RoutineSectionProps) {
  const categoryColor = CATEGORY_COLORS[routine.category];
  const totalCount = todos.length;
  const progressText = `${completedCount}/${totalCount}`;

  return (
    <View style={styles.routineCard}>
      {/* Color Bar */}
      <View style={[styles.colorBar, { backgroundColor: categoryColor }]} />

      <View style={styles.routineContent}>
        {/* Header */}
        <TouchableOpacity
          style={styles.routineHeader}
          onPress={onToggleExpand}
          activeOpacity={0.7}
        >
          <View style={styles.routineHeaderLeft}>
            <Text style={styles.routineEmoji}>{getCategoryLabel(routine.category)}</Text>
            <View style={styles.routineTitleArea}>
              <Text style={styles.routineTitle} numberOfLines={1}>
                {routine.title}
              </Text>
              <Text style={styles.routineProvider}>{routine.providerName}</Text>
            </View>
          </View>

          <View style={styles.routineHeaderRight}>
            <View style={styles.ddayBadge}>
              <Text style={styles.ddayText}>D-{routine.dday}</Text>
            </View>
            <Text style={styles.progressText}>{progressText}</Text>
            {isExpanded ? (
              <ChevronUp size={18} color={colors.textSecondary} />
            ) : (
              <ChevronDown size={18} color={colors.textSecondary} />
            )}
          </View>
        </TouchableOpacity>

        {/* Progress Bar */}
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
                backgroundColor: categoryColor,
              },
            ]}
          />
        </View>

        {/* Todo Items */}
        {isExpanded && (
          <View style={styles.todoList}>
            {todos.map((todo) => (
              <View key={todo.id} style={styles.todoItem}>
                <Checkbox
                  checked={todo.completed}
                  onToggle={() => onToggleTodo(todo.id)}
                  label={todo.title}
                />
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.bgPrimary,
  },
  headerTitle: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
    color: colors.textPrimary,
  },

  // Day Navigation
  dayNavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.bgPrimary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dayItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 56,
    borderRadius: borderRadius.md,
  },
  dayItemSelected: {
    backgroundColor: colors.primary,
  },
  dayLabel: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  dayLabelSelected: {
    color: colors.textWhite,
    fontWeight: '600',
  },
  dayNum: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.textPrimary,
  },
  dayNumSelected: {
    color: colors.textWhite,
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },

  // Routine Card
  routineCard: {
    flexDirection: 'row',
    backgroundColor: colors.bgPrimary,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  colorBar: {
    width: 4,
  },
  routineContent: {
    flex: 1,
    padding: spacing.md,
  },

  // Routine Header
  routineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routineHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  routineEmoji: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  routineTitleArea: {
    flex: 1,
  },
  routineTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.textPrimary,
  },
  routineProvider: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    color: colors.textSecondary,
    marginTop: 2,
  },
  routineHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  ddayBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  ddayText: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    color: colors.primary,
  },
  progressText: {
    fontSize: typography.body2.fontSize,
    fontWeight: typography.body2.fontWeight,
    color: colors.textSecondary,
  },

  // Progress Bar
  progressBarBg: {
    height: 4,
    backgroundColor: colors.bgSecondary,
    borderRadius: 2,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 4,
    borderRadius: 2,
  },

  // Todo List
  todoList: {
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  todoItem: {
    paddingVertical: spacing.sm,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.md,
    right: spacing.md,
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.textWhite,
    marginLeft: spacing.sm,
  },
});
