'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Code2, Wrench, Terminal, Database } from 'lucide-react';
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

interface SidebarProps {
  categories: Record<string, CategoryItem[]>;
}

export default function Sidebar({ categories }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (slug: string) => pathname === `/cheatsheets/${slug}`;

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-[var(--sidebar)] border-r border-[var(--border)] sidebar">
      <div className="p-4 border-b border-[var(--border)]">
        <Link href="/" className="text-lg font-bold tracking-tight">
          devref<span className="text-blue-500">.one</span>
        </Link>
      </div>
      <div className="p-3 border-b border-[var(--border)]">
        <SearchBar />
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-4">
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
                      isActive(item.slug)
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
      </nav>
      <div className="p-3 border-t border-[var(--border)] flex items-center justify-between">
        <span className="text-xs text-[var(--muted)]">Theme</span>
        <ThemeToggle />
      </div>
    </aside>
  );
}
