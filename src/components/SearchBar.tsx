'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { searchCheatsheets } from '@/lib/search';
import type { Cheatsheet } from '@/data/cheatsheets';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Cheatsheet[]>([]);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const doSearch = useCallback((q: string) => {
    setResults(searchCheatsheets(q));
    setOpen(true);
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    timerRef.current = setTimeout(() => doSearch(query), 300);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query, doSearch]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  return (
    <div ref={containerRef} className="relative search-bar">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search cheatsheets..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => { if (results.length) setOpen(true); }}
          onKeyDown={handleKeyDown}
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-[var(--card)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-blue-500/40 placeholder-[var(--muted)]"
        />
      </div>
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          <div className="px-3 py-1.5 text-xs text-[var(--muted)] border-b border-[var(--border)]">
            {results.length} result{results.length !== 1 ? 's' : ''}
          </div>
          {results.map(cheatsheet => (
            <Link
              key={cheatsheet.slug}
              href={`/cheatsheets/${cheatsheet.slug}`}
              onClick={() => { setOpen(false); setQuery(''); }}
              className="block px-3 py-2 text-sm hover:bg-[var(--sidebar-hover)] transition-colors"
            >
              <span className="font-medium">{cheatsheet.title}</span>
              <span className="text-[var(--muted)] ml-2 text-xs">{cheatsheet.category}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
