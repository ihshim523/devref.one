import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cheatsheets } from "@/data/cheatsheets";
import Sidebar from "@/components/Sidebar";
import MobileMenu from "@/components/MobileMenu";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const categories = cheatsheets.reduce<Record<string, { slug: string; title: string }[]>>((acc, c) => {
  (acc[c.category] ??= []).push({ slug: c.slug, title: c.title });
  return acc;
}, {});

export const metadata: Metadata = {
  title: "devref.one — Developer Cheatsheets",
  description: "Quick reference cheatsheets for developers — JavaScript, TypeScript, Python, Docker, Git and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Sidebar categories={categories} />
        <MobileMenu categories={categories} />
        <main className="md:ml-64 min-h-full flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
