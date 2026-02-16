import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Eye, EyeOff, Trash2, RotateCcw, Heart, MessageCircle } from 'lucide-react';
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

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'error'> = {
  active: 'success',
  hidden: 'warning',
  deleted: 'error',
};

const STATUS_LABEL: Record<string, string> = {
  active: '활성',
  hidden: '숨김',
  deleted: '삭제',
};

const CATEGORY_LABEL: Record<string, string> = {
  review: '리뷰',
  daily: '일상',
  question: '질문',
  tip: '팁',
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [detailModal, setDetailModal] = useState<Post | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    post: Post;
    newStatus: Post['status'];
    label: string;
  } | null>(null);
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
        setDetailModal((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch {
      // error
    } finally {
      setActionLoading(false);
      setConfirmAction(null);
    }
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('ko-KR');
  };

  const columns = [
    {
      key: 'title',
      header: '제목',
      render: (p: Post) => (
        <div>
          <p className="font-medium text-gray-900 truncate max-w-[250px]">{p.title}</p>
          {p.hashtags && p.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-0.5">
              {p.hashtags.slice(0, 3).map((h) => (
                <span key={h} className="text-xs text-primary">#{h}</span>
              ))}
              {p.hashtags.length > 3 && (
                <span className="text-xs text-gray-400">+{p.hashtags.length - 3}</span>
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'user',
      header: '작성자',
      render: (p: Post) => (
        <span className="text-sm text-gray-600">
          {p.user_nickname || p.user_id.slice(0, 8)}
        </span>
      ),
    },
    {
      key: 'category',
      header: '카테고리',
      render: (p: Post) =>
        p.category ? (
          <Badge variant="default">{CATEGORY_LABEL[p.category] || p.category}</Badge>
        ) : (
          '-'
        ),
    },
    {
      key: 'likes',
      header: '좋아요',
      render: (p: Post) => (
        <span className="flex items-center gap-1 text-sm text-gray-500">
          <Heart className="w-3.5 h-3.5 text-red-400" />
          {p.like_count}
        </span>
      ),
    },
    {
      key: 'comments',
      header: '댓글',
      render: (p: Post) => (
        <span className="flex items-center gap-1 text-sm text-gray-500">
          <MessageCircle className="w-3.5 h-3.5" />
          {p.comment_count}
        </span>
      ),
    },
    {
      key: 'status',
      header: '상태',
      render: (p: Post) => (
        <Badge variant={STATUS_VARIANT[p.status]}>
          {STATUS_LABEL[p.status]}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      header: '작성일',
      render: (p: Post) => formatDate(p.created_at),
    },
    {
      key: 'actions',
      header: '액션',
      render: (p: Post) => (
        <div className="flex items-center gap-1">
          {p.status === 'active' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setConfirmAction({ post: p, newStatus: 'hidden', label: '숨기기' });
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
                setConfirmAction({ post: p, newStatus: 'active', label: '복원' });
              }}
              className="p-1.5 rounded text-gray-400 hover:text-green-500 hover:bg-green-50 transition-colors"
              title="복원"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          {p.status === 'deleted' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setConfirmAction({ post: p, newStatus: 'active', label: '복원' });
              }}
              className="p-1.5 rounded text-gray-400 hover:text-green-500 hover:bg-green-50 transition-colors"
              title="복원"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          {p.status !== 'deleted' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setConfirmAction({ post: p, newStatus: 'deleted', label: '삭제' });
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
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">게시물 관리</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput
          value={search}
          onSearch={handleSearch}
          placeholder="제목 또는 내용으로 검색..."
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

      {/* Post Detail Modal */}
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
                  복원
                </Button>
              )}
              {detailModal.status === 'deleted' && (
                <Button
                  variant="secondary"
                  size="sm"
                  loading={actionLoading}
                  onClick={() => handleStatusChange(detailModal.id, 'active')}
                >
                  복원
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
                  {detailModal.category ? (CATEGORY_LABEL[detailModal.category] || detailModal.category) : ''} &middot;{' '}
                  {formatDate(detailModal.created_at)}
                </p>
              </div>
              <Badge variant={STATUS_VARIANT[detailModal.status]}>
                {STATUS_LABEL[detailModal.status]}
              </Badge>
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
                <Heart className="w-4 h-4 text-red-400" />
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

      {/* Status Change Confirmation Modal */}
      <Modal
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        title="게시물 상태 변경"
        size="sm"
        actions={
          confirmAction && (
            <>
              <Button variant="secondary" onClick={() => setConfirmAction(null)}>
                취소
              </Button>
              <Button
                variant={confirmAction.newStatus === 'deleted' ? 'danger' : 'primary'}
                loading={actionLoading}
                onClick={() =>
                  handleStatusChange(confirmAction.post.id, confirmAction.newStatus)
                }
              >
                {confirmAction.label}
              </Button>
            </>
          )
        }
      >
        {confirmAction && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              <strong>"{confirmAction.post.title}"</strong> 게시물을{' '}
              <strong>{STATUS_LABEL[confirmAction.newStatus]}</strong> 상태로 변경하시겠습니까?
            </p>
            {confirmAction.newStatus === 'deleted' && (
              <p className="text-xs text-red-500">삭제된 게시물은 사용자에게 표시되지 않습니다.</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
