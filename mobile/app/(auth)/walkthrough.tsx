import { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/src/components/common';
import { colors, typography, spacing } from '@/src/theme/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SlideData {
  emoji: string;
  title: string;
  subtitle: string;
}

const slides: SlideData[] = [
  {
    emoji: '\u{1F3C3}\u200D\u2642\uFE0F',
    title: '전문가가 만든 루틴으로 시작하세요',
    subtitle: '검증된 전문가의 루틴을 내 일정에 바로 추가',
  },
  {
    emoji: '\u2705',
    title: '매일 체크하며 나를 바꿔보세요',
    subtitle: '투두리스트로 매일 실천하고 성장을 기록',
  },
  {
    emoji: '\u{1F465}',
    title: '함께하면 더 재미있어요',
    subtitle: '커뮤니티에서 인증하고 함께 성장',
  },
];

export default function WalkthroughScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / SCREEN_WIDTH);
    setCurrentPage(page);
  };

  const goToLogin = () => {
    router.replace('/(auth)/login');
  };

  const handleNext = () => {
    if (currentPage < slides.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: (currentPage + 1) * SCREEN_WIDTH,
        animated: true,
      });
    } else {
      goToLogin();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip button */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Pressable
          onPress={goToLogin}
          style={({ pressed }) => [
            styles.skipButton,
            pressed && { opacity: 0.7 },
            Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined,
          ]}
        >
          <Text style={styles.skipText}>건너뛰기</Text>
        </Pressable>
      </View>

      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        bounces={false}
        style={styles.scrollView}
      >
        {slides.map((slide, index) => (
          <View key={index} style={styles.slide}>
            <Text style={styles.slideEmoji}>{slide.emoji}</Text>
            <Text style={styles.slideTitle}>{slide.title}</Text>
            <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Page indicators */}
      <View style={styles.indicatorContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentPage === index
                ? styles.indicatorActive
                : styles.indicatorInactive,
            ]}
          />
        ))}
      </View>

      {/* Next/Start button */}
      <View style={styles.buttonContainer}>
        <Button
          title={currentPage === slides.length - 1 ? '시작하기' : '다음'}
          onPress={handleNext}
          size="lg"
          fullWidth
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerSpacer: {
    width: 60,
  },
  skipButton: {
    padding: spacing.xs,
  },
  skipText: {
    ...typography.body1,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  slideEmoji: {
    fontSize: 80,
    marginBottom: spacing.xxl,
  },
  slideTitle: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  slideSubtitle: {
    ...typography.body1,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  indicatorInactive: {
    backgroundColor: colors.textTertiary,
  },
  buttonContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
});
