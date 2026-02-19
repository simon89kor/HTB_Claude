import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '@/src/stores/authStore';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(auth)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const { isAuthenticated, isOnboarded } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Not authenticated, redirect to auth flow
      router.replace('/(auth)/splash');
    } else if (isAuthenticated && !isOnboarded && inAuthGroup) {
      // Authenticated but not onboarded, show preference
      router.replace('/(auth)/preference');
    } else if (isAuthenticated && isOnboarded && inAuthGroup) {
      // Fully onboarded, go to BOARD tab (기존 사용자 기본 랜딩)
      router.replace('/(tabs)/board');
    }
  }, [isAuthenticated, isOnboarded, segments, loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="my" options={{ headerShown: false }} />
        <Stack.Screen name="routine/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="purchase/[id]" options={{ headerShown: false, presentation: 'modal' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
