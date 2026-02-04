"use client";

import React from "react";
import Link from "next/link";
import { Home, Compass, PlusSquare, User } from "lucide-react";

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="logo">SocialApp</h1>
        
        <nav className="nav" aria-label="Main navigation">
          <Link href="/" className="nav-link active" aria-label="Home">
            <Home size={22} strokeWidth={2} />
          </Link>
          <Link href="/explore" className="nav-link" aria-label="Explore">
            <Compass size={22} strokeWidth={2} />
          </Link>
          <Link href="/add" className="nav-link" aria-label="Add post">
            <PlusSquare size={22} strokeWidth={2} />
          </Link>
          <Link href="/profile" className="nav-link" aria-label="Profile">
            <User size={22} strokeWidth={2} />
          </Link>
        </nav>
      </div>

      <style jsx>{`
        .header {
          width: 100%;
          max-width: 390px;
          background: white;
          border-bottom: 1px solid rgba(43, 135, 97, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .header-content {
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          font-family: "Poppins", sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #2b8761;
          margin: 0;
          letter-spacing: -0.5px;
        }

        .nav {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .nav-link {
          padding: 8px 10px;
          color: #6b7280;
          border-radius: 10px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
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