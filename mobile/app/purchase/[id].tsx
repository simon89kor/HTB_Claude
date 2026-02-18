import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CreditCard, Wallet } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '@/src/theme/tokens';
import { Header, Button, Divider, Checkbox } from '@/src/components/common';
import { usePurchaseStore } from '@/src/stores/purchaseStore';
import { formatCurrency, periodLabel } from '@/src/utils/format';

const paymentMethods = [
  { key: 'card', label: '신용/체크카드', iconType: 'card' as const },
  { key: 'kakao', label: '카카오페이', iconType: 'wallet' as const },
  { key: 'naver', label: '네이버페이', iconType: 'wallet' as const },
  { key: 'toss', label: '토스페이', iconType: 'wallet' as const },
];

const paymentIconColors: Record<string, string> = {
  card: colors.textSecondary,
  kakao: '#FEE500',
  naver: '#03C75A',
  toss: '#0064FF',
};

export default function PurchaseScreen() {
  const router = useRouter();
  const {
    selectedRoutine,
    selectedPeriod,
    selectedPaymentMethod,
    isAgreed,
    isProcessing,
    setPaymentMethod,
    setAgreed,
    processPurchase,
    reset,
  } = usePurchaseStore();

  const [localAgreed, setLocalAgreed] = useState(false);

  if (!selectedRoutine || !selectedPeriod) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="결제하기" onBack={() => router.back()} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>결제 정보를 불러올 수 없습니다</Text>
        </View>
      </SafeAreaView>
    );
  }

  const providerName = selectedRoutine.provider?.nickname ?? '전문가';

  const priceMap = {
    '1week': selectedRoutine.price1week,
    '4week': selectedRoutine.price4week,
    '100days': selectedRoutine.price100days,
  } as const;

  const totalPrice = priceMap[selectedPeriod];

  const handlePayment = async () => {
    if (!localAgreed) {
      Alert.alert('알림', '결제 동의를 체크해주세요.');
      return;
    }

    setAgreed(true);
    const success = await processPurchase();

    if (success) {
      Alert.alert(
        '결제 완료',
        '결제가 완료되었습니다!\n구매한 루틴은 MY 탭에서 확인할 수 있습니다.',
        [
          {
            text: '확인',
            onPress: () => {
              reset();
              router.dismissAll();
              router.replace('/(tabs)');
            },
          },
        ]
      );
    } else {
      Alert.alert('결제 실패', '결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const renderPaymentIcon = (iconType: 'card' | 'wallet', methodKey: string) => {
    const iconColor = paymentIconColors[methodKey] ?? colors.textSecondary;
    if (iconType === 'card') {
      return <CreditCard size={20} color={iconColor} />;
    }
    return <Wallet size={20} color={iconColor} />;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="결제하기" onBack={() => router.back()} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Order Summary Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>주문 내역</Text>
          <Divider spacing={spacing.sm} />

          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>루틴</Text>
            <Text style={styles.orderValue} numberOfLines={2}>
              {selectedRoutine.title}
            </Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>제공자</Text>
            <Text style={styles.orderValue}>{providerName}</Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>이용 기간</Text>
            <Text style={styles.orderValue}>{periodLabel(selectedPeriod)}</Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>금액</Text>
            <Text style={styles.orderValue}>{formatCurrency(totalPrice)}</Text>
          </View>

          <Divider spacing={spacing.md} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>총 결제 금액</Text>
            <Text style={styles.totalPrice}>{formatCurrency(totalPrice)}</Text>
          </View>
        </View>

        {/* Payment Method Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>결제 수단</Text>
          <Divider spacing={spacing.sm} />

          <View style={styles.paymentMethods}>
            {paymentMethods.map((method) => {
              const isSelected = selectedPaymentMethod === method.key;
              return (
                <TouchableOpacity
                  key={method.key}
                  style={[
                    styles.paymentMethod,
                    isSelected && styles.paymentMethodSelected,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => setPaymentMethod(method.key)}
                >
                  <View style={styles.paymentMethodLeft}>
                    <View
                      style={[
                        styles.radioOuter,
                        isSelected && styles.radioOuterSelected,
                      ]}
                    >
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                    <View style={styles.paymentIconWrapper}>
                      {renderPaymentIcon(method.iconType, method.key)}
                    </View>
                    <Text
                      style={[
                        styles.paymentMethodLabel,
                        isSelected && styles.paymentMethodLabelSelected,
                      ]}
                    >
                      {method.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Agreement */}
        <View style={styles.agreementSection}>
          <Checkbox
            checked={localAgreed}
            onToggle={() => setLocalAgreed(!localAgreed)}
            label="주문 내용을 확인하였으며, 결제에 동의합니다"
          />
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <Button
          title={`${formatCurrency(totalPrice)} 결제하기`}
          onPress={handlePayment}
          size="lg"
          fullWidth
          loading={isProcessing}
          disabled={!localAgreed}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.body1.fontSize,
    fontWeight: typography.body1.fontWeight,
    color: colors.textSecondary,
  },

  // Card
  card: {
    backgroundColor: colors.bgPrimary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    color: colors.textPrimary,
  },

  // Order Summary
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  orderLabel: {
    fontSize: typography.body1.fontSize,
    fontWeight: typography.body1.fontWeight,
    color: colors.textSecondary,
    flex: 1,
  },
  orderValue: {
    fontSize: typography.body1.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.textPrimary,
    flex: 2,
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    color: colors.textPrimary,
  },
  totalPrice: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
    color: colors.primary,
  },

  // Payment Methods
  paymentMethods: {
    gap: spacing.sm,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
  },
  paymentMethodSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  paymentIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentMethodLabel: {
    fontSize: typography.body1.fontSize,
    fontWeight: typography.body1.fontWeight,
    color: colors.textPrimary,
  },
  paymentMethodLabelSelected: {
    fontWeight: typography.h3.fontWeight,
    color: colors.primaryDark,
  },

  // Agreement
  agreementSection: {
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.md,
  },

  // Bottom
  bottomSpacer: {
    height: 80,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.bgPrimary,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingBottom: spacing.lg,
  },
});
