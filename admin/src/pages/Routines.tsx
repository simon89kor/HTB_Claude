import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, BookOpen, Star } from 'lucide-react';
import { apiClient } from '../api/client';
import type { Routine, PaginatedResponse } from '../types';
import { CATEGORIES } from '../types';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Pagination from '../components/ui/Pagination';
import SearchInput from '../components/ui/SearchInput';
import Select from '../components/ui/Select';
import EmptyState from '../components/ui/EmptyState';

export default function RoutinesPage() {
  const navigate = useNavigate();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [publishedFilter, setPublishedFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const limit = 20;

  const loadRoutines = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<PaginatedResponse<Routine>>('/routines', {
        page,
        limit,
        search: search || undefined,
        category: categoryFilter || undefined,
        is_published: publishedFilter || undefined,
      });
      setRoutines(data.data);
      setTotal(data.total);
    } catch {
      setRoutines([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, search, categoryFilter, publishedFilter]);

  useEffect(() => {
    loadRoutines();
  }, [loadRoutines]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('ko-KR');
  };

  const getCategoryLabel = (key: string) => {
    const cat = CATEGORIES.find((c) => c.key === key);
    return cat ? `${cat.emoji} ${cat.label}` : key;
  };

  const columns = [
    {
      key: 'title',
      header: '루틴명',
      render: (r: Routine) => (
        <div className="flex items-center gap-3">
          {r.image_url ? (
            <img
              src={r.image_url}
              alt=""
              className="w-10 h-10 rounded-lg object-cover bg-gray-100"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900 truncate max-w-[200px]">
              {r.title}
            </p>
            <p className="text-xs text-gray-500">{r.provider_name || '-'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: '카테고리',
      render: (r: Routine) => (
        <Badge variant="default">{getCategoryLabel(r.category)}</Badge>
      ),
    },
    {
      key: 'price',
      header: '가격 (4주)',
      render: (r: Routine) => formatCurrency(r.price_4week),
    },
    {
      key: 'purchase_count',
      header: '구매수',
      render: (r: Routine) => r.purchase_count.toLocaleString(),
    },
    {
      key: 'rating_avg',
      header: '평점',
      render: (r: Routine) => (
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span>{r.rating_avg.toFixed(1)}</span>
        </div>
      ),
    },
    {
      key: 'is_published',
      header: '상태',
      render: (r: Routine) => (
        <Badge variant={r.is_published ? 'success' : 'default'}>
          {r.is_published ? '게시중' : '미게시'}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      header: '등록일',
      render: (r: Routine) => formatDate(r.created_at),
    },
  ];

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <SearchInput
            value={search}
            onSearch={handleSearch}
            placeholder="루틴명 또는 제공자 검색..."
            className="w-full sm:w-80"
          />
          <Select
            options={CATEGORIES.map((c) => ({
              value: c.key,
              label: `${c.emoji} ${c.label}`,
            }))}
            placeholder="전체 카테고리"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-44"
          />
          <Select
            options={[
              { value: 'true', label: '게시중' },
              { value: 'false', label: '미게시' },
            ]}
            placeholder="전체 상태"
            value={publishedFilter}
            onChange={(e) => {
              setPublishedFilter(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-36"
          />
        </div>
        <Button
          icon={<Plus className="w-4 h-4" />}
          onClick={() => navigate('/routines/new')}
        >
          루틴 등록
        </Button>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-500">
        총 <span className="font-semibold text-gray-700">{total.toLocaleString()}</span>개
      </div>

      {/* Table */}
      {!loading && routines.length === 0 && !search && !categoryFilter && !publishedFilter ? (
        <EmptyState
          icon={<BookOpen className="w-8 h-8" />}
          title="등록된 루틴이 없습니다"
          description="새 루틴을 등록해보세요."
          action={
            <Button
              icon={<Plus className="w-4 h-4" />}
              onClick={() => navigate('/routines/new')}
            >
              루틴 등록
            </Button>
          }
        />
      ) : (
        <Table
          columns={columns}
          data={routines}
          loading={loading}
          onRowClick={(r) => navigate(`/routines/${r.id}/edit`)}
          rowKey={(r) => r.id}
        />
      )}

      {/* Pagination */}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
