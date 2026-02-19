import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, ChevronRight, Lock } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '@/src/theme/tokens';
import { Avatar } from '@/src/components/common';

// ─── Types ──────────────────────────────────────────────

interface BadgeItem {
  id: string;
  emoji: string;
  name: string;
  earned: boolean;
}

interface RankingUser {
  id: string;
  rank: number;
  nickname: string;
  avatarFallback: string;
  completedTodos: number;
  isMe: boolean;
}

interface ChallengeItem {
  id: string;
  title: string;
  emoji: string;
  participants: number;
  progress: number;
  daysLeft: number;
}

// ─── Mock Data ──────────────────────────────────────────

const MOCK_BADGES: BadgeItem[] = [
  { id: 'b-1', emoji: '🌅', name: '얼리버드', earned: true },
  { id: 'b-2', emoji: '💪', name: '운동왕', earned: true },
  { id: 'b-3', emoji: '🔥', name: '7일 스트릭', earned: true },
  { id: 'b-4', emoji: '📚', name: '독서광', earned: true },
  { id: 'b-5', emoji: '🥇', name: '첫 루틴 완료', earned: true },
  { id: 'b-6', emoji: '❓', name: '???', earned: false },
  { id: 'b-7', emoji: '❓', name: '???', earned: false },
  { id: 'b-8', emoji: '❓', name: '???', earned: false },
];

const MOCK_RANKINGS: RankingUser[] = [
  { id: 'r-1', rank: 1, nickname: '루틴킹민서', avatarFallback: '민', completedTodos: 47, isMe: false },
  { id: 'r-2', rank: 2, nickname: '갓생러지호', avatarFallback: '지', completedTodos: 43, isMe: false },
  { id: 'r-3', rank: 3, nickname: '지우', avatarFallback: '지', completedTodos: 38, isMe: true },
  { id: 'r-4', rank: 4, nickname: '서연', avatarFallback: '서', completedTodos: 35, isMe: false },
  { id: 'r-5', rank: 5, nickname: '도윤', avatarFallback: '도', completedTodos: 31, isMe: false },
];

const MOCK_CHALLENGES: ChallengeItem[] = [
  {
    id: 'c-1',
    title: '21일 미라클 모닝 챌린지',
    emoji: '🌅',
    participants: 1284,
    progress: 62,
    daysLeft: 8,
  },
  {
    id: 'c-2',
    title: '30일 독서 챌린지',
    emoji: '📖',
    participants: 892,
    progress: 40,
    daysLeft: 18,
  },
];

// ─── Constants ──────────────────────────────────────────

const RANK_MEDAL: Record<number, string> = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

// ─── Component ──────────────────────────────────────────

