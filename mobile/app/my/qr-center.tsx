import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { QrCode } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '@/src/theme/tokens';
import { useUserStore } from '@/src/stores/userStore';
import Header from '@/src/components/common/Header';

export default function QRCenterScreen() {
  const router = useRouter();
  const { profile } = useUserStore();

  return (
    <SafeAreaView style={styles.container}>
      <Header title="QR 코드" onBack={() => router.back()} />

      <View style={styles.content}>
        {/* QR Code Placeholder */}
        <View style={styles.qrContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.qrPlaceholder,
              pressed && { opacity: 0.7 },
              Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined,
            ]}
          >
            <QrCode size={120} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.qrLabel}>
            {profile?.nickname ?? '사용자'}
          </Text>
          <Text style={styles.qrDescription}>
            이 기능은 추후 업데이트에서 제공될 예정입니다
          </Text>
        </View>

        {/* Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            QR 코드를 스캔하면 프로필을 확인할 수 있습니다.
          </Text>
        </View>
      </View>
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
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xxl,
  },
  qrContainer: {
    alignItems: 'center',
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: colors.bgSecondary,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  qrLabel: {
    ...typography.h2,
    color: colors.textPrimary,
    marginTop: spacing.lg,
  },
  qrDescription: {
    ...typography.body2,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  infoBox: {
    marginTop: spacing.xl,
    backgroundColor: colors.bgSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    width: '100%',
  },
  infoText: {
    ...typography.body2,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
