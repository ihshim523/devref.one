'use client';

import { useState, useCallback } from 'react';
import { Clipboard, Check } from 'lucide-react';

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-1.5 rounded-md bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--card-hover)] transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
      aria-label="Copy code"
    >
      {copied ? <Check size={14} /> : <Clipboard size={14} />}
      {copied && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs bg-[var(--foreground)] text-[var(--background)] px-2 py-1 rounded shadow">
          Copied!
        </span>
      )}
    </button>
  );
}
