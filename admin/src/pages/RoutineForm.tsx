import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Search,
  X,
  Copy,
  Calendar,
  Loader2,
  GripVertical,
  AlertCircle,
} from 'lucide-react';
import { apiClient } from '../api/client';
import type { Routine, RoutineItem, User } from '../types';
import { CATEGORIES } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';

/* ─── Types ─── */

interface DayGroup {
  day_number: number;
  items: FormItem[];
}

interface FormItem {
  _key: string; // client-side unique key
  title: string;
  description: string;
}

interface RoutineFormData {
  provider_id: string;
  provider_name: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  price_1week: number;
  price_4week: number;
  price_100days: number;
  is_published: boolean;
}

/* ─── Helpers ─── */

let keyCounter = 0;
function nextKey(): string {
  return `item_${Date.now()}_${++keyCounter}`;
}

function groupItemsByDay(items: RoutineItem[]): DayGroup[] {
  const map = new Map<number, FormItem[]>();

  for (const item of items) {
    const arr = map.get(item.day_number) || [];
    arr.push({
      _key: item.id || nextKey(),
      title: item.title,
      description: item.description || '',
    });
    map.set(item.day_number, arr);
  }

  const groups: DayGroup[] = [];
  for (const [day_number, groupItems] of map) {
    groupItems.sort((a, b) => {
      // preserve original sort_order via insertion order
      return 0;
    });
    groups.push({ day_number, items: groupItems });
  }

  groups.sort((a, b) => a.day_number - b.day_number);
  return groups;
}

function flattenToItems(days: DayGroup[]): RoutineItem[] {
  const result: RoutineItem[] = [];
  for (const day of days) {
    for (let i = 0; i < day.items.length; i++) {
      result.push({
        day_number: day.day_number,
        title: day.items[i].title,
        description: day.items[i].description || null,
        sort_order: i + 1,
      });
    }
  }
  return result;
}

const emptyForm: RoutineFormData = {
  provider_id: '',
  provider_name: '',
  title: '',
  description: '',
  category: '',
  image_url: '',
  price_1week: 1400,
  price_4week: 5600,
  price_100days: 20000,
  is_published: false,
};

/* ─── Component ─── */

