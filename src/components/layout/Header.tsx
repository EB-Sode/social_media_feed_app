"use client";

import React from "react";
import Link from "next/link";
import { Home, Plus, Send } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";

type HeaderProps = {
  onCreatePost?: () => void; // ✅ makes Plus clickable when provided (Feed page)
  onOpenLikes?: () => void;  // optional
  onOpenMessages?: () => void; // optional
  profileHref?: string; // optional, default "/profile"
};

export default function Header({
  onCreatePost,
  onOpenMessages,
  profileHref = "/profile",
}: HeaderProps) {
  const pathname = usePathname();

  // simple active state
  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname?.startsWith(href));

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
            <Image
              src="/RB.png"
              alt="App logo"
              width={60}
              height={60}
              priority
            />
        </div>

        <div className="header-actions">
        
          {/* Messages */}
          <button
            className="header-btn"
            aria-label="Messages"
            onClick={onOpenMessages}
            type="button"
            disabled={!onOpenMessages}
            title={!onOpenMessages ? "Coming soon" : "Messages"}
          >
            <Send size={24} />
          </button>

          {/* Create Post (Plus) */}
          <button
            className="header-btn"
            aria-label="Create post"
            onClick={onCreatePost}
            type="button"
            disabled={!onCreatePost}
            title={!onCreatePost ? "Only available on Feed" : "Create post"}
          >
            <Plus size={24} />
          </button>

          {/* Nav icons (optional) */}
          <nav className="nav" aria-label="Main navigation">
            <Link
              href="/feed"
              className={`nav-link ${isActive("/feed") ? "active" : ""}`}
              aria-label="Home"
            >
              <Home size={22} strokeWidth={2} />
            </Link>
          </nav>
        </div>
      </div>

      <style jsx>{`
        .header {
          width: 100%;
          background: #70d686;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          padding: 2px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-left {
          display: flex;
          align-items: center;
        }

        .app-name {
          font-family: "Poppins", sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .header-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: #1f2937;
          cursor: pointer;
          border-radius: 8px;
          transition: background 0.2s ease;
        }

        .header-btn:hover:not(:disabled) {
          background: rgba(31, 41, 55, 0.1);
        }

        .header-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .header-btn :global(svg) {
          color: currentColor;
        }

        .nav {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-left: 6px;
        }

        .nav-link {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          border-radius: 10px;
          transition: all 0.2s ease;
        }

        .nav-link:hover {
          background: rgba(43, 135, 97, 0.08);
          color: #2b8761;
        }

        .nav-link.active {
          color: #2b8761;
          background: rgba(43, 135, 97, 0.1);
        }

        .nav-link :global(svg) {
          color: currentColor;
        }
      `}</style>
    </header>
  );
}
