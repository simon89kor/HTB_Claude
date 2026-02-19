import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Home, PenSquare, CheckSquare, Trophy, User } from 'lucide-react-native';
import { colors, bottomNav } from '@/src/theme/tokens';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: bottomNav.activeColor,
        tabBarInactiveTintColor: bottomNav.inactiveColor,
        tabBarStyle: {
          backgroundColor: bottomNav.background,
          height: bottomNav.height + (Platform.OS === 'web' ? 8 : 0),
          borderTopWidth: 0,
          paddingBottom: Platform.OS === 'web' ? 12 : 8,
          paddingTop: 8,
          // Ensure tab bar is visible and not cut off on web
          ...(Platform.OS === 'web'
            ? {
                position: 'relative' as const,
                flexShrink: 0,
              }
            : {}),
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'HOME',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          title: 'POST',
          tabBarIcon: ({ color, size }) => <PenSquare size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="board"
        options={{
          title: 'BOARD',
          tabBarIcon: ({ color, size }) => <CheckSquare size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="reward"
        options={{
          title: 'REWARD',
          tabBarIcon: ({ color, size }) => <Trophy size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="my"
        options={{
          title: 'MY',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
