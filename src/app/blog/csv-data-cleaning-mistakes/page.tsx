import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "7 Most Common CSV Data Cleaning Mistakes — AI CSV Cleaner",
  description: "Mixed date formats, invisible characters, empty values — AI data scanning catches issues humans miss. Here are the 7 most common CSV problems.",
};

export default function Page() {
  return (
    <article className="max-w-2xl mx-auto px-6 py-16">
      <Link href="/blog" className="text-violet-600 text-sm hover:underline mb-4 inline-block">← Back to Blog</Link>
      <h1 className="text-3xl font-bold mb-2">The 7 Most Common CSV Data Cleaning Mistakes</h1>
      <p className="text-zinc-400 text-sm mb-8">May 19, 2026</p>
      <div className="prose prose-zinc max-w-none space-y-4 text-zinc-700 leading-relaxed">
        <p>Every data analyst has been burned by a dirty CSV. A missed duplicate, an invisible character, a date format that Excel "helpfully" auto-converted. Here are the 7 most common mistakes — and how AI-powered scanning catches them before they become problems.</p>

        <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-3">1. Mixed Date Formats</h2>
        <p>January 5th might be "01/05/2026" or "05/01/2026" depending on locale. When both formats appear in the same column, sorting and filtering break. Our AI scanner detects multiple date patterns in a single column.</p>

        <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-3">2. Invisible Characters</h2>
        <p>Non-breaking spaces, zero-width characters, and Unicode artifacts survive copy-paste and wreak havoc on matching and joins. Most manual reviews miss them entirely.</p>

        <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-3">3-7: More Gotchas</h2>
        <p>Trailing whitespace, mixed data types in a single column, empty values masquerading as "N/A" or "-", encoding issues, and header/body mismatches. A 30-second AI scan catches what an hour of manual review might miss.</p>

        <div className="bg-violet-50 border border-violet-200 rounded-xl p-6 mt-6 not-prose">
          <p className="font-semibold text-zinc-900 mb-2">Scan your CSV for free. All in your browser.</p>
          <Link href="/" className="inline-block bg-zinc-900 text-white rounded-lg px-6 py-3 font-medium hover:bg-zinc-800 transition">Try AI CSV Cleaner</Link>
        </div>
      </div>
    </article>
  );
}
