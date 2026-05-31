import { cheatsheets } from "@/data/cheatsheets";
import type { Metadata } from "next";
import CheatsheetContent from "@/components/CheatsheetContent";

export async function generateStaticParams() {
  return cheatsheets.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sheet = cheatsheets.find(c => c.slug === slug);
  return {
    title: sheet ? `${sheet.title} — devref.one` : "Not Found",
  };
}

export default async function CheatsheetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cheatsheet = cheatsheets.find(c => c.slug === slug);

  if (!cheatsheet) {
    const { default: Link } = await import("next/link");
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Cheatsheet Not Found</h1>
          <Link href="/cheatsheets" className="text-blue-500 hover:underline">
            Browse all cheatsheets
          </Link>
        </div>
      </div>
    );
  }

  return <CheatsheetContent content={cheatsheet.content} slug={cheatsheet.slug} />;
}
