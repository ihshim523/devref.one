'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Code2, Wrench, Terminal, Database, Beaker, FileJson, Regex, Keyboard } from 'lucide-react';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';

const iconMap: Record<string, React.ReactNode> = {
  'Languages': <Code2 size={16} />,
  'Frameworks & Tools': <Wrench size={16} />,
  'DevOps': <Terminal size={16} />,
  'Data & Formats': <Database size={16} />,
};

interface CategoryItem {
  slug: string;
  title: string;
}

interface MobileMenuProps {
  categories: Record<string, CategoryItem[]>;
}

export default function MobileMenu({ categories }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') setOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2 rounded-lg hover:bg-[var(--sidebar-hover)] transition-colors mobile-menu-btn"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 mobile-overlay"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        role="dialog"
        aria-modal="true"
        onKeyDown={handleKeyDown}
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-[var(--sidebar)] border-r border-[var(--border)] transform transition-transform duration-200 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <Link href="/" className="text-lg font-bold tracking-tight">
            devref<span className="text-blue-500">.one</span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded-lg hover:bg-[var(--sidebar-hover)] transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-3 border-b border-[var(--border)]">
          <SearchBar />
        </div>
        <nav className="overflow-y-auto p-3 space-y-4" style={{ height: 'calc(100% - 140px)' }}>
          {Object.entries(categories).map(([category, items]) => (
            <div key={category}>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-1.5 px-2">
                {iconMap[category]}
                {category}
              </div>
              <ul className="space-y-0.5">
                {items.map(item => (
                  <li key={item.slug}>
                    <Link
                      href={`/cheatsheets/${item.slug}`}
                      className={`block px-2 py-1.5 text-sm rounded-md transition-colors ${
                        pathname === `/cheatsheets/${item.slug}`
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium'
                          : 'hover:bg-[var(--sidebar-hover)]'
                      }`}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-1.5 px-2">
              <Beaker size={16} />
              Tools
            </div>
            <ul className="space-y-0.5">
              {[
                { href: '/tools/json-validator', label: 'JSON Validator', icon: <FileJson size={16} /> },
                { href: '/tools/yaml-validator', label: 'YAML Validator', icon: <FileJson size={16} /> },
                { href: '/tools/regex-tester', label: 'Regex Tester', icon: <Regex size={16} /> },
                { href: '/tools/vim-trainer', label: 'Vim Trainer', icon: <Keyboard size={16} /> },
              ].map(tool => (
                <li key={tool.href}>
                  <Link
                    href={tool.href}
                    className={`flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors ${
                      pathname === tool.href
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium'
                        : 'hover:bg-[var(--sidebar-hover)]'
                    }`}
                  >
                    {tool.icon}
                    {tool.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-between px-2 pt-2 border-t border-[var(--border)]">
            <span className="text-xs text-[var(--muted)]">Theme</span>
            <ThemeToggle />
          </div>
        </nav>
      </aside>
    </>
  );
}
