import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, GripVertical } from 'lucide-react';
import { apiClient } from '../api/client';
import type { Routine, RoutineItem } from '../types';
import { CATEGORIES } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import Card from '../components/ui/Card';

interface RoutineFormData {
  title: string;
  description: string;
  category: string;
  provider_id: string;
  image_url: string;
  price_1week: number;
  price_4week: number;
  price_100days: number;
  is_published: boolean;
}

const emptyForm: RoutineFormData = {
  title: '',
  description: '',
  category: '',
  provider_id: '',
  image_url: '',
  price_1week: 0,
  price_4week: 0,
  price_100days: 0,
  is_published: false,
};

const emptyItem: RoutineItem = {
  day_number: 1,
  title: '',
  description: null,
  sort_order: 0,
};

export default function RoutineForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<RoutineFormData>(emptyForm);
  const [items, setItems] = useState<RoutineItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) loadRoutine(id);
  }, [id]);

  const loadRoutine = async (routineId: string) => {
    setLoading(true);
    try {
      const [routine, routineItems] = await Promise.all([
        apiClient.get<Routine>(`/routines/${routineId}`),
        apiClient.get<{ data: RoutineItem[] }>(`/routines/${routineId}/items`),
      ]);
      setForm({
        title: routine.title,
        description: routine.description || '',
        category: routine.category,
        provider_id: routine.provider_id,
        image_url: routine.image_url || '',
        price_1week: routine.price_1week,
        price_4week: routine.price_4week,
        price_100days: routine.price_100days,
        is_published: routine.is_published,
      });
      setItems(routineItems.data || []);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = '루틴명을 입력하세요.';
    if (!form.category) newErrors.category = '카테고리를 선택하세요.';
    if (form.price_1week < 0) newErrors.price_1week = '가격은 0 이상이어야 합니다.';
    if (form.price_4week < 0) newErrors.price_4week = '가격은 0 이상이어야 합니다.';
    if (form.price_100days < 0) newErrors.price_100days = '가격은 0 이상이어야 합니다.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = {
        ...form,
        description: form.description || null,
        image_url: form.image_url || null,
        items,
      };

      if (isEdit && id) {
        await apiClient.put(`/routines/${id}`, payload);
      } else {
        await apiClient.post('/routines', payload);
      }

      navigate('/routines');
    } catch {
      // handle error
    } finally {
      setSaving(false);
    }
  };

  const updateField = <K extends keyof RoutineFormData>(
    field: K,
    value: RoutineFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const addItem = () => {
    const maxDay = items.length > 0 ? Math.max(...items.map((i) => i.day_number)) : 0;
    setItems((prev) => [
      ...prev,
      { ...emptyItem, day_number: maxDay + 1, sort_order: prev.length },
    ]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof RoutineItem, value: string | number | null) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-32" />
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back button */}
      <button
        onClick={() => navigate('/routines')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        루틴 목록
      </button>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card title="기본 정보">
          <div className="space-y-4">
            <Input
              label="루틴명"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="루틴 이름을 입력하세요"
              error={errors.title}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="카테고리"
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
                options={CATEGORIES.map((c) => ({
                  value: c.key,
                  label: `${c.emoji} ${c.label}`,
                }))}
                placeholder="카테고리 선택"
                error={errors.category}
              />

              <Input
                label="제공자 ID"
                value={form.provider_id}
                onChange={(e) => updateField('provider_id', e.target.value)}
                placeholder="제공자 ID"
              />
            </div>

            <Textarea
              label="설명"
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="루틴에 대한 설명을 입력하세요"
              rows={4}
            />

            <Input
              label="이미지 URL"
              value={form.image_url}
              onChange={(e) => updateField('image_url', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </Card>

        {/* Pricing */}
        <Card title="가격 설정">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="1주 가격 (원)"
              type="number"
              value={form.price_1week}
              onChange={(e) => updateField('price_1week', Number(e.target.value))}
              min={0}
              step={100}
              error={errors.price_1week}
            />
            <Input
              label="4주 가격 (원)"
              type="number"
              value={form.price_4week}
              onChange={(e) => updateField('price_4week', Number(e.target.value))}
              min={0}
              step={100}
              error={errors.price_4week}
            />
            <Input
              label="100일 가격 (원)"
              type="number"
              value={form.price_100days}
              onChange={(e) => updateField('price_100days', Number(e.target.value))}
              min={0}
              step={100}
              error={errors.price_100days}
            />
          </div>
        </Card>

        {/* Routine Items */}
        <Card
          title="루틴 항목"
          actions={
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={addItem}
            >
              항목 추가
            </Button>
          }
        >
          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              루틴 항목을 추가해주세요.
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div className="mt-2 text-gray-300">
                    <GripVertical className="w-4 h-4" />
                  </div>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-2">
                      <Input
                        label="Day"
                        type="number"
                        value={item.day_number}
                        onChange={(e) =>
                          updateItem(index, 'day_number', Number(e.target.value))
                        }
                        min={1}
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <Input
                        label="제목"
                        value={item.title}
                        onChange={(e) =>
                          updateItem(index, 'title', e.target.value)
                        }
                        placeholder="항목 제목"
                      />
                    </div>
                    <div className="sm:col-span-5">
                      <Input
                        label="설명"
                        value={item.description || ''}
                        onChange={(e) =>
                          updateItem(
                            index,
                            'description',
                            e.target.value || null
                          )
                        }
                        placeholder="항목 설명 (선택)"
                      />
                    </div>
                    <div className="sm:col-span-1 flex items-end">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Publish Toggle & Actions */}
        <Card>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => updateField('is_published', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">게시 상태</p>
                <p className="text-xs text-gray-500">
                  활성화하면 사용자에게 루틴이 노출됩니다.
                </p>
              </div>
            </label>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/routines')}
              >
                취소
              </Button>
              <Button type="submit" loading={saving}>
                {isEdit ? '수정' : '등록'}
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
