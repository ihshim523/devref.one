'use client';

import { Printer } from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import CopyButton from './CopyButton';

function renderInline(text: string): React.ReactNode {
  const segments = text.split(/(`[^`]+`)/g);
  return segments.map((seg, i) => {
    if (seg.startsWith('`') && seg.endsWith('`')) {
      return <code key={i}>{seg.slice(1, -1)}</code>;
    }
    return renderFormatting(seg, i);
  });
}

function renderFormatting(text: string, baseKey: number): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let last = 0;
  const regex = /\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|__(.+?)__|\*(.+?)\*|_(.+?)_|~~(.+?)~~|\[(.+?)\]\((.+?)\)/g;
  let match: RegExpExecArray | null;
  let key = baseKey * 1000;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    if (match[1]) {
      parts.push(<strong key={key++}><em>{match[1]}</em></strong>);
    } else if (match[2]) {
      parts.push(<strong key={key++}>{match[2]}</strong>);
    } else if (match[3]) {
      parts.push(<strong key={key++}>{match[3]}</strong>);
    } else if (match[4]) {
      parts.push(<em key={key++}>{match[4]}</em>);
    } else if (match[5]) {
      parts.push(<em key={key++}>{match[5]}</em>);
    } else if (match[6]) {
      parts.push(<del key={key++}>{match[6]}</del>);
    } else if (match[7] && match[8]) {
      parts.push(<a key={key++} href={match[8]}>{match[7]}</a>);
    }
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    parts.push(text.slice(last));
  }

  return parts.length > 0 ? parts : text;
}

function renderTable(lines: string[], key: number) {
  const rows = lines.filter(l => l.trim() && !/^[\s|:\-]+$/.test(l.trim()));
  if (rows.length < 2) return null;

  const parseRow = (row: string) =>
    row.split('|').slice(1, -1).map(c => c.trim());

  return (
    <table key={key}>
      <thead>
        <tr>
          {parseRow(rows[0]).map((h, i) => (
            <th key={i}>{renderInline(h)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.slice(1).map((row, i) => (
          <tr key={i}>
            {parseRow(row).map((c, j) => (
              <td key={j}>{renderInline(c)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function renderBlock(block: string, key: number): React.ReactNode {
  if (block.startsWith('```')) {
    const lines = block.split('\n');
    const lang = lines[0].replace(/^```/, '');
    const code = lines.slice(1, lines.length > 1 && lines[lines.length - 1].startsWith('```') ? -1 : undefined).join('\n');
    return (
      <div key={key} className="relative group">
        <pre><code>{code}</code></pre>
        <CopyButton text={code} />
      </div>
    );
  }

  const lines = block.split('\n');

  if (lines.length === 1) {
    const m = lines[0].match(/^(#{1,6})\s+(.+)/);
    if (m) {
      const level = m[1].length;
      const content = renderInline(m[2]);
      switch (level) {
        case 1: return <h1 key={key}>{content}</h1>;
        case 2: return <h2 key={key}>{content}</h2>;
        case 3: return <h3 key={key}>{content}</h3>;
        case 4: return <h4 key={key}>{content}</h4>;
        case 5: return <h5 key={key}>{content}</h5>;
        case 6: return <h6 key={key}>{content}</h6>;
      }
    }
  }

  if (lines.every(l => l.trim().startsWith('|') && l.trim().endsWith('|'))) {
    return renderTable(lines, key);
  }

  if (lines.length === 1 && /^(-{3,}|\*{3,}|_{3,})$/.test(lines[0])) {
    return <hr key={key} />;
  }

  if (lines.every(l => l.startsWith('>'))) {
    const content = lines.map(l => l.replace(/^>\s?/, '')).join('\n');
    return <blockquote key={key}>{renderInline(content)}</blockquote>;
  }

  if (lines[0]?.match(/^[-*]\s/)) {
    const items = lines.reduce<string[]>((acc, l) => {
      if (l.match(/^[-*]\s/)) acc.push(l.replace(/^[-*]\s+/, ''));
      return acc;
    }, []);
    return (
      <ul key={key}>
        {items.map((item, i) => (
          <li key={i}>{renderInline(item)}</li>
        ))}
      </ul>
    );
  }

  if (lines[0]?.match(/^\d+\.\s/)) {
    const items = lines.reduce<string[]>((acc, l) => {
      if (l.match(/^\d+\.\s/)) acc.push(l.replace(/^\d+\.\s+/, ''));
      return acc;
    }, []);
    return (
      <ol key={key}>
        {items.map((item, i) => (
          <li key={i}>{renderInline(item)}</li>
        ))}
      </ol>
    );
  }

  return <p key={key}>{renderInline(block)}</p>;
}

function MarkdownRenderer({ content }: { content: string }) {
  const blocks: string[] = [];
  const lines = content.split('\n');
  let i = 0;

  while (i < lines.length) {
    if (lines[i].startsWith('```')) {
      const codeLines: string[] = [];
      do {
        codeLines.push(lines[i]);
        i++;
      } while (i < lines.length && !lines[i].startsWith('```'));
      if (i < lines.length) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push(codeLines.join('\n'));
    } else if (lines[i] === '') {
      i++;
    } else {
      const textLines: string[] = [];
      while (i < lines.length && lines[i] !== '' && !lines[i].startsWith('```')) {
        textLines.push(lines[i]);
        i++;
      }
      blocks.push(textLines.join('\n'));
    }
  }

  return (
    <div className="cheatsheet-content" data-print-pdf>
      {blocks.map((block, idx) => renderBlock(block, idx))}
    </div>
  );
}

export default function CheatsheetContent({ content, slug }: { content: string; slug: string }) {
  return (
    <div className="flex-1 py-10 px-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/cheatsheets"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          <ArrowLeft size={14} />
          Back to all cheatsheets
        </Link>
        <button
          onClick={() => window.print()}
          className="print-pdf-btn inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          aria-label="Print or save as PDF"
        >
          <Printer size={14} />
          Print / PDF
        </button>
      </div>
      <MarkdownRenderer content={content} />
    </div>
  );
}
