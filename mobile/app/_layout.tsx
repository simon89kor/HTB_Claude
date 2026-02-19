import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '@/src/stores/authStore';

// On web, GestureHandlerRootView can interfere with pointer events.
const RootContainer = Platform.OS === 'web' ? View : GestureHandlerRootView;

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(auth)',
};

SplashScreen.preventAutoHideAsync();

/**
 * Inject global CSS fixes at runtime.
 * +html.tsx may not apply in dev server, so we inject via DOM.
 */
function useWebStyleFix() {
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    if (typeof document === 'undefined') return;

    // Remove existing (HMR support)
    document.getElementById('htb-web-fixes')?.remove();

    const style = document.createElement('style');
    style.id = 'htb-web-fixes';
    style.textContent = HTB_WEB_CSS;
    document.head.appendChild(style);

    return () => {
      style.remove();
    };
  }, []);
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const { isAuthenticated, isOnboarded } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  // Inject web CSS fixes at runtime
  useWebStyleFix();

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
      router.replace('/(auth)/splash');
    } else if (isAuthenticated && !isOnboarded && inAuthGroup) {
      router.replace('/(auth)/preference');
    } else if (isAuthenticated && isOnboarded && inAuthGroup) {
      router.replace('/(tabs)/board');
    }
  }, [isAuthenticated, isOnboarded, segments, loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <RootContainer style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="my" options={{ headerShown: false }} />
        <Stack.Screen name="routine/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="purchase/[id]" options={{ headerShown: false, presentation: 'modal' }} />
      </Stack>
    </RootContainer>
  );
}

/* ============================================================
   HTB Web CSS — injected at runtime (dev + production)
   ============================================================ */
const HTB_WEB_CSS = `
/* ----- Design Tokens ----- */
:root {
  --htb-primary: #2dd4a8;
  --htb-primary-dark: #1ab894;
  --htb-primary-light: rgba(45, 212, 168, 0.15);
  --htb-bg: #FFFFFF;
  --htb-bg-secondary: #F5F5F5;
  --htb-bg-dark: #1A1A1A;
  --htb-text: #1A1A1A;
  --htb-text-secondary: #888888;
  --htb-text-tertiary: #BBBBBB;
  --htb-border: #E5E5E5;
  --htb-error: #FF4444;
  --htb-nav-height: 60px;
  --htb-max-width: 480px;
}

/* ----- Base ----- */
*, *::before, *::after {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}
html, body {
  height: 100%; height: 100dvh;
  margin: 0; padding: 0;
  overflow: hidden;
  background-color: var(--htb-bg);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
}
#root {
  display: flex; flex-direction: column;
  height: 100%; height: 100dvh;
  overflow: hidden;
}

/* ===== CRITICAL: Force pointer-events on ALL elements ===== */
* { pointer-events: auto !important; }

/* ===== Cursor styles ===== */
[role="button"], [role="link"], [role="checkbox"],
[role="switch"], [role="tab"], button, a {
  cursor: pointer !important;
}
input, textarea { cursor: text !important; }
[aria-disabled="true"] { cursor: not-allowed !important; }

/* ===== Mobile frame on desktop ===== */
@media (min-width: 481px) {
  body { background-color: #E8E8E8; }
  #root {
    max-width: var(--htb-max-width);
    margin: 0 auto;
    background-color: var(--htb-bg);
    box-shadow: 0 0 24px rgba(0,0,0,0.08);
  }
}

/* ===== Scrollbar ===== */
::-webkit-scrollbar { width: 3px; height: 3px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #bbb; border-radius: 9999px; }
* { scrollbar-width: thin; scrollbar-color: #bbb transparent; }

/* ===== Selection ===== */
::selection { background-color: rgba(45,212,168,0.15); }
`;

