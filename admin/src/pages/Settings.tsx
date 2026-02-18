import React, { useState, useEffect, useCallback } from 'react';
import { Settings as SettingsIcon, Plus, Edit2, Trash2, Shield, ShieldCheck } from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuthStore } from '../stores/authStore';
import type { AdminUser } from '../types';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import EmptyState from '../components/ui/EmptyState';

interface AdminFormData {
  email: string;
  name: string;
  password: string;
  role: 'super_admin' | 'sales';
}

const emptyForm: AdminFormData = {
  email: '',
  name: '',
  password: '',
  role: 'sales',
};

export default function SettingsPage() {
  const { admin: currentAdmin } = useAuthStore();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [formModal, setFormModal] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<AdminFormData>(emptyForm);
  const [editActive, setEditActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<AdminUser[] | { data: AdminUser[] }>('/admins');
      setAdmins(Array.isArray(data) ? data : data.data || []);
    } catch {
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  const isCurrentAdmin = (admin: AdminUser) => currentAdmin?.id === admin.id;

  const openCreateModal = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setEditActive(true);
    setErrors({});
    setFormModal(true);
  };

  const openEditModal = (admin: AdminUser) => {
    setEditTarget(admin);
    setForm({
      email: admin.email,
      name: admin.name,
      password: '',
      role: admin.role,
    });
    setEditActive(admin.is_active);
    setErrors({});
    setFormModal(true);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.email.trim()) newErrors.email = '이메일을 입력하세요.';
    if (!form.name.trim()) newErrors.name = '이름을 입력하세요.';
    if (!editTarget && !form.password.trim()) newErrors.password = '비밀번호를 입력하세요.';
    if (form.password && form.password.length < 6)
      newErrors.password = '비밀번호는 6자 이상이어야 합니다.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      if (editTarget) {
        const payload: Record<string, unknown> = {
          name: form.name,
          role: form.role,
          is_active: editActive,
        };
        if (form.password) payload.password = form.password;
        await apiClient.put(`/admins/${editTarget.id}`, payload);
      } else {
        await apiClient.post('/admins', {
          email: form.email,
          password: form.password,
          name: form.name,
          role: form.role,
        });
      }

      setFormModal(false);
      loadAdmins();
    } catch {
      // error
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/admins/${deleteTarget.id}`);
      setDeleteTarget(null);
      loadAdmins();
    } catch {
      // error
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('ko-KR');
  };

  const roleBadge = (role: AdminUser['role']) => {
    if (role === 'super_admin') {
      return (
        <Badge variant="info">
          <ShieldCheck className="w-3 h-3 mr-1" />
          최고 관리자
        </Badge>
      );
    }
    return (
      <Badge variant="default">
        <Shield className="w-3 h-3 mr-1" />
        영업 담당
      </Badge>
    );
  };

  const columns = [
    {
      key: 'name',
      header: '이름',
      render: (a: AdminUser) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold">
            {a.name.charAt(0)}
          </div>
          <div>
            <span className="font-medium text-gray-900">{a.name}</span>
            {isCurrentAdmin(a) && (
              <span className="ml-2 text-xs text-primary font-normal">(나)</span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: '이메일',
    },
    {
      key: 'role',
      header: '역할',
      render: (a: AdminUser) => roleBadge(a.role),
    },
    {
      key: 'is_active',
      header: '상태',
      render: (a: AdminUser) => (
        <Badge variant={a.is_active ? 'success' : 'error'}>
          {a.is_active ? '활성' : '비활성'}
        </Badge>
      ),
    },
    {
      key: 'last_login_at',
      header: '마지막 로그인',
      render: (a: AdminUser) => (
        <span className="text-sm text-gray-500">{formatDate(a.last_login_at)}</span>
      ),
    },
    {
      key: 'created_at',
      header: '가입일',
      render: (a: AdminUser) => formatDate(a.created_at),
    },
    {
      key: 'actions',
      header: '액션',
      render: (a: AdminUser) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(a);
            }}
            className="p-1.5 rounded text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
            title="수정"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          {!isCurrentAdmin(a) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteTarget(a);
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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">관리자 설정</h1>
          <p className="text-sm text-gray-500 mt-1">
            총 <span className="font-semibold text-gray-700">{admins.length}</span>명의 관리자
          </p>
        </div>
        <Button
          icon={<Plus className="w-4 h-4" />}
          onClick={openCreateModal}
        >
          새 관리자 추가
        </Button>
      </div>

      {/* Table */}
      {!loading && admins.length === 0 ? (
        <EmptyState
          icon={<SettingsIcon className="w-8 h-8" />}
          title="관리자가 없습니다"
          description="관리자를 추가해주세요."
          action={
            <Button
              icon={<Plus className="w-4 h-4" />}
              onClick={openCreateModal}
            >
              관리자 추가
            </Button>
          }
        />
      ) : (
        <Table
          columns={columns}
          data={admins}
          loading={loading}
          rowKey={(a) => a.id}
        />
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={formModal}
        onClose={() => setFormModal(false)}
        title={editTarget ? '관리자 수정' : '새 관리자 추가'}
        actions={
          <>
            <Button variant="secondary" onClick={() => setFormModal(false)}>
              취소
            </Button>
            <Button onClick={handleSave} loading={saving}>
              {editTarget ? '수정' : '추가'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="이름"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="관리자 이름"
            error={errors.name}
          />
          <Input
            label="이메일"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="admin@htb.com"
            error={errors.email}
            disabled={!!editTarget}
          />
          <Input
            label={editTarget ? '비밀번호 (변경 시 입력)' : '비밀번호'}
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            placeholder={editTarget ? '변경하지 않으려면 비워두세요' : '6자 이상'}
            error={errors.password}
          />
          <Select
            label="역할"
            value={form.role}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                role: e.target.value as 'super_admin' | 'sales',
              }))
            }
            options={[
              { value: 'sales', label: '영업 담당' },
              { value: 'super_admin', label: '최고 관리자' },
            ]}
          />
          {editTarget && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                계정 상태
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editActive}
                  onChange={(e) => setEditActive(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">
                  {editActive ? '활성' : '비활성'}
                  {!editActive && (
                    <span className="text-xs text-gray-400 ml-1">
                      (비활성 상태에서는 로그인할 수 없습니다)
                    </span>
                  )}
                </span>
              </label>
            </div>
          )}
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="관리자 삭제"
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
              <strong>{deleteTarget.name}</strong> ({deleteTarget.email}) 관리자를 삭제하시겠습니까?
            </p>
            <p className="text-xs text-red-500">
              이 작업은 되돌릴 수 없습니다.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
