"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Users, Hash, Image as ImageIcon } from "lucide-react";

export default function SearchClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const [value, setValue] = useState(q);

  // Keep local input in sync with URL query when it changes
  React.useEffect(() => {
    setValue(q);
  }, [q]);

  const pageWrap =
    "min-h-screen flex items-center justify-center bg-[#808080] p-5";
  const card =
    "w-full max-w-[520px] bg-[#b1f5bf] rounded-2xl px-10 py-12 shadow-[0_10px_40px_rgba(0,0,0,0.15)] max-[480px]:px-6 max-[480px]:py-8";
  const title =
    'font-["Poppins"] text-[32px] font-bold text-[#1f2937] text-center mb-4 max-[480px]:text-[28px]';

  const hint = useMemo(() => {
    if (!q) return "Search for users, hashtags, or posts.";
    return `Showing results for “${q}”.`;
  }, [q]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = value.trim();
    router.push(next ? `/search?q=${encodeURIComponent(next)}` : "/search");
  };

  const clear = () => {
    setValue("");
    router.push("/search");
  };

  return (
    <div className={pageWrap}>
      <div className={card}>
        <h1 className={title}>Search</h1>

        <p className="font-['Inter'] text-[15px] text-[#6b7280] text-center mb-8 leading-relaxed">
          {hint}
        </p>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label className="font-['Inter'] text-sm font-medium text-[#1f2937] block mb-2">
              Search query
            </label>

            <div className="flex items-center gap-2 rounded-xl bg-white/70 border border-black/10 px-3 py-3 focus-within:border-[#2B8761] focus-within:ring-4 focus-within:ring-[rgba(43,135,97,0.1)] transition">
              <Search size={18} className="text-[#1f2937]/60" />

              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full bg-transparent outline-none font-['Inter'] text-[15px] text-[#1f2937] placeholder:text-gray-400"
                placeholder="Type to search… (e.g. @john, #travel)"
                autoComplete="off"
              />

              {value && (
                <button
                  type="button"
                  onClick={clear}
                  className="p-1 rounded-md text-[#1f2937]/60 hover:text-[#1f2937] hover:bg-black/5 transition"
                  aria-label="Clear search"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#2B8761] text-white py-3 font-semibold font-['Poppins'] hover:bg-[#1F6949] transition disabled:opacity-60 disabled:cursor-not-allowed shadow-none hover:shadow-[0_6px_20px_rgba(43,135,97,0.3)] hover:-translate-y-[2px] transform"
            disabled={!value.trim()}
          >
            Search
          </button>

          {/* “Result type” quick filters (UI only — wire later) */}
          <div className="grid grid-cols-3 gap-3 mt-2">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl bg-white/70 border border-black/10 py-2 font-['Inter'] text-sm font-semibold text-[#1f2937] hover:bg-white transition"
            >
              <Users size={16} className="text-[#2B8761]" />
              Users
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl bg-white/70 border border-black/10 py-2 font-['Inter'] text-sm font-semibold text-[#1f2937] hover:bg-white transition"
            >
              <Hash size={16} className="text-[#2B8761]" />
              Hashtags
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl bg-white/70 border border-black/10 py-2 font-['Inter'] text-sm font-semibold text-[#1f2937] hover:bg-white transition"
            >
              <ImageIcon size={16} className="text-[#2B8761]" />
              Posts
            </button>
          </div>

          {/* Placeholder results area */}
          <div className="mt-6 rounded-2xl bg-white/60 border border-black/10 p-4">
            <p className="font-['Inter'] text-sm text-[#1f2937]/80 text-center">
              {q ? "Results will appear here." : "Start searching to see results."}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
