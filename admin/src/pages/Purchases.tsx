import React, { useState, useEffect, useCallback } from 'react';
import { CreditCard } from 'lucide-react';
import { apiClient } from '../api/client';
import type { Purchase, PaginatedResponse } from '../types';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Pagination from '../components/ui/Pagination';
import SearchInput from '../components/ui/SearchInput';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [periodFilter, setPeriodFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [refundModal, setRefundModal] = useState<Purchase | null>(null);
  const [refunding, setRefunding] = useState(false);
  const limit = 20;

  const loadPurchases = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<PaginatedResponse<Purchase>>('/purchases', {
        page,
        limit,
        search: search || undefined,
        status: statusFilter || undefined,
        period: periodFilter || undefined,
      });
      setPurchases(data.data);
      setTotal(data.total);
    } catch {
      setPurchases([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, periodFilter]);

  useEffect(() => {
    loadPurchases();
  }, [loadPurchases]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleRefund = async () => {
    if (!refundModal) return;
    setRefunding(true);
    try {
      await apiClient.put(`/purchases/${refundModal.id}/refund`);
      setPurchases((prev) =>
        prev.map((p) =>
          p.id === refundModal.id ? { ...p, status: 'refunded' as const } : p
        )
      );
      setRefundModal(null);
    } catch {
      // error
    } finally {
      setRefunding(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('ko-KR');
  };

  const statusBadge = (status: Purchase['status']) => {
    const map = {
      pending: { variant: 'warning' as const, label: '대기중' },
      completed: { variant: 'success' as const, label: '완료' },
      refunded: { variant: 'error' as const, label: '환불' },
    };
    const info = map[status];
    return <Badge variant={info.variant}>{info.label}</Badge>;
  };

  const periodLabel = (period: Purchase['period']) => {
    const map = { '1week': '1주', '4week': '4주', '100days': '100일' };
    return map[period];
  };

  const columns = [
    {
      key: 'user_nickname',
      header: '사용자',
      render: (p: Purchase) => (
        <span className="font-medium">{p.user_nickname || p.user_id.slice(0, 8)}</span>
      ),
    },
    {
      key: 'routine_title',
      header: '루틴',
      render: (p: Purchase) => (
        <span className="truncate max-w-[200px] block">
          {p.routine_title || p.routine_id.slice(0, 8)}
        </span>
      ),
    },
    {
      key: 'period',
      header: '기간',
      render: (p: Purchase) => periodLabel(p.period),
    },
    {
      key: 'amount',
      header: '금액',
      render: (p: Purchase) => (
        <span className="font-medium">{formatCurrency(p.amount)}</span>
      ),
    },
    {
      key: 'payment_method',
      header: '결제수단',
      render: (p: Purchase) => p.payment_method || '-',
    },
    {
      key: 'status',
      header: '상태',
      render: (p: Purchase) => statusBadge(p.status),
    },
    {
      key: 'created_at',
      header: '구매일',
      render: (p: Purchase) => formatDate(p.created_at),
    },
    {
      key: 'actions',
      header: '',
      render: (p: Purchase) =>
        p.status === 'completed' ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setRefundModal(p);
            }}
          >
            환불
          </Button>
        ) : null,
    },
  ];

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput
          value={search}
          onSearch={handleSearch}
          placeholder="사용자 또는 루틴 검색..."
          className="w-full sm:w-80"
        />
        <Select
          options={[
            { value: 'pending', label: '대기중' },
            { value: 'completed', label: '완료' },
            { value: 'refunded', label: '환불' },
          ]}
          placeholder="전체 상태"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="w-full sm:w-36"
        />
        <Select
          options={[
            { value: '1week', label: '1주' },
            { value: '4week', label: '4주' },
            { value: '100days', label: '100일' },
          ]}
          placeholder="전체 기간"
          value={periodFilter}
          onChange={(e) => {
            setPeriodFilter(e.target.value);
            setPage(1);
          }}
          className="w-full sm:w-36"
        />
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-500">
        총 <span className="font-semibold text-gray-700">{total.toLocaleString()}</span>건
      </div>

      {/* Table */}
      {!loading && purchases.length === 0 && !search && !statusFilter && !periodFilter ? (
        <EmptyState
          icon={<CreditCard className="w-8 h-8" />}
          title="구매 내역이 없습니다"
          description="아직 구매 내역이 없습니다."
        />
      ) : (
        <Table
          columns={columns}
          data={purchases}
          loading={loading}
          rowKey={(p) => p.id}
        />
      )}

      {/* Pagination */}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Refund Modal */}
      <Modal
        isOpen={!!refundModal}
        onClose={() => setRefundModal(null)}
        title="환불 처리"
        actions={
          <>
            <Button variant="secondary" onClick={() => setRefundModal(null)}>
              취소
            </Button>
            <Button variant="danger" onClick={handleRefund} loading={refunding}>
              환불 처리
            </Button>
          </>
        }
      >
        {refundModal && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              다음 구매 건을 환불 처리하시겠습니까?
            </p>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">사용자</span>
                <span className="font-medium">
                  {refundModal.user_nickname || refundModal.user_id.slice(0, 8)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">루틴</span>
                <span className="font-medium">
                  {refundModal.routine_title || refundModal.routine_id.slice(0, 8)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">금액</span>
                <span className="font-medium text-red-600">
                  {formatCurrency(refundModal.amount)}
                </span>
              </div>
            </div>
            <p className="text-xs text-red-500">
              이 작업은 되돌릴 수 없습니다.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
