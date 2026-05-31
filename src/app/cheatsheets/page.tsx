import { cheatsheets } from "@/data/cheatsheets";
import Link from "next/link";

const categories = cheatsheets.reduce<Record<string, typeof cheatsheets>>((acc, c) => {
  (acc[c.category] ??= []).push(c);
  return acc;
}, {});

function getSnippet(content: string, max = 120): string {
  const cleaned = content.replace(/```[\s\S]*?```/g, "").replace(/[#*`|:[\]-]/g, "").trim();
  return cleaned.length > max ? cleaned.slice(0, max) + "..." : cleaned;
}

export default function CheatsheetsIndex() {
  return (
    <div className="flex-1 py-12 px-6 max-w-6xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-8">All Cheatsheets</h1>
      <div className="space-y-10">
        {Object.entries(categories).map(([category, items]) => (
          <div key={category}>
            <h2 className="text-xl font-semibold mb-3 capitalize text-[var(--muted)]">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map(cheatsheet => (
                <Link
                  key={cheatsheet.slug}
                  href={`/cheatsheets/${cheatsheet.slug}`}
                  className="block p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-hover)] transition-colors"
                >
                  <h3 className="font-semibold mb-1">{cheatsheet.title}</h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">
                    {getSnippet(cheatsheet.content)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
