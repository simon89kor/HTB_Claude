import React, { ReactNode } from 'react';
import { View, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@/src/theme/tokens';

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  padding?: boolean;
  style?: ViewStyle;
}

export default function Screen({
  children,
  scroll = true,
  padding = true,
  style,
}: ScreenProps) {
  const content = scroll ? (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        padding && styles.padding,
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, padding && styles.padding]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, style]}>
      {content}
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
  },
  scrollView: {
    flex: 1,
  },
  padding: {
    padding: spacing.md,
  },
});
