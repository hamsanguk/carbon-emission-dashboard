'use client';
import { useState } from 'react';
import { createOrUpdatePost } from '@/app/lib/api';
import { Post } from '../lib/types';

type Props = {
  defaultCompanyId: string; 
  onOptimisticAdd: (draft: Post) => void;
  onResolve: (tempId: string, saved: Post) => void;
  onFail: (tempId: string) => void;
};

export default function PostEditor({ defaultCompanyId, onOptimisticAdd, onResolve, onFail }: Props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!title.trim()) return;
    const tempId = `temp-${Date.now()}`;
    const draft: Post = {
      id: tempId,
      title,
      content,
      resourceUid: defaultCompanyId,
      dateTime: new Date().toISOString().slice(0, 7), // YYYY-MM
      reaction: 'none',
    };
    // 낙관적 추가
    onOptimisticAdd(draft);

    setSaving(true);
    try {
      const saved = await createOrUpdatePost({
        title: draft.title,
        content: draft.content,
        resourceUid: draft.resourceUid,
        dateTime: draft.dateTime,
        reaction: 'none',
      });
      onResolve(tempId, saved);
      // 폼 초기화
      setTitle('');
      setContent('');
    } catch {
      onFail(tempId);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h3 className="text-lg font-semibold mb-3">New Post</h3>
      <input
        className="border rounded w-full p-2 mb-2"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <textarea
        className="border rounded w-full p-2 mb-3"
        rows={3}
        placeholder="Content"
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <button
        onClick={handleSave}
        disabled={saving || !title.trim()}
        className="bg-primary text-white rounded px-4 py-2 disabled:opacity-60"
      >
        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
}
