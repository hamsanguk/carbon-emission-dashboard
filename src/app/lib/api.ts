// src/app/lib/api.ts
import type { Company, Post } from "./types";
import { seedCompanies, seedPosts } from "./mockData";

// deep clone 유틸
function deepClone<T>(obj: T): T {
  if (typeof (globalThis as any).structuredClone === "function") {
    return (globalThis as any).structuredClone(obj);
  }
  return JSON.parse(JSON.stringify(obj));
}

// 런타임 상태
let _companies: Company[] = deepClone(seedCompanies);
let _posts: Post[] = deepClone(seedPosts);

// ---- 새로 추가: 씨드 변경 감지 & 동기화 ----
function companiesSignature(cs: Company[]) {
  // id와 country만으로도 변경 감지가 충분 (필요하면 emissions 길이도 포함)
  return cs.map(c => `${c.id}:${c.country}`).sort().join("|");
}
function postsSignature(ps: Post[]) {
  return ps.map(p => p.id).sort().join("|");
}
let seedCompaniesSig = companiesSignature(seedCompanies);
let seedPostsSig = postsSignature(seedPosts);

function syncSeedsIfChanged() {
  const curCompaniesSig = companiesSignature(seedCompanies);
  const curPostsSig = postsSignature(seedPosts);

  if (curCompaniesSig !== seedCompaniesSig) {
    _companies = deepClone(seedCompanies);
    seedCompaniesSig = curCompaniesSig;
  }
  if (curPostsSig !== seedPostsSig) {
    _posts = deepClone(seedPosts);
    seedPostsSig = curPostsSig;
  }
}
// -------------------------------------------

// 리셋(수동 초기화가 필요할 때)
export function resetMockState() {
  _companies = deepClone(seedCompanies);
  _posts = deepClone(seedPosts);
  seedCompaniesSig = companiesSignature(seedCompanies);
  seedPostsSig = postsSignature(seedPosts);
}

// READ
export async function fetchCompanies(): Promise<Company[]> {
  // ---- 추가: fetch 시 씨드 변경을 반영 ----
  syncSeedsIfChanged();
  await delay(jitter());
  return deepClone(_companies);
}

export async function fetchPosts(): Promise<Post[]> {
  syncSeedsIfChanged();
  await delay(jitter());
  return deepClone(_posts);
}

// delay/실패율 유틸
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
const jitter = () => 200 + Math.random() * 600;
const maybeFail = () => Math.random() < 0.15;

// WRITE
export async function createOrUpdatePost(p: Omit<Post, "id"> & { id?: string }): Promise<Post> {
  await delay(jitter());
  if (maybeFail()) throw new Error("Save failed");

  if (p.id) {
    const next: Post = { ...(p as Post) };
    _posts = _posts.map(x => (x.id === next.id ? next : x));
    return deepClone(next);
  }
  const created: Post = { ...p, id: crypto.randomUUID() } as Post;
  _posts = [created, ..._posts];
  return deepClone(created);
}

export async function toggleReaction(postId: string, reaction: 'like' | 'dislike' | 'none'): Promise<Post> {
  await delay(jitter());
  if (maybeFail()) throw new Error("Reaction failed");
  _posts = _posts.map(p => (p.id === postId ? { ...p, reaction } : p));
  const updated = _posts.find(p => p.id === postId)!;
  return deepClone(updated);
}
