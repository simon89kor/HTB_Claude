import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Eye, EyeOff, Trash2, Heart, MessageCircle } from 'lucide-react';
import { apiClient } from '../api/client';
import type { Post, PaginatedResponse } from '../types';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Pagination from '../components/ui/Pagination';
import SearchInput from '../components/ui/SearchInput';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [detailModal, setDetailModal] = useState<Post | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const limit = 20;

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<PaginatedResponse<Post>>('/posts', {
        page,
        limit,
        search: search || undefined,
        status: statusFilter || undefined,
      });
      setPosts(data.data);
      setTotal(data.total);
    } catch {
      setPosts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = async (postId: string, newStatus: Post['status']) => {
    setActionLoading(true);
    try {
      await apiClient.put(`/posts/${postId}/status`, { status: newStatus });
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, status: newStatus } : p))
      );
      if (detailModal?.id === postId) {
        setDetailModal((prev) => prev ? { ...prev, status: newStatus } : null);
      }
    } catch {
      // error
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('ko-KR');
  };

  const statusBadge = (status: Post['status']) => {
    const map = {
      active: { variant: 'success' as const, label: '활성' },
      hidden: { variant: 'warning' as const, label: '숨김' },
      deleted: { variant: 'error' as const, label: '삭제' },
    };
    const info = map[status];
    return <Badge variant={info.variant}>{info.label}</Badge>;
  };

  const columns = [
    {
      key: 'title',
      header: '제목',
      render: (p: Post) => (
        <div>
          <p className="font-medium text-gray-900 truncate max-w-[250px]">
            {p.title}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {p.user_nickname || p.user_id.slice(0, 8)}
          </p>
        </div>
      ),
    },
    {
      key: 'category',
      header: '카테고리',
      render: (p: Post) => p.category ? <Badge variant="default">{p.category}</Badge> : '-',
    },
    {
      key: 'hashtags',
      header: '해시태그',
      render: (p: Post) => (
        <div className="flex flex-wrap gap-1">
          {p.hashtags?.slice(0, 3).map((h) => (
            <span key={h} className="text-xs text-primary">#{h}</span>
          ))}
        </div>
      ),
    },
    {
      key: 'engagement',
      header: '반응',
      render: (p: Post) => (
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5" />
            {p.like_count}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5" />
            {p.comment_count}
          </span>
        </div>
      ),
    },
    {
      key: 'images',
      header: '이미지',
      render: (p: Post) => (
        <span className="text-sm text-gray-500">
          {p.image_urls?.length || 0}장
        </span>
      ),
    },
    {
      key: 'status',
      header: '상태',
      render: (p: Post) => statusBadge(p.status),
    },
    {
      key: 'created_at',
      header: '작성일',
      render: (p: Post) => formatDate(p.created_at),
    },
    {
      key: 'actions',
      header: '',
      render: (p: Post) => (
        <div className="flex items-center gap-1">
          {p.status === 'active' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange(p.id, 'hidden');
              }}
              className="p-1.5 rounded text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 transition-colors"
              title="숨기기"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          )}
          {p.status === 'hidden' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange(p.id, 'active');
              }}
              className="p-1.5 rounded text-gray-400 hover:text-green-500 hover:bg-green-50 transition-colors"
              title="게시"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          {p.status !== 'deleted' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange(p.id, 'deleted');
              }}
              className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="삭제"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
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
          placeholder="제목 또는 작성자 검색..."
          className="w-full sm:w-80"
        />
        <Select
          options={[
            { value: 'active', label: '활성' },
            { value: 'hidden', label: '숨김' },
            { value: 'deleted', label: '삭제' },
          ]}
          placeholder="전체 상태"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
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
      {!loading && posts.length === 0 && !search && !statusFilter ? (
        <EmptyState
          icon={<FileText className="w-8 h-8" />}
          title="게시물이 없습니다"
          description="아직 등록된 게시물이 없습니다."
        />
      ) : (
        <Table
          columns={columns}
          data={posts}
          loading={loading}
          onRowClick={(p) => setDetailModal(p)}
          rowKey={(p) => p.id}
        />
      )}

      {/* Pagination */}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Detail Modal */}
      <Modal
        isOpen={!!detailModal}
        onClose={() => setDetailModal(null)}
        title="게시물 상세"
        size="lg"
        actions={
          detailModal && (
            <>
              {detailModal.status === 'active' && (
                <Button
                  variant="secondary"
                  size="sm"
                  loading={actionLoading}
                  onClick={() => handleStatusChange(detailModal.id, 'hidden')}
                >
                  숨기기
                </Button>
              )}
              {detailModal.status === 'hidden' && (
                <Button
                  variant="secondary"
                  size="sm"
                  loading={actionLoading}
                  onClick={() => handleStatusChange(detailModal.id, 'active')}
                >
                  게시
                </Button>
              )}
              {detailModal.status !== 'deleted' && (
                <Button
                  variant="danger"
                  size="sm"
                  loading={actionLoading}
                  onClick={() => handleStatusChange(detailModal.id, 'deleted')}
                >
                  삭제
                </Button>
              )}
            </>
          )
        }
      >
        {detailModal && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">{detailModal.title}</h4>
                <p className="text-sm text-gray-500 mt-0.5">
                  {detailModal.user_nickname || detailModal.user_id.slice(0, 8)} &middot;{' '}
                  {formatDate(detailModal.created_at)}
                </p>
              </div>
              {statusBadge(detailModal.status)}
            </div>

            {detailModal.content && (
              <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-4">
                {detailModal.content}
              </p>
            )}

            {detailModal.image_urls && detailModal.image_urls.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {detailModal.image_urls.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt=""
                    className="w-full aspect-square object-cover rounded-lg bg-gray-100"
                  />
                ))}
              </div>
            )}

            {detailModal.hashtags && detailModal.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {detailModal.hashtags.map((h) => (
                  <span key={h} className="text-sm text-primary">#{h}</span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-500 pt-2 border-t border-gray-100">
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                좋아요 {detailModal.like_count}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                댓글 {detailModal.comment_count}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
