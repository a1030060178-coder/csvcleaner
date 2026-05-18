import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSV Tools Blog — AI CSV Cleaner",
  description: "Tips and guides for working with CSV data. Privacy-first tools for data analysts and developers.",
};

const posts = [
  {
    slug: "csv-data-cleaning-mistakes",
    title: "The 7 Most Common CSV Data Cleaning Mistakes (And How AI Catches Them)",
    date: "2026-05-19",
    excerpt: "Mixed date formats, invisible characters, duplicate patterns — here's what AI scanning catches that manual review misses.",
  },
  {
    slug: "privacy-first-data-tools",
    title: "Why Privacy-First Data Tools Matter in 2026",
    date: "2026-05-19",
    excerpt: "GDPR fines hit record levels. Here's why browser-based, zero-upload data tools are replacing cloud converters.",
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-3">AI CSV Cleaner Blog</h1>
      <p className="text-zinc-500 mb-10">Smarter CSV workflows. Privacy first. Always.</p>
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug} className="border-b border-zinc-100 pb-8 last:border-0">
            <time className="text-xs text-zinc-400">{post.date}</time>
            <h2 className="text-xl font-semibold mt-1 mb-2">
              <Link href={`/blog/${post.slug}`} className="hover:text-violet-600 transition-colors">{post.title}</Link>
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed">{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className="text-violet-600 text-sm font-medium hover:underline mt-2 inline-block">Read more →</Link>
          </article>
        ))}
      </div>
    </div>
  );
}
