import React from 'react';
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
import {
  Bell,
  CreditCard,
  FileText,
  Info,
  LogOut,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react-native';
import { colors, typography, spacing } from '@/src/theme/tokens';
import Header from '@/src/components/common/Header';
import Divider from '@/src/components/common/Divider';

interface SettingsItem {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  rightContent?: React.ReactNode;
  destructive?: boolean;
}

export default function SettingsScreen() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: () => router.replace('/'),
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '회원탈퇴',
      '정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '탈퇴',
          style: 'destructive',
          onPress: () => {
            Alert.alert('안내', '회원탈퇴가 완료되었습니다.');
          },
        },
      ]
    );
  };

  const generalItems: SettingsItem[] = [
    {
      icon: <Bell size={20} color={colors.textPrimary} />,
      label: '알림 설정',
      onPress: () => router.push('/my/notifications'),
    },
    {
      icon: <CreditCard size={20} color={colors.textPrimary} />,
      label: '결제 수단 관리',
      onPress: () => Alert.alert('안내', '준비 중입니다'),
    },
    {
      icon: <FileText size={20} color={colors.textPrimary} />,
      label: '약관 및 정책',
      onPress: () => Alert.alert('안내', '준비 중입니다'),
    },
    {
      icon: <Info size={20} color={colors.textPrimary} />,
      label: '앱 정보',
      onPress: () => {},
      rightContent: <Text style={styles.versionText}>v1.0.0</Text>,
    },
  ];

  const accountItems: SettingsItem[] = [
    {
      icon: <LogOut size={20} color={colors.error} />,
      label: '로그아웃',
      onPress: handleLogout,
      destructive: true,
    },
    {
      icon: <AlertTriangle size={20} color={colors.error} />,
      label: '회원탈퇴',
      onPress: handleDeleteAccount,
      destructive: true,
    },
  ];

  const renderItem = (item: SettingsItem, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.menuItem}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        {item.icon}
        <Text
          style={[
            styles.menuItemLabel,
            item.destructive && styles.destructiveLabel,
          ]}
        >
          {item.label}
        </Text>
      </View>
      {item.rightContent ?? <ChevronRight size={20} color={colors.textTertiary} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="설정" onBack={() => router.back()} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* General Settings */}
        <View style={styles.section}>
          {generalItems.map(renderItem)}
        </View>

        <Divider spacing={spacing.sm} />

        {/* Account Settings */}
        <View style={styles.section}>
          {accountItems.map(renderItem)}
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
  section: {
    paddingHorizontal: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  menuItemLabel: {
    ...typography.body1,
    color: colors.textPrimary,
  },
  destructiveLabel: {
    color: colors.error,
  },
  versionText: {
    ...typography.body2,
    color: colors.textTertiary,
  },
});
