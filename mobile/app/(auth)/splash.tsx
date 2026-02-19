import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/src/stores/authStore';
import { colors, typography, spacing } from '@/src/theme/tokens';

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, isOnboarded } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.replace('/(auth)/walkthrough');
      } else if (!isOnboarded) {
        router.replace('/(auth)/preference');
      } else {
        router.replace('/(tabs)/board');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [router, isAuthenticated, isOnboarded]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>HOW TO BE</Text>
      </View>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.textWhite} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.textWhite,
    letterSpacing: 4,
  },
  loadingContainer: {
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
});
