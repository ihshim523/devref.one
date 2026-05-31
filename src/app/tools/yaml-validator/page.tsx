'use client';

import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

function parseYaml(source: string): string {
  const lines = source.split('\n');
  const result: Record<string, unknown> = {};
  const stack: { indent: number; obj: Record<string, unknown> }[] = [
    { indent: -1, obj: result },
  ];
  let currentArray: unknown[] | null = null;
  let currentArrayIndent = -1;

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const raw = lines[lineIdx];
    const trimmed = raw.trim();

    if (trimmed === '' || trimmed.startsWith('#')) continue;

    const indent = raw.length - raw.trimStart().length;

    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }

    if (trimmed.startsWith('- ')) {
      const value = trimmed.slice(2).trim();
      if (currentArray === null || indent <= currentArrayIndent) {
        currentArray = [];
        currentArrayIndent = indent;
        const parent = stack[stack.length - 1].obj;
        const keys = Object.keys(parent);
        if (keys.length > 0) {
          parent[keys[keys.length - 1]] = currentArray;
        }
      }
      if (value.includes(':')) {
        const colonIdx = value.indexOf(':');
        const k = value.slice(0, colonIdx).trim();
        const v = value.slice(colonIdx + 1).trim();
        const sub: Record<string, unknown> = {};
        if (v) {
          sub[k] = parseScalar(v);
        }
        currentArray.push(sub);
        if (!v) {
          stack.push({ indent: indent + 1, obj: sub });
        }
      } else {
        currentArray.push(parseScalar(value));
      }
    } else if (trimmed.includes(':')) {
      currentArray = null;
      const colonIdx = trimmed.indexOf(':');
      const key = trimmed.slice(0, colonIdx).trim();
      const value = trimmed.slice(colonIdx + 1).trim();
      const parent = stack[stack.length - 1].obj;

      if (value === '' || value === '|' || value === '>') {
        const sub: Record<string, unknown> = {};
        parent[key] = sub;
        stack.push({ indent, obj: sub });
      } else {
        parent[key] = parseScalar(value);
      }
    } else {
      throw new Error(`Unexpected content at line ${lineIdx + 1}: ${trimmed}`);
    }
  }

  return JSON.stringify(result, null, 2);
}

function parseScalar(value: string): unknown {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null') return null;
  const num = Number(value);
  if (!isNaN(num) && value.trim() !== '') return num;
  if (
    (value.startsWith("'") && value.endsWith("'")) ||
    (value.startsWith('"') && value.endsWith('"'))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

export default function YamlValidatorPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<{ ok: true; formatted: string } | { ok: false; error: string } | null>(null);

  function validate() {
    if (!input.trim()) {
      setOutput({ ok: false, error: 'Input is empty.' });
      return;
    }
    try {
      const formatted = parseYaml(input);
      setOutput({ ok: true, formatted });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setOutput({ ok: false, error: msg });
    }
  }

  return (
    <div className="flex-1 py-10 px-6 max-w-4xl mx-auto w-full">
      <h1 className="text-2xl font-bold mb-2">YAML Validator</h1>
      <p className="text-sm text-[var(--muted)] mb-6">Paste YAML to validate and convert to JSON.</p>

      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="key: value&#10;nested:&#10;  sub: hello&#10;items:&#10;  - one&#10;  - two"
        rows={10}
        className="w-full p-3 text-sm font-mono rounded-lg bg-[var(--card)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-blue-500/40 placeholder-[var(--muted)] resize-y"
      />

      <button
        onClick={validate}
        className="mt-3 px-5 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      >
        Validate
      </button>

      {output && (
        <div className="mt-6">
          <div className={`flex items-center gap-2 text-sm font-medium mb-3 ${output.ok ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {output.ok ? <CheckCircle size={18} /> : <XCircle size={18} />}
            {output.ok ? 'Valid YAML' : 'Invalid YAML'}
          </div>
          {output.ok ? (
            <pre className="p-4 rounded-lg bg-[var(--code-bg)] border border-[var(--border)] text-sm font-mono overflow-x-auto">
              {output.formatted}
            </pre>
          ) : (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm font-mono text-red-700 dark:text-red-300">
              {output.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
