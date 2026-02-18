import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Package,
  ShoppingCart,
  QrCode,
  Settings,
  HelpCircle,
  ChevronRight,
} from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '@/src/theme/tokens';
import { useUserStore } from '@/src/stores/userStore';
import Avatar from '@/src/components/common/Avatar';
import Button from '@/src/components/common/Button';
import Divider from '@/src/components/common/Divider';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

export default function MyScreen() {
  const router = useRouter();
  const { profile, isLoading, loadProfile } = useUserStore();

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (isLoading || !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const menuItems: MenuItem[] = [
    {
      icon: <Package size={20} color={colors.textPrimary} />,
      label: '내 루틴',
      onPress: () => router.push('/my/routines'),
    },
    {
      icon: <ShoppingCart size={20} color={colors.textPrimary} />,
      label: '구매 내역',
      onPress: () => router.push('/my/purchase-history'),
    },
    {
      icon: <QrCode size={20} color={colors.textPrimary} />,
      label: 'QR 코드',
      onPress: () => router.push('/my/qr-center'),
    },
    {
      icon: <Settings size={20} color={colors.textPrimary} />,
      label: '설정',
      onPress: () => router.push('/my/settings'),
    },
    {
      icon: <HelpCircle size={20} color={colors.textPrimary} />,
      label: '고객센터',
      onPress: () => Alert.alert('안내', '준비 중입니다'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileSection}>
          <Avatar
            uri={profile.avatarUrl ?? undefined}
            size="lg"
            fallback={profile.nickname}
          />
          <Text style={styles.nickname}>{profile.nickname}</Text>
          {profile.bio && (
            <Text style={styles.bio}>{profile.bio}</Text>
          )}
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => router.push('/my/followers?tab=followers')}
            activeOpacity={0.7}
          >
            <Text style={styles.statNumber}>{profile.followerCount}</Text>
            <Text style={styles.statLabel}>팔로워</Text>
          </TouchableOpacity>

          <View style={styles.statDivider} />

          <TouchableOpacity
            style={styles.statItem}
            onPress={() => router.push('/my/followers?tab=following')}
            activeOpacity={0.7}
          >
            <Text style={styles.statNumber}>{profile.followingCount}</Text>
            <Text style={styles.statLabel}>팔로잉</Text>
          </TouchableOpacity>

          <View style={styles.statDivider} />

          <TouchableOpacity
            style={styles.statItem}
            activeOpacity={0.7}
          >
            <Text style={styles.statNumber}>{profile.postCount}</Text>
            <Text style={styles.statLabel}>게시물</Text>
          </TouchableOpacity>
        </View>

        {/* Edit Profile Button */}
        <View style={styles.editButtonContainer}>
          <Button
            title="프로필 편집"
            variant="secondary"
            size="sm"
            fullWidth
            onPress={() => router.push('/my/edit-profile')}
          />
        </View>

        <Divider spacing={spacing.lg} />

        {/* Menu List */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                {item.icon}
                <Text style={styles.menuItemLabel}>{item.label}</Text>
              </View>
              <ChevronRight size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  profileSection: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  nickname: {
    ...typography.h1,
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  bio: {
    ...typography.body1,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  statLabel: {
    ...typography.body2,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },
  editButtonContainer: {
    paddingHorizontal: spacing.md,
  },
  menuSection: {
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
});
