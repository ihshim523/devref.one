import { cheatsheets } from "@/data/cheatsheets";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";

const categories = cheatsheets.reduce<Record<string, typeof cheatsheets>>((acc, c) => {
  (acc[c.category] ??= []).push(c);
  return acc;
}, {});

function getSnippet(content: string, max = 120): string {
  const cleaned = content.replace(/```[\s\S]*?```/g, "").replace(/[#*`|:[\]-]/g, "").trim();
  return cleaned.length > max ? cleaned.slice(0, max) + "..." : cleaned;
}

export default function Home() {
  return (
    <div className="flex-1">
      <section className="py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
          devref<span className="text-blue-500">.one</span>
        </h1>
        <p className="text-lg text-[var(--muted)] mb-8 max-w-md mx-auto">
          Quick reference cheatsheets for developers
        </p>
        <div className="max-w-sm mx-auto mb-12">
          <SearchBar />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16 space-y-12">
        {Object.entries(categories).map(([category, items]) => (
          <div key={category}>
            <h2 className="text-xl font-semibold mb-4 capitalize">{category}</h2>
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
      </section>
    </div>
  );
}
