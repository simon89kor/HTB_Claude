import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography } from '@/src/theme/tokens';

export default function SplashScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>HTB</Text>
        <Text style={styles.subtitle}>How To Be</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { ...typography.display, color: colors.textWhite, fontSize: 48 },
  subtitle: { ...typography.h2, color: colors.textWhite, marginTop: 8 },
});
