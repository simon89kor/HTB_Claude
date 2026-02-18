import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '@/src/theme/tokens';

interface DividerProps {
  spacing?: number;
}

export default function Divider({
  spacing: verticalSpacing = spacing.md,
}: DividerProps) {
  return (
    <View
      style={[
        styles.line,
        { marginVertical: verticalSpacing },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  line: {
    height: 1,
    width: '100%',
    backgroundColor: colors.border,
  },
});