export default function RoutineForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  // Form state
  const [form, setForm] = useState<RoutineFormData>({ ...emptyForm });
  const [days, setDays] = useState<DayGroup[]>([
    { day_number: 1, items: [{ _key: nextKey(), title: '', description: '' }] },
  ]);

  // Provider search
  const [providerSearch, setProviderSearch] = useState('');
  const [providerResults, setProviderResults] = useState<User[]>([]);
  const [providerDropdownOpen, setProviderDropdownOpen] = useState(false);
  const [searchingProvider, setSearchingProvider] = useState(false);
  const providerRef = useRef<HTMLDivElement>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout>>();

  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [collapsedDays, setCollapsedDays] = useState<Set<number>>(new Set());

  /* ─── Load existing routine ─── */

  useEffect(() => {
    if (!id) return;
    const loadRoutine = async () => {
      setLoading(true);
      try {
        const data = await apiClient.get<{ routine: Routine; items: RoutineItem[] }>(
          `/routines/${id}`
        );
        const routine = data.routine;
        const items = data.items || [];

        setForm({
          provider_id: routine.provider_id,
          provider_name: routine.provider_name || '',
          title: routine.title,
          description: routine.description || '',
          category: routine.category,
          image_url: routine.image_url || '',
          price_1week: routine.price_1week,
          price_4week: routine.price_4week,
          price_100days: routine.price_100days,
          is_published: routine.is_published,
        });

        setProviderSearch(routine.provider_name || '');

        if (items.length > 0) {
          setDays(groupItemsByDay(items));
        }
      } catch {
        setGlobalError('루틴을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    loadRoutine();
  }, [id]);

  /* ─── Provider search ─── */

  const searchProviders = async (query: string) => {
    if (query.length < 1) {
      setProviderResults([]);
      return;
    }
    setSearchingProvider(true);
    try {
      const res = await apiClient.get<{ data: User[] }>('/users/search', {
        search: query,
      });
      setProviderResults(res.data || []);
    } catch {
      setProviderResults([]);
    } finally {
      setSearchingProvider(false);
    }
  };

  const handleProviderSearchChange = (value: string) => {
    setProviderSearch(value);
    setProviderDropdownOpen(true);

    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => searchProviders(value), 300);
  };

  const selectProvider = (user: User) => {
    setForm((prev) => ({
      ...prev,
      provider_id: user.id,
      provider_name: user.nickname,
    }));
    setProviderSearch(user.nickname);
    setProviderDropdownOpen(false);
    setProviderResults([]);
    if (errors.provider_id) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.provider_id;
        return next;
      });
    }
  };

  const clearProvider = () => {
    setForm((prev) => ({ ...prev, provider_id: '', provider_name: '' }));
    setProviderSearch('');
    setProviderResults([]);
  };

  // Close provider dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (providerRef.current && !providerRef.current.contains(e.target as Node)) {
        setProviderDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ─── Form field helpers ─── */

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

  /* ─── Day management ─── */

  const addDay = () => {
    const nextDayNum =
      days.length > 0 ? Math.max(...days.map((d) => d.day_number)) + 1 : 1;
    setDays((prev) => [
      ...prev,
      { day_number: nextDayNum, items: [{ _key: nextKey(), title: '', description: '' }] },
    ]);
  };

  const removeDay = (dayNumber: number) => {
    setDays((prev) => prev.filter((d) => d.day_number !== dayNumber));
    setCollapsedDays((prev) => {
      const next = new Set(prev);
      next.delete(dayNumber);
      return next;
    });
  };

  const duplicateDay = (dayIdx: number) => {
    const source = days[dayIdx];
    const nextDayNum = Math.max(...days.map((d) => d.day_number)) + 1;
    setDays((prev) => [
      ...prev,
      {
        day_number: nextDayNum,
        items: source.items.map((item) => ({
          ...item,
          _key: nextKey(),
        })),
      },
    ]);
  };

  const toggleDayCollapse = (dayNumber: number) => {
    setCollapsedDays((prev) => {
      const next = new Set(prev);
      if (next.has(dayNumber)) next.delete(dayNumber);
      else next.add(dayNumber);
      return next;
    });
  };

  /* ─── Item management ─── */

  const addItem = (dayIdx: number) => {
    setDays((prev) => {
      const next = [...prev];
      next[dayIdx] = {
        ...next[dayIdx],
        items: [
          ...next[dayIdx].items,
          { _key: nextKey(), title: '', description: '' },
        ],
      };
      return next;
    });
  };

  const removeItem = (dayIdx: number, itemIdx: number) => {
    setDays((prev) => {
      const next = [...prev];
      next[dayIdx] = {
        ...next[dayIdx],
        items: next[dayIdx].items.filter((_, i) => i !== itemIdx),
      };
      return next;
    });
  };

  const updateItem = (
    dayIdx: number,
    itemIdx: number,
    field: 'title' | 'description',
    value: string
  ) => {
    setDays((prev) => {
      const next = [...prev];
      const items = [...next[dayIdx].items];
      items[itemIdx] = { ...items[itemIdx], [field]: value };
      next[dayIdx] = { ...next[dayIdx], items };
      return next;
    });
  };

  const moveItem = (dayIdx: number, itemIdx: number, direction: 'up' | 'down') => {
    setDays((prev) => {
      const next = [...prev];
      const items = [...next[dayIdx].items];
      const swapIdx = direction === 'up' ? itemIdx - 1 : itemIdx + 1;
      if (swapIdx < 0 || swapIdx >= items.length) return prev;
      [items[itemIdx], items[swapIdx]] = [items[swapIdx], items[itemIdx]];
      next[dayIdx] = { ...next[dayIdx], items };
      return next;
    });
  };

  /* ─── Validation ─── */

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.provider_id) newErrors.provider_id = '제공자를 선택해주세요.';
    if (!form.title.trim()) newErrors.title = '제목을 입력해주세요.';
    if (!form.category) newErrors.category = '카테고리를 선택해주세요.';
    if (form.price_1week < 0) newErrors.price_1week = '가격은 0 이상이어야 합니다.';
    if (form.price_4week < 0) newErrors.price_4week = '가격은 0 이상이어야 합니다.';
    if (form.price_100days < 0) newErrors.price_100days = '가격은 0 이상이어야 합니다.';

    if (days.length === 0) {
      setGlobalError('최소 1개의 Day를 추가해주세요.');
      setErrors(newErrors);
      return false;
    }

    for (const day of days) {
      if (day.items.length === 0) {
        setGlobalError(`Day ${day.day_number}에 최소 1개의 항목을 추가해주세요.`);
        setErrors(newErrors);
        return false;
      }
      for (const item of day.items) {
        if (!item.title.trim()) {
          setGlobalError(`Day ${day.day_number}의 모든 항목에 제목을 입력해주세요.`);
          setErrors(newErrors);
          return false;
        }
      }
    }

    setErrors(newErrors);
    setGlobalError(null);
    return Object.keys(newErrors).length === 0;
  };

  /* ─── Save ─── */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setGlobalError(null);
    try {
      const items = flattenToItems(days);

      if (isEdit && id) {
        await apiClient.put(`/routines/${id}`, {
          provider_id: form.provider_id,
          title: form.title,
          description: form.description || null,
          category: form.category,
          image_url: form.image_url || null,
          price_1week: form.price_1week,
          price_4week: form.price_4week,
          price_100days: form.price_100days,
          is_published: form.is_published,
        });
        await apiClient.put(`/routines/${id}/items`, { items });
      } else {
        await apiClient.post('/routines', {
          provider_id: form.provider_id,
          title: form.title,
          description: form.description || null,
          category: form.category,
          image_url: form.image_url || null,
          price_1week: form.price_1week,
          price_4week: form.price_4week,
          price_100days: form.price_100days,
          is_published: form.is_published,
          items,
        });
      }

      navigate('/routines');
    } catch {
      setGlobalError('루틴 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  /* ─── Delete ─── */

  const handleDelete = async () => {
    if (!id || deleting) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/routines/${id}`);
      navigate('/routines');
    } catch {
      setGlobalError('루틴 삭제에 실패했습니다.');
    } finally {
      setDeleting(false);
      setDeleteModal(false);
    }
  };

  /* ─── Render ─── */

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

  const totalItems = days.reduce((sum, d) => sum + d.items.length, 0);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/routines')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          루틴 목록
        </button>
        {isEdit && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeleteModal(true)}
          >
            삭제
          </Button>
        )}
      </div>

      <h1 className="text-xl font-bold text-gray-900">
        {isEdit ? '루틴 수정' : '새 루틴 등록'}
      </h1>

      {/* Global Error */}
      {globalError && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm">{globalError}</span>
          <button
            onClick={() => setGlobalError(null)}
            className="ml-auto p-1 hover:bg-red-100 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Info */}
        <Card title="기본 정보">
          <div className="space-y-4">
            {/* Provider Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                제공자 (인플루언서) <span className="text-red-500">*</span>
              </label>
              <div ref={providerRef} className="relative">
                {form.provider_id ? (
                  <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    <span className="flex-1 text-sm text-gray-900">
                      {form.provider_name}
                    </span>
                    <button
                      type="button"
                      onClick={clearProvider}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={providerSearch}
                      onChange={(e) => handleProviderSearchChange(e.target.value)}
                      onFocus={() => {
                        if (providerSearch) setProviderDropdownOpen(true);
                      }}
                      placeholder="닉네임 또는 이메일로 검색..."
                      className={`
                        w-full pl-10 pr-4 py-2 border rounded-lg text-sm
                        focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                        placeholder:text-gray-400 transition-colors
                        ${errors.provider_id ? 'border-red-300' : 'border-gray-300'}
                      `}
                    />
                    {searchingProvider && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
                    )}
                  </div>
                )}

                {/* Provider Dropdown */}
                {providerDropdownOpen && !form.provider_id && (
                  <div className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {providerResults.length > 0 ? (
                      providerResults.map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                          onClick={() => selectProvider(user)}
                        >
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 shrink-0">
                            {user.avatar_url ? (
                              <img
                                src={user.avatar_url}
                                alt=""
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              user.nickname?.charAt(0) || '?'
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {user.nickname}
                            </p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </button>
                      ))
                    ) : providerSearch && !searchingProvider ? (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">
                        검색 결과가 없습니다.
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
              {errors.provider_id && (
                <p className="mt-1 text-sm text-red-500">{errors.provider_id}</p>
              )}
            </div>

            {/* Title */}
            <Input
              label="제목"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="루틴 제목을 입력하세요"
              error={errors.title}
              required
            />

            {/* Description */}
            <Textarea
              label="설명"
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="루틴에 대한 설명을 입력하세요"
              rows={4}
            />

            {/* Category */}
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

            {/* Image URL */}
            <Input
              label="이미지 URL"
              value={form.image_url}
              onChange={(e) => updateField('image_url', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            {form.image_url && (
              <img
                src={form.image_url}
                alt="미리보기"
                className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
          </div>
        </Card>

        {/* Section 2: Pricing */}
        <Card title="가격 설정">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="1 WEEK 가격 (원)"
              type="number"
              value={form.price_1week}
              onChange={(e) => updateField('price_1week', Number(e.target.value))}
              min={0}
              step={100}
              error={errors.price_1week}
            />
            <Input
              label="4 WEEK 가격 (원)"
              type="number"
              value={form.price_4week}
              onChange={(e) => updateField('price_4week', Number(e.target.value))}
              min={0}
              step={100}
              error={errors.price_4week}
            />
            <Input
              label="100 Days 가격 (원)"
              type="number"
              value={form.price_100days}
              onChange={(e) => updateField('price_100days', Number(e.target.value))}
              min={0}
              step={100}
              error={errors.price_100days}
            />
          </div>
          <p className="mt-2 text-xs text-gray-400">
            기본 가격: 1주 1,400원 / 4주 5,600원 / 100일 20,000원
          </p>
        </Card>

        {/* Section 3: Routine Items (Day-by-Day) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                루틴 아이템 (할 일 목록)
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                총 {days.length}일, {totalItems}개 항목
              </p>
            </div>
            <div className="flex items-center gap-2">
              {days.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (collapsedDays.size === days.length) {
                      setCollapsedDays(new Set());
                    } else {
                      setCollapsedDays(new Set(days.map((d) => d.day_number)));
                    }
                  }}
                >
                  {collapsedDays.size === days.length ? '모두 펼치기' : '모두 접기'}
                </Button>
              )}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                onClick={addDay}
              >
                Day 추가
              </Button>
            </div>
          </div>

          {days.length === 0 && (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
              <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 mb-4">
                아직 Day가 없습니다. Day를 추가해서 할 일을 입력하세요.
              </p>
              <Button type="button" size="sm" onClick={addDay}>
                첫 번째 Day 추가
              </Button>
            </div>
          )}

          {days.map((day, dayIdx) => {
            const isCollapsed = collapsedDays.has(day.day_number);

            return (
              <div
                key={day.day_number}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden"
              >
                {/* Day Header */}
                <div
                  className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200 cursor-pointer select-none"
                  onClick={() => toggleDayCollapse(day.day_number)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary text-white text-sm font-bold rounded-lg">
                      {day.day_number}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Day {day.day_number}
                    </h3>
                    <span className="text-xs text-gray-400">
                      ({day.items.length}개 항목)
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Day 복제"
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateDay(dayIdx);
                      }}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Day 삭제"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeDay(day.day_number);
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="ml-1 text-gray-400">
                      {isCollapsed ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronUp className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Day Items */}
                {!isCollapsed && (
                  <div className="p-4 space-y-3">
                    {day.items.map((item, itemIdx) => (
                      <div
                        key={item._key}
                        className="flex gap-2 items-start group"
                      >
                        {/* Reorder & Number */}
                        <div className="flex flex-col items-center pt-2 gap-0.5 shrink-0">
                          <GripVertical className="w-4 h-4 text-gray-300" />
                          <button
                            type="button"
                            className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-30 transition-colors"
                            disabled={itemIdx === 0}
                            onClick={() => moveItem(dayIdx, itemIdx, 'up')}
                            title="위로"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-30 transition-colors"
                            disabled={itemIdx === day.items.length - 1}
                            onClick={() => moveItem(dayIdx, itemIdx, 'down')}
                            title="아래로"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Item Number Badge */}
                        <div className="flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-500 text-xs font-medium rounded mt-2 shrink-0">
                          {itemIdx + 1}
                        </div>

                        {/* Item Fields */}
                        <div className="flex-1 space-y-1.5">
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) =>
                              updateItem(dayIdx, itemIdx, 'title', e.target.value)
                            }
                            placeholder="할 일 제목 (필수)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-gray-400 transition-colors"
                          />
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) =>
                              updateItem(dayIdx, itemIdx, 'description', e.target.value)
                            }
                            placeholder="설명 (선택)"
                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-gray-400 transition-colors"
                          />
                        </div>

                        {/* Remove Item */}
                        <button
                          type="button"
                          className="mt-2 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                          title="항목 삭제"
                          onClick={() => removeItem(dayIdx, itemIdx)}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    {/* Add Item Button */}
                    <button
                      type="button"
                      onClick={() => addItem(dayIdx)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      항목 추가
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Section 4: Publish & Actions */}
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
                <p className="text-sm font-medium text-gray-900">즉시 공개</p>
                <p className="text-xs text-gray-500">
                  {form.is_published
                    ? '저장 즉시 사용자에게 노출됩니다.'
                    : '비공개 상태로 저장됩니다. 나중에 공개할 수 있습니다.'}
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
                {isEdit ? '저장' : '등록'}
              </Button>
            </div>
          </div>
        </Card>
      </form>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="루틴 삭제"
        size="sm"
        actions={
          <>
            <Button variant="secondary" onClick={() => setDeleteModal(false)}>
              취소
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting}>
              삭제
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            <strong>"{form.title}"</strong> 루틴을 삭제하시겠습니까?
          </p>
          <p className="text-xs text-red-500">
            이 작업은 되돌릴 수 없습니다. 관련된 모든 아이템 데이터가 삭제됩니다.
          </p>
        </div>
      </Modal>
    </div>
  );
}
