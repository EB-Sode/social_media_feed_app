/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Users, Hash, Image as ImageIcon } from "lucide-react";

import { getAuthenticatedClient } from "@/lib/graphql";
import { SEARCH_QUERY } from "@/lib/queries";

type Filter = "all" | "users" | "hashtags" | "posts";

export default function SearchClient() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const filter = (searchParams.get("type") as Filter) ?? "all";

  const [value, setValue] = useState(q);

  React.useEffect(() => {
    const run = async () => {
      if (!q.trim()) {
        setResults(null);
        setFetchError("");
        return;
      }

      try {
        setLoading(true);
        setFetchError("");

        const client = getAuthenticatedClient();
        const data = await client.request(SEARCH_QUERY, {
          q,
          type: filter === "all" ? "all" : filter,
          limit: 10,
        });

        setResults(data.search);
      } catch (e) {
        console.error(e);
        setFetchError("Search failed. Please try again.");
        setResults(null);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [q, filter]);

  const hint = useMemo(() => {
    if (!q) return "Search for users, hashtags, or posts.";
    return `Showing results for “${q}”.`;
  }, [q]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = value.trim();
    const base = next ? `/search?q=${encodeURIComponent(next)}` : "/search";
    router.push(filter !== "all" ? `${base}&type=${filter}` : base);
  };

  const clear = () => {
    setValue("");
    router.push("/search");
  };

  const setType = (t: Filter) => {
    const base = q ? `/search?q=${encodeURIComponent(q)}` : "/search";
    router.push(t !== "all" ? `${base}${q ? "&" : "?"}type=${t}` : base);
  };

  function Section({
    title,
    count,
    children,
  }: {
    title: string;
    count: number;
    children: React.ReactNode;
  }) {
    return (
      <div className="results-section">
        <div className="results-section-head">
          <span className="results-section-title">{title}</span>
          <span className="results-section-count">{count}</span>
        </div>
        {children}
      </div>
    );
  }

function EmptyLine({ text }: { text: string }) {
  return <p className="empty-line">{text}</p>;
}

  return (
    <div className="search-page fade-in">
      <div className="container search-container">
        <div className="card search-card slide-up">
          <div className="search-header">
            <h1 className="search-title">Search</h1>
            <p className="search-hint">{hint}</p>
          </div>

          <form onSubmit={onSubmit} className="search-form">
            {/* Segmented control */}
            <div className="segmented" role="tablist" aria-label="Search filters">
              <button
                type="button"
                role="tab"
                aria-selected={filter === "all"}
                className={`segmented-btn ${filter === "all" ? "is-active" : ""}`}
                onClick={() => setType("all")}
              >
                All
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={filter === "users"}
                className={`segmented-btn ${filter === "users" ? "is-active" : ""}`}
                onClick={() => setType("users")}
              >
                <Users size={16} className="segmented-icon" />
                Users
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={filter === "hashtags"}
                className={`segmented-btn ${filter === "hashtags" ? "is-active" : ""}`}
                onClick={() => setType("hashtags")}
              >
                <Hash size={16} className="segmented-icon" />
                Hashtags
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={filter === "posts"}
                className={`segmented-btn ${filter === "posts" ? "is-active" : ""}`}
                onClick={() => setType("posts")}
              >
                <ImageIcon size={16} className="segmented-icon" />
                Posts
              </button>
            </div>

            {/* Input */}
            <div className="search-field">
              <label className="search-label">Search query</label>

              <div className="search-input">
                <Search size={18} className="search-input-icon" />

                <input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="search-textbox"
                  placeholder="Try “@john”, “#travel”, or “sunset photo”…"
                  autoComplete="off"
                />

                {value && (
                  <button
                    type="button"
                    onClick={clear}
                    className="search-clear hover-surface"
                    aria-label="Clear search"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={!value.trim()}
            >
              Search
            </button>

            {/* Results area */}
          <div className="search-results-body">
            {fetchError && <p className="search-results-text">{fetchError}</p>}

            {loading && <p className="search-results-text">Searching…</p>}

            {!loading && !fetchError && q && results && (
              <div className="results-stack">
                {/* USERS */}
                {(filter === "all" || filter === "users") && (
                  <Section
                  title="Users found: " 
                  count={results?.users?.length ?? 0}>
                    {results?.users?.length ? (
                      <div className="results-list">
                        {results.users.map((u: any) => (
                          <button
                            key={u.id}
                            type="button"
                            className="result-row hover-surface"
                            onClick={() => router.push(`/profile/${u.id}`)}
                          >
                            <span className="result-primary">@{u.username}</span>
                            <span className="result-secondary">View profile</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <EmptyLine text="No users found." />
                    )}
                  </Section>
                )}

                {/* HASHTAGS */}
                {(filter === "all" || filter === "hashtags") && (
                  <Section title="Hashtags found: " count={results?.hashtags?.length ?? 0}>
                    {results?.hashtags?.length ? (
                      <div className="results-chips">
                        {results.hashtags.map((t: any) => (
                          <button
                            key={t.id}
                            type="button"
                            className="tag-chip hover-surface"
                            onClick={() => router.push(`/search?q=${encodeURIComponent("#" + t.name)}&type=posts`)}
                          >
                            #{t.name}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <EmptyLine text="No hashtags found." />
                    )}
                  </Section>
                )}

                {/* POSTS */}
                {(filter === "all" || filter === "posts") && (
                  <Section title="Posts found: " count={results?.posts?.length ?? 0}>
                    {results?.posts?.length ? (
                      <div className="results-list">
                        {results.posts.map((p: any) => (
                          <button
                            key={p.id}
                            type="button"
                            className="result-row hover-surface"
                            onClick={() => router.push(`/post/${p.id}`)}
                          >
                            <span className="result-primary">
                              {String(p.content || "").slice(0, 70)}
                              {p.content && String(p.content).length > 70 ? "…" : ""}
                            </span>
                            <span className="result-secondary">Open post</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <EmptyLine text="No posts found." />
                    )}
                  </Section>
                )}

                {/* TOTAL EMPTY */}
                {!results?.users?.length && !results?.hashtags?.length && !results?.posts?.length && (
                  <p className="search-results-text">No results found.</p>
                )}
              </div>
            )}

            {!loading && !fetchError && !q && (
              <p className="search-results-text">Start searching to see results.</p>
            )}
          </div>
          </form>
        </div>
      </div>
      <style jsx>{`
        .results-stack {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .results-section {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 2px 10px var(--shadow);
        }

        .results-section-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          border-bottom: 1px solid var(--border);
          background: var(--bg);
        }

        .results-section-title {
          font-family: "Poppins", sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: var(--text);
        }

        .results-section-count {
          font-size: 12px;
          font-weight: 800;
          color: var(--muted);
          padding: 4px 8px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: var(--surface);
        }

        .results-list {
          display: flex;
          flex-direction: column;
        }

        .result-row {
          width: 100%;
          text-align: left;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .result-primary {
          font-size: 14px;
          font-weight: 700;
          color: var(--text);
        }

        .result-secondary {
          font-size: 12px;
          font-weight: 600;
          color: var(--muted);
        }

        .results-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 12px;
        }

        .tag-chip {
          padding: 8px 10px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--text);
          font-weight: 800;
          font-size: 12px;
        }

        .empty-line {
          padding: 12px;
          font-size: 13px;
          color: var(--muted);
          text-align: center;
        }
      `}</style>
    </div>
  );
}