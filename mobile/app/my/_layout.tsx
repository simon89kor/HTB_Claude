import { Stack } from 'expo-router';

export default function MyLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="routines" />
      <Stack.Screen name="purchase-history" />
      <Stack.Screen name="qr-center" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="followers" />
    </Stack>
  );
}
