import Fuse from 'fuse.js';
import { cheatsheets } from '@/data/cheatsheets';

const fuse = new Fuse(cheatsheets, {
  keys: ['title', 'content'],
  threshold: 0.4,
  includeScore: true,
});

export function searchCheatsheets(query: string) {
  if (!query.trim()) return [];
  return fuse.search(query).map(r => r.item);
}
