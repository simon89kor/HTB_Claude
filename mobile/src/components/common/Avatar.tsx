import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { colors, typography, borderRadius } from '@/src/theme/tokens';

type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
  uri?: string;
  size?: AvatarSize;
  fallback?: string;
}

const sizeMap: Record<AvatarSize, number> = {
  sm: 32,
  md: 48,
  lg: 80,
};

const fontSizeMap: Record<AvatarSize, number> = {
  sm: 12,
  md: 18,
  lg: 28,
};

export default function Avatar({
  uri,
  size = 'md',
  fallback = '?',
}: AvatarProps) {
  const dimension = sizeMap[size];
  const fontSize = fontSizeMap[size];

  const containerStyle = {
    width: dimension,
    height: dimension,
    borderRadius: borderRadius.full,
  };

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.image, containerStyle]}
      />
    );
  }

  return (
    <View style={[styles.fallback, containerStyle]}>
      <Text style={[styles.fallbackText, { fontSize }]}>
        {fallback.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.bgSecondary,
  },
  fallback: {
    backgroundColor: colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    fontWeight: typography.h2.fontWeight,
    color: colors.textSecondary,
  },
});
