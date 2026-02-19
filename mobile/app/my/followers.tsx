import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, typography, spacing } from '@/src/theme/tokens';
import { useUserStore, FollowUser } from '@/src/stores/userStore';
import Header from '@/src/components/common/Header';
import Avatar from '@/src/components/common/Avatar';
import Button from '@/src/components/common/Button';
import Chip from '@/src/components/common/Chip';

type TabKey = 'followers' | 'following';

function FollowUserItem({
  user,
  onToggle,
}: {
  user: FollowUser;
  onToggle: (userId: string) => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.userItem,
        pressed && { opacity: 0.7 },
        Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined,
      ]}
    >
      <Avatar
        uri={user.avatarUrl ?? undefined}
        size="md"
        fallback={user.nickname}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userNickname}>{user.nickname}</Text>
        {user.bio && (
          <Text style={styles.userBio} numberOfLines={1}>
            {user.bio}
          </Text>
        )}
      </View>
      <Button
        title={user.isFollowing ? '팔로잉' : '팔로우'}
        variant={user.isFollowing ? 'secondary' : 'primary'}
        size="sm"
        onPress={() => onToggle(user.id)}
      />
    </Pressable>
  );
}

export default function FollowersScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ tab?: string }>();
  const { profile, followers, following, toggleFollow } = useUserStore();

  const initialTab: TabKey = params.tab === 'following' ? 'following' : 'followers';
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

  const data = activeTab === 'followers' ? followers : following;
  const title = profile?.nickname ?? '';

  return (
    <SafeAreaView style={styles.container}>
      <Header title={title} onBack={() => router.back()} />

      {/* Tabs */}
      <View style={styles.tabRow}>
        <Chip
          label={`팔로워 (${followers.length})`}
          selected={activeTab === 'followers'}
          onPress={() => setActiveTab('followers')}
        />
        <Chip
          label={`팔로잉 (${following.length})`}
          selected={activeTab === 'following'}
          onPress={() => setActiveTab('following')}
        />
      </View>

      {/* User List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FollowUserItem user={item} onToggle={toggleFollow} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {activeTab === 'followers'
                ? '아직 팔로워가 없습니다'
                : '아직 팔로잉하는 사람이 없습니다'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  tabRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userNickname: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  userBio: {
    ...typography.body2,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxl * 2,
  },
  emptyText: {
    ...typography.body1,
    color: colors.textTertiary,
  },
});
