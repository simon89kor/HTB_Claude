import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/src/stores/authStore';
import { Button, Chip } from '@/src/components/common';
import { colors, typography, spacing } from '@/src/theme/tokens';
import { CategoryKey } from '@/src/types';

const PREFERENCE_CATEGORIES: { key: CategoryKey; label: string; emoji: string }[] = [
  { key: 'exercise', label: '운동루틴', emoji: '\u{1F4AA}' },
  { key: 'diet', label: '식단관리', emoji: '\u{1F957}' },
  { key: 'selfdev', label: '자기계발', emoji: '\u{1F393}' },
  { key: 'cert', label: '자격증', emoji: '\u{1F4DD}' },
  { key: 'study', label: '학업', emoji: '\u{1F4DA}' },
];

export default function PreferenceScreen() {
  const { setPreferences, setOnboarded } = useAuthStore();
  const [selected, setSelected] = useState<CategoryKey[]>([]);

  const toggleCategory = (key: CategoryKey) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleComplete = () => {
    if (selected.length === 0) return;
    setPreferences(selected);
    setOnboarded();
    // Root _layout.tsx will detect isOnboarded and redirect to tabs
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>어떤 루틴에 관심이 있나요?</Text>
          <Text style={styles.subtitle}>
            관심 카테고리를 선택하면 맞춤 루틴을 추천해드려요
          </Text>
        </View>

        {/* Category Chips */}
        <View style={styles.chipGrid}>
          {PREFERENCE_CATEGORIES.map((cat) => {
            const isSelected = selected.includes(cat.key);
            return (
              <Chip
                key={cat.key}
                label={cat.label}
                emoji={cat.emoji}
                selected={isSelected}
                onPress={() => toggleCategory(cat.key)}
              />
            );
          })}
        </View>
      </View>

      {/* Bottom Button */}
      <View style={styles.buttonContainer}>
        <Button
          title="완료"
          onPress={handleComplete}
          size="lg"
          fullWidth
          disabled={selected.length === 0}
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  titleSection: {
    paddingTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body2,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  buttonContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
});
