import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users as UsersIcon } from 'lucide-react';
import { apiClient } from '../api/client';
import type { User, PaginatedResponse } from '../types';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import Pagination from '../components/ui/Pagination';
import SearchInput from '../components/ui/SearchInput';
import Select from '../components/ui/Select';
import EmptyState from '../components/ui/EmptyState';

export default function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
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

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('ko-KR');
  };

  const statusBadge = (status: User['status']) => {
    const map = {
      active: { variant: 'success' as const, label: '활성' },
      suspended: { variant: 'warning' as const, label: '정지' },
      banned: { variant: 'error' as const, label: '차단' },
    };
    const info = map[status];
    return <Badge variant={info.variant}>{info.label}</Badge>;
  };

  const columns = [
    {
      key: 'nickname',
      header: '닉네임',
      render: (u: User) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
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
      key: 'gender',
      header: '성별',
      render: (u: User) => u.gender === 'male' ? '남' : u.gender === 'female' ? '여' : '-',
    },
    {
      key: 'preferences',
      header: '관심사',
      render: (u: User) => (
        <div className="flex flex-wrap gap-1">
          {u.preferences?.slice(0, 3).map((p) => (
            <Badge key={p} variant="default" size="sm">{p}</Badge>
          ))}
          {u.preferences && u.preferences.length > 3 && (
            <Badge variant="default" size="sm">+{u.preferences.length - 3}</Badge>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: '상태',
      render: (u: User) => statusBadge(u.status),
    },
    {
      key: 'created_at',
      header: '가입일',
      render: (u: User) => formatDate(u.created_at),
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
