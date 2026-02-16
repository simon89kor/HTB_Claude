import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, BookOpen, Star, Eye, EyeOff, Edit2, Trash2, Loader2 } from 'lucide-react';
import { apiClient } from '../api/client';
import type { Routine, PaginatedResponse } from '../types';
import { CATEGORIES } from '../types';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Pagination from '../components/ui/Pagination';
import SearchInput from '../components/ui/SearchInput';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
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
  const [publishToggling, setPublishToggling] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Routine | null>(null);
  const [deleting, setDeleting] = useState(false);
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

  const handlePublishToggle = async (routine: Routine) => {
    if (publishToggling) return;
    setPublishToggling(routine.id);
    try {
      await apiClient.put(`/routines/${routine.id}/publish`);
      setRoutines((prev) =>
        prev.map((r) =>
          r.id === routine.id ? { ...r, is_published: !r.is_published } : r
        )
      );
    } catch {
      // error
    } finally {
      setPublishToggling(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/routines/${deleteTarget.id}`);
      setRoutines((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setTotal((prev) => prev - 1);
      setDeleteTarget(null);
    } catch {
      // error
    } finally {
      setDeleting(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  const getCategoryLabel = (key: string) => {
    const cat = CATEGORIES.find((c) => c.key === key);
    return cat ? `${cat.emoji} ${cat.label}` : key;
  };

  const columns = [
    {
      key: 'title',
      header: '제목',
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
          <span className="font-medium text-gray-900 truncate max-w-[200px]">
            {r.title}
          </span>
        </div>
      ),
    },
    {
      key: 'provider',
      header: '제공자',
      render: (r: Routine) => (
        <span className="text-sm text-gray-600">{r.provider_name || '-'}</span>
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
      key: 'price_1week',
      header: '가격(1주)',
      render: (r: Routine) => formatCurrency(r.price_1week),
    },
    {
      key: 'purchase_count',
      header: '판매수',
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
          {r.is_published ? '공개' : '비공개'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '액션',
      render: (r: Routine) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePublishToggle(r);
            }}
            className="p-1.5 rounded text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
            title={r.is_published ? '비공개로 변경' : '공개로 변경'}
            disabled={publishToggling === r.id}
          >
            {publishToggling === r.id ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : r.is_published ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/routines/${r.id}/edit`);
            }}
            className="p-1.5 rounded text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
            title="편집"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteTarget(r);
            }}
            className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="삭제"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
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
            placeholder="루틴 제목으로 검색..."
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
              { value: 'true', label: '공개' },
              { value: 'false', label: '비공개' },
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
          새 루틴 등록
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
              새 루틴 등록
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="루틴 삭제"
        size="sm"
        actions={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              취소
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting}>
              삭제
            </Button>
          </>
        }
      >
        {deleteTarget && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              <strong>"{deleteTarget.title}"</strong> 루틴을 삭제하시겠습니까?
            </p>
            <p className="text-xs text-red-500">
              이 작업은 되돌릴 수 없습니다. 관련된 모든 데이터가 삭제됩니다.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
