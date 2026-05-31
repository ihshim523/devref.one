'use client';

import { useState, useMemo } from 'react';

interface MatchResult {
  full: string;
  index: number;
  groups: string[];
}

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testStr, setTestStr] = useState('');

  const result = useMemo((): { ok: boolean; matches: MatchResult[]; error?: string } => {
    if (!pattern.trim() || !testStr) {
      return { ok: true, matches: [] };
    }
    try {
      const regex = new RegExp(pattern, flags);
      const matches: MatchResult[] = [];
      let m: RegExpExecArray | null;
      while ((m = regex.exec(testStr)) !== null) {
        matches.push({
          full: m[0],
          index: m.index,
          groups: m.slice(1),
        });
        if (m.index === regex.lastIndex) regex.lastIndex++;
      }
      return { ok: true, matches };
    } catch (e) {
      return { ok: false, matches: [], error: e instanceof Error ? e.message : String(e) };
    }
  }, [pattern, flags, testStr]);

  function highlightText() {
    if (!result.ok || !result.matches.length) {
      return <span>{testStr}</span>;
    }

    const parts: React.ReactNode[] = [];
    let lastIdx = 0;

    for (const m of result.matches) {
      if (m.index > lastIdx) {
        parts.push(<span key={`t-${lastIdx}`}>{testStr.slice(lastIdx, m.index)}</span>);
      }
      parts.push(
        <mark key={`m-${m.index}`} className="bg-yellow-300 dark:bg-yellow-600/40 rounded px-0.5">
          {testStr.slice(m.index, m.index + m.full.length)}
        </mark>
      );
      lastIdx = m.index + m.full.length;
    }

    if (lastIdx < testStr.length) {
      parts.push(<span key={`t-${lastIdx}`}>{testStr.slice(lastIdx)}</span>);
    }

    return parts;
  }

  return (
    <div className="flex-1 py-10 px-6 max-w-4xl mx-auto w-full">
      <h1 className="text-2xl font-bold mb-2">Regex Tester</h1>
      <p className="text-sm text-[var(--muted)] mb-6">Test regular expressions live against a string.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-[var(--muted)] mb-1">Pattern</label>
          <input
            type="text"
            value={pattern}
            onChange={e => setPattern(e.target.value)}
            placeholder="/d+"
            className="w-full px-3 py-2 text-sm font-mono rounded-lg bg-[var(--card)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-blue-500/40 placeholder-[var(--muted)]"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--muted)] mb-1">Flags</label>
          <input
            type="text"
            value={flags}
            onChange={e => setFlags(e.target.value)}
            placeholder="g"
            className="w-full px-3 py-2 text-sm font-mono rounded-lg bg-[var(--card)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-blue-500/40 placeholder-[var(--muted)]"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-medium text-[var(--muted)] mb-1">Test String</label>
        <textarea
          value={testStr}
          onChange={e => setTestStr(e.target.value)}
          placeholder="Enter test string here..."
          rows={6}
          className="w-full p-3 text-sm font-mono rounded-lg bg-[var(--card)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-blue-500/40 placeholder-[var(--muted)] resize-y"
        />
      </div>

      {pattern && !result.ok && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm font-mono text-red-700 dark:text-red-300 mb-4">
          {result.error}
        </div>
      )}

      {testStr && (
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-medium">
              {result.ok ? `${result.matches.length} match${result.matches.length !== 1 ? 'es' : ''}` : 'Error'}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm font-mono whitespace-pre-wrap leading-relaxed">
            {highlightText()}
          </div>
        </div>
      )}

      {result.ok && result.matches.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2">Match Details</h3>
          <div className="space-y-2">
            {result.matches.map((m, i) => (
              <div key={i} className="p-3 rounded-lg bg-[var(--code-bg)] border border-[var(--border)] text-sm font-mono">
                <div>
                  <span className="text-[var(--muted)]">Match #{i + 1}</span>
                  <span className="text-[var(--muted)] ml-3">position: {m.index}</span>
                </div>
                <div className="mt-1">&quot;{m.full}&quot;</div>
                {m.groups.length > 0 && (
                  <div className="mt-1 text-[var(--muted)]">
                    Groups: {m.groups.map((g, j) => (
                      <span key={j} className="ml-2">${j + 1}=&quot;{g}&quot;</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
