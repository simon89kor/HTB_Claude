import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, typography, spacing } from '@/src/theme/tokens';
import { useUserStore } from '@/src/stores/userStore';
import Header from '@/src/components/common/Header';

interface NotificationItemProps {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

function NotificationItem({
  label,
  description,
  value,
  onValueChange,
}: NotificationItemProps) {
  return (
    <View style={styles.item}>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemLabel}>{label}</Text>
        <Text style={styles.itemDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.primaryLight }}
        thumbColor={value ? colors.primary : colors.bgSecondary}
      />
    </View>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { notificationSettings, setNotificationSetting } = useUserStore();

  return (
    <SafeAreaView style={styles.container}>
      <Header title="알림 설정" onBack={() => router.back()} />

      <View style={styles.content}>
        <NotificationItem
          label="루틴 리마인더"
          description="루틴 실행 시간 알림을 받습니다"
          value={notificationSettings.routine}
          onValueChange={(value) => setNotificationSetting('routine', value)}
        />

        <NotificationItem
          label="커뮤니티 알림"
          description="댓글, 좋아요 등 커뮤니티 활동 알림"
          value={notificationSettings.community}
          onValueChange={(value) => setNotificationSetting('community', value)}
        />

        <NotificationItem
          label="마케팅 알림"
          description="이벤트, 프로모션 등 마케팅 알림"
          value={notificationSettings.marketing}
          onValueChange={(value) => setNotificationSetting('marketing', value)}
        />
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
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemTextContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  itemLabel: {
    ...typography.body1,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  itemDescription: {
    ...typography.body2,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
});
