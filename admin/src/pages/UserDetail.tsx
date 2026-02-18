import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Calendar,
  User as UserIcon,
  ShoppingBag,
  DollarSign,
  Activity,
} from 'lucide-react';
import { apiClient } from '../api/client';
import type { User, Purchase } from '../types';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Modal from '../components/ui/Modal';
import Select from '../components/ui/Select';
import StatCard from '../components/ui/StatCard';

interface UserDetailData {
  user: User;
  purchases: Purchase[];
  stats: {
    totalPurchases: number;
    totalSpent: number;
    activeRoutines: number;
  };
}

const STATUS_LABEL: Record<string, string> = {
  active: '활성',
  suspended: '정지',
  banned: '차단',
};

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'error'> = {
  active: 'success',
  suspended: 'warning',
  banned: 'error',
};

const PURCHASE_STATUS_VARIANT: Record<string, 'success' | 'warning' | 'error'> = {
  pending: 'warning',
  completed: 'success',
  refunded: 'error',
};

const PURCHASE_STATUS_LABEL: Record<string, string> = {
  pending: '대기중',
  completed: '완료',
  refunded: '환불',
};

const PERIOD_LABEL: Record<string, string> = {
  '1week': '1주',
  '4week': '4주',
  '100days': '100일',
};

const CATEGORY_LABEL: Record<string, string> = {
  exercise: '운동',
  diet: '식단관리',
  selfdev: '자기계발',
  cert: '자격증',
  study: '학업',
};

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<UserDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusModal, setStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) loadUser(id);
  }, [id]);

  const loadUser = async (userId: string) => {
    setLoading(true);
    try {
      const result = await apiClient.get<UserDetailData>(`/users/${userId}`);
      setData(result);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (!id || !newStatus) return;
    setSaving(true);
    try {
      await apiClient.put(`/users/${id}/status`, { status: newStatus });
      setData((prev) =>
        prev
          ? {
              ...prev,
              user: { ...prev.user, status: newStatus as User['status'] },
            }
          : null
      );
      setStatusModal(false);
    } catch {
      // error
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const purchaseColumns = [
    {
      key: 'routine_title',
      header: '루틴',
      render: (p: Purchase) => (
        <span className="font-medium">{p.routine_title || p.routine_id.slice(0, 8)}</span>
      ),
    },
    {
      key: 'period',
      header: '기간',
      render: (p: Purchase) => PERIOD_LABEL[p.period] || p.period,
    },
    {
      key: 'amount',
      header: '금액',
      render: (p: Purchase) => (
        <span className="font-medium">{formatCurrency(p.amount)}</span>
      ),
    },
    {
      key: 'status',
      header: '상태',
      render: (p: Purchase) => (
        <Badge variant={PURCHASE_STATUS_VARIANT[p.status]}>
          {PURCHASE_STATUS_LABEL[p.status]}
        </Badge>
      ),
    },
    {
      key: 'payment_method',
      header: '결제방법',
      render: (p: Purchase) => p.payment_method || '-',
    },
    {
      key: 'started_at',
      header: '시작일',
      render: (p: Purchase) => formatDate(p.started_at),
    },
    {
      key: 'ends_at',
      header: '종료일',
      render: (p: Purchase) => formatDate(p.ends_at),
    },
    {
      key: 'created_at',
      header: '구매일',
      render: (p: Purchase) => formatDate(p.created_at),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4" />
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="h-20 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">사용자를 찾을 수 없습니다.</p>
        <Button variant="ghost" onClick={() => navigate('/users')} className="mt-4">
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  const { user, purchases, stats } = data;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/users')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        사용자 목록
      </button>

      {/* User Profile Card */}
      <Card>
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500 shrink-0">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt=""
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              user.nickname?.charAt(0) || '?'
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-gray-900">{user.nickname}</h2>
              <Badge variant={STATUS_VARIANT[user.status]}>
                {STATUS_LABEL[user.status]}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <Mail className="w-4 h-4" />
                {user.email}
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar className="w-4 h-4" />
                가입일: {formatDate(user.created_at)}
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <UserIcon className="w-4 h-4" />
                성별:{' '}
                {user.gender === 'male'
                  ? '남성'
                  : user.gender === 'female'
                  ? '여성'
                  : '미설정'}
              </div>
              {user.birth_date && (
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  생년월일: {formatDate(user.birth_date)}
                </div>
              )}
            </div>

            {user.bio && (
              <p className="mt-3 text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-3">
                {user.bio}
              </p>
            )}

            {user.preferences && user.preferences.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {user.preferences.map((p) => (
                  <Badge key={p} variant="info" size="sm">
                    {CATEGORY_LABEL[p] || p}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setNewStatus(user.status);
                setStatusModal(true);
              }}
            >
              상태 변경
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">총 구매 수</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalPurchases}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">총 결제 금액</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(stats.totalSpent)}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">활성 루틴</p>
              <p className="text-xl font-bold text-gray-900">{stats.activeRoutines}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Purchase History */}
      <Card title="구매 내역" noPadding>
        {purchases.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-400">
            구매 내역이 없습니다.
          </div>
        ) : (
          <Table
            columns={purchaseColumns}
            data={purchases}
            rowKey={(p) => p.id}
          />
        )}
      </Card>

      {/* Status Change Modal */}
      <Modal
        isOpen={statusModal}
        onClose={() => setStatusModal(false)}
        title="사용자 상태 변경"
        actions={
          <>
            <Button variant="secondary" onClick={() => setStatusModal(false)}>
              취소
            </Button>
            <Button onClick={handleStatusChange} loading={saving}>
              변경
            </Button>
          </>
        }
      >
        <Select
          label="상태"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          options={[
            { value: 'active', label: '활성' },
            { value: 'suspended', label: '정지' },
            { value: 'banned', label: '차단' },
          ]}
        />
      </Modal>
    </div>
  );
}
