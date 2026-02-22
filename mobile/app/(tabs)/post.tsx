import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PenSquare, Heart, MessageCircle, Bookmark } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '@/src/theme/tokens';
import { Chip, Avatar } from '@/src/components/common';
import { PostCategory } from '@/src/types';

// ─── Types ──────────────────────────────────────────────

interface PostItem {
  id: string;
  nickname: string;
  avatarFallback: string;
  timeAgo: string;
  category: PostCategory;
  title: string;
  content: string;
  imageColor: string;
  hashtags: string[];
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

interface CategoryTab {
  key: 'all' | PostCategory;
  label: string;
}

// ─── Constants ──────────────────────────────────────────

const CATEGORY_TABS: CategoryTab[] = [
  { key: 'all', label: '전체' },
  { key: 'review', label: '후기' },
  { key: 'daily', label: '일상' },
  { key: 'question', label: '질문' },
  { key: 'tip', label: '꿀팁' },
];

const CATEGORY_EMOJI_MAP: Record<PostCategory, string> = {
  review: '⭐',
  daily: '☀️',
  question: '❓',
  tip: '💡',
};

// ─── Mock Data ──────────────────────────────────────────

const MOCK_POSTS: PostItem[] = [
  {
    id: 'p-1',
    nickname: '루틴마스터',
    avatarFallback: '루',
    timeAgo: '2시간 전',
    category: 'review',
    title: '30일 운동 루틴 2주차 후기!',
    content: '30일 운동 루틴 시작한 지 2주가 지났어요! 확실히 체력이 좋아지고 있는 게 느껴집니다. 매일 꾸준히 하는 게 비결인 것 같아요.',
    imageColor: '#FFE0E0',
    hashtags: ['#운동루틴', '#2주차후기', '#30일챌린지'],
    likeCount: 89,
    commentCount: 23,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: 'p-2',
    nickname: '건강한하루',
    avatarFallback: '건',
    timeAgo: '3시간 전',
    category: 'daily',
    title: '오늘도 미라클모닝 성공 ☀️',
    content: '새벽 5시에 일어나서 요가하고 독서까지! 미라클모닝 루틴 시작한 지 한 달째인데 이제 완전 습관이 됐어요.',
    imageColor: '#FFF3E0',
    hashtags: ['#미라클모닝', '#아침루틴', '#성공'],
    likeCount: 156,
    commentCount: 34,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: 'p-3',
    nickname: '다이어트중',
    avatarFallback: '다',
    timeAgo: '4시간 전',
    category: 'review',
    title: '밀프렙 식단 1주일 완주 🎉',
    content: '일요일에 한 번에 준비하는 밀프렙 식단 루틴, 첫 주를 완주했습니다! 생각보다 쉽고 돈도 절약되네요.',
    imageColor: '#E0FFE0',
    hashtags: ['#밀프렙', '#식단관리', '#1주완주'],
    likeCount: 234,
    commentCount: 56,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: 'p-4',
    nickname: '공부벌레',
    avatarFallback: '공',
    timeAgo: '5시간 전',
    category: 'question',
    title: '정보처리기사 실기 준비 어떻게 하세요?',
    content: '정보처리기사 필기는 합격했는데 실기가 막막합니다. 매일 어떤 루틴으로 공부하고 계신지 공유해주세요!',
    imageColor: '#E0E0FF',
    hashtags: ['#정보처리기사', '#실기준비', '#질문'],
    likeCount: 45,
    commentCount: 67,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: 'p-5',
    nickname: '요가러버',
    avatarFallback: '요',
    timeAgo: '6시간 전',
    category: 'daily',
    title: '아침 요가 루틴 진짜 좋아요',
    content: '매일 아침 20분 요가 루틴 시작한 지 3주째! 몸이 훨씬 유연해지고 하루 종일 기분이 좋아요.',
    imageColor: '#F0E0FF',
    hashtags: ['#아침요가', '#루틴추천', '#일상'],
    likeCount: 312,
    commentCount: 28,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: 'p-6',
    nickname: '영어왕',
    avatarFallback: '영',
    timeAgo: '8시간 전',
    category: 'tip',
    title: '쉐도잉할 때 이 방법 추천해요',
    content: '영어 쉐도잉 루틴을 할 때, 처음에는 0.75배속으로 듣고 따라하다가 점점 속도를 올리면 훨씬 효과적이에요!',
    imageColor: '#E0F0FF',
    hashtags: ['#영어쉐도잉', '#공부팁', '#영어루틴'],
    likeCount: 178,
    commentCount: 45,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: 'p-7',
    nickname: '비건초보',
    avatarFallback: '비',
    timeAgo: '10시간 전',
    category: 'review',
    title: '비건 식단 일주일 도전 중간 후기',
    content: '비건 식단 루틴 도전 중입니다. 생각보다 맛있는 레시피가 많아서 놀랐어요. 다음 주도 화이팅!',
    imageColor: '#E0FFE8',
    hashtags: ['#비건식단', '#도전', '#중간후기'],
    likeCount: 67,
    commentCount: 19,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: 'p-8',
    nickname: '갓생러',
    avatarFallback: '갓',
    timeAgo: '12시간 전',
    category: 'daily',
    title: '새벽 5시 기상 7일째 성공!',
    content: '갓생 살기 프로젝트 일주일차! 새벽에 일어나서 운동, 독서, 영어공부까지. 루틴의 힘을 느끼고 있어요.',
    imageColor: '#FFFDE0',
    hashtags: ['#갓생', '#새벽기상', '#7일성공'],
    likeCount: 198,
    commentCount: 41,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: 'p-9',
    nickname: '토익도전',
    avatarFallback: '토',
    timeAgo: '1일 전',
    category: 'question',
    title: '토익 LC 파트3이 제일 어려워요 ㅠㅠ',
    content: '토익 LC 파트3 대화문이 너무 어려운데, 매일 루틴으로 어떻게 연습하고 계신가요? 좋은 방법이 있으면 공유 부탁드려요.',
    imageColor: '#FFE8E0',
    hashtags: ['#토익', '#LC파트3', '#공부질문'],
    likeCount: 34,
    commentCount: 52,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: 'p-10',
    nickname: '쌍둥이맘팬',
    avatarFallback: '쌍',
    timeAgo: '1일 전',
    category: 'review',
    title: '틈새 운동 루틴 한 달 후기 (육아맘 필독!)',
    content: '아이 낮잠 자는 틈에 10분씩 운동하는 루틴! 한 달 했더니 체력이 확실히 좋아졌어요. 육아맘들 강추합니다.',
    imageColor: '#FFE0F0',
    hashtags: ['#틈새운동', '#육아맘', '#한달후기'],
    likeCount: 267,
    commentCount: 38,
    isLiked: false,
    isBookmarked: false,
  },
];

// ─── Component ──────────────────────────────────────────

export default function PostScreen() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | PostCategory>('all');
  const [posts, setPosts] = useState<PostItem[]>(MOCK_POSTS);

