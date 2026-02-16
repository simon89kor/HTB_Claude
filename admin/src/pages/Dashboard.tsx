import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  BookOpen,
  CreditCard,
  DollarSign,
  ArrowRight,
} from 'lucide-react';
import { apiClient } from '../api/client';
import type { DashboardStats, Purchase } from '../types';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentPurchases, setRecentPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [statsData, purchasesData] = await Promise.all([
        apiClient.get<DashboardStats>('/dashboard/stats'),
        apiClient.get<{ data: Purchase[] }>('/purchases', { limit: 5, page: 1 }),
      ]);
      setStats(statsData);
      setRecentPurchases(purchasesData.data || []);
    } catch {
      // Use placeholder data if API is not available
      setStats({
        totalUsers: 0,
        totalRoutines: 0,
        totalPurchases: 0,
        totalRevenue: 0,
        recentUsers: 0,
        recentPurchases: 0,
      });
      setRecentPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
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

  const purchaseColumns = [
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
      render: (p: Purchase) => formatCurrency(p.amount),
    },
    {
      key: 'status',
      header: '상태',
      render: (p: Purchase) => statusBadge(p.status),
    },
    {
      key: 'created_at',
      header: '날짜',
      render: (p: Purchase) => formatDate(p.created_at),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="w-6 h-6" />}
          label="전체 사용자"
          value={loading ? '-' : (stats?.totalUsers ?? 0).toLocaleString()}
          change={
            stats?.recentUsers
              ? { value: stats.recentUsers, label: '최근 7일' }
              : undefined
          }
        />
        <StatCard
          icon={<BookOpen className="w-6 h-6" />}
          label="등록 루틴"
          value={loading ? '-' : (stats?.totalRoutines ?? 0).toLocaleString()}
        />
        <StatCard
          icon={<CreditCard className="w-6 h-6" />}
          label="총 구매"
          value={loading ? '-' : (stats?.totalPurchases ?? 0).toLocaleString()}
          change={
            stats?.recentPurchases
              ? { value: stats.recentPurchases, label: '최근 7일' }
              : undefined
          }
        />
        <StatCard
          icon={<DollarSign className="w-6 h-6" />}
          label="총 매출"
          value={loading ? '-' : formatCurrency(stats?.totalRevenue ?? 0)}
        />
      </div>

      {/* Recent Purchases */}
      <Card
        title="최근 구매"
        actions={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/purchases')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            전체보기
          </Button>
        }
        noPadding
      >
        <Table
          columns={purchaseColumns}
          data={recentPurchases}
          loading={loading}
          rowKey={(p) => p.id}
        />
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/users')}
          className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200 hover:border-primary/50 hover:shadow-sm transition-all text-left"
        >
          <div className="p-3 bg-blue-50 rounded-xl text-blue-500">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">사용자 관리</p>
            <p className="text-sm text-gray-500">사용자 조회 및 관리</p>
          </div>
        </button>
        <button
          onClick={() => navigate('/routines')}
          className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200 hover:border-primary/50 hover:shadow-sm transition-all text-left"
        >
          <div className="p-3 bg-green-50 rounded-xl text-green-500">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">루틴 관리</p>
            <p className="text-sm text-gray-500">루틴 등록 및 수정</p>
          </div>
        </button>
        <button
          onClick={() => navigate('/purchases')}
          className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200 hover:border-primary/50 hover:shadow-sm transition-all text-left"
        >
          <div className="p-3 bg-purple-50 rounded-xl text-purple-500">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">구매 관리</p>
            <p className="text-sm text-gray-500">구매 내역 및 환불 처리</p>
          </div>
        </button>
      </div>
    </div>
  );
}
