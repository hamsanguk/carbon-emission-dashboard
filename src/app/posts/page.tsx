'use client';
import { useEffect, useState } from 'react';
import { fetchPosts, createOrUpdatePost} from '@/app/lib/api';
import { Post } from '../lib/types';
import PostEditor from '@/app/components/PostEditor';
import PostCard from '@/app/components/PostCard';
import { useDashboardStore } from '@/app/store/useDashboardStore';

export default function PostsPage() {
  const { activeCompanyId } = useDashboardStore();
  const [items, setItems] = useState<(Post & { failed?: boolean })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchPosts().then(ps => {
      if (mounted) {
        // 최신순 정렬 (조정 가능)
        const sorted = [...ps].sort((a, b) => (a.dateTime < b.dateTime ? 1 : -1));
        setItems(sorted);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  // 낙관적 추가
  function handleOptimisticAdd(draft: Post) {
    setItems(prev => [draft, ...prev]);
  }

  // 성공 시 temp → 실제 ID 치환
  function handleResolve(tempId: string, saved: Post) {
    setItems(prev =>
      prev.map(x => (x.id === tempId ? saved : x))
    );
  }

  // 실패 시 temp 항목에 failed 플래그
  function handleFail(tempId: string) {
    setItems(prev =>
      prev.map(x => (x.id === tempId ? { ...x, failed: true } : x))
    );
  }

  // 실패 항목 재시도
  async function retrySave(temp: Post) {
    // temp.id는 temp-... 이므로 새로 저장
    try {
      const saved = await createOrUpdatePost({
        title: temp.title,
        content: temp.content,
        resourceUid: temp.resourceUid,
        dateTime: temp.dateTime,
        reaction: temp.reaction ?? 'none',
      });
      // 교체
      setItems(prev => prev.map(x => (x.id === temp.id ? saved : x)));
    } catch {
      // 여전히 실패면 그대로 유지(배지 지속)
    }
  }

  // 로컬 반응/내용 동기
  function updateLocalPost(next: Post) {
    setItems(prev => prev.map(x => (x.id === next.id ? { ...x, ...next } : x)));
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Posts</h2>
      <PostEditor
        defaultCompanyId={activeCompanyId ?? 'c1'}
        onOptimisticAdd={handleOptimisticAdd}
        onResolve={handleResolve}
        onFail={handleFail}
      />

      {loading ? (
        <div className="text-slate-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {items.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onRetrySave={post.failed ? retrySave : undefined}
              onUpdateLocal={updateLocalPost}
            />
          ))}
          {items.length === 0 && (
            <div className="text-slate-500 text-sm">No posts yet.</div>
          )}
        </div>
      )}
    </div>
  );
}
