'use client';

import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function JsonValidatorPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<{ ok: true; formatted: string } | { ok: false; error: string } | null>(null);

  function validate() {
    try {
      const parsed = JSON.parse(input);
      setOutput({ ok: true, formatted: JSON.stringify(parsed, null, 2) });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setOutput({ ok: false, error: msg });
    }
  }

  return (
    <div className="flex-1 py-10 px-6 max-w-4xl mx-auto w-full">
      <h1 className="text-2xl font-bold mb-2">JSON Validator</h1>
      <p className="text-sm text-[var(--muted)] mb-6">Paste JSON to validate, format, and pretty-print.</p>

      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder='{"key": "value"}'
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
            {output.ok ? 'Valid JSON' : 'Invalid JSON'}
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
