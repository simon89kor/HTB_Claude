import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, typography, spacing, borderRadius } from '@/src/theme/tokens';
import { useUserStore } from '@/src/stores/userStore';
import Header from '@/src/components/common/Header';
import Avatar from '@/src/components/common/Avatar';
import TextInput from '@/src/components/common/TextInput';
import Button from '@/src/components/common/Button';
import Chip from '@/src/components/common/Chip';

type GenderOption = 'male' | 'female';

export default function EditProfileScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useUserStore();

  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState<GenderOption | null>(null);

  useEffect(() => {
    if (profile) {
      setNickname(profile.nickname);
      setBio(profile.bio ?? '');
      setGender(profile.gender as GenderOption | null);
    }
  }, [profile]);

  const handleSave = () => {
    if (!nickname.trim()) {
      Alert.alert('알림', '닉네임을 입력해주세요');
      return;
    }

    updateProfile({
      nickname: nickname.trim(),
      bio: bio.trim() || null,
      gender,
    });

    router.back();
  };

  if (!profile) return null;

  return (
    <SafeAreaView style={styles.container}>
      <Header title="프로필 편집" onBack={() => router.back()} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Photo */}
        <TouchableOpacity
          style={styles.avatarSection}
          onPress={() => Alert.alert('안내', '준비 중입니다')}
          activeOpacity={0.7}
        >
          <Avatar
            uri={profile.avatarUrl ?? undefined}
            size="lg"
            fallback={profile.nickname}
          />
          <Text style={styles.changePhotoText}>사진 변경</Text>
        </TouchableOpacity>

        {/* Form */}
        <View style={styles.formSection}>
          <TextInput
            label="닉네임"
            value={nickname}
            onChangeText={setNickname}
            placeholder="닉네임을 입력하세요"
            maxLength={20}
          />

          <TextInput
            label="한줄 소개"
            value={bio}
            onChangeText={setBio}
            placeholder="자신을 소개해보세요"
            maxLength={50}
          />

          {/* Gender Selection */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>성별</Text>
            <View style={styles.chipRow}>
              <Chip
                label="남"
                selected={gender === 'male'}
                onPress={() => setGender('male')}
              />
              <Chip
                label="여"
                selected={gender === 'female'}
                onPress={() => setGender('female')}
              />
            </View>
          </View>

          {/* Birth Date (read-only) */}
          {profile.birthDate && (
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>생년월일</Text>
              <Text style={styles.fieldValue}>{profile.birthDate}</Text>
            </View>
          )}
        </View>

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="저장"
            onPress={handleSave}
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  changePhotoText: {
    ...typography.body2,
    color: colors.primary,
    marginTop: spacing.sm,
  },
  formSection: {
    paddingHorizontal: spacing.md,
  },
  fieldContainer: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  fieldValue: {
    ...typography.body1,
    color: colors.textPrimary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.bgSecondary,
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  buttonContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
});
