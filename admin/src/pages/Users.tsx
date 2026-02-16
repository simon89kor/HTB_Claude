import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users as UsersIcon, ChevronDown, Loader2 } from 'lucide-react';
import { apiClient } from '../api/client';
import type { User, PaginatedResponse } from '../types';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import Pagination from '../components/ui/Pagination';
import SearchInput from '../components/ui/SearchInput';
import Select from '../components/ui/Select';
import EmptyState from '../components/ui/EmptyState';

const CATEGORY_LABEL: Record<string, string> = {
  exercise: '운동',
  diet: '식단관리',
  selfdev: '자기계발',
  cert: '자격증',
  study: '학업',
};

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

function StatusDropdown({
  currentStatus,
  isUpdating,
  onStatusChange,
}: {
  currentStatus: string;
  isUpdating: boolean;
  onStatusChange: (status: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const statuses = ['active', 'suspended', 'banned'];

  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        disabled={isUpdating}
      >
        {isUpdating ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <>
            상태 변경
            <ChevronDown className="w-3 h-3" />
          </>
        )}
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          />
          <div className="absolute right-0 z-20 mt-1 w-28 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            {statuses
              .filter((s) => s !== currentStatus)
              .map((s) => (
                <button
                  key={s}
                  type="button"
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(s);
                    setOpen(false);
                  }}
                >
                  {STATUS_LABEL[s]}
                </button>
              ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const limit = 20;

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<PaginatedResponse<User>>('/users', {
        page,
        limit,
        search: search || undefined,
        status: statusFilter || undefined,
      });
      setUsers(data.data);
      setTotal(data.total);
    } catch {
      setUsers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    if (statusUpdating) return;
    setStatusUpdating(userId);
    try {
      await apiClient.put(`/users/${userId}/status`, { status: newStatus });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, status: newStatus as User['status'] }
            : u
        )
      );
    } catch {
      // error
    } finally {
      setStatusUpdating(null);
    }
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('ko-KR');
  };

  const columns = [
    {
      key: 'nickname',
      header: '닉네임',
      render: (u: User) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 shrink-0">
            {u.avatar_url ? (
              <img
                src={u.avatar_url}
                alt=""
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              u.nickname?.charAt(0) || '?'
            )}
          </div>
          <span className="font-medium text-gray-900">{u.nickname}</span>
        </div>
      ),
    },
    {
      key: 'email',
      header: '이메일',
    },
    {
      key: 'status',
      header: '상태',
      render: (u: User) => (
        <Badge variant={STATUS_VARIANT[u.status]}>
          {STATUS_LABEL[u.status]}
        </Badge>
      ),
    },
    {
      key: 'preferences',
      header: '관심분야',
      render: (u: User) => (
        <div className="flex flex-wrap gap-1">
          {u.preferences?.length > 0 ? (
            u.preferences.slice(0, 3).map((p) => (
              <Badge key={p} variant="default" size="sm">
                {CATEGORY_LABEL[p] || p}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-gray-400">-</span>
          )}
          {u.preferences && u.preferences.length > 3 && (
            <Badge variant="default" size="sm">+{u.preferences.length - 3}</Badge>
          )}
        </div>
      ),
    },
    {
      key: 'created_at',
      header: '가입일',
      render: (u: User) => formatDate(u.created_at),
    },
    {
      key: 'actions',
      header: '액션',
      render: (u: User) => (
        <StatusDropdown
          currentStatus={u.status}
          isUpdating={statusUpdating === u.id}
          onStatusChange={(newStatus) => handleStatusChange(u.id, newStatus)}
        />
      ),
    },
  ];

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">사용자 관리</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput
          value={search}
          onSearch={handleSearch}
          placeholder="닉네임 또는 이메일로 검색..."
          className="w-full sm:w-80"
        />
        <Select
          options={[
            { value: 'active', label: '활성' },
            { value: 'suspended', label: '정지' },
            { value: 'banned', label: '차단' },
          ]}
          placeholder="전체 상태"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="w-full sm:w-40"
        />
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-500">
        총 <span className="font-semibold text-gray-700">{total.toLocaleString()}</span>명
      </div>

      {/* Table */}
      {!loading && users.length === 0 && !search && !statusFilter ? (
        <EmptyState
          icon={<UsersIcon className="w-8 h-8" />}
          title="사용자가 없습니다"
          description="아직 등록된 사용자가 없습니다."
        />
      ) : (
        <Table
          columns={columns}
          data={users}
          loading={loading}
          onRowClick={(u) => navigate(`/users/${u.id}`)}
          rowKey={(u) => u.id}
        />
      )}

      {/* Pagination */}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
