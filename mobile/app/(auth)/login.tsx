import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/src/stores/authStore';
import { colors, typography, spacing, borderRadius } from '@/src/theme/tokens';

export default function LoginScreen() {
  const router = useRouter();
  const { socialLogin, isLoading } = useAuthStore();

  const handleSocialLogin = async (provider: 'kakao' | 'apple' | 'google') => {
    await socialLogin(provider);
    // Auth redirect handled by _layout.tsx
  };

  const handleEmailSignup = () => {
    router.push('/(auth)/signup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Text style={styles.logoText}>HOW TO BE</Text>
          <Text style={styles.subtitle}>나만의 루틴을 시작하세요</Text>
        </View>

        {/* Social Login Buttons */}
        <View style={styles.socialSection}>
          {/* Kakao */}
          <Pressable
            style={({ pressed }) => [
              styles.socialButton,
              styles.kakaoButton,
              pressed && { opacity: 0.7 },
              Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined,
            ]}
            onPress={() => handleSocialLogin('kakao')}
            disabled={isLoading}
          >
            <Text style={[styles.socialButtonText, styles.kakaoText]}>
              카카오로 시작하기
            </Text>
          </Pressable>

          {/* Apple */}
          <Pressable
            style={({ pressed }) => [
              styles.socialButton,
              styles.appleButton,
              pressed && { opacity: 0.7 },
              Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined,
            ]}
            onPress={() => handleSocialLogin('apple')}
            disabled={isLoading}
          >
            <Text style={[styles.socialButtonText, styles.appleText]}>
              Apple로 시작하기
            </Text>
          </Pressable>

          {/* Google */}
          <Pressable
            style={({ pressed }) => [
              styles.socialButton,
              styles.googleButton,
              pressed && { opacity: 0.7 },
              Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined,
            ]}
            onPress={() => handleSocialLogin('google')}
            disabled={isLoading}
          >
            <Text style={[styles.socialButtonText, styles.googleText]}>
              Google로 시작하기
            </Text>
          </Pressable>
        </View>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>또는</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Email signup link */}
        <Pressable
          style={({ pressed }) => [
            styles.emailButton,
            pressed && { opacity: 0.7 },
            Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined,
          ]}
          onPress={handleEmailSignup}
        >
          <Text style={styles.emailButtonText}>이메일로 시작하기</Text>
        </Pressable>
      </View>

      {/* Terms text */}
      <View style={styles.termsContainer}>
        <Text style={styles.termsText}>
          계속 진행하면 이용약관 및 개인정보처리방침에 동의합니다
        </Text>
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
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body1,
    color: colors.textSecondary,
  },
  socialSection: {
    gap: spacing.sm,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  kakaoButton: {
    backgroundColor: colors.kakao,
  },
  appleButton: {
    backgroundColor: colors.apple,
  },
  googleButton: {
    backgroundColor: colors.google,
    borderWidth: 1,
    borderColor: colors.border,
  },
  socialButtonText: {
    ...typography.h3,
  },
  kakaoText: {
    color: colors.textPrimary,
  },
  appleText: {
    color: colors.textWhite,
  },
  googleText: {
    color: colors.textPrimary,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.body2,
    color: colors.textSecondary,
    marginHorizontal: spacing.md,
  },
  emailButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  emailButtonText: {
    ...typography.body1,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
  termsContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    alignItems: 'center',
  },
  termsText: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});
