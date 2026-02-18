import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
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
  imageEmoji: string;
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
  { key: 'review', label: '리뷰' },
  { key: 'daily', label: '일상' },
  { key: 'question', label: '질문' },
  { key: 'tip', label: '팁' },
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
    nickname: '러닝하는서연',
    avatarFallback: '서',
    timeAgo: '2시간 전',
    category: 'review',
    title: '아침 기상 루틴 2주차 후기',
    content: '매일 6시 반에 일어나는 게 습관이 되어가고 있어요! 처음엔 힘들었는데 이제 알람 없이도 눈이 떠져요.',
    imageEmoji: '🌅',
    hashtags: ['#미라클모닝', '#루틴후기', '#아침기상'],
    likeCount: 42,
    commentCount: 12,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: 'p-2',
    nickname: '헬린이민준',
    avatarFallback: '민',
    timeAgo: '3시간 전',
    category: 'daily',
    title: '오늘의 홈트 기록',
    content: '스쿼트 50개 달성! 처음엔 20개도 힘들었는데 한 달 만에 여기까지 왔네요 💪',
    imageEmoji: '💪',
    hashtags: ['#홈트레이닝', '#운동일상', '#스쿼트챌린지'],
    likeCount: 89,
    commentCount: 24,
    isLiked: true,
    isBookmarked: false,
  },
  {
    id: 'p-3',
    nickname: '공부하는하은',
    avatarFallback: '하',
    timeAgo: '5시간 전',
    category: 'question',
    title: '영어 독해 루틴 추천해주세요',
    content: '토익 읽기 점수를 올리고 싶은데 매일 할 수 있는 좋은 영어 독해 루틴이 있을까요? 현재 700점대입니다.',
    imageEmoji: '📚',
    hashtags: ['#영어공부', '#토익', '#루틴추천'],
    likeCount: 15,
    commentCount: 31,
    isLiked: false,
    isBookmarked: true,
  },
  {
    id: 'p-4',
    nickname: '다이어터영희',
    avatarFallback: '영',
    timeAgo: '6시간 전',
    category: 'tip',
    title: '클린 식단 일주일 꿀팁',
    content: '일요일에 일주일치 식단을 미리 준비하면 훨씬 수월해요. 닭가슴살은 한 번에 구워서 냉동 보관!',
    imageEmoji: '🥗',
    hashtags: ['#클린식단', '#식단관리팁', '#밀프렙'],
    likeCount: 156,
    commentCount: 45,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: 'p-5',
    nickname: '도윤',
    avatarFallback: '도',
    timeAgo: '8시간 전',
    category: 'review',
    title: '30일 독서 챌린지 완주 후기',
    content: '한 달 동안 매일 30분씩 읽었더니 4권을 완독했어요. 루틴의 힘을 제대로 느낀 한 달이었습니다.',
    imageEmoji: '📖',
    hashtags: ['#독서챌린지', '#30일챌린지', '#완주후기'],
    likeCount: 203,
    commentCount: 38,
    isLiked: true,
    isBookmarked: true,
  },
  {
    id: 'p-6',
    nickname: '요가러버수아',
    avatarFallback: '수',
    timeAgo: '10시간 전',
    category: 'daily',
    title: '아침 요가 10분의 기적',
    content: '출근 전 10분 요가로 하루가 완전 달라졌어요. 몸도 가볍고 집중력도 올라간 느낌!',
    imageEmoji: '🧘',
    hashtags: ['#아침요가', '#10분루틴', '#일상기록'],
    likeCount: 67,
    commentCount: 8,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: 'p-7',
    nickname: '자격증마스터',
    avatarFallback: '자',
    timeAgo: '12시간 전',
    category: 'tip',
    title: '정보처리기사 합격 루틴 공유',
    content: '매일 2시간씩 3개월 루틴으로 필기 합격했습니다. 오전 1시간 이론, 오후 1시간 기출 풀이가 핵심이에요.',
    imageEmoji: '📝',
    hashtags: ['#정보처리기사', '#자격증공부', '#합격루틴'],
    likeCount: 312,
    commentCount: 67,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: 'p-8',
    nickname: '건강한예준',
    avatarFallback: '예',
    timeAgo: '1일 전',
    category: 'question',
    title: '운동 루틴 중 쉬는 날은 어떻게?',
    content: '주 5일 운동 루틴을 하고 있는데 쉬는 날에도 가벼운 활동을 해야 할까요? 완전 휴식이 좋은지 궁금합니다.',
    imageEmoji: '🤔',
    hashtags: ['#운동질문', '#휴식일', '#운동루틴'],
    likeCount: 28,
    commentCount: 19,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: 'p-9',
    nickname: '지우',
    avatarFallback: '지',
    timeAgo: '1일 전',
    category: 'review',
    title: '피부관리 루틴 한 달 후기',
    content: '아침저녁 스킨케어 루틴을 꾸준히 했더니 피부 톤이 확실히 밝아졌어요. 루틴이 진짜 중요하네요!',
    imageEmoji: '✨',
    hashtags: ['#피부관리', '#스킨케어루틴', '#한달후기'],
    likeCount: 94,
    commentCount: 22,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: 'p-10',
    nickname: '시우',
    avatarFallback: '시',
    timeAgo: '2일 전',
    category: 'daily',
    title: '새벽 5시 기상 7일째',
    content: '미라클 모닝 루틴 시작한 지 일주일. 확실히 하루가 길어진 느낌이에요. 아침에 운동하고 독서까지!',
    imageEmoji: '⏰',
    hashtags: ['#새벽기상', '#미라클모닝', '#7일차'],
    likeCount: 135,
    commentCount: 41,
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

  const renderPost = ({ item }: { item: PostItem }) => (
    <PostCard
      post={item}
      onToggleLike={() => toggleLike(item.id)}
      onToggleBookmark={() => toggleBookmark(item.id)}
    />
  );

  const keyExtractor = (item: PostItem) => item.id;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>커뮤니티</Text>
        <TouchableOpacity onPress={handleWritePress} activeOpacity={0.7}>
          <PenSquare size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Category Tabs */}
      <View style={styles.categoryContainer}>
        <FlatList
          data={CATEGORY_TABS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.categoryContent}
          renderItem={({ item }) => (
            <View style={styles.chipWrapper}>
              <Chip
                label={item.label}
                selected={selectedCategory === item.key}
                onPress={() => setSelectedCategory(item.key)}
              />
            </View>
          )}
        />
      </View>

      {/* Posts Feed */}
      <FlatList
        data={filteredPosts}
        renderItem={renderPost}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={PostSeparator}
      />
    </SafeAreaView>
  );
}

// ─── Post Separator ─────────────────────────────────────

function PostSeparator() {
  return <View style={styles.separator} />;
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
      <View style={styles.imagePlaceholder}>
        <Text style={styles.imageEmoji}>{post.imageEmoji}</Text>
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
        <TouchableOpacity
          style={styles.interactionButton}
          onPress={onToggleLike}
          activeOpacity={0.7}
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
        </TouchableOpacity>

        <TouchableOpacity style={styles.interactionButton} activeOpacity={0.7}>
          <MessageCircle size={18} color={colors.textSecondary} />
          <Text style={styles.interactionCount}>{post.commentCount}</Text>
        </TouchableOpacity>

        <View style={styles.interactionSpacer} />

        <TouchableOpacity
          style={styles.interactionButton}
          onPress={onToggleBookmark}
          activeOpacity={0.7}
        >
          <Bookmark
            size={18}
            color={post.isBookmarked ? colors.primary : colors.textSecondary}
            fill={post.isBookmarked ? colors.primary : 'none'}
          />
        </TouchableOpacity>
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
    backgroundColor: colors.bgSecondary,
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