  const filteredPosts =
    selectedCategory === 'all'
      ? posts
      : posts.filter((p) => p.category === selectedCategory);

  const handleWritePress = () => {
    Alert.alert('준비 중입니다', '글쓰기 기능이 곧 추가됩니다.');
  };

  const toggleLike = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isLiked: !post.isLiked,
            likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1,
          };
        }
        return post;
      })
    );
  }, []);

  const toggleBookmark = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return { ...post, isBookmarked: !post.isBookmarked };
        }
        return post;
      })
    );
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>커뮤니티</Text>
        <Pressable
          style={({ pressed }) => [
            pressed && { opacity: 0.7 },
            Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined,
          ]}
          onPress={handleWritePress}
        >
          <PenSquare size={22} color={colors.textPrimary} />
        </Pressable>
      </View>

      {/* Category Tabs */}
      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContent}
        >
          {CATEGORY_TABS.map((tab) => (
            <View key={tab.key} style={styles.chipWrapper}>
              <Chip
                label={tab.label}
                selected={selectedCategory === tab.key}
                onPress={() => setSelectedCategory(tab.key)}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Posts Feed */}
      <ScrollView
        style={styles.feedScroll}
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredPosts.map((post, index) => (
          <React.Fragment key={post.id}>
            {index > 0 && <View style={styles.separator} />}
            <PostCard
              post={post}
              onToggleLike={() => toggleLike(post.id)}
              onToggleBookmark={() => toggleBookmark(post.id)}
            />
          </React.Fragment>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Post Card ──────────────────────────────────────────

interface PostCardProps {
  post: PostItem;
  onToggleLike: () => void;
  onToggleBookmark: () => void;
}

function PostCard({ post, onToggleLike, onToggleBookmark }: PostCardProps) {
  return (
    <View style={styles.postCard}>
      {/* Header */}
      <View style={styles.postHeader}>
        <Avatar size="sm" fallback={post.avatarFallback} />
        <View style={styles.postHeaderText}>
          <Text style={styles.postNickname}>{post.nickname}</Text>
          <Text style={styles.postTime}>{post.timeAgo}</Text>
        </View>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>
            {CATEGORY_EMOJI_MAP[post.category]}{' '}
            {CATEGORY_TABS.find((t) => t.key === post.category)?.label ?? ''}
          </Text>
        </View>
      </View>

      {/* Title & Content */}
      <Text style={styles.postTitle}>{post.title}</Text>
      <Text style={styles.postContent} numberOfLines={3}>
        {post.content}
      </Text>

      {/* Image Placeholder */}
      <View style={[styles.imagePlaceholder, { backgroundColor: post.imageColor }]}>
        <Text style={styles.imageEmoji}>
          {CATEGORY_EMOJI_MAP[post.category]}
        </Text>
      </View>

      {/* Hashtags */}
      <View style={styles.hashtagContainer}>
        {post.hashtags.map((tag) => (
          <Text key={tag} style={styles.hashtag}>
            {tag}
          </Text>
        ))}
      </View>

      {/* Interactions */}
      <View style={styles.interactions}>
        <Pressable
          style={({ pressed }) => [
            styles.interactionButton,
            pressed && { opacity: 0.7 },
            Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined,
          ]}
          onPress={onToggleLike}
        >
          <Heart
            size={18}
            color={post.isLiked ? '#FF4444' : colors.textSecondary}
            fill={post.isLiked ? '#FF4444' : 'none'}
          />
          <Text
            style={[
              styles.interactionCount,
              post.isLiked && styles.interactionCountActive,
            ]}
          >
            {post.likeCount}
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.interactionButton,
            pressed && { opacity: 0.7 },
            Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined,
          ]}
        >
          <MessageCircle size={18} color={colors.textSecondary} />
          <Text style={styles.interactionCount}>{post.commentCount}</Text>
        </Pressable>

        <View style={styles.interactionSpacer} />

        <Pressable
          style={({ pressed }) => [
            styles.interactionButton,
            pressed && { opacity: 0.7 },
            Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined,
          ]}
          onPress={onToggleBookmark}
        >
          <Bookmark
            size={18}
            color={post.isBookmarked ? colors.primary : colors.textSecondary}
            fill={post.isBookmarked ? colors.primary : 'none'}
          />
        </Pressable>
      </View>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
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

  // Category Tabs
  categoryContainer: {
    backgroundColor: colors.bgPrimary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chipWrapper: {
    marginRight: spacing.sm,
  },

  // Feed
  feedScroll: {
    flex: 1,
  },
  feedContent: {
    paddingBottom: spacing.xl,
  },
  separator: {
    height: 8,
    backgroundColor: colors.bgSecondary,
  },

  // Post Card
  postCard: {
    backgroundColor: colors.bgPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  postHeaderText: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  postNickname: {
    fontSize: typography.body2.fontSize,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  postTime: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    color: colors.textTertiary,
    marginTop: 1,
  },
  categoryBadge: {
    backgroundColor: colors.bgSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  categoryBadgeText: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    color: colors.textSecondary,
  },

  // Post Content
  postTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  postContent: {
    fontSize: typography.body1.fontSize,
    fontWeight: typography.body1.fontWeight,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },

  // Image Placeholder
  imagePlaceholder: {
    height: 200,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  imageEmoji: {
    fontSize: 48,
  },

  // Hashtags
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
  },
  hashtag: {
    fontSize: typography.body2.fontSize,
    fontWeight: typography.body2.fontWeight,
    color: '#3B82F6',
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
  },

  // Interactions
  interactions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  interactionCount: {
    fontSize: typography.body2.fontSize,
    fontWeight: typography.body2.fontWeight,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  interactionCountActive: {
    color: '#FF4444',
  },
  interactionSpacer: {
    flex: 1,
  },
});
