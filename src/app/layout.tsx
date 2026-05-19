import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "CSV Cleaner — Free Online CSV Editor. No Upload. Privacy First.",
  description:
    "Clean, transform, and convert CSV files entirely in your browser. No uploads, no servers, 100% private. Free for basic use.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-white text-zinc-900">
        <Toaster position="top-center" richColors />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
