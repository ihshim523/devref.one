'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { searchCheatsheets } from '@/lib/search';
import { cheatsheets } from '@/data/cheatsheets';
import type { Cheatsheet } from '@/data/cheatsheets';

const categories = ['Languages', 'Frameworks & Tools', 'DevOps', 'Data & Formats'] as const;

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Cheatsheet[]>([]);
  const [open, setOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const doSearch = useCallback((q: string) => {
    const raw = searchCheatsheets(q);
    if (activeFilters.size > 0) {
      setResults(raw.filter(r => activeFilters.has(r.category)));
    } else {
      setResults(raw);
    }
    setOpen(true);
  }, [activeFilters]);

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
    if (query.trim()) {
      doSearch(query);
    }
  }, [activeFilters, query, doSearch]);

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

  function toggleFilter(cat: string) {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  }

  function groupedResults() {
    const groups: Record<string, Cheatsheet[]> = {};
    for (const r of results) {
      (groups[r.category] ??= []).push(r);
    }
    return groups;
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

      <div className="flex flex-wrap gap-1.5 mt-2">
        {categories.map(cat => {
          const active = activeFilters.has(cat);
          return (
            <button
              key={cat}
              onClick={() => toggleFilter(cat)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full border transition-colors ${
                active
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-[var(--card)] text-[var(--muted)] border-[var(--border)] hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              {cat}
              {active && <X size={12} />}
            </button>
          );
        })}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          <div className="px-3 py-1.5 text-xs text-[var(--muted)] border-b border-[var(--border)]">
            {results.length} result{results.length !== 1 ? 's' : ''}
            {activeFilters.size > 0 && ' (filtered)'}
          </div>
          {Object.entries(groupedResults()).map(([cat, items]) => (
            <div key={cat}>
              <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--muted)] bg-[var(--code-bg)]">
                {cat}
              </div>
              {items.map(cheatsheet => (
                <Link
                  key={cheatsheet.slug}
                  href={`/cheatsheets/${cheatsheet.slug}`}
                  onClick={() => { setOpen(false); setQuery(''); }}
                  className="block px-3 py-2 text-sm hover:bg-[var(--sidebar-hover)] transition-colors"
                >
                  <span className="font-medium">{cheatsheet.title}</span>
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
