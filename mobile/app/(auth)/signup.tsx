import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import { Header, TextInput, Button, Checkbox } from '@/src/components/common';
import { useAuthStore } from '@/src/stores/authStore';
import { colors, typography, spacing } from '@/src/theme/tokens';

export default function SignUpScreen() {
  const router = useRouter();
  const { signup, isLoading } = useAuthStore();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);

  // Touched state for validation display
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    passwordConfirm: false,
    nickname: false,
  });

  // Validation
  const emailError = useMemo(() => {
    if (!touched.email || !email) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return '올바른 이메일 형식을 입력해주세요';
    return '';
  }, [email, touched.email]);

  const passwordError = useMemo(() => {
    if (!touched.password || !password) return '';
    if (password.length < 8) return '비밀번호는 8자 이상이어야 합니다';
    return '';
  }, [password, touched.password]);

  const passwordConfirmError = useMemo(() => {
    if (!touched.passwordConfirm || !passwordConfirm) return '';
    if (password !== passwordConfirm) return '비밀번호가 일치하지 않습니다';
    return '';
  }, [password, passwordConfirm, touched.passwordConfirm]);

  const nicknameError = useMemo(() => {
    if (!touched.nickname || !nickname) return '';
    if (nickname.length < 2 || nickname.length > 12)
      return '닉네임은 2~12자로 입력해주세요';
    return '';
  }, [nickname, touched.nickname]);

  const isFormValid = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValid = emailRegex.test(email);
    const passwordValid = password.length >= 8;
    const passwordConfirmValid = password === passwordConfirm && passwordConfirm.length > 0;
    const nicknameValid = nickname.length >= 2 && nickname.length <= 12;

    return emailValid && passwordValid && passwordConfirmValid && nicknameValid && termsAgreed;
  }, [email, password, passwordConfirm, nickname, termsAgreed]);

  const handleSubmit = async () => {
    if (!isFormValid) return;
    await signup(email, password, nickname);
    // Auth state change will trigger redirect in _layout.tsx
  };

  const markTouched = (field: keyof typeof touched) => {
    if (!touched[field]) {
      setTouched((prev) => ({ ...prev, [field]: true }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="회원가입" onBack={() => router.back()} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Email */}
          <View>
            <TextInput
              label="이메일"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                markTouched('email');
              }}
              placeholder="example@email.com"
              keyboardType="email-address"
              error={emailError}
            />
          </View>

          {/* Password */}
          <View style={styles.passwordContainer}>
            <TextInput
              label="비밀번호"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                markTouched('password');
              }}
              placeholder="8자 이상 입력해주세요"
              secureTextEntry={!showPassword}
              error={passwordError}
            />
            <Pressable
              style={({ pressed }) => [
                styles.eyeButton,
                pressed && { opacity: 0.7 },
                Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined,
              ]}
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={20} color={colors.textSecondary} />
              ) : (
                <Eye size={20} color={colors.textSecondary} />
              )}
            </Pressable>
          </View>

          {/* Password confirm */}
          <View style={styles.passwordContainer}>
            <TextInput
              label="비밀번호 확인"
              value={passwordConfirm}
              onChangeText={(text) => {
                setPasswordConfirm(text);
                markTouched('passwordConfirm');
              }}
              placeholder="비밀번호를 다시 입력해주세요"
              secureTextEntry={!showPasswordConfirm}
              error={passwordConfirmError}
            />
            <Pressable
              style={({ pressed }) => [
                styles.eyeButton,
                pressed && { opacity: 0.7 },
                Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined,
              ]}
              onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
            >
              {showPasswordConfirm ? (
                <EyeOff size={20} color={colors.textSecondary} />
              ) : (
                <Eye size={20} color={colors.textSecondary} />
              )}
            </Pressable>
          </View>

          {/* Nickname */}
          <TextInput
            label="닉네임"
            value={nickname}
            onChangeText={(text) => {
              setNickname(text);
              markTouched('nickname');
            }}
            placeholder="2~12자로 입력해주세요"
            maxLength={12}
            error={nicknameError}
          />

          {/* Terms */}
          <View style={styles.termsSection}>
            <Checkbox
              checked={termsAgreed}
              onToggle={() => setTermsAgreed(!termsAgreed)}
              label="이용약관 및 개인정보 처리방침에 동의합니다"
            />
          </View>
        </ScrollView>

        {/* Submit button */}
        <View style={styles.buttonContainer}>
          <Button
            title="가입하기"
            onPress={handleSubmit}
            size="lg"
            fullWidth
            disabled={!isFormValid}
            loading={isLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 36,
    padding: spacing.xs,
  },
  termsSection: {
    marginTop: spacing.md,
    backgroundColor: colors.bgSecondary,
    borderRadius: 12,
    padding: spacing.md,
  },
  buttonContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
});