export default function RewardScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>REWARD</Text>
        <Trophy size={22} color={colors.primary} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <SummaryStat label="완료 루틴" value="2개" />
            <View style={styles.summaryDivider} />
            <SummaryStat label="연속 달성" value="14일" />
            <View style={styles.summaryDivider} />
            <SummaryStat label="획득 배지" value="5개" />
          </View>
        </View>

        {/* Badge Collection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>내 배지</Text>
            <Pressable
              style={({ pressed }) => [
                styles.seeAllButton,
                pressed && { opacity: 0.7 },
                Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined,
              ]}
            >
              <Text style={styles.seeAllText}>전체보기</Text>
              <ChevronRight size={14} color={colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.badgeScrollContent}
          >
            {MOCK_BADGES.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </ScrollView>
        </View>

        {/* Weekly Ranking */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>이번 주 랭킹</Text>
          </View>

          <View style={styles.rankingList}>
            {MOCK_RANKINGS.map((user) => (
              <RankingRow key={user.id} user={user} />
            ))}
          </View>
        </View>

        {/* Challenges */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>진행 중 챌린지</Text>
          </View>

          {MOCK_CHALLENGES.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </View>

        {/* Bottom spacer */}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Summary Stat ───────────────────────────────────────

interface SummaryStatProps {
  label: string;
  value: string;
}

function SummaryStat({ label, value }: SummaryStatProps) {
  return (
    <View style={styles.summaryStatItem}>
      <Text style={styles.summaryStatValue}>{value}</Text>
      <Text style={styles.summaryStatLabel}>{label}</Text>
    </View>
  );
}

// ─── Badge Card ─────────────────────────────────────────

interface BadgeCardProps {
  badge: BadgeItem;
}

function BadgeCard({ badge }: BadgeCardProps) {
  return (
    <View style={styles.badgeCard}>
      <View
        style={[
          styles.badgeCircle,
          badge.earned ? styles.badgeEarned : styles.badgeLocked,
        ]}
      >
        {badge.earned ? (
          <Text style={styles.badgeEmoji}>{badge.emoji}</Text>
        ) : (
          <Lock size={20} color={colors.textTertiary} />
        )}
      </View>
      <Text
        style={[
          styles.badgeName,
          !badge.earned && styles.badgeNameLocked,
        ]}
        numberOfLines={1}
      >
        {badge.name}
      </Text>
    </View>
  );
}

// ─── Ranking Row ────────────────────────────────────────

interface RankingRowProps {
  user: RankingUser;
}

function RankingRow({ user }: RankingRowProps) {
  const medal = RANK_MEDAL[user.rank];

  return (
    <View
      style={[
        styles.rankingRow,
        user.isMe && styles.rankingRowMe,
      ]}
    >
      <View style={styles.rankingLeft}>
        {medal ? (
          <Text style={styles.rankMedal}>{medal}</Text>
        ) : (
          <Text style={styles.rankNumber}>{user.rank}</Text>
        )}
        <Avatar size="sm" fallback={user.avatarFallback} />
        <View style={styles.rankingInfo}>
          <Text style={[styles.rankingNickname, user.isMe && styles.rankingNicknameMe]}>
            {user.nickname}
          </Text>
          {user.isMe && <Text style={styles.rankingMeLabel}>나</Text>}
        </View>
      </View>
      <Text style={[styles.rankingScore, user.isMe && styles.rankingScoreMe]}>
        {user.completedTodos}개 완료
      </Text>
    </View>
  );
}

// ─── Challenge Card ─────────────────────────────────────

interface ChallengeCardProps {
  challenge: ChallengeItem;
}

function ChallengeCard({ challenge }: ChallengeCardProps) {
  return (
    <View style={styles.challengeCard}>
      <View style={styles.challengeHeader}>
        <Text style={styles.challengeEmoji}>{challenge.emoji}</Text>
        <View style={styles.challengeTitleArea}>
          <Text style={styles.challengeTitle}>{challenge.title}</Text>
          <Text style={styles.challengeParticipants}>
            {challenge.participants.toLocaleString()}명 참여 중
          </Text>
        </View>
        <View style={styles.challengeDaysLeft}>
          <Text style={styles.challengeDaysText}>D-{challenge.daysLeft}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.challengeProgressContainer}>
        <View style={styles.challengeProgressBg}>
          <View
            style={[
              styles.challengeProgressFill,
              { width: `${challenge.progress}%` },
            ]}
          />
        </View>
        <Text style={styles.challengeProgressText}>{challenge.progress}%</Text>
      </View>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgSecondary,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.bgPrimary,
  },
  headerTitle: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
    color: colors.textPrimary,
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.md,
  },

  // Summary Card
  summaryCard: {
    marginHorizontal: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  summaryStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryStatValue: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
    color: colors.textWhite,
  },
  summaryStatLabel: {
    fontSize: typography.body2.fontSize,
    fontWeight: typography.body2.fontWeight,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: spacing.xs,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },

  // Section
  section: {
    marginTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    color: colors.textPrimary,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: typography.body2.fontSize,
    fontWeight: typography.body2.fontWeight,
    color: colors.textSecondary,
  },

  // Badge
  badgeScrollContent: {
    paddingHorizontal: spacing.md,
  },
  badgeCard: {
    alignItems: 'center',
    marginRight: spacing.md,
    width: 72,
  },
  badgeCircle: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  badgeEarned: {
    backgroundColor: colors.primaryLight,
  },
  badgeLocked: {
    backgroundColor: colors.bgSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeEmoji: {
    fontSize: 28,
  },
  badgeName: {
    fontSize: typography.caption.fontSize,
    fontWeight: '500',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  badgeNameLocked: {
    color: colors.textTertiary,
  },

  // Ranking
  rankingList: {
    marginHorizontal: spacing.md,
    backgroundColor: colors.bgPrimary,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  rankingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rankingRowMe: {
    backgroundColor: colors.primaryLight,
  },
  rankingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankMedal: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
    marginRight: spacing.sm,
  },
  rankNumber: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.textSecondary,
    width: 28,
    textAlign: 'center',
    marginRight: spacing.sm,
  },
  rankingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  rankingNickname: {
    fontSize: typography.body1.fontSize,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  rankingNicknameMe: {
    fontWeight: '700',
    color: colors.primary,
  },
  rankingMeLabel: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    color: colors.primary,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 1,
    borderRadius: borderRadius.full,
    marginLeft: spacing.xs,
    overflow: 'hidden',
  },
  rankingScore: {
    fontSize: typography.body2.fontSize,
    fontWeight: typography.body2.fontWeight,
    color: colors.textSecondary,
  },
  rankingScoreMe: {
    fontWeight: '600',
    color: colors.primary,
  },

  // Challenge
  challengeCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.bgPrimary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  challengeEmoji: {
    fontSize: 32,
    marginRight: spacing.sm,
  },
  challengeTitleArea: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.textPrimary,
  },
  challengeParticipants: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    color: colors.textSecondary,
    marginTop: 2,
  },
  challengeDaysLeft: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  challengeDaysText: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    color: colors.primary,
  },
  challengeProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  challengeProgressBg: {
    flex: 1,
    height: 8,
    backgroundColor: colors.bgSecondary,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: spacing.sm,
  },
  challengeProgressFill: {
    height: 8,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  challengeProgressText: {
    fontSize: typography.body2.fontSize,
    fontWeight: '600',
    color: colors.primary,
    width: 38,
    textAlign: 'right',
  },
});
