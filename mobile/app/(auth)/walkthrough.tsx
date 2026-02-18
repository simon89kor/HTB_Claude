import { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BookOpen, CheckSquare, Users } from 'lucide-react-native';
import { Button } from '@/src/components/common';
import { colors, typography, spacing } from '@/src/theme/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SlideData {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const slides: SlideData[] = [
  {
    icon: <BookOpen size={120} color={colors.primary} strokeWidth={1.5} />,
    title: '전문가의 루틴으로 시작하세요',
    description: '검증된 전문가들이 만든 맞춤 루틴으로\n당신의 일상을 변화시켜 보세요',
  },
  {
    icon: <CheckSquare size={120} color={colors.primary} strokeWidth={1.5} />,
    title: '매일 체크하며 성장하세요',
    description: '할 일을 하나씩 완료하며\n작은 성취감을 쌓아가세요',
  },
  {
    icon: <Users size={120} color={colors.primary} strokeWidth={1.5} />,
    title: '함께하면 더 즐거워요',
    description: '커뮤니티에서 경험을 나누고\n서로 응원하며 함께 성장하세요',
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
        <TouchableOpacity onPress={goToLogin} activeOpacity={0.7}>
          <Text style={styles.skipText}>건너뛰기</Text>
        </TouchableOpacity>
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
            <View style={styles.iconContainer}>{slide.icon}</View>
            <Text style={styles.slideTitle}>{slide.title}</Text>
            <Text style={styles.slideDescription}>{slide.description}</Text>
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
  iconContainer: {
    marginBottom: spacing.xxl,
  },
  slideTitle: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  slideDescription: {
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
    backgroundColor: colors.border,
  },
  buttonContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
});
