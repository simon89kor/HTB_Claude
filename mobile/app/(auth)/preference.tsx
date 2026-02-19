import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/src/stores/authStore';
import { Button } from '@/src/components/common';
import { colors, typography, spacing, borderRadius, categories } from '@/src/theme/tokens';
import { CategoryKey } from '@/src/types';

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
          {categories
            .filter((cat) => cat.key !== 'all')
            .map((cat) => {
              const isSelected = selected.includes(cat.key as CategoryKey);
              return (
                <TouchableOpacity
                  key={cat.key}
                  style={[
                    styles.chip,
                    isSelected ? styles.chipSelected : styles.chipUnselected,
                  ]}
                  onPress={() => toggleCategory(cat.key as CategoryKey)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.chipEmoji}>{cat.emoji}</Text>
                  <Text
                    style={[
                      styles.chipLabel,
                      isSelected ? styles.chipLabelSelected : styles.chipLabelUnselected,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
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
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    gap: spacing.sm,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipUnselected: {
    backgroundColor: colors.bgSecondary,
    borderColor: colors.bgSecondary,
  },
  chipEmoji: {
    fontSize: 20,
  },
  chipLabel: {
    ...typography.h3,
  },
  chipLabelSelected: {
    color: colors.textWhite,
  },
  chipLabelUnselected: {
    color: colors.textPrimary,
  },
  buttonContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
});
