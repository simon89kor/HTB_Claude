import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MessageCircle, Smartphone, Chrome } from 'lucide-react-native';
import { Divider } from '@/src/components/common';
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
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>H</Text>
          </View>
          <Text style={styles.appTitle}>How To Be</Text>
          <Text style={styles.appSubtitle}>나만의 루틴을 시작해보세요</Text>
        </View>

        {/* Social Login Buttons */}
        <View style={styles.socialSection}>
          {/* Kakao */}
          <TouchableOpacity
            style={[styles.socialButton, styles.kakaoButton]}
            onPress={() => handleSocialLogin('kakao')}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            <MessageCircle size={20} color={colors.textPrimary} />
            <Text style={[styles.socialButtonText, styles.kakaoText]}>
              카카오로 시작하기
            </Text>
          </TouchableOpacity>

          {/* Apple */}
          <TouchableOpacity
            style={[styles.socialButton, styles.appleButton]}
            onPress={() => handleSocialLogin('apple')}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            <Smartphone size={20} color={colors.textWhite} />
            <Text style={[styles.socialButtonText, styles.appleText]}>
              Apple로 시작하기
            </Text>
          </TouchableOpacity>

          {/* Google */}
          <TouchableOpacity
            style={[styles.socialButton, styles.googleButton]}
            onPress={() => handleSocialLogin('google')}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            <Chrome size={20} color={colors.textPrimary} />
            <Text style={[styles.socialButtonText, styles.googleText]}>
              Google로 시작하기
            </Text>
          </TouchableOpacity>
        </View>

        {/* Divider with "또는" */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>또는</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Email login link */}
        <TouchableOpacity
          style={styles.emailButton}
          onPress={handleEmailSignup}
          activeOpacity={0.7}
        >
          <Text style={styles.emailButtonText}>이메일로 로그인</Text>
        </TouchableOpacity>
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
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.textWhite,
  },
  appTitle: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  appSubtitle: {
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
    height: 52,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emailButtonText: {
    ...typography.h3,
    color: colors.textSecondary,
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
