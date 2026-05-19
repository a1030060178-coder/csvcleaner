"use client";

import { useState, useCallback, useRef } from "react";
import Papa from "papaparse";
import { Upload, Download, Trash2, FileJson, Table2, Columns3, Scan, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

type Row = Record<string, string>;

export default function HomePage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const [selectedCols, setSelectedCols] = useState<Set<string>>(new Set());
  const [issues, setIssues] = useState<{ col: string; problem: string; count: number }[]>([]);
  const [scanned, setScanned] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const parseFile = useCallback((file: File) => {
    setFileName(file.name);
    Papa.parse<Row>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (r) => {
        const h = r.meta.fields || [];
        setHeaders(h);
        setSelectedCols(new Set(h));
        setRows(r.data as Row[]);
        toast.success(`Loaded ${r.data.length} rows, ${h.length} columns`);
      },
      error: () => toast.error("Failed to parse file"),
    });
  }, []);

  const toggleCol = (col: string) => {
    const next = new Set(selectedCols);
    next.has(col) ? next.delete(col) : next.add(col);
    setSelectedCols(next);
  };

  const filteredHeaders = headers.filter((h) => selectedCols.has(h));
  const filteredRows = rows.map((row) => {
    const r: Row = {};
    filteredHeaders.forEach((h) => {
      r[h] = row[h] ?? "";
    });
    return r;
  });

  function scanIssues() {
    const found: { col: string; problem: string; count: number }[] = [];
    for (const h of headers) {
      let empty = 0;
      let mixedTypes = false;
      let hasNum = false;
      let hasStr = false;
      const dateFormats = new Set<string>();
      for (const row of rows) {
        const v = (row[h] || "").trim();
        if (!v) { empty++; continue; }
        if (/^\d+(\.\d+)?$/.test(v)) hasNum = true;
        else if (/[a-zA-Z]/.test(v)) hasStr = true;
        const m = v.match(/^\d{2,4}[-\/]\d{1,2}[-\/]\d{1,4}$/);
        if (m) dateFormats.add(m[0].includes("-") ? "iso" : "us");
      }
      if (empty > rows.length * 0.3) found.push({ col: h, problem: `${empty} empty values (${Math.round(empty/rows.length*100)}%)`, count: empty });
      if (hasNum && hasStr) found.push({ col: h, problem: "Mixed numbers and text — may cause errors", count: 0 });
      if (dateFormats.size > 1) found.push({ col: h, problem: "Multiple date formats detected", count: 0 });
    }
    setIssues(found);
    setScanned(true);
  }

  function exportCSV() {
    const csv = Papa.unparse(filteredRows);
    downloadBlob(csv, fileName.replace(".csv", "") + "-cleaned.csv", "text/csv");
  }

  function exportJSON() {
    const json = JSON.stringify(filteredRows, null, 2);
    downloadBlob(json, fileName.replace(".csv", "") + ".json", "application/json");
  }

  function downloadBlob(data: string, name: string, mime: string) {
    const blob = new Blob([data], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          CSV Cleaner
        </h1>
        <p className="text-zinc-500 text-lg">
          Clean, filter, and convert CSV files — entirely in your browser.
          <br />
          <span className="text-sm text-emerald-600 font-medium">
            No upload. No server. 100% private.
          </span>
        </p>
      </header>

      {headers.length === 0 ? (
        <div
          className="border-2 border-dashed border-zinc-300 rounded-2xl p-16 text-center cursor-pointer hover:border-amber-400 transition-colors"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files[0];
            if (f) parseFile(f);
          }}
        >
          <Upload className="w-10 h-10 text-zinc-300 mx-auto mb-4" />
          <p className="text-zinc-500 mb-1">Drop a CSV file here or click to browse</p>
          <p className="text-xs text-zinc-400">.csv only. Stays on your device.</p>
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) parseFile(f);
            }}
          />
        </div>
      ) : (
        <>
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center gap-2 bg-zinc-100 rounded-lg px-3 py-2 text-sm">
              <Table2 className="w-4 h-4 text-zinc-400" />
              <span className="font-medium">{rows.length}</span> rows
            </div>
            <div className="flex items-center gap-2 bg-zinc-100 rounded-lg px-3 py-2 text-sm">
              <Columns3 className="w-4 h-4 text-zinc-400" />
              <span className="font-medium">{filteredHeaders.length}</span> cols
            </div>
            <div className="flex-1" />
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 bg-emerald-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-emerald-700 transition"
            >
              <Download className="w-4 h-4" /> CSV
            </button>
            <button
              onClick={exportJSON}
              className="flex items-center gap-2 bg-zinc-800 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-zinc-900 transition"
            >
              <FileJson className="w-4 h-4" /> JSON
            </button>
            <button
              onClick={() => {
                setRows([]);
                setHeaders([]);
                setFileName("");
              }}
              className="flex items-center gap-2 text-red-500 rounded-lg px-3 py-2 text-sm hover:bg-red-50 transition"
            >
              <Trash2 className="w-4 h-4" /> Reset
            </button>
          </div>

          {/* Column toggles */}
          <div className="flex flex-wrap gap-2 mb-6">
            {headers.map((h) => (
              <label
                key={h}
                className={`text-xs px-2.5 py-1.5 rounded-full cursor-pointer border transition ${
                  selectedCols.has(h)
                    ? "bg-amber-50 border-amber-300 text-amber-800"
                    : "bg-white border-zinc-200 text-zinc-400 line-through"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={selectedCols.has(h)}
                  onChange={() => toggleCol(h)}
                />
                {h}
              </label>
            ))}
            <button
              onClick={scanIssues}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 hover:bg-violet-100 transition font-medium"
            >
              <Scan className="w-3 h-3" /> AI Scan
            </button>
          </div>

          {/* AI Scan Results */}
          {scanned && (
            <div className="mb-6 border border-violet-200 bg-violet-50/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                {issues.length === 0 ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                )}
                <span className="font-semibold text-sm">
                  {issues.length === 0
                    ? "No issues detected — your data looks clean!"
                    : `Found ${issues.length} potential issue${issues.length > 1 ? "s" : ""}`}
                </span>
              </div>
              {issues.length > 0 && (
                <ul className="space-y-2">
                  {issues.map((issue, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm bg-white rounded-lg p-2.5 border border-violet-100">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-medium">{issue.col}</span>:{" "}
                        <span className="text-zinc-600">{issue.problem}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Table */}
          <div className="border border-zinc-200 rounded-xl overflow-auto max-h-[60vh]">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 sticky top-0">
                <tr>
                  {filteredHeaders.map((h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-2 font-medium text-zinc-500 whitespace-nowrap border-b"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows.slice(0, 500).map((row, i) => (
                  <tr key={i} className="hover:bg-zinc-50">
                    {filteredHeaders.map((h) => (
                      <td key={h} className="px-3 py-1.5 border-b border-zinc-50 whitespace-nowrap max-w-[300px] truncate">
                        {row[h]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredRows.length > 500 && (
              <p className="text-center text-xs text-zinc-400 py-3 bg-zinc-50">
                Showing 500 of {filteredRows.length} rows. Pro unlocks all rows.
              </p>
            )}
          </div>
        </>
      )}

      {/* Features */}
      <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="border border-zinc-200 rounded-xl p-6">
          <h3 className="font-semibold mb-1">Free</h3>
          <p className="text-sm text-zinc-500">Basic CSV editing, up to 500 rows, column filtering, CSV/JSON export</p>
          <p className="text-2xl font-bold mt-3">$0</p>
        </div>
        <div className="border-2 border-amber-300 bg-amber-50 rounded-xl p-6">
          <h3 className="font-semibold mb-1">Pro</h3>
          <p className="text-sm text-zinc-500">Unlimited rows, Excel support, AI data cleaning, batch processing</p>
          <p className="text-2xl font-bold mt-3">$12/mo</p>
        </div>
        <div className="border border-zinc-200 rounded-xl p-6">
          <h3 className="font-semibold mb-1">Team</h3>
          <p className="text-sm text-zinc-500">Everything in Pro, shared workspaces, API access, priority support</p>
          <p className="text-2xl font-bold mt-3">$49/mo</p>
        </div>
      </section>

      <footer className="text-center mt-16 py-8 text-xs text-zinc-400 space-y-2">
        <p>All processing happens in your browser. We never see your data.</p>
        <p><a href="https://ko-fi.com/penn662500" target="_blank" className="text-zinc-500 hover:text-violet-600 underline">☕ Support CSV Cleaner on Ko-fi</a></p>
      </footer>
    </div>
  );
}
