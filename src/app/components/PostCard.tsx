'use client';
import { useState } from 'react';
import { toggleReaction } from '../lib/api';
import { Post } from '../lib/types';

type Props = {
  post: Post & { failed?: boolean }; // 실패 뱃지 표시 용도
  onRetrySave?: (p: Post) => void;
  onUpdateLocal: (p: Post) => void;
};

export default function PostCard({ post, onRetrySave, onUpdateLocal }: Props) {
  const [pending, setPending] = useState<'like' | 'dislike' | 'none' | null>(null);

  async function handleReaction(next: 'like' | 'dislike' | 'none') {
    // 낙관적 반영
    const prev = post.reaction ?? 'none';
    onUpdateLocal({ ...post, reaction: next });
    setPending(next);
    try {
      await toggleReaction(post.id, next);
    } catch {
      // 롤백
      onUpdateLocal({ ...post, reaction: prev });
    } finally {
      setPending(null);
    }
  }

  const isTemp = post.id.startsWith('temp-');
  const failed = Boolean(post.failed);

  return (
    <div className="border rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-base">{post.title}</h4>
        <span className="text-xs text-slate-500">{post.dateTime}</span>
      </div>
      <p className="text-sm text-slate-700 mt-2 whitespace-pre-line">{post.content}</p>

      <div className="mt-3 flex items-center gap-2">
        <button
          className={`px-3 py-1 rounded border ${post.reaction === 'like' ? 'bg-accent text-white border-accent' : 'bg-white text-primary border-primary'}`}
          disabled={pending !== null}
          onClick={() => handleReaction(post.reaction === 'like' ? 'none' : 'like')}
        >
          Like
        </button>
        <button
          className={`px-3 py-1 rounded border ${post.reaction === 'dislike' ? 'bg-slate-700 text-white border-slate-700' : 'bg-white text-slate-700 border-slate-700'}`}
          disabled={pending !== null}
          onClick={() => handleReaction(post.reaction === 'dislike' ? 'none' : 'dislike')}
        >
          Dislike
        </button>

        {isTemp && !failed && (
          <span className="ml-2 text-xs text-slate-500">pending...</span>
        )}
        {failed && (
          <span className="ml-2 text-xs text-red-600 font-medium">save failed</span>
        )}
      </div>

      {failed && onRetrySave && (
        <div className="mt-3">
          <button
            className="px-3 py-1 rounded bg-primary text-white"
            onClick={() => onRetrySave(post)}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
