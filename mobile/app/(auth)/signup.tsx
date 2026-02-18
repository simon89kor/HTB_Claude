import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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

  // Terms state
  const [termsAll, setTermsAll] = useState(false);
  const [termsService, setTermsService] = useState(false);
  const [termsPrivacy, setTermsPrivacy] = useState(false);
  const [termsMarketing, setTermsMarketing] = useState(false);

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
    if (!email.includes('@')) return '올바른 이메일 형식을 입력해주세요';
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
    const emailValid = email.includes('@');
    const passwordValid = password.length >= 8;
    const passwordConfirmValid = password === passwordConfirm && passwordConfirm.length > 0;
    const nicknameValid = nickname.length >= 2 && nickname.length <= 12;
    const termsValid = termsService && termsPrivacy;

    return emailValid && passwordValid && passwordConfirmValid && nicknameValid && termsValid;
  }, [email, password, passwordConfirm, nickname, termsService, termsPrivacy]);

  const handleToggleAll = () => {
    const newValue = !termsAll;
    setTermsAll(newValue);
    setTermsService(newValue);
    setTermsPrivacy(newValue);
    setTermsMarketing(newValue);
  };

  const handleToggleService = () => {
    const newValue = !termsService;
    setTermsService(newValue);
    if (!newValue) setTermsAll(false);
    else if (newValue && termsPrivacy && termsMarketing) setTermsAll(true);
  };

  const handleTogglePrivacy = () => {
    const newValue = !termsPrivacy;
    setTermsPrivacy(newValue);
    if (!newValue) setTermsAll(false);
    else if (termsService && newValue && termsMarketing) setTermsAll(true);
  };

  const handleToggleMarketing = () => {
    const newValue = !termsMarketing;
    setTermsMarketing(newValue);
    if (!newValue) setTermsAll(false);
    else if (termsService && termsPrivacy && newValue) setTermsAll(true);
  };

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
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
              activeOpacity={0.7}
            >
              {showPassword ? (
                <EyeOff size={20} color={colors.textSecondary} />
              ) : (
                <Eye size={20} color={colors.textSecondary} />
              )}
            </TouchableOpacity>
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
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
              activeOpacity={0.7}
            >
              {showPasswordConfirm ? (
                <EyeOff size={20} color={colors.textSecondary} />
              ) : (
                <Eye size={20} color={colors.textSecondary} />
              )}
            </TouchableOpacity>
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
            <View style={styles.termsAllRow}>
              <Checkbox
                checked={termsAll}
                onToggle={handleToggleAll}
                label="전체 동의"
              />
            </View>
            <View style={styles.termsDivider} />
            <View style={styles.termsRow}>
              <Checkbox
                checked={termsService}
                onToggle={handleToggleService}
                label="[필수] 이용약관 동의"
              />
            </View>
            <View style={styles.termsRow}>
              <Checkbox
                checked={termsPrivacy}
                onToggle={handleTogglePrivacy}
                label="[필수] 개인정보처리방침 동의"
              />
            </View>
            <View style={styles.termsRow}>
              <Checkbox
                checked={termsMarketing}
                onToggle={handleToggleMarketing}
                label="[선택] 마케팅 정보 수신 동의"
              />
            </View>
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
  termsAllRow: {
    paddingVertical: spacing.sm,
  },
  termsDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  termsRow: {
    paddingVertical: spacing.xs + 2,
  },
  buttonContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
});
