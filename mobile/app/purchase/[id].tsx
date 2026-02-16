import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { colors, typography } from '@/src/theme/tokens';

export default function PurchaseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Purchase</Text>
        <Text style={styles.subtitle}>Routine ID: {id}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { ...typography.h1, color: colors.textPrimary },
  subtitle: { ...typography.body1, color: colors.textSecondary, marginTop: 8 },
});
